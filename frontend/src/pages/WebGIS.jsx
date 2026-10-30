import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MapContainer, TileLayer, GeoJSON, ZoomControl, ScaleControl, 
  useMap, useMapEvents, CircleMarker, Popup, Polyline, Polygon 
} from 'react-leaflet';
import L from 'leaflet';
import * as turf from '@turf/turf';
import html2canvas from 'html2canvas';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { 
  Search, Layers, ChevronLeft, ChevronRight, MapPin, 
  AlertTriangle, RotateCcw, Loader2, X, ChevronDown, ChevronUp, 
  Activity, Printer, Ruler, Square, Trash2 
} from 'lucide-react';

// Perbaikan ikon Leaflet default
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/* Palet Warna */
const C = {
  navy: '#12355B',
  blue: '#1F5A99',
  gold: '#B8902F',
  bg: '#F3F5F8',
  line: '#D5DBE3',
  text: '#1B2733',
  muted: '#5B6877',
  high: '#B42318',
  mid: '#C27803',
};

const centerAceh = [4.695135, 96.749399];
const PANEL_W = 340;
const DEFAULT_COLOR = '#1e40af';

const basemaps = {
  osm: { label: 'Jalan', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap' },
  satellite: { label: 'Citra satelit', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '&copy; Esri' },
  dark: { label: 'Gelap', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attribution: '&copy; CartoDB' },
};

const lokasi = [
  { name: 'Banda Aceh', coord: [5.5483, 95.3238] },
  { name: 'Sabang', coord: [5.8947, 95.3222] },
  { name: 'Lhokseumawe', coord: [5.1801, 97.1411] },
  { name: 'Langsa', coord: [4.4683, 97.9683] },
  { name: 'Takengon', coord: [4.6335, 96.8447] },
  { name: 'Meulaboh', coord: [4.1363, 96.1285] },
];

/* Fungsi Helper Popup */
const esc = (v) => {
  const s = v !== null && typeof v === 'object' ? JSON.stringify(v) : String(v ?? '');
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
};
const humanize = (key) => esc(String(key).replace(/_/g, ' '));
const buildPopup = (properties) => {
  const rows = Object.entries(properties)
    .map(([key, val]) => `<tr><th scope="row">${humanize(key)}</th><td>${esc(val)}</td></tr>`)
    .join('');
  return `<div class="gis-popup"><table>${rows}</table></div>`;
};

/* Komponen Leaflet */
function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target.coord, 11, { duration: 1.1 });
  }, [target, map]);
  return null;
}

function FitTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target && target.bounds) map.fitBounds(target.bounds, { padding: [40, 40], maxZoom: 14, duration: 0.8 });
  }, [target, map]);
  return null;
}

function ResizeFix({ open }) {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 320);
    return () => clearTimeout(t);
  }, [open, map]);
  return null;
}

function CoordReadout() {
  const [pos, setPos] = useState(null);
  useMapEvents({
    mousemove: (e) => setPos(e.latlng),
    mouseout: () => setPos(null),
  });
  const fmt = (v, p, n) => `${Math.abs(v).toFixed(5)}° ${v >= 0 ? p : n}`;
  return (
    <div className="gis-readout">
      {pos ? `${fmt(pos.lat, 'LU', 'LS')}   ${fmt(pos.lng, 'BT', 'BB')}` : 'Arahkan kursor ke peta'}
    </div>
  );
}

function MeasureEvents({ isMeasuring, measurePoints, setMeasurePoints }) {
  useMapEvents({
    click(e) {
      if (isMeasuring) {
        setMeasurePoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
      }
    },
  });
  return null;
}

/* Komponen UI Sidebar */
function Section({ title, aside, children }) {
  return (
    <section style={{ borderBottom: `1px solid ${C.line}` }} className="px-4 py-3.5">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-[13px] font-bold uppercase tracking-wider" style={{ color: C.navy }}>{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

export default function WebGIS() {
  const [dbLayers, setDbLayers] = useState([]);
  const [activeGeoData, setActiveGeoData] = useState({});
  const [opacities, setOpacities] = useState({});
  const [loadingIds, setLoadingIds] = useState({});
  const [loadingLayers, setLoadingLayers] = useState(true);
  const [error, setError] = useState(false);
  const [mapNotice, setMapNotice] = useState('');

  // State BMKG
  const [gempaData, setGempaData] = useState([]);
  const [showGempa, setShowGempa] = useState(false);

  // State Alat Ukur (Measure)
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureMode, setMeasureMode] = useState('distance'); // 'distance' atau 'area'
  const [measurePoints, setMeasurePoints] = useState([]);

  const [basemap, setBasemap] = useState('osm');
  const [open, setOpen] = useState(true);
  const [queryLokasi, setQueryLokasi] = useState('');
  const [target, setTarget] = useState(null);
  const [fitTarget, setFitTarget] = useState(null);
  
  const [layerSearch, setLayerSearch] = useState('');
  const [expandedCats, setExpandedCats] = useState({});

  const loadingMapData = Object.keys(loadingIds).length > 0;
  const activeCount = Object.keys(activeGeoData).length;

  const geoJsonRefs = useRef({});

  // Fetch Data BMKG
  useEffect(() => {
    api.get('/bmkg/gempa-terkini')
      .then(res => {
        const gempaList = res.data?.Infogempa?.gempa || [];
        setGempaData(gempaList);
      })
      .catch(err => console.error("Gagal load BMKG:", err));
  }, []);

  const fetchLayerGeojson = (layer, autoFit = false) => {
    setLoadingIds((prev) => ({ ...prev, [layer.id]: true }));
    api.get(`/layers/${layer.id}/geojson`)
      .then((res) => {
        setActiveGeoData((prev) => ({ ...prev, [layer.id]: res.data }));
        setOpacities(prev => ({ ...prev, [layer.id]: prev[layer.id] ?? 0.3 }));
        if (autoFit) {
          try {
            const bounds = L.geoJSON(res.data).getBounds();
            if (bounds.isValid()) setFitTarget({ bounds, key: Date.now() });
          } catch (e) {}
        }
      })
      .catch((err) => {
        setMapNotice(`Data spasial untuk layer “${layer.name}” gagal dimuat.`);
      })
      .finally(() => {
        setLoadingIds((prev) => {
          const next = { ...prev };
          delete next[layer.id];
          return next;
        });
      });
  };

  const fetchLayersList = () => {
    setLoadingLayers(true);
    setError(false);
    api.get('/layers')
      .then((res) => {
        const layers = res.data.data;
        setDbLayers(layers);
        
        if (layers.length > 0) {
          const firstCat = layers[0].dataset?.category?.name || 'Lainnya';
          setExpandedCats({ [firstCat]: true });
        }

        if (layers.length > 0) {
          const defaultLayer = layers.find(l => l.is_visible_by_default) || layers[0];
          if (defaultLayer) fetchLayerGeojson(defaultLayer, true);
        }
      })
      .catch((err) => setError(true))
      .finally(() => setLoadingLayers(false));
  };

  useEffect(() => { fetchLayersList(); }, []);

  useEffect(() => {
    if (!mapNotice) return;
    const t = setTimeout(() => setMapNotice(''), 6000);
    return () => clearTimeout(t);
  }, [mapNotice]);

  const handleOpacityChange = (layerId, value) => {
    setOpacities(prev => ({ ...prev, [layerId]: value }));
    if (geoJsonRefs.current[layerId]) {
      geoJsonRefs.current[layerId].setStyle({ fillOpacity: value });
    }
  };

  const toggleLayer = (layer) => {
    if (loadingIds[layer.id]) return;
    const isActive = !!activeGeoData[layer.id];
    if (isActive) {
      setActiveGeoData((prev) => {
        const newState = { ...prev };
        delete newState[layer.id];
        return newState;
      });
    } else {
      fetchLayerGeojson(layer, true); 
    }
  };

  const toggleCat = (catName) => {
    setExpandedCats(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  const hasilLokasi = useMemo(() => {
    const q = queryLokasi.trim().toLowerCase();
    return q ? lokasi.filter((l) => l.name.toLowerCase().includes(q)) : [];
  }, [queryLokasi]);

  const pilihLokasi = (l) => {
    setTarget({ ...l });
    setQueryLokasi(l.name);
  };

  const groupedLayers = useMemo(() => {
    const filtered = dbLayers.filter(l => l.name.toLowerCase().includes(layerSearch.toLowerCase()));
    const groups = {};
    filtered.forEach(layer => {
      const catName = layer.dataset?.category?.name || 'Layer Referensi';
      if (!groups[catName]) groups[catName] = [];
      groups[catName].push(layer);
    });
    return groups;
  }, [dbLayers, layerSearch]);

  const activeLayers = dbLayers.filter((l) => activeGeoData[l.id]);

  // FUNGSI CETAK PETA
  const handlePrint = () => {
    const mapElement = document.querySelector('.leaflet-container');
    if (!mapElement) return;

    html2canvas(mapElement, {
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      const link = document.createElement('a');
      link.download = `Peta_Geoportal_Aceh_${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  // FUNGSI UKUR
  const toggleMeasure = (mode) => {
    if (isMeasuring && measureMode === mode) {
      setIsMeasuring(false);
      setMeasurePoints([]);
    } else {
      setIsMeasuring(true);
      setMeasureMode(mode);
      setMeasurePoints([]);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: C.bg, fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap');

        .gis-panel { transition: margin-left .3s cubic-bezier(.4,0,.2,1); }
        .gis-toggle { transition: left .3s cubic-bezier(.4,0,.2,1), background-color .15s; }
        .gis-toggle:hover { background:${C.blue}; }

        /* Custom Checkbox */
        .gis-check { position:relative; display:flex; align-items:flex-start; gap:10px; padding:6px 0; cursor:pointer; }
        .gis-check input[type="checkbox"] { position:absolute; opacity:0; pointer-events:none; }
        .gis-box { width:16px; height:16px; margin-top:2px; border:1.5px solid #8A96A6; border-radius:2px; background:#fff;
                   display:grid; place-items:center; transition: background-color .15s, border-color .15s; flex:none; }
        .gis-box::after { content:''; width:8px; height:4px; border-left:2px solid #fff; border-bottom:2px solid #fff;
                          transform: rotate(-45deg) scale(0); margin-top:-2px; transition: transform .15s ease-out; }
        .gis-check input[type="checkbox"]:checked + .gis-box { background:${C.blue}; border-color:${C.blue}; }
        .gis-check input[type="checkbox"]:checked + .gis-box::after { transform: rotate(-45deg) scale(1); }

        .gis-slider { -webkit-appearance: none; width: 100%; height: 4px; background: #E2E8F0; border-radius: 2px; outline: none; margin-top: 4px; }
        .gis-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 12px; height: 12px; border-radius: 50%; background: ${C.navy}; cursor: pointer; }
        
        .gis-seg button { transition: background-color .15s, color .15s; }
        .gis-seg button:focus-visible, .gis-toggle:focus-visible, .gis-item:focus-visible, .gis-link:focus-visible { outline:2px solid ${C.gold}; outline-offset:-2px; }

        .gis-item { transition: background-color .12s; }
        .gis-item:hover { background:#E8EEF6; }
        .gis-link { color:${C.blue}; font-size:12.5px; font-weight:600; }
        .gis-link:hover { text-decoration:underline; }

        .gis-readout { position:absolute; left:0; bottom:0; z-index:1000; pointer-events:none;
                       background:rgba(18,53,91,.92); color:#fff; font-size:12px; padding:4px 12px;
                       font-variant-numeric: tabular-nums; white-space:pre; }

        .gis-progress { position:absolute; top:0; left:0; right:0; height:3px; z-index:1000; overflow:hidden; background:rgba(31,90,153,.15); }
        .gis-progress::after { content:''; position:absolute; inset:0 auto 0 0; width:35%; background:${C.blue};
                               animation: gis-slide 1.2s ease-in-out infinite; }
        @keyframes gis-slide { from { transform:translateX(-100%);} to { transform:translateX(300%);} }

        .gis-notice { animation: gis-pop .22s ease-out both; }

        .leaflet-popup-content-wrapper { border-radius:3px; box-shadow:0 2px 8px rgba(0,0,0,.2); border-top:3px solid ${C.gold}; }
        .leaflet-popup { animation: gis-pop .18s ease-out; }
        @keyframes gis-pop { from { opacity:0; transform:translateY(4px);} to { opacity:1; transform:none;} }
        .leaflet-bar a { color:${C.navy}; }
        .gis-popup { font-family:inherit; font-size:12.5px; max-height:170px; overflow-y:auto; color:${C.text}; }
        .gis-popup table { border-collapse:collapse; }
        .gis-popup th { text-align:left; font-weight:600; padding:2px 10px 2px 0; vertical-align:top; color:${C.navy}; text-transform:capitalize; white-space:nowrap; }
        .gis-popup td { padding:2px 0; word-break:break-word; }

        @media (max-width: 767px) { .gis-panel { box-shadow: 2px 0 8px rgba(0,0,0,.18); } }

        @media (prefers-reduced-motion: reduce) {
          .gis-panel, .gis-toggle, .gis-box, .gis-box::after, .leaflet-popup, .gis-notice { transition:none; animation:none; }
          .gis-progress::after { animation-duration:3s; }
        }
      `}</style>

      <TopBar />
      <Navbar />

      <div className="flex-grow relative flex min-h-0 z-0" style={{ height: 'calc(100vh - 108px)' }}>
        
        <aside
          className="gis-panel flex flex-col h-full bg-white z-20 flex-none absolute md:relative"
          style={{ width: PANEL_W, marginLeft: open ? 0 : -PANEL_W, borderRight: `1px solid ${C.line}` }}
          aria-label="Panel peta"
        >
          <header className="px-4 py-3" style={{ background: C.navy, borderBottom: `3px solid ${C.gold}` }}>
            <div className="flex items-center gap-2 text-white">
              <Layers className="w-[18px] h-[18px]" />
              <h2 className="text-[15px] font-semibold">Katalog Peta</h2>
            </div>
            <p className="text-[12px] mt-1" style={{ color: '#C5D3E4' }}>
              Pilih layer untuk ditampilkan pada peta.
            </p>
          </header>

          <div className="flex-1 overflow-y-auto">
            
            <Section title="Cari Wilayah">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.muted }} />
                <input
                  type="search"
                  value={queryLokasi}
                  onChange={(e) => setQueryLokasi(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && hasilLokasi.length > 0) pilihLokasi(hasilLokasi[0]); }}
                  placeholder="Ketik nama kota/kabupaten..."
                  className="w-full pl-8 pr-3 py-1.5 text-[13px] bg-white outline-none"
                  style={{ border: `1px solid #A9B3C0`, borderRadius: 3, color: C.text }}
                />
              </div>
              {queryLokasi.trim() !== '' && hasilLokasi.length > 0 && (
                <ul className="mt-1" style={{ border: `1px solid ${C.line}`, borderRadius: 3 }}>
                  {hasilLokasi.map((l) => (
                    <li key={l.name} style={{ borderTop: `1px solid ${C.line}` }} className="first:border-t-0">
                      <button type="button" onClick={() => pilihLokasi(l)} className="w-full text-left px-3 py-1.5 text-[13px] flex items-center gap-2 hover:bg-gray-100">
                        <MapPin className="w-3.5 h-3.5" style={{ color: C.blue }} /> {l.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            {/* BMKG INFO */}
            <Section title="Informasi Bencana" aside={<span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold">LIVE</span>}>
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showGempa} 
                    onChange={(e) => setShowGempa(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-red-300 focus:ring-red-500"
                  />
                  <span className="text-[13px] font-bold text-red-800 flex items-center gap-1">
                    <Activity className="w-4 h-4" /> Gempa Terkini (BMKG)
                  </span>
                </label>
                {showGempa && gempaData.length > 0 && (
                  <p className="text-[11px] text-red-600 mt-2">
                    Menampilkan {gempaData.length} gempa terbaru di Indonesia.
                  </p>
                )}
              </div>
            </Section>

            <Section 
              title="Katalog Layer" 
              aside={activeCount > 0 && <button className="text-[11px] text-red-600 hover:underline" onClick={() => setActiveGeoData({})}>Reset</button>}
            >
              <div className="relative mb-3">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: C.muted }} />
                <input
                  type="search"
                  value={layerSearch}
                  onChange={(e) => setLayerSearch(e.target.value)}
                  placeholder="Cari nama layer..."
                  className="w-full pl-7 pr-3 py-1.5 text-[12px] bg-gray-50 outline-none focus:bg-white transition-colors"
                  style={{ border: `1px solid ${C.line}`, borderRadius: 3, color: C.text }}
                />
              </div>

              {loadingLayers ? (
                <div className="flex items-center gap-2 text-[13px] py-4 justify-center" style={{ color: C.muted }}>
                  <Loader2 className="w-4 h-4 animate-spin" /> Memuat katalog...
                </div>
              ) : Object.keys(groupedLayers).length === 0 ? (
                <div className="text-[13px] py-4 text-center" style={{ color: C.muted }}>
                  Layer tidak ditemukan.
                </div>
              ) : (
                Object.entries(groupedLayers).map(([category, layers]) => (
                  <div key={category} className="mb-2 border border-gray-200 rounded-sm overflow-hidden">
                    <button 
                      onClick={() => toggleCat(category)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-[12.5px] font-bold" style={{ color: C.navy }}>{category}</span>
                      {expandedCats[category] ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>

                    {expandedCats[category] && (
                      <div className="p-2 space-y-1 bg-white">
                        {layers.map(layer => {
                          const isActive = !!activeGeoData[layer.id];
                          return (
                            <div key={layer.id} className="border-b border-gray-100 last:border-0 pb-2 mb-2 last:pb-0 last:mb-0">
                              <label className="gis-check">
                                <input type="checkbox" checked={isActive} onChange={() => toggleLayer(layer)} />
                                <span className="gis-box" aria-hidden="true" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-[13px] font-semibold text-slate-800 leading-tight">{layer.name}</div>
                                  <div className="text-[11px] text-gray-500 mt-0.5">
                                    {layer.dataset?.skpd?.short_name || 'Instansi'} • {layer.feature_count} Fitur
                                  </div>
                                </div>
                                {loadingIds[layer.id] && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 mt-1" />}
                              </label>
                              
                              {isActive && (
                                <div className="pl-7 pr-1 mt-1">
                                  <input 
                                    type="range" min="0" max="1" step="0.1" 
                                    value={opacities[layer.id] ?? 0.3} 
                                    onChange={(e) => handleOpacityChange(layer.id, parseFloat(e.target.value))}
                                    className="gis-slider"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </Section>

            <Section title="Legenda Aktif">
              {activeLayers.length === 0 && !showGempa ? (
                <div className="text-[12px] text-gray-500 italic">Belum ada layer yang aktif.</div>
              ) : (
                <ul className="space-y-2 text-[12.5px]" style={{ color: C.text }}>
                  {activeLayers.map((l) => {
                    const color = activeGeoData[l.id].style?.color || DEFAULT_COLOR;
                    return (
                      <li key={l.id} className="flex items-start gap-2.5">
                        <span className="w-4 h-3 flex-none mt-0.5" style={{ background: `${color}55`, border: `2px solid ${color}` }} />
                        <span className="leading-tight">{l.name}</span>
                      </li>
                    );
                  })}
                  {showGempa && (
                     <li className="flex items-start gap-2.5">
                      <span className="w-3 h-3 flex-none mt-0.5 rounded-full bg-red-500 border-2 border-white shadow-sm" />
                      <span className="leading-tight">Gempa Terkini (BMKG)</span>
                    </li>
                  )}
                </ul>
              )}
            </Section>
          </div>

          <footer className="px-4 py-2 text-[11px] text-center" style={{ background: C.bg, borderTop: `1px solid ${C.line}`, color: C.muted }}>
            OneMap Geoportal Aceh v1.0
          </footer>
        </aside>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="gis-toggle absolute top-3 z-30 flex items-center justify-center w-6 h-12 text-white"
          style={{ left: open ? PANEL_W : 0, background: C.navy, borderRadius: '0 3px 3px 0' }}
        >
          {open ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <div className="flex-1 relative min-w-0 z-0" style={{ background: '#DDE3EA' }}>
          {(loadingLayers || loadingMapData) && <div className="gis-progress" />}

          {/* PANEL KONTROL KANAN (Basemap, Cetak, Ukur) */}
          <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
            
            {/* Basemap */}
            <div className="bg-white" style={{ border: `1px solid ${C.line}`, borderRadius: 3, boxShadow: '0 1px 4px rgba(0,0,0,.15)' }}>
              <p className="px-3 pt-1.5 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: C.muted }}>Basemap</p>
              <div className="gis-seg flex p-1.5 pt-0 gap-1">
                {Object.entries(basemaps).map(([key, b]) => (
                  <button key={key} onClick={() => setBasemap(key)} className="px-2.5 py-1 text-[12px] font-medium"
                    style={{ borderRadius: 2, background: basemap === key ? C.navy : C.bg, color: basemap === key ? '#fff' : C.text, border: `1px solid ${basemap === key ? C.navy : C.line}` }}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools (Cetak & Ukur) */}
            <div className="bg-white flex flex-col gap-1 p-1.5" style={{ border: `1px solid ${C.line}`, borderRadius: 3, boxShadow: '0 1px 4px rgba(0,0,0,.15)' }}>
              
              {/* Cetak */}
              <button onClick={handlePrint} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-gray-700 text-sm transition-colors" title="Cetak Peta">
                <Printer className="w-4 h-4" /> Cetak
              </button>
              
              <div className="h-px bg-gray-200 my-1"></div>

              {/* Ukur Jarak */}
              <button 
                onClick={() => toggleMeasure('distance')} 
                className={`flex items-center gap-2 p-2 rounded text-sm transition-colors ${isMeasuring && measureMode === 'distance' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`} 
                title="Ukur Jarak"
              >
                <Ruler className="w-4 h-4" /> Jarak
              </button>
              
              {/* Ukur Luas */}
              <button 
                onClick={() => toggleMeasure('area')} 
                className={`flex items-center gap-2 p-2 rounded text-sm transition-colors ${isMeasuring && measureMode === 'area' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`} 
                title="Ukur Luas"
              >
                <Square className="w-4 h-4" /> Luas
              </button>

            </div>
          </div>

          {/* PANEL HASIL UKUR */}
          {isMeasuring && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded shadow-lg border border-blue-200 flex items-center gap-4">
              <div className="text-sm font-semibold text-gray-800">
                {measureMode === 'distance' ? 'Jarak: ' : 'Luas: '}
                <span className="text-blue-600">
                  {measureMode === 'distance' && measurePoints.length > 1 ? (
                    `${turf.length(turf.lineString(measurePoints.map(p => [p[1], p[0]])), { units: 'kilometers' }).toFixed(2)} km`
                  ) : measureMode === 'area' && measurePoints.length > 2 ? (
                    `${(turf.area(turf.polygon([[...measurePoints.map(p => [p[1], p[0]]), [measurePoints[0][1], measurePoints[0][0]]]])) / 10000).toFixed(2)} Hektar`
                  ) : (
                    'Klik pada peta'
                  )}
                </span>
              </div>
              <button onClick={() => { setMeasurePoints([]); setIsMeasuring(false); }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {mapNotice && !error && (
            <div className="gis-notice absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-white flex items-center gap-3 px-3 py-2 text-[13px] border-l-4" style={{ borderColor: C.mid, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              <AlertTriangle className="w-4 h-4 flex-none" style={{ color: C.mid }} />
              <span className="flex-1">{mapNotice}</span>
              <button onClick={() => setMapNotice('')} className="flex-none p-0.5 text-gray-400 hover:text-gray-700"><X className="w-4 h-4" /></button>
            </div>
          )}

          <MapContainer 
            center={centerAceh} 
            zoom={8} 
            style={{ width: '100%', height: '100%' }} 
            zoomControl={false}
            preferCanvas={true}
          >
            <FlyTo target={target} />
            <FitTo target={fitTarget} />
            <ResizeFix open={open} />
            
            {/* Event Handler untuk Alat Ukur */}
            <MeasureEvents isMeasuring={isMeasuring} measurePoints={measurePoints} setMeasurePoints={setMeasurePoints} />

            <TileLayer key={basemap} url={basemaps[basemap].url} attribution={basemaps[basemap].attribution} />

            {/* RENDER LAYER SPASIAL */}
            {Object.keys(activeGeoData).map((layerId) => {
              const geojson = activeGeoData[layerId];
              return (
                <GeoJSON
                  key={layerId}
                  ref={(ref) => { if (ref) geoJsonRefs.current[layerId] = ref; }}
                  data={geojson}
                  style={{
                    color: geojson.style?.color || DEFAULT_COLOR,
                    weight: geojson.style?.weight || 2,
                    fillColor: geojson.style?.color || '#3b82f6',
                    fillOpacity: opacities[layerId] ?? 0.3,
                  }}
                  pointToLayer={(feature, latlng) => {
                    return L.circleMarker(latlng, {
                      radius: 5,
                      fillColor: geojson.style?.color || '#ea580c',
                      color: '#ffffff',
                      weight: 1.5,
                      opacity: 1,
                      fillOpacity: 0.9
                    });
                  }}
                  onEachFeature={(feature, layer) => {
                    if (feature.properties && Object.keys(feature.properties).length > 0) {
                      layer.bindPopup(buildPopup(feature.properties));
                    }
                  }}
                />
              );
            })}

            {/* RENDER GEMPA BMKG */}
            {showGempa && gempaData.map((gempa, index) => {
              const coordStr = gempa.Coordinates;
              let lat = 0, lng = 0;
              
              if (coordStr) {
                const parts = coordStr.split(' - ');
                if (parts.length === 2) {
                  const latPart = parts[0].trim();
                  lat = parseFloat(latPart.replace('LS', '').replace('LU', '').trim());
                  if (latPart.includes('LS')) lat = -lat;
                  
                  const lngPart = parts[1].trim();
                  lng = parseFloat(lngPart.replace('BT', '').replace('BB', '').trim());
                  if (lngPart.includes('BB')) lng = -lng;
                }
              }

              if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return null;

              const mag = parseFloat(gempa.Magnitude) || 0;
              const radius = mag * 3; 

              return (
                <CircleMarker 
                  key={index}
                  center={[lat, lng]}
                  radius={radius}
                  pathOptions={{ 
                    color: '#ffffff', 
                    weight: 1, 
                    fillColor: '#ef4444', 
                    fillOpacity: 0.8 
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong className="text-red-600 block mb-1">Gempa {gempa.Magnitude} SR</strong>
                      <span className="block text-gray-700">{gempa.Wilayah}</span>
                      <span className="block text-gray-500 text-xs mt-1">Kedalaman: {gempa.Kedalaman}</span>
                      <span className="block text-gray-500 text-xs">Waktu: {gempa.Tanggal}, {gempa.Jam}</span>
                      <span className="block text-gray-500 text-xs mt-1">Potensi: {gempa.Potensi}</span>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}

            {/* RENDER HASIL UKUR */}
            {isMeasuring && measurePoints.length > 0 && (
              <>
                {measureMode === 'distance' ? (
                  <Polyline positions={measurePoints} pathOptions={{ color: '#3b82f6', weight: 3, dashArray: '5,5' }} />
                ) : (
                  <Polygon positions={measurePoints} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.3 }} />
                )}
                {measurePoints.map((p, i) => (
                  <CircleMarker key={i} center={p} radius={5} pathOptions={{ color: '#3b82f6', fillColor: '#fff', fillOpacity: 1 }} />
                ))}
              </>
            )}

            <ZoomControl position="bottomright" />
            <ScaleControl position="bottomleft" imperial={false} />
            <CoordReadout />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}