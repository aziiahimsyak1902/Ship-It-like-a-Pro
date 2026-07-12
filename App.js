// App.js
// Entry point aplikasi. Menampilkan PrimingScreen HANYA pada kunjungan
// pertama (status disimpan di AsyncStorage), lalu lanjut ke CheckInScreen
// untuk seterusnya.

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimingScreen from './src/PrimingScreen';
import CheckInScreen from './src/CheckInScreen';
import { getPrimingSeen, setPrimingSeen } from './src/storage';
import { colors } from './src/theme';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPriming, setShowPriming] = useState(false);

  useEffect(() => {
    (async () => {
      const seen = await getPrimingSeen();
      setShowPriming(!seen);
      setIsLoading(false);
    })();
  }, []);

  const handleContinue = async () => {
    await setPrimingSeen();
    setShowPriming(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      {showPriming ? (
        <PrimingScreen onContinue={handleContinue} />
      ) : (
        <CheckInScreen />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
