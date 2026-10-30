import { useState, useEffect, useMemo } from "react";
import PageMeta from "../components/common/PageMeta";
import {
  Plus,
  Trash2,
  X,
  Loader2,
  Search,
  Newspaper,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import api from "../../api/axios";

interface NewsData {
  id: number;
  title: string;
  type: "news" | "agenda";
  event_date: string | null;
  created_at: string;
  is_published: boolean;
}

type Filter = "all" | "news" | "agenda";

const GOLD = "#B8902F";
const NAVY = "#12355B";

const emptyForm = {
  title: "",
  content: "",
  type: "news",
  event_date: "",
};

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

export default function Berita() {
  const [newsList, setNewsList] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [notice, setNotice] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<NewsData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  const loadData = () => {
    setLoading(true);
    api
      .get("/news")
      .then((res: any) => setNewsList(res.data.data))
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  // Pesan sukses hilang sendiri
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const counts = useMemo(
    () => ({
      all: newsList.length,
      news: newsList.filter((n) => n.type === "news").length,
      agenda: newsList.filter((n) => n.type === "agenda").length,
    }),
    [newsList]
  );

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return newsList.filter((n) => {
      if (filter !== "all" && n.type !== filter) return false;
      if (q && !n.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [newsList, keyword, filter]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const isEdit = editingId !== null;
    const request = isEdit
      ? api.put(`/news/${editingId}`, formData)
      : api.post("/news", formData);

    request
      .then(() => {
        setIsModalOpen(false);
        setNotice(isEdit ? "Data berhasil diperbarui." : "Berhasil dipublikasikan.");
        loadData();
      })
      .catch((err: any) => {
        setErrorMsg(err.response?.data?.message || "Terjadi kesalahan.");
      })
      .finally(() => setIsSubmitting(false));
  };

  const openDelete = (item: NewsData) => {
    setDeleteError("");
    setDeleteTarget(item);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError("");
    api
      .delete(`/news/${deleteTarget.id}`)
      .then(() => {
        setDeleteTarget(null);
        setNotice("Data berhasil dihapus.");
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

  const tabs: { key: Filter; text: string }[] = [
    { key: "all", text: "Semua" },
    { key: "news", text: "Berita" },
    { key: "agenda", text: "Agenda" },
  ];

  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}>
      <style>{`
        @keyframes bt-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes bt-pop {
          from { opacity: 0; transform: translateY(8px) scale(.985) }
          to   { opacity: 1; transform: none }
        }
        @keyframes bt-notice {
          from { opacity: 0; transform: translateY(-4px) }
          to   { opacity: 1; transform: none }
        }
        .bt-overlay { animation: bt-fade .18s ease-out both }
        .bt-dialog  { animation: bt-pop .22s cubic-bezier(.2,.8,.2,1) both }
        .bt-row     { animation: bt-fade .35s ease-out both }
        .bt-notice  { animation: bt-notice .25s ease-out both }
        @media (prefers-reduced-motion: reduce) {
          .bt-overlay, .bt-dialog, .bt-row, .bt-notice { animation: none }
        }
      `}</style>

      <PageMeta title="Manajemen Berita | Geoportal Aceh" description="Kelola berita dan agenda" />

      {/* Jejak halaman */}
      <nav aria-label="Jejak halaman" className="mb-3 text-[13px] text-gray-500 dark:text-gray-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>Beranda</li>
          <li aria-hidden="true">/</li>
          <li>Konten</li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-[#12355B] dark:text-white" aria-current="page">
            Berita &amp; Agenda
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
            <Newspaper className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[22px] font-bold leading-tight text-[#12355B] dark:text-white">
              Berita &amp; Agenda
            </h2>
            <p className="mt-1 max-w-xl text-sm text-gray-600 dark:text-gray-400">
              Kelola informasi terkini dan jadwal kegiatan seputar data spasial.
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#12355B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1F5A99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8902F] focus-visible:ring-offset-2 active:translate-y-px"
        >
          <Plus className="h-4 w-4" /> Buat berita
        </button>
      </div>

      {/* Notifikasi sukses */}
      {notice && (
        <div
          role="status"
          className="bt-notice mb-4 flex items-center gap-2 rounded-sm border border-green-300 bg-green-50 px-4 py-2.5 text-sm text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
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

      {/* Tabel */}
      <div className="overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Filter & pencarian */}
        <div className="flex flex-col gap-3 border-b border-gray-200 bg-[#F3F5F8] px-4 pt-3 dark:border-gray-800 dark:bg-white/[0.04]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {loading
                ? "Memuat data..."
                : `Menampilkan ${filtered.length} dari ${newsList.length} data`}
            </p>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari judul"
                aria-label="Cari judul berita"
                className={`${input} pl-9`}
              />
            </div>
          </div>

          <div role="tablist" aria-label="Filter tipe" className="flex gap-1">
            {tabs.map((t) => {
              const active = filter === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(t.key)}
                  className={`-mb-px rounded-t-sm border border-b-0 px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12355B] ${
                    active
                      ? "border-gray-200 border-t-2 bg-white text-[#12355B] dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 hover:text-[#12355B] dark:hover:text-white"
                  }`}
                  style={active ? { borderTopColor: GOLD } : undefined}
                >
                  {t.text}
                  <span className="ml-1.5 text-xs font-normal text-gray-400">{counts[t.key]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr style={{ backgroundColor: NAVY }}>
                <th className={`${th} w-14 text-center`}>No.</th>
                <th className={th}>Judul</th>
                <th className={th}>Tipe</th>
                <th className={th}>Status</th>
                <th className={th}>Tanggal dibuat</th>
                <th className={`${th} text-right`}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" style={{ color: NAVY }} />
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">
                    {newsList.length === 0
                      ? "Belum ada berita. Pilih “Buat berita” untuk menambahkan."
                      : "Tidak ada data yang cocok dengan pencarian atau filter."}
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{ animationDelay: `${Math.min(idx, 10) * 25}ms` }}
                    className="bt-row border-b border-gray-100 transition-colors odd:bg-white even:bg-[#F8FAFC] hover:bg-[#EAF1F9] dark:border-gray-800 dark:odd:bg-transparent dark:even:bg-white/[0.02] dark:hover:bg-white/[0.06]"
                  >
                    <td className="px-4 py-3 text-center text-sm text-gray-500">{idx + 1}</td>
                    <td className="max-w-md px-4 py-3 text-sm">
                      <div className="font-semibold text-gray-800 dark:text-white/90">{item.title}</div>
                      {item.type === "agenda" && item.event_date && (
                        <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Pelaksanaan {formatDate(item.event_date)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-sm border px-2 py-0.5 text-xs font-semibold ${
                          item.type === "news"
                            ? "border-blue-200 bg-blue-50 text-[#12355B]"
                            : "border-amber-300 bg-amber-50 text-amber-800"
                        }`}
                      >
                        {item.type === "news" ? "Berita" : "Agenda"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[13px] ${
                          item.is_published ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.is_published ? "bg-green-600" : "bg-gray-400"
                          }`}
                        />
                        {item.is_published ? "Terbit" : "Draf"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openDelete(item)}
                          title="Hapus"
                          aria-label={`Hapus ${item.title}`}
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

      {/* Modal buat / ubah */}
      {isModalOpen && (
        <div
          className="bt-overlay fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 px-4 py-8 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bt-form-title"
        >
          <div
            className="bt-dialog flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-sm border-t-4 bg-white shadow-xl dark:bg-gray-900"
            style={{ borderColor: GOLD }}
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#F3F5F8] px-6 py-4 dark:border-gray-800 dark:bg-white/[0.04]">
              <div>
                <h3 id="bt-form-title" className="text-lg font-bold text-[#12355B] dark:text-white">
                  {editingId ? "Ubah berita" : "Buat berita baru"}
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
                <label htmlFor="bt-title" className={label}>
                  Judul <span className="text-red-600">*</span>
                </label>
                <input
                  id="bt-title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={input}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="bt-type" className={label}>
                    Tipe <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="bt-type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={input}
                  >
                    <option value="news">Berita</option>
                    <option value="agenda">Agenda</option>
                  </select>
                </div>
                {formData.type === "agenda" && (
                  <div className="bt-notice">
                    <label htmlFor="bt-date" className={label}>Tanggal pelaksanaan</label>
                    <input
                      id="bt-date"
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className={input}
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="bt-content" className={label}>
                  Isi <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="bt-content"
                  required
                  rows={7}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className={`${input} resize-y leading-relaxed`}
                  placeholder="Tulis isi berita di sini..."
                />
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
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publikasikan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog konfirmasi hapus */}
      {deleteTarget && (
        <div
          className="bt-overlay fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-[2px]"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="bt-del-title"
        >
          <div className="bt-dialog w-full max-w-md overflow-hidden rounded-sm border-t-4 border-red-700 bg-white shadow-xl dark:bg-gray-900">
            <div className="flex gap-3 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 id="bt-del-title" className="text-base font-bold text-gray-900 dark:text-white">
                  Hapus {deleteTarget.type === "news" ? "berita" : "agenda"} ini?
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">{deleteTarget.title}</span> akan dihapus
                  permanen. Tindakan ini tidak dapat dibatalkan.
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