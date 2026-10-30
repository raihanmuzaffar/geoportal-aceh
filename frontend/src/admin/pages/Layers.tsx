import { useState, useEffect, useMemo, useRef } from "react";
import PageMeta from "../components/common/PageMeta";
import {
  Plus,
  Trash2,
  X,
  Loader2,
  Map,
  Search,
  Layers as LayersIcon,
  CheckCircle2,
  AlertTriangle,
  FileUp,
  FileJson,
} from "lucide-react";
import api from "../../api/axios";

interface LayerData {
  id: number;
  name: string;
  feature_count: number;
  dataset: { title: string } | null;
}

const GOLD = "#B8902F";
const NAVY = "#12355B";
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXT = [".json", ".geojson", ".txt"];

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export default function Layers() {
  const [layers, setLayers] = useState<LayerData[]>([]);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [notice, setNotice] = useState("");

  const [formData, setFormData] = useState({ name: "", dataset_id: "" });
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [deleteTarget, setDeleteTarget] = useState<LayerData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get("/layers"), api.get("/datasets")])
      .then(([resLayers, resDatasets]) => {
        setLayers(resLayers.data.data);
        setDatasets(resDatasets.data.data);
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  // Pesan sukses hilang sendiri
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return layers;
    return layers.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        (l.dataset?.title || "").toLowerCase().includes(q)
    );
  }, [layers, keyword]);

  const totalFeatures = useMemo(
    () => layers.reduce((sum, l) => sum + (l.feature_count || 0), 0),
    [layers]
  );

  const handleOpenAdd = () => {
    setFormData({ name: "", dataset_id: "" });
    setFile(null);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  // Validasi file sebelum diterima
  const acceptFile = (f: File | null) => {
    if (!f) {
      setFile(null);
      return;
    }
    const lower = f.name.toLowerCase();
    if (!ALLOWED_EXT.some((ext) => lower.endsWith(ext))) {
      setErrorMsg("Format file tidak didukung. Gunakan file .geojson atau .json.");
      setFile(null);
      return;
    }
    if (f.size > MAX_SIZE) {
      setErrorMsg("Ukuran file melebihi batas 10 MB.");
      setFile(null);
      return;
    }
    setErrorMsg("");
    setFile(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("File GeoJSON wajib diunggah.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const data = new FormData();
    data.append("name", formData.name);
    if (formData.dataset_id) data.append("dataset_id", formData.dataset_id);
    data.append("geojson_file", file);

    api
      .post("/layers", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setIsModalOpen(false);
        setFormData({ name: "", dataset_id: "" });
        setFile(null);
        setNotice("GeoJSON berhasil diimpor ke database PostGIS.");
        loadData();
      })
      .catch((err: any) => {
        setErrorMsg(err.response?.data?.message || "Gagal mengunggah layer.");
      })
      .finally(() => setIsSubmitting(false));
  };

  const openDelete = (item: LayerData) => {
    setDeleteError("");
    setDeleteTarget(item);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError("");
    api
      .delete(`/layers/${deleteTarget.id}`)
      .then(() => {
        setDeleteTarget(null);
        setNotice("Layer berhasil dihapus.");
        loadData();
      })
      .catch((err: any) =>
        setDeleteError(err.response?.data?.message || "Gagal menghapus layer.")
      )
      .finally(() => setIsDeleting(false));
  };

  const th =
    "px-4 py-3 text-[13px] font-semibold text-white text-left whitespace-nowrap";
  const input =
    "w-full border border-gray-300 bg-white rounded-sm px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 " +
    "transition-colors focus:outline-none focus:border-[#12355B] focus:ring-2 focus:ring-[#12355B]/15 " +
    "dark:bg-gray-800 dark:border-gray-700 dark:text-white";
  const label = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}>
      <style>{`
        @keyframes ly-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ly-pop {
          from { opacity: 0; transform: translateY(8px) scale(.985) }
          to   { opacity: 1; transform: none }
        }
        @keyframes ly-notice {
          from { opacity: 0; transform: translateY(-4px) }
          to   { opacity: 1; transform: none }
        }
        .ly-overlay { animation: ly-fade .18s ease-out both }
        .ly-dialog  { animation: ly-pop .22s cubic-bezier(.2,.8,.2,1) both }
        .ly-row     { animation: ly-fade .35s ease-out both }
        .ly-notice  { animation: ly-notice .25s ease-out both }
        @media (prefers-reduced-motion: reduce) {
          .ly-overlay, .ly-dialog, .ly-row, .ly-notice { animation: none }
        }
      `}</style>

      <PageMeta title="Data Layer Spasial | Geoportal Aceh" description="Kelola data vektor" />

      {/* Jejak halaman */}
      <nav aria-label="Jejak halaman" className="mb-3 text-[13px] text-gray-500 dark:text-gray-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>Beranda</li>
          <li aria-hidden="true">/</li>
          <li>Master Data</li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-[#12355B] dark:text-white" aria-current="page">
            Layer Spasial
          </li>
        </ol>
      </nav>

      {/* Judul halaman */}
      <div
        className="mb-5 flex flex-col gap-4 border-b-2 pb-4 sm:flex-row sm:items-end sm:justify-between"
        style={{ borderColor: GOLD }}
      >
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-white"
            style={{ backgroundColor: NAVY }}
          >
            <LayersIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[22px] font-bold leading-tight text-[#12355B] dark:text-white">
              Data Layer Spasial
            </h2>
            <p className="mt-1 max-w-xl text-sm text-gray-600 dark:text-gray-400">
              Unggah file GeoJSON untuk ditampilkan pada peta WebGIS.
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#12355B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1F5A99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8902F] focus-visible:ring-offset-2 active:translate-y-px"
        >
          <Plus className="h-4 w-4" /> Unggah layer
        </button>
      </div>

      {/* Notifikasi sukses */}
      {notice && (
        <div
          role="status"
          className="ly-notice mb-4 flex items-center gap-2 rounded-sm border border-green-300 bg-green-50 px-4 py-2.5 text-sm text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="flex-1">{notice}</span>
          <button
            onClick={() => setNotice("")}
            aria-label="Tutup pemberitahuan"
            className="rounded-sm p-0.5 text-green-700 hover:bg-green-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Ringkasan */}
      <div className="mb-4 grid grid-cols-1 overflow-hidden rounded-sm border border-gray-200 bg-white sm:grid-cols-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-l-4 px-5 py-3" style={{ borderColor: NAVY }}>
          <p className="text-[13px] text-gray-500 dark:text-gray-400">Jumlah layer</p>
          <p className="text-xl font-bold text-[#12355B] dark:text-white">{layers.length}</p>
        </div>
        <div
          className="border-l-4 border-t border-t-gray-200 px-5 py-3 sm:border-t-0 dark:border-t-gray-800"
          style={{ borderLeftColor: GOLD }}
        >
          <p className="text-[13px] text-gray-500 dark:text-gray-400">Total fitur geometri</p>
          <p className="text-xl font-bold text-[#12355B] dark:text-white">
            {totalFeatures.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-2 border-b border-gray-200 bg-[#F3F5F8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-white/[0.04]">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loading
              ? "Memuat data..."
              : `Menampilkan ${filtered.length} dari ${layers.length} layer`}
          </p>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Cari nama layer atau dataset"
              aria-label="Cari layer"
              className={`${input} pl-9`}
            />
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr style={{ backgroundColor: NAVY }}>
                <th className={`${th} w-14 text-center`}>No.</th>
                <th className={th}>Nama layer</th>
                <th className={th}>Dataset terkait</th>
                <th className={`${th} text-right`}>Jumlah fitur</th>
                <th className={th}>Status database</th>
                <th className={`${th} text-right`}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" style={{ color: NAVY }} />
                    Memuat data layer...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">
                    {layers.length === 0
                      ? "Belum ada layer spasial. Pilih “Unggah layer” untuk mengimpor file GeoJSON."
                      : "Tidak ada layer yang cocok dengan pencarian Anda."}
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{ animationDelay: `${Math.min(idx, 10) * 25}ms` }}
                    className="ly-row border-b border-gray-100 transition-colors odd:bg-white even:bg-[#F8FAFC] hover:bg-[#EAF1F9] dark:border-gray-800 dark:odd:bg-transparent dark:even:bg-white/[0.02] dark:hover:bg-white/[0.06]"
                  >
                    <td className="px-4 py-3 text-center text-sm text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white/90">
                      <div className="flex items-center gap-2">
                        <Map className="h-4 w-4 shrink-0 text-[#1F5A99]" />
                        {item.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {item.dataset?.title || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-sm tabular-nums text-gray-800 dark:text-white/90">
                      {item.feature_count.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-1.5 text-[13px] text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        Tersimpan di PostGIS
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <button
                        onClick={() => openDelete(item)}
                        title="Hapus"
                        aria-label={`Hapus ${item.name}`}
                        className="rounded-sm border border-transparent p-2 text-red-700 transition-colors hover:border-red-200 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal unggah */}
      {isModalOpen && (
        <div
          className="ly-overlay fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 px-4 py-8 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ly-form-title"
        >
          <div
            className="ly-dialog flex max-h-full w-full max-w-xl flex-col overflow-hidden rounded-sm border-t-4 bg-white shadow-xl dark:bg-gray-900"
            style={{ borderColor: GOLD }}
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#F3F5F8] px-6 py-4 dark:border-gray-800 dark:bg-white/[0.04]">
              <div>
                <h3 id="ly-form-title" className="text-lg font-bold text-[#12355B] dark:text-white">
                  Unggah layer baru
                </h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400">
                  Kolom bertanda <span className="text-red-600">*</span> wajib diisi.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Tutup"
                className="rounded-sm p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto p-6">
              {errorMsg && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div>
                <label htmlFor="ly-name" className={label}>
                  Nama layer <span className="text-red-600">*</span>
                </label>
                <input
                  id="ly-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={input}
                  placeholder="Contoh: Batas Desa Aceh 2026"
                />
              </div>

              <div>
                <label htmlFor="ly-dataset" className={label}>
                  Tautkan ke dataset <span className="font-normal text-gray-500">(opsional)</span>
                </label>
                <select
                  id="ly-dataset"
                  value={formData.dataset_id}
                  onChange={(e) => setFormData({ ...formData, dataset_id: e.target.value })}
                  className={input}
                >
                  <option value="">Tidak ditautkan</option>
                  {datasets.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className={label}>
                  File GeoJSON <span className="text-red-600">*</span>
                </span>
                <input
                  ref={fileRef}
                  id="ly-file"
                  type="file"
                  accept=".json,.geojson,.txt"
                  className="sr-only"
                  onChange={(e) => acceptFile(e.target.files ? e.target.files[0] : null)}
                />
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    acceptFile(e.dataTransfer.files?.[0] || null);
                  }}
                  className={`flex flex-col items-center justify-center gap-2 rounded-sm border border-dashed px-4 py-6 text-center transition-colors ${
                    dragOver
                      ? "border-[#12355B] bg-[#EAF1F9]"
                      : "border-gray-300 bg-[#F8FAFC] dark:border-gray-700 dark:bg-gray-800/50"
                  }`}
                >
                  {file ? (
                    <div className="flex items-center gap-3 text-left">
                      <FileJson className="h-8 w-8 shrink-0 text-[#1F5A99]" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800 dark:text-white">
                          {file.name}
                        </p>
                        <p className="text-[13px] text-gray-500">{formatSize(file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                        className="ml-2 rounded-sm border border-gray-300 bg-white px-3 py-1 text-[13px] font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        Ganti
                      </button>
                    </div>
                  ) : (
                    <>
                      <FileUp className="h-6 w-6 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Seret file ke sini atau
                      </p>
                      <label
                        htmlFor="ly-file"
                        className="cursor-pointer rounded-sm border border-[#12355B] bg-white px-4 py-1.5 text-sm font-semibold text-[#12355B] transition-colors hover:bg-[#E8EEF6] focus-within:ring-2 focus-within:ring-[#12355B]"
                      >
                        Pilih file
                      </label>
                    </>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Format .geojson atau .json, ukuran maksimal 10 MB.
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-sm border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-sm bg-[#12355B] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1F5A99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Impor layer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog konfirmasi hapus */}
      {deleteTarget && (
        <div
          className="ly-overlay fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-[2px]"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="ly-del-title"
        >
          <div className="ly-dialog w-full max-w-md overflow-hidden rounded-sm border-t-4 border-red-700 bg-white shadow-xl dark:bg-gray-900">
            <div className="flex gap-3 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 id="ly-del-title" className="text-base font-bold text-gray-900 dark:text-white">
                  Hapus layer ini?
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">{deleteTarget.name}</span> akan dihapus, termasuk{" "}
                  {deleteTarget.feature_count.toLocaleString("id-ID")} fitur geometri di PostGIS.
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                {deleteError && (
                  <p role="alert" className="mt-3 rounded-sm border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                    {deleteError}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 bg-[#F8FAFC] px-6 py-3 dark:border-gray-800 dark:bg-white/[0.03]">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-sm border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex min-w-[96px] items-center justify-center rounded-sm bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}