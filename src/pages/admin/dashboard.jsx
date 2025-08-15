import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "@/store/admin/dashboard-slice";
import {
  User,
  Store,
  DollarSign,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Greeting from "@/components/admin/gretting";

function AdminDashboardPage() {
  const dispatch = useDispatch();
  const {
    sellerCount,
    customerCount,
    totalRevenue,
    totalOrders,
    loading,
    error, // Menambahkan state error
  } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const formatRupiah = (number) => {
    if (typeof number !== 'number' || isNaN(number)) {
      return "Rp 0";
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Menangani state loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  // Menangani state error
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 bg-gray-50 p-4 text-center">
        <p>Error: Gagal memuat data dashboard. Silakan coba lagi.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <Greeting />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Kartu Pendapatan - Warna Hijau */}
        <Card className="hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-green-500 to-green-600">
            <CardTitle className="text-md font-semibold text-white">Total Pendapatan</CardTitle>
            <DollarSign className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent className="p-4 bg-white">
            <div className="text-3xl font-bold text-gray-900 mt-2">{formatRupiah(totalRevenue || 0)}</div>
            <p className="text-sm text-gray-500 mt-1">Minggu ini</p>
          </CardContent>
        </Card>

        {/* Kartu Pesanan - Warna Biru */}
        <Card className="hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-blue-500 to-blue-600">
            <CardTitle className="text-md font-semibold text-white">Total Pesanan</CardTitle>
            <ShoppingCart className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent className="p-4 bg-white">
            <div className="text-3xl font-bold text-gray-900 mt-2">{totalOrders || 0}</div>
            <p className="text-sm text-gray-500 mt-1">Minggu ini</p>
          </CardContent>
        </Card>

        {/* Kartu Seller - Warna Ungu */}
        <Card className="hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-purple-500 to-purple-600">
            <CardTitle className="text-md font-semibold text-white">Seller Terdaftar</CardTitle>
            <Store className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent className="p-4 bg-white">
            <div className="text-3xl font-bold text-gray-900 mt-2">{sellerCount || 0}</div>
            <p className="text-sm text-gray-500 mt-1">Total</p>
          </CardContent>
        </Card>

        {/* Kartu Pelanggan - Warna Oranye */}
        <Card className="hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-orange-500 to-orange-600">
            <CardTitle className="text-md font-semibold text-white">Pelanggan</CardTitle>
            <User className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent className="p-4 bg-white">
            <div className="text-3xl font-bold text-gray-900 mt-2">{customerCount || 0}</div>
            <p className="text-sm text-gray-500 mt-1">Total</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
