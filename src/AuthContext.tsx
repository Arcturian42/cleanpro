import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './types';
import { auth } from './lib/firebase';
import { signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sync Firebase Auth with local mock state
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      const savedUser = localStorage.getItem('cleanpro_user');
      if (savedUser && fbUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      let loggedInUser: User | null = null;

      if (email === 'admin@cleanpro.demo') {
        loggedInUser = { id: 'u1', email, name: 'Clément Martin', role: 'admin' };
      } else if (email === 'manager@cleanpro.demo') {
        loggedInUser = { id: 'u2', email, name: 'Julie Bernard', role: 'manager' };
      } else if (email === 'agent@cleanpro.demo') {
        loggedInUser = { id: 'u3', email, name: 'Marie Dupont', role: 'agent' };
      }

      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('cleanpro_user', JSON.stringify(loggedInUser));
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Firebase Auth Error:", error);
    }

    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('cleanpro_user');
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
