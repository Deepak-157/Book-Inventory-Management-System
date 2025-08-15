// src/services/userService.ts

import api from './authService';
import type { User, UserListResponse, UserUpdateData } from '../types/user';

/**
 * User service for managing users
 */
export const userService = {
  /**
   * Get users with pagination
   */
  async getUsers(page: number = 1, limit: number = 10): Promise<UserListResponse> {
    try {
      const response = await api.get('/users', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Update a user
   */
  async updateUser(id: string, userData: UserUpdateData): Promise<User> {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  }
};