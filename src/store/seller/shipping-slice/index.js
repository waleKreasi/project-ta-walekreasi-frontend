import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Sama seperti profil slice
const api = axios.create({
  baseURL: "https://walekreasi-backend-thrid.onrender.com/api",
  withCredentials: true,
});

const initialState = {
  isLoading: false,
  shippingList: [],
  error: null,
  successMessage: null,
};

// [GET] Ambil data ongkir seller
export const fetchSellerShipping = createAsyncThunk(
  "sellerShipping/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/store/shipping/:sellerId"); 
      return res.data.data; // pastikan sesuai struktur backend
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal memuat data ongkir."
      );
    }
  }
);

// [PUT] Update ongkir
export const updateShippingCost = createAsyncThunk(
  "sellerShipping/update",
  async ({ regionName, cost }, { rejectWithValue }) => {
    try {
      const res = await api.put("/store/shipping/update", { regionName, cost });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal memperbarui ongkir."
      );
    }
  }
);

const sellerShippingSlice = createSlice({
  name: "sellerShipping",
  initialState,
  reducers: {
    clearShippingMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchSellerShipping.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSellerShipping.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shippingList = action.payload || [];
      })
      .addCase(fetchSellerShipping.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.shippingList = [];
      })

      // UPDATE
      .addCase(updateShippingCost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateShippingCost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = "Ongkir berhasil diperbarui.";

        // optional: update data lokal di store
        const updated = action.payload;
        if (updated && state.shippingList?.length > 0) {
          const idx = state.shippingList.findIndex(
            (s) => s.regionName === updated.regionName
          );
          if (idx >= 0) state.shippingList[idx] = updated;
        }
      })
      .addCase(updateShippingCost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearShippingMessages } = sellerShippingSlice.actions;
export default sellerShippingSlice.reducer;
