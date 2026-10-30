import { Link, useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Home, ArrowLeft } from 'lucide-react';

const GOLD = '#B8902F';
const NAVY = '#12355B';

/* Garis kontur tipis bertema peta, sama dengan halaman login dan Story Maps */
function ContourPattern() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 300 400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="#FFFFFF"
      strokeOpacity="0.09"
      strokeWidth="1.2"
    >
      <path d="M-20 330 C 40 280, 90 300, 140 250 S 240 190, 330 220" />
      <path d="M-20 360 C 50 310, 100 330, 150 280 S 250 220, 330 250" />
      <path d="M-20 390 C 60 340, 110 360, 160 310 S 260 250, 330 280" />
      <path d="M-20 300 C 30 250, 80 270, 130 220 S 230 160, 330 190" />
      <path d="M-20 270 C 20 220, 70 240, 120 190 S 220 130, 330 160" />
      <path d="M-20 240 C 10 190, 60 210, 110 160 S 210 100, 330 130" />
      <path d="M-20 210 C 0 160, 50 180, 100 130 S 200 70, 330 100" />
    </svg>
  );
}

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  // Jika tidak ada riwayat sebelumnya (misalnya tautan dibuka langsung), arahkan ke beranda
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-[#F3F5F8]"
      style={{ fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}
    >
      <style>{`
        @keyframes nf-rise { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
        .nf-rise { animation: nf-rise .5s cubic-bezier(.2,.8,.2,1) both }
        @media (prefers-reduced-motion: reduce) { .nf-rise { animation: none } }
      `}</style>

      <TopBar />
      <Navbar />

      <main className="flex flex-grow items-center justify-center px-4 py-12 md:py-20">
        <div
          className="nf-rise grid w-full max-w-3xl overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm md:grid-cols-[240px_1fr]"
        >
          {/* Panel kode kesalahan */}
          <div
            className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-8 text-white md:py-12"
            style={{ backgroundColor: NAVY, borderBottom: `4px solid ${GOLD}` }}
          >
            <ContourPattern />
            <p className="relative text-sm text-blue-100/80">Kode kesalahan</p>
            <p className="relative text-7xl font-bold leading-none md:text-8xl" aria-hidden="true">
              404
            </p>
          </div>

          {/* Keterangan dan tindakan */}
          <div className="p-7 md:p-10">
            <h1 className="mb-3 text-2xl font-bold text-[#12355B] md:text-[28px]">
              Halaman tidak ditemukan
            </h1>
            <p className="mb-5 text-[15px] leading-relaxed text-gray-600">
              Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau alamatnya salah
              ketik. Silakan kembali ke beranda atau ke halaman sebelumnya.
            </p>

            <div className="mb-7 rounded-sm border border-gray-200 border-l-4 bg-[#F8FAFC] px-4 py-2.5" style={{ borderLeftColor: GOLD }}>
              <p className="text-[13px] text-gray-500">Alamat yang dibuka</p>
              <p className="break-all text-sm font-semibold text-gray-800">{location.pathname}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#12355B] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1F5A99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8902F] focus-visible:ring-offset-2 active:translate-y-px"
              >
                <Home className="h-4 w-4" /> Kembali ke beranda
              </Link>

              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#12355B] bg-white px-6 py-2.5 text-sm font-semibold text-[#12355B] transition-colors hover:bg-[#EAF1F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8902F] focus-visible:ring-offset-2 active:translate-y-px"
              >
                <ArrowLeft className="h-4 w-4" /> Halaman sebelumnya
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}