import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUnpaidOrdersBySeller,
  markPaidToSeller,
} from "@/store/admin/payout-slice";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, ArrowLeft, Check, UploadCloud } from "lucide-react";
import { toast } from "react-hot-toast";

const UnpaidOrdersPage = () => {
  const { sellerId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { unpaidOrders, sellerName, loading, error } = useSelector(
    (state) => state.payout
  );

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [paymentProofFile, setPaymentProofFile] = useState(null); // State baru untuk file

  useEffect(() => {
    if (sellerId) {
      dispatch(fetchUnpaidOrdersBySeller(sellerId));
    }
  }, [dispatch, sellerId]);

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  const handleMarkPaid = async () => {
    if (selectedOrders.length === 0) {
      return toast.error("Pilih setidaknya satu pesanan.");
    }
    if (!paymentProofFile) {
        return toast.error("Bukti pembayaran harus diunggah.");
    }

    setIsMarkingPaid(true);

    const formData = new FormData();
    formData.append("sellerId", sellerId);
    formData.append("orderIds", JSON.stringify(selectedOrders)); // Kirim array sebagai string JSON
    formData.append("paymentProof", paymentProofFile); // Tambahkan file ke FormData

    try {
      const resultAction = await dispatch(markPaidToSeller(formData));
      if (markPaidToSeller.fulfilled.match(resultAction)) {
        toast.success("Pembayaran berhasil ditandai!");
        setSelectedOrders([]); // Reset seleksi
        setPaymentProofFile(null); // Reset file
        dispatch(fetchUnpaidOrdersBySeller(sellerId)); // Muat ulang data
      } else {
        toast.error(resultAction.payload || "Gagal menandai pembayaran.");
      }
    } finally {
      setIsMarkingPaid(false);
    }
  };
  
  const handleFileChange = (e) => {
    setPaymentProofFile(e.target.files[0]);
  };

  const calculateTotalAmount = () => {
    return unpaidOrders
      .filter((order) => selectedOrders.includes(order._id))
      .reduce((sum, order) => sum + order.totalAmount, 0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pesanan Belum Dibayar</h1>
        <Button onClick={() => navigate("/admin/payout")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>

      {loading && !isMarkingPaid ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">Terjadi kesalahan: {error}</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Pesanan dari {sellerName}</CardTitle>
            <CardDescription>
              Pilih pesanan yang ingin Anda tandai sebagai sudah dibayar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {unpaidOrders.length === 0 ? (
              <div className="text-center p-12">
                <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Semua Pesanan Sudah Dibayar</h3>
                <p className="text-muted-foreground mt-2">
                  Tidak ada pesanan yang perlu dibayar untuk seller ini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Pilih</TableHead>
                        <TableHead>ID Pesanan</TableHead>
                        <TableHead>Tanggal Pesanan</TableHead>
                        <TableHead className="text-right">Total Jumlah</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unpaidOrders.map((order) => (
                        <TableRow
                          key={order._id}
                          className={
                            selectedOrders.includes(order._id) ? "bg-muted" : ""
                          }
                          onClick={() => toggleOrderSelection(order._id)}
                        >
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order._id)}
                              onChange={() => {}}
                              className="form-checkbox h-4 w-4 text-primary rounded"
                            />
                          </TableCell>
                          <TableCell>{order._id}</TableCell>
                          <TableCell>
                            {new Date(order.orderDate).toLocaleDateString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatRupiah(order.totalAmount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Bagian untuk mengunggah bukti pembayaran */}
                <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <UploadCloud className="w-5 h-5 mr-2 text-primary" />
                        Unggah Bukti Pembayaran
                    </h3>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange} 
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    {paymentProofFile && (
                        <p className="mt-2 text-sm text-muted-foreground">
                            File yang dipilih: {paymentProofFile.name}
                        </p>
                    )}
                </div>

                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-md">
                  <p className="font-bold text-lg">
                    Total: {formatRupiah(calculateTotalAmount())}
                  </p>
                  <Button
                    onClick={handleMarkPaid}
                    disabled={selectedOrders.length === 0 || isMarkingPaid}
                  >
                    {isMarkingPaid && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Tandai Dibayar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnpaidOrdersPage;
