// src/pages/UserListPage.tsx

import { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { type User } from '../../types/user';
import { UserRole } from '../../types/auth';
import MainLayout from '../../components/layout/MainLayout';
import Pagination from '../../components/common/Pagination';
import { Spinner } from '../../components/common/Spinner';
import FlexibleModal from '../../components/common/Modal';
import { ExclamationIcon } from '@heroicons/react/outline';
import { useAuth } from '../../context/AuthContext';

/**
 * User list page component
 */
const UserListPage = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.VIEWER);
    const [isUpdating, setIsUpdating] = useState(false);
    console.log('Modal component:', FlexibleModal);

    // Fetch users
    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await userService.getUsers(currentPage);

            if (response.success) {
                setUsers(response.data.users);
                setTotalUsers(response.data.total);
                setTotalPages(response.data.totalPages);
            } else {
                setError('Failed to fetch users');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch users on mount and when page changes
    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    // Open role modal
    const openRoleModal = (user: User) => {
        if (user._id === currentUser?.id) {
            // Show an error or alert message
            setError("You cannot change your own role. For security reasons, another administrator must change your role.");
            return;
        }

        setSelectedUser(user);
        setSelectedRole(user.role);
        setIsRoleModalOpen(true);
    };

    // Update user role
    const updateUserRole = async () => {
        if (!selectedUser) return;

        setIsUpdating(true);

        try {
            await userService.updateUser(selectedUser._id, { role: selectedRole });

            // Update user in list
            setUsers(users.map(user =>
                user._id === selectedUser._id
                    ? { ...user, role: selectedRole }
                    : user
            ));

            setIsRoleModalOpen(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update user role';
            setError(errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    // src/pages/UserListPage.tsx (continued)

    // Get badge color for role
    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN:
                return 'bg-red-100 text-red-800';
            case UserRole.EDITOR:
                return 'bg-blue-100 text-blue-800';
            case UserRole.VIEWER:
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <MainLayout title="User Management">
            <div className="space-y-6">
                {/* Error message */}
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

                {/* User list */}
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                {isLoading ? (
                                    <div className="bg-white px-4 py-12 flex justify-center">
                                        <Spinner size="lg" />
                                    </div>
                                ) : users.length === 0 ? (
                                    <div className="bg-white px-4 py-12 text-center">
                                        <p className="text-gray-500">No users found</p>
                                    </div>
                                ) : (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    User
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Role
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Created
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
                                            {users.map((user) => (
                                                <tr key={user._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                    <span className="text-indigo-800 font-medium">
                                                                        {user.name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                                <div className="text-sm text-gray-500">{user.username}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(user.createdAt)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => openRoleModal(user)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Change Role
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {/* Pagination */}
                                {!isLoading && users.length > 0 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change role modal */}
            <FlexibleModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                title="Change User Role"
            >
                <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Change User Role</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                You are changing the role for user: <span className="font-medium">{selectedUser?.name}</span>
                            </p>
                            <div className="mt-4">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                                >
                                    {Object.values(UserRole).map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={updateUserRole}
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Updating...' : 'Save'}
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setIsRoleModalOpen(false)}
                        disabled={isUpdating}
                    >
                        Cancel
                    </button>
                </div>
            </FlexibleModal>
        </MainLayout>
    );
};

export default UserListPage;