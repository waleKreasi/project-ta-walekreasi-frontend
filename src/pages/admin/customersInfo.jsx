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

import { Loader2, Users, Mail, Calendar } from "lucide-react";

function CustomersInfoPage() {
  const dispatch = useDispatch();
  const { customers, isLoading, error } = useSelector(
    (state) => state.customersInfo
  );

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Card className="shadow-md border-0 rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 bg-slate-50 border-b">
          <Users className="h-6 w-6 text-slate-700" />
          <CardTitle className="text-xl md:text-2xl font-bold">
            Daftar Customer
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {error ? (
            <p className="text-red-500 text-center p-6">
              Terjadi kesalahan: {error}
            </p>
          ) : (
            <>
              {/* ================= DESKTOP TABLE ================= */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader className="bg-slate-100">
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tanggal Daftar</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {customers?.length ? (
                      customers.map((user) => (
                        <TableRow
                          key={user._id}
                          className="hover:bg-slate-50 transition"
                        >
                          <TableCell className="font-medium">
                            {user.userName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {format(
                              new Date(user.createdAt),
                              "dd/MM/yyyy"
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-10 text-muted-foreground"
                        >
                          Belum ada customer terdaftar.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* ================= MOBILE CARD ================= */}
              <div className="md:hidden space-y-4 p-4">
                {customers?.length ? (
                  customers.map((user) => (
                    <Card
                      key={user._id}
                      className="border shadow-sm rounded-xl"
                    >
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-semibold text-base">
                          {user.userName}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(
                            new Date(user.createdAt),
                            "dd/MM/yyyy"
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-10">
                    Belum ada customer terdaftar.
                  </p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CustomersInfoPage;
