'use client';

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

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
                <FontAwesomeIcon icon={faTelegram} className="w-6 h-6" />
              </a>
              <a 
                href="https://www.facebook.com/inn0wood" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#ff9800] transition-colors"
              >
                <FontAwesomeIcon icon={faFacebookF} className="w-6 h-6" />
              </a>
              <a 
                href="tel:+85510912190" 
                className="text-gray-600 hover:text-[#ff9800] transition-colors flex items-center"
              >
                <FontAwesomeIcon icon={faPhone} className="w-5 h-5 mr-2" />
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