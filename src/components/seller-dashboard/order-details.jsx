import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  MapPin,
  Phone,
  NotepadText,
  UserRound,
  PhoneCall,
  MessageSquare,
} from "lucide-react";
import CommonForm from "../common/form";
import {
  updateOrderStatus,
  getAllOrdersForSeller,
  getOrderDetailsForSeller,
} from "@/store/seller/order-slice";
import {
  orderStatusLabels,
  orderStatusColors,
} from "@/config/index";

const initialFormData = {
  status: "",
};

function SellerOrderDetailsView({ orderDetails, scrollToReview = false, onClose }) {
  const dispatch = useDispatch();
  const item = orderDetails?.cartItems?.[0];
  const [formData, setFormData] = useState(initialFormData);
  const reviewRef = useRef(null);

  useEffect(() => {
    if (scrollToReview && reviewRef.current) {
      reviewRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollToReview]);

  
  const handleUpdateStatus = async () => {
    try {
      const result = await dispatch(
        updateOrderStatus({ id: orderDetails._id, orderStatus: formData.status })
      ).unwrap();
  
      console.log("Status update result:", result);
  
      // Jika response mengandung 'success: true' maka tampilkan toast berhasil
      if (result?.success) {
        toast({
          title: "Status berhasil diperbarui",
        });
      } else {
        // Tetap tampilkan toast berhasil jika message-nya cocok
        if (result?.message?.toLowerCase().includes("berhasil")) {
          toast({
            title: "Status berhasil diperbarui",
          });
        } else {
          toast({
            title: "Gagal memperbarui status",
            description: result?.message || "Terjadi kesalahan",
            variant: "destructive",
          });
        }
      }
  
      // Refresh data setelah toast berhasil
      await Promise.all([
        dispatch(getOrderDetailsForSeller(orderDetails._id)),
        dispatch(getAllOrdersForSeller()),
      ]);
  
      setFormData(initialFormData);
      if (onClose) onClose();
    } catch (error) {
      console.error("Update status error (catch):", error);
      toast({
        title: "Gagal memperbarui status",
        description: error?.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };
  

  // ✅ Siapkan opsi dropdown status dari config
  const orderStatusOptions = Object.entries(orderStatusLabels).map(([id, label]) => ({
    id,
    label,
  }));

  const currentLabel = orderStatusLabels[orderDetails?.orderStatus] || orderDetails?.orderStatus;
  const badgeColor = orderStatusColors[currentLabel] || "bg-black";

  return (
    <DialogContent className="max-w-full md:max-w-screen-md max-h-lvh md:max-h-[80vh] overflow-y-auto">
      <div className="grid gap-6">
        <h2 className="text-xl font-bold text-gray-800 text-center sm:text-left">
          Detail Pesanan
        </h2>

        {/* Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col p-3 border rounded-md bg-white">
            <span className="font-medium text-gray-700 mb-1">Status Pembayaran</span>
            <span className="text-gray-600">{orderDetails?.paymentStatus}</span>
          </div>
          <div className="flex flex-col p-3 border rounded-md bg-white">
            <span className="font-medium text-gray-700 mb-1">Status Pesanan Saat Ini</span>
            <Badge className={`w-fit py-1 px-3 text-white ${badgeColor}`}>
              {currentLabel}
            </Badge>
          </div>
        </div>

        {/* Form Update Status */}
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-2">Perbarui Status Pesanan</h3>
          <CommonForm
            formControls={[
              {
                label: "Pilih Status",
                name: "status",
                componentType: "select",
                options: orderStatusOptions,
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Perbarui Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>

        {/* Informasi Produk */}
        <div className="flex flex-col sm:flex-row gap-6 items-start border rounded-lg p-4 bg-white">
          <img
            src={item?.image}
            alt={item?.title}
            className="w-full sm:w-48 sm:h-48 object-cover rounded-md border"
            onError={(e) => (e.target.src = "/default-placeholder.png")}
          />
          <div className="flex flex-col gap-3 text-sm w-full">
            <div className="flex items-center justify-between">
              <span className="font-light">Kode Pesanan</span>
              <Label className="font-medium break-all text-right">{orderDetails?._id}</Label>
            </div>
            <div className="flex flex-col">
              <span className="font-light">Nama Produk</span>
              <span className="font-medium">{item?.title}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-light">Jumlah</span>
              <span className="font-medium">{item?.quantity}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-light">Total Harga</span>
              <span className="font-semibold text-gray-800">
                Rp.{Number(orderDetails?.totalAmount).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Informasi Customer & Pengiriman */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Informasi Customer */}
          <div className="border p-4 rounded-md bg-white shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <UserRound className="w-5 h-5 text-primary" />
              Informasi Customer
            </h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="flex items-center gap-2">
                <UserRound className="w-4 h-4 text-gray-500" />
                {orderDetails?.userId?.userName || "Nama tidak tersedia"}
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-gray-500" />
                {orderDetails?.userId?.phoneNumber || "-"}
              </p>
              <a
                href={`https://wa.me/${orderDetails?.userId?.phoneNumber?.replace(/^0/, "62")}?text=${encodeURIComponent(
                  `Halo ${orderDetails?.userId?.userName}, saya ingin mengonfirmasi pesanan Anda dengan kode ${orderDetails?._id}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 p-3 bg-green-600 text-white text-xs font-medium rounded-full hover:bg-green-700 transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
                Chat Customer
              </a>
            </div>
          </div>

          {/* Informasi Pengiriman */}
          <div className="border p-4 rounded-md bg-white shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Informasi Pengiriman
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="flex items-center gap-2">
                <UserRound className="w-4 h-4 text-gray-500" />
                <span>{orderDetails?.addressInfo?.receiverName}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                <span>{orderDetails?.addressInfo?.address}</span>
              </p>
              <p className="ml-6">{orderDetails?.addressInfo?.city}</p>
              <p className="ml-6">Kode Pos: {orderDetails?.addressInfo?.pincode}</p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                {orderDetails?.addressInfo?.phone}
              </p>
              {orderDetails?.addressInfo?.notes && (
                <p className="flex items-center gap-2">
                  <NotepadText className="w-4 h-4 text-gray-500" />
                  <span>Catatan: {orderDetails.addressInfo.notes}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default SellerOrderDetailsView;
