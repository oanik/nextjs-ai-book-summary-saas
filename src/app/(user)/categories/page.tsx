import React, { Suspense } from 'react';

import { prisma } from '../../../../lib/db/prisma';
import CategoriesClient, { type CategoryListItem } from './categories-client';
import CategoriesLoading from './loading';

async function CategoriesDataSection() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          books: true,
        },
      },
    },
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
  });

  const categoryItems: CategoryListItem[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    icon: category.icon,
    displayOrder: category.displayOrder,
    isActive: category.isActive,
    bookCount: category._count.books,
  }));

  return <CategoriesClient categories={categoryItems} />;
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<CategoriesLoading />}>
      <CategoriesDataSection />
    </Suspense>
  );
}
