import { ID } from 'react-native-appwrite';

import { account } from '../lib/appwrite';

/**
 * Retourne l'utilisateur connecté, ou null s'il n'y a pas de session valide.
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

/**
 * Connecte un utilisateur avec email + mot de passe.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
export async function signIn(email, password) {
  await account.createEmailPasswordSession({ email, password });
  return account.get();
}

/**
 * Crée un compte et connecte immédiatement l'utilisateur.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
export async function signUp(name, email, password) {
  await account.create({ userId: ID.unique(), email, password, name });
  // Créer un compte n'ouvre pas de session : on se connecte juste après
  return signIn(email, password);
}

/**
 * Déconnecte l'utilisateur courant.
 * @returns {Promise<void>}
 */
export async function signOut() {
  await account.deleteSession({ sessionId: 'current' });
}