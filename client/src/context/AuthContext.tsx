import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials, AuthError, RegisterData } from '../types/auth';
import { UserRole } from '../types/auth';
import { authService } from '../services/authService';

/**
 * Authentication context interface
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  clearError: () => void;
}

// Create the authentication context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: () => { },
  hasRole: () => false,
  clearError: () => { },
});

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Initialize authentication state from storage
  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login handler
   * @param credentials User credentials
   * @returns Success status
   */
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError({ message: errorMessage });
      return false;
    }
  };

  // Add this method to the AuthProvider component
  /**
   * Register a new user
   * @param data Registration data
   * @returns Success status
   */
  const register = async (data: RegisterData): Promise<boolean> => {
    setError(null);
    try {
      const response = await authService.register(data);
      setUser(response.user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError({ message: errorMessage });
      return false;
    }
  };


  /**
   * Logout handler
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Check if user has a specific role
   * @param role Role to check
   * @returns True if user has the role
   */
  const hasRole = (role: UserRole): boolean => {
    return user !== null && user.role === role;
  };

  /**
   * Clear any authentication errors
   */
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        hasRole,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for accessing the authentication context
 */
export const useAuth = () => useContext(AuthContext);