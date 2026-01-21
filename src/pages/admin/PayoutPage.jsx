import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUnpaidSellers,
  fetchUnpaidOrdersBySeller,
} from "@/store/admin/payout-slice";
import { Link } from "react-router-dom";
import PayoutModal from "@/components/admin/payoutModal";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

import {
  ArrowRight,
  Loader2,
  History,
  Banknote,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

const PayoutPage = () => {
  const dispatch = useDispatch();
  const { unpaidSellers = [], loading, error } = useSelector(
    (state) => state.payout
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [unpaidOrders, setUnpaidOrders] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchUnpaidSellers()).finally(() =>
      setIsLoading(false)
    );
  }, [dispatch]);

  const handleProcessClick = async (sellerId, sellerName) => {
    setIsLoading(true);
    const result = await dispatch(
      fetchUnpaidOrdersBySeller(sellerId)
    );

    if (result.meta.requestStatus === "fulfilled") {
      setUnpaidOrders(result.payload.orders);
      setSelectedSeller({ sellerId, sellerName });
      setIsModalOpen(true);
    }
    setIsLoading(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSeller(null);
    setUnpaidOrders([]);
    dispatch(fetchUnpaidSellers());
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          Payout Seller
        </h1>

        <Link to="/admin/payout/history">
          <Button variant="outline" className="w-full sm:w-auto">
            <History className="mr-2 h-4 w-4" />
            Riwayat Pembayaran
          </Button>
        </Link>
      </div>

      {/* ================= CONTENT ================= */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <Card className="border-0 shadow-md rounded-xl overflow-hidden">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg">
              Seller Menunggu Pembayaran
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {unpaidSellers.length === 0 ? (
              /* EMPTY STATE */
              <div className="text-center p-12">
                <Banknote className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">
                  Semua Pembayaran Selesai!
                </h3>
                <p className="text-muted-foreground mt-2">
                  Tidak ada seller yang memiliki pesanan
                  belum dibayar saat ini.
                </p>
              </div>
            ) : (
              <>
                {/* ========== DESKTOP TABLE ========== */}
                <div className="hidden md:block">
                  <Table>
                    <TableBody>
                      {unpaidSellers.map((seller) => (
                        <TableRow
                          key={seller.sellerId}
                          className="hover:bg-slate-50 transition"
                        >
                          <TableCell className="w-1/2">
                            <div className="font-medium">
                              {seller.sellerName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID Seller: {seller.sellerId}
                            </div>
                          </TableCell>

                          <TableCell className="text-right w-1/4">
                            <div className="font-bold">
                              {formatRupiah(
                                seller.totalAmount
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {seller.totalUnpaidOrders} pesanan
                            </div>
                          </TableCell>

                          <TableCell className="text-right w-1/4">
                            <Button
                              onClick={() =>
                                handleProcessClick(
                                  seller.sellerId,
                                  seller.sellerName
                                )
                              }
                              disabled={isLoading}
                            >
                              Proses
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* ========== MOBILE CARD ========== */}
                <div className="md:hidden space-y-4 p-4">
                  {unpaidSellers.map((seller) => (
                    <Card
                      key={seller.sellerId}
                      className="border shadow-sm rounded-xl"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-base">
                            {seller.sellerName}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            ID Seller: {seller.sellerId}
                          </p>
                        </div>

                        <div>
                          <p className="font-bold">
                            {formatRupiah(
                              seller.totalAmount
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {seller.totalUnpaidOrders} pesanan
                          </p>
                        </div>

                        <Button
                          className="w-full"
                          disabled={isLoading}
                          onClick={() =>
                            handleProcessClick(
                              seller.sellerId,
                              seller.sellerName
                            )
                          }
                        >
                          Proses Pembayaran
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ================= MODAL ================= */}
      {isModalOpen && selectedSeller && (
        <PayoutModal
          sellerId={selectedSeller.sellerId}
          sellerName={selectedSeller.sellerName}
          orders={unpaidOrders}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default PayoutPage;
