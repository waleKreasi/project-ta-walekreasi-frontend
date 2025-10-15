import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartItems } from "@/store/shop/cart-slice";
import {
  FiSearch,
  FiShoppingCart,
  FiHome,
  FiUser,
  FiLogIn,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import logoWaleKreasi from "@/assets/logo-WaleKreasi.webp";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartWrapper from "./cart-wrapper";
import { ShoppingBag } from "lucide-react";

export default function MobileHeaderFooterLayout({ children }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartData = useSelector((state) => state.shopCart.cartData || []);
  const [openCart, setOpenCart] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  const totalItems = cartData.reduce(
    (total, store) => total + (store.items?.length || 0),
    0
  );

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="min-h-screen flex flex-col pt-14 pb-16 bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src={logoWaleKreasi} alt="Logo WaleKreasi" className="w-8 h-8" />
          <span className="text-lg font-semibold">WaleKreasi</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Button */}
          <Link
            to="/shop/search"
            aria-label="Cari produk"
            title="Cari produk"
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <FiSearch className="w-6 h-6" aria-hidden="true" />
            <span className="sr-only">Cari produk</span>
          </Link>

          {/* Sheet for Cart */}
          <Sheet open={openCart} onOpenChange={setOpenCart}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Buka keranjang belanja"
                title="Keranjang belanja"
              >
                <FiShoppingCart className="w-6 h-6" aria-hidden="true" />
                {totalItems > 0 && (
                  <span className="absolute -top-0 -right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <UserCartWrapper setOpenCartSheet={setOpenCart} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Fixed Footer */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow flex justify-around py-2">
        <Link
          to="/shop/home"
          aria-label="Beranda"
          className={`flex flex-col items-center text-sm transition-colors ${
            currentPath === "/shop/home"
              ? "text-primary font-semibold"
              : "text-gray-500"
          }`}
        >
          <FiHome className="w-5 h-5 mb-1" aria-hidden="true" />
          <span>Beranda</span>
        </Link>

        <Link
          to="/shop/listing"
          aria-label="Belanja"
          className={`flex flex-col items-center text-sm transition-colors ${
            currentPath === "/shop/listing"
              ? "text-primary font-semibold"
              : "text-gray-500"
          }`}
        >
          <ShoppingBag className="w-5 h-5 mb-1" aria-hidden="true" />
          <span>Belanja</span>
        </Link>

        <Link
          to={isAuthenticated ? "/shop/account" : "/auth/login"}
          aria-label={isAuthenticated ? "Akun saya" : "Masuk"}
          className={`flex flex-col items-center text-sm transition-colors ${
            currentPath.startsWith("/shop/account") || currentPath === "/auth/login"
              ? "text-primary font-semibold"
              : "text-gray-500"
          }`}
        >
          {isAuthenticated ? (
            <>
              <FiUser className="w-5 h-5 mb-1" aria-hidden="true" />
              <span>Saya</span>
            </>
          ) : (
            <>
              <FiLogIn className="w-5 h-5 mb-1" aria-hidden="true" />
              <span>Masuk</span>
            </>
          )}
        </Link>
      </nav>
    </div>
  );
}
