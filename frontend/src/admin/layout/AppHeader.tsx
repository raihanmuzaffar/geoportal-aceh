import React from "react";
import { useSidebar } from "@/admin/context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import { Menu } from "lucide-react";

const AppHeader: React.FC = () => {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    // Di layar kecil (mobile/tablet), gunakan toggleMobileSidebar
    if (window.innerWidth < 1024) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  };

  return (
    <header className="sticky top-0 z-40 flex w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900/95">
      <div className="flex grow items-center justify-between px-4 py-3 md:px-6">
        {/* Sisi Kiri: Tombol Toggle Sidebar */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="hidden sm:inline-block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Panel Administrasi
          </span>
        </div>

        {/* Sisi Kanan: Theme Toggle, Notifikasi, User Dropdown */}
        <div className="flex items-center gap-3">
          <ThemeToggleButton />
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;