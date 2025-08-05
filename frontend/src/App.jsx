import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import performanceService from './services/performanceService';
import notificationService from './services/notificationService';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import MyFavorites from './pages/MyFavorites';
import AdminDashboard from './pages/AdminDashboard';
import AdminStatistics from './pages/AdminStatistics';
import AddHeritage from './pages/AddHeritage';
import EditHeritage from './pages/EditHeritage';
import HeritageList from './pages/HeritageList';
import UserManagement from './pages/UserManagement';
import Homepage from './pages/Homepage';
import HeritageSites from './pages/HeritageSites';
import HeritageDetail from './pages/HeritageDetail';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  const { isAdmin, isAuthenticated } = useAuth();

  useEffect(() => {
    // Initialize performance service
    performanceService.initialize();
    
    // Initialize notification service
    notificationService.initialize();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-dark-primary transition-colors duration-200">
          <Navigation />
          <Sidebar />
          <div className={`pt-4 ${isAuthenticated() ? 'ml-64' : ''}`}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/heritages" element={<HeritageSites />} />
              <Route path="/heritage/:id" element={<HeritageDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user/dashboard" 
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-profile" 
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/change-password" 
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/saved-heritages" 
                element={
                  <ProtectedRoute>
                    <MyFavorites />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/statistics" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminStatistics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/heritage/add" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AddHeritage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/heritage/edit/:id" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <EditHeritage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/heritage/list" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <HeritageList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />

            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 