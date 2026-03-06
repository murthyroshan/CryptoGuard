import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('cryptoGuardUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    !!localStorage.getItem('cryptoGuardUser')
  );

  const login = (email: string) => {
    const newUser = { email, name: email.split('@')[0] };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('cryptoGuardUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('cryptoGuardUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
