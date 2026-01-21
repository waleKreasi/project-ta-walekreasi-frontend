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
import { Store, Eye, Loader2, Phone, Calendar } from "lucide-react";

function SellersInfoPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { sellers, isLoading, error } = useSelector(
    (state) => state.sellersInfo
  );

  useEffect(() => {
    dispatch(fetchAllSellers());
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
          <Store className="h-6 w-6 text-slate-700" />
          <CardTitle className="text-xl md:text-2xl font-bold">
            Daftar Seller
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
                      <TableHead>Nama Toko</TableHead>
                      <TableHead>Telepon</TableHead>
                      <TableHead>Tanggal Bergabung</TableHead>
                      <TableHead className="text-center">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {sellers?.length ? (
                      sellers.map((seller) => (
                        <TableRow
                          key={seller._id}
                          className="hover:bg-slate-50 transition"
                        >
                          <TableCell className="font-medium">
                            {seller.storeName}
                          </TableCell>
                          <TableCell>
                            {seller.phoneNumber || "-"}
                          </TableCell>
                          <TableCell>
                            {format(
                              new Date(seller.createdAt),
                              "dd/MM/yyyy"
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                navigate(
                                  `/admin/seller/${seller._id}`
                                )
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-10 text-muted-foreground"
                        >
                          Belum ada seller terdaftar.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* ================= MOBILE CARD ================= */}
              <div className="md:hidden space-y-4 p-4">
                {sellers?.length ? (
                  sellers.map((seller) => (
                    <Card
                      key={seller._id}
                      className="border shadow-sm rounded-xl"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-base">
                            {seller.storeName}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {seller.phoneNumber || "-"}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(
                            new Date(seller.createdAt),
                            "dd/MM/yyyy"
                          )}
                        </div>

                        <Button
                          size="sm"
                          className="w-full mt-2"
                          onClick={() =>
                            navigate(`/admin/seller/${seller._id}`)
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat Profil
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-10">
                    Belum ada seller terdaftar.
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

export default SellersInfoPage;
