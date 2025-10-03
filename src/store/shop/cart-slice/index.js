// src/redux/slices/cart-slice.js
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ axios instance
const api = axios.create({
  baseURL: "https://walekreasi-backend-thrid.onrender.com/api",
  withCredentials: true,
});

const initialState = {
  cartData: [],
  isLoading: false,
  error: null,
};

// [POST] Tambah item ke cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post("/shop/cart/add", {
        userId,
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal menambah ke keranjang.");
    }
  }
);

// [GET] Ambil semua item cart
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/cart/get/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal memuat keranjang.");
    }
  }
);

// [DELETE] Hapus item dari cart
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/shop/cart/${userId}/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal menghapus item.");
    }
  }
);

// [PUT] Update kuantitas item di cart
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put("/shop/cart/update-cart", {
        userId,
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal memperbarui jumlah.");
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setPending = (state) => {
      state.isLoading = true;
      state.error = null;
    };

    const setFulfilled = (state, action) => {
      state.isLoading = false;
      state.cartData = action.payload?.data?.itemsByStore || [];
    };

    const setRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    builder
      .addCase(addToCart.pending, setPending)
      .addCase(addToCart.fulfilled, setFulfilled)
      .addCase(addToCart.rejected, setRejected)

      .addCase(fetchCartItems.pending, setPending)
      .addCase(fetchCartItems.fulfilled, setFulfilled)
      .addCase(fetchCartItems.rejected, setRejected)

      .addCase(updateCartQuantity.pending, setPending)
      .addCase(updateCartQuantity.fulfilled, setFulfilled)
      .addCase(updateCartQuantity.rejected, setRejected)

      .addCase(deleteCartItem.pending, setPending)
      .addCase(deleteCartItem.fulfilled, setFulfilled)
      .addCase(deleteCartItem.rejected, setRejected);
  },
});

export const { clearCartError } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
