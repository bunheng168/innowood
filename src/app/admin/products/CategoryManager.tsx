'use client';

import { useState } from 'react';
import { Category } from '@/types/product';
import { addCategory, updateCategory, deleteCategory } from '@/lib/supabaseUtils';

interface CategoryManagerProps {
  categories: Category[];
  onCategoryChange: () => void;
  onClose: () => void;
}

export default function CategoryManager({ categories, onCategoryChange, onClose }: CategoryManagerProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

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
      onCategoryChange();
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
        onCategoryChange();
      } else {
        alert('Failed to delete category');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Manage Categories</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* Category List */}
        {!isAdding && (
          <div className="mb-4">
            <button
              onClick={() => {
                setIsAdding(true);
                setEditingCategory(null);
                setName('');
                setDescription('');
              }}
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
            >
              Add New Category
            </button>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{category.name}</h4>
                    {category.description && (
                      <p className="text-sm text-gray-500">{category.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
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
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {isAdding && (
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
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
        )}
      </div>
    </div>
  );
} 