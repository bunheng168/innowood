'use client';

import { useState, useEffect } from 'react';
import { Product, Category } from '@/types/product';
import { getProducts, deleteProduct, uploadProductImages, addProduct, updateProduct, getCategories } from '@/lib/supabaseUtils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      getProducts(),
      getCategories()
    ]);
    setProducts(fetchedProducts);
    setCategories(fetchedCategories);
    setLoading(false);
  }

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...urls]);
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setIsAddingProduct(true);
    setPreviewUrls(product.image_urls);
  }

  function handleCancelEdit() {
    setEditingProduct(null);
    setIsAddingProduct(false);
    setSelectedImages([]);
    setPreviewUrls([]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    setLoading(true);
    setUploadingImages(true);

    try {
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        try {
          imageUrls = await uploadProductImages(selectedImages);
        } catch (error) {
          console.error('Error uploading images:', error);
          alert('Failed to upload images');
          setLoading(false);
          setUploadingImages(false);
          return;
        }
      }

      const nameInput = form.querySelector<HTMLInputElement>('#name');
      const descriptionInput = form.querySelector<HTMLTextAreaElement>('#description');
      const priceInput = form.querySelector<HTMLInputElement>('#price');
      const categoryInput = form.querySelector<HTMLSelectElement>('#category');
      const inStockInput = form.querySelector<HTMLInputElement>('#inStock');

      if (!nameInput || !descriptionInput || !priceInput || !categoryInput) {
        throw new Error('Required form fields not found');
      }

      const productData = {
        name: nameInput.value,
        description: descriptionInput.value,
        price: parseFloat(priceInput.value),
        category_id: categoryInput.value,
        image_urls: editingProduct 
          ? [...editingProduct.image_urls.filter(url => previewUrls.includes(url)), ...imageUrls]
          : imageUrls,
        in_stock: inStockInput?.checked || false,
      };

      let result;
      if (editingProduct) {
        result = await updateProduct(editingProduct.id, productData);
      } else {
        result = await addProduct(productData);
      }

      if (result.success) {
        form.reset();
        setSelectedImages([]);
        setPreviewUrls([]);
        setEditingProduct(null);
        loadData();
        setIsAddingProduct(false);
      } else {
        alert(`Failed to ${editingProduct ? 'update' : 'add'} product`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error ${editingProduct ? 'updating' : 'adding'} product`);
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  }

  async function handleDeleteProduct(id: string) {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(id);
      if (result.success) {
        loadData();
      } else {
        alert('Failed to delete product');
      }
    }
  }

  if (loading && !isAddingProduct) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        {!isAddingProduct && (
          <button
            onClick={() => setIsAddingProduct(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Product
          </button>
        )}
      </div>

      {isAddingProduct && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={handleCancelEdit}
              className="text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={editingProduct?.name}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-base bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                defaultValue={editingProduct?.description}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-base bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                defaultValue={editingProduct?.price}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-base bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter product price"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue={editingProduct?.category_id}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-base bg-white text-gray-900"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                Product Images
              </label>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {previewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPreviews = [...previewUrls];
                          if (!editingProduct?.image_urls.includes(url)) {
                            URL.revokeObjectURL(url);
                          }
                          newPreviews.splice(index, 1);
                          setPreviewUrls(newPreviews);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                defaultChecked={editingProduct?.in_stock}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="inStock" className="ml-2 block text-sm text-gray-900">
                In Stock
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploadingImages 
                ? 'Uploading Images...' 
                : loading 
                  ? `${editingProduct ? 'Updating' : 'Adding'} Product...` 
                  : `${editingProduct ? 'Update' : 'Add'} Product`}
            </button>
          </form>
        </div>
      )}

      {!isAddingProduct && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {/* Desktop View */}
            <table className="hidden md:table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image_urls[0] || '/placeholder.png'}
                        alt={product.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile View */}
            <div className="md:hidden">
              {products.map((product) => (
                <div key={product.id} className="border-b border-gray-200 p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image_urls[0] || '/placeholder.png'}
                      alt={product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.category?.name || 'Uncategorized'}
                      </p>
                      <div className="mt-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 