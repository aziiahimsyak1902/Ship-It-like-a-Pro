# 🏪 LapakCheck

Check-in buka lapak dengan selfie + lokasi. Aplikasi sederhana untuk pedagang/pelapak mencatat kehadiran mereka setiap membuka lapak, lengkap dengan foto dan titik koordinat lokasi.

## ✨ Fitur

- **Selfie check-in** — ambil foto langsung dari kamera atau pilih dari galeri
- **Deteksi lokasi otomatis** — mencatat koordinat GPS saat check-in dibuat
- **Riwayat check-in** — semua check-in tersimpan dengan foto, alamat, koordinat, dan waktu
- **Buka di Maps** — lihat langsung titik lokasi check-in di Google Maps
- **Hapus data** — hapus foto atau riwayat check-in kapan saja

## 📱 Screenshot
<a href="https://ibb.co.com/XZRPBSR0"><img src="https://i.ibb.co.com/tMr6f8rj/Whats-App-Image-2026-07-12-at-22-21-59.jpg" alt="Whats-App-Image-2026-07-12-at-22-21-59" border="0"></a>
<a href="https://ibb.co.com/GQcxfNMs"><img src="https://i.ibb.co.com/N2ZVgbN1/Whats-App-Image-2026-07-12-at-22-22-00.jpg" alt="Whats-App-Image-2026-07-12-at-22-22-00" border="0"></a>
<a href="https://ibb.co.com/6RP7hVTD"><img src="https://i.ibb.co.com/KjqpZRfV/Whats-App-Image-2026-07-12-at-22-21-59-2.jpg" alt="Whats-App-Image-2026-07-12-at-22-21-59-2" border="0"></a>
<a href="https://ibb.co.com/tMR0XS7k"><img src="https://i.ibb.co.com/3yKxzwDG/Whats-App-Image-2026-07-12-at-22-21-59-1.jpg" alt="Whats-App-Image-2026-07-12-at-22-21-59-1" border="0"></a>


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
