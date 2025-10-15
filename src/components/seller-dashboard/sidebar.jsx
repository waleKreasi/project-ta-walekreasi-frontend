import React from "react";
import {
  BadgeCheck,
  ShoppingBasket,
  Store,
  UserCircle2,
  LayoutDashboardIcon,
  LogOut,
  ReceiptText,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import logoWaleKreasi from "../../assets/logo-WaleKreasi.webp";

// Array menu items untuk kemudahan modifikasi
const sellerSidebarMenuItems = [
  { id: "dashboard", label: "Dashboard", path: "/store/dashboard", icon: <LayoutDashboardIcon /> },
  { id: "profile", label: "Profil", path: "/store/profile", icon: <UserCircle2 /> },
  { id: "products", label: "Produk", path: "/store/products", icon: <ShoppingBasket /> },
  { id: "orders", label: "Pesanan", path: "/store/orders", icon: <BadgeCheck /> },
  // { id: "payout", label: "Pembayaran", path: "/store/payouts", icon: <ReceiptText /> },
];

function SellerSideBar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { profile: store } = useSelector((state) => state.sellerProfile); 

  function handleLogout() {
    dispatch(logoutUser());
    // Redirect ke halaman login setelah logout
    navigate("/auth/login"); 
  }

  // Komponen MenuItems internal
  const MenuItems = ({ onNavigate }) => (
    <nav className="flex-col flex gap-2">
      {sellerSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            if (onNavigate) onNavigate();
          }}
          // Menghapus kondisi untuk membuat semua item menu terlihat sama
          className="relative flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors duration-200 text-muted-foreground hover:bg-accent hover:text-white"
        >
          {React.cloneElement(menuItem.icon, { className: "h-5 w-5" })}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );

  return (
    <React.Fragment>
      {/* Sidebar untuk mobile (Sheet) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 flex flex-col">
          <SheetHeader className="pb-4">
            {/* Header untuk mobile */}
            <SheetTitle className="flex items-center gap-2 mt-5">
              <img src={logoWaleKreasi} 
                   alt="Logo Walekreasi"
                   className="h-7 w-7" />
              <div className="flex flex-col items-start">
                <h1 className="text-xl font-extrabold text-gray-900 leading-none">
                  {store?.storeName || "Store Dashboard"}
                </h1>
                <p className="text-xs text-muted-foreground leading-none">Seller Dashboard</p>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col flex-1 py-4">
            <MenuItems onNavigate={() => setOpen(false)} />
            <div className="mt-4 pt-4 border-t">
              <Button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="w-full inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium justify-start"
                variant="ghost"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sidebar untuk desktop */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        {/* Header untuk desktop */}
        <div
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center justify-center pb-4 border-b space-x-2"
        >
          <img src={logoWaleKreasi} 
                alt="Logo Walekreasi"
                className="h-8 w-8" />
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-extrabold text-gray-900 leading-none">
              {store?.storeName || "Store Dashboard"}
            </h1>
            <p className="text-xs text-muted-foreground leading-none mt-1">Seller Dashboard</p>
          </div>
        </div>
        
        <div className="flex flex-col flex-1 py-4">
          <MenuItems />
          <div className="mt-4 pt-4 border-t">
            <Button
              onClick={handleLogout}
              className="w-full inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium justify-start"
              variant="ghost"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </React.Fragment>
  );
}

export default SellerSideBar;
