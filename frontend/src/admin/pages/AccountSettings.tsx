import { useState } from "react";
import PageMeta from "../components/common/PageMeta";
import { Bell, Shield, MonitorSmartphone, LogOut, Check } from "lucide-react";

const GOLD = "#B8902F";

export default function AccountSettings() {
  // State untuk Toggle Notifikasi
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    newDatasets: true,
    systemAlerts: false,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const cardClass = "rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]";
  const headerClass = "flex items-center gap-2 px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-[#F8F9FA] dark:bg-white/[0.02]";
  const titleClass = "font-bold text-[#12355B] dark:text-white";

  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}>
      <PageMeta title="Pengaturan Akun | Geoportal Aceh" description="Preferensi dan keamanan akun" />

      {/* Header Halaman */}
      <div className="mb-6 pb-4 border-b-2" style={{ borderColor: GOLD }}>
        <h2 className="text-[22px] font-bold text-[#12355B] dark:text-white">Pengaturan Akun</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Kelola preferensi notifikasi dan keamanan akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PREFERENSI NOTIFIKASI */}
        <div className={cardClass}>
          <div className={headerClass}>
            <Bell className="w-5 h-5 text-[#12355B] dark:text-blue-400" />
            <h3 className={titleClass}>Preferensi Notifikasi</h3>
          </div>
          
          <div className="p-6 space-y-5">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Pembaruan Email</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Terima ringkasan aktivitas mingguan via email.</p>
              </div>
              <button 
                onClick={() => handleToggle("emailUpdates")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.emailUpdates ? 'bg-[#12355B]' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.emailUpdates ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Dataset Baru</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Dapatkan notifikasi saat ada dataset baru diunggah.</p>
              </div>
              <button 
                onClick={() => handleToggle("newDatasets")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.newDatasets ? 'bg-[#12355B]' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.newDatasets ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Peringatan Sistem</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Notifikasi terkait pemeliharaan server atau pembaruan sistem.</p>
              </div>
              <button 
                onClick={() => handleToggle("systemAlerts")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.systemAlerts ? 'bg-[#12355B]' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.systemAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* KEAMANAN AKUN */}
        <div className="flex flex-col gap-6">
          <div className={cardClass}>
            <div className={headerClass}>
              <Shield className="w-5 h-5 text-[#12355B] dark:text-blue-400" />
              <h3 className={titleClass}>Keamanan</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Sesi Login</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Anda saat ini masuk dari perangkat ini.</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                  <Check className="w-3 h-3" /> Aktif
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Logout dari Semua Perangkat</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mengakhiri semua sesi login Anda yang lain.</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* INFO PERANGKAT */}
          <div className={cardClass}>
            <div className={headerClass}>
              <MonitorSmartphone className="w-5 h-5 text-[#12355B] dark:text-blue-400" />
              <h3 className={titleClass}>Perangkat Terhubung</h3>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <MonitorSmartphone className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Chrome di Linux (Fedora)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Banda Aceh, Indonesia • Sesi Saat Ini</p>
                  <p className="text-xs font-medium text-[#12355B] dark:text-blue-400 mt-2">IP: 127.0.0.1 (Localhost)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}