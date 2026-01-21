import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSellerById } from "@/store/admin/sellers-slice";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building,
  Banknote,
  CreditCard,
  Calendar,
  User,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function SellerDetailPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { selectedSeller, isLoading, error } = useSelector(
    (state) => state.sellersInfo
  );

  useEffect(() => {
    dispatch(fetchSellerById(id));
  }, [dispatch, id]);

  /* =======================
      STATE HANDLING
  ======================== */
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Memuat profil seller...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Terjadi kesalahan: {error}
      </div>
    );
  }

  if (!selectedSeller) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Data seller tidak ditemukan.
      </div>
    );
  }

  const s = selectedSeller;
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/sellers")}
          className="rounded-full hover:bg-primary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Detail Seller
        </h1>
      </div>

      {/* PROFILE CARD */}
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="w-28 h-28 ring-4 ring-primary/20">
            <AvatarImage src={s.avatar} />
            <AvatarFallback className="bg-primary text-white text-3xl font-bold">
              {s.storeName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="text-center sm:text-left space-y-1">
            <CardTitle className="text-2xl font-bold">
              {s.storeName}
            </CardTitle>
            <CardDescription className="text-base">
              {s.sellerName}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* DETAIL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INFORMASI KONTAK */}
        <Card className="border-0 shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-lg border-b-2">
              Informasi Kontak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-slate-100">
                <Mail className="w-4 h-4 text-slate-600" />
              </div>
              <span>{s.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-slate-100">
                <Phone className="w-4 h-4 text-slate-600" />
              </div>
              <span>{s.phoneNumber || "Belum ada"}</span>
            </div>
          </CardContent>
        </Card>

        {/* INFORMASI ALAMAT */}
        <Card className="border-0 shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-lg border-b-2">
              Informasi Alamat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex gap-3">
              <div className="p-2 rounded-full bg-slate-100">
                <MapPin className="w-4 h-4 text-slate-600" />
              </div>
              <p>
                <span className="font-medium">Domisili</span>
                <br />
                {s.domicileAddress || "Belum ada"}
              </p>
            </div>

            <div className="flex gap-3">
              <div className="p-2 rounded-full bg-slate-100">
                <Building className="w-4 h-4 text-slate-600" />
              </div>
              <p>
                <span className="font-medium">Produksi</span>
                <br />
                {s.productionAddress || "Belum ada"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* INFORMASI PEMBAYARAN */}
        <Card className="border-0 shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-lg border-b-2">
              Informasi Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Nama Pemilik:</strong>{" "}
              {s.bankAccountOwner || "Belum ada"}
            </p>
            <p>
              <strong>No Rekening:</strong>{" "}
              {s.bankAccountNumber || "Belum ada"}
            </p>
            <p>
              <strong>Bank:</strong>{" "}
              {s.bankName || "Belum ada"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FOOTER INFO */}
      <Card className="border-0 shadow-sm">
        <CardContent className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>
            Bergabung sejak{" "}
            {new Date(s.createdAt).toLocaleDateString("id-ID")}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

export default SellerDetailPage;
