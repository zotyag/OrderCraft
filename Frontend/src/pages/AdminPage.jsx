import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import menuService from '../services/menuService';
import orderService from '../services/orderService';
import { Button, Input, Card } from '../components/common/UI';
import { toast } from 'react-toastify';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu'

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`${
              activeTab === 'orders'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Rendelések
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`${
              activeTab === 'menu'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Menü Kezelés
          </button>
        </nav>
      </div>

      {activeTab === 'orders' ? <OrderManager /> : <MenuManager />}
    </div>
  );
};

const OrderManager = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await orderService.getAllOrders();
            // Sort: Pending first, then by date
            const sorted = response.data.sort((a, b) => {
                if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
                if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setOrders(sorted);
        } catch (error) {
            toast.error("Hiba a rendelések betöltésekor");
        }
    };

    useEffect(() => {
        fetchOrders();
        // Poll every 30 seconds for new orders (simple approach without WS yet)
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await orderService.updateOrderStatus(id, status);
            toast.success("Státusz frissítve");
            fetchOrders();
        } catch (error) {
            toast.error("Hiba a státusz frissítésekor");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Beérkező Rendelések</h2>
                <Button onClick={fetchOrders} variant="secondary" className="text-sm">Frissítés</Button>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {orders.map(order => (
                        <li key={order.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-primary-600 truncate">
                                        Rendelés #{order.id}
                                    </p>
                                    <p className="ml-2 flex-shrink-0 flex text-xs text-gray-500">
                                        {new Date(order.createdAt).toLocaleString('hu-HU')}
                                    </p>
                                </div>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                          order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                          order.status === 'READY' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                        Összeg: {order.totalPrice} Ft
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm sm:mt-0 gap-2">
                                    {order.status === 'PENDING' && (
                                        <>
                                            <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')} className="py-1 px-2 text-xs">Elfogadás</Button>
                                            <Button size="sm" variant="danger" onClick={() => handleStatusUpdate(order.id, 'CANCELLED')} className="py-1 px-2 text-xs">Elutasítás</Button>
                                        </>
                                    )}
                                    {order.status === 'CONFIRMED' && (
                                        <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'PREPARING')} className="py-1 px-2 text-xs">Készítés</Button>
                                    )}
                                    {order.status === 'PREPARING' && (
                                        <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'READY')} className="py-1 px-2 text-xs">Kész</Button>
                                    )}
                                     {order.status === 'READY' && (
                                        <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'DELIVERED')} className="py-1 px-2 text-xs">Kiszállítva</Button>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const MenuManager = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    const fetchMenu = async () => {
        const res = await menuService.getAllMenu();
        setItems(res.data);
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const openModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            setValue('name', item.name);
            setValue('description', item.description);
            setValue('price', item.price);
            setValue('category', item.category);
            setValue('available', item.available);
        } else {
            reset();
            setValue('available', true); // Default
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Biztosan törölni szeretnéd ezt az elemet?')) {
            try {
                await menuService.deleteMenuItem(id);
                toast.success('Elem törölve');
                fetchMenu();
            } catch (e) {
                toast.error('Hiba a törléskor');
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            if (editingItem) {
                await menuService.updateMenuItem(editingItem.id, data);
                toast.success('Elem frissítve');
            } else {
                await menuService.createMenuItem(data);
                toast.success('Elem létrehozva');
            }
            setIsModalOpen(false);
            fetchMenu();
        } catch (e) {
            toast.error('Hiba a mentéskor');
        }
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Étlap Elemek</h2>
                <Button onClick={() => openModal()} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Új elem
                </Button>
            </div>

            <div className="bg-white shadow overflow-hidden rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Név</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategória</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ár</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Műveletek</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price} Ft</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                                    <button onClick={() => openModal(item)} className="text-primary-600 hover:text-primary-900">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{editingItem ? 'Szerkesztés' : 'Új elem'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input label="Név" {...register('name', { required: true })} />
                            <Input label="Leírás" {...register('description')} />
                            <Input label="Ár" type="number" {...register('price', { required: true })} />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategória</label>
                                <select {...register('category')} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                    <option value="APPETIZER">Előétel</option>
                                    <option value="MAIN_COURSE">Főétel</option>
                                    <option value="DESSERT">Desszert</option>
                                    <option value="BEVERAGE">Ital</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" {...register('available')} id="available" />
                                <label htmlFor="available">Elérhető</label>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Mégse</Button>
                                <Button type="submit">Mentés</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
