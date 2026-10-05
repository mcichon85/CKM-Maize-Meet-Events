import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from '@rneui/themed';
import { getAppColors } from '../theme/theme';
import { useAppContext } from '../context/AppContext';

export default function LoadingOverlay({ label = 'Loading events...' }) {
  const { preferences } = useAppContext();
  const palette = getAppColors(preferences.darkTheme);
  const styles = createStyles(palette);
  return (
    <View style={styles.container}>
      <ActivityIndicator color={palette.primary} size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const createStyles = (palette) => StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: palette.background, flex: 1, justifyContent: 'center' },
  label: { color: palette.muted, marginTop: 12 },
});
