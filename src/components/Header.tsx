import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCurrentUserProfile } from '../hooks/useCurrentUserProfile';
import { isAdminEmail } from '../config/env';

interface HeaderProps {
  showAdmin?: boolean;
  setShowAdmin?: (show: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ showAdmin, setShowAdmin }) => {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const { displayName: profileDisplayName } = useCurrentUserProfile(user?.id);
  const displayName =
    profileDisplayName ?? user?.user_metadata?.display_name ?? user?.email ?? '';

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass h-16' : 'bg-transparent h-20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl transition-transform duration-300 group-hover:scale-110">🏎️</span>
          <span className={`font-bold text-lg tracking-tight uppercase ${isScrolled ? 'text-navy' : 'text-white'}`}>
            Gunther's <span className="text-papaya">Groupies</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`hidden md:flex items-center gap-6 ${isScrolled ? 'text-navy' : 'text-white'}`}>
          <Link 
            to="/" 
            className={`text-sm font-medium transition-all hover:text-papaya ${isActive('/') ? 'text-papaya' : ''}`}
          >
            Current Season
          </Link>
          <Link 
            to="/points-finish" 
            className={`text-sm font-medium transition-all hover:text-papaya ${isActive('/points-finish') ? 'text-papaya' : ''}`}
          >
            Points Finish
          </Link>
          
          <div className="h-4 w-px bg-current opacity-20 mx-2" />
          
          <Link 
            to="/season/2026" 
            className={`text-xs font-medium opacity-80 hover:opacity-100 hover:text-papaya transition-all ${isActive('/season/2026') ? 'text-papaya opacity-100' : ''}`}
          >
            2026
          </Link>
          <Link 
             to="/season/2025" 
             className={`text-xs font-medium opacity-80 hover:opacity-100 hover:text-papaya transition-all ${isActive('/season/2025') ? 'text-papaya opacity-100' : ''}`}
          >
            2025
          </Link>
           <Link 
             to="/season/2024" 
             className={`text-xs font-medium opacity-80 hover:opacity-100 hover:text-papaya transition-all ${isActive('/season/2024') ? 'text-papaya opacity-100' : ''}`}
          >
            2024
          </Link>
        </nav>

        {/* Auth / User */}
        <div className={`hidden md:flex items-center gap-4 ${isScrolled ? 'text-navy' : 'text-white'}`}>
          {!isLoading && (
            user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold opacity-90 truncate max-w-[120px]">
                  {displayName}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-medium border border-current rounded-full hover:bg-papaya hover:border-papaya hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 text-xs font-bold bg-papaya text-white rounded-full hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/30"
              >
                Login
              </Link>
            )
          )}
           {showAdmin !== undefined && setShowAdmin && (
            showAdmin ? (
               <button
                onClick={() => setShowAdmin(false)}
                className="text-xs font-medium hover:text-papaya transition-colors"
              >
                Exit Admin
              </button>
            ) : (
              isAdminEmail(user?.email) && (
                <button
                  onClick={() => setShowAdmin(true)}
                  className="text-xs font-medium opacity-50 hover:opacity-100 hover:text-papaya transition-all"
                >
                  Admin
                </button>
              )
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden p-2 rounded-lg ${isScrolled ? 'text-navy' : 'text-white'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-4 flex flex-col gap-4 shadow-xl md:hidden animate-in slide-in-from-top-2">
          <Link to="/" className="text-navy font-medium hover:text-papaya" onClick={() => setIsMobileMenuOpen(false)}>Current Season</Link>
          <Link to="/points-finish" className="text-navy font-medium hover:text-papaya" onClick={() => setIsMobileMenuOpen(false)}>Points Finish</Link>
          <div className="h-px bg-gray-100 my-1" />
          <Link to="/season/2026" className="text-sm text-gray-600 hover:text-papaya" onClick={() => setIsMobileMenuOpen(false)}>2026 Season</Link>
          <Link to="/season/2025" className="text-sm text-gray-600 hover:text-papaya" onClick={() => setIsMobileMenuOpen(false)}>2025 Season</Link>
          {!isLoading && (
            user ? (
               <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="text-left text-sm text-red font-medium"
                >
                  Logout ({displayName})
                </button>
            ) : (
              <Link to="/login" className="text-center w-full py-2 bg-papaya text-white rounded-lg font-bold" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            )
          )}
        </div>
      )}
    </header>
  );
};
