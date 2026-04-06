"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const masterPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (password === masterPassword) {
      // 1. Set Cookie
      document.cookie = "auth_token=true; path=/; max-age=86400; SameSite=Strict";
      
      showToast("Akses Diterima!", "success");

      // 2. Gunakan window.location agar Middleware benar-benar membaca cookie baru
      // Ini jauh lebih aman untuk proses Auth manual seperti ini daripada router.push
      window.location.href = "/admin"; 
    } else {
      showToast("Sandi Salah!", "alert");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-4">
            <ShieldCheck size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            ADMIN <span className="text-primary">ACCESS</span>
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            Masukkan kode otorisasi untuk mengelola inventaris.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Lock size={20} />
            </div>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Authorization Code"
              className="w-full pl-14 pr-6 py-5 rounded-[2rem] border border-white/10 bg-white/5 text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all font-mono text-lg tracking-widest"
              required
            />
          </div>
          
          <button 
            disabled={loading}
            className="w-full py-5 rounded-[2rem] bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Unlock Dashboard"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </main>
  );
}