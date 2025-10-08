'use client';

import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="text-center text-gray-300 text-sm flex items-center justify-center">
          <span>&copy; {currentYear} ChamaPro. Made with</span>
          <Heart className="h-3 w-3 mx-1 text-red-500 fill-current" />
          <span>in Kenya. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}