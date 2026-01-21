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
  RefreshCw,
  ArrowLeft,
  Eye,
  File,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const PayoutHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { payoutHistory = [], loading } = useSelector(
    (state) => state.payout
  );

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
          description: "Gagal memperbarui data.",
          variant: "destructive",
        });
      })
      .finally(() => setIsRefreshing(false));
  };

  const totalAmount = payoutHistory.reduce(
    (total, item) => total + item.amount,
    0
  );

  if (loading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Card className="rounded-xl shadow-sm">
        {/* ===== HEADER ===== */}
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/payout")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl font-bold">
              Riwayat Pembayaran
            </CardTitle>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              Perbarui
            </Button>

            <div className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-bold text-sm md:text-base">
              Total: {formatRupiah(totalAmount)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* ===== MOBILE VIEW ===== */}
          <div className="md:hidden space-y-4 p-4">
            {payoutHistory.length > 0 ? (
              payoutHistory.map((item, index) => (
                <Card key={index} className="rounded-lg border">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">Tanggal</p>
                        <p className="font-medium">
                          {item.paidAt
                            ? format(new Date(item.paidAt), "dd/MM/yyyy")
                            : "-"}
                        </p>
                      </div>
                      <p className="font-bold text-green-600">
                        {formatRupiah(item.amount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Nama Seller</p>
                      <p className="font-semibold">
                        {item.sellerId.storeName}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm">
                        Pesanan:{" "}
                        <span className="font-medium">
                          {item.orders.length}
                        </span>
                      </p>

                      {item.paymentProofUrl ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              Bukti
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl p-0">
                            <DialogHeader className="p-4 border-b">
                              <DialogTitle>Bukti Pembayaran</DialogTitle>
                            </DialogHeader>
                            <div className="p-4 flex justify-center bg-muted">
                              <img
                                src={item.paymentProofUrl}
                                alt="Bukti"
                                className="max-h-[80vh] rounded-lg object-contain"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Badge variant="secondary">
                          <File className="h-3 w-3 mr-1" />
                          Tidak ada
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-10">
                Tidak ada riwayat pembayaran.
              </p>
            )}
          </div>

          {/* ===== DESKTOP TABLE ===== */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>ID Seller</TableHead>
                  <TableHead>Nama Seller</TableHead>
                  <TableHead className="text-center">Pesanan</TableHead>
                  <TableHead>Jumlah Bayar</TableHead>
                  <TableHead>Bukti</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {payoutHistory.length > 0 ? (
                  payoutHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item.paidAt
                          ? format(new Date(item.paidAt), "dd/MM/yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.sellerId._id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.sellerId.storeName}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.orders.length}
                      </TableCell>
                      <TableCell className="font-bold text-green-600">
                        {formatRupiah(item.amount)}
                      </TableCell>
                      <TableCell>
                        {item.paymentProofUrl ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Lihat
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl p-0">
                              <DialogHeader className="p-4 border-b">
                                <DialogTitle>Bukti Pembayaran</DialogTitle>
                              </DialogHeader>
                              <div className="p-6 flex justify-center bg-muted">
                                <img
                                  src={item.paymentProofUrl}
                                  alt="Bukti"
                                  className="max-h-[80vh] rounded-lg object-contain"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Badge variant="secondary">
                            <File className="h-3 w-3 mr-1" />
                            Tidak ada
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      Tidak ada riwayat pembayaran.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

      </Card>
    </div>
  );
};

export default PayoutHistory;
