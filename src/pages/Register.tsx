import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/register", { name, email, password });
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      const payload = JSON.parse(atob(res.data.token.split(".")[1]));
      localStorage.setItem("role", payload.role);
      nav("/dashboard");
    } catch (err: any) {
      setErr(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Register</h2>
      {err && <div className="text-red-500 mb-3">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" />
        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}
