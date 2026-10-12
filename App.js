import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomeScreen from './src/app/index';
import LoginScreen from './src/app/login';
import NotesScreen from './src/app/notes';

const Stack = createStackNavigator();

function RootNavigator() {
  const { user, initializing } = useAuth();

  // Pendant la vérification initiale de la session, on affiche un spinner
  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Utilisateur connecté : accès à Home et Notes
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Notes" component={NotesScreen} />
        </>
      ) : (
        // Utilisateur non connecté : uniquement Login
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});