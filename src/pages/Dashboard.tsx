import React, { useEffect, useState } from "react";
import api from "../api/axios";
import SweetCard from "../components/SweetCard";
import { Search, ShoppingCart, X } from "lucide-react";

export default function Dashboard() {
  const [sweets, setSweets] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const role = localStorage.getItem("role");

  const fetchAll = async () => {
    const res = await api.get("/api/sweets");
    setSweets(res.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const onSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const params: any = {};

    if (query) params.name = query;
    if (category) params.category = category;

    const res = await api.get("/api/sweets/search", { params });
    setSweets(res.data);
  };

  const addToCart = (sweet: any) => {
    const existing = cart.find(item => item.id === sweet.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === sweet.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...sweet, quantity: 1 }]);
    }
  };

  const removeFromCart = (sweetId: number) => {
    setCart(cart.filter(item => item.id !== sweetId));
  };

  const updateCartQuantity = (sweetId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sweetId);
    } else {
      setCart(cart.map(item => 
        item.id === sweetId ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cart) {
        for (let i = 0; i < item.quantity; i++) {
          await api.post(`/api/sweets/${item.id}/purchase`);
        }
      }
      alert("Checkout successful!");
      setCart([]);
      setShowCheckout(false);
      fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.error || "Checkout failed");
    }
  };

  return (
    <div className="space-y-6 px-4 md:px-10">

      {/* 🔍 Search Bar */}
      <form
        onSubmit={onSearch}
        className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/30 shadow-xl p-5 rounded-2xl 
                   flex gap-3 flex-wrap items-center"
      >
        <input
          placeholder="Name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 w-40 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 w-40 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />

        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl transition-all"
        >
          <Search size={18} />
          Search
        </button>

        <button
          type="button"
          onClick={() => {
            setQuery("");
            setCategory("");
            fetchAll();
          }}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-xl transition-all dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={() => setShowCheckout(true)}
          className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl transition-all"
        >
          <ShoppingCart size={18} />
          Cart ({cart.length})
        </button>
      </form>

      {/* 🍬 Sweet Items Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sweets.map((s) => (
          <SweetCard
            key={s.id}
            sweet={s}
            onPurchase={() => addToCart(s)}
            onRestock={role === "ADMIN" ? async (id: number) => {
              const amt = Number(prompt("Add stock amount:", "5"));
              if (!amt || amt <= 0) return;
              try {
                await api.post(`/api/sweets/${id}/restock`, { amount: amt });
                fetchAll();
              } catch (err: any) {
                alert(err.response?.data?.error || "Restock failed");
              }
            } : undefined}
            isAdmin={role === "ADMIN"}
            purchaseText="Add to Cart"
          />
        ))}
      </div>

      {/* 🛒 Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h2 className="text-2xl font-bold dark:text-white">Checkout</h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">Cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t dark:border-gray-700 p-6 space-y-4">
              <div className="flex justify-between text-lg font-bold dark:text-white">
                <span>Total:</span>
                <span>₹{getTotalPrice()}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
