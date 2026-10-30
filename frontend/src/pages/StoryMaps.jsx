import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { BookOpen, ChevronRight, Map, AlertTriangle, RotateCcw } from 'lucide-react';

const GOLD = '#B8902F';
const NAVY = '#12355B';

/* Garis kontur tipis bertema peta, dipakai di pita judul dan sampul pengganti */
function ContourPattern({ opacity = 0.07 }) {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 600 300"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="#FFFFFF"
      strokeOpacity={opacity}
      strokeWidth="1.2"
    >
      <path d="M-40 250 C 80 180, 180 220, 280 150 S 480 70, 660 130" />
      <path d="M-40 280 C 90 210, 190 250, 290 180 S 490 100, 660 160" />
      <path d="M-40 310 C 100 240, 200 280, 300 210 S 500 130, 660 190" />
      <path d="M-40 220 C 70 150, 170 190, 270 120 S 470 40, 660 100" />
      <path d="M-40 190 C 60 120, 160 160, 260 90 S 460 10, 660 70" />
      <path d="M-40 160 C 50 90, 150 130, 250 60 S 450 -20, 660 40" />
    </svg>
  );
}

function StoryCard({ story, index }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasCover = story.cover_url && !imgFailed;

  return (
    <Link
      to={`/story-maps/${story.slug}`}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className="sm-card group flex flex-col overflow-hidden rounded-sm border border-gray-200 bg-white transition-all duration-200 hover:border-[#12355B]/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8902F] focus-visible:ring-offset-2"
    >
      <div className="relative h-44 overflow-hidden" style={{ backgroundColor: NAVY }}>
        {hasCover ? (
          <img
            src={story.cover_url}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <>
            <ContourPattern opacity={0.12} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Map className="h-10 w-10 text-white/40" />
            </div>
          </>
        )}
        <span
          className="absolute left-0 top-3 flex items-center gap-1.5 bg-[#12355B] px-3 py-1 text-xs font-semibold text-white"
          style={{ borderLeft: `3px solid ${GOLD}` }}
        >
          <Map className="h-3.5 w-3.5" /> Story map
        </span>
      </div>

      <div className="flex flex-grow flex-col p-5">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-[#12355B] transition-colors group-hover:text-[#1F5A99]">
          {story.title}
        </h3>
        <p className="mb-4 line-clamp-3 flex-grow text-sm leading-relaxed text-gray-600">
          {story.description}
        </p>
        <div className="mt-auto flex items-center gap-1 border-t border-gray-100 pt-3 text-sm font-semibold text-[#1F5A99]">
          Buka cerita
          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-sm border border-gray-200 bg-white" aria-hidden="true">
      <div className="sm-pulse h-44 bg-gray-200" />
      <div className="space-y-3 p-5">
        <div className="sm-pulse h-5 w-4/5 rounded-sm bg-gray-200" />
        <div className="sm-pulse h-3 w-full rounded-sm bg-gray-100" />
        <div className="sm-pulse h-3 w-11/12 rounded-sm bg-gray-100" />
        <div className="sm-pulse h-3 w-2/3 rounded-sm bg-gray-100" />
      </div>
    </div>
  );
}

export default function StoryMaps() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStories = () => {
    setLoading(true);
    setError(false);
    api.get('/story-maps')
      .then((res) => {
        setStories(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStories();
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col bg-[#F3F5F8]"
      style={{ fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}
    >
      <style>{`
        @keyframes sm-rise { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        @keyframes sm-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes sm-pulse { 0%, 100% { opacity: 1 } 50% { opacity: .55 } }
        .sm-card { animation: sm-rise .4s cubic-bezier(.2,.8,.2,1) both }
        .sm-hero { animation: sm-fade .5s ease-out both }
        .sm-pulse { animation: sm-pulse 1.6s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) {
          .sm-card, .sm-hero, .sm-pulse { animation: none }
          .sm-card img { transition: none }
        }
      `}</style>

      <TopBar />
      <Navbar />

      {/* Pita judul halaman */}
      <div
        className="relative overflow-hidden px-4 py-10 md:py-12"
        style={{ backgroundColor: NAVY, borderBottom: `4px solid ${GOLD}` }}
      >
        <ContourPattern />
        <div className="sm-hero relative mx-auto max-w-[1200px]">
          <nav aria-label="Jejak halaman" className="mb-4 text-[13px] text-blue-100/80">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link to="/" className="transition-colors hover:text-white hover:underline">
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li className="font-semibold text-white" aria-current="page">
                Story Maps
              </li>
            </ol>
          </nav>
          <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">Story Maps Aceh</h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-blue-100/85">
            Narasi visual interaktif yang memadukan peta, teks, dan multimedia untuk menjelaskan
            isu-isu penting di Provinsi Aceh.
          </p>
        </div>
      </div>

      {/* Konten utama */}
      <main className="mx-auto w-full max-w-[1200px] flex-grow px-4 py-10 md:py-12">
        {loading ? (
          <div role="status" aria-label="Memuat data">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="mx-auto max-w-xl rounded-sm border border-gray-200 border-t-4 bg-white px-6 py-12 text-center"
            style={{ borderTopColor: '#B42318' }}
          >
            <AlertTriangle className="mx-auto mb-3 h-9 w-9 text-red-700" />
            <h2 className="text-lg font-bold text-gray-800">Data belum dapat dimuat</h2>
            <p className="mt-1 text-sm text-gray-600">
              Terjadi kendala saat menghubungi server. Periksa koneksi Anda lalu coba lagi.
            </p>
            <button
              onClick={loadStories}
              className="mt-5 inline-flex items-center gap-2 rounded-sm bg-[#12355B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1F5A99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8902F] focus-visible:ring-offset-2"
            >
              <RotateCcw className="h-4 w-4" /> Muat ulang
            </button>
          </div>
        ) : stories.length === 0 ? (
          <div
            className="mx-auto max-w-xl rounded-sm border border-gray-200 border-t-4 bg-white px-6 py-14 text-center"
            style={{ borderTopColor: GOLD }}
          >
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <h2 className="text-lg font-bold text-gray-700">Belum ada Story Maps</h2>
            <p className="mt-1 text-sm text-gray-500">
              Cerita peta akan tampil di sini setelah ditambahkan melalui Panel Admin.
            </p>
          </div>
        ) : (
          <>
            <div
              className="mb-6 flex items-center justify-between border-b pb-3"
              style={{ borderColor: '#D5DBE3' }}
            >
              <p className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-[#12355B]">{stories.length}</span> cerita peta
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story, i) => (
                <StoryCard key={story.id} story={story} index={i} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}