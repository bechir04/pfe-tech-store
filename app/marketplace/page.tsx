"use client";
import ProductGrid from '../components/ProductGrid';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaFilter, FaBell, FaFire, FaStar, FaBolt } from 'react-icons/fa';

// Mock data for user products (fallback)
const mockUserProducts = [
  {
    id: 'u001',
    name: 'Casque Gamer Pro',
    price: 89.99,
    description: 'Casque gaming avec micro antibruit, compatible PC et consoles.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    ],
    category: 'accessoires',
    condition: 'new',
    seller: {
      id: 's001',
      name: 'Alice Martin',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      badges: ['verified', 'top-seller'],
      rating: 4.8,
      verified: true,
      sales: 120
    }
  },
  {
    id: 'u002',
    name: 'Laptop Lenovo ThinkPad',
    price: 499.99,
    description: "Ordinateur portable d'occasion, 8GB RAM, SSD 256GB.",
    images: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
    ],
    category: 'ordinateurs',
    condition: 'used',
    seller: {
      id: 's002',
      name: 'Bechir Ben Salah',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      badges: ['verified'],
      rating: 4.2,
      verified: true,
      sales: 45
    }
  },
];

const categories = [
  { id: 'all', name: 'Toutes' },
  { id: 'telephones', name: 'Téléphones' },
  { id: 'accessoires', name: 'Accessoires' },
  { id: 'ordinateurs', name: 'PC & Composants' },
];
const conditions = [
  { id: 'all', name: 'Tous' },
  { id: 'new', name: 'Neuf' },
  { id: 'used', name: 'Occasion' },
  { id: 'refurbished', name: 'Reconditionné' },
];

// Remove static trendingProducts, featuredSellers, hotDeals

export default function MarketplacePage() {
  const { user } = useAuth();
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    category: 'all',
    condition: 'all',
    sellerRating: '',
  });
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [newMatches, setNewMatches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'discover' | 'feed'>('discover');
  const [followedSellers, setFollowedSellers] = useState<string[]>([]);
  const [feedProducts, setFeedProducts] = useState<any[]>([]);
  const [newFromFollowed, setNewFromFollowed] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const articles = JSON.parse(localStorage.getItem('userArticles') || '[]');
    // Normalize: ensure all products have an 'images' array, valid id, and valid category
    const validCategories = ['telephones', 'ordinateurs', 'accessoires'];
    const normalize = (p: any, idx: number) => {
      let id = p.id || `user-${Date.now()}-${idx}`;
      let category = validCategories.includes(p.category) ? p.category : 'accessoires';
      let images = Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []);
      return { ...p, id, category, images };
    };
    const normalized = (articles.length > 0 ? articles : mockUserProducts).map(normalize);
    setUserProducts(normalized);
    const saved = JSON.parse(localStorage.getItem('marketplaceSavedSearches') || '[]');
    setSavedSearches(saved);
    setFollowedSellers(JSON.parse(localStorage.getItem('followedSellers') || '[]'));
  }, []);

  // Trending: most recently added (last 7 days or top 3 newest)
  const trendingProducts = [...userProducts]
    .sort((a, b) => (parseInt(b.id.replace(/\D/g, '')) || 0) - (parseInt(a.id.replace(/\D/g, '')) || 0))
    .slice(0, 3);

  // Featured Sellers: highest avg rating & most sales (from current products)
  const sellerMap: Record<string, { seller: any; totalSales: number; ratingSum: number; ratingCount: number }> = {};
  userProducts.forEach((p: any) => {
    if (p.seller) {
      if (!sellerMap[p.seller.id]) {
        sellerMap[p.seller.id] = { seller: p.seller, totalSales: 0, ratingSum: 0, ratingCount: 0 };
      }
      sellerMap[p.seller.id].totalSales += p.seller.sales || 0;
      sellerMap[p.seller.id].ratingSum += p.seller.rating || 0;
      sellerMap[p.seller.id].ratingCount += 1;
    }
  });
  const featuredSellers = Object.values(sellerMap)
    .map(s => ({
      ...s.seller,
      avgRating: s.ratingCount ? (s.ratingSum / s.ratingCount) : 0,
      totalSales: s.totalSales
    }))
    .sort((a, b) => b.avgRating - a.avgRating || b.totalSales - a.totalSales)
    .slice(0, 3);

  // Hot Deals: lowest price per category
  const hotDeals: any[] = [];
  const seenCats = new Set();
  [...userProducts]
    .sort((a, b) => a.price - b.price)
    .forEach((p: any) => {
      if (!seenCats.has(p.category)) {
        hotDeals.push(p);
        seenCats.add(p.category);
      }
    });

  // Notification logic: check for new products matching saved searches
  useEffect(() => {
    if (savedSearches.length === 0 || userProducts.length === 0) return;
    const lastChecked = localStorage.getItem('marketplaceLastChecked') || '0';
    const lastCheckedTime = parseInt(lastChecked, 10);
    const newProds = userProducts.filter((p: any) => p.id && Number(p.id.replace(/\D/g, '')) > lastCheckedTime);
    let matches: any[] = [];
    newProds.forEach((prod: any) => {
      savedSearches.forEach((search: any) => {
        const price = prod.price;
        const catOk = search.category === 'all' || prod.category === search.category;
        const condOk = search.condition === 'all' || prod.condition === search.condition;
        const priceMinOk = !search.priceMin || price >= parseFloat(search.priceMin);
        const priceMaxOk = !search.priceMax || price <= parseFloat(search.priceMax);
        const ratingOk = !search.sellerRating || (prod.seller && prod.seller.rating >= parseFloat(search.sellerRating));
        if (catOk && condOk && priceMinOk && priceMaxOk && ratingOk) {
          matches.push({ prod, search });
        }
      });
    });
    setNewMatches(matches);
  }, [userProducts, savedSearches]);

  // Feed: products from followed sellers or categories
  useEffect(() => {
    if (followedSellers.length === 0) {
      setFeedProducts([]);
      return;
    }
    const feed = userProducts.filter((p: any) => p.seller && followedSellers.includes(p.seller.id));
    setFeedProducts(feed);
  }, [userProducts, followedSellers]);

  // Notification for new products from followed sellers
  useEffect(() => {
    const lastChecked = localStorage.getItem('marketplaceLastCheckedFollowed') || '0';
    const lastCheckedTime = parseInt(lastChecked, 10);
    const newProds = userProducts.filter((p: any) => p.seller && followedSellers.includes(p.seller.id) && Number(p.id.replace(/\D/g, '')) > lastCheckedTime);
    setNewFromFollowed(newProds);
  }, [userProducts, followedSellers]);

  // Mark all as seen when opening notifications
  const handleNotifClick = () => {
    setNotifOpen((v) => !v);
    if (!notifOpen && newMatches.length > 0) {
      // Mark as seen
      const now = Date.now();
      localStorage.setItem('marketplaceLastChecked', now.toString());
      setNewMatches([]);
    }
  };

  const handleNotifFollowedClick = () => {
    setNotifOpen((v) => !v);
    if (!notifOpen && newFromFollowed.length > 0) {
      const now = Date.now();
      localStorage.setItem('marketplaceLastCheckedFollowed', now.toString());
      setNewFromFollowed([]);
    }
  };

  // Filtering logic
  const filteredProducts = userProducts.filter((p) => {
    const price = p.price;
    const catOk = filters.category === 'all' || p.category === filters.category;
    const condOk = filters.condition === 'all' || p.condition === filters.condition;
    const priceMinOk = !filters.priceMin || price >= parseFloat(filters.priceMin);
    const priceMaxOk = !filters.priceMax || price <= parseFloat(filters.priceMax);
    const ratingOk = !filters.sellerRating || (p.seller && p.seller.rating >= parseFloat(filters.sellerRating));
    return catOk && condOk && priceMinOk && priceMaxOk && ratingOk;
  });

  // Save current filter as a search
  const saveCurrentSearch = () => {
    const search = { ...filters, id: Date.now() };
    const updated = [...savedSearches, search];
    setSavedSearches(updated);
    localStorage.setItem('marketplaceSavedSearches', JSON.stringify(updated));
  };
  const deleteSavedSearch = (id: number) => {
    const updated = savedSearches.filter((s) => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('marketplaceSavedSearches', JSON.stringify(updated));
  };
  const applySavedSearch = (search: any) => {
    setFilters({ ...search });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-cyan-900 via-blue-900 to-purple-900 py-12 px-4 md:px-12 rounded-b-3xl shadow-xl mb-10 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center z-10 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Découvrez, Achetez, Vendez sur <span className="text-cyan-400">TechStore Marketplace</span></h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">Trouvez les meilleures offres tech, suivez vos vendeurs favoris, et profitez de deals exclusifs chaque jour.</p>
          {/* Search/Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 justify-center items-center bg-white/10 rounded-xl p-4 shadow-lg backdrop-blur-md">
            <div className="flex items-center bg-white/80 rounded-lg px-3 py-2 w-full md:w-96">
              <FaSearch className="text-cyan-500 mr-2" />
              <input
                type="text"
                placeholder="Rechercher un produit, une marque..."
                className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-400"
                // TODO: implement search logic
              />
            </div>
            <button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition">
              <FaFilter />
              Filtres
            </button>
            <Link href="/marketplace/post" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition">
              <FaBolt />
              Vendre un article
            </Link>
          </div>
        </div>
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl -z-10" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-500/20 rounded-full blur-2xl -z-10" />
      </div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters (desktop) */}
        <aside className="hidden md:block w-72 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sticky top-28 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FaFilter className="text-cyan-500" /> Filtres</h2>
            {/* Category */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">Catégorie</label>
              <select className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2" value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            {/* Condition */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">État</label>
              <select className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2" value={filters.condition} onChange={e => setFilters(f => ({ ...f, condition: e.target.value }))}>
                {conditions.map(cond => <option key={cond.id} value={cond.id}>{cond.name}</option>)}
              </select>
            </div>
            {/* Price */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">Prix</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-1/2 rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2" value={filters.priceMin} onChange={e => setFilters(f => ({ ...f, priceMin: e.target.value }))} />
                <input type="number" placeholder="Max" className="w-1/2 rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2" value={filters.priceMax} onChange={e => setFilters(f => ({ ...f, priceMax: e.target.value }))} />
              </div>
            </div>
            {/* Seller Rating */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">Note vendeur</label>
              <input type="number" min={0} max={5} step={0.1} placeholder="Min. 0-5" className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2" value={filters.sellerRating} onChange={e => setFilters(f => ({ ...f, sellerRating: e.target.value }))} />
            </div>
            <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 rounded-lg mt-2 transition">Appliquer</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 animate-fade-in">
            <button onClick={() => setActiveTab('discover')} className={`px-6 py-2 rounded-full font-bold text-lg transition-colors ${activeTab === 'discover' ? 'bg-cyan-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-cyan-100 dark:hover:bg-cyan-900'}`}>Découvrir</button>
            <button onClick={() => setActiveTab('feed')} className={`px-6 py-2 rounded-full font-bold text-lg transition-colors ${activeTab === 'feed' ? 'bg-cyan-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-cyan-100 dark:hover:bg-cyan-900'}`}>Mon Fil {feedProducts.length > 0 && <span className="ml-2 bg-pink-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold">{feedProducts.length}</span>}</button>
          </div>

          {/* Trending Section */}
          <section className="mb-10 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaFire className="text-orange-500" /> Tendances</h2>
            <ProductGrid products={trendingProducts} compact />
          </section>

          {/* Hot Deals Section */}
          <section className="mb-10 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaBolt className="text-yellow-400" /> Bons plans</h2>
            <ProductGrid products={hotDeals} compact />
          </section>

          {/* Featured Sellers Section */}
          <section className="mb-10 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaStar className="text-yellow-500" /> Vendeurs à la une</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featuredSellers.map(seller => (
                <div key={seller.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4 border border-cyan-100 dark:border-cyan-900 animate-fade-in">
                  <img src={seller.avatar} alt={seller.name} className="w-16 h-16 rounded-full border-2 border-cyan-400" />
                  <div>
                    <div className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">{seller.name} {seller.verified && <span className="bg-cyan-200 text-cyan-800 px-2 py-0.5 rounded text-xs font-semibold">Vérifié</span>}</div>
                    <div className="flex items-center gap-2 text-yellow-500 font-semibold text-sm">
                      <FaStar /> {seller.avgRating.toFixed(1)}
                      <span className="text-gray-400 ml-2">({seller.totalSales} ventes)</span>
                    </div>
                    {seller.badges && seller.badges.filter((b: string) => b !== 'verified').map((badge: string) => (
                      <span key={badge} className="ml-1 bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">{badge}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* All Products Section */}
          <section className="mb-10 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaSearch className="text-cyan-500" /> Tous les produits</h2>
            <ProductGrid products={userProducts} detailed />
          </section>
        </main>
      </div>
    </div>
  );
} 