import api from './authService';
import type { 
  Book, 
  BookCreateData, 
  BookUpdateData,
  BookFilters, 
  BookSort, 
  BookListResponse,
  BookStatsResponse,
  BookResponse,
  ApiError
} from '../types/book';

/**
 * Book service for managing books in the inventory
 */
export const bookService = {
  /**
   * Get books with pagination, filtering, and sorting
   */
  async getBooks(
    page: number = 1, 
    limit: number = 10, 
    filters: BookFilters = {}, 
    sort: BookSort = { field: 'title', direction: 'asc' }
  ): Promise<BookListResponse> {
    try {
      // Build query parameters
      const params: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString()
      };
      
      // Add filters if they exist
      if (filters.bookType) {
        params.bookType = filters.bookType;
      }
      
      if (filters.category) {
        params.category = filters.category;
      }
      
      if (filters.status) {
        params.status = filters.status;
      }
      
      if (filters.condition) {
        params.condition = filters.condition;
      }
      
      if (filters.isFeatured !== undefined) {
        params.isFeatured = filters.isFeatured.toString();
      }
      
      if (filters.search) {
        params.search = filters.search;
      }
      
      // Add sort parameters
      if (sort.field && sort.direction) {
        params.sortField = sort.field as string;
        params.sortDirection = sort.direction;
      }
      
      const response = await api.get('/books', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },
  
  /**
   * Get a book by its ID
   */
  async getBookById(id: string): Promise<Book> {
    try {
      const response = await api.get<BookResponse>(`/books/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching book with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new book
   */
  async createBook(bookData: BookCreateData): Promise<Book> {
    try {
      const response = await api.post<BookResponse>('/books', bookData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing book
   */
  async updateBook(id: string, bookData: BookUpdateData): Promise<Book> {
    try {
      const response = await api.put<BookResponse>(`/books/${id}`, bookData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating book with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a book
   */
  async deleteBook(id: string): Promise<void> {
    try {
      await api.delete(`/books/${id}`);
    } catch (error) {
      console.error(`Error deleting book with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<BookStatsResponse> {
    try {
      const response = await api.get<BookStatsResponse>('/books/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching book statistics:', error);
      throw error;
    }
  }
};