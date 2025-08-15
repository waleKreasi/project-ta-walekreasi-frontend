import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPayoutHistory } from "@/store/admin/payout-slice";
import { format } from "date-fns";
import { formatRupiah } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleDollarSign,
  History,
  RefreshCw,
  ArrowLeft,
  X,
  Eye,
  File,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const PayoutHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { payoutHistory, loading, error } = useSelector((state) => state.payout);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchAllPayoutHistory());
  }, [dispatch]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    dispatch(fetchAllPayoutHistory())
      .unwrap()
      .then(() => {
        toast({
          title: "Berhasil",
          description: "Data riwayat pembayaran diperbarui.",
        });
      })
      .catch(() => {
        toast({
          title: "Gagal",
          description: "Gagal memperbarui data. Coba lagi nanti.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  const handleBack = () => {
    navigate('/admin/payout');
  };

  const calculateTotalAmount = () => {
    return payoutHistory.reduce((total, history) => total + history.amount, 0);
  };

  if (loading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 bg-gray-50 border-b">
          <div className="flex items-center space-x-4">
            {/* Tombol kembali ke halaman /payout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-3">
              <CardTitle className="text-2xl font-bold text-gray-800">Riwayat Pembayaran</CardTitle>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Perbarui</span>
            </Button>
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-xl font-extrabold text-green-700">
                {formatRupiah(calculateTotalAmount())}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow className="hover:bg-gray-100">
                <TableHead className="w-[150px] font-bold text-gray-700">Tanggal</TableHead>
                <TableHead className="font-bold text-gray-700">ID Seller</TableHead>
                <TableHead className="font-bold text-gray-700">Nama Seller</TableHead>
                <TableHead className="font-bold text-gray-700">Jumlah Pesanan</TableHead>
                <TableHead className="font-bold text-gray-700">Jumlah Bayar</TableHead>
                <TableHead className="font-bold text-gray-700">Bukti Pembayaran</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutHistory && payoutHistory.length > 0 ? (
                payoutHistory.map((history, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-600">
                      {history.paidAt ? format(new Date(history.paidAt), 'dd/MM/yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-500">{history.sellerId._id}</TableCell>
                    <TableCell className="font-semibold text-gray-800">{history.sellerId.storeName}</TableCell>
                    <TableCell className="text-center">{history.orders.length}</TableCell>
                    <TableCell className="font-bold text-green-600">{formatRupiah(history.amount)}</TableCell>
                    <TableCell>
                      {history.paymentProofUrl ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>Lihat Bukti</span>
                            </Button>
                          </DialogTrigger>
                          {/* Perbaikan di sini: Struktur dialog diperbaiki untuk tampilan yang lebih baik */}
                          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white rounded-lg shadow-2xl">
                            <DialogHeader className="p-4 border-b flex flex-row justify-between items-center bg-gray-50">
                              <DialogTitle className="text-xl font-bold">Bukti Pembayaran</DialogTitle>
                            </DialogHeader>
                            <div className="flex justify-center p-6 bg-gray-100">
                              <img
                                src={history.paymentProofUrl}
                                alt="Bukti Pembayaran"
                                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Badge variant="secondary" className="text-xs font-normal text-gray-500">
                            <File className="h-3 w-3 mr-1" />
                            Tidak ada
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    Tidak ada riwayat pembayaran yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayoutHistory;
