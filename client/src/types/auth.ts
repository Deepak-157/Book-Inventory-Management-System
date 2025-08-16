/**
 * Authentication types for the Book Inventory System
 */

/**
 * User model for authenticated users
 */
export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

/**
 * Available user roles in the system
 */
export enum UserRole {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}

/**
 * Authentication response from the API
 */
export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: number;
}

/**
 * Login credentials for authentication
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Registration data for new user
 */
export interface RegisterData {
  username: string;
  name: string;
  password: string;
  confirmPassword?: string; // Only used on the frontend for validation
}

/**
 * Authentication error details
 */
export interface AuthError {
  message: string;
  code?: string;
}
