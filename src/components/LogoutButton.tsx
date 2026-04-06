"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Hapus cookie auth
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    // Redirect ke login
    router.push("/login");
    router.refresh(); // Pastikan middleware mengecek ulang
  };

  return (
    <button 
      onClick={handleLogout}
      className="p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-xl transition-all flex items-center justify-center"
      title="Logout"
    >
      <LogOut size={18} />
    </button>
  );
}