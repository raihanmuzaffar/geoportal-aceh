import { useState, useEffect } from "react";
import PageMeta from "../components/common/PageMeta";
import { Save, Loader2, Settings, Phone, Globe } from "lucide-react";
import api from "../../api/axios";

const GOLD = "#B8902F";
const NAVY = "#12355B";

export default function Pengaturan() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // State Form
  const [formData, setFormData] = useState({
    site_name: "",
    site_description: "",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    instagram_url: "",
    facebook_url: "",
    twitter_url: "",
    youtube_url: "",
  });

  // Ambil data pengaturan saat halaman dimuat
  useEffect(() => {
    api.get("/settings")
      .then((res) => {
        if (res.data.data) {
          setFormData((prev) => ({
            ...prev,
            ...res.data.data, // Timpa nilai default dengan data dari database
          }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    api.post("/settings", formData)
      .then((res) => {
        setMessage({ type: "success", text: "Pengaturan berhasil disimpan!" });
        setSaving(false);
      })
      .catch((err) => {
        setMessage({ type: "error", text: "Gagal menyimpan pengaturan." });
        setSaving(false);
      });
  };

  const inputClass = "w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm focus:border-[#12355B] focus:outline-none focus:ring-1 focus:ring-[#12355B] dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-shadow";
  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

  if (loading) return <div className="p-10 text-center text-gray-500">Memuat pengaturan...</div>;

  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}>
      <PageMeta title="Pengaturan Web | Geoportal Aceh" description="Konfigurasi portal" />

      {/* Header Halaman */}
      <div className="mb-6 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-3 border-b-2" style={{ borderColor: GOLD }}>
        <div>
          <h2 className="text-[22px] font-bold text-[#12355B] dark:text-white">Pengaturan Web</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Konfigurasi identitas portal, kontak, dan tautan media sosial.</p>
        </div>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-sm border text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* KARTU 1: Identitas Website */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.02]">
            <Settings className="w-5 h-5 text-[#12355B] dark:text-blue-400" />
            <h3 className="font-bold text-[#12355B] dark:text-white">Identitas Website</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Nama Website</label>
              <input type="text" name="site_name" value={formData.site_name} onChange={handleChange} className={inputClass} placeholder="Geoportal Aceh" />
            </div>
            <div>
              <label className={labelClass}>Deskripsi Singkat</label>
              <input type="text" name="site_description" value={formData.site_description} onChange={handleChange} className={inputClass} placeholder="Satu Data, Satu Informasi Aceh" />
            </div>
          </div>
        </div>

        {/* KARTU 2: Kontak Resmi */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.02]">
            <Phone className="w-5 h-5 text-[#12355B] dark:text-blue-400" />
            <h3 className="font-bold text-[#12355B] dark:text-white">Kontak & Alamat</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Email Resmi</label>
              <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} className={inputClass} placeholder="diskominfo@acehprov.go.id" />
            </div>
            <div>
              <label className={labelClass}>Nomor Telepon</label>
              <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} className={inputClass} placeholder="(0651) 123456" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Alamat Kantor</label>
              <textarea name="contact_address" value={formData.contact_address} onChange={handleChange} rows={3} className={inputClass} placeholder="Jl. Tgk. H. M. Daud Beureueh No. 25..."></textarea>
            </div>
          </div>
        </div>

        {/* KARTU 3: Media Sosial */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.02]">
            <Globe className="w-5 h-5 text-[#12355B] dark:text-blue-400" />
            <h3 className="font-bold text-[#12355B] dark:text-white">Tautan Media Sosial</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Instagram URL</label>
              <input type="url" name="instagram_url" value={formData.instagram_url} onChange={handleChange} className={inputClass} placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className={labelClass}>Facebook URL</label>
              <input type="url" name="facebook_url" value={formData.facebook_url} onChange={handleChange} className={inputClass} placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className={labelClass}>Twitter / X URL</label>
              <input type="url" name="twitter_url" value={formData.twitter_url} onChange={handleChange} className={inputClass} placeholder="https://twitter.com/..." />
            </div>
            <div>
              <label className={labelClass}>YouTube URL</label>
              <input type="url" name="youtube_url" value={formData.youtube_url} onChange={handleChange} className={inputClass} placeholder="https://youtube.com/..." />
            </div>
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 bg-[#12355B] hover:bg-[#1F5A99] text-white px-8 py-3 rounded-sm font-semibold transition-colors"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Simpan Pengaturan</>}
          </button>
        </div>

      </form>
    </div>
  );
}