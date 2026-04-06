/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { AlertTriangle, Package, ArrowRight } from "lucide-react";
import Modal from "./Modal";

export default function LowStockModal({ 
  lowStockItems, 
  count 
}: { 
  lowStockItems: any[], 
  count: number 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Kartu Statistik sebagai Trigger */}
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full group p-6 rounded-[2rem] bg-orange-500/5 border border-orange-500/20 shadow-sm sm:col-span-2 lg:col-span-1 text-left hover:bg-orange-500/10 transition-all active:scale-95"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
              <AlertTriangle size={24}/>
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em]">Restock Alert</p>
              <h2 className="text-3xl font-black tracking-tighter text-orange-600 dark:text-orange-400">
                {count} <span className="text-sm opacity-60 font-bold">Items</span>
              </h2>
            </div>
          </div>
          <ArrowRight className="text-orange-500 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
        </div>
      </button>

      {/* Modal Daftar Barang Low Stock */}
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Daftar Barang Perlu Restock"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-600 flex gap-3 items-start">
            <AlertTriangle className="shrink-0 mt-0.5" size={18} />
            <p className="text-xs font-bold leading-relaxed">
              Barang-barang di bawah ini memiliki stok kurang dari 10 unit. Segera hubungi supplier atau lakukan pengadaan ulang.
            </p>
          </div>

          <div className="divide-y divide-border">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <div key={item._id} className="py-4 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-muted text-muted-foreground group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-colors">
                      <Package size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        {item.categoryId?.name || "No Category"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-red-500 font-mono">
                      {item.stock}
                    </div>
                    <p className="text-[8px] font-black uppercase text-muted-foreground">Sisa Stok</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-muted-foreground text-sm font-medium">
                Semua stok aman terjaga! ✨
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => setIsOpen(false)}
          className="w-full mt-6 py-4 rounded-2xl bg-muted font-black uppercase tracking-[0.2em] text-[10px] hover:bg-muted/80 transition-all"
        >
          Tutup Laporan
        </button>
      </Modal>
    </>
  );
}