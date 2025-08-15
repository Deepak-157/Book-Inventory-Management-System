// src/components/layout/SidebarLayout.tsx

import { type ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    HomeIcon,
    BookOpenIcon,
    PlusIcon,
    UserGroupIcon,
    MenuIcon,
    XIcon,
    LogoutIcon
} from '@heroicons/react/outline';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface SidebarLayoutProps {
    children: ReactNode;
}

/**
 * Sidebar layout component
 */
const SidebarLayout = ({ children }: SidebarLayoutProps) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAdmin = user?.role === UserRole.ADMIN;

    // Check if the current route matches the given path
    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    // Navigate to login page after logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Navigation items
    const navigationItems = [
        { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
        { name: 'Books', path: '/books', icon: BookOpenIcon },
    ];

    // Admin-only navigation items
    const adminNavigationItems = [
        { name: 'Add Book', path: '/books/add', icon: PlusIcon },
        { name: 'Users', path: '/users', icon: UserGroupIcon, adminOnly: true },
    ];

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            {/* Mobile sidebar overlay */}
            <div
                className={`md:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Mobile sidebar */}
            <div
                className={`fixed inset-y-0 left-0 flex flex-col z-50 md:hidden transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-indigo-700">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="sr-only">Close sidebar</span>
                            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="flex-shrink-0 flex items-center px-4">
                        <h1 className="text-2xl font-bold text-white">Book Inventory</h1>
                    </div>

                    <div className="mt-5 flex-1 h-0 overflow-y-auto">
                        <nav className="px-2 space-y-1">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`${isActive(item.path)
                                        ? 'bg-indigo-800 text-white'
                                        : 'text-indigo-100 hover:bg-indigo-600'
                                        } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon
                                        className={`${isActive(item.path) ? 'text-indigo-200' : 'text-indigo-300 group-hover:text-indigo-200'
                                            } mr-4 h-6 w-6`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            ))}

                            {/* Admin-only navigation items */}
                            {adminNavigationItems.map((item) => (
                                (!item.adminOnly || isAdmin) && (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`${isActive(item.path)
                                            ? 'bg-indigo-800 text-white'
                                            : 'text-indigo-100 hover:bg-indigo-600'
                                            } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <item.icon
                                            className={`${isActive(item.path) ? 'text-indigo-200' : 'text-indigo-300 group-hover:text-indigo-200'
                                                } mr-4 h-6 w-6`}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                )
                            ))}
                        </nav>
                    </div>

                    {/* User info */}
                    <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
                        <div className="flex-shrink-0 group block">
                            <div className="flex items-center">
                                <div>
                                    <div className="inline-block h-9 w-9 rounded-full bg-indigo-800 text-white flex items-center justify-center">
                                        {user?.name.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-base font-medium text-white">{user?.name || 'User'}</p>
                                    <p className="text-sm font-medium text-indigo-200 group-hover:text-white">
                                        {user?.role || 'User'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1">
                        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-700">
                            <h1 className="text-xl font-bold text-white">Book Inventory</h1>
                        </div>
                        <div className="flex-1 flex flex-col overflow-y-auto bg-indigo-700">
                            <nav className="flex-1 px-2 py-4 space-y-1">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`${isActive(item.path)
                                            ? 'bg-indigo-800 text-white'
                                            : 'text-indigo-100 hover:bg-indigo-600'
                                            } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                    >
                                        <item.icon
                                            className={`${isActive(item.path) ? 'text-indigo-200' : 'text-indigo-300 group-hover:text-indigo-200'
                                                } mr-3 h-5 w-5`}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                ))}

                                {/* Admin-only navigation items */}
                                {adminNavigationItems.map((item) => (
                                    (!item.adminOnly || isAdmin) && (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className={`${isActive(item.path)
                                                ? 'bg-indigo-800 text-white'
                                                : 'text-indigo-100 hover:bg-indigo-600'
                                                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                        >
                                            <item.icon
                                                className={`${isActive(item.path) ? 'text-indigo-200' : 'text-indigo-300 group-hover:text-indigo-200'
                                                    } mr-3 h-5 w-5`}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </Link>
                                    )
                                ))}
                            </nav>
                        </div>

                        {/* User info */}
                        <div className="flex-shrink-0 flex border-t border-indigo-800 p-4 bg-indigo-700">
                            <div className="flex-shrink-0 w-full group block">
                                <div className="flex items-center">
                                    <div>
                                        <div className="inline-block h-9 w-9 rounded-full bg-indigo-800 text-white flex items-center justify-center">
                                            {user?.name.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                                        <p className="text-xs font-medium text-indigo-200 group-hover:text-white">
                                            {user?.role || 'User'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="ml-auto flex-shrink-0 p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none"
                                    >
                                        <span className="sr-only">Logout</span>
                                        <LogoutIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                {/* Top bar */}
                <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow md:hidden">
                    <button
                        type="button"
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">Book Inventory</h1>
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            <button
                                onClick={handleLogout}
                                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <span className="sr-only">Logout</span>
                                <LogoutIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SidebarLayout;