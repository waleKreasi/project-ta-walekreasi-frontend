import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSellers } from "@/store/admin/sellers-slice";
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
import { Store, Eye, Loader2 } from "lucide-react";

function SellersInfoPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { sellers, isLoading, error } = useSelector((state) => state.sellersInfo);

  useEffect(() => {
    dispatch(fetchAllSellers());
  }, [dispatch]);
  
  // Tampilan saat loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 bg-gray-50 border-b">
          <div className="flex items-center space-x-3">
            <Store className="h-6 w-6 text-gray-700" />
            <CardTitle className="text-2xl font-bold text-gray-800">Manajemen Seller</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <p className="text-red-500 text-center p-6">Terjadi kesalahan: {error}</p>
          ) : (
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow className="hover:bg-gray-100">
                  <TableHead className="font-bold text-gray-700">Nama Toko</TableHead>
                  <TableHead className="font-bold text-gray-700">Email</TableHead>
                  <TableHead className="font-bold text-gray-700">Status</TableHead>
                  <TableHead className="font-bold text-gray-700">Tanggal Bergabung</TableHead>
                  <TableHead className="font-bold text-gray-700 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellers?.length > 0 ? (
                  sellers.map((seller) => (
                    <TableRow key={seller._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="p-4 border-b font-medium text-gray-600">{seller.storeName}</TableCell>
                      <TableCell className="p-4 border-b font-semibold text-gray-800">{seller.email}</TableCell>
                      <TableCell className="p-4 border-b">
                        <Badge variant="outline" className="text-sm font-semibold text-green-600 border-green-600">Aktif</Badge>
                      </TableCell>
                      <TableCell className="p-4 border-b text-gray-600">
                        {format(new Date(seller.createdAt), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="p-4 border-b text-center">
                        <Button
                          onClick={() => navigate(`/admin/seller/${seller._id}`)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Eye className="h-3 w-3 mr-2" />
                          Lihat Profil
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      Belum ada seller terdaftar.
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

export default SellersInfoPage;
