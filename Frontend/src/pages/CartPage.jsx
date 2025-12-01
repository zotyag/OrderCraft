import React from 'react';
import { useCart } from '../hooks/useCart';
import { Button, Card } from '../components/common/UI';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import orderService from '../services/orderService';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
      if (!user) {
          toast.info("A rendeléshez kérjük jelentkezz be!");
          navigate('/login');
          return;
      }

      // Basic checkout - in a real app this would go to a checkout page with payment options
      // Here we just submit the order directly

      const orderData = {
          user: { id: user.userId },
          items: cartItems.map(item => ({
              menuItem: { id: item.id },
              quantity: item.quantity
          })),
          paymentMethod: 'CASH' // Default for now
      };

      try {
          await orderService.createOrder(orderData);
          toast.success("Rendelés sikeresen leadva!");
          clearCart();
          navigate('/profile');
      } catch (error) {
          toast.error("Hiba történt a rendelés leadásakor.");
          console.error(error);
      }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Üres a kosarad</h2>
        <p className="text-gray-600 mb-8">Nézz körül az étlapon és válassz valami finomat!</p>
        <Link to="/menu">
          <Button>Vissza az étlapra</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Kosár</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-center gap-4">
               {/* Small Image placeholder */}
              <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-2xl flex-shrink-0">
                  🍽️
              </div>

              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.price} Ft / db</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 rounded-full hover:bg-gray-100 border border-gray-300"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold w-8 text-center">{item.quantity}</span>
                <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 rounded-full hover:bg-gray-100 border border-gray-300"
                >
                    <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right min-w-[100px]">
                  <div className="font-bold text-lg">{item.price * item.quantity} Ft</div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-xl font-bold mb-4">Összesítés</h2>

            <div className="space-y-2 mb-6 text-gray-600">
                <div className="flex justify-between">
                    <span>Részösszeg</span>
                    <span>{getCartTotal()} Ft</span>
                </div>
                 <div className="flex justify-between">
                    <span>Szállítási díj</span>
                    <span>0 Ft</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-gray-900 text-lg">
                    <span>Összesen</span>
                    <span>{getCartTotal()} Ft</span>
                </div>
            </div>

            <Button onClick={handleCheckout} className="w-full flex justify-center items-center gap-2 py-3">
               Tovább a fizetéshez <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
