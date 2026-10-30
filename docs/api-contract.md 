# API Contract — Geoportal Aceh
Versi: 1.0 (MVP) | Base URL: `/api/v1` | Format: JSON (UTF-8)
Auth: Bearer Token (Laravel Sanctum) | GeoJSON: RFC 7946

## Konvensi Umum

### Sukses
{
  "success": true,
  "message": "OK",
  "data": { ... },
  "meta": { "current_page": 1, "per_page": 12, "total": 57, "last_page": 5 }
}

### Error
{
  "success": false,
  "message": "Deskripsi error",
  "errors": { "field": ["pesan validasi"] }
}

### HTTP Status
200 OK | 201 Created | 400 Bad Request | 401 Unauthorized
403 Forbidden | 404 Not Found | 422 Validation Error | 500 Server Error

### Pagination
Query: ?page=1&per_page=12 (default 12, max 100)

### Tanggal
ISO 8601 UTC, contoh: "2026-10-27T08:30:00Z"

---

## 1. AUTH

### POST /api/v1/auth/login
Body:
{ "email": "admin@acehprov.go.id", "password": "secret" }
Response 200:
{
  "success": true,
  "data": {
    "token": "1|abc...",
    "user": { "id": 1, "name": "Admin", "email": "admin@acehprov.go.id",
              "role": "super_admin", "skpd_id": null }
  }
}
Error 401: kredensial salah.

### POST /api/v1/auth/logout  [auth]
Response 200: { "success": true, "message": "Logged out" }

### GET /api/v1/auth/me  [auth]
Response 200: { "success": true, "data": { user } }

---

## 2. KATEGORI

### GET /api/v1/categories
Response 200:
{
  "success": true,
  "data": [
    { "id": 1, "name": "Batas Wilayah", "slug": "batas-wilayah", "icon": "map", "dataset_count": 157 },
    { "id": 2, "name": "Transportasi", "slug": "transportasi", "icon": "bus", "dataset_count": 169 }
  ]
}

---

## 3. SKPD (Instansi)

### GET /api/v1/skpd
Response 200:
{
  "success": true,
  "data": [
    { "id": 1, "name": "DLHK Aceh", "short_name": "DLHK", "logo_url": "https://...", "metadata_count": 3 },
    { "id": 2, "name": "DINKES Aceh", "short_name": "DINKES", "logo_url": "https://...", "metadata_count": 2 }
  ]
}

---

## 4. DATASET

### GET /api/v1/datasets
Query: ?search=&category_id=&skpd_id=&mode=layers|dashboard|cartography&page=&per_page=
Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Total Fertility Rate (TFR) Tahun 2025",
      "slug": "tfr-2025",
      "description": "Data TFR per kabupaten/kota di Aceh",
      "thumbnail_url": "https://...",
      "category": { "id": 1, "name": "Batas Wilayah", "slug": "batas-wilayah" },
      "skpd": { "id": 1, "name": "DLHK Aceh", "short_name": "DLHK" },
      "mode": "layers",
      "updated_at": "2026-10-27T08:30:00Z"
    }
  ],
  "meta": { "current_page": 1, "per_page": 12, "total": 57, "last_page": 5 }
}

### GET /api/v1/datasets/featured
Response 200: 4 dataset terbaru untuk "Sorotan Dataset Terbaru".
{ "success": true, "data": [ dataset, dataset, dataset, dataset ] }

### GET /api/v1/datasets/{slug}
Response 200:
{
  "success": true,
  "data": {
    "id": 1, "title": "...", "slug": "tfr-2025",
    "description": "...", "abstract": "...",
    "thumbnail_url": "https://...",
    "category": {...}, "skpd": {...},
    "metadata": {
      "source": "BPS Aceh", "author": "Dinkes Aceh",
      "production_date": "2026-01-15", "update_date": "2026-10-27",
      "coordinate_system": "EPSG:4326", "format": "GeoJSON",
      "license": "CC-BY-4.0", "contact": "diskominfo@acehprov.go.id"
    },
    "layers": [
      { "id": 10, "name": "TFR 2025", "geometry_type": "Polygon", "feature_count": 23 }
    ],
    "actions": {
      "download_url": "https://api.../datasets/tfr-2025/download",
      "geojson_url": "https://api.../layers/10/geojson",
      "webgis_url": "/webgis?layer=10",
      "cartography_url": null
    }
  }
}

---

## 5. LAYER & GEOJSON

### GET /api/v1/layers
Response 200: daftar layer aktif untuk layer control.
{
  "success": true,
  "data": [
    { "id": 1, "name": "Batas Provinsi Aceh", "slug": "batas-provinsi",
      "geometry_type": "Polygon", "is_visible_by_default": true, "order": 1,
      "style": { "color": "#1e40af", "weight": 2, "fillOpacity": 0.1 } },
    { "id": 2, "name": "Batas Kabupaten/Kota", "slug": "batas-kabkota", ... },
    { "id": 3, "name": "Batas Kecamatan", "slug": "batas-kecamatan", ... }
  ]
}

### GET /api/v1/layers/{id}/geojson
Response 200: FeatureCollection (lihat geojson-schema.json).
Header: Cache-Control: public, max-age=3600
Query opsional: ?simplify=0.001&bbox=minx,miny,maxx,maxy

### GET /api/v1/layers/{id}/geojson/at/{lng}/{lat}
Response 200: Feature tunggal yang mengandung titik (untuk popup klik).

---

## 6. STATISTIK

### GET /api/v1/stats/summary
Response 200: kartu statistik dashboard publik.
{
  "success": true,
  "data": {
    "total_datasets": 362,
    "total_skpd": 48,
    "total_users": 128,
    "total_downloads": 1256
  }
}

### GET /api/v1/stats/by-category
Response 200: data untuk grafik "Statistik Ketersediaan Data Spasial".
{
  "success": true,
  "data": [
    { "category": "Batas Wilayah", "slug": "batas-wilayah", "count": 157, "icon": "map" },
    { "category": "Transportasi", "slug": "transportasi", "count": 169, "icon": "bus" },
    { "category": "Hidrografi", "slug": "hidrografi", "count": 565, "icon": "water" }
  ]
}

---

## 7. BERITA & AGENDA

### GET /api/v1/news
Query: ?page=&per_page=
Response 200:
{ "success": true,
  "data": [ { "id": 1, "title": "...", "slug": "...", "excerpt": "...",
              "thumbnail_url": "...", "published_at": "2026-03-11T00:00:00Z", "type": "news" } ],
  "meta": {...}
}

### GET /api/v1/agenda
Sama strukturnya, filter `type=agenda`.

### GET /api/v1/news/{slug}
Response 200: detail lengkap + `content` (HTML sanitized).

---

## 8. KONTAK

### POST /api/v1/contact
Body:
{ "name": "Budi", "email": "budi@mail.com", "phone": "0812...",
  "subject": "Permohonan Data", "message": "..." }
Response 201:
{ "success": true, "message": "Pesan terkirim. Kami akan merespons dalam 1x24 jam." }

---

## 9. ADMIN (Fase Lanjutan — setelah MVP)

Semua endpoint `[auth + role:super_admin|admin]`.

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | /admin/datasets | Create dataset |
| PUT | /admin/datasets/{id} | Update dataset |
| DELETE | /admin/datasets/{id} | Soft delete |
| POST | /admin/layers | Create layer + upload GeoJSON |
| PUT | /admin/layers/{id} | Update layer |
| DELETE | /admin/layers/{id} | Hapus layer |
| POST | /admin/layers/{id}/import | Import GeoJSON ke PostGIS |
| CRUD | /admin/categories | Kategori |
| CRUD | /admin/metadata | Metadata |
| CRUD | /admin/users | [super_admin only] |
| GET | /admin/stats | Ringkasan sistem |
| GET | /admin/activity-logs | [super_admin only] |

Role matrix (Admin vs Super Admin):
- Admin/Operator: hanya data SKPD sendiri.
- Super Admin: semua data + users + settings + audit log.

---

## Catatan Implementasi

1. Semua endpoint publik pakai `throttle:60,1`.
2. Endpoint auth pakai `throttle:5,1`.
3. Endpoint GeoJSON pakai cache 1 jam.
4. CORS hanya izinkan origin frontend.
5. Validasi semua input via FormRequest Laravel.