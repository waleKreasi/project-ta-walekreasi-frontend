import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSellerDashboardData } from "@/store/seller/dashboard-slice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, ShoppingCart } from "lucide-react";
import Greeting from "@/components/common/gretting";

// Helper function untuk format rupiah
const formatRupiah = (value) =>
  `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, isLoading, error } = useSelector(
    (state) => state.sellerDashboard
  );
  const { profile: store } = useSelector((state) => state.sellerProfile); 

  useEffect(() => {
    dispatch(getSellerDashboardData());
  }, [dispatch]);

  const totalRevenue = dashboardData.reduce(
    (sum, item) => sum + item.totalRevenue,
    0
  );
  const totalOrders = dashboardData.reduce(
    (sum, item) => sum + item.totalOrders,
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-gray-500 text-lg">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-red-500 text-lg">Terjadi kesalahan: {error}</p>
      </div>
    );
  }

  if (dashboardData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-gray-500 text-lg">Tidak ada data untuk ditampilkan.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <Greeting />
        <p className="text-xl md:text-2xl  text-gray-600 font-medium">
         {store?.storeName || "Store Dashboard"}
        </p>
      </div>

      {/* Ringkasan Metrik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg rounded-2xl bg-white text-gray-800 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between p-5 sm:p-6">
            <CardTitle className="text-sm sm:text-lg font-medium">
              Total Pendapatan
            </CardTitle>
            <DollarSign className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="text-3xl sm:text-4xl font-bold">
              {formatRupiah(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl bg-white text-gray-800 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between p-5 sm:p-6">
            <CardTitle className="text-sm sm:text-lg font-medium">
              Total Pesanan
            </CardTitle>
            <ShoppingCart className="h-6 w-6 text-secondary" />
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="text-3xl sm:text-4xl font-bold">
              {totalOrders.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Grafik Batang Pendapatan */}
        <Card className="shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl">
          <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Pendapatan Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A0A0A0' }} />
                <YAxis
                  tickFormatter={(value) => `${value.toLocaleString("id-ID")}`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#A0A0A0' }}
                />
                <Tooltip
                  cursor={{ fill: '#F5F5F5', radius: 4 }}
                  formatter={(value) => [formatRupiah(value), "Pendapatan"]}
                />
                <Bar
                  dataKey="totalRevenue"
                  fill="#78B9F5" // Warna biru yang lebih soft
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grafik Garis Pesanan */}
        <Card className="shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl">
          <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Tren Jumlah Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A0A0A0' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A0A0A0' }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="totalOrders"
                  name="Jumlah Pesanan"
                  stroke="#957DAD" // Warna ungu yang lebih soft
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#957DAD', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#957DAD', stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Detail */}
      <Card className="shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
        <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl font-semibold">
            Detail Bulanan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50 border-b-2 border-gray-100">
              <tr>
                <th className="px-4 py-3 sm:px-6 font-medium text-gray-600">Bulan</th>
                <th className="px-4 py-3 sm:px-6 font-medium text-gray-600">Pendapatan</th>
                <th className="px-4 py-3 sm:px-6 font-medium text-gray-600">Pesanan</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-3 sm:px-6 font-medium text-gray-800">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 sm:px-6 text-gray-700">
                    {formatRupiah(item.totalRevenue)}
                  </td>
                  <td className="px-4 py-3 sm:px-6 text-gray-700">
                    {item.totalOrders}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerDashboard;