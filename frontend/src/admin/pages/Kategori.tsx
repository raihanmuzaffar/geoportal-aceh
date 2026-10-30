import { useState, useEffect } from "react";
import PageMeta from "../components/common/PageMeta";
import { Plus, Pencil, Trash2, X, Loader2, AlertTriangle, RotateCcw } from "lucide-react";
import api from "../../api/axios";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  datasets_count: number;
}

const GOLD = "#B8902F";

export default function Kategori() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // State untuk form & modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", icon: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // State untuk dialog hapus
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchCategories = () => {
    setLoading(true);
    setLoadError(false);
    api
      .get("/categories")
      .then((res: any) => setCategories(res.data.data))
      .catch((err: any) => {
        console.error(err);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchCategories, []);

  // Tutup modal dengan tombol Escape
  useEffect(() => {
    if (!isModalOpen && !deleteTarget) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (!isSubmitting) setIsModalOpen(false);
      if (!isDeleting) setDeleteTarget(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen, deleteTarget, isSubmitting, isDeleting]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", icon: "" });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, icon: cat.icon || "" });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const payload = { name: formData.name, icon: formData.icon || null };
    const request = editingId ? api.put(`/categories/${editingId}`, payload) : api.post("/categories", payload);

    request
      .then(() => {
        setIsModalOpen(false);
        fetchCategories();
      })
      .catch((err: any) => {
        setErrorMsg(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
      })
      .finally(() => setIsSubmitting(false));
  };

  const openDelete = (cat: Category) => {
    setDeleteError("");
    setDeleteTarget(cat);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError("");
    api
      .delete(`/categories/${deleteTarget.id}`)
      .then(() => {
        setDeleteTarget(null);
        fetchCategories();
      })
      .catch((err: any) => {
        setDeleteError(err.response?.data?.message || "Gagal menghapus kategori.");
      })
      .finally(() => setIsDeleting(false));
  };

  const th = "px-5 py-3 text-[13px] font-semibold text-[#12355B] dark:text-gray-300";
  const input =
    "w-full rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 transition-shadow focus:border-[#1F5A99] focus:outline-none focus:ring-2 focus:ring-[#1F5A99]/25 dark:border-gray-700 dark:bg-gray-800 dark:text-white";
  const btnPrimary =
    "inline-flex items-center justify-center gap-2 rounded-sm bg-[#12355B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1F5A99] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8902F]";
  const btnSecondary =
    "rounded-sm border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8902F]";

  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap');
        @keyframes kt-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .kt-in { opacity: 0; animation: kt-in .4s ease-out forwards; }
        @keyframes kt-fade { from { opacity: 0; } to { opacity: 1; } }
        .kt-overlay { animation: kt-fade .18s ease-out; }
        @keyframes kt-modal { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
        .kt-modal { animation: kt-modal .2s ease-out; }
        @keyframes kt-pulse { 0%,100% { opacity: .45; } 50% { opacity: .9; } }
        .kt-skeleton { animation: kt-pulse 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .kt-in { animation: none; opacity: 1; }
          .kt-overlay, .kt-modal, .kt-skeleton { animation: none; }
        }
      `}</style>

      <PageMeta title="Manajemen Kategori | Geoportal Aceh" description="Kelola kategori data spasial" />

      {/* Header halaman */}
      <div
        className="mb-6 pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b-2"
        style={{ borderColor: GOLD }}
      >
        <div>
          <h2 className="text-[22px] font-bold text-[#12355B] dark:text-white">Manajemen Kategori</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Kelola kategori untuk pengelompokan data spasial.</p>
        </div>
        <button type="button" onClick={handleOpenAdd} className={btnPrimary}>
          <Plus className="w-4 h-4" /> Tambah kategori
        </button>
      </div>

      {loadError && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-3 rounded-md border border-red-200 border-l-4 border-l-red-700 bg-white px-4 py-3 text-sm text-gray-800 dark:bg-white/[0.03] dark:border-red-900 dark:text-gray-200"
        >
          <AlertTriangle className="w-4 h-4 flex-none text-red-700" />
          Data kategori gagal dimuat.
          <button
            type="button"
            onClick={fetchCategories}
            className="ml-auto flex items-center gap-1 font-semibold text-[#1F5A99] hover:underline dark:text-blue-300"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Muat ulang
          </button>
        </div>
      )}

      {/* Tabel */}
      <div className="kt-in rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-[15px] font-semibold text-[#12355B] dark:text-white">Daftar kategori</h3>
          {!loading && !loadError && (
            <span className="text-[13px] text-gray-600 dark:text-gray-400">
              {categories.length.toLocaleString("id-ID")} kategori
            </span>
          )}
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F5F8] dark:bg-white/[0.04] border-b border-gray-200 dark:border-gray-800">
                <th className={`${th} w-16`}>No</th>
                <th className={th}>Nama kategori</th>
                <th className={th}>Slug</th>
                <th className={th}>Dataset terkait</th>
                <th className={`${th} text-right`}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                [0, 1, 2, 3].map((i) => (
                  <tr key={i}>
                    {[8, 40, 30, 24, 16].map((w, j) => (
                      <td key={j} className="px-5 py-4">
                        <div
                          className="kt-skeleton h-4 rounded-sm bg-gray-200 dark:bg-gray-700"
                          style={{ width: `${w}%`, marginLeft: j === 4 ? "auto" : undefined }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-600 dark:text-gray-400">
                    {loadError ? "Tidak ada data yang dapat ditampilkan." : "Belum ada kategori."}
                  </td>
                </tr>
              ) : (
                categories.map((item, index) => (
                  <tr key={item.id} className="transition-colors hover:bg-[#F3F7FC] dark:hover:bg-white/[0.03]">
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400 tabular-nums">{index + 1}</td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-white/90">{item.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{item.slug}</td>
                    <td className="px-5 py-3 text-sm">
                      <span className="inline-flex rounded-sm border border-[#C9D6E6] bg-[#EEF3F9] px-2 py-0.5 text-xs font-medium text-[#12355B] dark:border-gray-700 dark:bg-white/5 dark:text-blue-200">
                        {item.datasets_count.toLocaleString("id-ID")} dataset
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          title="Edit"
                          aria-label={`Edit ${item.name}`}
                          className="p-2 rounded-sm text-[#1F5A99] transition-colors hover:bg-[#E8EEF6] dark:text-blue-300 dark:hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B8902F]"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDelete(item)}
                          title="Hapus"
                          aria-label={`Hapus ${item.name}`}
                          className="p-2 rounded-sm text-red-700 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B8902F]"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* MODAL FORM (Tambah / Edit) */}
      {isModalOpen && (
        <div
          className="kt-overlay fixed inset-0 z-[99999] flex items-center justify-center bg-[#0C2744]/60 px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) setIsModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="kt-form-title"
            className="kt-modal w-full max-w-md overflow-hidden rounded-md bg-white shadow-xl dark:bg-gray-900 border-t-[3px]"
            style={{ borderTopColor: GOLD }}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-800">
              <h3 id="kt-form-title" className="text-[16px] font-semibold text-[#12355B] dark:text-white">
                {editingId ? "Edit kategori" : "Tambah kategori"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Tutup"
                className="p-1 rounded-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-white/10 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              {errorMsg && (
                <div
                  role="alert"
                  className="mb-4 flex items-start gap-2 rounded-sm border border-red-200 border-l-4 border-l-red-700 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300"
                >
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-none" />
                  {errorMsg}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="kt-name" className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nama kategori <span className="text-red-700">*</span>
                </label>
                <input
                  id="kt-name"
                  type="text"
                  autoFocus
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Contoh: Batas Wilayah"
                  className={input}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="kt-icon" className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nama ikon <span className="font-normal text-gray-500">(opsional)</span>
                </label>
                <input
                  id="kt-icon"
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Contoh: map, bus, water"
                  className={input}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Gunakan nama ikon dari lucide-react.</p>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className={btnSecondary}>
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className={`${btnPrimary} min-w-[96px]`}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" aria-label="Menyimpan" /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG KONFIRMASI HAPUS */}
      {deleteTarget && (
        <div
          className="kt-overlay fixed inset-0 z-[99999] flex items-center justify-center bg-[#0C2744]/60 px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isDeleting) setDeleteTarget(null);
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="kt-del-title"
            className="kt-modal w-full max-w-sm overflow-hidden rounded-md bg-white shadow-xl dark:bg-gray-900 border-t-[3px] border-t-red-700"
          >
            <div className="p-5">
              <h3 id="kt-del-title" className="text-[16px] font-semibold text-gray-900 dark:text-white">
                Hapus kategori?
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Kategori <strong className="text-gray-800 dark:text-gray-200">{deleteTarget.name}</strong> akan dihapus
                dan tindakan ini tidak dapat dibatalkan.
              </p>
              {deleteError && (
                <div
                  role="alert"
                  className="mt-3 rounded-sm border border-red-200 border-l-4 border-l-red-700 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300"
                >
                  {deleteError}
                </div>
              )}
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setDeleteTarget(null)} disabled={isDeleting} className={btnSecondary}>
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="inline-flex min-w-[96px] items-center justify-center rounded-sm bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8902F]"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" aria-label="Menghapus" /> : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}