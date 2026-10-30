# ERD — Geoportal Aceh (PostgreSQL + PostGIS)

## Diagram Relasi (tekstual)

users ───< activity_logs
users >─── skpd (nullable, untuk admin per-SKPD)
skpd ───< datasets
categories ───< datasets
datasets ───< layers
datasets ───< dataset_files
layers ───< layer_geometries   (tabel spasial)
users ───< news
users ───< agenda
users ───< story_maps
story_maps ───< story_map_steps
settings (singleton, key-value)

---

## Tabel

### users
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigserial PK | |
| name | varchar(100) | |
| email | varchar(150) UNIQUE | |
| password | varchar(255) | bcrypt |
| role | enum('super_admin','admin','operator') | |
| skpd_id | bigint FK→skpd NULL | null untuk super_admin |
| is_active | boolean default true | |
| last_login_at | timestamptz NULL | |
| created_at, updated_at | timestamptz | |

### skpd
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigserial PK | |
| name | varchar(150) | "Dinas Lingkungan Hidup dan Kehutanan Aceh" |
| short_name | varchar(50) | "DLHK" |
| logo_url | text | |
| address | text NULL | |
| phone | varchar(30) NULL | |
| email | varchar(150) NULL | |
| created_at, updated_at | timestamptz | |

### categories
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigserial PK | |
| name | varchar(100) | "Batas Wilayah" |
| slug | varchar(100) UNIQUE | |
| icon | varchar(50) NULL | nama ikon |
| description | text NULL | |
| sort_order | integer default 0 | |
| created_at, updated_at | timestamptz | |

### datasets
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigserial PK | |
| title | varchar(200) | |
| slug | varchar(200) UNIQUE | |
| description | text | |
| abstract | text NULL | |
| thumbnail_url | text NULL | |
| category_id | bigint FK→categories | |
| skpd_id | bigint FK→skpd | |
| mode | enum('layers','dashboard','cartography') default 'layers' | |
| is_featured | boolean default false | |
| is_published | boolean default true | |
| published_at | timestamptz NULL | |
| created_by | bigint FK→users | |
| created_at, updated_at | timestamptz | |
| deleted_at | timestamptz NULL | soft delete |

**Index:** `idx_datasets_published (is_published, published_at DESC)`, `idx_datasets_fts` (GIN pada tsvector title+description).

### dataset_metadata (1:1 dengan datasets)
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigserial PK | |
| dataset_id | bigint FK→datasets UNIQUE | |
| source | varchar(200) NULL | "BPS Aceh" |
| author | varchar(150) NULL | |
| production_date | date NULL | |
| update_date | date NULL | |
| coordinate_system | varchar(50) default 'EPSG:4326' | |
| format | varchar(30) | "GeoJSON" |
| license | varchar(100) NULL | |
| contact | varchar(150) NULL | |
| lineage | text NULL | |
| created_at, updated_at | timestamptz | |

### layers
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigserial PK | |
| dataset_id | bigint FK→datasets NULL | boleh null untuk layer referensi (batas adm) |
| name | varchar(200) | |
| slug | varchar(200) UNIQUE | |
| geometry_type | enum('Point','LineString','Polygon','MultiPolygon','MultiLineString','MultiPoint') | |
| srid | integer default 4326 | |
| feature_count | integer default 0 | |
| is_reference | boolean default false | true untuk batas administrasi |
| is_visible_by_default | boolean default false | |
| sort_order | integer default 0 | |
| style | jsonb NULL | {color, weight, fillOpacity} |
| bbox | geometry(Polygon, 4326) NULL | untuk query cepat |
| created_at, updated_at | timestamptz | |

**Index:** `idx_layers_reference (is_reference, sort_order)`, GIST pada `bbox`.

### layer_geometries  ← tabel spasial utama
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigserial PK | |
| layer_id | bigint FK→layers | |
| properties | jsonb | atribut per fitur (name, code, dll) |
| geom | geometry(Geometry, 4326) | PostGIS |
| created_at, updated_at | timestamptz | |

**Index:** `GIST(geom)`, `idx_layer_geometries_layer (layer_id)`.

> Karakteristik: satu baris = satu fitur GeoJSON. Endpoint `/layers/{id}/geojson` = `SELECT jsonb_build_object('type','Feature', 'geometry', ST_AsGeoJSON(geom)::jsonb, 'properties', properties) FROM layer_geometries WHERE layer_id = ?`.

### dataset_files
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigserial PK | |
| dataset_id | bigint FK→datasets | |
| file_type | enum('geojson','shp','pdf','csv','other') | |
| file_url | text | |
| file_size | bigint | bytes |
| created_at, updated_at | timestamptz | |

### news
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigserial PK | |
| title | varchar(200) | |
| slug | varchar(200) UNIQUE | |
| excerpt | text | |
| content | text | HTML sanitized |
| thumbnail_url | text NULL | |
| type | enum('news','agenda') | |
| event_date | date NULL | khusus agenda |
| published_at | timestamptz NULL | |
| created_by | bigint FK→users | |
| created_at, updated_at | timestamptz | |
| deleted_at | timestamptz NULL | |

### story_maps
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigserial PK | |
| title | varchar(200) | |
| slug | varchar(200) UNIQUE | |
| description | text NULL | |
| cover_url | text NULL | |
| is_published | boolean default false | |
| created_by | bigint FK→users | |
| created_at, updated_at | timestamptz | |

### story_map_steps
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigserial PK | |
| story_map_id | bigint FK→story_maps | |
| step_order | integer | |
| title | varchar(200) | |
| content | text | |
| center_lng | numeric(10,7) NULL | |
| center_lat | numeric(10,7) NULL | |
| zoom | integer NULL | |
| layer_ids | jsonb NULL | [1,2,3] |
| created_at, updated_at | timestamptz | |

### contact_messages
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigserial PK | |
| name | varchar(100) | |
| email | varchar(150) | |
| phone | varchar(30) NULL | |
| subject | varchar(200) | |
| message | text | |
| status | enum('new','read','replied') default 'new' | |
| created_at, updated_at | timestamptz | |

### activity_logs
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigserial PK | |
| user_id | bigint FK→users NULL | |
| action | varchar(50) | "create","update","delete","login" |
| entity_type | varchar(100) | "dataset","layer","user" |
| entity_id | bigint NULL | |
| changes | jsonb NULL | diff field |
| ip_address | varchar(45) NULL | |
| user_agent | text NULL | |
| created_at | timestamptz | |

### settings
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigserial PK | |
| key | varchar(100) UNIQUE | "site_name","contact_email","hero_title" |
| value | text NULL | |
| group | varchar(50) default 'general' | "general","contact","branding" |
| created_at, updated_at | timestamptz | |

---

## Seed Awal Wajib

1. `skpd`: 1 row placeholder "Diskominfo Aceh".
2. `categories`: 13 kategori (Batas Wilayah, Transportasi, Hidrografi, Vegetasi, Geologi, Tanah, Toponimi, Kadaster, Kebencanaan, Dataset Khusus, Perencanaan, Lingkungan Terbangun, Utilitas, Higrografi).
3. `users`: 1 super_admin (email dummy, password di-hash).
4. `layers` referensi: batas-provinsi, batas-kabkota, batas-kecamatan (import dari Fase Data).
5. `settings`: site_name, hero_title, contact_email, contact_phone.

---

## Catatan Query Penting

- **Peta**: `ST_AsGeoJSON(geom, 6)::jsonb` → presisi 6 desimal cukup untuk web.
- **Popup klik**: `ST_Contains(geom, ST_SetSRID(ST_MakePoint(?, ?), 4326))`.
- **Search lokasi**: `WHERE properties->>'name' ILIKE '%?%'`.
- **Simplifikasi render**: `ST_SimplifyPreserveTopology(geom, 0.0001)` untuk layer besar.
- **Cache**: endpoint GeoJSON simpan hasil di Redis 1 jam → kurangi beban DB.