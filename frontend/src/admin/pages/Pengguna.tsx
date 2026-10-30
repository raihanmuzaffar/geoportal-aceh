import { useState, useEffect, useMemo } from "react";
import PageMeta from "../components/common/PageMeta";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  ShieldCheck,
  Search,
  Users,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import api from "../../api/axios";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  skpd: { name: string } | null;
}

type Filter = "all" | "super_admin" | "admin" | "operator";

const GOLD = "#B8902F";
const NAVY = "#12355B";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  operator: "Operator Data",
};

const ROLE_STYLE: Record<string, string> = {
  super_admin: "border-[#12355B] bg-[#12355B] text-white",
  admin: "border-blue-200 bg-blue-50 text-[#12355B]",
  operator: "border-gray-300 bg-gray-50 text-gray-700",
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "operator",
  skpd_id: "",
};

export default function Pengguna() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [skpds, setSkpds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get("/users"), api.get("/skpd")])
      .then(([resUsers, resSkpds]) => {
        setUsers(resUsers.data.data);
        setSkpds(resSkpds.data.data);
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  // Pesan sukses hilang sendiri
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const counts = useMemo(
    () => ({
      all: users.length,
      super_admin: users.filter((u) => u.role === "super_admin").length,
      admin: users.filter((u) => u.role === "admin").length,
      operator: users.filter((u) => u.role === "operator").length,
    }),
    [users]
  );

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return users.filter((u) => {
      if (filter !== "all" && u.role !== filter) return false;
      if (
        q &&
        !u.name.toLowerCase().includes(q) &&
        !u.email.toLowerCase().includes(q) &&
        !(u.skpd?.name || "").toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [users, keyword, filter]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrorMsg("");
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserData) => {
    setEditingId(user.id);
    // Cocokkan SKPD berdasarkan nama agar pilihan instansi tidak hilang saat diubah
    const matched = skpds.find((s) => s.name === user.skpd?.name);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Kosongkan password saat edit
      role: user.role,
      skpd_id: matched ? String(matched.id) : "",
    });
    setErrorMsg("");
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const isEdit = editingId !== null;

    // Saat ubah data, password kosong tidak ikut dikirim
    const payload: Record<string, any> = { ...formData };
    if (isEdit && !payload.password) delete payload.password;

    const request = isEdit
      ? api.put(`/users/${editingId}`, payload)
      : api.post("/users", payload);

    request
      .then(() => {
        setIsModalOpen(false);
        setNotice(
          isEdit ? "Data pengguna berhasil diperbarui." : "Pengguna baru berhasil ditambahkan."
        );
        loadData();
      })
      .catch((err: any) => {
        setErrorMsg(err.response?.data?.message || "Terjadi kesalahan saat menyimpan.");
      })
      .finally(() => setIsSubmitting(false));
  };

  const openDelete = (user: UserData) => {
    setDeleteError("");
    setDeleteTarget(user);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError("");
    api
      .delete(`/users/${deleteTarget.id}`)
      .then(() => {
        setDeleteTarget(null);
        setNotice("Akun pengguna berhasil dihapus.");
        loadData();
      })
      .catch((err: any) =>
        setDeleteError(err.response?.data?.message || "Gagal menghapus pengguna.")
      )
      .finally(() => setIsDeleting(false));
  };

  const th =
    "px-4 py-3 text-[13px] font-semibold text-white text-left whitespace-nowrap";
  const input =
    "w-full border border-gray-300 bg-white rounded-sm px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 " +
    "transition-colors focus:outline-none focus:border-[#12355B] focus:ring-2 focus:ring-[#12355B]/15 " +
    "dark:bg-gray-800 dark:border-gray-700 dark:text-white";
  const label = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  const tabs: { key: Filter; text: string }[] = [
    { key: "all", text: "Semua" },
    { key: "super_admin", text: "Super Admin" },
    { key: "admin", text: "Admin" },
    { key: "operator", text: "Operator Data" },
  ];

  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', Arial, sans-serif" }}>
      <style>{`
        @keyframes us-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes us-pop {
          from { opacity: 0; transform: translateY(8px) scale(.985) }
          to   { opacity: 1; transform: none }
        }
        @keyframes us-notice {
          from { opacity: 0; transform: translateY(-4px) }
          to   { opacity: 1; transform: none }
        }
        .us-overlay { animation: us-fade .18s ease-out both }
        .us-dialog  { animation: us-pop .22s cubic-bezier(.2,.8,.2,1) both }
        .us-row     { animation: us-fade .35s ease-out both }
        .us-notice  { animation: us-notice .25s ease-out both }
        @media (prefers-reduced-motion: reduce) {
          .us-overlay, .us-dialog, .us-row, .us-notice { animation: none }
        }
      `}</style>

      <PageMeta
        title="Manajemen Pengguna | Geoportal Aceh"
        description="Kelola akun admin dan operator"
      />

      {/* Jejak halaman */}
      <nav aria-label="Jejak halaman" className="mb-3 text-[13px] text-gray-500 dark:text-gray-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>Beranda</li>
          <li aria-hidden="true">/</li>
          <li>Pengaturan</li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-[#12355B] dark:text-white" aria-current="page">
            Manajemen Pengguna
          </li>
        </ol>
      </nav>

      {/* Judul halaman */}
      <div
        className="mb-5 flex flex-col gap-4 border-b-2 pb-4 sm:flex-row sm:items-end sm:justify-between"
        style={{ borderColor: GOLD }}
      >
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-white"
            style={{ backgroundColor: NAVY }}
          >
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[22px] font-bold leading-tight text-[#12355B] dark:text-white">
              Manajemen Pengguna
            </h2>
            <p className="mt-1 max-w-xl text-sm text-gray-600 dark:text-gray-400">
              Kelola hak akses akun untuk Super Admin, Admin, dan Operator Data.
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#12355B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1F5A99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8902F] focus-visible:ring-offset-2 active:translate-y-px"
        >
          <Plus className="h-4 w-4" /> Tambah pengguna
        </button>
      </div>

      {/* Notifikasi sukses */}
      {notice && (
        <div
          role="status"
          className="us-notice mb-4 flex items-center gap-2 rounded-sm border border-green-300 bg-green-50 px-4 py-2.5 text-sm text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="flex-1">{notice}</span>
          <button
            onClick={() => setNotice("")}
            aria-label="Tutup pemberitahuan"
            className="rounded-sm p-0.5 text-green-700 hover:bg-green-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tabel */}
      <div className="overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Filter & pencarian */}
        <div className="flex flex-col gap-3 border-b border-gray-200 bg-[#F3F5F8] px-4 pt-3 dark:border-gray-800 dark:bg-white/[0.04]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {loading
                ? "Memuat data..."
                : `Menampilkan ${filtered.length} dari ${users.length} pengguna`}
            </p>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari nama, email, atau instansi"
                aria-label="Cari pengguna"
                className={`${input} pl-9`}
              />
            </div>
          </div>

          <div role="tablist" aria-label="Filter peran" className="flex gap-1 overflow-x-auto">
            {tabs.map((t) => {
              const active = filter === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(t.key)}
                  className={`-mb-px shrink-0 rounded-t-sm border border-b-0 px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12355B] ${
                    active
                      ? "border-gray-200 border-t-2 bg-white text-[#12355B] dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 hover:text-[#12355B] dark:hover:text-white"
                  }`}
                  style={active ? { borderTopColor: GOLD } : undefined}
                >
                  {t.text}
                  <span className="ml-1.5 text-xs font-normal text-gray-400">{counts[t.key]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr style={{ backgroundColor: NAVY }}>
                <th className={`${th} w-14 text-center`}>No.</th>
                <th className={th}>Nama pengguna</th>
                <th className={th}>Email</th>
                <th className={th}>Peran</th>
                <th className={th}>Instansi (SKPD)</th>
                <th className={`${th} text-right`}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" style={{ color: NAVY }} />
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">
                    {users.length === 0
                      ? "Belum ada pengguna terdaftar."
                      : "Tidak ada pengguna yang cocok dengan pencarian atau filter."}
                  </td>
                </tr>
              ) : (
                filtered.map((user, idx) => (
                  <tr
                    key={user.id}
                    style={{ animationDelay: `${Math.min(idx, 10) * 25}ms` }}
                    className="us-row border-b border-gray-100 transition-colors odd:bg-white even:bg-[#F8FAFC] hover:bg-[#EAF1F9] dark:border-gray-800 dark:odd:bg-transparent dark:even:bg-white/[0.02] dark:hover:bg-white/[0.06]"
                  >
                    <td className="px-4 py-3 text-center text-sm text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white/90">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-semibold ${
                          ROLE_STYLE[user.role] || ROLE_STYLE.operator
                        }`}
                      >
                        <ShieldCheck className="h-3 w-3" />
                        {ROLE_LABEL[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {user.skpd?.name || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          title="Ubah"
                          aria-label={`Ubah ${user.name}`}
                          className="rounded-sm border border-transparent p-2 text-[#1F5A99] transition-colors hover:border-[#C9D8EA] hover:bg-[#E8EEF6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5A99]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDelete(user)}
                          title="Hapus"
                          aria-label={`Hapus ${user.name}`}
                          className="rounded-sm border border-transparent p-2 text-red-700 transition-colors hover:border-red-200 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal tambah / ubah */}
      {isModalOpen && (
        <div
          className="us-overlay fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 px-4 py-8 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="us-form-title"
        >
          <div
            className="us-dialog flex max-h-full w-full max-w-xl flex-col overflow-hidden rounded-sm border-t-4 bg-white shadow-xl dark:bg-gray-900"
            style={{ borderColor: GOLD }}
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#F3F5F8] px-6 py-4 dark:border-gray-800 dark:bg-white/[0.04]">
              <div>
                <h3 id="us-form-title" className="text-lg font-bold text-[#12355B] dark:text-white">
                  {editingId ? "Ubah data pengguna" : "Tambah pengguna"}
                </h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400">
                  Kolom bertanda <span className="text-red-600">*</span> wajib diisi.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Tutup"
                className="rounded-sm p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto p-6">
              {errorMsg && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div>
                <label htmlFor="us-name" className={label}>
                  Nama lengkap <span className="text-red-600">*</span>
                </label>
                <input
                  id="us-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={input}
                />
              </div>

              <div>
                <label htmlFor="us-email" className={label}>
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  id="us-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={input}
                />
              </div>

              <div>
                <label htmlFor="us-pass" className={label}>
                  Kata sandi {!editingId && <span className="text-red-600">*</span>}
                </label>
                <div className="relative">
                  <input
                    id="us-pass"
                    type={showPassword ? "text" : "password"}
                    required={!editingId}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`${input} pr-10`}
                    placeholder="Minimal 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-gray-400 transition-colors hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {editingId && (
                  <p className="mt-1 text-xs text-gray-500">
                    Kosongkan jika kata sandi tidak ingin diubah.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="us-role" className={label}>
                    Peran <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="us-role"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={input}
                  >
                    <option value="operator">Operator Data</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="us-skpd" className={label}>Instansi (SKPD)</label>
                  <select
                    id="us-skpd"
                    value={formData.skpd_id}
                    onChange={(e) => setFormData({ ...formData, skpd_id: e.target.value })}
                    className={input}
                  >
                    <option value="">Tidak ada (khusus Super Admin)</option>
                    {skpds.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-sm border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-w-[110px] items-center justify-center rounded-sm bg-[#12355B] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1F5A99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog konfirmasi hapus */}
      {deleteTarget && (
        <div
          className="us-overlay fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-[2px]"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="us-del-title"
        >
          <div className="us-dialog w-full max-w-md overflow-hidden rounded-sm border-t-4 border-red-700 bg-white shadow-xl dark:bg-gray-900">
            <div className="flex gap-3 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 id="us-del-title" className="text-base font-bold text-gray-900 dark:text-white">
                  Hapus akun pengguna ini?
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Akun <span className="font-semibold">{deleteTarget.name}</span> (
                  {deleteTarget.email}) tidak akan bisa masuk lagi ke sistem. Tindakan ini tidak
                  dapat dibatalkan.
                </p>
                {deleteError && (
                  <p role="alert" className="mt-3 rounded-sm border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                    {deleteError}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 bg-[#F8FAFC] px-6 py-3 dark:border-gray-800 dark:bg-white/[0.03]">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-sm border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex min-w-[96px] items-center justify-center rounded-sm bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}