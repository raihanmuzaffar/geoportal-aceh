import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { ChevronRight, Calendar, FileText, Megaphone, ArrowRight } from 'lucide-react';

export default function Informasi() {
  const [activeTab, setActiveTab] = useState('Berita');
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mengambil data dari API
  useEffect(() => {
    api.get('/news')
      .then((res) => {
        setNewsData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal load berita:", err);
        setLoading(false);
      });
  }, []);

  // Memisahkan data berdasarkan tipe
  const berita = newsData.filter(item => item.type === 'news');
  const agenda = newsData.filter(item => item.type === 'agenda');

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f9]">
      <TopBar />
      <Navbar />

      {/* Header Formal */}
      <div className="bg-[#0f172a] border-b-4 border-blue-600 py-12 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center text-xs text-blue-300 mb-4 font-semibold uppercase tracking-wider">
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3 mx-2" />
            <span className="text-gray-300">Informasi</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Pusat Informasi Publik</h1>
          <p className="text-slate-300 max-w-3xl text-sm leading-relaxed">
            Kumpulan berita terbaru, pengumuman resmi, agenda kegiatan, serta dokumen publikasi seputar pengelolaan Informasi Geospasial Provinsi Aceh.
          </p>
        </div>
      </div>

      {/* Konten Utama */}
      <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Kolom Kiri: Berita / Informasi Utama */}
        <div className="w-full lg:w-2/3 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-col">
          
          {/* Tab Navigasi */}
          <div className="flex border-b border-gray-200 bg-gray-50 rounded-t-lg overflow-hidden">
            {['Berita', 'Agenda'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${
                  activeTab === tab 
                    ? 'bg-white text-blue-700 border-b-2 border-blue-700' 
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Konten Tab */}
          <div className="p-6 md:p-8 min-h-[400px]">
            {loading ? (
              <div className="text-center py-10 text-gray-500">Memuat data dari server...</div>
            ) : (
              <>
                {/* Tab: Berita */}
                {activeTab === 'Berita' && (
                  <div className="space-y-6">
                    {berita.length === 0 ? (
                      <div className="text-center py-10 text-gray-500">Belum ada berita yang dipublikasikan.</div>
                    ) : (
                      berita.map((item) => (
                        <div key={item.id} className="group border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">Berita</span>
                            <span className="text-[12px] text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> 
                              {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <Link to="#">
                            <h3 className="font-bold text-[17px] text-gray-800 group-hover:text-blue-700 transition-colors leading-snug mb-2">{item.title}</h3>
                          </Link>
                          <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3">
                            {item.content.replace(/<[^>]+>/g, '')} {/* Menghapus tag HTML jika ada */}
                          </p>
                          <Link to="#" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 mt-3 hover:gap-2 transition-all">
                            Baca Selengkapnya <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab: Agenda */}
                {activeTab === 'Agenda' && (
                  <div className="space-y-4">
                    {agenda.length === 0 ? (
                      <div className="text-center py-10 text-gray-500">Belum ada agenda kegiatan.</div>
                    ) : (
                      agenda.map((item) => (
                        <div key={item.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all cursor-pointer">
                          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Megaphone className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-[15px] text-gray-800 mb-1 hover:text-orange-600 transition-colors">{item.title}</h3>
                            <span className="text-[12px] text-gray-400">
                              {item.event_date ? new Date(item.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal belum ditentukan'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
          {/* Widget Agenda Terdekat */}
          <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
              Agenda Terbaru
            </h3>
            <div className="space-y-4">
              {agenda.slice(0, 3).map((item, idx) => {
                const dateObj = item.event_date ? new Date(item.event_date) : new Date(item.created_at);
                return (
                  <div key={idx} className="flex gap-3 items-start group cursor-pointer">
                    <div className="bg-gray-100 text-gray-700 group-hover:bg-blue-600 group-hover:text-white transition-colors rounded w-12 h-12 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="font-bold text-sm leading-none">{dateObj.getDate()}</span>
                      <span className="text-[9px] font-semibold uppercase">{dateObj.toLocaleString('id-ID', { month: 'short' })}</span>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-gray-800 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">{item.title}</h4>
                    </div>
                  </div>
                );
              })}
              {agenda.length === 0 && <p className="text-sm text-gray-500">Tidak ada agenda mendatang.</p>}
            </div>
          </div>

          {/* Widget Tautan Penting */}
          <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Tautan Terkait</h3>
            <ul className="space-y-3 text-[13px]">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 flex items-center gap-2"><ChevronRight className="w-3 h-3 text-gray-400" /> Portal Satu Data Aceh</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 flex items-center gap-2"><ChevronRight className="w-3 h-3 text-gray-400" /> JDIH Pemerintah Aceh</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 flex items-center gap-2"><ChevronRight className="w-3 h-3 text-gray-400" /> Situs Resmi Pemprov Aceh</a></li>
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}