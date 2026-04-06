"use client";

import { useState } from "react";
import { addCategory } from "@/lib/actions/inventory";
import { FolderPlus, Loader2 } from "lucide-react";

export default function AddCategoryForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      await addCategory(name);
      setName("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Gagal menambah kategori:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80">
          Nama Kategori
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Elektronik, Alat Kantor..."
          className="w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <FolderPlus size={18} />
        )}
        {loading ? "Menyimpan..." : "Simpan Kategori"}
      </button>
    </form>
  );
}