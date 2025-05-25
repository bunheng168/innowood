'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface ImageSliderProps {
  images: string[];
  alt: string;
  inStock: boolean;
  onImageClick?: (index: number) => void;
}

export default function ImageSlider({ images, alt, inStock, onImageClick }: ImageSliderProps) {
  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(0);
    }
  };

  return (
    <div className="relative group h-64">
      <div className="absolute inset-0 bg-gray-100">
        <div 
          onClick={handleImageClick}
          className="relative w-full h-full cursor-pointer"
        >
          <Image
            src={images[0] || '/placeholder.png'}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        
        <div className="absolute top-2 right-2 z-10">
          {inStock ? (
            <div className="bg-black text-white px-2 py-1 rounded-full text-xs font-semibold">
              In Stock
            </div>
          ) : (
            <div className="bg-black text-white px-2 py-1 rounded-full text-xs font-semibold">
              Out of Stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}