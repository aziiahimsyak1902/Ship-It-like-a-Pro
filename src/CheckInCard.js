// src/CheckInCard.js
// Satu item riwayat check-in di dalam FlatList.
// Menampilkan: thumbnail foto, nama tempat (hasil reverse geocoding),
// koordinat, waktu, tombol "Buka di Maps", dan tombol hapus.

import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import { colors, spacing, radius } from './theme';

function formatCoord(value) {
  return value.toFixed(5);
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CheckInCard({ item, onDelete }) {
  const openInMaps = () => {
    const url = `https://www.google.com/maps?q=${item.latitude},${item.longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Gagal Membuka Maps', 'Tidak bisa membuka aplikasi/peramban peta di HP ini.');
    });
  };

  const confirmDelete = () => {
    Alert.alert('Hapus Check-in?', 'Foto dan lokasi ini akan dihapus permanen.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => onDelete(item.id) },
    ]);
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.photoUri }} style={styles.thumb} />
      <View style={styles.info}>
        <Text style={styles.place} numberOfLines={2}>
          {item.placeName || 'Nama tempat tidak diketahui'}
        </Text>
        <Text style={styles.coord}>
          {formatCoord(item.latitude)}, {formatCoord(item.longitude)}
        </Text>
        <Text style={styles.time}>{formatTime(item.timestamp)}</Text>

        <View style={styles.actions}>
          <Pressable style={styles.mapsBtn} onPress={openInMaps}>
            <Text style={styles.mapsBtnText}>🗺️ Buka di Maps</Text>
          </Pressable>
          <Pressable style={styles.deleteBtn} onPress={confirmDelete}>
            <Text style={styles.deleteBtnText}>Hapus</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    marginRight: spacing.md,
  },
  info: { flex: 1, justifyContent: 'center' },
  place: { fontSize: 15, fontWeight: '700', color: colors.text },
  coord: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  time: { fontSize: 12, color: colors.textMuted, marginTop: 2, marginBottom: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.sm },
  mapsBtn: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.full,
    marginRight: spacing.sm,
  },
  mapsBtnText: { color: colors.primaryDark, fontSize: 12, fontWeight: '600' },
  deleteBtn: {
    backgroundColor: '#FDECEA',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.full,
  },
  deleteBtnText: { color: colors.danger, fontSize: 12, fontWeight: '600' },
});
