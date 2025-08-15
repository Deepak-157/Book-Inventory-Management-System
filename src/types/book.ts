/**
 * Book inventory data types
 */

/**
 * Book status options
 */
export enum BookStatus {
  Available = "Available",
  Borrowed = "Borrowed",
  Lost = "Lost",
  Damaged = "Damaged",
}

/**
 * Book category options
 */
export enum BookCategory {
  Fiction = "Fiction",
  NonFiction = "Non-Fiction",
  Biography = "Biography",
  Science = "Science",
  History = "History",
  Programming = "Programming",
  SelfHelp = "Self-Help",
  Business = "Business",
  Other = "Other",
}

/**
 * Book condition options
 */
export enum BookCondition {
  Excellent = "Excellent",
  Good = "Good",
  Fair = "Fair",
  Poor = "Poor",
}

/**
 * Book type classification
 */
export type BookType = "New" | "Old";

/**
 * User reference in book
 */
export interface BookUser {
  id: string;
  name: string;
}

/**
 * Book model interface
 */
export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: BookCategory;
  publicationDate: string;
  status: BookStatus;
  bookType: BookType;
  condition: BookCondition;
  isFeatured: boolean;
  purchasePrice: number;
  marketValue: number;
  description: string;
  valueChangePercentage: number; // Virtual field
  createdBy: BookUser | string; // Could be populated or just an ID
  createdAt: string;
  updatedAt: string;
}

/**
 * Book creation data (without generated fields)
 */
export type BookCreateData = Omit<
  Book,
  "_id" | "valueChangePercentage" | "createdBy" | "createdAt" | "updatedAt"
>;

/**
 * Book update data (all fields optional)
 */
export type BookUpdateData = Partial<BookCreateData>;

/**
 * Book filtering options
 */
export interface BookFilters {
  bookType?: BookType;
  category?: BookCategory;
  status?: BookStatus;
  condition?: BookCondition;
  isFeatured?: boolean;
  search?: string;
}

/**
 * Book sorting options
 */
export interface BookSort {
  field: keyof Book;
  direction: "asc" | "desc";
}

/**
 * Book list response from API
 */
export interface BookListResponse {
  success: boolean;
  data: {
    books: Book[];
    total: number;
    page: number;
    totalPages: number;
  };
}

/**
 * Dashboard statistics
 */
export interface BookStats {
  total: number;
  newBooks: number;
  oldBooks: number;
  byCategory: Record<BookCategory, number>;
  byStatus: Record<BookStatus, number>;
}

/**
 * API response for stats
 */
export interface BookStatsResponse {
  success: boolean;
  data: BookStats;
}

/**
 * Single book response
 */
export interface BookResponse {
  success: boolean;
  data: Book;
}

/**
 * API error response
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
  }>;
}
