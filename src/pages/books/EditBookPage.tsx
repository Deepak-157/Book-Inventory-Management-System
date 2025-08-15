// src/pages/EditBookPage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import BookForm from '../../components/books/BookForm';
import { useBooks } from '../../context/BookContext';
import type { Book, BookUpdateData } from '../../types/book';
import { ExclamationIcon } from '@heroicons/react/outline';
import { Spinner } from '../../components/common/Spinner';

/**
 * Edit book page component
 */
const EditBookPage = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchBookById, updateBook } = useBooks();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch book data
  useEffect(() => {
    const getBook = async () => {
      if (id) {
        try {
          const bookData = await fetchBookById(id);
          setBook(bookData);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching the book';
          setError(errorMessage);
        } finally {
          setIsFetching(false);
        }
      }
    };

    getBook();
  }, [id]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (data: BookUpdateData) => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      await updateBook(id, data);
      navigate(`/books/${id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating the book';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <MainLayout title="Edit Book">
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error && !book) {
    return (
      <MainLayout title="Edit Book">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <ExclamationIcon className="h-6 w-6 text-red-600 mr-3" />
              <p className="text-red-600">{error}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate('/books')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Books
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!book) {
    return (
      <MainLayout title="Edit Book">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p>Book not found.</p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate('/books')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Books
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Edit Book">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <BookForm
            initialData={book}
            isEditing={true}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default EditBookPage;