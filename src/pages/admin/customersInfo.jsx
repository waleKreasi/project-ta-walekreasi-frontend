import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers } from "@/store/admin/customers-slice";
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
import { Loader2, Users } from "lucide-react";

function CustomersInfoPage() {
  const dispatch = useDispatch();
  const { customers, isLoading, error } = useSelector((state) => state.customersInfo);

  useEffect(() => {
    dispatch(fetchAllCustomers());
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
        <CardHeader className="flex flex-row items-center space-x-3 p-6 bg-gray-50 border-b">
          <Users className="h-6 w-6 text-gray-700" />
          <CardTitle className="text-2xl font-bold text-gray-800">Manajemen Customer</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <p className="text-red-500 text-center p-6">Terjadi kesalahan: {error}</p>
          ) : (
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow className="hover:bg-gray-100">
                  <TableHead className="font-bold text-gray-700">Nama</TableHead>
                  <TableHead className="font-bold text-gray-700">Email</TableHead>
                  <TableHead className="font-bold text-gray-700">Tanggal Daftar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers?.length > 0 ? (
                  customers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="p-4 border-b font-medium text-gray-600">{user.userName}</TableCell>
                      <TableCell className="p-4 border-b font-semibold text-gray-800">{user.email}</TableCell>
                      <TableCell className="p-4 border-b text-gray-600">
                        {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-gray-500">
                      Belum ada customer terdaftar.
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

export default CustomersInfoPage;
