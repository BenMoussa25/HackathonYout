import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../assets/arab-youth-city-logo.png';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  onAuthClick: (tab?: 'login' | 'signup') => void;
  onNavigate: (section: string) => void;
}

export function Navigation({ onAuthClick, onNavigate }: NavigationProps) {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  let navItems = [
    { label: '', id: 'home' }
  ];
  if (user) {
    navItems = [
      { label: 'Home', id: 'home' },
      { label: 'Hostels', id: 'hostels' },
      { label: 'Traveler Wishes', id: 'wishes' },
      { label: 'Forum', id: 'forum' },
    ];
    if (profile?.role === 'hostel_manager') {
      navItems.push({ label: 'Dashboard', id: 'dashboard' });
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center flex-shrink-0">
              <img src={logo} alt="Arab Youth City Logo" className="w-9 h-9 mr-2 rounded-full border border-green-200 bg-white" />
              <span className="text-xl font-bold text-green-600">Arab Youth City</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 rounded-md transition-colors hover:bg-gray-50 hover:text-green-600"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onNavigate('profile')}
                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-50 hover:text-green-600"
                >
                  Profile
                </button>
                <span className="text-gray-700">Hello, {profile?.full_name || 'User'}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out bg-gray-500 rounded-md hover:bg-gray-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAuthClick('login')}
                className="px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out bg-green-500 rounded-md hover:bg-green-600"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="flex items-center -mr-2 sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className="block w-full py-2 pl-3 pr-4 text-base font-medium text-left text-gray-500 border-l-4 border-transparent hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              >
                {item.label}
              </button>
            ))}
            <div className="pl-3 mt-4">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out bg-gray-500 rounded-md hover:bg-gray-600"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    onAuthClick('login');
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out bg-green-500 rounded-md hover:bg-green-600"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
