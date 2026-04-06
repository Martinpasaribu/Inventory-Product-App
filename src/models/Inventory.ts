import { Schema, model, models } from 'mongoose';

// 1. Definisi Schema Kategori
const CategorySchema = new Schema({
  name: { 
    type: String, 
    required: [true, "Nama kategori wajib diisi"],
    trim: true 
  },
}, { timestamps: true });

// 2. Definisi Schema Produk/Barang
const ProductSchema = new Schema({
  name: { 
    type: String, 
    required: [true, "Nama barang wajib diisi"],
    trim: true 
  },
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: [true, "Kategori wajib dipilih"] 
  },
  stock: { 
    type: Number, 
    required: true, 
    default: 0,
    min: [0, "Stok tidak boleh minus"] 
  },
  // --- TAMBAHAN FIELD UNIT ---
  unit: { 
    type: String, 
    required: [true, "Satuan barang wajib diisi"],
    default: "pcs",
    lowercase: true,
    trim: true,
    enum: {
      values: [
        'pcs','kg', 'roll', 'batang', 'meter', 'pack', 'lembar', 'pail', 'galon', 
        'dus', 'box', 'kaleng', 'botol', 'tube', 'sachet', 'strip', 
        'bungkus', 'kantong', 'karung', 'tong', 'drum', 'pallet'
      ],
      message: '{VALUE} bukan satuan yang valid'
    }
  },
  // ---------------------------
  addedBy: { 
    type: String, 
    default: "Admin" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  history: [{
    type: { type: String, enum: ['IN', 'OUT'] },
    quantity: Number,
    note: String,
    date: { type: Date, default: Date.now }
  }]
});

// 3. Ekspor Model
export const Category = models.Category || model('Category', CategorySchema);
export const Product = models.Product || model('Product', ProductSchema);