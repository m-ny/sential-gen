import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, User, LogOut } from 'lucide-react';

type ProfileMenuProps = {
  userId: string;
  onSignOut: () => void;
};

const ProfileMenu = ({ userId, onSignOut }: ProfileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <img
          src="https://yxzstyvesicxnrubiznq.supabase.co/storage/v1/object/public/assets//pfp.png"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#111111] border border-white/10 shadow-lg py-1 z-50">
          <Link
            to={`/user/${userId}`}
            className="flex items-center px-4 py-2 text-sm text-white/80 hover:bg-white/5"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
          <a
            href="mailto:sential.xyz@gmail.com"
            className="flex items-center px-4 py-2 text-sm text-white/80 hover:bg-white/5"
            onClick={() => setIsOpen(false)}
          >
            <Mail className="w-4 h-4 mr-2" />
            Support
          </a>
          <button
            onClick={() => {
              onSignOut();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-white/80 hover:bg-white/5"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;