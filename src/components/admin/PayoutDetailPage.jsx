import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchUnpaidOrdersBySeller, 
  markPaidToSeller 
} from "@/store/admin/payout-slice";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatRupiah } from "@/lib/utils";
import { CheckCheck, Loader2, AlertCircle, ChevronLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PayoutDetailPage = () => {
  const { sellerId } = useParams();
  const dispatch = useDispatch();
  const { unpaidOrdersBySeller, loading, error } = useSelector((state) => state.payout);

  const [selectedOrderIds, setSelectedOrderIds] = useState(new Set());
  const [payoutLoading, setPayoutLoading] = useState(false);

  useEffect(() => {
    if (sellerId) {
      dispatch(fetchUnpaidOrdersBySeller(sellerId));
    }
  }, [dispatch, sellerId]);

  const handleSelectOrder = (orderId, isChecked) => {
    setSelectedOrderIds(prev => {
      const newSelected = new Set(prev);
      if (isChecked) {
        newSelected.add(orderId);
      } else {
        newSelected.delete(orderId);
      }
      return newSelected;
    });
  };

  const handlePaySeller = async () => {
    const ordersToPay = Array.from(selectedOrderIds);
    if (ordersToPay.length === 0) {
      return;
    }

    setPayoutLoading(true);

    try {
      await dispatch(markPaidToSeller({ sellerId, orderIds: ordersToPay })).unwrap();
      dispatch(fetchUnpaidOrdersBySeller(sellerId));
      setSelectedOrderIds(new Set());
    } catch (err) {
      console.error("Gagal memproses pembayaran:", err);
    } finally {
      setPayoutLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    let total = 0;
    const orders = unpaidOrdersBySeller?.orders || [];
    orders.forEach(order => {
      if (selectedOrderIds.has(order._id?.$oid || order._id)) {
        total += order.totalAmount?.$numberInt || order.totalAmount;
      }
    });
    return total;
  };
  
  if (!sellerId) {
    return (
      <div className="p-6 text-center text-red-600">
        <AlertCircle className="inline-block h-6 w-6 mr-2" />
        <p>ID Seller tidak ditemukan dalam URL. Kembali ke halaman sebelumnya.</p>
        <div className="mt-4">
          <Link to="/admin/payout">
            <Button>Kembali ke Daftar Seller</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <p className="p-6 text-center text-red-600">Terjadi kesalahan: {error}</p>;
  }

  const totalSelected = calculateTotalAmount();

  if (!unpaidOrdersBySeller || !unpaidOrdersBySeller.orders || unpaidOrdersBySeller.orders.length === 0) {
    return (
      <div className="p-6">
        <Card className="text-center p-12">
          <CardTitle>
            Pembayaran untuk {unpaidOrdersBySeller?.sellerName || 'Seller'}
          </CardTitle>
          <CardDescription className="mt-2">
            🎉 Tidak ada pesanan yang menunggu pembayaran untuk seller ini.
          </CardDescription>
          <div className="mt-6">
            <Link to="/admin/payout">
              <Button>Kembali ke Daftar Seller</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Pembayaran untuk {unpaidOrdersBySeller.sellerName}</h1>
        <Link to="/admin/payout">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Seller
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{unpaidOrdersBySeller.sellerName}</CardTitle>
            <CardDescription>ID Seller: <span className="font-mono">{sellerId}</span></CardDescription>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">Total yang akan dibayar: {formatRupiah(totalSelected)}</p>
            <p className="text-sm text-muted-foreground">{selectedOrderIds.size} Pesanan terpilih</p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[150px]">Order ID</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unpaidOrdersBySeller.orders.map((order) => {
                // Perbaikan: Menggunakan properti order.createdAt atau order.orderDate.$date
                const dateSource = order.createdAt || (order.orderDate && order.orderDate.$date);
                const orderDate = dateSource ? new Date(dateSource) : null;
                
                const formattedDate = orderDate && !isNaN(orderDate.getTime())
                  ? orderDate.toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Tanggal Tidak Valid';
                
                const productName = order.cartItems && Array.isArray(order.cartItems) && order.cartItems.length > 0
                  ? order.cartItems.map(item => item.title).join(', ')
                  : 'N/A';
                
                const orderId = order._id?.$oid || order._id;
                const totalAmount = order.totalAmount?.$numberInt || order.totalAmount;

                return (
                  <TableRow key={orderId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrderIds.has(orderId)}
                        onCheckedChange={(isChecked) => handleSelectOrder(orderId, isChecked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{orderId}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{productName}</Badge>
                    </TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell className="text-right">{formatRupiah(totalAmount)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  disabled={selectedOrderIds.size === 0 || payoutLoading}
                >
                  {payoutLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Tandai Pesanan Terpilih Telah Dibayar
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Pembayaran</AlertDialogTitle>
                  <AlertDialogDescription>
                    Anda yakin ingin menandai {selectedOrderIds.size} pesanan ini sebagai telah dibayar kepada seller?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePaySeller}>
                    Ya, Bayar Sekarang
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayoutDetailPage;
