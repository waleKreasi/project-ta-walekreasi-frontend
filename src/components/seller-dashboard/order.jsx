import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import SellerOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForSeller,
  getOrderDetailsForSeller,
  resetOrderDetails,
} from "../../store/seller/order-slice";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { orderStatusLabels, orderStatusColors } from "../../config/index";
import { ReceiptText, Eye } from "lucide-react";
import { useToast } from "../ui/use-toast";

function SellerOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { orderList, orderDetails, isLoading, error } = useSelector(
    (state) => state.sellerOrder
  );

  const dispatch = useDispatch();
  const { toast } = useToast();

  // ✅ Load pesanan seller (tidak perlu kirim sellerId karena backend ambil dari cookie JWT)
  useEffect(() => {
    dispatch(getAllOrdersForSeller());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  // ⚡ Show error toast hanya sekali saat error berubah
  useEffect(() => {
    if (error) {
      toast({
        title: "Gagal memuat pesanan.",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  function handleFetchOrderDetails(orderId) {
    dispatch(getOrderDetailsForSeller(orderId));
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const closeDetailsDialog = () => {
    setOpenDetailsDialog(false);
    dispatch(resetOrderDetails());
  };

  if (isLoading) {
    return <p className="text-center py-8">Memuat pesanan...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex gap-2 px-4 items-center font-bold font-primary border-b-2 py-2">
          <ReceiptText className="w-7 h-7" />
          <span>Daftar Pesanan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-2">
        <div className="overflow-x-auto lg:overflow-visible">
          <Table>
            <TableHeader className="hidden lg:table-header-group">
              <TableRow>
                <TableHead className="w-[120px]">Kode Pesanan</TableHead>
                <TableHead className="w-[150px]">Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList?.length > 0 ? (
                orderList
                  .slice()
                  .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                  .map((orderItem) => {
                    const statusLabel =
                      orderStatusLabels[orderItem.orderStatus] ??
                      orderItem.orderStatus;
                    const statusColor =
                      orderStatusColors[statusLabel] || "bg-gray-500";

                    return (
                      <TableRow
                        key={orderItem._id}
                        className="lg:hover:bg-gray-50 cursor-pointer flex flex-col lg:table-row border-b-2 lg:border-b last:border-b-0 py-4 lg:py-0 transition-all duration-200"
                      >
                        {/* Mobile */}
                        <div className="lg:hidden w-full px-4 py-3 border-b last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-base text-gray-800 block">
                                {orderItem._id.slice(0, 8).toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-500">
                                {format(
                                  new Date(orderItem.orderDate),
                                  "dd MMMM yyyy",
                                  { locale: id }
                                )}
                              </span>
                            </div>
                            <Badge
                              className={`px-3 py-1 ${statusColor} text-white font-medium text-sm`}
                            >
                              {statusLabel}
                            </Badge>
                          </div>

                          <div className="mt-2 flex justify-end p-2">
                            <span className="font-semibold text-lg text-gray-900">
                              {formatCurrency(orderItem.totalAmount)}
                            </span>
                          </div>

                          <Button
                            variant="outline"
                            onClick={() =>
                              handleFetchOrderDetails(orderItem._id)
                            }
                            className="mt-3 w-full flex justify-center items-center gap-2"
                          >
                            <Eye className="h-3 w-3 mr-2" />
                            Lihat Detail
                          </Button>
                        </div>

                        {/* Desktop */}
                        <TableCell className="hidden lg:table-cell">
                          <span className="font-mono text-sm font-semibold">
                            {orderItem._id.slice(0, 8).toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-gray-600">
                          {format(
                            new Date(orderItem.orderDate),
                            "dd MMMM yyyy",
                            { locale: id }
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            className={`w-fit px-3 py-1 ${statusColor} text-white font-medium`}
                          >
                            {statusLabel}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-right font-semibold text-gray-800">
                          {formatCurrency(orderItem.totalAmount)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleFetchOrderDetails(orderItem._id)
                            }
                            className="group"
                          >
                            <Eye className="h-3 w-3 mr-2" />
                            Lihat Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-4 text-gray-500"
                  >
                    Belum ada pesanan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Detail Dialog */}
      <Dialog open={openDetailsDialog} onOpenChange={closeDetailsDialog}>
        <DialogContent className="max-w-4xl p-0">
          <SellerOrderDetailsView orderDetails={orderDetails} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default SellerOrdersView;
