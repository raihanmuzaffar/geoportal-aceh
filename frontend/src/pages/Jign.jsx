import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios'; // <-- Import API
import {
  Network,
  ChevronRight,
  Home,
  Scale,
  ExternalLink,
  Search,
  Database,
  Globe,
  Layers,
  Landmark,
  Building2,
  MapPin,
  Loader2, // <-- Import Ikon Loading
} from 'lucide-react';

const fungsi = [
  'Melaksanakan koordinasi penyelenggaraan Informasi Geospasial di daerah.',
  'Mengintegrasikan data geospasial dari berbagai SKPD ke dalam satu portal (Geoportal Aceh).',
  'Menyebarluaskan Informasi Geospasial Dasar dan Tematik kepada masyarakat.',
  'Menjaga interoperabilitas data melalui standar nasional (KUGI) dan layanan web service (WMS/WFS).',
];

const dasarHukum = [
  'UU No. 4 Tahun 2011 tentang Informasi Geospasial',
  'Perpres No. 27 Tahun 2014 tentang Jaringan Informasi Geospasial Nasional',
  'Qanun Aceh tentang Rencana Tata Ruang Wilayah',
];

const tautan = [
  { label: 'Ina-Geoportal (BIG)', href: 'https://tanahair.indonesia.go.id' },
  { label: 'Geoservices BIG', href: 'https://geoservices.big.go.id' },
  { label: 'Satu Data Indonesia', href: 'https://satu.big.go.id' },
];

// Ikon per jenis instansi
const ikonJenis = {
  'Kementerian / Lembaga': Landmark,
  Provinsi: Building2,
  'Kabupaten / Kota': MapPin,
};

const filters = ['Semua', 'Kementerian / Lembaga', 'Provinsi', 'Kabupaten / Kota'];

function PanelHeader({ icon: Icon, children, accent = '#14365d' }) {
  return (
    <div
      className="flex items-center gap-2 px-5 py-3.5 border-b border-[#d3d9df] border-l-4 bg-[#f8f9fa]"
      style={{ borderLeftColor: accent }}
    >
      <Icon className="w-[18px] h-[18px] text-[#14365d]" />
      <h3 className="text-[16px] font-semibold text-[#14365d]">{children}</h3>
    </div>
  );
}

export default function Jign() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [query, setQuery] = useState('');
  
  // STATE BARU: Untuk Data Dinamis
  const [simpulData, setSimpulData] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA DARI API
  useEffect(() => {
    api.get('/jign-simpuls')
      .then((res) => {
        setSimpulData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal load JIGN:", err);
        setLoading(false);
      });
  }, []);

  const kata = query.trim().toLowerCase();
  const filteredSimpul = simpulData.filter((item) => {
    const cocokJenis = activeFilter === 'Semua' || item.type === activeFilter;
    const cocokKata =
      !kata || item.name.toLowerCase().includes(kata) || item.description.toLowerCase().includes(kata);
    return cocokJenis && cocokKata;
  });

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f1f3f5] text-[#1f2933]"
      style={{ fontFamily: '"Open Sans", "Segoe UI", Roboto, Arial, sans-serif' }}
    >
      <style>{`
        @keyframes jg-fade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .jg-in { opacity: 0; animation: jg-fade .45s ease-out forwards; }
        .jg-swap { animation: jg-fade .3s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .jg-in { opacity: 1; animation: none; }
          .jg-swap { animation: none; }
        }
      `}</style>

      <TopBar />
      <Navbar />

      {/* Judul halaman */}
      <section className="bg-[#14365d] border-b-[3px] border-[#c8a24a]">
        <div className="max-w-[1200px] mx-auto px-4 pt-5 pb-9">
          <nav aria-label="Breadcrumb" className="flex items-center text-[13px] text-blue-100/80 mb-5">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-white hover:underline">
              <Home className="w-3.5 h-3.5" /> Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 opacity-60" />
            <span className="text-white">JIGN</span>
          </nav>

          <h1 className="text-[28px] md:text-[32px] font-semibold text-white leading-tight">
            Jaringan Informasi Geospasial Nasional
          </h1>
          <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-blue-100/85">
            Simpul Jaringan Informasi Geospasial Provinsi Aceh. Wadah koordinasi, integrasi, dan
            berbagi pakai data spasial antar instansi pemerintah di tingkat pusat dan daerah.
          </p>
        </div>
      </section>

      {/* Bagian 1: Artikel dan sidebar */}
      <main className="max-w-[1200px] mx-auto w-full px-4 pt-10 pb-6 flex flex-col lg:flex-row gap-7">
        <article className="jg-in w-full lg:w-2/3 bg-white border border-[#d3d9df] self-start">
          <div className="flex items-center gap-2 px-6 py-3.5 border-b border-[#d3d9df] border-l-4 border-l-[#14365d] bg-[#f8f9fa]">
            <Network className="w-[18px] h-[18px] text-[#14365d]" />
            <h2 className="text-[17px] font-semibold text-[#14365d]">Tentang JIGN</h2>
          </div>

          <div className="px-6 py-6 text-[15px] leading-[1.75] text-[#374151] max-w-[75ch]">
            <p>
              <strong className="font-semibold text-[#14365d]">
                Jaringan Informasi Geospasial Nasional (JIGN)
              </strong>{' '}
              adalah sistem jaringan yang menghubungkan seluruh simpul jaringan (Kementerian/Lembaga,
              Pemerintah Provinsi, dan Pemerintah Kabupaten/Kota) untuk menyelenggarakan Informasi
              Geospasial (IG) secara terpadu, terintegrasi, dan berkelanjutan.
            </p>
            <p className="mt-4">
              Sebagai bagian dari JIGN,{' '}
              <strong className="font-semibold text-[#14365d]">Simpul Jaringan Provinsi Aceh</strong>{' '}
              bertugas mengoordinasikan pengumpulan, pembaruan, dan distribusi data geospasial di
              lingkungan Pemerintah Aceh. Tujuannya agar tidak terjadi tumpang tindih data (duplikasi)
              dan data yang dipakai dalam perencanaan pembangunan akurat serta dapat
              dipertanggungjawabkan.
            </p>

            <h3 className="mt-8 mb-3 pb-2 border-b border-[#e4e8ec] text-[17px] font-semibold text-[#14365d]">
              Fungsi dan peran Simpul Jaringan Aceh
            </h3>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#c8a24a]">
              {fungsi.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </article>

        <aside className="w-full lg:w-1/3 flex flex-col gap-5">
          <div className="jg-in bg-white border border-[#d3d9df]" style={{ animationDelay: '80ms' }}>
            <PanelHeader icon={Scale}>Dasar hukum</PanelHeader>
            <ul className="divide-y divide-[#e4e8ec] text-[14px] leading-relaxed text-[#374151]">
              {dasarHukum.map((d) => (
                <li key={d} className="px-5 py-3">
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="jg-in bg-white border border-[#d3d9df]" style={{ animationDelay: '160ms' }}>
            <PanelHeader icon={ExternalLink} accent="#c8a24a">
              Tautan nasional
            </PanelHeader>
            <ul className="divide-y divide-[#e4e8ec]">
              {tautan.map((t) => (
                <li key={t.href}>
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-5 py-3 text-[14px] text-[#1f6fb2] hover:bg-[#f5f8fb] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1f6fb2] focus-visible:-outline-offset-2"
                  >
                    {t.label}
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      {/* Bagian 2: Direktori simpul jaringan */}
      <section className="max-w-[1200px] mx-auto w-full px-4 pt-4 pb-12" aria-labelledby="judul-direktori">
        <div className="bg-white border border-[#d3d9df]">
          {/* Judul dan pencarian */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4 border-b border-[#d3d9df] border-l-4 border-l-[#14365d] bg-[#f8f9fa]">
            <div>
              <h2 id="judul-direktori" className="text-[18px] font-semibold text-[#14365d]">
                Direktori simpul jaringan
              </h2>
              <p className="mt-0.5 text-[14px] text-[#4b5660]">
                Daftar instansi pusat dan daerah yang terhubung dalam JIGN.
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <label htmlFor="cari-simpul" className="sr-only">
                Cari instansi
              </label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7680]" />
              <input
                id="cari-simpul"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari instansi"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#b8c2cc] text-[14px] placeholder:text-[#7a858f] focus:outline-none focus:border-[#14365d] focus:ring-1 focus:ring-[#14365d]"
              />
            </div>
          </div>

          {/* Filter jenis instansi */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-[#e4e8ec]">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter jenis instansi">
              {filters.map((filter) => {
                const aktif = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    aria-pressed={aktif}
                    className={`px-3.5 py-1.5 text-[13px] border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f6fb2] ${
                      aktif
                        ? 'bg-[#14365d] text-white border-[#14365d] font-semibold'
                        : 'bg-white text-[#374151] border-[#c5ced7] hover:bg-[#eef3f8] hover:border-[#14365d]'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
            <p className="text-[13px] text-[#5b6770]" aria-live="polite">
              {loading ? 'Memuat data...' : `Menampilkan ${filteredSimpul.length} dari ${simpulData.length} simpul`}
            </p>
          </div>

          {/* Daftar kartu */}
          <div className="p-6">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-[#5b6770]">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#14365d]" />
                <p>Memuat direktori simpul...</p>
              </div>
            ) : filteredSimpul.length === 0 ? (
              <div className="py-10 text-center text-[14px] text-[#4b5660]">
                Tidak ada simpul yang cocok dengan pencarian Anda. Coba kata kunci lain atau ubah
                filter jenis instansi.
              </div>
            ) : (
              <ul
                key={`${activeFilter}-${kata}`}
                className="jg-swap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {filteredSimpul.map((item) => {
                  const Ikon = ikonJenis[item.type] || Landmark;
                  return (
                    <li key={item.id} className="flex flex-col border border-[#d3d9df] bg-white">
                      <div className="flex gap-3 items-start p-4 pb-3">
                        <div className="w-11 h-11 shrink-0 flex items-center justify-center border border-[#c5d0dc] bg-[#eef3f8] text-[#14365d]">
                          <Ikon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[12px] text-[#8a6d1d] font-semibold">{item.type}</div>
                          <h3 className="mt-0.5 text-[14.5px] font-semibold leading-snug text-[#14365d]">
                            {item.name}
                          </h3>
                        </div>
                      </div>

                      <p className="px-4 text-[13.5px] leading-relaxed text-[#4b5660] flex-grow">
                        {item.description}
                      </p>

                      <div className="px-4 pt-3 pb-3.5 flex items-center gap-1.5 text-[13px] text-[#5b6770]">
                        <Database className="w-3.5 h-3.5" />
                        <span>{item.technology || 'ArcGIS REST'}</span>
                      </div>

                      <div className="flex border-t border-[#e4e8ec] divide-x divide-[#e4e8ec]">
                        <button className="flex-1 py-2.5 text-[13px] font-semibold text-[#14365d] hover:bg-[#14365d] hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1f6fb2]">
                          Lihat data
                        </button>
                        <button className="flex-1 py-2.5 inline-flex items-center justify-center gap-1.5 text-[13px] text-[#14365d] hover:bg-[#eef3f8] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1f6fb2]">
                          <Globe className="w-3.5 h-3.5" /> Portal
                        </button>
                        <button
                          aria-label={`Lihat layer ${item.name}`}
                          title="Lihat layer"
                          className="px-3.5 py-2.5 text-[#14365d] hover:bg-[#eef3f8] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1f6fb2]"
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}