import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@rneui/themed';
import { useAppContext } from '../context/AppContext';
import { getAppColors } from '../theme/theme';

export default function CapacityBadge({ capacity, registeredCount = 0 }) {
  const { preferences } = useAppContext();
  const palette = getAppColors(preferences.darkTheme);
  const styles = createStyles(palette);
  const label = capacity === null ? 'Drop-in event' : `${registeredCount} / ${capacity}`;

  return (
    <View style={styles.badge}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const createStyles = (palette) => StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: palette.subtle,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: { color: palette.text, fontSize: 12, fontWeight: '700' },
});
