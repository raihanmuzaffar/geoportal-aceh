import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  ChevronRight, Home, Server, Database, Cloud, FileDown, 
  HelpCircle, BookOpen, ExternalLink, PhoneCall, Mail 
} from 'lucide-react';

const layananData = [
  {
    title: 'REST API & GeoJSON',
    desc: 'Akses data spasial dan atribut dalam format JSON (GeoJSON) untuk dikonsumsi oleh aplikasi web atau mobile pihak ketiga.',
    icon: Server,
    tag: 'Developer',
  },
  {
    title: 'Web Map Service (WMS)',
    desc: 'Layanan peta berbasis OGC (Open Geospatial Consortium) untuk menampilkan layer spasial secara langsung di aplikasi GIS Anda.',
    icon: Cloud,
    tag: 'OGC Standard',
  },
  {
    title: 'Web Feature Service (WFS)',
    desc: 'Layanan untuk mengunduh dan memanipulasi data vektor (fitur geospasial) secara langsung melalui protokol web standar.',
    icon: Database,
    tag: 'OGC Standard',
  },
  {
    title: 'Permohonan Data Spasial',
    desc: 'Ajukan permohonan data spasial tematik yang belum dipublikasikan secara umum untuk kebutuhan penelitian atau perencanaan.',
    icon: FileDown,
    tag: 'Publik',
  },
];

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

export default function Layanan() {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#f1f3f5] text-[#1f2933]"
      style={{ fontFamily: '"Open Sans", "Segoe UI", Roboto, Arial, sans-serif' }}
    >
      <TopBar />
      <Navbar />

      {/* Header Halaman */}
      <section className="bg-[#14365d] border-b-[3px] border-[#c8a24a]">
        <div className="max-w-[1200px] mx-auto px-4 pt-5 pb-9">
          <nav aria-label="Breadcrumb" className="flex items-center text-[13px] text-blue-100/80 mb-5">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-white hover:underline">
              <Home className="w-3.5 h-3.5" /> Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 opacity-60" />
            <span className="text-white">Layanan</span>
          </nav>

          <h1 className="text-[28px] md:text-[32px] font-semibold text-white leading-tight">
            Pusat Layanan Geospasial
          </h1>
          <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-blue-100/85">
            Akses berbagai layanan interoperabilitas data spasial, dokumentasi API, serta pengajuan permohonan data untuk mendukung kebutuhan sistem informasi geografis Anda.
          </p>
        </div>
      </section>

      {/* Konten Utama */}
      <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 py-10 flex flex-col lg:flex-row gap-7">
        
        {/* Kolom Kiri: Daftar Layanan */}
        <div className="w-full lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {layananData.map((layanan, idx) => (
              <div key={idx} className="bg-white border border-[#d3d9df] rounded-lg p-6 flex flex-col hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#f8f9fa] border border-[#d3d9df] text-[#14365d] rounded-lg flex items-center justify-center group-hover:bg-[#14365d] group-hover:text-white transition-colors duration-300">
                    <layanan.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#c8a24a]/10 text-[#b38f3b] px-2 py-1 rounded border border-[#c8a24a]/20">
                    {layanan.tag}
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-[#14365d] mb-2">{layanan.title}</h3>
                <p className="text-[13.5px] text-gray-600 leading-relaxed mb-6 flex-grow">
                  {layanan.desc}
                </p>
                <button className="inline-flex items-center justify-center gap-2 w-full bg-white border border-[#14365d] text-[#14365d] hover:bg-[#14365d] hover:text-white text-[13px] font-medium py-2 rounded transition-colors">
                  Akses Layanan <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Sidebar Bantuan */}
        <aside className="w-full lg:w-1/3 flex flex-col gap-5">
          
          {/* Widget Kontak Helpdesk */}
          <div className="bg-white border border-[#d3d9df] rounded-lg">
            <PanelHeader icon={PhoneCall}>Helpdesk & Bantuan</PanelHeader>
            <div className="p-5 space-y-4">
              <p className="text-[13.5px] text-gray-600 leading-relaxed">
                Mengalami kendala teknis atau membutuhkan bantuan terkait integrasi layanan API? Hubungi tim kami.
              </p>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 text-[#14365d] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500 font-semibold uppercase">Email Support</div>
                  <a href="mailto:diskominfo@acehprov.go.id" className="text-[14px] font-bold text-[#14365d] hover:underline">diskominfo@acehprov.go.id</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 text-[#14365d] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-500 font-semibold uppercase">Telepon</div>
                  <div className="text-[14px] font-bold text-[#14365d]">(0651) 4789937</div>
                </div>
              </div>
            </div>
          </div>

          {/* Widget Dokumentasi */}
          <div className="bg-white border border-[#d3d9df] rounded-lg">
            <PanelHeader icon={BookOpen} accent="#c8a24a">Dokumentasi API</PanelHeader>
            <ul className="divide-y divide-[#e4e8ec]">
              {[
                { label: 'Panduan Memulai REST API', href: '#' },
                { label: 'Referensi Endpoint GeoJSON', href: '#' },
                { label: 'Spesifikasi WMS & WFS', href: '#' },
                { label: 'Ketentuan Penggunaan Layanan', href: '#' },
              ].map((doc) => (
                <li key={doc.label}>
                  <a href={doc.href} className="flex items-center justify-between px-5 py-3 text-[13.5px] text-gray-700 hover:bg-[#f5f8fb] hover:text-[#1f6fb2] transition-colors">
                    {doc.label}
                    <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </aside>
      </main>

      <Footer />
    </div>
  );
}