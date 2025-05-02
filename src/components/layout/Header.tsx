import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import ProfileMenu from '../ui/ProfileMenu';

type HeaderProps = {
  isLoggedIn: boolean;
  onSignOut: () => void;
  onSignIn: () => void;
  userId?: string;
};

const Header = ({ isLoggedIn, onSignOut, onSignIn, userId }: HeaderProps) => {
  const location = useLocation();
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-transparent z-50 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[1.4px] h-7 bg-white absolute" style={{ left: '47%' }} />
              <div className="w-7 h-[1.4px] bg-white absolute" style={{ top: '47%' }} />
              <div className="w-[1.4px] h-7 bg-white absolute rotate-45 origin-center" style={{ left: '47%' }} />
              <div className="w-[1.4px] h-7 bg-white absolute -rotate-45 origin-center" style={{ left: '47%' }} />
            </div>
          </div>
          <span className="text-white font-normal text-xl">Sential</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/pricing" 
            className={`text-white/80 hover:text-white text-sm transition-colors ${
              location.pathname === '/pricing' ? 'text-white' : ''
            }`}
          >
            Pricing
          </Link>
          {isLoggedIn ? (
            <ProfileMenu userId={userId || ''} onSignOut={onSignOut} />
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={onSignIn}>
                Sign Up
              </Button>
              <Button variant="outline" size="sm" onClick={onSignIn}>
                Log In
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;