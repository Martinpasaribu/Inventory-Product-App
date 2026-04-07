/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { FileSpreadsheet, FileText, X, Download, FileType } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";

interface ExportButtonsProps {
  data: any[];
}

export default function ExportButtons({ data }: ExportButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState(`Laporan_Inventaris_${new Date().toLocaleDateString("id-ID").replace(/\//g, "-")}`);
  const [exportType, setExportType] = useState<"pdf" | "excel" | null>(null);

  const openModal = (type: "pdf" | "excel") => {
    setExportType(type);
    setIsOpen(true);
  };

  const handleExport = () => {
    if (exportType === "excel") exportToExcel();
    else if (exportType === "pdf") exportToPDF();
    setIsOpen(false);
  };

  // --- LOGIKA EXCEL ---
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((p) => ({
        "ID PRODUK": p._id.toString().slice(-6).toUpperCase(),
        "NAMA BARANG": p.name.toUpperCase(),
        "KATEGORI": (p.categoryId?.name || "Uncategorized").toUpperCase(),
        "QTY": p.stock,
        "SATUAN": (p.unit || "pcs").toUpperCase(),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // --- LOGIKA PDF ---
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header Dekorasi
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("LAPORAN INVENTARIS GUDANG", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Dicetak pada: ${new Date().toLocaleString("id-ID")}`, 14, 28);

    const tableRows = data.map((p) => [
      p._id.toString().slice(-6).toUpperCase(),
      p.name.toUpperCase(),
      (p.categoryId?.name || "Uncategorized").toUpperCase(),
      p.stock,
      (p.unit || "pcs").toUpperCase(),
    ]);

    autoTable(doc, {
      head: [["ID", "NAMA PRODUK", "KATEGORI", "QTY", "SATUAN"]],
      body: tableRows,
      startY: 35,
      theme: "grid",
      headStyles: { 
        fillColor: [251, 191, 36], // Warna Kuning Amber (Tailwind amber-400)
        textColor: [0, 0, 0],       // Teks Hitam agar kontras
        fontStyle: "bold",
        halign: "center"
      },
      columnStyles: {
        3: { halign: "center" }, // Qty center
        4: { halign: "center" }, // Satuan center
      },
      styles: { fontSize: 9, cellPadding: 3 }
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => openModal("excel")}
          className="flex items-center gap-2 px-4 py-3 bg-green-600/10 text-green-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all border border-green-600/20 shadow-sm active:scale-95"
        >
          <FileSpreadsheet size={16} />
          <span className="hidden sm:inline">Excel</span>
        </button>

        <button
          onClick={() => openModal("pdf")}
          className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 text-amber-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all border border-amber-500/20 shadow-sm active:scale-95"
        >
          <FileText size={16} />
          <span className="hidden sm:inline">PDF</span>
        </button>
      </div>

      {/* MODAL NAMA FILE */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[2000000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-card border border-border p-8 rounded-[2.5rem] shadow-[0_30px_100px_-15px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <FileType size={20} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-tighter">Konfigurasi Ekspor</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block px-1">
                    Nama File ({exportType?.toUpperCase()})
                  </label>
                  <div className="relative">
                    <input 
                      autoFocus
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="w-full bg-muted/30 border border-border p-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm"
                      placeholder="Masukkan nama file..."
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-border hover:bg-muted transition-all"
                    >
                        Batal
                    </button>
                    <button 
                      onClick={handleExport}
                      className="flex-2 flex-[2] bg-primary text-primary-foreground py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Download size={16} /> Unduh Sekarang
                    </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}