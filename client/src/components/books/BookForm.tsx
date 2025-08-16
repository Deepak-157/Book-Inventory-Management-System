// src/components/books/BookForm.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type BookCreateData, type BookUpdateData, BookCategory, BookStatus, BookCondition, type BookType } from '../../types/book';
import { geminiService } from '../../services/geminiService';

interface BookFormProps {
    initialData?: BookUpdateData;
    isEditing?: boolean;
    onSubmit: (data: BookUpdateData) => Promise<void>;
    isLoading?: boolean;
}

/**
 * Book form component for adding and editing books
 */
const BookForm = ({
    initialData = {},
    isEditing = false,
    onSubmit,
    isLoading = false
}: BookFormProps) => {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState<BookCreateData | BookUpdateData>({
        title: '',
        author: '',
        isbn: '',
        category: BookCategory.Fiction,
        publicationDate: '',
        status: BookStatus.Available,
        bookType: 'New' as BookType,
        condition: BookCondition.Excellent,
        isFeatured: false,
        purchasePrice: 0,
        marketValue: 0,
        description: '',
        ...initialData
    });

    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Form validation state
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Format date for input field
    useEffect(() => {
        if (initialData.publicationDate) {
            // Format the date as YYYY-MM-DD for the input field
            const date = new Date(initialData.publicationDate);
            const formattedDate = date.toISOString().split('T')[0];
            setFormData(prev => ({ ...prev, publicationDate: formattedDate }));
        }
    }, [initialData.publicationDate]);

    /**
     * Handle input change
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }

        // Handle number inputs
        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
            return;
        }

        // Handle other inputs
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    /**
     * Calculate value change percentage
     */
    const calculateValueChange = () => {
        if (!formData.purchasePrice) return 0;
        return Number(((formData.marketValue! - formData.purchasePrice!) / formData.purchasePrice! * 100).toFixed(2));
    };

    /**
 * Fetch book details from ISBN using Gemini API
 */
    const fetchBookDetails = async () => {
        if (!formData.isbn) {
            setErrors(prev => ({ ...prev, isbn: 'ISBN is required to fetch details' }));
            return;
        }

        setIsFetchingDetails(true);
        setFetchError(null);

        try {
            const response = await geminiService.getBookDetailsByISBN(formData.isbn);

            if (response.success && response.data) {
                const bookDetails = response.data;

                // Update form data with fetched details
                setFormData(prev => ({
                    ...prev,
                    title: bookDetails.title || prev.title,
                    author: bookDetails.author || prev.author,
                    publicationDate: bookDetails.publicationDate || prev.publicationDate,
                    category: bookDetails.category && Object.values(BookCategory).includes(bookDetails.category as BookCategory)
                        ? bookDetails.category
                        : prev.category,
                    description: bookDetails.description || prev.description
                }));

                // Clear any errors for the fields we just updated
                setErrors({});
            } else {
                setFetchError('Could not find book details. Please enter manually.');
            }
        } catch (error) {
            console.error('Error fetching book details:', error);
            setFetchError('Error fetching book details. Please try again or enter manually.');
        } finally {
            setIsFetchingDetails(false);
        }
    };

    /**
     * Validate form
     */
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title?.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.author?.trim()) {
            newErrors.author = 'Author is required';
        }

        if (!formData.isbn?.trim()) {
            newErrors.isbn = 'ISBN is required';
        }

        if (!formData.publicationDate) {
            newErrors.publicationDate = 'Publication date is required';
        }

        if (formData.purchasePrice === undefined || formData.purchasePrice < 0) {
            newErrors.purchasePrice = 'Purchase price must be a positive number';
        }

        if (formData.marketValue === undefined || formData.marketValue < 0) {
            newErrors.marketValue = 'Market value must be a positive number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        await onSubmit(formData);
    };

    /**
     * Handle cancel
     */
    const handleCancel = () => {
        navigate(-1); // Go back
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
            <div className="space-y-8 divide-y divide-gray-200">
                <div>
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {isEditing ? 'Edit Book' : 'Add New Book'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {isEditing ? 'Update the book information below.' : 'Fill out the form below to add a new book to the inventory.'}
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        {/* Title */}
                        <div className="sm:col-span-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={formData.title || ''}
                                    onChange={handleChange}
                                    className={`py-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-sm ${errors.title ? 'border-red-300' : ''
                                        }`}
                                />
                                {errors.title && (
                                    <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>
                        </div>

                        {/* Author */}
                        <div className="sm:col-span-4">
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                                Author
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="author"
                                    id="author"
                                    value={formData.author || ''}
                                    onChange={handleChange}
                                    className={`py-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-sm ${errors.author ? 'border-red-300' : ''
                                        }`}
                                />
                                {errors.author && (
                                    <p className="mt-2 text-sm text-red-600">{errors.author}</p>
                                )}
                            </div>
                        </div>

                        {/* ISBN */}
                        <div className="sm:col-span-3">
                            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                                ISBN
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="isbn"
                                    id="isbn"
                                    value={formData.isbn || ''}
                                    onChange={handleChange}
                                    className={`py-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-sm ${errors.isbn ? 'border-red-300' : ''
                                        }`}
                                />
                                {errors.isbn && (
                                    <p className="mt-2 text-sm text-red-600">{errors.isbn}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={fetchBookDetails}
                                disabled={isFetchingDetails || !formData.isbn}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isFetchingDetails ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Fetching...
                                    </>
                                ) : (
                                    <>
                                        <svg className="-ml-1 mr-2 h-4 w-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                                        </svg>
                                        Auto-fill Details
                                    </>
                                )}
                            </button>
                            {fetchError && (
                                <p className="mt-1 text-sm text-red-600">{fetchError}</p>
                            )}
                        </div>

                        {/* Publication Date */}
                        <div className="sm:col-span-3">
                            <label htmlFor="publicationDate" className="block text-sm font-medium text-gray-700">
                                Publication Date
                            </label>
                            <div className="mt-1">
                                <input
                                    type="date"

                                    name="publicationDate"
                                    id="publicationDate"
                                    value={formData.publicationDate || ''}
                                    onChange={handleChange}
                                    className={`py-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-sm ${errors.publicationDate ? 'border-red-300' : ''
                                        }`}
                                />
                                {errors.publicationDate && (
                                    <p className="mt-2 text-sm text-red-600">{errors.publicationDate}</p>
                                )}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="sm:col-span-3">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <div className="mt-1">
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category || ''}
                                    onChange={handleChange}
                                    className="py-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-sm"
                                >
                                    {Object.values(BookCategory).map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="sm:col-span-3">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <div className="mt-1">
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status || ''}
                                    onChange={handleChange}
                                    className="py-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-sm"
                                >
                                    {Object.values(BookStatus).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Book Type */}
                        <div className="sm:col-span-3">
                            <label htmlFor="bookType" className="block text-sm font-medium text-gray-700">
                                Book Type
                            </label>
                            <div className="mt-1">
                                <select
                                    id="bookType"
                                    name="bookType"
                                    value={formData.bookType || ''}
                                    onChange={handleChange}
                                    className="py-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-sm"
                                >
                                    <option value="New">New</option>
                                    <option value="Old">Old</option>
                                </select>
                            </div>
                        </div>

                        {/* Condition */}
                        <div className="sm:col-span-3">
                            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                                Condition
                            </label>
                            <div className="mt-1">
                                <select
                                    id="condition"
                                    name="condition"
                                    value={formData.condition || ''}
                                    onChange={handleChange}
                                    className="py-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-sm"
                                >
                                    {Object.values(BookCondition).map((condition) => (
                                        <option key={condition} value={condition}>
                                            {condition}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Featured */}
                        <div className="sm:col-span-6">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="isFeatured"
                                        name="isFeatured"
                                        type="checkbox"
                                        checked={formData.isFeatured || false}
                                        onChange={handleChange}
                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="isFeatured" className="font-medium text-gray-700">
                                        Featured
                                    </label>
                                    <p className="text-gray-500">Featured books appear prominently on the dashboard</p>
                                </div>
                            </div>
                        </div>

                        {/* Purchase Price */}
                        <div className="sm:col-span-3">
                            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">
                                Purchase Price (₹)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="purchasePrice"
                                    id="purchasePrice"
                                    step="0.01"
                                    value={formData.purchasePrice}
                                    onChange={handleChange}
                                    className={`py-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-sm ${errors.purchasePrice ? 'border-red-300' : ''
                                        }`}
                                />
                                {errors.purchasePrice && (
                                    <p className="mt-2 text-sm text-red-600">{errors.purchasePrice}</p>
                                )}
                            </div>
                        </div>

                        {/* Market Value */}
                        <div className="sm:col-span-3">
                            <label htmlFor="marketValue" className="block text-sm font-medium text-gray-700">
                                Market Value (₹)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="marketValue"
                                    id="marketValue"
                                    min="0"
                                    step="0.01"
                                    value={formData.marketValue || 0}
                                    onChange={handleChange}
                                    className={`py-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-sm ${errors.marketValue ? 'border-red-300' : ''
                                        }`}
                                />
                                {errors.marketValue && (
                                    <p className="mt-2 text-sm text-red-600">{errors.marketValue}</p>
                                )}
                            </div>
                        </div>

                        {/* Value Change Percentage (Calculated) */}
                        <div className="sm:col-span-3">
                            <label htmlFor="valueChangePercentage" className="block text-sm font-medium text-gray-700">
                                Value Change Percentage
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="valueChangePercentage"
                                    id="valueChangePercentage"
                                    value={`${calculateValueChange()}%`}
                                    disabled
                                    className="bg-gray-100 py-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-sm"
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                Calculated automatically from Purchase Price and Market Value
                            </p>
                        </div>

                        {/* Description */}
                        <div className="sm:col-span-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={formData.description || ''}
                                    onChange={handleChange}
                                    className="py-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-sm"
                                />
                            </div>
                          
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-5">
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                        {isLoading ? 'Saving...' : isEditing ? 'Update Book' : 'Add Book'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default BookForm;