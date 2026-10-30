import { useState } from "react";
import PageMeta from "../components/common/PageMeta";
import { useAuth } from "@/context/AuthContext";
import api from "../../api/axios";
import { User, Lock, Loader2, Save } from "lucide-react";

const GOLD = "#B8902F";
const NAVY = "#12355B";

export default function Profile() {
  const { user } = useAuth();
  
  // State untuk Data Diri
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  // State untuk Password
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  // Fungsi Simpan Profil
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg({ type: "", text: "" });

    api.put("/profile", profileData)
      .then((res: any) => {
        setProfileMsg({ type: "success", text: res.data.message });
        // Opsional: Jika Anda ingin update context Auth di sini agar nama di header langsung berubah
        // window.location.reload(); 
      })
      .catch((err: any) => {
        setProfileMsg({ type: "error", text: err.response?.data?.message || "Gagal memperbarui profil." });
      })
      .finally(() => setIsSavingProfile(false));
  };

  // Fungsi Simpan Password
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPassword(true);
    setPasswordMsg({ type: "", text: "" });

    api.put("/profile/password", passwordData)
      .then((res: any) => {
        setPasswordMsg({ type: "success", text: res.data.message });
        setPasswordData({ current_password: "", new_password: "", new_password_confirmation: "" }); // Reset form
      })
      .catch((err: any) => {
        setPasswordMsg({ type: "error", text: err.response?.data?.message || "Gagal mengubah password." });
      })
      .finally(() => setIsSavingPassword(false));
  };

  const inputClass = "w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm focus:border-[#12355B] focus:outline-none focus:ring-1 focus:ring-[#12355B] dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-shadow";
  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}>
      <PageMeta title="Profil Saya | Geoportal Aceh" description="Pengaturan akun pengguna" />

      {/* Header Halaman */}
      <div className="mb-6 pb-4 border-b-2" style={{ borderColor: GOLD }}>
        <h2 className="text-[22px] font-bold text-[#12355B] dark:text-white">Pengaturan Profil</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Perbarui informasi akun dan keamanan Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* FORM 1: Data Diri */}
        <div className="rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-[#F8F9FA] dark:bg-white/[0.02]">
            <User className="w-5 h-5 text-[#12355B] dark:text-blue-400" />
            <h3 className="font-bold text-[#12355B] dark:text-white">Informasi Pribadi</h3>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
            {profileMsg.text && (
              <div className={`p-3 rounded-sm text-sm border ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                {profileMsg.text}
              </div>
            )}

            <div>
              <label className={labelClass}>Nama Lengkap</label>
              <input 
                type="text" 
                value={profileData.name} 
                onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                className={inputClass} 
                required 
              />
            </div>

            <div>
              <label className={labelClass}>Alamat Email</label>
              <input 
                type="email" 
                value={profileData.email} 
                onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
                className={inputClass} 
                required 
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSavingProfile}
                className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-[#12355B] hover:bg-[#1F5A99] rounded-sm transition-colors"
              >
                {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
              </button>
            </div>
          </form>
        </div>

        {/* FORM 2: Ganti Password */}
        <div className="rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-[#F8F9FA] dark:bg-white/[0.02]">
            <Lock className="w-5 h-5 text-[#12355B] dark:text-blue-400" />
            <h3 className="font-bold text-[#12355B] dark:text-white">Keamanan Akun</h3>
          </div>
          
          <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
            {passwordMsg.text && (
              <div className={`p-3 rounded-sm text-sm border ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                {passwordMsg.text}
              </div>
            )}

            <div>
              <label className={labelClass}>Password Saat Ini</label>
              <input 
                type="password" 
                value={passwordData.current_password} 
                onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})} 
                className={inputClass} 
                required 
                placeholder="Masukkan password lama"
              />
            </div>

            <div>
              <label className={labelClass}>Password Baru</label>
              <input 
                type="password" 
                value={passwordData.new_password} 
                onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})} 
                className={inputClass} 
                required 
                placeholder="Minimal 6 karakter"
              />
            </div>

            <div>
              <label className={labelClass}>Konfirmasi Password Baru</label>
              <input 
                type="password" 
                value={passwordData.new_password_confirmation} 
                onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})} 
                className={inputClass} 
                required 
                placeholder="Ketik ulang password baru"
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSavingPassword}
                className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-[#B8902F] hover:bg-[#9C7826] rounded-sm transition-colors"
              >
                {isSavingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Lock className="w-4 h-4" /> Ubah Password</>}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}