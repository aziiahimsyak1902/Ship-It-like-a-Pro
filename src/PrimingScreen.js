// src/PrimingScreen.js
// "Priming screen": layar penjelasan yang tampil SEBELUM dialog izin
// sistem (kamera/lokasi) muncul. Tujuannya supaya user paham dulu KENAPA
// izin ini dibutuhkan, sehingga peluang mereka menekan "Allow" jauh lebih
// besar dibanding langsung disodori dialog sistem tanpa konteks.

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { colors, spacing, radius } from './theme';

const REASONS = [
  {
    icon: '📸',
    title: 'Kamera',
    desc: 'Dipakai untuk mengambil foto selfie saat kamu check-in membuka lapak jualan.',
  },
  {
    icon: '🖼️',
    title: 'Galeri',
    desc: 'Sebagai alternatif jika kamu ingin memilih foto yang sudah ada, bukan foto baru.',
  },
  {
    icon: '📍',
    title: 'Lokasi',
    desc: 'Dipakai untuk mencatat titik koordinat lapak kamu, supaya pembeli tahu jaraknya.',
  },
];

export default function PrimingScreen({ onContinue }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.emoji}>🏪</Text>
        <Text style={styles.title}>Selamat Datang di LapakCheck</Text>
        <Text style={styles.subtitle}>
          Sebelum mulai, aplikasi ini akan meminta beberapa izin ke HP kamu.
          Berikut alasannya:
        </Text>

        {REASONS.map((r) => (
          <View key={r.title} style={styles.reasonCard}>
            <Text style={styles.reasonIcon}>{r.icon}</Text>
            <View style={styles.reasonTextWrap}>
              <Text style={styles.reasonTitle}>{r.title}</Text>
              <Text style={styles.reasonDesc}>{r.desc}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.note}>
          Kamu selalu bisa menolak izin ini. Jika ditolak, sebagian fitur
          check-in tidak akan berjalan, tapi aplikasi tetap bisa dipakai
          tanpa crash.
        </Text>
      </ScrollView>

      <Pressable style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>Saya Mengerti, Lanjutkan</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl },
  emoji: { fontSize: 48, textAlign: 'center', marginBottom: spacing.sm },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 21,
  },
  reasonCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-start',
  },
  reasonIcon: { fontSize: 28, marginRight: spacing.md },
  reasonTextWrap: { flex: 1 },
  reasonTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 },
  reasonDesc: { fontSize: 14, color: colors.textMuted, lineHeight: 19 },
  note: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
