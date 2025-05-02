import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/60 text-sm">
            © 2025 Sential — All rights reserved
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;