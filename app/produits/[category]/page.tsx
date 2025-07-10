import React from 'react';

export default function CategoryPlaceholder({ params }: { params: { category: string } }) {
  return (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Catégorie : {params.category}</h1>
      <p className="text-gray-500">Ceci est une page de catégorie dynamique placeholder. Les produits de cette catégorie s'afficheront ici à l'avenir.</p>
    </div>
  );
} 