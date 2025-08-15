import axios from "axios";

const API_URL = "http://localhost:5000/api";

/**
 * Gemini API service for fetching book details
 */
export const geminiService = {
  async getBookDetailsByISBN(isbn: string, token?: string): Promise<any> {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
            : undefined;
        console.log

      const response = await axios.post(
        `${API_URL}/books/fetch-details`,
        { isbn },
        config
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching book details:", error);
      throw error;
    }
  },
};
