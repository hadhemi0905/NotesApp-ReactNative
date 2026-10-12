import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function NoteItem({ note, onEdit, onDelete }) {
  return (
    <View style={styles.noteItem}>
      <Text style={styles.noteTitle}>{note.title}</Text>
      <Text style={styles.noteContent}>{note.content}</Text>
      <View style={styles.noteActions}>
        <TouchableOpacity onPress={() => onEdit(note)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(note)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noteItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  noteContent: {
    fontSize: 16,
    color: '#60646c',
    marginBottom: 10,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    color: '#208AEF',
    marginRight: 15,
  },
  deleteButton: {
    color: '#e74c3c',
  },
});