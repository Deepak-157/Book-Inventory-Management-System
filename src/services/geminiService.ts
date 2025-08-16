import api from "./authService";

/**
 * Gemini API service for fetching book details
 */
export const geminiService = {
  async getBookDetailsByISBN(isbn: string): Promise<any> {
    try {
      const response = await api.post(`/books/fetch-details`, {
        isbn,
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching book details:", error);
      throw error;
    }
  },
};
