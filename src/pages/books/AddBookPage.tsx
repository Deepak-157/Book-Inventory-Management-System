// src/pages/AddBookPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import BookForm from '../../components/books/BookForm';
import { useBooks } from '../../context/BookContext';
import type { BookCreateData } from '../../types/book';
import { ExclamationIcon } from '@heroicons/react/outline';

/**
 * Add book page component
 */
const AddBookPage = () => {
  const { createBook } = useBooks();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle form submission
   */
  const handleSubmit = async (data: BookCreateData) => {
    setIsLoading(true);
    setError(null);

    try {
      const newBook = await createBook(data);
      navigate(`/books/${newBook._id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the book';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <MainLayout title="Add New Book">
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
          <BookForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </MainLayout>
  );
};

export default AddBookPage;