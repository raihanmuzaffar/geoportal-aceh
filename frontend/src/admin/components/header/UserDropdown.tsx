import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "@/context/AuthContext"; // Sesuaikan path jika perlu (misal ../../../context/AuthContext)
import { User, Settings, LifeBuoy, LogOut } from "lucide-react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Fungsi untuk menangani klik logout
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    closeDropdown();
    logout();
  };

  // Mengambil huruf pertama dari nama untuk avatar fallback
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="me-3 h-11 w-11 overflow-hidden rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
          {/* Ganti src dengan path gambar Anda, atau biarkan inisial jika gambar tidak ada */}
          <img 
            src="/images/user/owner.png" 
            alt="User" 
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="absolute text-sm">{initial}</span>
        </span>

        <span className="me-1 block text-theme-sm font-medium">
          {user?.name || "Admin"}
        </span>
        <svg
          className={`stroke-gray-500 transition-transform duration-200 dark:stroke-gray-400 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-4 flex w-64 flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900 z-[9999]"
      >
        {/* Header User Info */}
        <div className="border-b border-gray-200 pb-3 mb-2 dark:border-gray-800">
          <span className="block text-sm font-semibold text-gray-800 dark:text-white">
            {user?.name || "Super Admin"}
          </span>
          <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
            {user?.email || "admin@acehprov.go.id"}
          </span>
          <span className="mt-1 inline-block bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 uppercase">
            {user?.role || "Super Admin"}
          </span>
        </div>

        {/* Menu Items */}
        <ul className="flex flex-col gap-1 pb-3">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/admin/profile"
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <User className="w-4 h-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Profil Saya
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/admin/pengaturan-akun"
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <Settings className="w-4 h-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Pengaturan Akun
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/kontak"
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <LifeBuoy className="w-4 h-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Bantuan & Dukungan
            </DropdownItem>
          </li>
        </ul>

        {/* Tombol Logout */}
        <div className="border-t border-gray-200 pt-2 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar Sistem
          </button>
        </div>
      </Dropdown>
    </div>
  );
}