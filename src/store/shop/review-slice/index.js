// src/redux/slices/review-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ axios instance dengan baseURL baru
const api = axios.create({
  baseURL: "https://walekreasi-backend-thrid.onrender.com/api",
  withCredentials: true,
});

const initialState = {
  isLoading: false,
  reviews: [],
  error: null,
};

// [POST] Tambah review
export const addReview = createAsyncThunk(
  "review/addReview",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/shop/review/add", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal menambahkan review");
    }
  }
);

// [GET] Ambil review berdasarkan produk/order id
export const getReviews = createAsyncThunk(
  "review/getReviews",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/review/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal memuat review");
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // tambah review
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ambil review
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data || [];
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
        state.error = action.payload;
      });
  },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
