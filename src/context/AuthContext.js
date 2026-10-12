import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import * as auth from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Restaure la session au démarrage de l'app
  useEffect(() => {
    auth
      .getCurrentUser()
      .then(setUser)
      .finally(() => setInitializing(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      signIn: async (email, password) => {
        const u = await auth.signIn(email, password);
        setUser(u);
      },
      signUp: async (name, email, password) => {
        const u = await auth.signUp(name, email, password);
        setUser(u);
      },
      signOut: async () => {
        await auth.signOut();
        setUser(null);
      },
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
}