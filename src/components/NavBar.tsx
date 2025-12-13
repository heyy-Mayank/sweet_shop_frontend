import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

export default function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [isDark, setIsDark] = useState(false);

  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl dark:text-white">
          SweetShop 🍬
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDark ? (
              <Sun className="text-yellow-400" />
            ) : (
              <Moon className="text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {token ? (
            <>
              <Link to="/dashboard" className="dark:text-white">
                Dashboard
              </Link>
              {role === "ADMIN" && (
                <Link to="/admin" className="dark:text-white">
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="dark:text-white">
                Login
              </Link>
              <Link to="/register" className="dark:text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
