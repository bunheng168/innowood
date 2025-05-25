'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

interface CustomizeModalProps {
  product: Product;
  onClose: () => void;
  onSubmit: () => void;
  customization: {
    text: string;
    quantity: number;
    attachedImage: File | null;
    attachedImagePreview: string;
  };
  onCustomizationChange: (customization: {
    text: string;
    quantity: number;
    attachedImage: File | null;
    attachedImagePreview: string;
  }) => void;
  onImageAttach: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export default function CustomizeModal({
  product,
  onClose,
  onSubmit,
  customization,
  onCustomizationChange,
  onImageAttach,
  onRemoveImage,
}: CustomizeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && e.ctrlKey) onSubmit();
      if (e.key === 'ArrowUp') handleQuantityChange(true);
      if (e.key === 'ArrowDown') handleQuantityChange(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSubmit]);

  const handleQuantityChange = (increment: boolean) => {
    const newQuantity = increment
      ? customization.quantity + 1
      : Math.max(1, customization.quantity - 1);
    onCustomizationChange({ ...customization, quantity: newQuantity });
  };

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      tabIndex={-1}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-poppins">{product.name}</h2>
              <p className="text-gray-500 font-inter">{product.category?.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors p-2"
              title="Close"
            >
              <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
            </button>
          </div>

          {/* Product Image */}
          <div className="mb-6">
            <Image
              src={product.image_urls[0] || '/placeholder.png'}
              alt={product.name}
              width={400}
              height={300}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Customization Form */}
          <div className="space-y-6">
            {/* Quantity Selector */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2 font-poppins">
                Quantity
              </label>
              <div className="flex items-center space-x-4 bg-white border-2 border-gray-200 p-3 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(false)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="Decrease (Down Arrow)"
                >
                  <FontAwesomeIcon icon={faMinus} className="w-4 h-4 text-gray-700" />
                </button>
                <span className="text-2xl font-semibold font-poppins min-w-[3ch] text-center text-gray-900">
                  {customization.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(true)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="Increase (Up Arrow)"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Custom Text */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2 font-poppins">
                Custom Text
              </label>
              <textarea
                value={customization.text}
                onChange={(e) =>
                  onCustomizationChange({ ...customization, text: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-[#ff9800] focus:border-[#ff9800] font-inter text-gray-900 placeholder-gray-500"
                placeholder="Enter your custom text here..."
              />
            </div>

            {/* Reference Image Upload */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2 font-poppins">
                Reference Image (Optional)
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageAttach}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="block w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-[#ff9800] transition-colors font-inter text-gray-700 hover:text-gray-900"
                >
                  Click to upload an image
                </label>
                {customization.attachedImagePreview && (
                  <div className="relative">
                    <Image
                      src={customization.attachedImagePreview}
                      alt="Reference"
                      width={200}
                      height={200}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={onRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Total Price */}
          <div className="mt-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-medium font-poppins">Total:</span>
              <span className="text-2xl font-bold text-[#ff9800] font-poppins">
                ${(product.price * customization.quantity).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              onClick={onSubmit}
              className="w-full px-6 py-3 bg-[#ff9800] text-white rounded-full font-medium hover:bg-[#ff9800]/90 transition-colors transform hover:scale-105 flex items-center justify-center space-x-2 font-poppins"
              title="Submit (Ctrl + Enter)"
            >
              <span>Order via Telegram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 