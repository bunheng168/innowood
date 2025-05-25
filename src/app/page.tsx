'use client';

import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { Product, Category } from '@/types/product';
import { getFilteredProducts, getCategories } from '@/lib/supabaseUtils';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageSlider from '@/components/ImageSlider';
import CustomizeBanner from '@/components/CustomizeBanner';
import CustomizeModal from '@/components/CustomizeModal';
import ImagePreviewModal from '@/components/ImagePreviewModal';

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
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    text: '',
    quantity: 1,
    attachedImage: null,
    attachedImagePreview: ''
  });

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
    console.log('Loading categories...');
    const fetchedCategories = await getCategories();
    console.log('Fetched categories:', fetchedCategories);
    setCategories(fetchedCategories);
  }

  // Add console log to see categories state
  useEffect(() => {
    console.log('Current categories:', categories);
  }, [categories]);

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top of the products section
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleImageClick = (product: Product, index: number) => {
    setSelectedProduct(product);
    setPreviewImageIndex(index);
    setShowPreviewModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-6 overflow-x-auto pb-4">
          <div className="flex flex-nowrap gap-3 min-w-min px-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all transform hover:scale-105 whitespace-nowrap ${
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
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all transform hover:scale-105 whitespace-nowrap ${
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

        {/* Products Grid */}
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
                  className="cursor-pointer"
                >
                  <ImageSlider 
                    images={product.image_urls} 
                    alt={product.name}
                    inStock={product.in_stock}
                    onImageClick={(index) => handleImageClick(product, index)}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 font-poppins">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 font-inter">
                    {product.category?.name || 'Uncategorized'}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-[#ff9800] font-poppins">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3 font-inter">
                    {product.description}
                  </p>
                  
                  <button
                    onClick={() => handleCustomizeClick(product)}
                    className="w-full px-6 py-2.5 rounded-full text-sm font-medium bg-[#ff9800] text-white hover:bg-[#ff9800]/90 shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 font-poppins"
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
            <div className="mt-8 mb-6">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1 || loading}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    page === 1 || loading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-[#ff9800] hover:bg-[#ff9800]/10 hover:text-[#ff9800] shadow-sm hover:shadow'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(num => {
                      if (num === 1 || num === totalPages) return true;
                      if (Math.abs(num - page) <= 1) return true;
                      return false;
                    })
                    .map((pageNum, index, array) => (
                      <React.Fragment key={pageNum}>
                        {index > 0 && array[index - 1] !== pageNum - 1 && (
                          <span key={`ellipsis-${pageNum}`} className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(pageNum)}
                          className={`min-w-[2.5rem] h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
                            pageNum === page
                              ? 'bg-[#ff9800] text-white font-medium shadow-lg transform scale-105'
                              : 'bg-white text-gray-700 hover:bg-[#ff9800]/10 hover:text-[#ff9800] shadow-sm hover:shadow'
                          }`}
                        >
                          {pageNum}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages || loading}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    page === totalPages || loading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-[#ff9800] hover:bg-[#ff9800]/10 hover:text-[#ff9800] shadow-sm hover:shadow'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CustomizeBanner */}
      {!loading && <CustomizeBanner />}

      {/* Customize Modal */}
      {showCustomizeModal && selectedProduct && (
        <CustomizeModal
          product={selectedProduct}
          onClose={() => setShowCustomizeModal(false)}
          onSubmit={handleOrderSubmit}
          customization={customization}
          onCustomizationChange={setCustomization}
          onImageAttach={handleImageAttach}
          onRemoveImage={handleRemoveImage}
        />
      )}

      {/* Image Preview Modal */}
      {showPreviewModal && selectedProduct && (
        <ImagePreviewModal
          images={selectedProduct.image_urls}
          initialIndex={previewImageIndex}
          onClose={() => setShowPreviewModal(false)}
          productName={selectedProduct.name}
        />
      )}

      <Footer />
    </div>
  );
}
