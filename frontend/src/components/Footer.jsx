import { Link } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';

const navigasi = [
  { label: 'Beranda', to: '/' },
  { label: 'Katalog Data', to: '/katalog' },
  { label: 'WebGIS', to: '/webgis' },
  { label: 'Story Maps', to: '/story-maps' },
  { label: 'Berita', to: '/informasi' },
  { label: 'Kontak', to: '/kontak' },
];

const layanan = [
  { label: 'WebGIS Viewer', to: '/webgis' },
  { label: 'Katalog Dataset', to: '/katalog' },
  { label: 'Geoservis', to: '/layanan' },
  { label: 'SimonGeo', to: '/layanan' },
  { label: 'Roadmap', to: '/layanan' },
];

// TODO: Ganti href dengan alamat akun resmi Diskominfo Aceh
const sosmed = [
  { label: 'Instagram', icon: FaInstagram, href: 'https://instagram.com/diskominfoaceh' },
  { label: 'Facebook', icon: FaFacebookF, href: 'https://facebook.com/diskominfoaceh' },
  { label: 'Twitter', icon: FaTwitter, href: 'https://twitter.com/diskominfoaceh' },
  { label: 'YouTube', icon: FaYoutube, href: 'https://youtube.com/@diskominfoaceh' },
];

const linkClass =
  'text-[14px] text-slate-300 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300';

function FooterHeading({ children }) {
  return (
    <h2 className="mb-4 border-b border-white/15 pb-2 text-[15px] font-semibold text-white">
      {children}
    </h2>
  );
}

export default function Footer() {
  const keAtas = () => {
    const kurangiGerakan = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: kurangiGerakan ? 'auto' : 'smooth' });
  };

  return (
    <footer className="mt-auto border-t-4 border-blue-700 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          {/* Identitas */}
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/logo-aceh.png"
                alt="Logo Aceh"
                className="h-12 w-auto opacity-90"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="leading-tight">
                <span className="block text-[18px] font-bold tracking-wide text-white">
                  GEOPORTAL ACEH
                </span>
                <span className="block text-[12px] text-slate-400">Pemerintah Aceh</span>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-slate-300">
              Satu Pintu, Satu Data, Satu Informasi Aceh.
            </p>
          </div>

          {/* Navigasi */}
          <nav aria-label="Navigasi footer">
            <FooterHeading>Navigasi</FooterHeading>
            <ul className="space-y-2.5">
              {navigasi.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Layanan */}
          <nav aria-label="Layanan">
            <FooterHeading>Layanan</FooterHeading>
            <ul className="space-y-2.5">
              {layanan.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Pengelola & media sosial */}
          <div>
            <FooterHeading>Dikelola oleh</FooterHeading>
            <p className="text-[14px] leading-relaxed text-slate-300">
              Dinas Komunikasi, Informatika dan Persandian Aceh
            </p>

            <p className="mb-3 mt-6 text-[14px] text-slate-300">Ikuti kami</p>
            <ul className="flex gap-2">
              {sosmed.map(({ label, icon: Icon, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center border border-white/25 text-slate-200 transition-colors duration-200 hover:border-blue-700 hover:bg-blue-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Hak cipta */}
      <div className="bg-slate-950">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-4 text-[12px] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} Geoportal Aceh. Hak cipta dilindungi. Dikelola oleh
            Dinas Komunikasi, Informatika dan Persandian Aceh.
          </p>
          <button
            type="button"
            onClick={keAtas}
            className="inline-flex items-center gap-1 self-start text-slate-300 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 sm:self-auto"
          >
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
            Kembali ke atas
          </button>
        </div>
      </div>
    </footer>
  );
}