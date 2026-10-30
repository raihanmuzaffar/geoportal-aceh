import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const submenuGeoportal = [
  { label: 'Pusat Layanan', to: '/geoportal' },
  { label: 'WebGIS Viewer', to: '/webgis' },
  { label: 'Katalog Dataset', to: '/katalog' },
  { label: 'Story Maps', to: '/story-maps' },
];

const menuUtama = [
  { label: 'Home', to: '/' },
  { label: 'Katalog', to: '/katalog' },
  { label: 'Geoportal', to: '/geoportal', children: submenuGeoportal },
  { label: 'WebGIS', to: '/webgis' },
  { label: 'JIGN', to: '/jign' },
  { label: 'Informasi', to: '/informasi' },
  { label: 'Layanan', to: '/layanan' },
  { label: 'Kontak', to: '/kontak' },
];

const tanggal = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState(false);

  // Tutup menu mobile saat pindah halaman
  useEffect(() => {
    setMobileOpen(false);
    setMobileSub(false);
  }, [pathname]);

  const isActive = (to) => to !== '#' && pathname === to;

  // Garis bawah tipis yang "tumbuh" dari kiri saat hover / aktif
  const linkBase =
    'relative inline-flex h-full items-center text-[14px] font-medium transition-colors duration-200 ' +
    "after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:bg-blue-700 " +
    'after:transition-transform after:duration-200 motion-reduce:after:transition-none';

  const linkClass = (to) =>
    `${linkBase} ${
      isActive(to)
        ? 'text-blue-800 after:scale-x-100'
        : 'text-slate-700 hover:text-blue-800 after:scale-x-0 hover:after:scale-x-100'
    }`;

  return (
    // z-[9999] memastikan Navbar berada di atas peta Leaflet
    <header className="sticky top-0 z-[9999] bg-white shadow-[0_1px_0_0_rgba(15,23,42,0.08)]">
      {/* Bar atas: identitas instansi */}
      <div className="bg-blue-900 text-blue-50 relative z-[10000]">
        <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-4 text-[12px] sm:px-6 lg:px-8">
          <span className="truncate">Portal Resmi Data Geospasial Pemerintah Aceh</span>
          <span className="hidden text-blue-200 sm:block">{tanggal}</span>
        </div>
      </div>

      {/* Bar utama */}
      <nav aria-label="Navigasi utama" className="border-b border-slate-200">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-stretch justify-between">
            {/* Logo & nama */}
            <Link to="/" className="flex items-center gap-3 py-2">
              <img src="/images/logo-aceh.svg" alt="Logo Aceh" className="h-11 w-auto" />
              <div className="leading-tight">
                <span className="block text-[20px] font-bold tracking-wide text-slate-900">
                  GEOPORTAL ACEH
                </span>
                <span className="block text-[12px] text-slate-500">Pemerintah Aceh</span>
              </div>
            </Link>

            {/* Menu desktop */}
            <ul className="hidden items-stretch gap-7 lg:flex">
              {menuUtama.map((item) =>
                item.children ? (
                  <li key={item.label} className="group relative flex items-stretch">
                    <button
                      type="button"
                      aria-haspopup="true"
                      className={`${linkClass(item.to)} gap-1`}
                    >
                      {item.label}
                      <ChevronDown
                        aria-hidden="true"
                        className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                      />
                    </button>

                    {/* Dropdown dengan z-index tinggi */}
                    <div
                      className="invisible absolute left-0 top-full z-[10000] w-60 translate-y-1 border border-slate-200 border-t-[3px] border-t-blue-700 bg-white opacity-0 shadow-md transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transition-none"
                    >
                      <ul className="py-1">
                        {item.children.map((sub) => (
                          <li key={sub.label}>
                            <Link
                              to={sub.to}
                              className="block border-l-[3px] border-transparent px-4 py-2.5 text-[14px] text-slate-700 transition-colors duration-150 hover:border-blue-700 hover:bg-slate-50 hover:text-blue-800"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={item.label} className="flex items-stretch">
                    <Link
                      to={item.to}
                      aria-current={isActive(item.to) ? 'page' : undefined}
                      className={linkClass(item.to)}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>

            {/* Tombol menu mobile */}
            <button
              type="button"
              className="my-auto p-2 text-slate-700 lg:hidden"
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
            mobileOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <ul className="border-t border-slate-200 bg-white">
              {menuUtama.map((item) =>
                item.children ? (
                  <li key={item.label} className="border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => setMobileSub((v) => !v)}
                      aria-expanded={mobileSub}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-[15px] font-medium text-slate-700"
                    >
                      {item.label}
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          mobileSub ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${
                        mobileSub ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <ul className="overflow-hidden bg-slate-50">
                        {item.children.map((sub) => (
                          <li key={sub.label}>
                            <Link
                              to={sub.to}
                              className="block px-8 py-2.5 text-[14px] text-slate-600 hover:text-blue-800"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={item.label} className="border-b border-slate-100">
                    <Link
                      to={item.to}
                      aria-current={isActive(item.to) ? 'page' : undefined}
                      className={`block border-l-[3px] px-4 py-3 text-[15px] font-medium ${
                        isActive(item.to)
                          ? 'border-blue-700 bg-blue-50 text-blue-800'
                          : 'border-transparent text-slate-700'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}