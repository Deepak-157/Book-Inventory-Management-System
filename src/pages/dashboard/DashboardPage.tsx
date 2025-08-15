import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpenIcon, 
  SparklesIcon, 
  ArchiveIcon,
  ExclamationCircleIcon,
  
} from '@heroicons/react/outline';
import MainLayout from '../../components/layout/MainLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import { useBooks } from '../../context/BookContext';
import { BookCategory, BookStatus } from '../../types/book';
import { Spinner } from '../../components/common/Spinner';

/**
 * Dashboard page component
 */
const DashboardPage = () => {
  const { 
    stats, 
    isLoading, 
    error, 
    fetchDashboardStats
  } = useBooks();
  const navigate = useNavigate();

  // Fetch dashboard stats on mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  /**
   * Navigate to books page with filter
   */
  const goToBookList = (filter?: { key: string; value: any }) => {
    if (filter) {
      navigate(`/books?${filter.key}=${filter.value}`);
    } else {
      navigate('/books');
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    fetchDashboardStats();
  };

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
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

        {/* Main stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            title="All Books" 
            count={isLoading ? -1 : stats.total} 
            icon={<BookOpenIcon className="h-6 w-6 text-indigo-600" />} 
            isLoading={isLoading}
            onClick={() => goToBookList()}
          />
          <StatsCard 
            title="New Books" 
            count={isLoading ? -1 : stats.newBooks} 
            icon={<SparklesIcon className="h-6 w-6 text-green-600" />}
            color="success"
            isLoading={isLoading}
            onClick={() => goToBookList({ key: 'bookType', value: 'New' })}
          />
          <StatsCard 
            title="Old Books" 
            count={isLoading ? -1 : stats.oldBooks} 
            icon={<ArchiveIcon className="h-6 w-6 text-yellow-600" />}
            color="warning"
            isLoading={isLoading}
            onClick={() => goToBookList({ key: 'bookType', value: 'Old' })}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Book categories */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Books by Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.byCategory || {}).map(([category, count]) => (
                  <div 
                    key={category}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => goToBookList({ key: 'category', value: category })}
                  >
                    <span className="text-gray-700">{category}</span>
                    <span className="bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full text-xs font-medium">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Book statuses */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Books by Status</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(stats.byStatus || {}).map(([status, count]) => {
                  // Determine color based on status
                  let color;
                  switch (status) {
                    case BookStatus.Available:
                      color = 'bg-green-100 text-green-800';
                      break;
                    case BookStatus.Borrowed:
                      color = 'bg-blue-100 text-blue-800';
                      break;
                    case BookStatus.Lost:
                      color = 'bg-red-100 text-red-800';
                      break;
                    case BookStatus.Damaged:
                      color = 'bg-yellow-100 text-yellow-800';
                      break;
                    default:
                      color = 'bg-gray-100 text-gray-800';
                  }
                  
                  return (
                    <div 
                      key={status}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                      onClick={() => goToBookList({ key: 'status', value: status })}
                    >
                      <span className="text-gray-700">{status}</span>
                      <span className={`${color} py-1 px-2 rounded-full text-xs font-medium`}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default DashboardPage;