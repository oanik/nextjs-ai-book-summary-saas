import React from 'react';

import { prisma } from '../../../../../lib/db/prisma';
import NewBookForm from './new-book-form';

export default async function AddNewBookPage() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
        <p className="mt-2 text-gray-600">Create a new book entry with AI-generated summary and audio</p>
      </div>

      <NewBookForm categories={categories} />
    </div>
  );
}
