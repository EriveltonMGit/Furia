"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  login as authLogin, 
  logout as authLogout, 
  getCurrentUser, 
  isAuthenticated as checkAuthStatus,
  register as authRegister,
  LoginData,
  AuthResponse
} from '../services/auth.service';

// Adicione esta interface para RegisterData
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>; // Alterado
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  isAuthenticated: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authStatus = await checkAuthStatus();
        setIsAuthenticated(authStatus);
        if (authStatus) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const result = await authLogin({ email, password });
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const result = await authRegister(data);
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authLogout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    const authStatus = await checkAuthStatus();
    setIsAuthenticated(authStatus);
    return authStatus;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register,
      logout, 
      checkAuth, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}