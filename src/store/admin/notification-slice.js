import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// axios instance dengan base URL
const api = axios.create({
  baseURL: "https://walekreasi-backend-thrid.onrender.com",
  withCredentials: true,
});

// ✅ Kirim notifikasi
export const sendNotification = createAsyncThunk(
  "notification/sendToCustomer",
  async ({ title, body }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/admin/notification/send-to-customers", {
        title,
        body,
      });
      return res.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengirim notifikasi"
      );
    }
  }
);

// ✅ Ambil riwayat notifikasi
export const fetchNotificationHistory = createAsyncThunk(
  "notification/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/admin/notification/history");
      return res.data.notifications;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal memuat riwayat notifikasi"
      );
    }
  }
);

// ✅ Hapus semua riwayat notifikasi
export const clearNotificationHistory = createAsyncThunk(
  "notification/clearHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.delete("/api/admin/notification/history/clear");
      return res.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal menghapus riwayat notifikasi"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "sendNotification",
  initialState: {
    loading: false,
    message: null,
    error: null,
    history: [],
    loadingHistory: false, // ✅ untuk menangani loading saat fetch/hapus riwayat
  },
  reducers: {
    clearNotificationState(state) {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ sendNotification
      .addCase(sendNotification.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ fetchNotificationHistory
      .addCase(fetchNotificationHistory.pending, (state) => {
        state.loadingHistory = true;
      })
      .addCase(fetchNotificationHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        state.history = action.payload;
      })
      .addCase(fetchNotificationHistory.rejected, (state, action) => {
        state.loadingHistory = false;
        state.error = action.payload;
      })

      // ✅ clearNotificationHistory
      .addCase(clearNotificationHistory.pending, (state) => {
        state.loadingHistory = true;
      })
      .addCase(clearNotificationHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        state.history = [];
        state.message = action.payload;
      })
      .addCase(clearNotificationHistory.rejected, (state, action) => {
        state.loadingHistory = false;
        state.error = action.payload;
      });
  },
});

export const { clearNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;
