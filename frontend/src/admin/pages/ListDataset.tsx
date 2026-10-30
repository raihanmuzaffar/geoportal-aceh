import { useState, useEffect } from "react";
import PageMeta from "../components/common/PageMeta";
import { Plus, Pencil, Trash2, AlertTriangle, RotateCcw, X, Loader2 } from "lucide-react";
import api from "../../api/axios";

interface Dataset {
  id: number;
  title: string;
  skpd: { name: string };
  category: { name: string };
  is_published: boolean;
  created_at: string;
}

const GOLD = "#B8902F";
const NAVY = "#12355B";

export default function ListDataset() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [skpds, setSkpds] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // State untuk Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    skpd_id: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(false);
    
    // Mengambil data dataset, SKPD, dan Kategori secara paralel
    Promise.all([
      api.get("/datasets"),
      api.get("/skpd"),
      api.get("/categories")
    ])
      .then(([resDatasets, resSkpds, resCategories]) => {
        setDatasets(resDatasets.data.data);
        setSkpds(resSkpds.data.data);
        setCategories(resCategories.data.data);
      })
      .catch((err: any) => {
        console.error("Gagal mengambil data:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  // Proses Simpan Dataset
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category_id", formData.category_id);
    data.append("skpd_id", formData.skpd_id);
    if (thumbnail) data.append("thumbnail", thumbnail);

    api.post("/datasets", data, {
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then(() => {
        setIsModalOpen(false);
        setFormData({ title: "", description: "", category_id: "", skpd_id: "" });
        setThumbnail(null);
        loadData(); // Refresh tabel
      })
      .catch((err: any) => {
        setErrorMsg(err.response?.data?.message || "Gagal menyimpan dataset.");
      })
      .finally(() => setIsSubmitting(false));
  };

  // Proses Hapus Dataset
  const handleDelete = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus dataset ini?")) {
      api.delete(`/datasets/${id}`)
        .then(() => loadData())
        .catch((err: any) => alert(err.response?.data?.message || "Gagal menghapus dataset."));
    }
  };

  const th = "px-5 py-3 text-[13px] font-semibold text-[#12355B] dark:text-gray-300";

  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap');
        @keyframes ld-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .ld-in { opacity: 0; animation: ld-in .4s ease-out forwards; }
        @keyframes ld-pulse { 0%,100% { opacity: .45; } 50% { opacity: .9; } }
        .ld-skeleton { animation: ld-pulse 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ld-in { animation: none; opacity: 1; }
          .ld-skeleton { animation: none; }
        }
      `}</style>

      <PageMeta
        title="Manajemen Dataset | Geoportal Aceh"
        description="Halaman untuk mengelola data spasial Geoportal Aceh"
      />

      {/* Header halaman */}
      <div
        className="mb-6 pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b-2"
        style={{ borderColor: GOLD }}
      >
        <div>
          <h2 className="text-[22px] font-bold text-[#12355B] dark:text-white">Manajemen Dataset</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Kelola data spasial yang dipublikasikan oleh instansi.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#12355B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1F5A99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8902F]"
        >
          <Plus className="w-4 h-4" /> Tambah dataset
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-3 rounded-md border border-red-200 border-l-4 border-l-red-700 bg-white px-4 py-3 text-sm text-gray-800 dark:bg-white/[0.03] dark:border-red-900 dark:text-gray-200"
        >
          <AlertTriangle className="w-4 h-4 flex-none text-red-700" />
          Data dataset gagal dimuat.
          <button
            type="button"
            onClick={loadData}
            className="ml-auto flex items-center gap-1 font-semibold text-[#1F5A99] hover:underline dark:text-blue-300"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Muat ulang
          </button>
        </div>
      )}

      <div className="ld-in rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header tabel */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-[15px] font-semibold text-[#12355B] dark:text-white">Daftar dataset</h3>
          {!loading && !error && (
            <span className="text-[13px] text-gray-600 dark:text-gray-400">
              {datasets.length.toLocaleString("id-ID")} dataset
            </span>
          )}
        </div>

        {/* Tabel */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F5F8] dark:bg-white/[0.04] border-b border-gray-200 dark:border-gray-800">
                <th className={th}>Judul dataset</th>
                <th className={th}>SKPD</th>
                <th className={th}>Kategori</th>
                <th className={th}>Status</th>
                <th className={`${th} text-right`}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                [0, 1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    {[56, 28, 28, 24, 16].map((w, j) => (
                      <td key={j} className="px-5 py-4">
                        <div
                          className="ld-skeleton h-4 rounded-sm bg-gray-200 dark:bg-gray-700"
                          style={{ width: `${w}%`, marginLeft: j === 4 ? "auto" : undefined }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : datasets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-600 dark:text-gray-400">
                    {error ? "Tidak ada data yang dapat ditampilkan." : "Belum ada dataset."}
                  </td>
                </tr>
              ) : (
                datasets.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-[#F3F7FC] dark:hover:bg-white/[0.03]">
                    <td className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-white/90">{item.title}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{item.skpd?.name || "-"}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{item.category?.name || "-"}</td>
                    <td className="px-5 py-3 text-sm">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-medium ${
                          item.is_published
                            ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
                            : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-300"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${item.is_published ? "bg-green-600" : "bg-amber-600"}`}
                        />
                        {item.is_published ? "Dipublikasikan" : "Draf"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="Edit"
                          aria-label={`Edit ${item.title}`}
                          className="p-2 rounded-sm text-[#1F5A99] transition-colors hover:bg-[#E8EEF6] dark:text-blue-300 dark:hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B8902F]"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          title="Hapus"
                          aria-label={`Hapus ${item.title}`}
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

      {/* MODAL TAMBAH DATASET */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 py-8">
          <div className="bg-white dark:bg-gray-900 rounded-md shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-full border-t-4" style={{ borderColor: GOLD }}>
            
            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <h3 className="text-lg font-bold text-[#12355B] dark:text-white">Tambah Dataset Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Modal */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              
              {errorMsg && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-sm border border-red-200">{errorMsg}</div>}

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Judul Dataset <span className="text-red-500">*</span></label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-[#12355B] dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="Misal: Batas Desa Aceh 2026" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Kategori <span className="text-red-500">*</span></label>
                  <select required value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} className="w-full border border-gray-300 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-[#12355B] dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <option value="">Pilih Kategori</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Instansi (SKPD) <span className="text-red-500">*</span></label>
                  <select required value={formData.skpd_id} onChange={(e) => setFormData({...formData, skpd_id: e.target.value})} className="w-full border border-gray-300 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-[#12355B] dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <option value="">Pilih Instansi</option>
                    {skpds.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Deskripsi <span className="text-red-500">*</span></label>
                <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-[#12355B] dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="Jelaskan detail data ini..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Thumbnail (Gambar Peta)</label>
                <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)} className="w-full border border-gray-300 rounded-sm px-4 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-[#E8EEF6] file:text-[#12355B] hover:file:bg-blue-100" />
                <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG. Maksimal 2MB.</p>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-[#12355B] hover:bg-[#1F5A99] rounded-sm min-w-[120px]">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Dataset"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}