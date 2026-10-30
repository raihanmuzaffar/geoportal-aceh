import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { 
  Search, Map, BarChart2, Download, Info, FileText, 
  ChevronDown, MapPin, Calendar, ListFilter, HelpCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react';

export default function Katalog() {
  const [datasets, setDatasets] = useState([]);
  const [skpds, setSkpds] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // State Filter & Pagination
  const [viewMode, setViewMode] = useState('Layer');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Untuk input sementara sebelum di-enter
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkpd, setSelectedSkpd] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data SKPD & Kategori untuk Dropdown (Hanya sekali saat dimuat)
  useEffect(() => {
    Promise.all([api.get('/skpd'), api.get('/categories')])
      .then(([resSkpd, resCat]) => {
        setSkpds(resSkpd.data.data);
        setCategories(resCat.data.data);
      })
      .catch(err => console.error("Error fetching master data:", err));
  }, []);

  // 2. Fetch Dataset berdasarkan Filter & Halaman
  useEffect(() => {
    setLoading(true);
    const params = { page };
    if (search) params.search = search;
    if (selectedCategory) params.category_id = selectedCategory;
    if (selectedSkpd) params.skpd_id = selectedSkpd;

    api.get('/datasets', { params })
      .then((res) => {
        setDatasets(res.data.data);
        setTotalPages(res.data.meta.last_page);
        setTotalData(res.data.meta.total);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching datasets:", err);
        setLoading(false);
      });
  }, [search, selectedCategory, selectedSkpd, page]);

  // Handler Form Pencarian
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1); // Reset ke halaman 1 setiap kali mencari
  };

  // Handler Reset Filter
  const handleResetFilter = () => {
    setSearch('');
    setSearchInput('');
    setSelectedCategory('');
    setSelectedSkpd('');
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f9]">
      <TopBar />
      <Navbar />

      {/* HEADER GELAP */}
      <div className="relative bg-gradient-to-r from-slate-900 via-[#3a1c4b] to-slate-900 py-10 px-4">
        <div className="max-w-[1300px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
            
            <div className="w-full lg:w-2/3">
              <p className="text-gray-300 text-sm mb-4">
                Cari data peta resmi dari perangkat daerah, lihat pratinjaunya, lalu unduh — tanpa perlu keahlian GIS.
              </p>
              <form onSubmit={handleSearchSubmit} className="relative w-full max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="text" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Ketik nama data yang dicari..." 
                  className="w-full pl-12 pr-24 py-3 rounded-full text-sm outline-none shadow-lg focus:ring-2 focus:ring-[#f87171]"
                />
                <button type="submit" className="absolute right-1 top-1 bottom-1 bg-[#f87171] hover:bg-red-500 text-white px-6 rounded-full font-medium text-sm transition-colors">
                  Cari
                </button>
              </form>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                <span>Contoh:</span>
                {['batas desa', 'sungai', 'jalan', 'banjir', 'tata ruang'].map(tag => (
                  <button key={tag} onClick={() => { setSearchInput(tag); setSearch(tag); setPage(1); }} className="px-3 py-1 rounded-full border border-gray-600 hover:bg-gray-700 transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Statistik Kanan (Dinamis) */}
            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 min-w-[120px] text-center">
                <div className="text-xl font-bold text-white">{totalData.toLocaleString('id-ID')}</div>
                <div className="text-[10px] text-gray-300 font-medium">Total Data Ditemukan</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <main className="flex-grow max-w-[1300px] mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KOLOM KIRI (Sidebar Filter) */}
        <aside className="lg:col-span-3 flex flex-col gap-5">
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            {/* Tipe Data */}
            <h3 className="font-bold text-gray-700 text-[13px] mb-3 tracking-wide">JENIS DATA</h3>
            <div className="flex bg-gray-100 p-1 rounded-md mb-4">
              {['Layer', 'Kartografi', 'Dashboard'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                    viewMode === mode ? 'bg-white text-[#f87171] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            
            {/* Filter Kategori */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1 mb-2">
              <h3 className="font-bold text-gray-700 text-[13px] tracking-wide">Kategori data</h3>
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full text-xs border border-gray-300 rounded p-2 outline-none focus:border-blue-500"
            >
              <option value="">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name} ({cat.datasets_count})</option>
              ))}
            </select>

            {/* Filter Unit Produksi */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-4 mb-2">
              <h3 className="font-bold text-gray-700 text-[13px] tracking-wide">Unit produksi</h3>
            </div>
            <select 
              value={selectedSkpd}
              onChange={(e) => { setSelectedSkpd(e.target.value); setPage(1); }}
              className="w-full text-xs border border-gray-300 rounded p-2 outline-none focus:border-blue-500"
            >
              <option value="">Semua Instansi</option>
              {skpds.map(skpd => (
                <option key={skpd.id} value={skpd.id}>{skpd.name}</option>
              ))}
            </select>

            <button 
              onClick={handleResetFilter}
              className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 rounded transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>

        </aside>

        {/* KOLOM TENGAH (Kartu Dataset) */}
        <div className="lg:col-span-6">
          
          {/* Info Bar Atas */}
          <div className="flex flex-wrap items-center justify-between mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-[13px]">
            <div className="flex items-center gap-2 text-gray-600">
              Menampilkan <span className="font-semibold text-[#f87171] bg-red-50 px-2 py-0.5 rounded border border-red-100">{viewMode} peta</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              Halaman {page} dari {totalPages || 1}
            </div>
          </div>

          {/* Grid Kartu Dataset */}
          {loading ? (
            <div className="text-center py-20 text-gray-500 text-[14px]">Memuat data...</div>
          ) : datasets.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-gray-200 text-gray-500">
              Tidak ada dataset yang cocok dengan pencarian atau filter Anda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {datasets.map((dataset) => (
                <div key={dataset.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  
                  {/* Thumbnail */}
                  <div className="relative h-40 bg-gray-100 border-b border-gray-200">
                    <img 
                      src={dataset.thumbnail_url || "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80"} 
                      alt={dataset.title} 
                      loading="lazy"
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    />
                    <span className="absolute top-2 left-2 bg-gray-900/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                      <Map className="w-3 h-3" /> {viewMode} peta
                    </span>
                  </div>

                  {/* Konten Kartu */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-[14px] text-gray-800 mb-3 line-clamp-2 leading-snug">
                      {dataset.title}
                    </h3>
                    
                    <div className="space-y-1.5 mb-4 text-[11px] text-gray-500">
                      <div className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {dataset.skpd?.short_name || 'SKPD'}</div>
                      <div className="flex items-center gap-1.5"><ListFilter className="w-3.5 h-3.5" /> {dataset.category?.name || 'Kategori'}</div>
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon /> 
                        {new Date(dataset.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    {/* Tombol Aksi Utama */}
                    <div className="flex gap-2 mt-auto">
                      <button className="flex-1 bg-[#f87171] hover:bg-red-500 text-white text-[12px] font-medium py-2 rounded flex items-center justify-center gap-1 transition-colors">
                        <Map className="w-4 h-4" /> Lihat peta
                      </button>
                      <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-[12px] font-medium py-2 rounded flex items-center justify-center gap-1 transition-colors">
                        <Download className="w-4 h-4" /> Unduh
                      </button>
                    </div>
                  </div>

                  {/* Footer Kartu (Ikon Kecil) */}
                  <div className="flex border-t border-gray-100 bg-gray-50 text-[10px] text-gray-500 divide-x divide-gray-200">
                    <button className="flex-1 py-2 flex items-center justify-center gap-1 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Metadata">
                      <Info className="w-3 h-3" /> Metadata
                    </button>
                    <button className="flex-1 py-2 flex items-center justify-center gap-1 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="OneMap">
                      <MapPin className="w-3 h-3" /> OneMap
                    </button>
                    <button className="flex-1 py-2 flex items-center justify-center gap-1 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Analisa">
                      <BarChart2 className="w-3 h-3" /> Analisa
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4 mb-8">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 text-sm font-medium rounded transition-colors ${
                      page === i + 1 ? 'bg-[#12355B] text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* KOLOM KANAN (Panduan) - Tetap Sama */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-[124px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-[14px] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#f87171]" /> Panduan
              </h3>
            </div>
            
            <div className="p-5 text-[12px] text-gray-600 leading-relaxed">
              <h4 className="font-bold text-gray-800 mb-3">Mulai dalam 3 langkah</h4>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#f87171] flex items-center justify-center font-bold flex-shrink-0 text-[10px]">1</div>
                  <p><strong className="text-gray-800">Cari</strong> — ketik nama data di kotak pencarian, lalu tekan Enter atau tombol Cari.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#f87171] flex items-center justify-center font-bold flex-shrink-0 text-[10px]">2</div>
                  <p><strong className="text-gray-800">Saring</strong> — pilih jenis data, lalu persempit lewat Unit produksi atau Kategori data di panel kiri.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#f87171] flex items-center justify-center font-bold flex-shrink-0 text-[10px]">3</div>
                  <p><strong className="text-gray-800">Lihat & unduh</strong> — pada kartu data, klik Lihat peta untuk pratinjau, atau Unduh untuk mengambil datanya.</p>
                </div>
              </div>

              <h4 className="font-bold text-gray-800 mt-6 mb-3">Arti tombol pada kartu</h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Map className="w-4 h-4 text-[#f87171] flex-shrink-0" />
                  <div>
                    <strong className="text-gray-800 block">Lihat peta</strong>
                    <span className="text-gray-500">Pratinjau layer di peta tanpa meninggalkan halaman.</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Download className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-800 block">Unduh</strong>
                    <span className="text-gray-500">Membuka halaman unduhan data (mis. Shapefile/GeoJSON).</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Info className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-800 block">Metadata</strong>
                    <span className="text-gray-500">Informasi detail mengenai sumber dan atribut data.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </aside>

      </main>

      <Footer />
    </div>
  );
}

// Ikon kecil untuk tanggal
function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  );
}