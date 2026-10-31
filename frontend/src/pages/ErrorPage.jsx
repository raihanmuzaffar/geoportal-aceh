import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  AlertTriangle, Lock, FileWarning, ServerCrash, 
  HelpCircle, RefreshCcw, Home, ShieldAlert, WifiOff 
} from 'lucide-react';

// Konfigurasi tampilan untuk setiap kode error
const errorConfig = {
  400: { title: 'Permintaan Tidak Valid', icon: FileWarning, color: 'text-amber-500', bg: 'bg-amber-100', msg: 'Data yang dikirim tidak sesuai format yang diminta server.' },
  401: { title: 'Sesi Berakhir', icon: Lock, color: 'text-yellow-600', bg: 'bg-yellow-100', msg: 'Sesi login Anda telah berakhir. Silakan login kembali untuk melanjutkan.' },
  403: { title: 'Akses Ditolak', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-100', msg: 'Anda tidak memiliki hak akses untuk membuka halaman atau data ini.' },
  404: { title: 'Halaman Tidak Ditemukan', icon: HelpCircle, color: 'text-blue-600', bg: 'bg-blue-100', msg: 'Maaf, halaman atau data yang Anda cari tidak dapat ditemukan.' },
  413: { title: 'File Terlalu Besar', icon: FileWarning, color: 'text-orange-500', bg: 'bg-orange-100', msg: 'Ukuran file yang Anda unggah melebihi batas maksimal server (50MB).' },
  422: { title: 'Validasi Gagal', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100', msg: 'Data yang Anda masukkan belum lengkap atau tidak valid. Periksa kembali form Anda.' },
  500: { title: 'Kesalahan Server', icon: ServerCrash, color: 'text-red-600', bg: 'bg-red-100', msg: 'Terjadi masalah internal pada server kami. Tim teknis telah diberitahu.' },
  502: { title: 'Koneksi Terputus', icon: WifiOff, color: 'text-red-600', bg: 'bg-red-100', msg: 'Server backend sedang tidak merespon. Silakan coba beberapa saat lagi.' },
};

export default function ErrorPage({ code = 404, customMessage = null }) {
  // Ambil konfigurasi berdasarkan kode, jika tidak ada default ke 500
  const config = errorConfig[code] || errorConfig[500];
  const Icon = config.icon;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar />
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full text-center">
          
          {/* Ikon */}
          <div className={`w-32 h-32 ${config.bg} ${config.color} rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner`}>
            <Icon className="w-16 h-16" />
          </div>

          {/* Kode Error */}
          <h1 className="text-7xl md:text-9xl font-extrabold text-[#12355B] mb-4 tracking-tighter">
            {code}
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {config.title}
          </h2>
          
          <p className="text-gray-500 mb-10 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            {customMessage || config.msg}
          </p>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center gap-2 bg-[#12355B] hover:bg-[#1F5A99] text-white px-8 py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto"
            >
              <RefreshCcw className="w-5 h-5" /> Muat Ulang Halaman
            </button>
            
            <Link 
              to={code === 401 ? '/login' : '/'} 
              className="inline-flex items-center gap-2 bg-white border-2 border-[#12355B] text-[#12355B] hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto"
            >
              <Home className="w-5 h-5" /> {code === 401 ? 'Ke Halaman Login' : 'Kembali ke Beranda'}
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}