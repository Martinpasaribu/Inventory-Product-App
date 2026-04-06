/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { addProduct } from "@/lib/actions/inventory";
import { Package, Loader2, Tag, List, ChevronDown, Layers } from "lucide-react";
import { useToast } from "@/context/ToastContext"; 
import CustomTour from "./CustomTour";

// Daftar satuan sesuai permintaan
const UNITS = [
  "pcs", "kg", "roll", "batang", "meter", "pack", "lembar", "pail", "galon", 
  "dus", "box", "kaleng", "botol", "tube", "sachet", "strip", 
  "bungkus", "kantong", "karung", "tong", "drum", "pallet"
];

const modalSteps = [
  { target: ".tour-modal-name", title: "Nama", content: "Masukkan nama barang..." },
  { target: ".tour-modal-unit", title: "Satuan", content: "Pilih satuan..." },
];


export default function AddProductForm({ 
  categories, 
  onSuccess 
}: { 
  categories: any[], 
  onSuccess?: () => void 
}) {
  const { showToast, hideToast } = useToast();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const unit = formData.get("unit") as string;
    const stock = Number(formData.get("stock"));

    if (!name || !categoryId || !unit || isNaN(stock)) {
      showToast("Harap isi semua data dengan benar", "warning");
      return;
    }

    setIsPending(true);
    const loadingId = showToast("Sedang mendaftarkan barang baru...", "loading");

    try {
      // Kirim data termasuk 'unit'
      await addProduct({ name, categoryId, stock, unit });
      
      hideToast(loadingId);
      showToast(`Barang "${name}" berhasil ditambahkan!`, "success");
      
      if (onSuccess) onSuccess(); 
    } catch (error: any) {
      hideToast(loadingId);
      showToast(error.message || "Gagal menambahkan barang", "alert");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5 pt-2">
      {/* <CustomTour steps={modalSteps} tourKey="add-product-modal" /> */}
      
      {/* Input Nama Barang */}
      <div className=" space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
          <Tag size={12} className="text-primary" /> Nama Barang
        </label>
        <input 
          name="name" 
          placeholder="Contoh: Kabel UTP Cat6" 
          className="tour-modal-name w-full p-4 rounded-2xl border border-border bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold" 
          required 
          disabled={isPending}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Input Kategori */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
            <List size={12} className="text-primary" /> Kategori
          </label>
          <div className="relative">
            <select 
              name="categoryId" 
              className="w-full p-4 rounded-2xl border border-border bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold appearance-none cursor-pointer" 
              required
              disabled={isPending}
            >
              <option value="">Pilih...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none opacity-50" />
          </div>
        </div>

        {/* Input Satuan (Unit) */}
        <div className="tour-modal-unit space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
            <Layers size={12} className="text-primary" /> Satuan
          </label>
          <div className="relative ">
            <select 
              name="unit" 
              className="w-full p-4 rounded-2xl border border-border bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold appearance-none cursor-pointer capitalize" 
              required
              disabled={isPending}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none opacity-50" />
          </div>
        </div>
      </div>

      {/* Input Stok */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
          <Package size={12} className="text-primary" /> Stok Awal
        </label>
        <input 
          name="stock" 
          type="number" 
          placeholder="0" 
          min="0"
          className="w-full p-4 rounded-2xl border border-border bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono text-xl font-black" 
          required 
          disabled={isPending}
        />
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isPending}
        className="w-full mt-2 bg-primary text-primary-foreground py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:shadow-xl hover:shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
      >
        {isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Package size={16} strokeWidth={2.5} />
        )}
        {isPending ? "Sedang Menyimpan..." : "Simpan Barang"}
      </button>
    </form>
  );
}


    // { target: ".tour-stats", title: "Ringkasan Gudang", content: "Pantau total SKU dan stok fisik secara real-time di sini." },
    // { target: ".tour-stock-sku", title: "Monitor SKU", content: "Jumlah variasi produk yang tersedia." },
    // { target: ".tour-stock-physic", title: "Stok Fisik", content: "Total seluruh jumlah item fisik di gudang." },
    // { target: ".tour-stock-alert", title: "Restock Alert", content: "Item yang memiliki stok sedikit dan perlu perhatian." },
    // { target: ".tour-search", title: "Pencarian Cepat", content: "Cari produk apapun berdasarkan nama secara instan." },
    // { target: ".tour-add-product", title: "Tambah Inventaris", content: "Klik tombol ini untuk mendaftarkan barang baru. Setelah klik, tunggu hingga modal muncul." },
    // { target: ".tour-adjust-stock", title: "Update Stok", content: "Gunakan icon plus/minus di tabel untuk update stok cepat." },

    // // ini untuk modal add category
    // { target: ".tour-add-product", title: "Tambah Inventaris", content: "Klik tombol ini untuk mendaftarkan barang baru. Setelah klik, tunggu hingga modal muncul." },
    // { target: ".tour-adjust-stock", title: "Update Stok", content: "Gunakan icon plus/minus di tabel untuk update stok cepat." },

    // // ini untuk modal  add product
    // { target: ".tour-modal-name", title: "Input Nama", content: "Masukkan nama barang baru di kolom ini dalam modal." },
    // { target: ".tour-modal-unit", title: "Pilih Satuan", content: "Tentukan satuan barang (Pcs, Box, dll)." },