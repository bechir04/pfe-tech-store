import Link from 'next/link';

// Mock data for user's own products
const myProducts = [
  {
    id: 'u001',
    name: 'Casque Gamer Pro',
    price: 89.99,
    description: 'Casque gaming avec micro antibruit, compatible PC et consoles.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    category: 'accessoires',
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Mes articles en vente</h1>
      <div className="space-y-6">
        {myProducts.length === 0 ? (
          <div className="text-gray-500">Vous n'avez pas encore posté d'article.</div>
        ) : (
          myProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center gap-6">
              <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <div className="text-blue-600 dark:text-blue-400 font-bold">{product.price.toFixed(3)} TND</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Catégorie : {product.category}</div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/marketplace/${product.id}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">Éditer</Link>
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">Supprimer</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-8">
        <Link href="/marketplace/post" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition">Ajouter un nouvel article</Link>
      </div>
    </div>
  );
} 