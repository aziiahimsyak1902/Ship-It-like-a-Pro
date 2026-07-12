# 🏪 LapakCheck

Aplikasi check-in "buka lapak" untuk penjual UMKM rumahan — mencatat bukti
kehadiran penjual lewat **foto selfie** dan **koordinat lokasi**, terinspirasi
dari kebutuhan aplikasi marketplace hyperlokal *Tetangga Deket*.

Dibuat untuk memenuhi **Mission: Native Power App** — aplikasi yang
memakai fitur native HP (kamera/galeri/GPS) dengan permission flow yang benar.

> ⚠️ **Catatan pengumpulan:** Kode di repo ini sudah lengkap dan siap
> dijalankan, tapi bagian **screenshot**, **link Expo Snack**, dan
> **hasil pengujian di HP fisik** di bawah masih perlu diisi sendiri
> setelah kamu menjalankan `npx expo start` dan mencoba app-nya —
> tempat-tempat itu sudah ditandai `TODO`.

---

## 📱 Deskripsi Aplikasi

LapakCheck memudahkan penjual UMKM rumahan untuk "check-in" setiap kali
mulai berjualan hari itu. Sekali tekan, aplikasi akan:

1. Mengambil foto selfie (dari kamera atau galeri)
2. Mengambil koordinat lokasi saat ini + mengubahnya jadi nama tempat
3. Menyimpan keduanya sebagai satu catatan check-in yang bisa dilihat lagi
   kapan saja, lengkap dengan tombol untuk membuka lokasi di Google Maps

## 🔐 Fitur Native yang Dipakai

| Fitur Native | Modul | Kegunaan |
|---|---|---|
| Kamera | `expo-image-picker` (`launchCameraAsync`) | Ambil foto selfie check-in |
| Galeri | `expo-image-picker` (`launchImageLibraryAsync`) | Alternatif memilih foto dari galeri |
| GPS / Lokasi | `expo-location` | Ambil latitude/longitude + reverse geocoding |
| Penyimpanan Lokal | `@react-native-async-storage/async-storage` | Simpan riwayat check-in |

## ✅ Daftar Fitur

### Level 1 — Core (wajib)
- [x] Akses kamera **dan** GPS dengan permission flow yang benar
      (`requestPermissionsAsync` → cek `status === 'granted'` → baru akses fitur)
- [x] Penolakan izin ditangani dengan `Alert` ramah, aplikasi tidak crash
- [x] Cek `result.canceled` sebelum mengambil `result.assets[0].uri`
- [x] Koordinat latitude/longitude ditampilkan di layar
- [x] UI menampilkan hasil foto & lokasi dengan rapi

### Level 2 — Pengembangan (dipilih 5 dari minimal 2)
- [x] **📸 Kamera + Galeri** — Alert pilihan sumber foto (`chooseSource` di `CheckInScreen.js`)
- [x] **📍 Kamera + Lokasi** — satu data check-in berisi foto DAN koordinat sekaligus
- [x] **💾 Persistensi** — riwayat check-in disimpan ke AsyncStorage & dimuat ulang saat app dibuka (`src/storage.js`)
- [x] **🗺️ Buka di Maps** — tombol di tiap item riwayat yang membuka `https://www.google.com/maps?q=lat,lng` via `Linking.openURL` (`src/CheckInCard.js`)
- [x] **🔁 Tombol Settings** — saat izin ditolak, `Alert` menyediakan tombol "Buka Pengaturan" via `Linking.openSettings()`
- [x] **🖼️ Galeri Multi-Foto** — seluruh riwayat check-in ditampilkan di `FlatList` (`ListHeaderComponent` + `renderItem` di `CheckInScreen.js`)

### Level 3 — Bonus
- [x] **Priming screen** — layar penjelasan alasan izin, tampil sebelum dialog izin sistem (`src/PrimingScreen.js`), hanya muncul sekali (status disimpan di AsyncStorage)
- [x] **Reverse geocoding** — `Location.reverseGeocodeAsync` mengubah koordinat jadi nama jalan/kota
- [x] **app.json lengkap** — `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSLocationWhenInUseUsageDescription` (iOS) + `permissions` array (Android), lihat `app.json`
- [x] **Hapus foto** — tombol "Hapus Foto" untuk reset preview sebelum disimpan, dan tombol "Hapus" per item riwayat
- [ ] GPS + API cuaca Open-Meteo *(belum diimplementasikan — potensi pengembangan lanjutan)*

## 🗂️ Struktur Project

```
lapakcheck/
├── App.js                 # Root: priming screen (sekali) -> check-in screen
├── app.json                # Konfigurasi Expo + permission descriptions
├── babel.config.js
├── package.json
└── src/
    ├── theme.js             # Warna & spacing
    ├── storage.js            # Helper AsyncStorage (check-ins & priming flag)
    ├── PrimingScreen.js       # Layar penjelasan izin (Level 3)
    ├── CheckInScreen.js       # Layar utama: permission flow, kamera/galeri/GPS
    └── CheckInCard.js         # Item riwayat check-in (Maps + Hapus)
```

## 🛠️ Tech Stack

- [Expo](https://expo.dev) (SDK 51) + React Native
- `expo-image-picker` — kamera & galeri
- `expo-location` — GPS & reverse geocoding
- `@react-native-async-storage/async-storage` — persistensi lokal
- React Hooks (`useState`, `useEffect`, `useCallback`) — tanpa state management eksternal

## ▶️ Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Pastikan versi native module cocok dengan SDK Expo yang dipakai
npx expo install expo-image-picker expo-location @react-native-async-storage/async-storage react-native-safe-area-context

# 3. Jalankan development server
npx expo start

# 4. Scan QR code yang muncul memakai app Expo Go di HP kamu
```

> 💡 Fitur kamera & GPS **tidak akan berfungsi penuh di emulator/web** —
> disarankan menguji langsung di HP fisik lewat Expo Go sesuai instruksi tugas.

## 🧪 Hasil Pengujian di HP Fisik

`TODO — isi setelah pengujian:`

| Test Case | Hasil | Catatan |
|---|---|---|
| Ambil foto via kamera → tersimpan & tampil | ⬜ Lulus / ⬜ Gagal | |
| Ambil foto via galeri → tersimpan & tampil | ⬜ Lulus / ⬜ Gagal | |
| Tolak izin kamera → muncul Alert, tidak crash | ⬜ Lulus / ⬜ Gagal | |
| Tolak izin lokasi → muncul Alert + tombol Pengaturan | ⬜ Lulus / ⬜ Gagal | |
| Simpan check-in → muncul di riwayat setelah tutup-buka app lagi | ⬜ Lulus / ⬜ Gagal | |
| Tombol "Buka di Maps" membuka Google Maps dengan koordinat benar | ⬜ Lulus / ⬜ Gagal | |

**Device yang dipakai untuk uji:** `TODO — mis. Samsung A24, Android 14`

## 🖼️ Screenshot

`TODO — tempel minimal 3 screenshot di sini:`

1. **Hasil foto + lokasi setelah check-in berhasil** — `TODO`
2. **Dialog izin sistem (kamera/lokasi) saat pertama kali diminta** — `TODO`
3. **Alert penanganan penolakan izin (dengan tombol Buka Pengaturan)** — `TODO`

```md
<!-- Contoh cara menampilkan screenshot di README setelah file diupload ke repo -->
![Hasil check-in](./screenshots/checkin-result.jpg)
![Dialog izin](./screenshots/permission-dialog.jpg)
![Penolakan izin](./screenshots/permission-denied.jpg)
```

## 🔗 Expo Snack

`TODO — buat project ini di https://snack.expo.dev, tempel semua file dari`
`folder src/ + App.js + app.json, lalu tempel link Snack di sini:`

**Link Expo Snack:** `TODO — https://snack.expo.dev/@username/lapakcheck`

> Catatan: karena `expo-location` & sebagian fitur kamera butuh device fisik,
> gunakan opsi "Run on your device" di Expo Snack (scan QR dengan Expo Go)
> supaya dosen bisa mencoba interaksi sungguhan, bukan hanya preview web.

## 📝 Riwayat Commit (Conventional Commits)

Contoh urutan commit yang disarankan saat push ke GitHub:

```
feat: init expo project structure for lapakcheck
feat: add camera and gallery permission flow
feat: add GPS location feature with reverse geocoding
feat: add AsyncStorage persistence for check-in history
feat: add open in maps and settings deep link buttons
feat: add priming screen before permission dialogs
docs: add README with setup guide and screenshots
```

## 🚀 Potensi Pengembangan Lanjutan

- Integrasi API cuaca Open-Meteo berdasarkan koordinat check-in (Level 3)
- Upload foto check-in ke cloud storage agar tidak hilang saat uninstall
- Statistik jumlah check-in per minggu untuk penjual
