// src/types/user.ts

import { UserRole } from './auth';

/**
 * User model interface
 */
export interface User {
  _id: string;
  username: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

/**
 * User list response from API
 */
export interface UserListResponse {
  success: boolean;
  data: {
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  };
}

/**
 * User update data
 */
export interface UserUpdateData {
  name?: string;
  role?: UserRole;
}