import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();

  return (
    <nav className="bg-white dark:bg-dark-secondary shadow-lg border-b border-gray-200 dark:border-dark-primary transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
              <img
                src="/images/hero/logo.jpg"
                alt="Nepal Heritage Explorer Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-dark-primary">
                Nepal Heritage Explorer
              </span>
            </Link>



                        {/* Center - Navigation Links (Public Only) */}
              {!isAuthenticated() && (
                <div className="hidden md:flex items-center space-x-8">
              <Link
                    to="/"
                    className="text-gray-700 dark:text-dark-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Home
              </Link>
              <Link
                    to="/heritages"
                    className="text-gray-700 dark:text-dark-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Heritage Sites
              </Link>
              <Link
                    to="/about"
                    className="text-gray-700 dark:text-dark-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    About
              </Link>
              <Link
                    to="/contact"
                    className="text-gray-700 dark:text-dark-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Contact
              </Link>
        </div>
      )}

              {/* Right side - Theme Toggle and Auth */}
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                
                {!isAuthenticated() && (
                  <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="btn-primary"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-secondary"
                >
                  Register
                </Link>
              </div>
                )}
              </div>

          </div>
        </div>
    </nav>
  );
};

export default Navigation; 