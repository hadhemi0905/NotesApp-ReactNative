import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import NoteInput from '../components/NoteInput';
import NoteItem from '../components/NoteItem';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../lib/errors';
import {
  createNote,
  deleteNote,
  listNotes,
  updateNote,
} from '../services/notes';

export default function NotesScreen() {
  // La route est protégée : un utilisateur existe toujours ici
  const userId = useAuth().user.$id;

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // null = modale fermée, 'new' = création, une Note = édition
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listNotes(userId);
      setNotes(data);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (draft) => {
    setSaving(true);
    try {
      if (editing === 'new') {
        const created = await createNote(userId, draft);
        setNotes((current) => [created, ...current]);
      } else if (editing) {
        const updated = await updateNote(editing.id, draft);
        setNotes((current) =>
          current.map((n) => (n.id === updated.id ? updated : n))
        );
      }
      setEditing(null);
    } catch (e) {
      Alert.alert('Could not save the note', errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = (note) => {
    Alert.alert('Delete note', `Delete "${note.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNote(note.id);
            setNotes((current) => current.filter((n) => n.id !== note.id));
          } catch (e) {
            Alert.alert('Could not delete the note', errorMessage(e));
          }
        },
      },
    ]);
  };

  // État : chargement initial
  if (loading && notes.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  // État : erreur
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable onPress={load}>
          <Text style={styles.retry}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  // État : succès (avec données ou vide)
  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(note) => note.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyTitle}>No notes yet</Text>
            <Text style={styles.emptyText}>
              Write your first note. It is private: only you can see it.
            </Text>
            <Pressable
              style={styles.emptyButton}
              onPress={() => setEditing('new')}
            >
              <Text style={styles.emptyButtonText}>Create a note</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <NoteItem note={item} onEdit={setEditing} onDelete={() => remove(item)} />
        )}
      />

      <Pressable
        style={styles.fab}
        onPress={() => setEditing('new')}
        accessibilityRole="button"
        accessibilityLabel="Add note"
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <NoteInput
        visible={editing !== null}
        initial={editing && editing !== 'new' ? editing : undefined}
        onSave={save}
        onCancel={() => setEditing(null)}
        busy={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  list: { padding: 16, flexGrow: 1 },
  error: { color: '#c0392b', textAlign: 'center' },
  retry: { color: '#208AEF', fontSize: 16 },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold' },
  emptyText: { color: '#60646c', textAlign: 'center', marginBottom: 8 },
  emptyButton: {
    backgroundColor: '#208AEF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  emptyButtonText: { color: '#fff', fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
});