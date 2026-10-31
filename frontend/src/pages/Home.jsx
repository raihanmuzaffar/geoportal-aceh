import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import api from '../api/axios';
import { Map, BarChart3, Activity, Globe, Calendar, Layers, Compass } from 'lucide-react';

/* ---------- Data Statis (Layanan & Kategori) ---------- */
const layananUtama = [
  { title: 'Roadmap', icon: Map, to: '/layanan', desc: 'Road Map Simpul Jaringan Daerah Provinsi Aceh.' },
  { title: 'Geoservis', icon: Globe, to: '/layanan', desc: 'Layanan Data Geospasial Daerah Provinsi Aceh.' },
  { title: 'SimonGeo', icon: Activity, to: '/layanan', desc: 'Sistem Pemantauan Kinerja Simpul Jaringan Daerah Provinsi Aceh.' },
  { title: 'WebGIS', icon: BarChart3, to: '/webgis', desc: 'Sistem Informasi Geografis Provinsi Aceh.' },
];

const tabs = ['Semua', 'Aplikasi', 'Map Servis', 'Kartografis', 'Indraja'];

const kategoriLayanan = [
  { title: 'Aplikasi', icon: Layers },
  { title: 'Map Servis', icon: Globe },
  { title: 'Kartografis', icon: Compass },
  { title: 'Indraja', icon: Activity },
];

const placeholderImg = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80';

/* ---------- Komponen kecil ---------- */
const container = 'mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8';

function SectionHeading({ title, to, linkLabel }) {
  return (
    <div className="mb-6 flex items-end justify-between border-b border-slate-200">
      <h2 className="relative pb-3 text-[20px] font-bold text-slate-900 after:absolute after:-bottom-px after:left-0 after:h-[3px] after:w-full after:bg-blue-700">
        {title}
      </h2>
      {to && (
        <Link
          to={to}
          className="pb-3 text-[13px] font-medium text-blue-700 underline-offset-2 hover:text-blue-900 hover:underline"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

/* ---------- Halaman Utama ---------- */
export default function Home() {
  // --- SKRIP UJI COBA ERROR OTOMATIS ---
  // Tambahkan ?crash=true di URL untuk memicu error
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get('crash') === 'true') {
    throw new Error("Simulasi Error Otomatis: Berhasil ditangkap oleh Error Boundary!");
  }
  // ------------------------------------

  const [categories, setCategories] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [datasetsData, setDatasetsData] = useState([]);
  const [skpdData, setSkpdData] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('Semua');

  useEffect(() => {
    // Mengambil semua data secara paralel dari API
    Promise.all([
      api.get('/categories'),
      api.get('/news'),
      api.get('/datasets'),
      api.get('/skpd')
    ])
      .then(([resCat, resNews, resData, resSkpd]) => {
        setCategories(resCat.data.data);
        setNewsData(resNews.data.data);
        setDatasetsData(resData.data.data);
        setSkpdData(resSkpd.data.data);
      })
      .catch((err) => {
        console.error('Gagal mengambil data:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const kategoriTampil =
    activeTab === 'Semua' ? kategoriLayanan : kategoriLayanan.filter((k) => k.title === activeTab);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <TopBar />
      <Navbar />
      <Hero />

      <main className="flex-grow">
        {/* Layanan utama */}
        <section className={`${container} pb-4 pt-12`}>
          <SectionHeading title="Layanan utama" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {layananUtama.map(({ title, icon: Icon, desc, to }) => (
              <Link
                key={title}
                to={to}
                className="group flex gap-4 border border-slate-200 bg-white p-5 transition-colors duration-200 hover:border-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <Icon className="mt-0.5 h-8 w-8 shrink-0 text-blue-700" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <h3 className="text-[17px] font-bold text-slate-900 group-hover:text-blue-800">{title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Berita dan agenda (Dinamis dari API /news) */}
        <section className={`${container} py-10`}>
          <SectionHeading title="Berita dan agenda" to="/informasi" linkLabel="Lihat semua" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {loading ? (
              <p className="col-span-3 text-sm text-slate-500">Memuat berita...</p>
            ) : newsData.length === 0 ? (
              <p className="col-span-3 text-sm text-slate-500">Belum ada berita atau agenda.</p>
            ) : (
              newsData.slice(0, 3).map((item) => {
                const dateStr = item.type === 'agenda' && item.event_date 
                  ? item.event_date 
                  : item.created_at;
                const formattedDate = new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

                return (
                  <article
                    key={item.id}
                    className="flex flex-col border border-slate-200 border-l-[3px] border-l-blue-700 bg-white p-5"
                  >
                    <p className="mb-2 flex items-center gap-2 text-[12px] text-slate-500">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      {formattedDate}
                    </p>
                    <h3 className="mb-2 line-clamp-2 text-[16px] font-bold leading-snug text-slate-900">
                      {item.title}
                    </h3>
                    <p className="line-clamp-3 text-[13px] leading-relaxed text-slate-600">
                      {item.content.replace(/<[^>]+>/g, '')}
                    </p>
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* Kategori layanan (tab) */}
        <section className={`${container} py-10`}>
          <SectionHeading title="Kategori layanan" />

          <div role="tablist" aria-label="Kategori layanan" className="flex overflow-x-auto border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`-mb-px shrink-0 border-b-[3px] px-5 py-3 text-[14px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 ${
                  activeTab === tab
                    ? 'border-blue-700 text-blue-800'
                    : 'border-transparent text-slate-600 hover:text-blue-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div role="tabpanel" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kategoriTampil.map(({ title, icon: Icon }) => (
              <Link
                key={title}
                to="/katalog"
                className="flex items-center gap-4 border border-slate-200 bg-white px-5 py-6 transition-colors duration-200 hover:border-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <Icon className="h-8 w-8 text-blue-700" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-[15px] font-semibold text-slate-800">{title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Dataset terbaru (Dinamis dari API /datasets) */}
        <section className={`${container} py-10`}>
          <SectionHeading title="Dataset terbaru" to="/katalog" linkLabel="Lihat katalog" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <p className="col-span-4 text-sm text-slate-500">Memuat dataset...</p>
            ) : datasetsData.length === 0 ? (
              <p className="col-span-4 text-sm text-slate-500">Belum ada dataset yang dipublikasikan.</p>
            ) : (
              datasetsData.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  to="/katalog"
                  className="group flex flex-col overflow-hidden border border-slate-200 bg-white transition-colors duration-200 hover:border-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <img
                    src={item.thumbnail_url || placeholderImg}
                    alt={`Pratinjau dataset ${item.title}`}
                    loading="lazy"
                    className="h-[150px] w-full border-b border-slate-200 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="mb-1 text-[15px] font-bold text-blue-800 group-hover:underline line-clamp-1">{item.title}</h3>
                    <p className="line-clamp-2 text-[12px] leading-relaxed text-slate-600">
                      {item.skpd?.short_name} • {item.category?.name}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Ketersediaan data (Dinamis dari API /categories) */}
        <section className={`${container} py-10`}>
          <SectionHeading title="Ketersediaan data" />

          {loading && <p className="py-8 text-[14px] text-slate-500">Memuat data statistik...</p>}

          {!loading && error && (
            <p className="border border-slate-200 bg-slate-50 px-4 py-4 text-[14px] text-slate-700">
              Data statistik belum dapat dimuat. Muat ulang halaman, atau coba lagi beberapa saat.
            </p>
          )}

          {!loading && !error && categories.length === 0 && (
            <p className="py-8 text-[14px] text-slate-500">Belum ada kategori data yang tercatat.</p>
          )}

          {!loading && !error && categories.length > 0 && (
            <div className="grid grid-cols-2 border-l border-t border-slate-200 md:grid-cols-5">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to="/katalog"
                  className="group flex flex-col items-start gap-3 border-b border-r border-slate-200 bg-white p-5 transition-colors duration-200 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
                >
                  <Layers className="h-7 w-7 text-blue-700" strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <div className="text-[26px] font-bold leading-none text-slate-900">{cat.datasets_count}</div>
                    <div className="mt-1.5 text-[13px] text-slate-600 group-hover:text-blue-800">{cat.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Unit produksi data geospasial (Dinamis dari API /skpd) */}
        <section className="mt-6 border-t border-slate-200 bg-slate-50 py-12">
          <div className={container}>
            <SectionHeading title="Unit Produksi Data Geospasial" />
            <p className="mb-8 max-w-[75ch] text-[14px] leading-relaxed text-slate-600">
              Tim unit produksi data geospasial ditetapkan melalui Keputusan Gubernur Aceh Nomor
              100.3.3.1/123/2023 tentang Pembentukan dan Penetapan Tim Simpul Jaringan Informasi
              Geospasial dan Daftar Data Informasi Geospasial Provinsi Aceh.
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {skpdData.slice(0, 6).map((skpd) => (
                <div key={skpd.id} className="flex flex-col items-center border border-slate-200 bg-white px-3 py-5 text-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center border border-slate-200 bg-slate-50 text-[12px] font-bold text-blue-900 rounded-full">
                    {skpd.short_name.substring(0, 3).toUpperCase()}
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900 line-clamp-1">{skpd.short_name}</span>
                  <span className="mt-0.5 text-[12px] text-slate-500">{skpd.datasets_count} metadata</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}