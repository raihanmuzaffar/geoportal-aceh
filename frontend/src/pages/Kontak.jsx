import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronRight, Home, MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function Kontak() {
  // Koordinat Kantor Diskominfo Aceh (Contoh: Banda Aceh)
  const centerPosition = [5.5483, 95.3238];

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
            <span className="text-white">Kontak</span>
          </nav>

          <h1 className="text-[28px] md:text-[32px] font-semibold text-white leading-tight">
            Hubungi Kami
          </h1>
          <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-blue-100/85">
            Hubungi tim pengelola Geoportal Aceh untuk informasi lebih lanjut, pertanyaan, atau bantuan terkait layanan data spasial.
          </p>
        </div>
      </section>

      {/* Konten Utama */}
      <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Kolom Kiri: Info & Peta */}
        <div className="flex flex-col gap-6">
          
          {/* Kotak Informasi Kontak */}
          <div className="bg-white border border-[#d3d9df] rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-[#14365d] mb-6">Informasi Kontak</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#f8f9fa] border border-[#d3d9df] rounded-full flex items-center justify-center flex-shrink-0 text-[#14365d]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-1">Alamat Kantor</h3>
                  <p className="text-[13.5px] text-gray-600 leading-relaxed">
                    Jl. Tgk. H. M. Daud Beureueh No. 25,<br />
                    Kec. Kuta Alam, Banda Aceh, 23121
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#f8f9fa] border border-[#d3d9df] rounded-full flex items-center justify-center flex-shrink-0 text-[#14365d]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-1">Telepon</h3>
                  <p className="text-[13.5px] text-gray-600">(0651) 4789937</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#f8f9fa] border border-[#d3d9df] rounded-full flex items-center justify-center flex-shrink-0 text-[#14365d]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-1">Email</h3>
                  <p className="text-[13.5px] text-gray-600">diskominfo@acehprov.go.id</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#f8f9fa] border border-[#d3d9df] rounded-full flex items-center justify-center flex-shrink-0 text-[#14365d]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-1">Jam Layanan</h3>
                  <p className="text-[13.5px] text-gray-600">Senin - Jumat, 08.00 - 16.00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Peta Lokasi (Leaflet) */}
          <div className="bg-white border border-[#d3d9df] rounded-lg p-2 h-[300px] relative z-0">
            <MapContainer 
              center={centerPosition} 
              zoom={14} 
              style={{ width: '100%', height: '100%', borderRadius: '0.25rem' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CircleMarker center={centerPosition} radius={10} pathOptions={{ color: '#c8a24a', fillColor: '#14365d', fillOpacity: 1 }}>
                <Popup>
                  <strong>Kantor Diskominfo Aceh</strong><br/>
                  Geoportal Aceh
                </Popup>
              </CircleMarker>
            </MapContainer>
          </div>
        </div>

        {/* Kolom Kanan: Formulir Pesan */}
        <div className="bg-white border border-[#d3d9df] rounded-lg p-6 md:p-8 h-fit">
          <h2 className="text-xl font-bold text-[#14365d] mb-2">Kirim Pesan</h2>
          <p className="text-[13px] text-gray-500 mb-6">Isi formulir di bawah ini untuk menghubungi kami. Kami akan segera merespons pesan Anda.</p>
          
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Masukkan nama" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#14365d] focus:ring-1 focus:ring-[#14365d]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                <input type="email" placeholder="alamat@email.com" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#14365d] focus:ring-1 focus:ring-[#14365d]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subjek <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Topik pesan Anda" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#14365d] focus:ring-1 focus:ring-[#14365d]" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pesan <span className="text-red-500">*</span></label>
              <textarea rows="5" placeholder="Tuliskan pesan atau pertanyaan Anda di sini..." className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#14365d] focus:ring-1 focus:ring-[#14365d] resize-none"></textarea>
            </div>

            <button type="button" className="w-full md:w-auto bg-[#14365d] hover:bg-[#0f2947] text-white px-8 py-3 rounded-md font-semibold text-sm transition-colors flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Kirim Pesan
            </button>
          </form>
        </div>

      </main>

      <Footer />
    </div>
  );
}