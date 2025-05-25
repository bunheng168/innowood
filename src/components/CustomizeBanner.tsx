import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilRuler, faComments } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function CustomizeBanner() {
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <Image
        src="/banner.jpg"
        alt="Customization Banner"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Custom Products Just for You
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            We&apos;ll bring your ideas to life with our personalized customization service
          </p>
          <p className="text-lg md:text-xl opacity-90">
            Let&apos;s create something unique that&apos;s perfectly tailored to your needs
          </p>
        </div>
      </div>
    </div>
  );
} 