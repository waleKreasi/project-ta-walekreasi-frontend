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
    {/* ===== MOBILE VIEW ===== */}
    <div className="md:hidden space-y-4 p-4">
      {transactions?.length > 0 ? (
        transactions.map((trx) => (
          <Card key={trx._id} className="rounded-lg border">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground">ID Order</p>
                  <p className="font-mono text-xs">{trx._id}</p>
                </div>
                {getStatusBadge(trx.orderStatus)}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Tanggal</p>
                  <p className="font-medium">
                    {format(new Date(trx.orderDate), "dd/MM/yyyy")}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Toko</p>
                  <p className="font-medium">
                    {trx.sellerId?.storeName || "-"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Customer</p>
                <p className="font-medium">
                  {trx.userId?.userName || "-"}
                </p>
              </div>

              <Button
                onClick={() => navigate(`/admin/transactions/${trx._id}`)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                Lihat Detail
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted-foreground py-10">
          Belum ada transaksi.
        </p>
      )}
    </div>

    {/* ===== DESKTOP TABLE ===== */}
    <div className="hidden md:block overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>ID Order</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Toko</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions?.length > 0 ? (
            transactions.map((trx) => (
              <TableRow key={trx._id} className="hover:bg-gray-50">
                <TableCell className="font-mono text-xs">
                  {trx._id}
                </TableCell>
                <TableCell>
                  {format(new Date(trx.orderDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  {trx.sellerId?.storeName || "-"}
                </TableCell>
                <TableCell>
                  {trx.userId?.userName || "-"}
                </TableCell>
                <TableCell>
                  {getStatusBadge(trx.orderStatus)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    onClick={() =>
                      navigate(`/admin/transactions/${trx._id}`)
                    }
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-12 text-muted-foreground"
              >
                Belum ada transaksi.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
          </CardContent>

      </Card>
    </div>
  );
}

export default TransactionsPage;
