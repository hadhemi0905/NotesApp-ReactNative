import { ID, Permission, Query, Role } from 'react-native-appwrite';

import { config, tablesDB } from '../lib/appwrite';

/**
 * Convertit une "row" Appwrite en Note de l'application.
 * @param {Object} row
 * @returns {import('../types').Note}
 */
const toNote = (row) => ({
  id: row.$id,
  title: row.title,
  content: row.content ?? '',
});

/**
 * Récupère toutes les notes de l'utilisateur connecté.
 * @param {string} userId
 * @returns {Promise<import('../types').Note[]>}
 */
export async function listNotes(userId) {
  const result = await tablesDB.listRows({
    databaseId: config.databaseId,
    tableId: config.tableId,
    queries: [
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
    ],
  });
  return result.rows.map(toNote);
}

/**
 * Crée une nouvelle note pour l'utilisateur connecté.
 * @param {string} userId
 * @param {import('../types').NoteDraft} draft
 * @returns {Promise<import('../types').Note>}
 */
export async function createNote(userId, draft) {
  const now = new Date().toISOString();
  const row = await tablesDB.createRow({
    databaseId: config.databaseId,
    tableId: config.tableId,
    rowId: ID.unique(),
    data: {
      title: draft.title,
      content: draft.content,
      userId,
      createdAt: now,
      updatedAt: now,
    },
    // Seul le propriétaire peut lire, modifier ou supprimer cette note
    permissions: [
      Permission.read(Role.user(userId)),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ],
  });
  return toNote(row);
}

/**
 * Met à jour une note existante.
 * @param {string} id
 * @param {import('../types').NoteDraft} draft
 * @returns {Promise<import('../types').Note>}
 */
export async function updateNote(id, draft) {
  const row = await tablesDB.updateRow({
    databaseId: config.databaseId,
    tableId: config.tableId,
    rowId: id,
    data: {
      title: draft.title,
      content: draft.content,
      updatedAt: new Date().toISOString(),
    },
  });
  return toNote(row);
}

/**
 * Supprime une note.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteNote(id) {
  await tablesDB.deleteRow({
    databaseId: config.databaseId,
    tableId: config.tableId,
    rowId: id,
  });
}