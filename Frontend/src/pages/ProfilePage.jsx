import React, { useEffect, useState } from 'react';
import orderService from '../services/orderService';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/UI';
import { Clock, CheckCircle, XCircle, Truck, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';

const statusConfig = {
    PENDING: { label: 'Függőben', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    CONFIRMED: { label: 'Visszaigazolva', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    PREPARING: { label: 'Készül', icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-100' },
    READY: { label: 'Kész', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    DELIVERED: { label: 'Kiszállítva', icon: Truck, color: 'text-gray-600', bg: 'bg-gray-100' },
    CANCELLED: { label: 'Lemondva', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
};

const ProfilePage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.userId) {
       fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getUserOrders(user.userId);
      // Sort by date desc
      const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
    } catch (error) {
      // toast.error('Hiba a rendelések betöltésekor.');
      // Silent fail implies no orders or network issue
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Szia, {user.username}!</h1>
          <p className="text-gray-600">{user.email}</p>
      </div>

      <h2 className="text-xl font-bold text-gray-900">Korábbi rendeléseim</h2>

      {loading ? (
           <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
           </div>
      ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">Még nincs rendelésed.</p>
          </div>
      ) : (
          <div className="space-y-4">
              {orders.map((order) => {
                  const StatusIcon = statusConfig[order.status]?.icon || Clock;
                  const statusStyle = statusConfig[order.status] || statusConfig.PENDING;

                  return (
                      <Card key={order.id} className="p-0 overflow-hidden">
                          <div className="p-6">
                              <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                                  <div>
                                      <div className="text-sm text-gray-500 mb-1">
                                          Rendelés #{order.id} • {new Date(order.createdAt).toLocaleString('hu-HU')}
                                      </div>
                                      <div className="font-bold text-lg">{order.totalPrice} Ft</div>
                                  </div>
                                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${statusStyle.bg} ${statusStyle.color}`}>
                                      <StatusIcon className="w-4 h-4" />
                                      <span className="font-medium text-sm">{statusStyle.label}</span>
                                  </div>
                              </div>

                              {/* Order items would be here if the API provides them nested.
                                  Assuming standard list response might not include deep items details based on simple get,
                                  but let's check README. It says OrderItems table exists.
                                  Usually GET /orders/user/{id} returns list of orders.
                              */}
                          </div>
                      </Card>
                  );
              })}
          </div>
      )}
    </div>
  );
};

export default ProfilePage;
