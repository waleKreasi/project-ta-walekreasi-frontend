import React, { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { markPaidToSeller, fetchUnpaidSellers } from "@/store/admin/payout-slice";
import { Loader2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Komponen modal untuk admin mencatat pembayaran kepada seller.
 * @param {object} props
 * @param {string} props.sellerId - ID seller yang akan dibayar.
 * @param {Array<object>} props.orders - Daftar pesanan yang belum dibayar untuk seller tersebut.
 * @param {string} props.sellerName - Nama toko seller.
 * @param {boolean} props.isOpen - Status modal terbuka atau tertutup.
 * @param {function} props.onClose - Fungsi untuk menutup modal.
 */
const PayoutModal = ({ sellerId, orders, sellerName, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayTotal, setDisplayTotal] = useState(0);

  // Menghitung total jumlah pembayaran dari pesanan yang dipilih
  const calculatedTotal = useMemo(() => {
    return selectedOrderIds.reduce((total, id) => {
      const order = orders.find(o => o._id === id);
      return total + (order?.totalAmount || 0);
    }, 0);
  }, [selectedOrderIds, orders]);

  // Mengatur state awal saat modal pertama kali terbuka
  useEffect(() => {
    if (orders && orders.length > 0) {
      const initialSelectedIds = orders.map(o => o._id);
      setSelectedOrderIds(initialSelectedIds);
      const initialTotal = initialSelectedIds.reduce((total, id) => {
        const order = orders.find(o => o._id === id);
        return total + (order?.totalAmount || 0);
      }, 0);
      setDisplayTotal(initialTotal);
    } else {
      setSelectedOrderIds([]);
      setDisplayTotal(0);
    }
  }, [orders]);

  // Memperbarui total yang ditampilkan setiap kali pesanan yang dipilih berubah
  useEffect(() => {
    setDisplayTotal(calculatedTotal);
  }, [calculatedTotal]);

  /**
   * Fungsi untuk menangani pengiriman form.
   * Mengirim data pembayaran, termasuk file bukti transfer.
   */
  const onSubmit = async () => {
    // Validasi input
    if (selectedOrderIds.length === 0) {
      toast({
        title: "Pembayaran Gagal",
        description: "Harap pilih setidaknya satu pesanan.",
        variant: "destructive",
      });
      return;
    }

    if (!paymentProofFile) {
      toast({
        title: "Pembayaran Gagal",
        description: "Harap unggah bukti pembayaran.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Menggunakan FormData untuk mengirim file dan data JSON
      const formData = new FormData();
      formData.append("sellerId", sellerId);
      // Mengirimkan array ID pesanan sebagai string JSON
      // Ini sesuai dengan perbaikan yang kita lakukan di backend
      formData.append("orders", JSON.stringify(selectedOrderIds));
      formData.append("paymentProof", paymentProofFile);

      const result = await dispatch(markPaidToSeller(formData));

      if (result.meta.requestStatus === "fulfilled") {
        toast({
          title: "Pembayaran Berhasil",
          description: `Pembayaran untuk ${sellerName} berhasil dicatat.`,
        });
        onClose();
        setSelectedOrderIds([]);
        setPaymentProofFile(null);
        dispatch(fetchUnpaidSellers());
      } else {
        toast({
          title: "Pembayaran Gagal",
          description: result.payload || "Terjadi kesalahan saat memproses pembayaran.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Kesalahan saat mengunggah bukti pembayaran:", error);
      toast({
        title: "Pembayaran Gagal",
        description: "Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Fungsi untuk menangani pemilihan/pembatalan pesanan.
   * @param {string} orderId - ID pesanan yang dipilih.
   */
  const handleOrderSelection = (orderId) => {
    setSelectedOrderIds(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Pembayaran ke {sellerName}</DialogTitle>
          <DialogDescription className="text-sm">
            Pilih pesanan yang akan dibayar dan unggah bukti transfer.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Pesanan</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-4 bg-gray-50">
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 border rounded-md bg-white shadow-sm">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={order._id}
                        checked={selectedOrderIds.includes(order._id)}
                        onCheckedChange={() => handleOrderSelection(order._id)}
                      />
                      <label htmlFor={order._id} className="text-sm font-medium text-gray-700 cursor-pointer">
                        ID: <span className="font-mono text-xs text-gray-500">{order._id}</span>
                      </label>
                    </div>
                    <span className="text-base font-bold text-green-600">
                      {formatRupiah(order.totalAmount || 0)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Tidak ada pesanan yang belum dibayar.</p>
              )}
            </div>
            {orders && orders.length > 0 && (
                <div className="flex justify-between items-center pt-2 font-bold text-lg border-t mt-4">
                    <span>Total Bayar:</span>
                    <span className="text-2xl text-red-600">{formatRupiah(displayTotal)}</span>
                </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Bukti Pembayaran</h3>
            {/* Menampilkan preview gambar yang diunggah */}
            {paymentProofFile && (
                <div className="flex justify-center mb-4">
                    <img
                        src={URL.createObjectURL(paymentProofFile)}
                        alt="Bukti Pembayaran"
                        className="max-w-full max-h-64 object-contain rounded-lg shadow-md"
                    />
                </div>
            )}
            <Input
              id="payment-proof-input"
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={(e) => setPaymentProofFile(e.target.files[0])}
            />
            <Button
              onClick={onSubmit}
              disabled={isSubmitting || selectedOrderIds.length === 0 || !paymentProofFile}
              className="w-full mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Catat Pembayaran"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayoutModal;
