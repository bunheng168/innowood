'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Product, Category } from '@/types/product';
import { getFilteredProducts, getCategories } from '@/lib/supabaseUtils';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageSlider from '@/components/ImageSlider';

interface CustomizationOptions {
  text: string;
  quantity: number;
  attachedImage: File | null;
  attachedImagePreview: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    text: '',
    quantity: 1,
    attachedImage: null,
    attachedImagePreview: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productsPerPage = 12;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { products: fetchedProducts, total } = await getFilteredProducts({
        categoryId: selectedCategory || undefined,
        page,
        limit: productsPerPage
      });
      setProducts(fetchedProducts);
      setTotalProducts(total);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, page, productsPerPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function loadCategories() {
    const fetchedCategories = await getCategories();
    setCategories(fetchedCategories);
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1); // Reset to first page when changing category
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handleCustomizeClick = (product: Product) => {
    setSelectedProduct(product);
    setShowCustomizeModal(true);
  };

  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setCustomization(prev => ({
        ...prev,
        attachedImage: file,
        attachedImagePreview: previewUrl
      }));
    }
  };

  const handleRemoveImage = () => {
    if (customization.attachedImagePreview) {
      URL.revokeObjectURL(customization.attachedImagePreview);
    }
    setCustomization(prev => ({
      ...prev,
      attachedImage: null,
      attachedImagePreview: ''
    }));
  };

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      // Create a unique file name
      const timestamp = new Date().getTime();
      const fileName = `reference-images/${timestamp}-${file.name}`;

      // Upload the file to Supabase storage
      const { error } = await supabase.storage
        .from('innowood-image')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('innowood-image')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error in upload process:', error);
      return null;
    }
  };

  const handleOrderSubmit = async () => {
    if (!selectedProduct) return;

    // Show loading state
    setLoading(true);

    let imageUrl = '';
    if (customization.attachedImage) {
      const uploadedUrl = await uploadImageToSupabase(customization.attachedImage);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    const message = `Hi! I'd like to order a custom keychain:\n
Product: ${selectedProduct.name}
Price: $${selectedProduct.price.toFixed(2)}
Quantity: ${customization.quantity}
Custom Text: ${customization.text}

Product Image: ${selectedProduct.image_urls[0] || ''}${
      imageUrl ? `\n\nReference Image: ${imageUrl}` : ''
    }`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://t.me/Samphors_Pheng?text=${encodedMessage}`, '_blank');
    
    // Reset form
    if (customization.attachedImagePreview) {
      URL.revokeObjectURL(customization.attachedImagePreview);
    }
    setShowCustomizeModal(false);
    setCustomization({
      text: '',
      quantity: 1,
      attachedImage: null,
      attachedImagePreview: ''
    });
    setLoading(false);
  };

  const handleQuantityChange = (increment: boolean) => {
    setCustomization(prev => ({
      ...prev,
      quantity: increment ? prev.quantity + 1 : Math.max(1, prev.quantity - 1)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                selectedCategory === ''
                  ? 'bg-[#ff9800] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-[#ff9800]/10 shadow'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-[#ff9800] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-[#ff9800]/10 shadow'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid with Loading State */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff9800]"></div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div 
                  onClick={() => {
                    setSelectedProduct(product);
                    setCurrentImageIndex(0);
                    setShowPreviewModal(true);
                  }}
                  className="cursor-pointer"
                >
                  <ImageSlider 
                    images={product.image_urls} 
                    alt={product.name}
                    inStock={product.in_stock}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {product.category?.name || 'Uncategorized'}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-[#ff9800]">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  
                  <button
                    onClick={() => handleCustomizeClick(product)}
                    className="w-full px-6 py-2.5 rounded-full text-sm font-medium bg-[#ff9800] text-white hover:bg-[#ff9800]/90 shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Customize & Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Customization Modal */}
          {showCustomizeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-md w-full p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Customize Your Keychain</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text for Keychain
                    </label>
                    <textarea
                      value={customization.text}
                      onChange={(e) => setCustomization({...customization, text: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff9800] focus:border-[#ff9800] min-h-[120px] resize-y text-base bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Enter the text you want on your keychain..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reference Image
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageAttach}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {!customization.attachedImage ? (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#ff9800] transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-[#ff9800]"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upload reference image
                      </button>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden">
                        <Image
                          src={customization.attachedImagePreview}
                          alt="Reference preview"
                          className="w-full h-48 object-cover"
                          width={400}
                          height={192}
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(false)}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={customization.quantity}
                        onChange={(e) => setCustomization({...customization, quantity: Math.max(1, parseInt(e.target.value) || 1)})}
                        className="w-20 px-3 py-2 border rounded-lg text-center focus:ring-[#ff9800] focus:border-[#ff9800]"
                      />
                      <button
                        onClick={() => handleQuantityChange(true)}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setShowCustomizeModal(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOrderSubmit}
                    disabled={loading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#ff9800] rounded-full hover:bg-[#ff9800]/90 transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      'Order Now'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Preview Modal */}
          {showPreviewModal && selectedProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
              <div className="relative w-full h-full flex items-center justify-center">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="relative">
                  <Image
                    src={selectedProduct.image_urls[currentImageIndex]}
                    alt={selectedProduct.name}
                    className="max-h-screen max-w-full object-contain"
                    width={1920}
                    height={1080}
                    priority
                  />
                </div>
                
                {/* Navigation Arrows */}
                {selectedProduct.image_urls.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev === 0 ? selectedProduct.image_urls.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                    >
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev === selectedProduct.image_urls.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                    >
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Thumbnail Navigation */}
                {selectedProduct.image_urls.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0">
                    <div className="flex justify-center gap-2 px-4">
                      {selectedProduct.image_urls.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentImageIndex === index 
                              ? 'bg-white w-6' 
                              : 'bg-gray-500 hover:bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-2 text-gray-500">
                {selectedCategory 
                  ? "No products available in this category." 
                  : "No products available at the moment."}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className={`px-4 py-2 rounded-lg ${
                  page === 1 || loading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-[#ff9800]/10 shadow'
                }`}
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-white rounded-lg shadow">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className={`px-4 py-2 rounded-lg ${
                  page === totalPages || loading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-[#ff9800]/10 shadow'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
