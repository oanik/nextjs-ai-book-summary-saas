'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface CategoryListItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  displayOrder: number;
  isActive: boolean;
  bookCount: number;
}

interface CategoriesClientProps {
  categories: CategoryListItem[];
}

export default function CategoriesClient({ categories }: CategoriesClientProps) {
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);

  const activeCategoriesCount = categories.filter((category) => category.isActive).length;
  const totalBooksCount = categories.reduce((sum, category) => sum + category.bookCount, 0);

  const handleDeleteClick = (categoryId: number) => {
    // Placeholder for server action/API call wiring.
    setDeletingCategoryId(categoryId);
    window.setTimeout(() => {
      setDeletingCategoryId(null);
    }, 600);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="mt-2 text-gray-600">Manage book categories and organize your library</p>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Icon
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Books
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No categories found. Create your first category to get started.
                  </td>
                </tr>
              )}
              {categories.map((category) => (
                <tr className="hover:bg-gray-50" key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.icon ? (
                      <span className="text-2xl">{category.icon}</span>
                    ) : (
                      <span className="text-sm text-gray-400">No icon</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{category.name}</div>
                    {category.description && <div className="mt-0.5 text-sm text-gray-500">{category.description}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-600">{category.slug}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {category.bookCount} books
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{category.displayOrder}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        category.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/categories/${category.id}/edit`}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        className="text-sm font-semibold text-red-600 hover:text-red-900 disabled:opacity-50"
                        disabled={deletingCategoryId === category.id}
                        onClick={() => {
                          handleDeleteClick(category.id);
                        }}
                        type="button"
                      >
                        {deletingCategoryId === category.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-1 text-sm text-gray-600">Total Categories</div>
          <div className="text-3xl font-bold text-gray-900">{categories.length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-1 text-sm text-gray-600">Active Categories</div>
          <div className="text-3xl font-bold text-green-600">{activeCategoriesCount}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-1 text-sm text-gray-600">Total Books</div>
          <div className="text-3xl font-bold text-indigo-600">{totalBooksCount}</div>
        </div>
      </div>
    </div>
  );
}
