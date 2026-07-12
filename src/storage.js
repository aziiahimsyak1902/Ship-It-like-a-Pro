// src/storage.js
// Kumpulan helper untuk baca/tulis data ke AsyncStorage.
// Dipakai untuk: (1) menyimpan riwayat check-in, (2) flag apakah priming
// screen sudah pernah dilihat user, supaya tidak muncul berulang setiap
// buka app.

import AsyncStorage from '@react-native-async-storage/async-storage';

const CHECKINS_KEY = '@lapakcheck/checkins';
const PRIMING_SEEN_KEY = '@lapakcheck/priming_seen';

/**
 * Ambil semua riwayat check-in yang tersimpan.
 * Selalu mengembalikan array (kosong jika belum ada data / gagal parse).
 */
export async function loadCheckIns() {
  try {
    const raw = await AsyncStorage.getItem(CHECKINS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Gagal memuat check-in dari storage:', err);
    return [];
  }
}

/**
 * Simpan seluruh array check-in (overwrite).
 */
export async function saveCheckIns(checkIns) {
  try {
    await AsyncStorage.setItem(CHECKINS_KEY, JSON.stringify(checkIns));
    return true;
  } catch (err) {
    console.warn('Gagal menyimpan check-in ke storage:', err);
    return false;
  }
}

/**
 * Tambah satu check-in baru ke daftar yang sudah ada, lalu simpan.
 * Mengembalikan array terbaru supaya bisa langsung dipakai di state.
 */
export async function addCheckIn(newItem) {
  const existing = await loadCheckIns();
  const updated = [newItem, ...existing];
  await saveCheckIns(updated);
  return updated;
}

/**
 * Hapus satu check-in berdasarkan id, lalu simpan ulang.
 */
export async function removeCheckIn(id) {
  const existing = await loadCheckIns();
  const updated = existing.filter((item) => item.id !== id);
  await saveCheckIns(updated);
  return updated;
}

export async function getPrimingSeen() {
  try {
    const raw = await AsyncStorage.getItem(PRIMING_SEEN_KEY);
    return raw === 'true';
  } catch (err) {
    return false;
  }
}

export async function setPrimingSeen() {
  try {
    await AsyncStorage.setItem(PRIMING_SEEN_KEY, 'true');
  } catch (err) {
    console.warn('Gagal menyimpan status priming:', err);
  }
}
