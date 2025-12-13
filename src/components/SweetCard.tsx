import React, { useState } from "react";
import { Package, PlusCircle, ShoppingCart } from "lucide-react";

type Props = {
  sweet: any;
  onPurchase: (id: number) => void;
  onRestock?: (id: number) => void;
  isAdmin?: boolean;
  purchaseText?: string;
};

export default function SweetCard({ sweet, onPurchase, onRestock, isAdmin, purchaseText = "Purchase" }: Props) {
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async (id: number) => {
    setIsPurchasing(true);
    try {
      await onPurchase(id);
    } finally {
      setIsPurchasing(false);
    }
  };

  const stockTag =
    sweet.quantity === 0
      ? "text-red-500"
      : sweet.quantity <= 3
      ? "text-orange-500"
      : "text-green-600";

  return (
    <div
      className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-5 border border-gray-100 dark:border-gray-700
                 hover:shadow-2xl hover:-translate-y-1 transition-all"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold dark:text-white">{sweet.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{sweet.category} • ₹{sweet.price}</p>
        </div>

        <Package className="text-indigo-400" size={26} />
      </div>

      <p className={`mt-3 font-medium ${stockTag}`}>
        In Stock: {sweet.quantity}
      </p>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => handlePurchase(sweet.id)}
          disabled={sweet.quantity <= 0 || isPurchasing}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white shadow 
                      ${sweet.quantity > 0 && !isPurchasing ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"}`}
        >
          <ShoppingCart size={18} />
          {isPurchasing ? "Adding..." : purchaseText}
        </button>

        {isAdmin && onRestock && (
          <button
            onClick={() => onRestock(sweet.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow"
          >
            <PlusCircle size={18} />
            Restock
          </button>
        )}
      </div>
    </div>
  );
}
