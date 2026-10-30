import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Halaman Publik
import Home from './pages/Home';
import Katalog from './pages/Katalog';
import WebGIS from './pages/WebGIS';
import Geoportal from './pages/Geoportal';
import StoryMaps from './pages/StoryMaps';
import StoryMapDetail from './pages/StoryMapDetail'; 
import Jign from './pages/Jign';
import Informasi from './pages/Informasi';
import Layanan from './pages/Layanan';
import Kontak from './pages/Kontak';
import NotFound from './pages/NotFound'; // <-- 1. Tambahkan Import NotFound

// Halaman Admin & Auth
import Login from './pages/Login';
import AdminLayout from './pages/AdminLayout'; 
import AdminDashboard from './admin/pages/Dashboard/AdminDashboard';
import ListDataset from "./admin/pages/ListDataset";

// Halaman Admin Placeholder
import Kategori from './admin/pages/Kategori';
import Layers from './admin/pages/Layers'; 
import Berita from './admin/pages/Berita';
import Pengguna from './admin/pages/Pengguna';
import Skpd from './admin/pages/Skpd';
import Pengaturan from './admin/pages/Pengaturan';
import Profile from './admin/pages/Profile'; 
import AccountSettings from './admin/pages/AccountSettings'; 

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={<Home />} />
          <Route path="/katalog" element={<Katalog />} />
          <Route path="/webgis" element={<WebGIS />} />
          <Route path="/geoportal" element={<Geoportal />} />
          <Route path="/story-maps" element={<StoryMaps />} />
          
          {/* Rute Detail Story Map */}
          <Route path="/story-maps/:slug" element={<StoryMapDetail />} />
          
          <Route path="/jign" element={<Jign />} />
          <Route path="/informasi" element={<Informasi />} />
          <Route path="/layanan" element={<Layanan />} />
          <Route path="/kontak" element={<Kontak />} />

          {/* Rute Auth */}
          <Route path="/login" element={<Login />} />

          {/* Rute Admin Menggunakan Layout TailAdmin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Halaman default saat membuka /admin */}
            <Route index element={<AdminDashboard />} />
            
            {/* Rute Manajemen Data */}
            <Route path="datasets" element={<ListDataset />} />
            <Route path="kategori" element={<Kategori />} />
            <Route path="layers" element={<Layers />} />
            
            {/* Rute Konten & Pengguna */}
            <Route path="berita" element={<Berita />} />
            <Route path="pengguna" element={<Pengguna />} />
            <Route path="skpd" element={<Skpd />} />
            <Route path="pengaturan" element={<Pengaturan />} />
            
            {/* Rute Profil & Pengaturan Akun */}
            <Route path="profile" element={<Profile />} />
            <Route path="pengaturan-akun" element={<AccountSettings />} /> 
          </Route>

          {/* 2. Rute 404 Catch-All (Wajib di paling bawah) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}