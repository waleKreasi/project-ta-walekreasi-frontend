import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// axios instance dengan base URL + konfigurasi otentikasi
const api = axios.create({
  baseURL: "https://walekreasi-backend-thrid.onrender.com/api",
  withCredentials: true,
});

// Action untuk mengambil daftar seller yang belum dibayar
export const fetchUnpaidSellers = createAsyncThunk(
  "payout/fetchUnpaidSellers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/payout/unpaid-sellers");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Action untuk mengambil pesanan yang belum dibayar per seller
export const fetchUnpaidOrdersBySeller = createAsyncThunk(
  "payout/fetchUnpaidOrdersBySeller",
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/payout/unpaid-orders/${sellerId}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Action untuk menandai pembayaran dengan file bukti
export const markPaidToSeller = createAsyncThunk(
  "payout/markPaidToSeller",
  async (payoutData, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/payout/mark-paid", payoutData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Action untuk mengambil riwayat pembayaran (semua)
export const fetchAllPayoutHistory = createAsyncThunk(
  "payout/fetchAllPayoutHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/payout/history/all");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Action untuk mengambil riwayat pembayaran per seller
export const fetchPayoutHistoryBySeller = createAsyncThunk(
  "payout/fetchPayoutHistoryBySeller",
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/payout/history/${sellerId}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const payoutSlice = createSlice({
  name: "payout",
  initialState: {
    unpaidSellers: [],
    unpaidOrders: [],
    sellerName: "",
    payoutHistory: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnpaidSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnpaidSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.unpaidSellers = action.payload;
      })
      .addCase(fetchUnpaidSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUnpaidOrdersBySeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnpaidOrdersBySeller.fulfilled, (state, action) => {
        state.loading = false;
        state.unpaidOrders = action.payload.orders;
        state.sellerName = action.payload.sellerName;
      })
      .addCase(fetchUnpaidOrdersBySeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markPaidToSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markPaidToSeller.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markPaidToSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllPayoutHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPayoutHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.payoutHistory = action.payload;
      })
      .addCase(fetchAllPayoutHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPayoutHistoryBySeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayoutHistoryBySeller.fulfilled, (state, action) => {
        state.loading = false;
        state.payoutHistory = action.payload;
      })
      .addCase(fetchPayoutHistoryBySeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default payoutSlice.reducer;
