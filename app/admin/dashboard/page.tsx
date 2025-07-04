import Link from "next/link";

export default function AdminDashboard() {
  // Section for moderating user-submitted listings (mock data)
  const pendingProducts = [
    {
      id: 'u003',
      name: 'Souris Gaming RGB',
      price: 29.99,
      description: 'Souris ergonomique avec éclairage RGB.',
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=800&auto=format&fit=crop',
      category: 'accessoires',
    },
  ];

  function ModerationSection() {
    return (
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">Modération des articles utilisateurs</h2>
        <div className="space-y-4">
          {pendingProducts.length === 0 ? (
            <div className="text-gray-500">Aucun article en attente de modération.</div>
          ) : (
            pendingProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center gap-6">
                <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <div className="text-blue-600 dark:text-blue-400 font-bold">{product.price.toFixed(2)}€</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Catégorie : {product.category}</div>
                  <p className="mt-2 text-gray-700 dark:text-gray-200">{product.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">Approuver</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">Rejeter</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-3xl mx-auto bg-gray-950 rounded-xl shadow-2xl border border-gray-800 p-10">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8 text-center">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/admin/products" className="bg-gray-800 hover:bg-cyan-700 text-cyan-300 font-semibold py-8 px-6 rounded-xl shadow text-center transition-all border border-cyan-700">
            Gérer les Produits
          </Link>
          <Link href="/admin/categories" className="bg-gray-800 hover:bg-cyan-700 text-cyan-300 font-semibold py-8 px-6 rounded-xl shadow text-center transition-all border border-cyan-700">
            Gérer les Catégories
          </Link>
          <Link href="/admin/orders" className="bg-gray-800 hover:bg-cyan-700 text-cyan-300 font-semibold py-8 px-6 rounded-xl shadow text-center transition-all border border-cyan-700">
            Gérer les Commandes
          </Link>
          <Link href="/admin/payments" className="bg-gray-800 hover:bg-cyan-700 text-cyan-300 font-semibold py-8 px-6 rounded-xl shadow text-center transition-all border border-cyan-700">
            Suivi des Paiements
          </Link>
        </div>
        <ModerationSection />
      </div>
    </div>
  );
} 