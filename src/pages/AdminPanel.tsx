import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminPanel() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sweets, setSweets] = useState<any[]>([]);

  const fetch = async () => {
    const res = await api.get("/api/sweets");
    setSweets(res.data);
  };
  useEffect(()=>{ fetch(); }, []);

  const add = async () => {
    try {
      await api.post("/api/sweets", { name, category, price: Number(price), quantity: Number(quantity) });
      setName(""); setCategory(""); setPrice(""); setQuantity("");
      fetch();
    } catch (err: any) {
      alert(err.response?.data?.error || "Add failed");
    }
  };

  const del = async (id: number) => {
    try {
      await api.delete(`/api/sweets/${id}`);
      fetch();
    } catch (err: any) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2 dark:text-white">Add Sweet</h3>
        <div className="flex gap-2">
          <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" />
          <input placeholder="Category" value={category} onChange={(e)=>setCategory(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" />
          <input placeholder="Price" value={price} onChange={(e)=>setPrice(e.target.value)} className="p-2 border rounded w-24 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
          <input placeholder="Quantity" value={quantity} onChange={(e)=>setQuantity(e.target.value)} className="p-2 border rounded w-24 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
          <button onClick={add} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded">Add</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2 dark:text-white">Manage Sweets</h3>
        <div className="space-y-2">
          {sweets.map(s => (
            <div key={s.id} className="flex items-center justify-between dark:border-gray-700 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="dark:text-white">{s.name} ({s.quantity})</div>
              <div className="flex gap-2">
                <button onClick={()=>del(s.id)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
