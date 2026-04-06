/* eslint-disable @typescript-eslint/no-explicit-any */

import ThemeToggle from "@/components/ThemeToggle";
import InventoryManager from "@/components/InventoryManager";
import { connectDB } from "@/lib/mongodb";
import { Product, Category } from "@/models/Inventory";
import { Box, Plus, Minus, Trash2, History, AlertTriangle, Search, Package, LogOut } from "lucide-react";
import { updateStock, deleteProduct } from "@/lib/actions/inventory";
import Link from "next/link";
import DeleteProduct from "@/components/DeleteProduct";
import StockAdjuster from "@/components/StockAdjuster";
import LowStockModal from "@/components/LowStockModal";
import LogoutButton from "@/components/LogoutButton";

interface HomeProps {
  searchParams: Promise<{ q?: string; cat?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  await connectDB();
  const sParams = await searchParams;
  const query = sParams.q || "";
  const categoryFilter = sParams.cat || "";

  const mongoQuery: any = {};
  if (query) mongoQuery.name = { $regex: query, $options: "i" };
  if (categoryFilter) mongoQuery.categoryId = categoryFilter;

  const [categories, products] = await Promise.all([
    Category.find().sort({ name: 1 }).lean(),
    Product.find(mongoQuery)
      .populate("categoryId")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

    const handleLogout = () => {
        // Hapus cookie dengan men-set masa berlakunya ke masa lalu
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        window.location.href = "/login"; // Tendang balik ke login
    };

  const totalStock = products.reduce((acc: number, curr: any) => acc + curr.stock, 0);
  const lowStockItems = products.filter((p: any) => p.stock < 10).length;

  return (
    <main className="p-4 md:p-10 max-w-7xl mx-auto min-h-screen bg-background text-foreground transition-all duration-500">
      
      {/* HEADER SECTION - Responsive Flex */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div className="space-y-1">
          <h1 className="flex items-center gap-3 text-4xl md:text-4xl font-black tracking-tighter text-primary">
            <Box size={40} strokeWidth={2.5} className="text-primary" /> MY-INVENTORY
          </h1>
          <p className="text-muted-foreground text-sm md:text-base font-medium">
            Control center for your warehouse and logistics activity.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto bg-card p-2 rounded-3xl border border-border shadow-sm">
          <Link href="/logs" className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 hover:bg-muted rounded-2xl transition-colors text-muted-foreground hover:text-primary font-bold text-sm">
            <History size={18} /> <span className="lg:hidden">Logs</span>
          </Link>
          <div className="hidden lg:block w-[1px] h-6 bg-border mx-1" />
            <LogoutButton />
          <div className="w-[1px] h-6 bg-border mx-1" />
          <ThemeToggle />
        </div>
      </div>

      {/* STATS CARDS - Grid Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="group p-6 rounded-[2rem] bg-card border border-border hover:border-primary/50 transition-all shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary"><Package size={24}/></div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Total SKU</p>
              <h2 className="text-3xl font-black tracking-tighter">{products.length}</h2>
            </div>
          </div>
        </div>
        <div className="group p-6 rounded-[2rem] bg-card border border-border hover:border-primary/50 transition-all shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500"><Box size={24}/></div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Stok Fisik</p>
              <h2 className="text-3xl font-black tracking-tighter">{totalStock.toLocaleString()}</h2>
            </div>
          </div>
        </div>
        {/* Gunakan Komponen Baru */}
        <LowStockModal 
          count={lowStockItems} 
          lowStockItems={JSON.parse(JSON.stringify(products.filter((p: any) => p.stock < 10)))} 
        />
      </div>


      <div className="space-y-6">
        {/* SEARCH BAR - Floating Style */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <form className="relative w-full md:max-w-xl group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search size={20} />
            </div>
            <input 
              name="q" 
              placeholder="Cari nama produk" 
              defaultValue={query}
              className="w-full pl-14 pr-32 py-4 rounded-[1.5rem] border border-border bg-card shadow-lg shadow-black/[0.02] focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg font-medium"
            />
            <button className="absolute right-2.5 top-2.5 px-6 py-2 bg-primary text-primary-foreground rounded-2xl text-sm font-bold shadow-md hover:scale-105 transition-all">Search</button>
          </form>

           <InventoryManager categories={JSON.parse(JSON.stringify(categories))} />
        </div>

        {/* DATA TABLE & MOBILE CARDS */}
        <div className="rounded-[2.5rem] border border-border bg-card shadow-2xl shadow-black/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="hidden md:table-header-group bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-[0.2em] font-black">
                <tr>
                  <th className="p-8 border-b border-border">Product Details</th>
                  <th className="p-8 border-b border-border text-center">Category</th>
                  <th className="p-8 border-b border-border text-center">Inventory Adjust</th>
                  <th className="p-8 border-b border-border text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.length > 0 ? (
                  products.map((p: any) => (
                    <tr key={p._id.toString()} className="group hover:bg-muted/10 transition-all flex flex-col md:table-row">
                      {/* Product Info */}
                      <td className="p-6 md:p-8">
                        <div className="space-y-1">
                          <div className="font-bold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors italic">{p.name}</div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
                            <span className="bg-muted px-2 py-0.5 rounded">ID: {p._id.toString().slice(-6)}</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span>{new Date(p.createdAt).toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category - Desktop: Center, Mobile: Left */}
                      <td className="px-6 pb-2 md:p-8 md:text-center">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-black uppercase tracking-widest border border-border shadow-sm">
                          {p.categoryId?.name || "Uncategorized"}
                        </span>
                      </td>

                      {/* Inventory Adjust */}
                      <td className="p-6 md:p-8">
                        <div className="flex items-center justify-between md:justify-center gap-6 bg-muted/30 md:bg-transparent p-4 md:p-0 rounded-2xl">
                          <span className="md:hidden text-xs font-bold uppercase tracking-widest text-muted-foreground">Adjust Stock</span>
                          {/* Gunakan komponen baru ini */}
                          <StockAdjuster product={JSON.parse(JSON.stringify(p))} />
                          {/* Tampilkan satuan di bawah tombol adjuster */}
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            Unit: {p.unit || "pcs"}
                          </span>
                        </div>
                      </td>

                      {/* Delete Action */}
                      <td className="p-6 md:p-8 text-right">
                        {/* Ganti form action lama dengan komponen ini */}
                        <DeleteProduct 
                          productId={p._id.toString()} 
                          productName={p.name} 
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 rounded-full bg-muted inline-block italic text-4xl">🔎</div>
                        <p className="text-muted-foreground font-bold tracking-tight text-xl">No inventory found.</p>
                        <p className="text-sm text-muted-foreground/60">Try adjusting your search or add a new product.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODERN FOOTER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-8 pb-12">
           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-card px-4 py-2 rounded-full border border-border">
             <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
             Live Database Connected • {products.length} SKUs
           </div>
           <div className="text-[10px] font-bold text-muted-foreground/50 italic">
             Last Sync: {new Date().toLocaleTimeString('en-GB')}
           </div>
        </div>
      </div>
    </main>
  );
}