import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnpaidSellers, fetchUnpaidOrdersBySeller } from "@/store/admin/payout-slice";
import { Link } from "react-router-dom";
import PayoutModal from "@/components/admin/payoutModal"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowRight, Loader2, History, Banknote } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

const PayoutPage = () => {
  const dispatch = useDispatch();
  const { unpaidSellers = [], loading, error } = useSelector((state) => state.payout);

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [unpaidOrders, setUnpaidOrders] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchUnpaidSellers()).finally(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  const handleProcessClick = async (sellerId, sellerName) => {
    // Menampilkan loading state dan mengambil detail pesanan
    setIsLoading(true);
    const result = await dispatch(fetchUnpaidOrdersBySeller(sellerId));
    
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
    // Memuat ulang daftar seller setelah modal ditutup
    dispatch(fetchUnpaidSellers());
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Seller Menunggu Pembayaran</h1>
        <Link to="/admin/payout/history">
          <Button variant="outline">
            <History className="mr-2 h-4 w-4" />
            Riwayat Pembayaran
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <Card>
          <CardContent>
            {unpaidSellers.length === 0 ? (
              <div className="text-center p-12">
                <Banknote className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Semua Pembayaran Selesai!</h3>
                <p className="text-muted-foreground mt-2">
                  Tidak ada seller yang memiliki pesanan belum dibayar saat ini.
                </p>
              </div>
            ) : (
              <Table>
                <TableBody>
                  {unpaidSellers.map((seller) => (
                    <TableRow key={seller.sellerId}>
                      <TableCell className="w-1/2">
                        <div className="font-medium">{seller.sellerName}</div>
                        <div className="text-sm text-muted-foreground">
                          ID Seller: {seller.sellerId}
                        </div>
                      </TableCell>
                      <TableCell className="text-right w-1/4">
                        <div className="font-bold">
                          {formatRupiah(seller.totalAmount)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {seller.totalUnpaidOrders} pesanan
                        </div>
                      </TableCell>
                      <TableCell className="text-right w-1/4">
                        <Button
                          onClick={() => handleProcessClick(seller.sellerId, seller.sellerName)}
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
            )}
          </CardContent>
        </Card>
      )}

      {/* Render modal hanya jika isModalOpen bernilai true */}
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
