import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLatestProducts,
  fetchProductDetails,
  setProductDetails,
} from "@/store/shop/products-slice";
import {
  fetchBanners,
  selectLandingBanners,
} from "@/store/admin/banner-slice";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Lamp,
  Gift,
  Shirt,
  Brush,
  Sprout,
  MoveRight,
} from "lucide-react";

const categoriesWithIcon = [
  { id: "home-decor", label: "Dekorasi Rumah", icon: Lamp },
  { id: "accessories-fashion", label: "Aksesori & Fashion", icon: Shirt },
  { id: "souvenirs", label: "Souvenir & Oleh-Oleh", icon: Gift },
  { id: "traditional-tools", label: "Peralatan Tradisional", icon: Brush },
  { id: "eco-friendly", label: "Produk Ramah Lingkungan", icon: Sprout },
];

function SkeletonBanner() {
  return (
    <Skeleton className="w-full h-full rounded-xl bg-gray-300" />
  );
}

function SkeletonProductTile() {
  return (
    <div className="rounded-md border p-2 space-y-2 animate-pulse">
      <Skeleton className="h-36 w-full rounded-md bg-gray-300" />
      <Skeleton className="h-4 w-3/4 bg-gray-300" />
      <Skeleton className="h-3 w-1/2 bg-gray-200" />
      <Skeleton className="h-4 w-2/3 bg-gray-300" />
    </div>
  );
}

function ShoppingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [isLoadingBanners, setIsLoadingBanners] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const { latestProducts, productDetails } = useSelector((state) => state.shopProducts);
  const landingBanners = useSelector(selectLandingBanners);

  useEffect(() => {
    dispatch(fetchLatestProducts()).finally(() => setIsLoadingProducts(false));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchBanners()).finally(() => setIsLoadingBanners(false));
  }, [dispatch]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % landingBanners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [landingBanners]);

  function handleNavigateToListingPage(item, section) {
    sessionStorage.removeItem("filters");
    const filter = { [section]: [item.id] };
    sessionStorage.setItem("filters", JSON.stringify(filter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  function handleAddToCart(productId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId,
        quantity: 1,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Produk berhasil dimasukkan ke keranjang" });
      }
    });
  }

  function handleDialogClose(isOpen) {
    if (!isOpen) {
      setOpenDetailsDialog(false);
      dispatch(setProductDetails());
    }
  }

  return (
    <div className="md:container flex flex-col min-h-screen">
      {/* 🖼️ Banner Section */}
      <div className="relative w-screen max-w-full aspect-[4/2] sm:aspect-[6/2] md:aspect-[16/4] overflow-hidden md:mt-8 mb-3 md:rounded-xl md:border">
        {isLoadingBanners ? (
          <SkeletonBanner />
        ) : landingBanners && landingBanners.length > 0 ? (
          landingBanners.map((slide, index) => (
            <div key={index}>
              <img
                src={slide?.imageUrl}
                alt={slide?.caption || "Banner"}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              />
              {index === currentSlide && slide.caption && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center px-4 z-20">
                  <h2 className="text-white text-2xl md:text-4xl font-bold drop-shadow text-center">
                    {slide.caption}
                  </h2>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-600">
            Tidak ada banner tersedia.
          </div>
        )}

        {!isLoadingBanners && landingBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
            {landingBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white border-white"
                    : "bg-white/50 border-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 🧭 Category Section */}
      <section className="mt-6 bg-secondary/25 rounded-xl md:p-2 m-3 md:m-0">
        <div className="mx-auto p-6">
          <h2 className="text-xl py-1 md:text-2xl font-bold border-b border-gray-200">
            Belanja Berdasarkan Kategori
          </h2>
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 py-4">
            {categoriesWithIcon.map((item) => (
              <Card
                key={item.id}
                onClick={() => handleNavigateToListingPage(item, "category")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center text-center p-3 md:p-6">
                  <item.icon className="w-6 h-6 md:w-12 md:h-12 mb-4 text-primary" />
                  <span className="font-bold text-xs md:text-base">
                    {item.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 💎 Produk Unggulan */}
      <section className="mt-4 md:py-8">
        <div className="mx-auto px-6">
          <h2 className="text-xl py-1 md:text-2xl font-bold border-b border-gray-200">
            Produk Unggulan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 py-3 md:py-6">
            {isLoadingProducts ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonProductTile key={i} />
              ))
            ) : latestProducts && latestProducts.length > 0 ? (
              latestProducts.map((product) => (
                <ShoppingProductTile
                  key={product._id}
                  product={product}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddtoCart={handleAddToCart}
                />
              ))
            ) : (
              <p className="col-span-full text-center">Tidak ada produk</p>
            )}
          </div>

          <div className="mt-8">
            <Button
              onClick={() => navigate("/shop/listing")}
              className="flex gap-2 hover:shadow-lg"
            >
              Lihat Semua
              <MoveRight />
            </Button>
          </div>
        </div>
      </section>

      {/* 🧾 Dialog Detail Produk */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={handleDialogClose}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
