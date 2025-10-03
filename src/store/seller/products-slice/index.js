// src/redux/slices/sellerProductsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ axios instance dengan baseURL baru
const api = axios.create({
  baseURL: "https://walekreasi-backend-thrid.onrender.com/api",
  withCredentials: true,
});

const initialState = {
  isLoading: false,
  productList: [],
};

// ✅ Tambah produk baru
export const addNewProduct = createAsyncThunk(
  "/products/addNewProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const result = await api.post("/store/products/add", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Ambil semua produk seller
export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const result = await api.get("/store/products/get");
      return result?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Edit produk
export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const result = await api.put(`/store/products/edit/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Hapus produk
export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const result = await api.delete(`/store/products/delete/${id}`);
      return result?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔧 Slice
const sellerProductsSlice = createSlice({
  name: "sellerProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 FETCH ALL
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("✅ FETCH SUCCESS:", action.payload);
        state.productList = action.payload?.data || [];
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })

      // ➕ ADD PRODUCT
      .addCase(addNewProduct.fulfilled, (state, action) => {
        console.log("✅ ADD SUCCESS:", action.payload);
        if (action.payload?.success && action.payload?.product) {
          state.productList.push(action.payload.product);
        }
      })

      // ✏️ EDIT PRODUCT
      .addCase(editProduct.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.product) {
          const idx = state.productList.findIndex(
            (p) => p._id === action.payload.product._id
          );
          if (idx !== -1) {
            state.productList[idx] = action.payload.product;
          }
        }
      })

      // ❌ DELETE PRODUCT
      .addCase(deleteProduct.fulfilled, (state, action) => {
        if (action.payload?.success) {
          state.productList = state.productList.filter(
            (p) => p._id !== action.meta.arg
          );
        }
      });
  },
});

export default sellerProductsSlice.reducer;
