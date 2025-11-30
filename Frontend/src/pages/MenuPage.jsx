import React, { useState, useEffect } from 'react';
import menuService from '../services/menuService';
import { useCart } from '../hooks/useCart';
import { Button, Card, Input } from '../components/common/UI';
import { Plus, Search } from 'lucide-react';
import { toast } from 'react-toastify';

const categories = [
  { id: 'ALL', name: 'Összes' },
  { id: 'APPETIZER', name: 'Előételek' },
  { id: 'MAIN_COURSE', name: 'Főételek' },
  { id: 'DESSERT', name: 'Desszertek' },
  { id: 'BEVERAGE', name: 'Italok' },
];

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await menuService.getAvailableMenu();
      setMenuItems(response.data);
    } catch (error) {
      toast.error('Nem sikerült betölteni a menüt.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.name} a kosárba került!`);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Étlap</h1>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Keresés..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
              {/* Image placeholder - in a real app we would have images */}
              <div className="h-48 bg-gray-200 rounded-t-lg -mx-4 -mt-4 mb-4 flex items-center justify-center text-gray-400">
                  <span className="text-4xl">🍽️</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <span className="font-bold text-primary-600">{item.price} Ft</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
              </div>
              <div className="mt-auto">
                <Button
                    onClick={() => handleAddToCart(item)}
                    className="w-full flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Kosárba
                </Button>
              </div>
            </Card>
          ))}

          {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                  Nem található a keresésnek megfelelő étel.
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
