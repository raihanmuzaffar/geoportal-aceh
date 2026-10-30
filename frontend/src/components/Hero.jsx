import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Database, Building2, Download } from 'lucide-react';

// Tambahkan gambar lain di sini. Tombol panah & indikator otomatis muncul jika slide lebih dari satu.
const slides = [{ src: '/images/hero-sabang.jpg', alt: 'Pemandangan pesisir Sabang, Aceh' }];

const stats = [
  { icon: Database, value: 362, label: 'Total dataset' },
  { icon: Building2, value: 48, label: 'Instansi (SKPD)' },
  { icon: Download, value: 1256, label: 'Total unduhan' },
];

const pencarianCepat = ['Batas Wilayah', 'Kebencanaan', 'Tutupan Lahan'];

export default function Hero() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [query, setQuery] = useState('');
  const [ready, setReady] = useState(false);

  // Konten muncul sekali saat halaman dimuat
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const cari = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/katalog?q=${encodeURIComponent(q)}` : '/katalog');
  };

  return (
    <section aria-label="Beranda Geoportal Aceh" className="bg-slate-900 text-white">
      <div className="relative min-h-[520px] overflow-hidden">
        {/* Gambar latar (pergantian slide dengan fade pelan) */}
        {slides.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={i === current ? s.alt : ''}
            aria-hidden={i !== current}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {/* Lapisan gelap agar teks tetap terbaca */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/25" />

        {/* Konten */}
        <div className="relative mx-auto flex min-h-[520px] max-w-[1400px] items-center px-4 py-16 sm:px-6 lg:px-8">
          <div
            className={`max-w-2xl transition duration-500 ease-out motion-reduce:transition-none ${
              ready ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            <p className="mb-3 border-l-[3px] border-blue-400 pl-3 text-[14px] text-blue-100">
              Pusat Data Spasial Tanah Rencong
            </p>

            <h1 className="text-[44px] font-bold leading-tight tracking-tight md:text-[56px]">
              Geo-AI Studio
            </h1>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-slate-200">
              Geospatial Artificial Intelligence Studio dan pusat kendali Infrastruktur Data Spasial
              Provinsi Aceh.
            </p>

            {/* Pencarian */}
            <form onSubmit={cari} role="search" className="mt-8 max-w-xl">
              <label htmlFor="hero-search" className="sr-only">
                Cari dataset spasial
              </label>
              <div className="flex rounded-sm bg-white shadow-md focus-within:ring-2 focus-within:ring-blue-400">
                <span className="flex items-center pl-4 text-slate-400">
                  <Search className="h-5 w-5" aria-hidden="true" />
                </span>
                <input
                  id="hero-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari dataset spasial, misalnya batas wilayah"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[14px] text-slate-800 outline-none placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="rounded-r-sm bg-blue-700 px-6 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                >
                  Cari data
                </button>
              </div>

              <p className="mt-3 text-[13px] text-slate-300">
                Pencarian cepat:{' '}
                {pencarianCepat.map((item, i) => (
                  <span key={item}>
                    <Link
                      to={`/katalog?q=${encodeURIComponent(item)}`}
                      className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
                    >
                      {item}
                    </Link>
                    {i < pencarianCepat.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            </form>

            {/* Tombol aksi */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/webgis"
                className="rounded-sm bg-blue-700 px-6 py-2.5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Buka WebGIS
              </Link>
              <Link
                to="/katalog"
                className="rounded-sm border border-white/50 px-6 py-2.5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Lihat katalog
              </Link>
            </div>
          </div>
        </div>

        {/* Kontrol slide, hanya tampil jika ada lebih dari satu gambar */}
        {slides.length > 1 && (
          <div className="absolute bottom-5 right-4 flex items-center gap-3 sm:right-6 lg:right-8">
            <span className="text-[12px] text-slate-200" aria-live="polite">
              {current + 1} / {slides.length}
            </span>
            <button
              type="button"
              onClick={prev}
              aria-label="Slide sebelumnya"
              className="flex h-9 w-9 items-center justify-center border border-white/40 bg-slate-950/40 transition-colors duration-200 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Slide berikutnya"
              className="flex h-9 w-9 items-center justify-center border border-white/40 bg-slate-950/40 transition-colors duration-200 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Statistik */}
      <div className="bg-blue-900">
        <dl className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-4 px-4 py-5 sm:px-6 lg:px-8">
              <Icon className="h-7 w-7 shrink-0 text-blue-200" aria-hidden="true" />
              <div>
                <dd className="text-[22px] font-bold leading-none">
                  {value.toLocaleString('id-ID')}
                </dd>
                <dt className="mt-1 text-[13px] text-blue-100">{label}</dt>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}