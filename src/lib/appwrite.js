import 'react-native-url-polyfill/auto';
import { Account, Client, TablesDB } from 'react-native-appwrite';

function required(value, name) {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Check your .env file and restart Expo.`
    );
  }
  return value;
}

export const config = {
  endpoint: required(
    process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    'EXPO_PUBLIC_APPWRITE_ENDPOINT'
  ),
  projectId: required(
    process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    'EXPO_PUBLIC_APPWRITE_PROJECT_ID'
  ),
  databaseId: required(
    process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    'EXPO_PUBLIC_APPWRITE_DATABASE_ID'
  ),
  tableId: required(
    process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID,
    'EXPO_PUBLIC_APPWRITE_TABLE_ID'
  ),
};

// ⚠️ On retire setPlatform() car Appwrite Cloud ne le supporte plus
export const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

export const tablesDB = new TablesDB(client);
export const account = new Account(client);