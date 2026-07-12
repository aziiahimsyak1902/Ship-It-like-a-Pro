// src/CheckInScreen.js
// Layar utama LapakCheck.
//
// Alur (Level 1 - wajib):
//   1. User tekan "Ambil Foto Check-in" -> Alert pilih sumber (Kamera/Galeri)
//   2. Minta permission -> cek status === 'granted' -> baru akses fitur
//   3. Jika ditolak -> Alert ramah + tombol ke Pengaturan, TIDAK crash
//   4. Setelah foto didapat -> cek result.canceled, ambil assets[0].uri
//   5. Minta permission lokasi -> ambil latitude/longitude
//   6. Tampilkan foto + koordinat di layar
//
// Level 2 yang diimplementasikan (>= 2 dari daftar):
//   - Kamera + Galeri (dua opsi sumber foto)
//   - Kamera + Lokasi digabung dalam satu data check-in
//   - Persistensi ke AsyncStorage, dimuat lagi saat app dibuka
//   - Tombol "Buka di Maps" (lihat CheckInCard.js)
//   - Tombol ke Settings saat izin ditolak
//   - Galeri multi-foto: riwayat check-in ditampilkan di FlatList
//
// Level 3 bonus yang diimplementasikan:
//   - Reverse geocoding (koordinat -> nama tempat)
//   - Tombol hapus/reset foto sebelum disimpan

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Alert,
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { colors, spacing, radius } from './theme';
import { loadCheckIns, addCheckIn, removeCheckIn } from './storage';
import CheckInCard from './CheckInCard';

export default function CheckInScreen() {
  const [photoUri, setPhotoUri] = useState(null);
  const [location, setLocation] = useState(null); // { latitude, longitude, placeName }
  const [isBusy, setIsBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState('');
  const [history, setHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Muat riwayat check-in dari AsyncStorage setiap kali layar ini dibuka.
  useEffect(() => {
    (async () => {
      const saved = await loadCheckIns();
      setHistory(saved);
    })();
  }, []);

  const showPermissionDeniedAlert = (featureName, message) => {
    Alert.alert(
      `Izin ${featureName} Ditolak`,
      message,
      [
        { text: 'Nanti Saja', style: 'cancel' },
        { text: 'Buka Pengaturan', onPress: () => Linking.openSettings() },
      ]
    );
  };

  // ---------- Ambil Foto (Kamera atau Galeri) ----------
  const pickImage = useCallback(async (source) => {
    try {
      setIsBusy(true);
      setBusyLabel(source === 'camera' ? 'Membuka kamera...' : 'Membuka galeri...');

      const permission =
        source === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permission.status !== 'granted') {
        setIsBusy(false);
        showPermissionDeniedAlert(
          source === 'camera' ? 'Kamera' : 'Galeri',
          source === 'camera'
            ? 'LapakCheck butuh akses kamera untuk mengambil foto selfie check-in. Tanpa ini, kamu hanya bisa memilih foto dari galeri.'
            : 'LapakCheck butuh akses galeri untuk memilih foto yang sudah ada di HP kamu.'
        );
        return;
      }

      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({
              quality: 0.6,
              allowsEditing: true,
              aspect: [1, 1],
            })
          : await ImagePicker.launchImageLibraryAsync({
              quality: 0.6,
              allowsEditing: true,
              aspect: [1, 1],
            });

      setIsBusy(false);

      // Wajib: cek canceled sebelum mengakses assets, supaya tidak crash
      // ketika user menutup kamera/galeri tanpa memilih apa pun.
      if (result.canceled) return;

      const uri = result.assets[0].uri;
      setPhotoUri(uri);
    } catch (err) {
      setIsBusy(false);
      Alert.alert('Terjadi Kesalahan', 'Gagal mengambil foto. Silakan coba lagi.');
    }
  }, []);

  const chooseSource = () => {
    Alert.alert('Ambil Foto Check-in', 'Pilih sumber foto:', [
      { text: '📷 Kamera', onPress: () => pickImage('camera') },
      { text: '🖼️ Galeri', onPress: () => pickImage('gallery') },
      { text: 'Batal', style: 'cancel' },
    ]);
  };

  // ---------- Ambil Lokasi + Reverse Geocoding ----------
  const getLocation = useCallback(async () => {
    try {
      setIsBusy(true);
      setBusyLabel('Mengambil lokasi...');

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        setIsBusy(false);
        showPermissionDeniedAlert(
          'Lokasi',
          'LapakCheck butuh akses lokasi untuk mencatat titik lapak kamu, supaya pembeli tahu seberapa dekat jaraknya.'
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;

      let placeName = null;
      try {
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode && geocode.length > 0) {
          const g = geocode[0];
          placeName = [g.street, g.subregion || g.district, g.city]
            .filter(Boolean)
            .join(', ');
        }
      } catch (geoErr) {
        // Reverse geocoding gagal (mis. tidak ada internet) bukan hal fatal —
        // koordinat tetap bisa dipakai tanpa nama tempat.
        console.warn('Reverse geocode gagal:', geoErr);
      }

      setLocation({ latitude, longitude, placeName });
      setIsBusy(false);
    } catch (err) {
      setIsBusy(false);
      Alert.alert('Terjadi Kesalahan', 'Gagal mengambil lokasi. Pastikan GPS aktif lalu coba lagi.');
    }
  }, []);

  const resetPreview = () => {
    setPhotoUri(null);
    setLocation(null);
  };

  const saveCheckIn = async () => {
    if (!photoUri || !location) {
      Alert.alert('Belum Lengkap', 'Ambil foto DAN lokasi terlebih dahulu sebelum menyimpan check-in.');
      return;
    }
    setIsSaving(true);
    const newItem = {
      id: `${Date.now()}`,
      photoUri,
      latitude: location.latitude,
      longitude: location.longitude,
      placeName: location.placeName,
      timestamp: new Date().toISOString(),
    };
    const updated = await addCheckIn(newItem);
    setHistory(updated);
    setIsSaving(false);
    resetPreview();
    Alert.alert('Check-in Tersimpan', 'Lapak kamu berhasil dicatat. 🎉');
  };

  const handleDelete = async (id) => {
    const updated = await removeCheckIn(id);
    setHistory(updated);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.header}>🏪 LapakCheck</Text>
            <Text style={styles.subheader}>Check-in buka lapak dengan selfie + lokasi</Text>

            <View style={styles.previewCard}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.previewPlaceholder}>
                  <Text style={styles.previewPlaceholderText}>Belum ada foto</Text>
                </View>
              )}

              {location ? (
                <View style={styles.locationBox}>
                  <Text style={styles.locationText}>
                    📍 {location.placeName || 'Nama tempat tidak diketahui'}
                  </Text>
                  <Text style={styles.coordText}>
                    {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                  </Text>
                </View>
              ) : (
                <Text style={styles.noLocationText}>Lokasi belum diambil</Text>
              )}

              {isBusy && (
                <View style={styles.busyRow}>
                  <ActivityIndicator color={colors.primary} />
                  <Text style={styles.busyText}>{busyLabel}</Text>
                </View>
              )}

              <View style={styles.buttonRow}>
                <Pressable style={styles.secondaryButton} onPress={chooseSource}>
                  <Text style={styles.secondaryButtonText}>📸 Ambil Foto</Text>
                </Pressable>
                <Pressable style={styles.secondaryButton} onPress={getLocation}>
                  <Text style={styles.secondaryButtonText}>📍 Ambil Lokasi</Text>
                </Pressable>
              </View>

              <View style={styles.buttonRow}>
                <Pressable style={styles.resetButton} onPress={resetPreview}>
                  <Text style={styles.resetButtonText}>Hapus Foto</Text>
                </Pressable>
                <Pressable
                  style={[styles.saveButton, (!photoUri || !location) && styles.saveButtonDisabled]}
                  onPress={saveCheckIn}
                  disabled={!photoUri || !location || isSaving}
                >
                  <Text style={styles.saveButtonText}>
                    {isSaving ? 'Menyimpan...' : 'Simpan Check-in'}
                  </Text>
                </Pressable>
              </View>
            </View>

            <Text style={styles.historyTitle}>
              Riwayat Check-in ({history.length})
            </Text>
          </View>
        }
        renderItem={({ item }) => <CheckInCard item={item} onDelete={handleDelete} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada riwayat check-in. Yuk buka lapak pertamamu!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  header: { fontSize: 26, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
  subheader: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  previewCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    marginBottom: spacing.sm,
  },
  previewPlaceholder: {
    width: '100%',
    height: 220,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    marginBottom: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewPlaceholderText: { color: colors.textMuted },
  locationBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  locationText: { color: colors.primaryDark, fontWeight: '600', fontSize: 14 },
  coordText: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  noLocationText: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  busyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  busyText: { marginLeft: spacing.sm, color: colors.textMuted, fontSize: 13 },
  buttonRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    paddingVertical: 10,
    borderRadius: radius.full,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  secondaryButtonText: { color: colors.primaryDark, fontWeight: '700', fontSize: 13 },
  resetButton: {
    flex: 1,
    backgroundColor: '#FDECEA',
    paddingVertical: 10,
    borderRadius: radius.full,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  resetButtonText: { color: colors.danger, fontWeight: '700', fontSize: 13 },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  saveButtonDisabled: { backgroundColor: '#A5C7A7' },
  saveButtonText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  historyTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.lg,
    fontStyle: 'italic',
  },
});
