import { useSidebar } from "@/admin/context/SidebarContext";
import { useAuth } from "@/context/AuthContext"; // Import AuthContext
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  GridIcon,
  HorizontaLDots,
  TableIcon,
  UserCircleIcon,
  PlugInIcon,
  ChevronDownIcon,
  ListIcon,
  BoxCubeIcon,
  PageIcon,
  PieChartIcon,
} from "../../icons";
import { cn } from "@/utils";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } = useSidebar();
  const { user } = useAuth(); // Ambil data user
  const location = useLocation();

  // Daftar menu lengkap
  const allNavItems: NavItem[] = [
    { icon: <GridIcon fontSize={24} />, name: "Dashboard", path: "/admin" },
    { icon: <TableIcon fontSize={24} />, name: "Data Dataset", path: "/admin/datasets" },
    { icon: <ListIcon fontSize={24} />, name: "Kategori Data", path: "/admin/kategori" },
    { icon: <BoxCubeIcon fontSize={24} />, name: "Data Layer Spasial", path: "/admin/layers" },
    { icon: <PageIcon fontSize={24} />, name: "Berita & Agenda", path: "/admin/berita" },
    { icon: <UserCircleIcon fontSize={24} />, name: "Data Pengguna", path: "/admin/pengguna" },
    { icon: <PieChartIcon fontSize={24} />, name: "Data Instansi (SKPD)", path: "/admin/skpd" },
    { icon: <PlugInIcon fontSize={24} />, name: "Pengaturan Web", path: "/admin/pengaturan" },
  ];

  // Filter menu berdasarkan role
  const navItems = allNavItems.filter((item) => {
    if (user?.role === "operator") {
      // Operator tidak bisa akses Manajemen Pengguna & Pengaturan
      return !["Data Pengguna", "Pengaturan Web"].includes(item.name);
    }
    return true;
  });

  useEffect(() => {
    if (isMobileOpen) setIsMobileOpen(false);
  }, [location.pathname, isMobileOpen, setIsMobileOpen]);

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-1">
      {items.map((nav) => (
        <li key={nav.name}>
          {nav.path && (
            <Link
              to={nav.path}
              className={`group menu-item ${
                location.pathname === nav.path ? "menu-item-active" : "menu-item-inactive"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  location.pathname === nav.path ? "menu-item-icon-active" : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={cn(
        "fixed inset-s-0 top-0 z-50 flex h-screen flex-col border-e border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out xl:translate-x-0 xl:rtl:translate-x-0 dark:border-gray-800 dark:bg-gray-900",
        isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
      )}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("flex py-8", !isExpanded && !isHovered ? "xl:justify-center" : "justify-start")}>
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-2">
              <img className="h-8 w-auto" src="/images/logo-aceh.png" alt="Logo" />
              <span className="font-bold text-lg text-gray-800 dark:text-white">Geoportal Admin</span>
            </div>
          ) : (
            <img src="/images/logo-aceh.png" alt="Logo" className="h-8 w-auto" />
          )}
        </Link>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 flex text-xs leading-5 text-gray-400 uppercase ${!isExpanded && !isHovered ? "xl:justify-center" : "justify-start"}`}>
                {isExpanded || isHovered || isMobileOpen ? "MENU UTAMA" : <HorizontaLDots className="size-6" />}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;