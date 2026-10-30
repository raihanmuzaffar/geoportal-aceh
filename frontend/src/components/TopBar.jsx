import { Mail, Phone, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TopBar() {
  return (
    // z-[10000] memastikan TopBar berada di atas Navbar dan Peta
    <div
      className="text-[12.5px] relative z-[10000]"
      style={{ background: '#0C2744', color: '#C5D3E4', fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}
    >
      <style>{`
        .topbar-link { transition: color .15s; }
        .topbar-link:hover { color: #fff; }
        .topbar-link:focus-visible { outline: 2px solid #B8902F; outline-offset: 3px; }
        .topbar-login { transition: background-color .15s, border-color .15s, color .15s; }
        .topbar-login:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.55); color: #fff; }
        .topbar-login:focus-visible { outline: 2px solid #B8902F; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          .topbar-link, .topbar-login { transition: none; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <a href="mailto:diskominfo@acehprov.go.id" className="topbar-link flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">diskominfo@acehprov.go.id</span>
            <span className="sm:hidden">Email</span>
          </a>
          <a href="tel:+62651123456" className="topbar-link flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            (0651) 123456
          </a>
        </div>

        <Link
          to="/login"
          className="topbar-login flex items-center gap-1.5 px-3 py-1 font-medium"
          style={{ border: '1px solid rgba(255,255,255,.3)', borderRadius: 2 }}
        >
          <LogIn className="w-3.5 h-3.5" />
          Masuk
        </Link>
      </div>
    </div>
  );
}