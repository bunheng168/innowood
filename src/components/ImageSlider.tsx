'use client';

import { useState } from 'react';

interface ImageSliderProps {
  images: string[];
  alt: string;
  inStock?: boolean;
}

export default function ImageSlider({ 
  images, 
  alt, 
  inStock
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const previousImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const showControls = () => {
    setIsControlsVisible(true);
  };

  const hideControls = () => {
    setIsControlsVisible(false);
  };

  return (
    <div 
      className="relative w-full h-60 group"
      onTouchStart={showControls}
      onTouchEnd={() => setTimeout(hideControls, 3000)}
      onMouseEnter={showControls}
      onMouseLeave={hideControls}
    >
      {/* Semi-transparent overlay when controls are visible */}
      {isControlsVisible && hasMultipleImages && (
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 z-10" />
      )}

      <div 
        className="w-full h-full bg-center bg-cover bg-no-repeat transition-transform duration-500"
        style={{
          backgroundImage: `url(${images[currentIndex] || '/placeholder.png'})`
        }}
      />
      
      {/* Stock badge */}
      {inStock !== undefined && (
        <span className={`absolute top-4 right-4 px-3 py-1 ${
          inStock ? 'bg-[#ff9800]' : 'bg-red-500'
        } text-white text-sm font-semibold rounded-full z-20 shadow-md`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      )}

      {/* Navigation arrows */}
      {hasMultipleImages && (
        <>
          <button
            onClick={previousImage}
            className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-20 transition-all duration-300 ${
              isControlsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextImage}
            className={`absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-20 transition-all duration-300 ${
              isControlsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Current image indicator */}
      {hasMultipleImages && (
        <div className={`absolute top-4 left-4 px-3 py-1 bg-black/50 text-white text-sm font-medium rounded-full z-20 transition-all duration-300 ${
          isControlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Dots indicator */}
      {hasMultipleImages && (
        <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-20 transition-all duration-300 ${
          isControlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-md ${
                index === currentIndex 
                  ? 'bg-white w-5' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}