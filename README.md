Berikut adalah template `README.md` yang sangat lengkap, profesional, dan siap pakai. Template ini dirancang agar klien atau dosen penguji Anda bisa langsung memahami proyek dan menjalankannya tanpa kebingungan.

Silakan buat file baru bernama **`README.md`** di folder utama proyek Anda (sejajar dengan `docker-compose.yml`), lalu **copy-paste** seluruh teks di bawah ini:

***

```markdown
# 🌐 WebGeoportal Provinsi Aceh

Sistem Informasi Geografis Berbasis Web (WebGIS) yang dirancang untuk memvisualisasikan, mengelola, dan menyebarkan Informasi Geospasial Provinsi Aceh. Proyek ini dibangun dengan arsitektur modern untuk mendukung integrasi data spasial (Satu Data Aceh).

## ✨ Fitur Utama

### 🌍 Halaman Publik (WebPortal)
- **WebGIS Viewer:** Peta interaktif menggunakan Leaflet.js dengan fitur *Basemap Switcher* (Jalan, Satelit, Gelap), *Layer Control* (Accordion), pengaturan transparansi (Opacity), dan Legenda dinamis.
- **Katalog Dataset:** Pencarian data geospasial, filter berdasarkan kategori & instansi (SKPD), serta pagination.
- **Story Maps:** Narasi interaktif (*scrollytelling*) yang menggabungkan teks, peta, dan video dokumenter.
- **Integrasi BMKG:** Menampilkan titik gempa terkini di Indonesia secara *real-time*.
- **Alat Ukur & Cetak Peta:** Fitur mengukur jarak/luas menggunakan Turf.js dan mengunduh peta sebagai gambar PNG.

### 🛡️ Panel Admin (Dashboard)
- **Manajemen Data:** CRUD (Create, Read, Update, Delete) untuk Dataset, Kategori, Instansi (SKPD), dan Berita.
- **Manajemen Spasial:** Unggah file `.geojson` langsung ke database PostGIS.
- **Role-Based Access Control (RBAC):** Hak akses terpisah untuk *Super Admin*, *Admin*, dan *Operator Data* (Operator hanya bisa mengelola data instansinya sendiri).
- **Pengaturan Profil:** Ganti nama, email, dan password.
- **Dark/Light Mode:** Dukungan tema gelap dan terang.

## 🛠️ Teknologi yang Digunakan

| Komponen | Teknologi |
| :--- | :--- |
| **Backend** | Laravel 11, PHP 8.2 |
| **Frontend** | React 19, Vite, Tailwind CSS |
| **Database** | PostgreSQL 15 + PostGIS (Spatial Database) |
| **Peta** | Leaflet.js, React-Leaflet, Turf.js |
| **Panel Admin** | TailAdmin (React) |
| **Containerization** | Docker, Docker Compose, Nginx |

---

## 🚀 Cara Menjalankan Proyek (Local Development)

### Prasyarat
Pastikan komputer Anda sudah terinstall:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) atau Docker Engine (Linux).
- [Git](https://git-scm.com/).

### Langkah-langkah Instalasi

**1. Clone Repositori**
```bash
git clone https://github.com/USERNAME/geoportal-aceh.git
cd geoportal-aceh
```
*(Ganti `USERNAME` dengan username GitHub Anda).*

**2. Setup Environment Backend**
```bash
cp backend/.env.example backend/.env
```
*(Jika file `.env.example` belum ada, buat file `backend/.env` secara manual dan sesuaikan konfigurasi database dengan `docker-compose.yml`)*.

**3. Jalankan Docker Container**
Dari folder utama proyek, jalankan:
```bash
docker compose up -d --build
```
Tunggu beberapa saat hingga semua container (`app`, `web`, `db`, `node`) menyala. Cek dengan `docker compose ps`.

**4. Install Dependensi & Migrasi Database**
Jalankan perintah berikut secara berurutan:
```bash
# Install dependensi PHP (Laravel)
docker compose exec app composer install

# Generate Application Key
docker compose exec app php artisan key:generate

# Jalankan Migrasi & Seeder (Data Awal)
docker compose exec app php artisan migrate:fresh --seed

# Buat Storage Link (Untuk akses gambar thumbnail)
docker compose exec app php artisan storage:link
```

**5. Install Dependensi Frontend**
```bash
docker compose exec node npm install
```

**6. Nyalakan Server Frontend (Vite)**
```bash
docker compose exec node npm run dev
```

---

## 🔗 Akses Aplikasi

Setelah semua layanan berjalan, buka browser Anda:

| Layanan | URL |
| :--- | :--- |
| **WebPortal Publik** | [http://localhost:5173](http://localhost:5173) |
| **WebGIS Viewer** | [http://localhost:5173/webgis](http://localhost:5173/webgis) |
| **Panel Admin** | [http://localhost:5173/admin](http://localhost:5173/admin) |
| **API Backend** | [http://localhost:8080/api/v1](http://localhost:8080/api/v1) |

### Kredensial Login Admin Default
- **Email:** `admin@acehprov.go.id`
- **Password:** `password123`

---

## 📂 Struktur Folder

```text
geoportal-aceh/
├── backend/            # Aplikasi Laravel (REST API & Logika Bisnis)
├── frontend/           # Aplikasi React (WebPortal & Panel Admin)
├── docker/             # Konfigurasi Nginx
├── docker-compose.yml  # Orkestrasi Docker Container
└── README.md           # Dokumentasi Proyek
```

---

## ⚠️ Catatan Penting (Data Spasial)

1.  **File GeoJSON Besar:** Folder `backend/data-gis/` **tidak disertakan** dalam repositori ini karena ukurannya yang besar. Untuk memasukkan data spasial (seperti batas desa atau jalan), Anda bisa:
    *   Mengunggahnya secara manual melalui **Panel Admin -> Data Layer Spasial**.
    *   Atau, letakkan file `.geojson` ke dalam folder `backend/data-gis/`, lalu jalankan perintah:
        ```bash
        docker compose exec app php artisan geojson:import
        ```
2.  **Data Dummy:** Database sudah dilengkapi dengan data *dummy* (contoh) untuk memudahkan pengujian awal (Batas Wilayah, Jalan, Sungai, Story Maps, dll).

---



