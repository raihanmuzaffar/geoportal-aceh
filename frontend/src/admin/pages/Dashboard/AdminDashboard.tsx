import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Database, Building2, Users, FolderTree, Calendar, AlertTriangle, RotateCcw } from "lucide-react";
import api from "../../../api/axios";
import ReactApexChart from "react-apexcharts";

const NAVY = "#12355B";
const BLUE = "#1F5A99";
const GOLD = "#B8902F";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_datasets: 0,
    total_skpd: 0,
    total_users: 0,
    total_categories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStats = () => {
    setLoading(true);
    setError(false);
    api
      .get("/dashboard/stats")
      .then((res: any) => setStats(res.data.data))
      .catch((err: any) => {
        console.error("Gagal load statistik", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadStats, []);

  const cards = [
    { title: "Total dataset", value: stats.total_datasets, icon: Database },
    { title: "Instansi (SKPD)", value: stats.total_skpd, icon: Building2 },
    { title: "Pengguna sistem", value: stats.total_users, icon: Users },
    { title: "Kategori data", value: stats.total_categories, icon: FolderTree },
  ];

  // --- DATA DUMMY UNTUK GRAFIK & TABEL (nanti diganti dengan API) ---
  const barChartOptions: any = {
    chart: { type: "bar", fontFamily: "inherit", toolbar: { show: false }, animations: { speed: 500 } },
    colors: [NAVY],
    plotOptions: { bar: { horizontal: false, columnWidth: "36%", borderRadius: 2 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: ["Batas Wilayah", "Transportasi", "Hidrografi", "Vegetasi", "Geologi"],
      labels: { style: { colors: "#667085", fontSize: "12px" } },
      axisBorder: { color: "#D5DBE3" },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: "#667085", fontSize: "12px" } } },
    grid: { borderColor: "#E6EAF0", strokeDashArray: 0 },
    fill: { opacity: 1 },
  };
  const barChartSeries = [{ name: "Jumlah dataset", data: [150, 80, 120, 60, 40] }];

  const pieChartOptions: any = {
    chart: { type: "donut", fontFamily: "inherit" },
    colors: [NAVY, BLUE, "#5B8FC7", GOLD, "#A9B3C0"],
    labels: ["Diskominfo", "Bappeda", "DLHK", "Dinkes", "Lainnya"],
    legend: { position: "bottom", fontSize: "12px", markers: { radius: 1 } },
    stroke: { width: 2 },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "62%" } } },
  };
  const pieChartSeries = [30, 25, 20, 15, 10];

  const recentDatasets = [
    { id: 1, title: "Batas Desa Aceh Besar 2026", skpd: "Bappeda", date: "28 Okt 2026", status: "Published" },
    { id: 2, title: "Titik Rawan Banjir Aceh Utara", skpd: "DLHK", date: "27 Okt 2026", status: "Published" },
    { id: 3, title: "Jaringan Jalan Nasional 2025", skpd: "Dishub", date: "26 Okt 2026", status: "Draft" },
    { id: 4, title: "Sebaran Fasilitas Kesehatan", skpd: "Dinkes", date: "25 Okt 2026", status: "Published" },
    { id: 5, title: "Peta Geologi Pidie", skpd: "BRIDA", date: "24 Okt 2026", status: "Published" },
  ];
  // -----------------------------------------------------------------

  const panel =
    "rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]";
  const panelTitle = "text-[15px] font-semibold text-[#12355B] dark:text-white";

  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap');
        @keyframes dash-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .dash-in { opacity: 0; animation: dash-in .4s ease-out forwards; }
        @keyframes dash-pulse { 0%,100% { opacity: .45; } 50% { opacity: .9; } }
        .dash-skeleton { animation: dash-pulse 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .dash-in { animation: none; opacity: 1; }
          .dash-skeleton { animation: none; }
        }
      `}</style>

      <PageMeta title="Dashboard Admin | Geoportal Aceh" description="Ringkasan data Geoportal Aceh" />

      {/* Header halaman */}
      <div
        className="mb-6 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-3 border-b-2"
        style={{ borderColor: GOLD }}
      >
        <div>
          <h2 className="text-[22px] font-bold text-[#12355B] dark:text-white">Dashboard Admin</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Ringkasan infrastruktur data spasial Provinsi Aceh.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Pesan galat */}
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-3 rounded-md border border-red-200 border-l-4 border-l-red-700 bg-white px-4 py-3 text-sm text-gray-800 dark:bg-white/[0.03] dark:border-red-900 dark:text-gray-200"
        >
          <AlertTriangle className="w-4 h-4 flex-none text-red-700" />
          Statistik gagal dimuat.
          <button
            type="button"
            onClick={loadStats}
            className="ml-auto flex items-center gap-1 font-semibold text-[#1F5A99] hover:underline dark:text-blue-300"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Muat ulang
          </button>
        </div>
      )}

      {/* 1. Kartu statistik */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-5 mb-6">
        {cards.map((card, i) => (
          <div
            key={card.title}
            className={`dash-in ${panel} border-t-[3px] border-t-[#12355B] dark:border-t-[#5B8FC7] p-5 transition-colors hover:border-gray-300 dark:hover:border-gray-700`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                {loading ? (
                  <div className="dash-skeleton mt-2 h-8 w-20 rounded-sm bg-gray-200 dark:bg-gray-700" />
                ) : (
                  <p className="mt-1 text-[30px] leading-9 font-bold text-[#12355B] dark:text-white tabular-nums">
                    {card.value.toLocaleString("id-ID")}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-sm bg-[#12355B]/10 text-[#12355B] dark:bg-white/10 dark:text-blue-200">
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Grafik */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <div className={`dash-in ${panel} xl:col-span-2`} style={{ animationDelay: "260ms" }}>
          <div className="flex justify-between items-center px-5 py-3.5 border-b border-gray-200 dark:border-gray-800">
            <h3 className={panelTitle}>Dataset per kategori</h3>
            <select
              aria-label="Pilih tahun"
              className="text-[13px] rounded-sm border border-gray-300 bg-white py-1 pl-2 pr-7 text-gray-700 focus:border-[#1F5A99] focus:ring-1 focus:ring-[#1F5A99] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            >
              <option>Tahun 2026</option>
              <option>Tahun 2025</option>
            </select>
          </div>
          <div className="p-4 pl-1">
            <ReactApexChart options={barChartOptions} series={barChartSeries} type="bar" height={310} />
          </div>
        </div>

        <div className={`dash-in ${panel}`} style={{ animationDelay: "320ms" }}>
          <div className="px-5 py-3.5 border-b border-gray-200 dark:border-gray-800">
            <h3 className={panelTitle}>Dataset per instansi (SKPD)</h3>
          </div>
          <div className="p-4">
            <ReactApexChart options={pieChartOptions} series={pieChartSeries} type="donut" height={310} />
          </div>
        </div>
      </div>

      {/* 3. Tabel dataset terbaru */}
      <div className={`dash-in ${panel}`} style={{ animationDelay: "380ms" }}>
        <div className="flex justify-between items-center px-5 py-3.5 border-b border-gray-200 dark:border-gray-800">
          <h3 className={panelTitle}>Dataset terbaru</h3>
          <a
            href="/admin/datasets"
            className="text-[13px] font-semibold text-[#1F5A99] hover:underline dark:text-blue-300"
          >
            Lihat semua
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F5F8] dark:bg-white/[0.04] text-[13px] text-[#12355B] dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
                <th className="px-5 py-3 font-semibold">Nama dataset</th>
                <th className="px-5 py-3 font-semibold">Instansi (SKPD)</th>
                <th className="px-5 py-3 font-semibold">Tanggal pembaruan</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentDatasets.map((item) => {
                const published = item.status === "Published";
                return (
                  <tr key={item.id} className="transition-colors hover:bg-[#F3F7FC] dark:hover:bg-white/[0.03]">
                    <td className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-white/90">{item.title}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{item.skpd}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{item.date}</td>
                    <td className="px-5 py-3 text-sm">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-medium ${
                          published
                            ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
                            : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-300"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-green-600" : "bg-amber-600"}`} />
                        {published ? "Dipublikasikan" : "Draf"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}