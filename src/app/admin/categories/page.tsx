'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types/product';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/supabaseUtils';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const fetchedCategories = await getCategories();
    setCategories(fetchedCategories);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const categoryData = {
      name,
      description
    };

    let success;
    if (editingCategory) {
      const result = await updateCategory(editingCategory.id, categoryData);
      success = result.success;
    } else {
      const result = await addCategory(categoryData);
      success = result.success;
    }

    if (success) {
      await loadCategories();
      setName('');
      setDescription('');
      setEditingCategory(null);
      setIsAdding(false);
    } else {
      alert('Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const result = await deleteCategory(id);
      if (result.success) {
        await loadCategories();
      } else {
        alert('Failed to delete category');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        {!isAdding && (
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingCategory(null);
              setName('');
              setDescription('');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Category
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingCategory(null);
                setName('');
                setDescription('');
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-base bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-base bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter category description"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingCategory ? 'Update' : 'Add'} Category
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingCategory(null);
                  setName('');
                  setDescription('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-6 flex items-center justify-between hover:bg-gray-50"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                {category.description && (
                  <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No categories found. Add your first category to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 