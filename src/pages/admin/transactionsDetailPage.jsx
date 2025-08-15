import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchTransactionById,
  clearSelectedTransaction,
} from "@/store/admin/trasactions-slice";
import { format } from "date-fns";
import {
  Card,
  CardContent,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ReceiptText } from "lucide-react";

function TransactionDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTransaction, isLoading, error } = useSelector((state) => state.transactionsInfo);

  useEffect(() => {
    dispatch(fetchTransactionById(id));
    return () => dispatch(clearSelectedTransaction()); // bersihkan saat unmount
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-red-500 text-center">Error: {error}</p>;
  }

  if (!selectedTransaction) {
    return null;
  }

  const {
    _id,
    userId,
    sellerId,
    orderDate,
    orderStatus,
    paymentStatus,
    totalAmount,
    addressInfo,
    cartItems,
  } = selectedTransaction;

  const handleBack = () => {
    navigate('/admin/transactions');
  };


  // Helper function to determine badge variant based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="default" className="bg-gray-500 hover:bg-gray-600 text-sm">{status}</Badge>;
      case "processing":
        return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-sm">{status}</Badge>;
      case "shipped":
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-sm">{status}</Badge>;
      case "delivered":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-sm">{status}</Badge>;
      case "rejected":
        return <Badge variant="default" className="bg-red-500 hover:bg-red-600 text-sm">{status}</Badge>;
      default:
        return <Badge variant="outline" className="text-sm">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 ">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-900"
          >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Detail Transaksi</h1>
      </div>


      <Card className="shadow-lg rounded-xl overflow-hidden">

        <CardContent className="p-6 grid gap-6">
          {/* Informasi Umum Transaksi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-3">
              <h3 className="font-semibold text-lg text-gray-700">Informasi Transaksi</h3>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">ID Order:</span>
                <span className="font-semibold text-gray-600">{_id}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Tanggal Order:</span>
                <span className="font-semibold text-gray-600">{format(new Date(orderDate), 'dd MMMM yyyy HH:mm')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Status Order:</span>
                <span className="font-semibold text-gray-600">{getStatusBadge(orderStatus)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Status Pembayaran:</span>
                <span className="font-semibold text-gray-600">{paymentStatus}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Total Bayar:</span>
                <span className="font-semibold text-gray-600">Rp {totalAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Informasi Alamat Pengiriman */}
            <div className="flex flex-col space-y-3">
              <h3 className="font-semibold text-lg text-gray-700">Alamat Pengiriman</h3>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Penerima:</span>
                <span className="font-semibold text-gray-600">{addressInfo.receiverName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Alamat:</span>
                <span className="font-semibold text-gray-600">{addressInfo.address}, {addressInfo.city}, {addressInfo.pincode}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Telepon:</span>
                <span className="font-semibold text-gray-600">{addressInfo.phone}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Catatan:</span>
                <span className="font-semibold text-gray-600">{addressInfo.notes || "-"}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informasi Customer */}
            <div className="flex flex-col space-y-3">
              <h3 className="font-semibold text-lg text-gray-700">Customer</h3>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Nama:</span>
                <span className="font-semibold text-gray-600">{userId?.userName || "Tidak ditemukan"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Email:</span>
                <span className="font-semibold text-gray-600">{userId?.email || "-"}</span>
              </div>
            </div>

            {/* Informasi Seller */}
            <div className="flex flex-col space-y-3">
              <h3 className="font-semibold text-lg text-gray-700">Seller</h3>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Nama Toko:</span>
                <span className="font-semibold text-gray-600">{sellerId?.storeName || "Tidak diketahui"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Email:</span>
                <span className="font-semibold text-gray-600">{sellerId?.email || "-"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Detail Produk yang Dibeli */}
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="p-6 border-b">
          <CardTitle className="text-xl font-bold text-gray-800">Produk yang Dibeli</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow className="hover:bg-gray-100">
                <TableHead className="font-bold text-gray-700">Nama Produk</TableHead>
                <TableHead className="font-bold text-gray-700">Jumlah</TableHead>
                <TableHead className="font-bold text-gray-700">Harga Satuan</TableHead>
                <TableHead className="font-bold text-gray-700">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="p-4 border-b font-medium text-gray-800">{item.title}</TableCell>
                  <TableCell className="p-4 border-b text-gray-600">{item.quantity}</TableCell>
                  <TableCell className="p-4 border-b text-gray-600">Rp {parseInt(item.price).toLocaleString("id-ID")}</TableCell>
                  <TableCell className="p-4 border-b font-semibold text-gray-800">
                    Rp {(parseInt(item.price) * item.quantity).toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default TransactionDetailPage;
