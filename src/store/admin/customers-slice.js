import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// axios instance dengan base URL
const api = axios.create({
  baseURL: "https://walekreasi-backend-thrid.onrender.com",
  withCredentials: true,
});

export const fetchAllCustomers = createAsyncThunk(
  "admin/fetchAllCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/info/customers");
      return response.data.customers;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const customersSlice = createSlice({
  name: "customersInfo",
  initialState: {
    customers: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default customersSlice.reducer;
