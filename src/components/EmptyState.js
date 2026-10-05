import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAppColors } from '../theme/theme';
import { useAppContext } from '../context/AppContext';

export default function EmptyState({ title, message, actionLabel, onAction }) {
  const { preferences } = useAppContext();
  const palette = getAppColors(preferences.darkTheme);
  const styles = createStyles(palette);
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons color={palette.secondary} name="calendar-blank-outline" size={42} />
      <Text h4 style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && <Button onPress={onAction} title={actionLabel} type="clear" />}
    </View>
  );
}

const createStyles = (palette) => StyleSheet.create({
  container: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 72 },
  title: { color: palette.text, fontWeight: '800', marginTop: 14 },
  message: { color: palette.muted, lineHeight: 21, marginBottom: 8, marginTop: 8, textAlign: 'center' },
});
