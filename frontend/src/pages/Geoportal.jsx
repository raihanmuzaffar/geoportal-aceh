import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { Map, Layers, BookOpen, Globe, ChevronRight, Home, Phone, Database } from 'lucide-react';

const layanan = [
  {
    title: 'WebGIS Viewer',
    desc: 'Peta interaktif untuk melihat sebaran data spasial, batas administrasi, dan peta tematik Provinsi Aceh.',
    icon: Map,
    link: '/webgis',
    tag: 'Peta interaktif',
  },
  {
    title: 'Katalog Dataset',
    desc: 'Pencarian dan unduh metadata serta dataset geospasial dari berbagai SKPD di lingkungan Pemerintah Aceh.',
    icon: Layers,
    link: '/katalog',
    tag: 'Direktori data',
  },
  {
    title: 'Story Maps',
    desc: 'Kumpulan cerita berbasis peta tentang kebencanaan, lingkungan, dan budaya Aceh.',
    icon: BookOpen,
    link: '/story-maps',
    tag: 'Narasi spasial',
  },
  {
    title: 'Geoservis dan REST API',
    desc: 'Layanan data WMS/WFS dan REST API untuk dipakai pengembang aplikasi pihak ketiga.',
    icon: Globe,
    link: '/layanan', // <-- Diperbaiki agar mengarah ke halaman Layanan
    tag: 'Layanan API',
  },
];

export default function Geoportal() {
  // State untuk data statistik dinamis
  const [stats, setStats] = useState({
    total_datasets: 0,
    total_skpd: 0,
    total_categories: 0,
  });

  useEffect(() => {
    // Mengambil data statistik dari API
    api.get('/dashboard/stats')
      .then((res) => {
        setStats(res.data.data);
      })
      .catch((err) => console.error("Gagal memuat statistik:", err));
  }, []);

  // Data statistik yang akan ditampilkan di sidebar
  const statistik = [
    { label: 'Total dataset', value: stats.total_datasets.toLocaleString('id-ID') },
    { label: 'Instansi (SKPD)', value: stats.total_skpd.toLocaleString('id-ID') },
    { label: 'Kategori Data', value: stats.total_categories.toLocaleString('id-ID') },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f1f3f5] text-[#1f2933]"
      style={{ fontFamily: '"Open Sans", "Segoe UI", Roboto, Arial, sans-serif' }}
    >
      {/* Animasi tipis: hanya satu kali saat halaman dibuka */}
      <style>{`
        @keyframes gp-fade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .gp-row { opacity: 0; animation: gp-fade .45s ease-out forwards; }
        .gp-arrow { transition: transform .2s ease; }
        .gp-link:hover .gp-arrow { transform: translateX(3px); }
        @media (prefers-reduced-motion: reduce) {
          .gp-row { opacity: 1; animation: none; }
          .gp-arrow { transition: none; }
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
            <span className="text-white">Layanan Geoportal</span>
          </nav>

          <h1 className="text-[28px] md:text-[32px] font-semibold text-white leading-tight">
            Layanan Geoportal Aceh
          </h1>
          <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-blue-100/85">
            Pusat integrasi, visualisasi, dan penyebaran informasi geospasial Provinsi Aceh untuk
            mendukung perencanaan pembangunan yang akurat dan terpadu.
          </p>
        </div>
      </section>

      <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 py-10 flex flex-col lg:flex-row gap-7">
        {/* Daftar layanan */}
        <section className="w-full lg:w-2/3" aria-labelledby="judul-layanan">
          <div className="bg-white border border-[#d3d9df]">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#d3d9df] border-l-4 border-l-[#14365d] bg-[#f8f9fa]">
              <Layers className="w-[18px] h-[18px] text-[#14365d]" />
              <h2 id="judul-layanan" className="text-[16px] font-semibold text-[#14365d]">
                Daftar layanan
              </h2>
            </div>

            <ul className="divide-y divide-[#e4e8ec]">
              {layanan.map((item, idx) => (
                <li key={item.title} className="gp-row" style={{ animationDelay: `${idx * 70}ms` }}>
                  <Link
                    to={item.link}
                    className="gp-link flex gap-4 px-5 py-5 hover:bg-[#f5f8fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1f6fb2] focus-visible:-outline-offset-2"
                  >
                    <div className="w-11 h-11 shrink-0 flex items-center justify-center border border-[#c5d0dc] bg-[#eef3f8] text-[#14365d]">
                      <item.icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-[16px] font-semibold text-[#14365d]">{item.title}</h3>
                        <span className="text-[12px] text-[#5b6770] border border-[#d3d9df] bg-white px-2 py-px">
                          {item.tag}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-[#4b5660] max-w-[60ch]">
                        {item.desc}
                      </p>
                      <span className="mt-2.5 inline-flex items-center text-[13px] font-semibold text-[#1f6fb2]">
                        Buka layanan
                        <ChevronRight className="gp-arrow w-4 h-4 ml-0.5" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="w-full lg:w-1/3 flex flex-col gap-5">
          <div className="bg-white border border-[#d3d9df]">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#d3d9df] border-l-4 border-l-[#14365d] bg-[#f8f9fa]">
              <Database className="w-[18px] h-[18px] text-[#14365d]" />
              <h3 className="text-[16px] font-semibold text-[#14365d]">Data portal</h3>
            </div>
            <table className="w-full text-[14px]">
              <tbody>
                {statistik.map((s) => (
                  <tr key={s.label} className="border-b border-[#e4e8ec] last:border-b-0">
                    <th scope="row" className="text-left font-normal text-[#4b5660] px-5 py-3">
                      {s.label}
                    </th>
                    <td className="text-right font-semibold text-[#14365d] px-5 py-3 tabular-nums">
                      {s.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-[#d3d9df]">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#d3d9df] border-l-4 border-l-[#c8a24a] bg-[#f8f9fa]">
              <Phone className="w-[18px] h-[18px] text-[#14365d]" />
              <h3 className="text-[16px] font-semibold text-[#14365d]">Pusat bantuan</h3>
            </div>
            <div className="px-5 py-4">
              <p className="text-[14px] leading-relaxed text-[#4b5660]">
                Hubungi kami jika Anda kesulitan mengakses layanan atau membutuhkan data spasial
                tertentu.
              </p>
              <a
                href="tel:+624514789937"
                className="mt-4 flex items-center gap-3 border border-[#d3d9df] bg-[#f8f9fa] px-4 py-3 hover:bg-[#eef3f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1f6fb2]"
              >
                <Phone className="w-4 h-4 text-[#14365d]" />
                <span>
                  <span className="block text-[12px] text-[#5b6770]">Telepon</span>
                  <span className="block text-[15px] font-semibold text-[#14365d]">(0651) 4789937</span>
                </span>
              </a>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}