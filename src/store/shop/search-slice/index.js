// src/redux/slices/search-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ axios instance dengan baseURL baru
const api = axios.create({
  baseURL: "https://walekreasi-backend-thrid.onrender.com/api",
  withCredentials: true,
});

const initialState = {
  isLoading: false,
  searchResults: [],
  error: null,
};

// [GET] Cari produk
export const getSearchResults = createAsyncThunk(
  "search/getSearchResults",
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/search/${keyword}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal memuat hasil pencarian");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
    },
    clearSearchError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data || [];
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.searchResults = [];
        state.error = action.payload;
      });
  },
});

export const { resetSearchResults, clearSearchError } = searchSlice.actions;

export default searchSlice.reducer;
