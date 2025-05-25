'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface ImagePreviewModalProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  productName: string;
}

export default function ImagePreviewModal({
  images,
  initialIndex = 0,
  onClose,
  productName
}: ImagePreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the modal div when it mounts
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Add global keyboard event listener
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []); // Empty dependency array since we want this to run once on mount

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 outline-none"
      tabIndex={0}
      onClick={handleBackdropClick}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        >
          <FontAwesomeIcon icon={faTimes} className="w-8 h-8" />
        </button>

        {/* Image container */}
        <div className="relative max-w-7xl w-full h-full flex items-center justify-center px-4" onClick={e => e.stopPropagation()}>
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={images[currentIndex] || '/placeholder.png'}
              alt={`${productName} - Image ${currentIndex + 1}`}
              className="max-h-[90vh] w-auto object-contain"
              width={1200}
              height={800}
            />
          </div>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 p-4 text-white hover:text-gray-300 transition-colors"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-8 h-8" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 p-4 text-white hover:text-gray-300 transition-colors"
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <span className="bg-black bg-opacity-50 px-4 py-2 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 