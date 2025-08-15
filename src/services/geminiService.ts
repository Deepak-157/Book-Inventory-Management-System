
// src/services/geminiService.ts

import axios from 'axios';

// We'll use a proxy endpoint on our backend to avoid exposing the API key
const API_URL = 'http://localhost:5000/api';

/**
 * Gemini API service for fetching book details
 */
export const geminiService = {
  /**
   * Fetch book details from ISBN using Gemini API
   */
  async getBookDetailsByISBN(isbn: string): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/books/fetch-details`, { isbn });
      return response.data;
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw error;
    }
  }
};