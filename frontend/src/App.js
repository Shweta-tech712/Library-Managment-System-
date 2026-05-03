import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import BooksPage from "./pages/BooksPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import UsersPage from "./pages/UsersPage";
import FinesPage from "./pages/FinesPage";
import LandingPage from "./pages/LandingPage";
import IssuedBooks from "./IssuedBooks";
import DashboardLayout from "./layout/DashboardLayout";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading Session...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout title="Dashboard Overview">
            <AdminDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/books" element={
        <ProtectedRoute>
          <BooksPage />
        </ProtectedRoute>
      } />
      
      <Route path="/books/:id" element={
        <ProtectedRoute>
          <BookDetailsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/issued" element={
        <ProtectedRoute>
          <DashboardLayout title="Issuance Records">
            <div className="glass-card">
              <IssuedBooks />
            </div>
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/users" element={
        <ProtectedRoute>
          <UsersPage />
        </ProtectedRoute>
      } />

      <Route path="/fines" element={
        <ProtectedRoute>
          <FinesPage />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
