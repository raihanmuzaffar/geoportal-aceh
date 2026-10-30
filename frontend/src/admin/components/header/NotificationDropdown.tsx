import { useState } from "react";
import { Bell } from "lucide-react";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Tombol Lonceng */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full h-10 w-10 hover:text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <Bell className="w-5 h-5" />
        {/* Titik Merah Notifikasi */}
        <span className="absolute right-0 top-0 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </span>
      </button>

      {/* Dropdown Notifikasi */}
      {isOpen && (
        <>
          {/* Overlay klik luar */}
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute right-0 mt-3 flex w-72 flex-col rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 z-40">
            <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
              <h5 className="text-sm font-semibold text-gray-800 dark:text-white">Notifikasi</h5>
            </div>
            
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Belum ada notifikasi baru saat ini.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}