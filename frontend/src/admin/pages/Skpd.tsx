import { useState, useEffect, useMemo } from "react";
import PageMeta from "../components/common/PageMeta";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Search,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import api from "../../api/axios";

interface SkpdData {
  id: number;
  name: string;
  short_name: string;
  email: string | null;
  phone: string | null;
  datasets_count: number;
}

const GOLD = "#B8902F";
const NAVY = "#12355B";

const emptyForm = {
  name: "",
  short_name: "",
  email: "",
  phone: "",
  address: "",
  logo_url: "",
};

export default function Skpd() {
  const [skpds, setSkpds] = useState<SkpdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [notice, setNotice] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<SkpdData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  const loadData = () => {
    setLoading(true);
    api
      .get("/skpd")
      .then((res: any) => setSkpds(res.data.data))
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  // Pesan sukses hilang sendiri setelah beberapa detik
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return skpds;
    return skpds.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.short_name.toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q)
    );
  }, [skpds, keyword]);

  const totalDataset = useMemo(
    () => skpds.reduce((sum, s) => sum + (s.datasets_count || 0), 0),
    [skpds]
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SkpdData) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      short_name: item.short_name,
      email: item.email || "",
      phone: item.phone || "",
      address: "", // Sesuaikan jika API mengembalikan address
      logo_url: "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const isEdit = editingId !== null;
    const request = isEdit
      ? api.put(`/skpd/${editingId}`, formData)
      : api.post("/skpd", formData);

    request
      .then(() => {
        setIsModalOpen(false);
        setNotice(
          isEdit
            ? "Data instansi berhasil diperbarui."
            : "Instansi baru berhasil ditambahkan."
        );
        loadData();
      })
      .catch((err: any) => {
        setErrorMsg(err.response?.data?.message || "Terjadi kesalahan.");
      })
      .finally(() => setIsSubmitting(false));
  };

  const openDelete = (item: SkpdData) => {
    setDeleteError("");
    setDeleteTarget(item);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError("");
    api
      .delete(`/skpd/${deleteTarget.id}`)
      .then(() => {
        setDeleteTarget(null);
        setNotice("Data instansi berhasil dihapus.");
        loadData();
      })
      .catch((err: any) =>
        setDeleteError(err.response?.data?.message || "Gagal menghapus data.")
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
        @keyframes skpd-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes skpd-pop {
          from { opacity: 0; transform: translateY(8px) scale(.985) }
          to   { opacity: 1; transform: none }
        }
        @keyframes skpd-row { from { opacity: 0 } to { opacity: 1 } }
        @keyframes skpd-notice {
          from { opacity: 0; transform: translateY(-4px) }
          to   { opacity: 1; transform: none }
        }
        .skpd-overlay { animation: skpd-fade .18s ease-out both }
        .skpd-dialog  { animation: skpd-pop .22s cubic-bezier(.2,.8,.2,1) both }
        .skpd-row     { animation: skpd-row .35s ease-out both }
        .skpd-notice  { animation: skpd-notice .25s ease-out both }
        @media (prefers-reduced-motion: reduce) {
          .skpd-overlay, .skpd-dialog, .skpd-row, .skpd-notice { animation: none }
        }
      `}</style>

      <PageMeta
        title="Data Instansi (SKPD) | Geoportal Aceh"
        description="Kelola instansi penghasil data"
      />

      {/* Jejak halaman */}
      <nav aria-label="Jejak halaman" className="mb-3 text-[13px] text-gray-500 dark:text-gray-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>Beranda</li>
          <li aria-hidden="true">/</li>
          <li>Master Data</li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-[#12355B] dark:text-white" aria-current="page">
            Instansi (SKPD)
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
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[22px] font-bold leading-tight text-[#12355B] dark:text-white">
              Data Instansi (SKPD)
            </h2>
            <p className="mt-1 max-w-xl text-sm text-gray-600 dark:text-gray-400">
              Daftar dinas dan badan yang memproduksi data spasial di lingkungan Pemerintah Aceh.
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#12355B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1F5A99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8902F] focus-visible:ring-offset-2 active:translate-y-px"
        >
          <Plus className="h-4 w-4" /> Tambah instansi
        </button>
      </div>

      {/* Notifikasi sukses */}
      {notice && (
        <div
          role="status"
          className="skpd-notice mb-4 flex items-center gap-2 rounded-sm border border-green-300 bg-green-50 px-4 py-2.5 text-sm text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
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
          <p className="text-[13px] text-gray-500 dark:text-gray-400">Jumlah instansi terdaftar</p>
          <p className="text-xl font-bold text-[#12355B] dark:text-white">{skpds.length}</p>
        </div>
        <div className="border-l-4 border-t border-t-gray-200 px-5 py-3 sm:border-t-0 dark:border-t-gray-800" style={{ borderLeftColor: GOLD }}>
          <p className="text-[13px] text-gray-500 dark:text-gray-400">Total dataset dari seluruh instansi</p>
          <p className="text-xl font-bold text-[#12355B] dark:text-white">{totalDataset}</p>
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Bilah pencarian */}
        <div className="flex flex-col gap-2 border-b border-gray-200 bg-[#F3F5F8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-white/[0.04]">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loading
              ? "Memuat data..."
              : `Menampilkan ${filtered.length} dari ${skpds.length} instansi`}
          </p>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Cari nama, singkatan, atau email"
              aria-label="Cari instansi"
              className={`${input} pl-9`}
            />
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr style={{ backgroundColor: NAVY }}>
                <th className={`${th} w-14 text-center`}>No.</th>
                <th className={th}>Nama instansi</th>
                <th className={th}>Singkatan</th>
                <th className={th}>Kontak</th>
                <th className={`${th} text-center`}>Dataset</th>
                <th className={`${th} text-right`}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" style={{ color: NAVY }} />
                    Memuat data instansi...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">
                    {skpds.length === 0
                      ? "Belum ada data instansi. Pilih “Tambah instansi” untuk memulai."
                      : "Tidak ada instansi yang cocok dengan pencarian Anda."}
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{ animationDelay: `${Math.min(idx, 10) * 25}ms` }}
                    className="skpd-row border-b border-gray-100 transition-colors odd:bg-white even:bg-[#F8FAFC] hover:bg-[#EAF1F9] dark:border-gray-800 dark:odd:bg-transparent dark:even:bg-white/[0.02] dark:hover:bg-white/[0.06]"
                  >
                    <td className="px-4 py-3 text-center text-sm text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white/90">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {item.short_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {item.email || item.phone ? (
                        <div className="space-y-0.5">
                          {item.email && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-gray-400" />
                              {item.email}
                            </div>
                          )}
                          {item.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-gray-400" />
                              {item.phone}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      <span className="inline-flex min-w-[64px] justify-center rounded-sm border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#12355B] dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-300">
                        {item.datasets_count} data
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Ubah"
                          aria-label={`Ubah ${item.short_name}`}
                          className="rounded-sm border border-transparent p-2 text-[#1F5A99] transition-colors hover:border-[#C9D8EA] hover:bg-[#E8EEF6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5A99]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDelete(item)}
                          title="Hapus"
                          aria-label={`Hapus ${item.short_name}`}
                          className="rounded-sm border border-transparent p-2 text-red-700 transition-colors hover:border-red-200 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal tambah / ubah */}
      {isModalOpen && (
        <div
          className="skpd-overlay fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 px-4 py-8 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="skpd-form-title"
        >
          <div
            className="skpd-dialog flex max-h-full w-full max-w-xl flex-col overflow-hidden rounded-sm border-t-4 bg-white shadow-xl dark:bg-gray-900"
            style={{ borderColor: GOLD }}
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#F3F5F8] px-6 py-4 dark:border-gray-800 dark:bg-white/[0.04]">
              <div>
                <h3 id="skpd-form-title" className="text-lg font-bold text-[#12355B] dark:text-white">
                  {editingId ? "Ubah data instansi" : "Tambah instansi"}
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="skpd-name" className={label}>
                    Nama lengkap instansi <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="skpd-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={input}
                    placeholder="Dinas Komunikasi dan Informatika"
                  />
                </div>
                <div>
                  <label htmlFor="skpd-short" className={label}>
                    Singkatan <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="skpd-short"
                    type="text"
                    required
                    value={formData.short_name}
                    onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                    className={input}
                    placeholder="Diskominfo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="skpd-email" className={label}>Email</label>
                  <input
                    id="skpd-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={input}
                    placeholder="dinas@acehprov.go.id"
                  />
                </div>
                <div>
                  <label htmlFor="skpd-phone" className={label}>Telepon</label>
                  <input
                    id="skpd-phone"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={input}
                    placeholder="(0651) 123456"
                  />
                </div>
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
                  className="inline-flex min-w-[110px] items-center justify-center rounded-sm bg-[#12355B] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1F5A99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog konfirmasi hapus */}
      {deleteTarget && (
        <div
          className="skpd-overlay fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-[2px]"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="skpd-del-title"
        >
          <div className="skpd-dialog w-full max-w-md overflow-hidden rounded-sm border-t-4 border-red-700 bg-white shadow-xl dark:bg-gray-900">
            <div className="flex gap-3 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 id="skpd-del-title" className="text-base font-bold text-gray-900 dark:text-white">
                  Hapus instansi ini?
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">{deleteTarget.name}</span> akan dihapus dari daftar.
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