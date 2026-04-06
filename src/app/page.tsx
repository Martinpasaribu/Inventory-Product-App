import Link from "next/link";
import { ArrowRight, LayoutDashboard, Zap, Shield, BarChart3, Box } from "lucide-react";


export default function LandingPage() {



  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-black">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <nav className="relative z-10 flex justify-between items-center p-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-2xl font-black italic tracking-tighter">
          <Box className="text-primary" size={32} /> MY-INV
        </div>
        <Link href="/admin" className="px-6 py-2 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
          Console Login
        </Link>

        
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-bounce">
          <Zap size={14} /> Version 2.0 Now Live
        </div>
        
        <h1 className="text-6xl md:text-[100px] font-black tracking-tighter leading-[0.9] italic mb-10">
          LOGISTICS <br /> <span className="text-primary text-outline-white">REIMAGINED.</span>
        </h1>
        
        <p className="max-w-xl text-muted-foreground text-lg md:text-xl font-medium mb-12">
          Satu platform untuk kontrol penuh atas stok, logistik, dan aliran barang gudang Anda dengan presisi real-time.
        </p>

        <Link 
          href="/admin" 
          className="group relative px-10 py-5 bg-primary text-primary-foreground rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 hover:scale-105 transition-all shadow-[0_0_40px_rgba(var(--primary),0.3)]"
        >
          <LayoutDashboard size={20} />
          Launch Dashboard
          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </Link>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left">
          {[
            { icon: <Shield />, title: "Secure Access", desc: "Otorisasi berlapis untuk keamanan data gudang." },
            { icon: <Zap />, title: "Real-time Sync", desc: "Update stok instan tanpa delay ke database cloud." },
            { icon: <BarChart3 />, title: "Data Insights", desc: "Analitik performa SKU dan peringatan restock dini." },
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-12 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em]">
        &copy; 2026 MY-INV Logistics System. All Rights Reserved.
      </footer>
    </main>
  );
}