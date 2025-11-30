import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { ShoppingCart, LogOut, User, Menu as MenuIcon, LayoutDashboard } from 'lucide-react';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">O</div>
                <span className="text-xl font-bold text-gray-900">OrderCraft</span>
              </Link>
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <Link to="/menu" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-500 text-sm font-medium">
                  Étlap
                </Link>
                {isAdmin() && (
                   <Link to="/admin" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-500 text-sm font-medium">
                   Admin Panel
                 </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600">
                <ShoppingCart className="w-6 h-6" />
                {getCartCount() > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-600 rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="text-gray-700 hover:text-primary-600 font-medium flex items-center gap-2">
                     <User className="w-5 h-5" />
                     <span className="hidden sm:inline">{user.username}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-gray-500 hover:text-red-600" title="Kijelentkezés">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                    <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">Belépés</Link>
                    <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm font-medium">Regisztráció</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2025 OrderCraft. Minden jog fenntartva.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
