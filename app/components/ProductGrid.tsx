"use client";

import React from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

type Seller = {
  id: string;
  name: string;
  avatar: string;
  badges: string[];
  rating: number;
  verified: boolean;
};

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  videoUrl?: string;
  category: string;
  condition?: string;
  warranty?: string;
  specs?: { key: string; value: string }[];
  seller?: Seller;
};

type ProductGridProps = {
  products: Product[];
  title?: string;
  compact?: boolean;
  detailed?: boolean;
};

const gridVariants = {
  visible: { transition: { staggerChildren: 0.08 } },
  hidden: {}
};

const ProductGrid = ({ products, title, compact, detailed }: ProductGridProps) => {
  return (
    <div className="py-8">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-gray-100">
          {title}
        </h2>
      )}
      <div className={`glass p-4 md:p-8 rounded-2xl shadow-glass`}>
        <motion.div
          className={compact
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"}
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} detailed={!compact} />
          ))}
        </motion.div>
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
