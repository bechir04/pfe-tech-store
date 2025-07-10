"use client";

import React from 'react';
import ProductCard from './ProductCard';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

type ProductGridProps = {
  products: Product[];
  title?: string;
};

const ProductGrid = ({ products, title }: ProductGridProps) => {
  return (
    <div className="py-8">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-gray-100">
          {title}
        </h2>
      )}
      <div className="glass p-4 md:p-8 rounded-2xl shadow-glass">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-400">
              Aucun produit trouvé.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
