'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo/innowood.svg"
                alt="Innowood Logo"
                width={180}
                height={48}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/admin" 
              className="text-gray-600 hover:text-[#ff9800] px-3 py-2 text-sm font-medium font-poppins"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 