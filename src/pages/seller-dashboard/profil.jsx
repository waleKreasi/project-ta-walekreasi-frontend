import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSellerProfile,
  updateSellerProfile,
  uploadStoreImage,
} from "@/store/seller/profile-slice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CommonForm from "@/components/common/form";
import { sellerProfileFormElements } from "@/config";
import { CreditCard, SquarePen, Store, UserCircle, Image, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SellerProfilePage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { profile: store, isLoading, error } = useSelector(
    (state) => state.sellerProfile
  );

  const [openEditProfileSheet, setOpenEditProfileSheet] = useState(false);
  const [formData, setFormData] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  useEffect(() => {
    dispatch(fetchSellerProfile());
  }, [dispatch]);

  useEffect(() => {
    if (store) setFormData(store);
  }, [store]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedData = { ...formData };

    try {
      if (logoFile) {
        const logoUrl = await dispatch(uploadStoreImage(logoFile)).unwrap();
        updatedData.storeLogoUrl = logoUrl;
      }
      if (bannerFile) {
        const bannerUrl = await dispatch(uploadStoreImage(bannerFile)).unwrap();
        updatedData.storeBannerUrl = bannerUrl;
      }

      const result = await dispatch(updateSellerProfile(updatedData)).unwrap();
      
      toast({
        title: "Sukses!",
        description: "Profil toko berhasil diperbarui.",
      });

      dispatch(fetchSellerProfile());
      setOpenEditProfileSheet(false);
      setLogoFile(null);
      setBannerFile(null);
      
    } catch (err) {
      toast({
        title: "Gagal memperbarui profil.",
        description: err.message || "Terjadi kesalahan.",
        variant: "destructive"
      });
    }
  };

  const isFormValid = () =>
    Object.entries(formData)
      .filter(([key]) => key !== "id" && key !== "logo")
      .every(([, val]) => val !== "");

  if (isLoading || !store) return <p className="text-center py-8">Memuat data toko...</p>;
  if (error) return <p className="text-center py-8 text-red-500">Gagal memuat data toko: {error}</p>;

  return (
    <div className="w-full md:container px-4 sm:p-8 py-4 space-y-6 animate-fade-in">
      {/* Banner dan Logo */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-md aspect-[16/9] sm:aspect-[16/5] bg-gray-100 group">
        <img
          src={store.storeBannerUrl || `https://placehold.co/1200x400/E5E7EB/6B7280?text=Tambahkan+Banner`}
          alt="Banner Toko"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Logo toko */}
        <div className="absolute bottom-4 left-6 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg z-10">
          <Avatar className="w-full h-full">
            <AvatarImage src={store.storeLogoUrl || `https://placehold.co/100x100/A0A0A0/FFFFFF?text=Logo`} alt="Logo Toko" />
            <AvatarFallback className="text-xl font-bold bg-gray-200">WL</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white w-8 h-8"/>
          </div>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="mt-16 sm:mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Info dasar toko */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{store.storeName}</h1>
          <p className="text-sm text-gray-500 max-w-lg mt-1">{store.storeDescription}</p>
        </div>
        
        {/* Tombol Edit */}
        <Button
          onClick={() => setOpenEditProfileSheet(true)}
          className="items-center gap-2 bg-primary hover:bg-accent transition-colors shadow-md rounded-full px-6 py-2"
        >
          <SquarePen className="w-4 h-4" /> Edit Profil
        </Button>
      </div>

      {/* Grid Konten */}
      <div className="grid gap-6 md:grid-cols-2 text-sm sm:text-base mt-8">
        {/* Data Diri */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex gap-4 items-center border-b-2 border-gray-100 py-2 mb-4">
            <UserCircle className="text-blue-500 w-6 h-6" />
            <h1 className="font-semibold text-lg text-gray-800">Data Diri Penjual</h1>
          </div>
          <div className="grid gap-4 mt-4">
            <div className="flex flex-col font-light">
              <span className="text-sm text-gray-500">Nama Lengkap</span>
              <span className="text-base font-medium text-gray-800">{store.sellerName}</span>
            </div>
            <div className="flex flex-col font-light">
              <span className="text-sm text-gray-500">Nomor Telepon</span>
              <span className="text-base font-medium text-gray-800">{store.phoneNumber}</span>
            </div>
            <div className="flex flex-col font-light">
              <span className="text-sm text-gray-500">Alamat Domisili</span>
              <span className="text-base font-medium text-gray-800">{store.domicileAddress}, {store.cityOrRegency}, {store.province}</span>
            </div>
          </div>
        </div>

        {/* Data Usaha */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex gap-4 items-center border-b-2 border-gray-100 py-2 mb-4">
            <Store className="text-green-500 w-6 h-6" />
            <h1 className="font-semibold text-lg text-gray-800">Data Usaha/Toko</h1>
          </div>
          <div className="grid gap-4 mt-4">
            <div className="flex flex-col font-light">
              <span className="text-sm text-gray-500">Nama Toko</span>
              <span className="text-base font-medium text-gray-800">{store.storeName}</span>
            </div>
            <div className="flex flex-col font-light">
              <span className="text-sm text-gray-500">Deskripsi</span>
              <span className="text-base font-medium text-gray-800">{store.storeDescription}</span>
            </div>
            <div className="flex flex-col font-light">
              <span className="text-sm text-gray-500">Alamat Produksi</span>
              <span className="text-base font-medium text-gray-800">{store.productionAddress}</span>
            </div>
          </div>
        </div>

        {/* Data Pembayaran */}
        <div className="bg-white shadow-lg rounded-xl p-6 md:col-span-2">
          <div className="flex gap-4 items-center border-b-2 border-gray-100 py-2 mb-4">
            <CreditCard className="text-yellow-500 w-6 h-6" />
            <h1 className="font-semibold text-lg text-gray-800">Data Pembayaran</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col font-light">
              <span className="text-sm text-gray-500">Nama Pemilik Rekening</span>
              <span className="text-base font-medium text-gray-800">{store.bankAccountOwner}</span>
            </div>
            <div className="flex flex-col font-light">
              <span className="text-sm text-gray-500">Nama Bank</span>
              <span className="text-base font-medium text-gray-800">{store.bankName}</span>
            </div>
            <div className="flex flex-col font-light">
              <span className="text-sm text-gray-500">Nomor Rekening</span>
              <span className="text-base font-medium text-gray-800">{store.bankAccountNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sheet Edit Profil */}
      <Sheet
        open={openEditProfileSheet}
        onOpenChange={(open) => {
          setOpenEditProfileSheet(open);
          if (!open) {
            setFormData(store);
            setLogoFile(null);
            setBannerFile(null);
          }
        }}
      >
        <SheetContent side="right" className="overflow-auto w-full sm:max-w-md flex flex-col bg-gray-50">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="text-gray-900">Edit Profil Toko</SheetTitle>
          </SheetHeader>

          <div className="flex-1 py-6 text-black space-y-4">
            {(!store.storeLogoUrl || !store.storeBannerUrl) && (
              <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 p-3 rounded-md text-sm">
                ⚠️ Lengkapi profil toko Anda dengan <strong>mengunggah logo dan banner toko</strong> untuk meningkatkan kepercayaan pembeli.
              </div>
            )}

            {/* Upload Gambar */}
            <div className="space-y-4 px-2 bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-700">Unggah Gambar</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={logoFile ? URL.createObjectURL(logoFile) : store.storeLogoUrl || `https://placehold.co/100x100/A0A0A0/FFFFFF?text=Logo`} alt="Preview Logo" className="object-cover" />
                    <AvatarFallback className="bg-gray-200">LG</AvatarFallback>
                  </Avatar>
                  <label htmlFor="logo-input" className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow cursor-pointer">
                    <Image className="w-4 h-4 text-gray-600" />
                    <input id="logo-input" type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Logo Toko</label>
                  <p className="text-xs text-gray-500">Format: JPG, PNG. Ukuran max: 2MB</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative w-48 h-24 rounded-lg overflow-hidden border">
                  <img src={bannerFile ? URL.createObjectURL(bannerFile) : store.storeBannerUrl || `https://placehold.co/200x100/E5E7EB/6B7280?text=Banner`} alt="Preview Banner" className="w-full h-full object-cover" />
                  <label htmlFor="banner-input" className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow cursor-pointer">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <input id="banner-input" type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files[0])} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Banner Toko</label>
                  <p className="text-xs text-gray-500">Format: JPG, PNG. Ukuran max: 5MB</p>
                </div>
              </div>
            </div>

            {/* Form Input */}
            <CommonForm
              onSubmit={handleSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText="Simpan"
              formControls={sellerProfileFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SellerProfilePage;
