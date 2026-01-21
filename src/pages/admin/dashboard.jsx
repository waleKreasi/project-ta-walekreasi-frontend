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
import Greeting from "@/components/common/gretting";

function AdminDashboardPage() {
  const dispatch = useDispatch();
  const {
    sellerCount,
    customerCount,
    totalRevenue,
    totalOrders,
    loading,
    error,
  } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const formatRupiah = (number) => {
    if (!number) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4 text-center">
        <p className="text-red-500 font-medium">
          Terjadi kesalahan saat memuat dashboard. Silakan coba lagi.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 min-h-screen">
      <div>
        <Greeting />
        <p className="text-2xl text-gray-600 font-medium">
          Admin Marketplace Walekreasi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Pendapatan */}
        <Card className="hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-green-500 to-green-600">
            <CardTitle className="text-md font-semibold text-white">
              Total Pendapatan
            </CardTitle>
            <DollarSign className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent className="p-4 bg-white">
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {formatRupiah(totalRevenue)}
            </div>
          </CardContent>
        </Card>

        {/* Total Pesanan */}
        <Card className="hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-blue-500 to-blue-600">
            <CardTitle className="text-md font-semibold text-white">
              Total Pesanan
            </CardTitle>
            <ShoppingCart className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent className="p-4 bg-white">
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {totalOrders ?? 0}
            </div>
          </CardContent>
        </Card>

        {/* Total Seller */}
        <Card className="hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-purple-500 to-purple-600">
            <CardTitle className="text-md font-semibold text-white">
              Seller Terdaftar
            </CardTitle>
            <Store className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent className="p-4 bg-white">
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {sellerCount ?? 0}
            </div>
          </CardContent>
        </Card>

        {/* Total Customer */}
        <Card className="hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-orange-500 to-orange-600">
            <CardTitle className="text-md font-semibold text-white">
              Pelanggan Terdaftar
            </CardTitle>
            <User className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent className="p-4 bg-white">
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {customerCount ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
