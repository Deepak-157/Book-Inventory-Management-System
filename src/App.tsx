import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// import { BookProvider } from './context/BookContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Add this import
import UnauthorizedPage from './pages/UnauthorizedPage';
import Dashboard from './pages/DashboardPage';
// import BookListPage from './pages/BookListPage';
import ProtectedRoute from './components/auth/ProtectedRoute';


function App() {
  return (
    <AuthProvider>

      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* Add this route */}
           <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Additional routes for book details, add, edit will go here */}
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

    </AuthProvider>
  );
}

export default App;