import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, useMap, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { ChevronRight, ChevronUp, ChevronDown, Film, AlertTriangle, RotateCcw, Loader2 } from 'lucide-react';

// Perbaikan ikon Leaflet default
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GOLD = '#B8902F';
const NAVY = '#12355B';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Garis kontur tipis bertema peta untuk pita judul */
function ContourPattern() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 600 300"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="#FFFFFF"
      strokeOpacity="0.07"
      strokeWidth="1.2"
    >
      <path d="M-40 250 C 80 180, 180 220, 280 150 S 480 70, 660 130" />
      <path d="M-40 280 C 90 210, 190 250, 290 180 S 490 100, 660 160" />
      <path d="M-40 310 C 100 240, 200 280, 300 210 S 500 130, 660 190" />
      <path d="M-40 220 C 70 150, 170 190, 270 120 S 470 40, 660 100" />
      <path d="M-40 190 C 60 120, 160 160, 260 90 S 460 10, 660 70" />
    </svg>
  );
}

// Komponen untuk menggerakkan peta saat scroll
function MapController({ activeStep }) {
  const map = useMap();
  useEffect(() => {
    if (activeStep && activeStep.center_lat != null && activeStep.center_lng != null) {
      const pos = [activeStep.center_lat, activeStep.center_lng];
      if (prefersReducedMotion()) {
        map.setView(pos, activeStep.zoom || 8);
      } else {
        map.flyTo(pos, activeStep.zoom || 8, { duration: 1.5 });
      }
    }
  }, [activeStep, map]);
  return null;
}

/* Kerangka halaman: bar atas, navigasi, dan gaya bersama */
function Shell({ children }) {
  return (
    <div
      className="flex min-h-screen flex-col bg-[#F3F5F8]"
      style={{ fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}
    >
      <style>{`
        @keyframes sd-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes sd-rise { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        .sd-fade { animation: sd-fade .5s ease-out both }
        .sd-rise { animation: sd-rise .4s cubic-bezier(.2,.8,.2,1) both }
        .sd-step { transition: opacity .35s ease, border-color .35s ease, box-shadow .35s ease; }
        .leaflet-popup-content-wrapper { border-radius: 3px; border-top: 3px solid ${GOLD}; }
        .leaflet-bar a { color: ${NAVY}; }
        @media (prefers-reduced-motion: reduce) {
          .sd-fade, .sd-rise { animation: none }
          .sd-step { transition: none }
        }
      `}</style>
      <TopBar />
      <Navbar />
      {children}
    </div>
  );
}

export default function StoryMapDetail() {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(null);

  // Ref untuk setiap section teks agar bisa dideteksi saat di-scroll
  const stepRefs = useRef([]);

  const loadStory = () => {
    setLoading(true);
    setError('');
    api.get(`/story-maps/${slug}`)
      .then((res) => {
        const data = res.data.data;
        setStory(data);
        if (data.steps && data.steps.length > 0) {
          setActiveStep(data.steps[0]); // Set step pertama sebagai default
        }
      })
      .catch((err) => {
        console.error(err);
        setStory(null);
        setError(err.response?.status === 404 ? 'notfound' : 'network');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Deteksi teks mana yang sedang dibaca (Intersection Observer)
  useEffect(() => {
    if (!story || !story.steps) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveStep(story.steps[index]);
          }
        });
      },
      { rootMargin: '-30% 0px -50% 0px' } // Aktif saat teks berada di tengah layar
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [story]);

  const goToStep = (index) => {
    const el = stepRefs.current[index];
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  };

  if (loading) {
    return (
      <Shell>
        <div role="status" className="flex flex-grow items-center justify-center gap-2 text-sm font-medium text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" style={{ color: NAVY }} /> Memuat cerita...
        </div>
      </Shell>
    );
  }

  if (!story) {
    const notFound = error === 'notfound';
    return (
      <Shell>
        <div className="flex flex-grow items-center justify-center px-4 py-16">
          <div
            role="alert"
            className="w-full max-w-md rounded-sm border border-gray-200 border-t-4 bg-white px-6 py-10 text-center"
            style={{ borderTopColor: notFound ? GOLD : '#B42318' }}
          >
            <AlertTriangle className={`mx-auto mb-3 h-9 w-9 ${notFound ? 'text-[#B8902F]' : 'text-red-700'}`} />
            <h1 className="text-lg font-bold text-gray-800">
              {notFound ? 'Cerita tidak ditemukan' : 'Cerita belum dapat dimuat'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {notFound
                ? 'Alamat yang Anda buka tidak sesuai dengan cerita peta mana pun.'
                : 'Terjadi kendala saat menghubungi server. Coba lagi beberapa saat.'}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {!notFound && (
                <button
                  onClick={loadStory}
                  className="inline-flex items-center gap-2 rounded-sm bg-[#12355B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1F5A99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8902F] focus-visible:ring-offset-2"
                >
                  <RotateCcw className="h-4 w-4" /> Muat ulang
                </button>
              )}
              <Link
                to="/story-maps"
                className="rounded-sm border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
              >
                Kembali ke katalog
              </Link>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  const steps = story.steps || [];
  const activeIndex = steps.findIndex((s) => s.id === activeStep?.id);

  return (
    <Shell>
      {/* Pita judul */}
      <div
        className="relative z-10 overflow-hidden px-4 py-10 md:py-12"
        style={{ backgroundColor: NAVY, borderBottom: `4px solid ${GOLD}` }}
      >
        <ContourPattern />
        <div className="sd-fade relative mx-auto max-w-[1200px]">
          <nav aria-label="Jejak halaman" className="mb-4 text-[13px] text-blue-100/80">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link to="/" className="transition-colors hover:text-white hover:underline">Beranda</Link>
              </li>
              <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
              <li>
                <Link to="/story-maps" className="transition-colors hover:text-white hover:underline">Story Maps</Link>
              </li>
              <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
              <li className="max-w-[40ch] truncate font-semibold text-white" aria-current="page">{story.title}</li>
            </ol>
          </nav>
          <h1 className="mb-3 max-w-3xl text-3xl font-bold leading-tight text-white md:text-4xl">{story.title}</h1>
          {story.description && (
            <p className="max-w-2xl text-[15px] leading-relaxed text-blue-100/85 md:text-base">{story.description}</p>
          )}
          {steps.length > 0 && (
            <p className="mt-4 text-[13px] text-blue-100/70">
              {steps.length} bab, gulir ke bawah untuk mengikuti cerita
            </p>
          )}
        </div>
      </div>

      {/* Konten dua kolom */}
      <div className="relative flex flex-grow flex-col lg:flex-row">
        {/* KANAN di desktop / ATAS di mobile: peta (sticky) */}
        <div
          className="sticky top-0 z-20 order-1 h-[40vh] w-full border-b border-gray-300 lg:top-[108px] lg:order-2 lg:h-[calc(100vh-108px)] lg:w-1/2 lg:border-b-0 lg:border-l"
        >
          <MapContainer
            center={[activeStep?.center_lat || 4.695135, activeStep?.center_lng || 96.749399]}
            zoom={activeStep?.zoom || 8}
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
            preferCanvas={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />

            {/* Marker penanda lokasi cerita */}
            {activeStep && activeStep.center_lat != null && activeStep.center_lng != null && (
              <Marker position={[activeStep.center_lat, activeStep.center_lng]}>
                <Popup>
                  <strong className="text-sm">{activeStep.title}</strong>
                </Popup>
              </Marker>
            )}

            <ZoomControl position="bottomright" />
            <MapController activeStep={activeStep} />
          </MapContainer>

          {/* Penunjuk bab dan navigasi */}
          {steps.length > 0 && activeIndex >= 0 && (
            <div
              className="absolute left-3 top-3 z-[1000] flex max-w-[calc(100%-1.5rem)] items-stretch bg-white"
              style={{ border: '1px solid #D5DBE3', borderLeft: `4px solid ${GOLD}`, borderRadius: 3, boxShadow: '0 1px 4px rgba(0,0,0,.15)' }}
            >
              <div className="min-w-0 px-3 py-1.5">
                <p className="text-[12px] text-gray-500">Bab {activeIndex + 1} dari {steps.length}</p>
                <p className="max-w-[220px] truncate text-[13.5px] font-semibold text-[#12355B]">{activeStep.title}</p>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  type="button"
                  onClick={() => goToStep(activeIndex - 1)}
                  disabled={activeIndex <= 0}
                  aria-label="Bab sebelumnya"
                  className="px-2 text-[#12355B] transition-colors hover:bg-[#EAF1F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B8902F] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(activeIndex + 1)}
                  disabled={activeIndex >= steps.length - 1}
                  aria-label="Bab berikutnya"
                  className="border-l border-gray-200 px-2 text-[#12355B] transition-colors hover:bg-[#EAF1F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B8902F] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* KIRI di desktop / BAWAH di mobile: teks cerita yang bisa digulir */}
        <div className="order-2 w-full bg-[#F3F5F8] pb-[40vh] lg:order-1 lg:w-1/2 lg:pb-[50vh]">
          <div className="mx-auto max-w-xl px-4 pt-12 lg:pt-16">
            {steps.map((step, index) => {
              const isActive = activeStep?.id === step.id;
              return (
                <article
                  key={step.id}
                  ref={(el) => (stepRefs.current[index] = el)}
                  data-index={index}
                  aria-current={isActive ? 'step' : undefined}
                  className={`sd-step mb-[45vh] rounded-sm border bg-white p-7 lg:mb-[60vh] ${
                    isActive
                      ? 'border-gray-300 opacity-100 shadow-md'
                      : 'border-gray-200 opacity-60 shadow-none'
                  }`}
                  style={{ borderLeft: `4px solid ${isActive ? GOLD : '#D5DBE3'}` }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-sm text-sm font-bold text-white"
                      style={{ backgroundColor: NAVY }}
                    >
                      {index + 1}
                    </span>
                    <span className="text-[13px] font-semibold text-gray-500">Bab {index + 1}</span>
                  </div>
                  <h2 className="mb-3 text-2xl font-bold leading-tight text-[#12355B]">{step.title}</h2>
                  <p className="whitespace-pre-line text-[15.5px] leading-relaxed text-gray-700">{step.content}</p>
                </article>
              );
            })}

            {/* Video dokumenter */}
            {story.video_url && (
              <section className="mb-10 rounded-sm border border-gray-200 border-t-4 bg-white p-5" style={{ borderTopColor: NAVY }}>
                <div className="mb-4 flex items-center gap-2.5 text-[#12355B]">
                  <Film className="h-5 w-5" />
                  <h3 className="text-lg font-bold">Video dokumenter</h3>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-gray-100">
                  <iframe
                    className="absolute left-0 top-0 h-full w-full"
                    src={story.video_url}
                    title={`Video dokumenter: ${story.title}`}
                    loading="lazy"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                {story.video_caption && (
                  <p className="mt-3 text-[13px] leading-relaxed text-gray-600">{story.video_caption}</p>
                )}
              </section>
            )}

            {/* Penutup */}
            <div
              className="rounded-sm p-7 text-center text-white"
              style={{ backgroundColor: NAVY, borderTop: `4px solid ${GOLD}` }}
            >
              <h3 className="mb-2 text-xl font-bold">Akhir cerita</h3>
              <p className="mb-5 text-sm text-blue-100/85">
                Terima kasih telah mengikuti alur cerita ini.
              </p>
              <Link
                to="/story-maps"
                className="inline-block rounded-sm bg-[#B8902F] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9A7522] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#12355B]"
              >
                Jelajahi cerita lain
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}