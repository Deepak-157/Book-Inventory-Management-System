// src/App.tsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookProvider } from './context/BookContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import UserListPage from './pages/UserListPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { UserRole } from './types/auth';

function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Protected routes - any authenticated user */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/books" element={<BookListPage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
            </Route>
            
            {/* Editor/Admin only routes */}
            <Route element={<ProtectedRoute requiredRole={UserRole.EDITOR} />}>
              <Route path="/books/add" element={<AddBookPage />} />
              <Route path="/books/edit/:id" element={<EditBookPage />} />
            </Route>

            {/* Admin only routes */}
            <Route element={<ProtectedRoute requiredRole={UserRole.ADMIN} />}>
              <Route path="/users" element={<UserListPage />} />
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </BookProvider>
    </AuthProvider>
  );
}

export default App;