import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  PlusIcon,
  RefreshIcon,
  ExclamationCircleIcon
} from '@heroicons/react/outline';
import MainLayout from '../../components/layout/MainLayout';
import Pagination from '../../components/common/Pagination';
import { useBooks } from '../../context/BookContext';
import { useAuth } from '../../context/AuthContext';
import { BookCategory, BookStatus, BookCondition, type BookType, type Book } from '../../types/book';
import { UserRole } from '../../types/auth';
import { Spinner } from '../../components/common/Spinner';

/**
 * Book list page component with filtering, sorting, and pagination
 */
const BookListPage = () => {
  const {
    books,
    totalBooks,
    currentPage,
    totalPages,
    isLoading,
    error,
    filters,
    sort,
    setPage,
    updateFilter,
    setSort,
    clearFilters,
    fetchBooks
  } = useBooks();

  const { hasRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const canManageBooks = hasRole(UserRole.ADMIN) || hasRole(UserRole.EDITOR);

  // Initialize filters from URL parameters on mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const initialFilters: Record<string, any> = {};

    if (queryParams.has('bookType')) {
      initialFilters.bookType = queryParams.get('bookType') as BookType;
    }

    if (queryParams.has('category')) {
      initialFilters.category = queryParams.get('category') as BookCategory;
    }

    if (queryParams.has('status')) {
      initialFilters.status = queryParams.get('status') as BookStatus;
    }

    if (queryParams.has('condition')) {
      initialFilters.condition = queryParams.get('condition') as BookCondition;
    }

    if (Object.keys(initialFilters).length > 0) {
      Object.entries(initialFilters).forEach(([key, value]) => {
        updateFilter(key as keyof typeof filters, value);
      });
    }
  }, []);

  // Apply search filter after a slight delay
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter('search', searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * Handle sort column change
   */
  const handleSort = (field: string) => {
    setSort({
      field: field as keyof Book,
      direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  /**
   * Get sort indicator for column headers
   */
  const getSortIndicator = (field: string) => {
    if (sort.field !== field) return null;

    return sort.direction === 'asc' ? (
      <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  /**
   * Navigate to book details page
   */
  const goToBookDetails = (id: string) => {
    navigate(`/books/${id}`);
  };

  /**
   * Navigate to add book page
   */
  const goToAddBook = () => {
    navigate('/books/add');
  };

  /**
   * Navigate to edit book page
   */
  const goToEditBook = (id: string) => {
    navigate(`/books/edit/${id}`);
  };

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    fetchBooks();
  };

  /**
   * Render status badge with appropriate color
   */
  const renderStatusBadge = (status: BookStatus) => {
    let colorClass;

    switch (status) {
      case BookStatus.Available:
        colorClass = 'bg-green-100 text-green-800';
        break;
      case BookStatus.Borrowed:
        colorClass = 'bg-blue-100 text-blue-800';
        break;
      case BookStatus.Lost:
        colorClass = 'bg-red-100 text-red-800';
        break;
      case BookStatus.Damaged:
        colorClass = 'bg-yellow-100 text-yellow-800';
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800';
    }

    return (
      <span className={`${colorClass} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
        {status}
      </span>
    );
  };

  /**
   * Render value change percentage with color based on value
   */
  const renderValueChange = (percentage: number) => {
    const colorClass = percentage >= 0
      ? 'text-green-600'
      : 'text-red-600';

    return (
      <span className={colorClass}>
        {percentage >= 0 ? '+' : ''}{percentage}%
      </span>
    );
  };

  return (
    <MainLayout title="Book Inventory">
      <div className="space-y-6">
        {/* Filters and actions */}
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                Books
                {totalBooks > 0 && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({totalBooks} {totalBooks === 1 ? 'book' : 'books'})
                  </span>
                )}
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <RefreshIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                Refresh
              </button>

              {canManageBooks && (
                <button
                  type="button"
                  onClick={goToAddBook}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add Book
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Search */}
            <div className="sm:col-span-6">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, or ISBN"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Book Type Filter */}
            <div className="sm:col-span-2">
              <label htmlFor="bookType" className="block text-sm font-medium text-gray-700">
                Book Type
              </label>
              <div className="mt-1">
                <select
                  id="bookType"
                  name="bookType"
                  value={filters.bookType || ''}
                  onChange={(e) => updateFilter('bookType', e.target.value || undefined)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Types</option>
                  <option value="New">New</option>
                  <option value="Old">Old</option>
                </select>
              </div>
            </div>

            {/* Category Filter */}
            <div className="sm:col-span-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="mt-1">
                <select
                  id="category"
                  name="category"
                  value={filters.category || ''}
                  onChange={(e) => updateFilter('category', e.target.value || undefined)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Categories</option>
                  {Object.values(BookCategory).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="mt-1">
                <select
                  id="status"
                  name="status"
                  value={filters.status || ''}
                  onChange={(e) => updateFilter('status', e.target.value || undefined)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Statuses</option>
                  {Object.values(BookStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {Object.keys(filters).length > 0 && (
              <div className="sm:col-span-6 flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    {/* <RefreshIcon className="h-5 w-5" aria-hidden="true" /> */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Book list */}
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                {isLoading ? (
                  <div className="bg-white px-4 py-12 flex justify-center">
                    <Spinner size="lg" />
                  </div>
                ) : books.length === 0 ? (
                  <div className="bg-white px-4 py-12 text-center">
                    <p className="text-gray-500">No books found</p>
                    {Object.keys(filters).length > 0 && (
                      <p className="text-gray-500 mt-2">
                        Try clearing some filters
                      </p>
                    )}
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('title')}
                        >
                          <div className="flex items-center">
                            <span>Title</span>
                            {getSortIndicator('title')}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('author')}
                        >
                          <div className="flex items-center">
                            <span>Author</span>
                            {getSortIndicator('author')}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('category')}
                        >
                          <div className="flex items-center">
                            <span>Category</span>
                            {getSortIndicator('category')}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center">
                            <span>Status</span>
                            {getSortIndicator('status')}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('valueChangePercentage')}
                        >
                          <div className="flex items-center">
                            <span>Value Change</span>
                            {getSortIndicator('valueChangePercentage')}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {books.map((book) => (
                        <tr key={book._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{book.title}</div>
                                <div className="text-sm text-gray-500">ISBN: {book.isbn}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{book.author}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{book.category}</div>
                            <div className="text-sm text-gray-500">{book.bookType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderStatusBadge(book.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              {renderValueChange(book.valueChangePercentage)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => goToBookDetails(book._id)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              View
                            </button>
                            {canManageBooks && (
                              <button
                                onClick={() => goToEditBook(book._id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Pagination */}
                {!isLoading && books.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookListPage;