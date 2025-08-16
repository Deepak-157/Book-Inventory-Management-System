import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import type {
    Book,
    BookCreateData,
    BookUpdateData,
    BookFilters,
    BookSort,
    BookStats,
} from '../types/book';
import { BookCategory, BookStatus } from '../types/book';
import { bookService } from '../services/bookService';

/**
 * Book context interface
 */
interface BookContextType {
    // Book list state
    books: Book[];
    totalBooks: number;
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;

    // Filtering and sorting state
    filters: BookFilters;
    sort: BookSort;

    // Dashboard statistics
    stats: BookStats;

    // Actions
    fetchBooks: () => Promise<void>;
    fetchBookById: (id: string) => Promise<Book>;
    createBook: (book: Partial<BookCreateData>) => Promise<Book>;
    updateBook: (id: string, book: BookUpdateData) => Promise<Book>;
    deleteBook: (id: string) => Promise<void>;

    // Pagination, filtering and sorting actions
    setPage: (page: number) => void;
    setFilters: (filters: BookFilters) => void;
    updateFilter: (key: keyof BookFilters, value: any) => void;
    setSort: (sort: BookSort) => void;
    clearFilters: () => void;

    // Statistics
    fetchDashboardStats: () => Promise<void>;
}

// Initial values for statistics
const initialStats: BookStats = {
    total: 0,
    newBooks: 0,
    oldBooks: 0,
    byCategory: Object.values(BookCategory).reduce((acc, cat) => {
        acc[cat] = 0;
        return acc;
    }, {} as Record<BookCategory, number>),
    byStatus: Object.values(BookStatus).reduce((acc, status) => {
        acc[status] = 0;
        return acc;
    }, {} as Record<BookStatus, number>),
};

// Create context with default values
const BookContext = createContext<BookContextType>({
    books: [],
    totalBooks: 0,
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    error: null,
    filters: {},
    sort: { field: 'title', direction: 'asc' },
    stats: initialStats,
    fetchBooks: async () => { },
    fetchBookById: async () => ({} as Book),
    createBook: async () => ({} as Book),
    updateBook: async () => ({} as Book),
    deleteBook: async () => { },
    setPage: () => { },
    setFilters: () => { },
    updateFilter: () => { },
    setSort: () => { },
    clearFilters: () => { },
    fetchDashboardStats: async () => { }
});

interface BookProviderProps {
    children: ReactNode;
}

/**
 * Book provider component
 */
export const BookProvider = ({ children }: BookProviderProps) => {
    // Book list state
    const [books, setBooks] = useState<Book[]>([]);
    const [totalBooks, setTotalBooks] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filtering and sorting state
    const [filters, setFilters] = useState<BookFilters>({});
    const [sort, setSort] = useState<BookSort>({ field: 'title', direction: 'asc' });

    // Dashboard statistics
    const [stats, setStats] = useState<BookStats>(initialStats);

    /**
     * Fetch books based on current pagination, filters and sort
     */
    const fetchBooks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await bookService.getBooks(currentPage, 5, filters, sort);

            if (response.success) {
                setBooks(response.data.books);
                setTotalBooks(response.data.total);
                setTotalPages(response.data.totalPages);
            } else {
                setError('Failed to fetch books');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch books';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Fetch dashboard statistics
     */
    const fetchDashboardStats = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await bookService.getDashboardStats();

            if (response.success) {
                setStats(response.data);
            } else {
                setError('Failed to fetch statistics');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch statistics';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch books when pagination, filters or sort changes
    useEffect(() => {
        fetchBooks();
    }, [currentPage, filters, sort]);

    /**
     * Fetch a book by ID
     */
    const fetchBookById = async (id: string): Promise<Book> => {
        setIsLoading(true);
        setError(null);

        try {
            const book = await bookService.getBookById(id);
            return book;
        } catch (err) {
            let errorMessage = 'Failed to fetch book';

            if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Create a new book
     */
    const createBook = async (bookData: Partial<BookCreateData>): Promise<Book> => {
        setIsLoading(true);
        setError(null);

        try {
            const newBook = await bookService.createBook(bookData);

            // Refresh data after creation
            fetchBooks();
            fetchDashboardStats();

            return newBook;
        } catch (err) {
            let errorMessage = 'Failed to create book';

            if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Update an existing book
     */
    const updateBook = async (id: string, bookData: BookUpdateData): Promise<Book> => {
        setIsLoading(true);
        setError(null);

        try {
            const updatedBook = await bookService.updateBook(id, bookData);

            // Update book in current list if it exists
            setBooks(books.map(book => book._id === id ? updatedBook : book));

            // Refresh statistics if relevant fields changed
            if (bookData.bookType || bookData.category || bookData.status) {
                fetchDashboardStats();
            }

            return updatedBook;
        } catch (err) {
            let errorMessage = 'Failed to update book';

            if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Delete a book
     */
    const deleteBook = async (id: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            await bookService.deleteBook(id);

            // Refresh data after deletion
            fetchBooks();
            fetchDashboardStats();
        } catch (err) {
            let errorMessage = 'Failed to delete book';

            if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Update a single filter value
     */
    const updateFilter = (key: keyof BookFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === '' ? undefined : value
        }));
        setCurrentPage(1); // Reset to first page when filter changes
    };

    /**
     * Clear all filters
     */
    const clearFilters = () => {
        setFilters({});
        setCurrentPage(1);
    };

    return (
        <BookContext.Provider
            value={{
                books,
                totalBooks,
                currentPage,
                totalPages,
                isLoading,
                error,
                filters,
                sort,
                stats,
                fetchBooks,
                fetchBookById,
                createBook,
                updateBook,
                deleteBook,
                setPage: setCurrentPage,
                setFilters,
                updateFilter,
                setSort,
                clearFilters,
                fetchDashboardStats
            }}
        >
            {children}
        </BookContext.Provider>
    );
};

/**
 * Custom hook for accessing the book context
 */
export const useBooks = () => useContext(BookContext);