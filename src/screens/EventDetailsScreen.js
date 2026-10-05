import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Chip, Text } from '@rneui/themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CapacityBadge from '../components/CapacityBadge';
import LoadingOverlay from '../components/LoadingOverlay';
import { useAppContext } from '../context/AppContext';
import { getEvent, getNote, isRegistered, registerForEvent } from '../db/database';
import { formatFullEventDate } from '../utils/date';
import { getAppColors } from '../theme/theme';

export default function EventDetailsScreen({ navigation, route }) {
  const { events, savedEventIds, toggleSaved, preferences } = useAppContext();
  const palette = getAppColors(preferences.darkTheme);
  const styles = createStyles(palette);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [note, setNote] = useState('');
  const tags = Array.isArray(event?.tags) ? event.tags : [];

  useEffect(() => {
    async function loadEvent() {
      const selected = route.params?.eventIndex !== undefined
        ? events[route.params.eventIndex]
        : await getEvent(route.params?.eventId);
      setEvent(selected);
      if (selected) {
        setRegistered(await isRegistered(selected.id));
      }
      setLoading(false);
    }
    loadEvent();
  }, [events, route.params?.eventId, route.params?.eventIndex]);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      if (event?.id) {
        getNote(event.id)
          .then((stored) => {
            if (active) setNote(stored?.body || '');
          })
          .catch(() => {
            if (active) setNote('');
          });
      }
      return () => {
        active = false;
      };
    }, [event?.id])
  );

  async function handleSave() {
    await toggleSaved(event.id);
  }

  const saved = event ? savedEventIds.includes(event.id) : false;

  async function handleRegister() {
    setRegistering(true);
    try {
      await registerForEvent(event.id);
      setRegistered(true);
      setEvent((current) => ({ ...current, registeredCount: current.registeredCount + 1 }));
      Alert.alert('You’re registered', 'This event has been added to your plans.');
    } catch (error) {
      Alert.alert('Registration unavailable', error.message);
    } finally {
      setRegistering(false);
    }
  }

  if (loading) {
    return <LoadingOverlay label="Opening event..." />;
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.center}>
        <Text h4>Event not found</Text>
        <Button onPress={() => navigation.goBack()} title="Go back" type="clear" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.navBar}>
        <Pressable
          onPress={() =>
            navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main')
          }
          style={styles.navButton}
        >
          <MaterialCommunityIcons color={palette.primary} name="arrow-left" size={25} />
        </Pressable>
        <Pressable onPress={handleSave} style={styles.navButton}>
          <MaterialCommunityIcons
            color={saved ? '#C6253D' : palette.primary}
            name={saved ? 'heart' : 'heart-outline'}
            size={25}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.category}>{event.category.toUpperCase()}</Text>
        <Text h1 h1Style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>{formatFullEventDate(event.startsAt, event.endsAt)}</Text>

        <View style={styles.locationRow}>
          <MaterialCommunityIcons color={palette.secondary} name="map-marker-outline" size={22} />
          <View style={styles.locationText}>
            <Text style={styles.location}>{event.location}</Text>
            {event.room ? <Text style={styles.room}>{event.room}</Text> : null}
          </View>
        </View>

        <View style={styles.capacityRow}>
          <CapacityBadge capacity={event.capacity} registeredCount={event.registeredCount} />
          {event.capacity !== null && (
            <Text style={styles.capacityText}>
              {event.registeredCount} of {event.capacity} registered
            </Text>
          )}
        </View>

        <View style={styles.rule} />
        <Text style={styles.sectionTitle}>About this event</Text>
        <Text style={styles.description}>{event.description}</Text>
        {tags.length > 0 ? (
          <View style={styles.tags}>
            {tags.map((tag) => (
              <Chip
                buttonStyle={styles.tag}
                key={tag}
                title={tag}
                titleStyle={styles.tagText}
                type="outline"
              />
            ))}
          </View>
        ) : null}

        <Pressable
          onPress={() => navigation.navigate('Notes', { eventId: event.id, eventTitle: event.title })}
          style={styles.noteCard}
        >
          <View style={styles.noteIcon}>
            <MaterialCommunityIcons color={palette.primary} name="notebook-edit-outline" size={24} />
          </View>
          <View style={styles.noteCopy}>
            <Text style={styles.noteTitle}>Private note</Text>
            <Text numberOfLines={2} style={styles.noteDescription}>
              {note || 'Add a reminder or thought about this event.'}
            </Text>
          </View>
          <MaterialCommunityIcons color={palette.muted} name="chevron-right" size={24} />
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        {event.capacity === null ? (
          <Button disabled title="No registration needed" type="outline" />
        ) : (
          <Button
            disabled={registered}
            loading={registering}
            loadingProps={{ color: palette.onPrimary }}
            onPress={handleRegister}
            title={registered ? 'Registered' : 'Register for event'}
            titleStyle={{ color: palette.onPrimary }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (palette) => StyleSheet.create({
  safeArea: { backgroundColor: palette.surface, flex: 1 },
  center: { alignItems: 'center', backgroundColor: palette.background, flex: 1, justifyContent: 'center' },
  navBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 4 },
  navButton: { alignItems: 'center', height: 38, justifyContent: 'center', width: 38 },
  content: { paddingBottom: 28, paddingHorizontal: 22 },
  category: { color: palette.secondary, fontSize: 12, fontWeight: '800', letterSpacing: 1.3, marginTop: 14 },
  title: { color: palette.primary, fontSize: 34, fontWeight: '900', letterSpacing: -0.8, lineHeight: 39, marginTop: 7 },
  date: { color: palette.secondary, fontSize: 16, fontWeight: '700', marginTop: 14 },
  locationRow: { alignItems: 'flex-start', flexDirection: 'row', marginTop: 18 },
  locationText: { marginLeft: 8 },
  location: { color: palette.text, fontSize: 15, fontWeight: '700' },
  room: { color: palette.muted, marginTop: 2 },
  capacityRow: { alignItems: 'center', flexDirection: 'row', gap: 10, marginTop: 18 },
  capacityText: { color: palette.muted, fontSize: 13 },
  rule: { backgroundColor: palette.border, height: 1, marginVertical: 24 },
  sectionTitle: { color: palette.text, fontSize: 18, fontWeight: '800' },
  description: { color: palette.text, fontSize: 16, lineHeight: 25, marginTop: 9 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 17 },
  tag: { borderColor: palette.border, borderRadius: 999 },
  tagText: { color: palette.secondary, fontSize: 12 },
  noteCard: { alignItems: 'center', backgroundColor: palette.background, borderRadius: 14, flexDirection: 'row', marginTop: 26, padding: 15 },
  noteIcon: { alignItems: 'center', backgroundColor: palette.subtle, borderRadius: 10, height: 42, justifyContent: 'center', width: 42 },
  noteCopy: { flex: 1, marginHorizontal: 12 },
  noteTitle: { color: palette.text, fontSize: 15, fontWeight: '800' },
  noteDescription: { color: palette.muted, fontSize: 12, marginTop: 2 },
  footer: { borderTopColor: palette.border, borderTopWidth: 1, paddingHorizontal: 20, paddingTop: 14 },
});
