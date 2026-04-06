/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Plus, Minus, Loader2, AlertCircle } from "lucide-react";
import Modal from "./Modal";
import { updateStock } from "@/lib/actions/inventory";

export default function StockAdjuster({ product }: { product: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpen = (mode: 'IN' | 'OUT') => {
    setType(mode);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (amount < 1 || !reason.trim()) return;
    setLoading(true);
    try {
      await updateStock(product._id.toString(), amount, type, reason);
      setIsOpen(false);
      setAmount(1);
      setReason("");
    } catch (error: any) {
      alert(error.message || "Gagal update stok");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button 
        onClick={() => handleOpen('OUT')}
        className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
      >
        <Minus size={18} strokeWidth={3} />
      </button>
      
      <div className={`text-3xl font-mono font-black min-w-[3.5rem] text-center tracking-tighter ${product.stock < 10 ? 'text-gray-500 animate-pulse' : 'text-foreground'}`}>
        {product.stock}
      </div>

      <button 
        onClick={() => handleOpen('IN')}
        className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-sm"
      >
        <Plus size={18} strokeWidth={3} />
      </button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => !loading && setIsOpen(false)} 
        title={type === 'IN' ? "Tambah Stok Masuk" : "Catat Stok Keluar"}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Package size={14} /> {product.name}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Jumlah Unit:</label>
            <input 
            type="number" 
            min="1"
            // Gunakan kondisi ini agar jika NaN, value tetap string kosong/0
            value={isNaN(amount) ? "" : amount} 
            onChange={(e) => {
                const val = parseInt(e.target.value);
                // Jika user menghapus input (kosong), set ke NaN atau 0 agar bisa mengetik ulang
                setAmount(isNaN(val) ? NaN : val);
            }}
            placeholder="0"
            className="w-full p-4 rounded-2xl border border-border bg-background text-2xl font-black focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Keterangan / Alasan:</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={type === 'IN' ? "Contoh: Restock bulanan, retur pelanggan..." : "Contoh: Penjualan offline, barang expired..."}
              className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[80px] resize-none"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={loading || amount < 1 || !reason.trim()}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              type === 'IN' 
                ? 'bg-green-500 text-white shadow-green-500/20 hover:bg-green-600' 
                : 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600'
            } disabled:opacity-30 disabled:grayscale`}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (type === 'IN' ? <Plus size={18} /> : <Minus size={18} />)}
            Simpan Perubahan
          </button>
        </div>
      </Modal>
    </div>
  );
}

// Tambahkan import Package di bagian atas jika diperlukan
import { Package } from "lucide-react";