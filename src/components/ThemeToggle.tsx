/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect ini penting agar tidak ada error perbedaan render 
  // antara server dan client (hydration error)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-5" />; // Placeholder saat loading

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-2xl bg-background dark:bg-gray-800  hover:ring-2 ring-blue-500 transition-all duration-300"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun className="text-yellow-400" size={20} />
      ) : (
        <Moon className="text-zinc-600 dark:text-white" size={20} />
      )}
    </button>
  );
}