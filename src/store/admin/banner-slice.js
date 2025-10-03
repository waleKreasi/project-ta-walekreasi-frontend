import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

// Buat axios instance dengan base URL
const api = axios.create({
  baseURL: "https://walekreasi-backend-thrid.onrender.com",
  withCredentials: true,
});

// Initial State
const initialState = {
  banners: [],
  isLoading: false,
  error: null,
};

// Thunk untuk fetch semua banner
export const fetchBanners = createAsyncThunk(
  "banner/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/admin/banner");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Thunk untuk upload banner
export const uploadBanner = createAsyncThunk(
  "banner/uploadBanner",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/admin/banner/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Thunk untuk delete banner
export const deleteBanner = createAsyncThunk(
  "banner/deleteBanner",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/admin/banner/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice
const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch banners
      .addCase(fetchBanners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // upload banner
      .addCase(uploadBanner.fulfilled, (state, action) => {
        state.banners.unshift(action.payload);
      })

      // delete banner
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter((b) => b._id !== action.payload);
      });
  },
});

// Selectors
export const selectAllBanners = (state) => state.banner?.banners || [];

export const selectIntroBanners = createSelector(
  [selectAllBanners],
  (banners) => banners.filter((b) => b.type === "intro")
);

export const selectLandingBanners = createSelector(
  [selectAllBanners],
  (banners) => banners.filter((b) => b.type === "landing")
);

export const selectCustomerBanners = createSelector(
  [selectAllBanners],
  (banners) => banners.filter((b) => b.type === "customer")
);

export default bannerSlice.reducer;
