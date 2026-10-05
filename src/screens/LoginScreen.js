import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { createSession } from '../services/session';
import { getAppColors } from '../theme/theme';

export default function LoginScreen({ navigation }) {
  const { setSession, preferences } = useAppContext();
  const palette = getAppColors(preferences.darkTheme);
  const styles = createStyles(palette);
  const [username, setUsername] = useState('student');
  const [password, setPassword] = useState('maize');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }

    setLoading(true);
    const nextSession = await createSession(username.trim());
    setSession(nextSession);
    setLoading(false);
    navigation.navigate('Main');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <View style={styles.mark}>
          <MaterialCommunityIcons color={palette.onPrimary} name="calendar-star" size={34} />
        </View>
        <Text h1 h1Style={styles.title}>MaizeMeet</Text>
        <Text style={styles.tagline}>There’s more happening here.</Text>

        <View style={styles.form}>
          <Input
            autoCapitalize="none"
            autoComplete="username"
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.input}
            label="Campus username"
            onChangeText={setUsername}
            value={username}
          />
          <Input
            autoComplete="password"
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.input}
            label="Password"
            onChangeText={setPassword}
            secureTextEntry
            value={password}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            loading={loading}
            loadingProps={{ color: palette.onPrimary }}
            onPress={handleLogin}
            title="Sign in"
            titleStyle={{ color: palette.onPrimary }}
          />
          <Text style={styles.demo}>Demo account credentials are filled in for you.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (palette) => StyleSheet.create({
  safeArea: { backgroundColor: palette.background, flex: 1 },
  accent: { backgroundColor: palette.primary, height: 8, left: 0, position: 'absolute', right: 0, top: 0 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  mark: { alignItems: 'center', backgroundColor: palette.primary, borderRadius: 18, height: 64, justifyContent: 'center', width: 64 },
  title: { color: palette.primary, fontSize: 38, fontWeight: '900', letterSpacing: -1, marginTop: 16 },
  tagline: { color: palette.muted, fontSize: 17, marginTop: 3 },
  form: { backgroundColor: palette.surface, borderRadius: 18, marginTop: 32, padding: 20 },
  inputContainer: { paddingHorizontal: 0 },
  input: { borderBottomColor: palette.border },
  error: { color: palette.danger, marginBottom: 12 },
  demo: { color: palette.muted, fontSize: 12, marginTop: 15, textAlign: 'center' },
});
