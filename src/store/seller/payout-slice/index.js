// src/redux/slices/payout-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Ambil data payout seller
export const fetchSellerPayouts = createAsyncThunk(
  "payout/fetchSellerPayouts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://project-ta-walekreasi-server-production.up.railway.app/api/store/payout/my-payouts`,
        { withCredentials: true }
      );

      const resData = response.data;

      if (!resData.success) {
        return rejectWithValue(resData.message || "Gagal memuat data payout");
      }

      return resData.data; // ambil array payout
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal memuat data payout"
      );
    }
  }
);

const sellerPayoutSlice = createSlice({
  name: "payout",
  initialState: {
    payouts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearPayoutError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerPayouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerPayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.payouts = action.payload || [];
      })
      .addCase(fetchSellerPayouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPayoutError } = sellerPayoutSlice.actions;
export default sellerPayoutSlice.reducer;
