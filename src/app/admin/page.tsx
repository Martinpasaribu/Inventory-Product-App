/* eslint-disable @typescript-eslint/no-explicit-any */
import ThemeToggle from "@/components/ThemeToggle";
import InventoryManager from "@/components/InventoryManager";
import { connectDB } from "@/lib/mongodb";
import { Product, Category } from "@/models/Inventory";
import { Box, History, Package, Search } from "lucide-react";
import Link from "next/link";
import DeleteProduct from "@/components/DeleteProduct";
import StockAdjuster from "@/components/StockAdjuster";
import LowStockModal from "@/components/LowStockModal";
import LogoutButton from "@/components/LogoutButton";
import CustomTour from "@/components/CustomTour";
import TourResetButton from "@/components/TourResetButton";
import ExportButtons from "@/components/ExportButtons";

interface HomeProps {
  searchParams: Promise<{ q?: string; cat?: string }>;
}

const adminSteps = [
  { target: ".tour-stats", title: "Riwayat Gudang", content: "Pantau riwayat, barang keluar masuk stok fisik secara real-time di sini." },
  { target: ".tour-stock-sku", title: "Monitor SKU", content: "Jumlah variasi produk yang tersedia." },
  { target: ".tour-stock-physic", title: "Stok Fisik", content: "Total seluruh jumlah item fisik di gudang." },
  { target: ".tour-stock-alert", title: "Restock Alert", content: "Item yang memiliki stok sedikit dan perlu perhatian." },
  { target: ".tour-search", title: "Pencarian Cepat", content: "Cari produk apapun berdasarkan nama secara instan." },
  { target: ".tour-export", title: "Ekspor Data", content: "Klik tombol ini untuk mengekspor data inventaris ke format Excel atau PDF." },
  { target: ".tour-add-product", title: "Tambah Inventaris", content: "Klik tombol ini untuk mendaftarkan barang atau kategoru baru." },
  { target: ".tour-adjust-stock", title: "Update Stok", content: "Gunakan icon plus/minus di tabel untuk update stok cepat." },
  { target: ".tour-del-product", title: "Hapus Produk", content: "Tekan hapus produk jika ingin menghapus data product." },
];

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

  const totalStock = products.reduce((acc: number, curr: any) => acc + curr.stock, 0);
  const lowStockItems = products.filter((p: any) => p.stock < 10).length;

  return (
    <main className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-screen bg-background text-foreground transition-all duration-500">
      <CustomTour steps={adminSteps} tourKey="admin-page" />

      {/* HEADER SECTION - Responsive Stack to Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="space-y-1">
          <h1 className="flex items-center gap-3 text-3xl md:text-4xl font-black tracking-tighter text-primary">
            <Box size={32} strokeWidth={2.5} className="md:w-10 md:h-10" /> MY-INVENTORY
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm font-medium">
            Control center for your warehouse and logistics activity.
          </p>
        </div>
        
        {/* Actions Toolbar - Scrollable on very small screens */}
        <div className="flex items-center justify-around gap-2 w-full lg:w-auto bg-card p-2 rounded-2xl md:rounded-3xl border border-border shadow-sm overflow-x-auto no-scrollbar">
          <Link href="/logs" className="tour-stats flex items-center justify-center gap-2 px-3 md:px-4 py-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary font-bold text-xs md:text-sm whitespace-nowrap">
            <History size={18} /> <span>Riwayat</span>
          </Link>
          <TourResetButton />
          <div className="w-[1px] h-6 bg-border mx-1 shrink-0" />
          <LogoutButton />
          <div className="w-[1px] h-6 bg-border mx-1 shrink-0" />
          <ThemeToggle />
        </div>
      </div>

      {/* STATS CARDS - 1 col Mobile, 2 col Tablet, 3 col Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="tour-stock-sku p-6 rounded-[2rem] bg-card border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary"><Package size={24}/></div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total SKU</p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter">{products.length}</h2>
            </div>
          </div>
        </div>
        <div className="tour-stock-physic p-6 rounded-[2rem] bg-card border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500"><Box size={24}/></div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Stok Fisik</p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter">{totalStock.toLocaleString()}</h2>
            </div>
          </div>
        </div>
        <div className="tour-stock-alert sm:col-span-2 lg:col-span-1">
          <LowStockModal 
            count={lowStockItems} 
            lowStockItems={JSON.parse(JSON.stringify(products.filter((p: any) => p.stock < 10)))} 
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* SEARCH & ADD - Vertical on mobile */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <form className="tour-search relative flex-1 group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search size={20} />
            </div>
            <input 
              name="q" 
              placeholder="Cari produk..." 
              defaultValue={query}
              className="w-full pl-14 pr-24 py-4 rounded-2xl border border-border bg-card shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base"
            />
            <button className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-primary-foreground rounded-xl text-xs font-bold">Cari</button>
          </form>

          {/* TOMBOL EXPORT BARU DI SINI */}
          <div className="tour-export">

            <ExportButtons data={JSON.parse(JSON.stringify(products))} />
          </div>

          <div className="tour-add-product w-full md:w-auto">
            <InventoryManager categories={JSON.parse(JSON.stringify(categories))} />
          </div>
        </div>

        {/* DATA TABLE & MOBILE CARDS SECTION */}
        <div className="rounded-[2rem] md:border border-border md:bg-card md:shadow-sm overflow-hidden">
          {/* Desktop Table - Hidden on Mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-widest font-black">
                <tr>
                  <th className="p-6 border-b border-border">Product Details</th>
                  <th className="p-6 border-b border-border text-center">Category</th>
                  <th className="p-6 border-b border-border text-center">Inventory Adjust</th>
                  <th className="p-6 border-b border-border text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p: any, index: number) => (
                  <tr key={p._id.toString()} className="group hover:bg-muted/5 transition-all">
                    <td className="p-6 lg:p-8">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg lg:text-xl text-foreground tracking-tight group-hover:text-primary transition-colors italic">
                          {p.name}
                        </span>
                        <span className="text-[9px] text-muted-foreground font-bold uppercase mt-1">
                          ID: {p._id.toString().slice(-6)}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-black uppercase tracking-widest border border-border">
                        {p.categoryId?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className={index === 0 ? "tour-adjust-stock" : ""}>
                          <StockAdjuster product={JSON.parse(JSON.stringify(p))} />
                        </div>
                        <span className="text-[10px] font-black uppercase text-muted-foreground/60">{p.unit || "pcs"}</span>
                      </div>
                    </td>
                    <td className="tour-del-product p-6 text-right">
                      <DeleteProduct productId={p._id.toString()} productName={p.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List - Hidden on Desktop */}
          <div className="md:hidden space-y-4">
            {products.length > 0 ? (
              products.map((p: any, index: number) => (
                <div key={p._id.toString()} className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
                  {/* Top Row: Title & Category */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col">
                      <h3 className="font-bold text-lg text-foreground italic leading-tight">{p.name}</h3>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">ID: {p._id.toString().slice(-6)}</span>
                    </div>
                    <span className="shrink-0 px-3 py-1 rounded-full bg-secondary text-[9px] font-black uppercase tracking-widest border border-border">
                      {p.categoryId?.name || "Uncategorized"}
                    </span>
                  </div>

                  {/* Middle Row: Stock Control */}
                  <div className="flex items-center justify-between bg-muted/30 p-3 rounded-2xl">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Adjust Stock</span>
                      <span className="text-[10px] font-bold text-primary">{p.unit || "pcs"}</span>
                    </div>
                    <div className={index === 0 ? "tour-adjust-stock" : ""}>
                      <StockAdjuster product={JSON.parse(JSON.stringify(p))} />
                    </div>
                  </div>

                  {/* Bottom Row: Actions */}
                  <div className="flex justify-end pt-2 border-t border-border/50">
                    <DeleteProduct productId={p._id.toString()} productName={p.name} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
                <p className="text-muted-foreground font-bold italic">No items found.</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 pb-10">
           <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground bg-card px-4 py-2 rounded-full border border-border">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             Connected • {products.length} SKUs
           </div>
           <div className="text-[9px] font-bold text-muted-foreground/40 italic">
             Last Sync: {new Date().toLocaleTimeString('en-GB')}
           </div>
        </div>
      </div>
    </main>
  );
}