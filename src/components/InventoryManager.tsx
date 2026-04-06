/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Modal from "./Modal";
import AddProductForm from "./AddProductForm";
import AddCategoryForm from "./AddCategoryForm"; // Import komponen baru
import { Plus, PackagePlus, FolderPlus } from "lucide-react";

export default function InventoryManager({ categories }: { categories: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"product" | "category">("product");

  const closeModal = () => {
    setIsModalOpen(false);
    // Kembalikan ke tab product setelah modal ditutup agar konsisten
    setTimeout(() => setActiveTab("product"), 300);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
      >
        <Plus size={18} strokeWidth={3} />
         Inventaris
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={activeTab === "product" ? "Tambah Barang" : "Tambah Kategori"}
      >
        {/* Tab Switcher */}
        <div className="flex bg-muted p-1 rounded-xl mb-6 border border-border/50">
          <button
            onClick={() => setActiveTab("product")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === "product"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PackagePlus size={16} />
            Produk
          </button>
          <button
            onClick={() => setActiveTab("category")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === "category"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderPlus size={16} />
            Kategori
          </button>
        </div>

        {/* Content Render berdasarkan Active Tab */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === "product" ? (
            <AddProductForm
              categories={categories}
              onSuccess={closeModal}
            />
          ) : (
            <AddCategoryForm onSuccess={closeModal} />
          )}
        </div>
      </Modal>
    </>
  );
}