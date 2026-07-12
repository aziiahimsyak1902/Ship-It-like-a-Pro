# 🏪 LapakCheck

Check-in buka lapak dengan selfie + lokasi. Aplikasi sederhana untuk pedagang/pelapak mencatat kehadiran mereka setiap membuka lapak, lengkap dengan foto dan titik koordinat lokasi.

## ✨ Fitur

- **Selfie check-in** — ambil foto langsung dari kamera atau pilih dari galeri
- **Deteksi lokasi otomatis** — mencatat koordinat GPS saat check-in dibuat
- **Riwayat check-in** — semua check-in tersimpan dengan foto, alamat, koordinat, dan waktu
- **Buka di Maps** — lihat langsung titik lokasi check-in di Google Maps
- **Hapus data** — hapus foto atau riwayat check-in kapan saja

## 📱 Screenshot

### Onboarding & permintaan izin

Saat pertama kali dibuka, aplikasi menjelaskan kenapa setiap izin dibutuhkan sebelum memintanya ke sistem.

| Onboarding izin | Izin kamera | Izin lokasi |
|---|---|---|
| ![Onboarding izin](screenshots/onboarding-izin.png) | ![Izin kamera](screenshots/izin-kamera.jpeg) | ![Izin lokasi](screenshots/izin-lokasi.jpeg) |

### Alur check-in

| Halaman utama + riwayat | Lokasi check-in di Google Maps |
|---|---|
| ![Halaman utama](screenshots/home-riwayat.jpeg) | ![Lokasi di maps](screenshots/hasil-lokasi-maps.jpeg) |

## 🔐 Izin yang digunakan

| Izin | Kegunaan |
|---|---|
| Kamera | Mengambil foto selfie saat check-in membuka lapak |
| Galeri | Alternatif memilih foto yang sudah ada |
| Lokasi | Mencatat titik koordinat lapak saat check-in |

Semua izin bersifat opsional — jika ditolak, sebagian fitur check-in tidak berjalan, tapi aplikasi tetap bisa dipakai tanpa crash.

## 🛠️ Tech stack

- [Expo](https://expo.dev) / React Native
- [EAS Build](https://expo.dev/accounts/aziahimsyak1/projects/lapakcheck/builds/a60f885a-fdca-4cdb-8ab7-186e96244e16) untuk build production (Android & iOS)
- Expo Camera & Image Picker
- Expo Location

## 🚀 Menjalankan secara lokal

```bash
npm install
npx expo start -c
```

Scan QR code dengan aplikasi **Expo Go** di HP untuk testing.

## 📦 Build production

Build APK untuk testing di HP:
```bash
eas build --platform android --profile preview
```

Build AAB untuk submit ke Play Store:
```bash
eas build --platform android --profile production
```

Submit ke Play Store:
```bash
eas submit --platform android
```

## 📄 Lisensi

Proyek pribadi — belum ditentukan lisensinya.