import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowLeft, Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const GOLD = '#B8902F';
const NAVY = '#12355B';

// Garis kontur tipis sebagai latar panel kiri (tema peta/geospasial)
function ContourPattern() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 600 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="#FFFFFF"
      strokeOpacity="0.07"
      strokeWidth="1.2"
    >
      <path d="M-40 620 C 80 520, 180 560, 280 480 S 480 380, 660 440" />
      <path d="M-40 660 C 90 570, 190 610, 290 530 S 490 430, 660 490" />
      <path d="M-40 700 C 100 620, 200 660, 300 580 S 500 480, 660 540" />
      <path d="M-40 740 C 110 670, 210 710, 310 630 S 510 530, 660 590" />
      <path d="M-40 780 C 120 720, 220 760, 320 680 S 520 580, 660 640" />
      <path d="M-40 580 C 70 470, 170 510, 270 430 S 470 330, 660 390" />
      <path d="M-40 540 C 60 420, 160 460, 260 380 S 460 280, 660 340" />
      <path d="M-40 500 C 50 370, 150 410, 250 330 S 450 230, 660 290" />
      <path d="M120 -20 C 200 100, 120 200, 220 280 S 330 380, 240 480" />
      <path d="M90 -20 C 170 100, 90 200, 190 280 S 300 380, 210 480" />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Memanggil fungsi login dari AuthContext
      const result = await login(email, password);

      if (result.success) {
        navigate('/admin'); // Arahkan ke dashboard admin
      } else {
        setError(result.message || 'Email atau kata sandi tidak sesuai.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server. Coba lagi beberapa saat.');
      setIsLoading(false);
    }
  };

  const input =
    'w-full rounded-sm border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-800 placeholder:text-gray-400 ' +
    'transition-colors focus:border-[#12355B] focus:outline-none focus:ring-2 focus:ring-[#12355B]/15';

  return (
    <div
      className="flex min-h-screen flex-col bg-white lg:flex-row"
      style={{ fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}
    >
      <style>{`
        @keyframes lg-rise {
          from { opacity: 0; transform: translateY(10px) }
          to   { opacity: 1; transform: none }
        }
        @keyframes lg-fade { from { opacity: 0 } to { opacity: 1 } }
        .lg-rise { animation: lg-rise .5s cubic-bezier(.2,.8,.2,1) both }
        .lg-fade { animation: lg-fade .6s ease-out both }
        @media (prefers-reduced-motion: reduce) {
          .lg-rise, .lg-fade { animation: none }
        }
      `}</style>

      {/* Panel identitas */}
      <aside
        className="relative flex shrink-0 flex-col justify-between overflow-hidden px-6 py-6 text-white lg:w-[44%] lg:max-w-[640px] lg:px-12 lg:py-10"
        style={{ backgroundColor: NAVY, borderBottom: `3px solid ${GOLD}` }}
      >
        <ContourPattern />

        <div className="relative flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-white p-1.5 lg:h-16 lg:w-16">
            <img src="/images/logo-aceh.svg" alt="Logo Provinsi Aceh" className="h-full w-auto" />
          </span>
          <div className="leading-tight">
            <p className="text-sm text-blue-100/80">Pemerintah Aceh</p>
            <p className="text-xl font-bold lg:text-2xl">Geoportal Aceh</p>
          </div>
        </div>

        <div className="relative my-10 hidden max-w-md lg:block lg-fade">
          <div className="mb-5 h-[3px] w-14" style={{ backgroundColor: GOLD }} />
          <h2 className="text-[28px] font-bold leading-snug">
            Portal data spasial dan informasi geospasial Aceh
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-blue-100/80">
            Panel ini digunakan petugas instansi untuk mengelola dataset, layer peta, dan
            publikasi informasi di lingkungan Pemerintah Aceh.
          </p>
        </div>

        <p className="relative hidden text-[13px] text-blue-100/60 lg:block">
          &copy; {new Date().getFullYear()} Pemerintah Aceh. Seluruh hak dilindungi.
        </p>
      </aside>

      {/* Panel formulir */}
      <main className="relative flex flex-1 items-center justify-center bg-[#F8FAFC] px-4 py-10 sm:px-8">
        <Link
          to="/"
          className="absolute left-4 top-5 flex items-center gap-2 rounded-sm text-sm font-medium text-gray-600 transition-colors hover:text-[#12355B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12355B] sm:left-8 sm:top-8"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
        </Link>

        <div className="lg-rise w-full max-w-md rounded-sm border border-gray-200 border-t-4 bg-white p-7 shadow-sm sm:p-9" style={{ borderTopColor: GOLD }}>
          <h1 className="text-[22px] font-bold text-[#12355B]">Masuk ke panel administrasi</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gunakan akun yang diberikan oleh administrator Anda.
          </p>

          {/* Pesan error */}
          {error && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulir */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@acehprov.go.id"
                  required
                  className={input}
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Kata sandi
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  required
                  className={`${input} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-gray-400 transition-colors hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12355B]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#12355B] py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1F5A99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8902F] focus-visible:ring-offset-2 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Memeriksa akun...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <p className="mt-6 border-t border-gray-100 pt-4 text-[13px] leading-relaxed text-gray-500">
            Lupa kata sandi atau belum memiliki akun? Hubungi administrator Geoportal di instansi Anda.
          </p>
        </div>
      </main>
    </div>
  );
}