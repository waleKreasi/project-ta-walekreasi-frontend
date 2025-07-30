import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
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
} from "@/store/seller/order-slice";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// ✅ Import konfigurasi label & warna status
import {
  orderStatusLabels,
  orderStatusColors,
} from "@/config/index";

function SellerOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.sellerOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersForSeller());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  function handleFetchOrderDetails(orderId) {
    dispatch(getOrderDetailsForSeller(orderId));
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Pesanan</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="sr-only">Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList?.length > 0 ? (
              [...orderList]
                .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                .map((orderItem) => {
                  const statusLabel = orderStatusLabels[orderItem.orderStatus] ?? orderItem.orderStatus;
                  const statusColor = orderStatusColors[statusLabel] || "bg-black";

                  return (
                    <TableRow key={orderItem._id}>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {orderItem._id.slice(0, 8)}...
                        </span>
                      </TableCell>
                      <TableCell>
                        {format(new Date(orderItem.orderDate), "dd MMMM yyyy", {
                          locale: id,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={`w-fit px-3 py-1 text-white ${statusColor}`}>
                          {statusLabel}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(orderItem.totalAmount)}</TableCell>
                      <TableCell>
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            variant="outline"
                            onClick={() => handleFetchOrderDetails(orderItem._id)}
                            className="text-sm rounded-full"
                          >
                            Lihat Detail
                          </Button>
                          <SellerOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Belum ada pesanan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default SellerOrdersView;