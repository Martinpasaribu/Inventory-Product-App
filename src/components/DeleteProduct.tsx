/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Trash2, AlertCircle, Loader2, MessageSquare } from "lucide-react";
import Modal from "./Modal";
import { deleteProduct } from "@/lib/actions/inventory";
import { useToast } from "@/context/ToastContext"; // 1. Import Toast Hook

interface DeleteProps {
  productId: string;
  productName: string;
}

export default function DeleteProduct({ productId, productName }: DeleteProps) {
  const { showToast, hideToast } = useToast(); // 2. Inisialisasi
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== productName || !reason.trim()) return;
    
    setLoading(true);
    
    // 3. Munculkan loading toast dan simpan ID-nya
    const loadingId = showToast(`Menghapus ${productName}...`, "loading");

    try {
      await deleteProduct(productId, reason);
      
      // 4. Hapus loading, munculkan sukses
      hideToast(loadingId);
      showToast(`Produk "${productName}" telah dihapus selamanya.`, "success");
      
      setIsOpen(false);
      setReason(""); 
      setConfirmText("");
    } catch (error: any) {
      // 5. Hapus loading jika gagal, munculkan alert
      hideToast(loadingId);
      showToast(error.message || "Gagal menghapus produk", "alert");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = confirmText === productName && reason.trim().length > 4;

  return (
    <>
      {/* Tombol di Tabel */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 w-full md:w-auto md:ml-auto px-6 py-3 md:p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-bold text-sm"
      >
        <Trash2 size={20} /> <span className="md:hidden">Delete Product</span>
      </button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => { if(!loading) setIsOpen(false) }} 
        title="Konfirmasi Hapus"
      >
        <div className="space-y-5">
          {/* Banner Peringatan */}
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-600">
            <AlertCircle className="shrink-0" size={20} />
            <p className="text-sm font-medium leading-relaxed">
              Tindakan ini permanen. Seluruh data stok dan riwayat barang <strong>{productName}</strong> akan dihapus.
            </p>
          </div>

          {/* Input Alasan */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
              <MessageSquare size={12} className="text-red-500" /> Alasan (Min. 5 Karakter)
            </label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Kenapa barang ini dihapus?"
              className="w-full p-4 rounded-2xl border border-border bg-muted/20 focus:bg-background outline-none focus:ring-4 focus:ring-red-500/10 transition-all text-sm min-h-[90px] resize-none font-medium"
              disabled={loading}
            />
          </div>

          {/* Input Konfirmasi Nama */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">
              Konfirmasi nama barang:
            </label>
            <input 
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Ketik "${productName}"`}
              className="w-full p-4 rounded-2xl border border-border bg-muted/20 focus:bg-background outline-none focus:ring-4 focus:ring-red-500/10 transition-all font-bold text-sm"
              disabled={loading}
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              onClick={() => setIsOpen(false)}
              disabled={loading}
              className="flex-1 px-4 py-4 rounded-2xl bg-muted font-black uppercase tracking-[0.2em] text-[10px] hover:bg-muted/80 transition-all disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              onClick={handleDelete}
              disabled={loading || !isFormValid}
              className="flex-[2] px-4 py-4 rounded-2xl bg-red-500 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
              {loading ? "Menghapus Data..." : "Hapus Permanen"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}