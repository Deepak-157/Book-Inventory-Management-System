import axios from "axios";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  UserRole,
} from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL + "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token storage keys
const TOKEN_STORAGE_KEY = "book_inventory_token";
const USER_STORAGE_KEY = "book_inventory_user";
const EXPIRES_AT_KEY = "book_inventory_expires_at";

/**
 * Authentication service for handling user login, logout, and session management
 */
export const authService = {
  /**
   * Register a new user
   * @param data User registration data
   * @returns Authentication response with user and token
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Remove confirmPassword as it's only used for frontend validation
      const { confirmPassword, ...registerData } = data;

      const response = await api.post("/auth/register", registerData);
      const responseData = response.data;

      if (responseData.success) {
        // Store authentication data
        this.setToken(responseData.token, responseData.expiresAt);
        this.setUser(responseData.user);

        return {
          user: responseData.user,
          token: responseData.token,
          expiresAt: new Date(responseData.expiresAt).getTime(),
        };
      }

      throw new Error(responseData.message || "Registration failed");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle validation errors
        if (
          error.response.data.errors &&
          error.response.data.errors.length > 0
        ) {
          const validationError = error.response.data.errors[0];
          throw new Error(validationError.msg || "Validation error");
        }
        throw new Error(error.response.data.message || "Registration failed");
      }
      throw new Error("Registration failed. Please try again.");
    }
  },

  /**
   * Attempt to log in a user with the provided credentials
   * @param credentials User login credentials
   * @returns Authentication response with user and token
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/login", credentials);
      const data = response.data;

      if (data.success) {
        // Store authentication data
        this.setToken(data.token, data.expiresAt);
        this.setUser(data.user);

        return {
          user: data.user,
          token: data.token,
          expiresAt: new Date(data.expiresAt).getTime(),
        };
      }

      throw new Error(data.message || "Login failed");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Invalid credentials");
      }
      throw new Error("Login failed. Please try again.");
    }
  },

  /**
   * Log out the current user and clear session data
   */
  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  },

  /**
   * Store authentication token in localStorage
   * @param token JWT token
   * @param expiresAt Expiration timestamp
   */
  setToken(token: string, expiresAt: string | number): void {
    const expiryTime =
      typeof expiresAt === "string" ? new Date(expiresAt).getTime() : expiresAt;

    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(EXPIRES_AT_KEY, expiryTime.toString());
  },

  /**
   * Store user data in localStorage
   * @param user User data
   */
  setUser(user: User): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  /**
   * Get the current authentication token
   * @returns Token if valid, null otherwise
   */
  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);

    if (!token || !expiresAt) return null;

    // Check if token is expired
    if (parseInt(expiresAt) < Date.now()) {
      this.logout(); // Clear expired token
      return null;
    }

    return token;
  },

  /**
   * Get the currently authenticated user
   * @returns User if authenticated, null otherwise
   */
  getCurrentUser(): User | null {
    // First check if we have a valid token
    if (!this.getToken()) return null;

    const userData = localStorage.getItem(USER_STORAGE_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch (error) {
      return null;
    }
  },

  /**
   * Check if user is currently authenticated
   * @returns True if authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Check if current user has the specified role
   * @param role Role to check
   * @returns True if user has the role, false otherwise
   */
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.role === role;
  },

  /**
   * Set authorization header for API requests
   * @param request Axios request config
   */
  setAuthHeader(config: any) {
    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
};

// Add request interceptor for API auth
api.interceptors.request.use(
  (config) => authService.setAuthHeader(config),
  (error) => Promise.reject(error)
);

export default api;
