import type { ReactNode } from 'react';
import { Spinner } from '../common/Spinner';

interface StatsCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  isLoading?: boolean;
  onClick?: () => void;
}

/**
 * Card component for displaying statistics
 */
const StatsCard = ({ 
  title, 
  count, 
  icon, 
  color = 'primary', 
  isLoading = false,
  onClick 
}: StatsCardProps) => {
  const colorClasses = {
    primary: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      iconBg: 'bg-indigo-100',
    },
    success: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
    },
    danger: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      iconBg: 'bg-red-100',
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
  };

  const classes = colorClasses[color];

  return (
    <div 
      className={`${classes.bg} overflow-hidden shadow rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md`}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${classes.iconBg} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className={`text-lg font-medium ${classes.text}`}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Spinner size="sm" />
                      <span className="ml-2 text-gray-400 text-sm">Loading...</span>
                    </div>
                  ) : (
                    count
                  )}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;