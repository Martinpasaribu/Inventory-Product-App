"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Product, Category } from "@/models/Inventory";
import { Log } from "@/models/Log"; // Pastikan model Log sudah dibuat

/**
 * 1. Menambahkan Kategori Baru + LOG
 */
export async function addCategory(name: string) {
  await connectDB();
  if (!name) throw new Error("Nama kategori tidak boleh kosong");
  
  const newCategory = await Category.create({ name });
  
  // Mencatat Aktivitas
  await Log.create({
    action: 'CREATE_CATEGORY',
    targetName: name,
    details: `Kategori "${name}" berhasil ditambahkan ke sistem.`,
    admin: "Admin Gudang"
  });

  revalidatePath("/");
}


/**
 * 2. Menambahkan Barang Baru + LOG (Updated with Unit)
 */
export async function addProduct(data: {
  name: string;
  categoryId: string;
  stock: number;
  unit: string; // Tambahkan field unit di sini
}) {
  await connectDB();
  
  // Membuat produk baru dengan menyertakan unit
  const newProduct = await Product.create({
    ...data,
    addedBy: "Admin Gudang",
    createdAt: new Date(),
  });

  // Mencatat Aktivitas ke dalam Log
  await Log.create({
    action: 'CREATE_PRODUCT',
    targetName: data.name,
    // Log sekarang menampilkan angka stok beserta satuannya (misal: 100 pcs, 5 roll)
    details: `Barang baru didaftarkan dengan stok awal sebanyak ${data.stock} ${data.unit}.`,
    admin: "Admin Gudang"
  });

  // Revalidasi path admin agar data langsung muncul tanpa refresh
  revalidatePath("/admin");
  
  return JSON.parse(JSON.stringify(newProduct));
}


/**
 * 3. Update Stok (Tambah/Kurang) + LOG
 * Fungsi ini lebih fleksibel untuk digunakan di tombol (+) atau (-)
 */
export async function updateStock(productId: string, quantity: number, type: 'IN' | 'OUT', reason: string) {
  await connectDB();
  
  const product = await Product.findById(productId);
  if (!product) throw new Error("Barang tidak ditemukan");

  const amount = type === 'IN' ? quantity : -quantity;
  const newStock = product.stock + amount;

  if (newStock < 0) throw new Error("Stok tidak mencukupi!");

  product.stock = newStock;
  await product.save();

  // Log dengan alasan dan jumlah kustom
  await Log.create({
    action: 'UPDATE_STOCK',
    targetName: product.name,
    details: `Stok ${type === 'IN' ? 'Masuk' : 'Keluar'} sebanyak ${quantity} unit. Alasan: "${reason}". Total akhir: ${newStock}`,
    admin: "Admin Gudang"
  });

  revalidatePath("/");
}

/**
 * 4. Menghapus Produk + LOG
 */
export async function deleteProduct(productId: string, reason: string) {
  await connectDB();
  
  const product = await Product.findById(productId);
  if (!product) throw new Error("Barang tidak ditemukan");

  await Product.findByIdAndDelete(productId);

  // Mencatat Aktivitas dengan ALASAN
  await Log.create({
    action: 'DELETE_PRODUCT',
    targetName: product.name,
    details: `Barang dihapus. Alasan: "${reason}". Stok terakhir: ${product.stock}`,
    admin: "Admin Gudang"
  });

  revalidatePath("/");
}