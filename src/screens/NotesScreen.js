import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@rneui/themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getNote, saveNote } from '../db/database';
import { colors } from '../theme/theme';

export default function NotesScreen({ navigation, route }) {
  const { eventId, eventTitle } = route.params;
  const [note, setNote] = useState('');
  const [loaded, setLoaded] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    getNote(eventId)
      .then((stored) => setNote(stored?.body || ''))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [eventId]);

  async function handleSave() {
    clearTimeout(timer.current);
    try {
      await saveNote(eventId, note);
      navigation.goBack();
    } catch {
      Alert.alert('Unable to save note', 'Please try again.');
    }
  }

  useEffect(() => {
    if (!loaded) return;
    timer.current = setTimeout(() => {
      saveNote(eventId, note).catch(() => {});
    }, 700);
    return () => clearTimeout(timer.current);
  }, [eventId, loaded, note]);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons color={colors.blue} name="arrow-left" size={25} />
          </Pressable>
          <Text style={styles.headerTitle}>Private note</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>NOTE FOR</Text>
          <Text h3 h3Style={styles.eventTitle}>{eventTitle}</Text>
          <Text style={styles.helper}>Only you can see this note.</Text>

          <TextInput
            multiline
            onChangeText={setNote}
            placeholder="What do you want to remember about this event?"
            placeholderTextColor="#89929B"
            style={styles.input}
            textAlignVertical="top"
            value={note}
          />
        </View>
        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            onPress={handleSave}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.cream, flex: 1 },
  flex: { flex: 1 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 7 },
  backButton: { alignItems: 'center', height: 38, justifyContent: 'center', width: 38 },
  footer: { paddingHorizontal: 22, paddingTop: 12 },
  saveButton: { alignItems: 'center', backgroundColor: colors.blue, borderRadius: 12, justifyContent: 'center', minHeight: 52, width: '100%' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  headerTitle: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  content: { flex: 1, paddingHorizontal: 22, paddingTop: 28 },
  eyebrow: { color: colors.blueLight, fontSize: 11, fontWeight: '800', letterSpacing: 1.3 },
  eventTitle: { color: colors.blue, fontSize: 25, fontWeight: '900', lineHeight: 30, marginTop: 6 },
  helper: { color: colors.muted, marginTop: 8 },
  input: { backgroundColor: '#FFFFFF', borderColor: colors.border, borderRadius: 14, borderWidth: 1, color: colors.ink, flex: 1, fontSize: 16, lineHeight: 24, marginTop: 22, maxHeight: 330, minHeight: 180, padding: 16 },
});
