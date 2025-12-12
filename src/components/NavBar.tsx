import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

export default function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  useEffect(() => {
    // Update state whenever dark class changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const toggleDarkMode = () => {
    const isDarkNow = document.documentElement.classList.contains("dark");
    if (isDarkNow) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl dark:text-white">SweetShop</Link>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Toggle dark mode"
          >
            {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
          </button>
          <div className="space-x-3">
            {token ? (
              <>
                <Link to="/dashboard" className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition-colors">Dashboard</Link>
                {role === "ADMIN" && <Link to="/admin" className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition-colors">Admin</Link>}
                <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Login</Link>
                <Link to="/register" className="px-3 py-1 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
