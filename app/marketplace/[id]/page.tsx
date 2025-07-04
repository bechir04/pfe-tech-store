import { notFound } from 'next/navigation';
import Image from 'next/image';

// Mock data for user products
const userProducts = [
  {
    id: 'u001',
    name: 'Casque Gamer Pro',
    price: 89.99,
    description: 'Casque gaming avec micro antibruit, compatible PC et consoles.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    category: 'accessoires',
  },
  {
    id: 'u002',
    name: 'Laptop Lenovo ThinkPad',
    price: 499.99,
    description: 'Ordinateur portable d\'occasion, 8GB RAM, SSD 256GB.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
    category: 'ordinateurs',
  },
];

export default function UserProductDetailPage({ params }: { params: { id: string } }) {
  const product = userProducts.find((p) => p.id === params.id);
  if (!product) return notFound();

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-1/2 h-64 md:h-80 rounded-lg overflow-hidden">
          <Image src={product.image} alt={product.name} fill style={{objectFit:'cover'}} />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-4">{product.price.toFixed(2)}€</p>
          <p className="mb-4 text-gray-700 dark:text-gray-200">{product.description}</p>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Catégorie : {product.category}</div>
        </div>
      </div>
    </div>
  );
} 