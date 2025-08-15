import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTransactions } from "@/store/admin/trasactions-slice";
import { useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ReceiptText,Eye } from "lucide-react";

function TransactionsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { transactions, isLoading, error } = useSelector(
    (state) => state.transactionsInfo
  );

  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  // Tampilan saat loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Helper function to determine badge variant based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-sm">{status}</Badge>;
      case "Pending":
        return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-sm">{status}</Badge>;
      case "Cancelled":
        return <Badge variant="default" className="bg-red-500 hover:bg-red-600 text-sm">{status}</Badge>;
      default:
        return <Badge variant="outline" className="text-sm">{status}</Badge>;
    }
  };

  return (
    <div className="p-4">
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center space-x-3 p-6 bg-gray-50 border-b">
          <ReceiptText className="h-6 w-6 text-gray-700" />
          <CardTitle className="text-2xl font-bold text-gray-800">Manajemen Transaksi</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <p className="text-red-500 text-center p-6">Terjadi kesalahan: {error}</p>
          ) : (
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow className="hover:bg-gray-100">
                  <TableHead className="font-bold text-gray-700">ID Order</TableHead>
                  <TableHead className="font-bold text-gray-700">Tanggal</TableHead>
                  <TableHead className="font-bold text-gray-700">Toko</TableHead>
                  <TableHead className="font-bold text-gray-700">Customer</TableHead>
                  <TableHead className="font-bold text-gray-700">Status</TableHead>
                  <TableHead className="font-bold text-gray-700 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.length > 0 ? (
                  transactions.map((trx) => (
                    <TableRow key={trx._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="p-4 border-b font-semibold text-gray-800">{trx._id}</TableCell>
                      <TableCell className="p-4 border-b text-gray-600">
                        {format(new Date(trx.orderDate), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="p-4 border-b text-gray-600">{trx.sellerId?.storeName || "-"}</TableCell>
                      <TableCell className="p-4 border-b text-gray-600">{trx.userId?.userName || "-"}</TableCell>
                      <TableCell className="p-4 border-b">
                        {getStatusBadge(trx.orderStatus)}
                      </TableCell>
                      <TableCell className="p-4 border-b text-center">
                        <Button
                          onClick={() => navigate(`/admin/transactions/${trx._id}`)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Eye className="h-3 w-3 mr-2" />
                          Lihat Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                      Belum ada transaksi.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TransactionsPage;
