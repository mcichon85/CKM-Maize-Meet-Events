import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ListItem, Switch, Text } from '@rneui/themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { clearSession } from '../services/session';
import { resetPreferences, setDarkTheme } from '../storage/preferences';
import { getAppColors } from '../theme/theme';

function SettingRow({ icon, title, description, value, onChange, palette, styles }) {
  return (
    <ListItem containerStyle={styles.row}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons color={palette.primary} name={icon} size={22} />
      </View>
      <ListItem.Content>
        <ListItem.Title style={styles.rowTitle}>{title}</ListItem.Title>
        <ListItem.Subtitle style={styles.rowDescription}>{description}</ListItem.Subtitle>
      </ListItem.Content>
      <Switch onValueChange={onChange} value={value} />
    </ListItem>
  );
}

export default function SettingsScreen({ navigation }) {
  const { preferences, setPreferences, session, setSession } = useAppContext();
  const palette = getAppColors(preferences.darkTheme);
  const styles = createStyles(palette);
  const [message, setMessage] = useState('');

  function changeDarkTheme(value) {
    setPreferences((current) => ({ ...current, darkTheme: value }));
    setDarkTheme(value).catch(() => setMessage('Could not save your preference.'));
  }

  function handleReset() {
    Alert.alert(
      'Reset app data?',
      'This will clear your local MaizeMeet data and sign you out.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetPreferences();
            setPreferences({ darkTheme: false });
            setMessage('App data reset.');
          },
        },
      ]
    );
  }

  async function handleLogout() {
    await clearSession();
    setSession(null);
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text h2 h2Style={styles.heading}>Settings</Text>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{session?.username?.slice(0, 1).toUpperCase() || 'M'}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{session?.username || 'MaizeMeet user'}</Text>
            <Text style={styles.profileLabel}>Campus account</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>DISPLAY</Text>
        <View style={styles.group}>
          <SettingRow
            description="Use a darker color palette"
            icon="weather-night"
            onChange={changeDarkTheme}
            palette={palette}
            styles={styles}
            title="Dark theme"
            value={preferences.darkTheme}
          />
        </View>

        <Text style={styles.sectionLabel}>ACCOUNT & DATA</Text>
        <Button
          buttonStyle={styles.secondaryButton}
          onPress={handleReset}
          title="Reset app data"
          titleStyle={styles.secondaryButtonText}
          type="outline"
        />
        <Button
          buttonStyle={styles.logoutButton}
          onPress={handleLogout}
          title="Sign out"
          titleStyle={styles.logoutText}
          type="clear"
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Text style={styles.version}>MaizeMeet · Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (palette) => StyleSheet.create({
  safeArea: { backgroundColor: palette.background, flex: 1 },
  content: { padding: 20 },
  heading: { color: palette.primary, fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  profile: { alignItems: 'center', backgroundColor: palette.surface, borderRadius: 16, flexDirection: 'row', marginTop: 18, padding: 17 },
  avatar: { alignItems: 'center', backgroundColor: palette.primary, borderRadius: 24, height: 48, justifyContent: 'center', marginRight: 13, width: 48 },
  avatarText: { color: palette.onPrimary, fontSize: 20, fontWeight: '900' },
  profileName: { color: palette.text, fontSize: 16, fontWeight: '800' },
  profileLabel: { color: palette.muted, fontSize: 13, marginTop: 2 },
  sectionLabel: { color: palette.secondary, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8, marginTop: 25 },
  group: { borderRadius: 14, overflow: 'hidden' },
  row: { minHeight: 78, paddingHorizontal: 15 },
  iconBox: { alignItems: 'center', backgroundColor: palette.subtle, borderRadius: 9, height: 38, justifyContent: 'center', width: 38 },
  rowTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  rowDescription: { color: palette.muted, fontSize: 12, marginTop: 3 },
  divider: { backgroundColor: palette.border, height: 1, marginLeft: 68 },
  secondaryButton: { borderColor: palette.primary, borderRadius: 10, marginTop: 2 },
  secondaryButtonText: { color: palette.primary },
  logoutButton: { marginTop: 10 },
  logoutText: { color: palette.danger },
  message: { color: palette.secondary, marginTop: 10, textAlign: 'center' },
  version: { color: palette.muted, fontSize: 12, marginTop: 28, textAlign: 'center' },
});
