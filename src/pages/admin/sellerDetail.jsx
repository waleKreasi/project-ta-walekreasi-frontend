import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSellerById } from "@/store/admin/sellers-slice";
import { ArrowLeft, Mail, Phone, MapPin, Building, Banknote, CreditCard, Calendar, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

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

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-muted-foreground">Memuat profil seller...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-red-500">
        <p>Terjadi kesalahan: {error}</p>
      </div>
    );
  }

  if (!selectedSeller) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-muted-foreground">Data seller tidak ditemukan.</p>
      </div>
    );
  }

  const s = selectedSeller;

  const handleBack = () => {
    navigate('/admin/sellers');
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      <div className="flex items-center gap-2 ">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-900"
          >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Detail Seller</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={s.avatar} alt={`Avatar ${s.storeName}`} />
            <AvatarFallback className="text-3xl bg-primary text-white font-bold">{s.storeName ? s.storeName[0].toUpperCase() : ''}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <span>{s.storeName}</span>
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {s.sellerName}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Informasi Kontak */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold border-b pb-1">Informasi Kontak</h3>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{s.email}</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{s.phoneNumber || 'Belum ada'}</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>NIK: {s.nik || 'Belum ada'}</span>
              </p>
            </div>

            {/* Informasi Alamat */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold border-b pb-1">Informasi Alamat</h3>
              <p className="flex items-start gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                <span>Alamat Domisili: {s.domicileAddress || 'Belum ada'}</span>
              </p>
              <p className="flex items-start gap-2 text-sm text-gray-700">
                <Building className="w-4 h-4 text-muted-foreground mt-1" />
                <span>Alamat Produksi: {s.productionAddress || 'Belum ada'}</span>
              </p>
            </div>

            {/* Informasi Pembayaran */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold border-b pb-1">Informasi Pembayaran</h3>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <Banknote className="w-4 h-4 text-muted-foreground" />
                <span>Bank: {s.bankName || 'Belum ada'}</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span>No. Rekening: {s.bankAccountNumber || 'Belum ada'}</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Nama Pemilik: {s.bankAccountOwner || 'Belum ada'}</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span>E-wallet: {s.eWallet || 'Belum ada'}</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span>No. E-wallet: {s.eWalletAccountNumber || 'Belum ada'}</span>
              </p>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Tanggal Bergabung: {new Date(s.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SellerDetailPage;