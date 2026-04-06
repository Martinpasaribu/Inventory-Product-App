import mongoose, { Schema, model, models } from 'mongoose';

const LogSchema = new Schema({
  action: { 
    type: String, 
    required: true, 
    enum: ['CREATE_PRODUCT', 'UPDATE_STOCK', 'DELETE_PRODUCT', 'CREATE_CATEGORY', 'DELETE_CATEGORY'] 
  },
  targetName: { type: String, required: true }, // Nama barang atau kategori
  details: { type: String }, // Contoh: "Tambah stok 10", "Hapus barang"
  admin: { type: String, default: "Admin" },
  createdAt: { type: Date, default: Date.now }
});

export const Log = models.Log || model('Log', LogSchema);