// src/redux/slices/shopping-product-slice.js
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
  latestProducts: [],
  productDetails: null,
  error: null,
};

// [GET] Ambil semua produk dengan filter & sort
export const fetchAllFilteredProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filterParams, sortParams }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
      });
      const response = await api.get(`/shop/products/get?${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal memuat produk");
    }
  }
);

// [GET] Ambil 12 produk terbaru
export const fetchLatestProducts = createAsyncThunk(
  "products/fetchLatestProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/shop/products/get?sortBy=newest&limit=12"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal memuat produk terbaru");
    }
  }
);

// [GET] Detail satu produk
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/products/get/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal memuat detail produk");
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // semua produk
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data || [];
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.payload;
      })

      // produk terbaru
      .addCase(fetchLatestProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLatestProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.latestProducts = action.payload.data || [];
      })
      .addCase(fetchLatestProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.latestProducts = [];
        state.error = action.payload;
      })

      // detail produk
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
        state.error = action.payload;
      });
  },
});

export const { setProductDetails, clearProductError } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;
