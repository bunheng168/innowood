'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center">
            <Image
              src="/logo/innowood.svg"
              alt="Innowood Logo"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </div>
          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="flex items-center space-x-4">
              <a 
                href="https://t.me/Samphors_Pheng" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#ff9800] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.43 7.12l-1.66 7.83c-.12.55-.46.68-.93.42l-2.57-1.89-1.24 1.2c-.14.14-.25.25-.52.25l.19-2.62 4.76-4.3c.21-.18-.05-.28-.32-.1L9.81 11.7l-2.53-.78c-.55-.17-.56-.55.12-.82l9.89-3.81c.46-.17.86.11.67.83z"/>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/inn0wood" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#ff9800] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="tel:+85510912190" 
                className="text-gray-600 hover:text-[#ff9800] transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>+855 10 912 190</span>
              </a>
            </div>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Innowood. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 