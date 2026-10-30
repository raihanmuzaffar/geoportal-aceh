import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "@/admin/context/SidebarContext";
import { cn } from "@/utils";
import {
  LayoutDashboard,
  Database,
  FolderTree,
  Layers,
  Newspaper,
  Users,
  Building2,
  Settings,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  name: string;
  path: string;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    items: [{ icon: <LayoutDashboard size={19} />, name: "Dashboard", path: "/admin" }],
  },
  {
    title: "Master data",
    items: [
      { icon: <Database size={19} />, name: "Data Dataset", path: "/admin/datasets" },
      { icon: <FolderTree size={19} />, name: "Kategori Data", path: "/admin/kategori" },
      { icon: <Layers size={19} />, name: "Data Layer Spasial", path: "/admin/layers" },
      { icon: <Building2 size={19} />, name: "Data Instansi (SKPD)", path: "/admin/skpd" },
    ],
  },
  {
    title: "Konten",
    items: [{ icon: <Newspaper size={19} />, name: "Berita & Agenda", path: "/admin/berita" }],
  },
  {
    title: "Pengaturan",
    items: [
      { icon: <Users size={19} />, name: "Data Pengguna", path: "/admin/pengguna" },
      { icon: <Settings size={19} />, name: "Pengaturan Web", path: "/admin/pengaturan" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } = useSidebar();
  const location = useLocation();

  // Tutup menu mobile hanya saat pindah halaman
  useEffect(() => {
    setIsMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const showLabel = isExpanded || isHovered || isMobileOpen;

  const isActivePath = (path: string) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <aside
      aria-label="Navigasi admin"
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#12355B] text-white transition-all duration-300 dark:bg-[#0D2744]",
        "border-r border-[#0D2744] dark:border-gray-800",
        isExpanded || isMobileOpen ? "w-64" : isHovered ? "w-64" : "w-20",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Area logo */}
      <div className="flex h-20 shrink-0 items-center border-b-2 border-[#B8902F] px-4">
        <Link
          to="/admin"
          className="flex min-w-0 items-center gap-3 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8902F]"
          aria-label="Geoportal Aceh, ke dashboard"
        >
          <span className="flex h-11 w-12 shrink-0 items-center justify-center rounded-sm bg-white p-1.5">
            <img src="/images/logo-aceh.svg" alt="" className="h-full w-auto" />
          </span>
          {showLabel && (
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[15px] font-bold">Geoportal Aceh</span>
              <span className="block truncate text-xs text-blue-100/70">Panel administrasi</span>
            </span>
          )}
        </Link>
      </div>

      {/* Area menu */}
      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-5" : ""}>
            {group.title &&
              (showLabel ? (
                <div className="mb-1.5 px-3 text-[13px] font-semibold text-[#D9B65C]">
                  {group.title}
                </div>
              ) : (
                <div className="mx-3 mb-2 border-t border-white/15" aria-hidden="true" />
              ))}

            <ul className="space-y-0.5">
              {group.items.map((nav) => {
                const active = isActivePath(nav.path);
                return (
                  <li key={nav.path}>
                    <Link
                      to={nav.path}
                      title={nav.name}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8902F]",
                        active
                          ? "bg-white/12 font-semibold text-white"
                          : "font-medium text-blue-100/85 hover:bg-white/[0.07] hover:text-white",
                        !showLabel && "justify-center"
                      )}
                    >
                      {/* Penanda halaman aktif */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-y-1.5 left-0 w-[3px] rounded-r-sm bg-[#B8902F] transition-opacity duration-200",
                          active ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className={cn("shrink-0", active ? "text-[#D9B65C]" : "text-blue-200/70")}>
                        {nav.icon}
                      </span>
                      {showLabel && <span className="truncate whitespace-nowrap">{nav.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Kaki sidebar */}
      {showLabel && (
        <div className="shrink-0 border-t border-white/10 px-5 py-3 text-xs leading-snug text-blue-100/60">
          Pemerintah Aceh
          <br />
          Sistem Informasi Geospasial
        </div>
      )}

      <style>{`
        .sidebar-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.2) transparent; }
        .sidebar-scroll::-webkit-scrollbar { width: 6px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.2); border-radius: 3px; }
        @media (prefers-reduced-motion: reduce) {
          aside[aria-label="Navigasi admin"], aside[aria-label="Navigasi admin"] * { transition: none !important; }
        }
      `}</style>
    </aside>
  );
};

export default AppSidebar;