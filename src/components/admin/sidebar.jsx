import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice"; // Sesuaikan path jika berbeda
import { LayoutDashboard, Wallet, BarChartBig, Store, User2, Handshake, Settings, LogOut } from "lucide-react";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import logoWaleKreasi from "../../assets/logo-WaleKreasi.png";

// Struktur menu baru dengan pengelompokan
const adminSidebarMenuGroups = [
  {
    title: null, // Tanpa judul untuk kelompok pertama
    items: [
      { id: "dashboard", label: "Dashboard", path: "/admin", icon: <LayoutDashboard /> },
    ]
  },
  {
    title: "Manajemen",
    items: [
      { id: "sellers", label: "Daftar Seller", path: "/admin/sellers", icon: <Store /> },
      { id: "customers", label: "Daftar Customer", path: "/admin/customers", icon: <User2 /> },
    ]
  },
  {
    title: "Keuangan & Transaksi",
    items: [
      { id: "payout", label: "Pembayaran ke Seller", path: "/admin/payout", icon: <Wallet /> },
      { id: "transactions", label: "Transaksi", path: "/admin/transactions", icon: <Handshake /> },
    ]
  },
  {
    title: "Pengaturan",
    items: [
      { id: "setting", label: "Pengaturan", path: "/admin/setting", icon: <Settings /> },
    ]
    
  },
];

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  // Komponen MenuItems internal
  const MenuItems = ({ onNavigate }) => (
    <nav className="flex-col flex gap-2">
      {adminSidebarMenuGroups.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {group.title && (
            <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground mt-4 mb-2">
              {group.title}
            </h3>
          )}
          {group.items.map((menuItem) => (
            <div
              key={menuItem.id}
              onClick={() => {
                navigate(menuItem.path);
                if (onNavigate) onNavigate();
              }}
              className={`relative flex cursor-pointer text-sm items-center gap-3 rounded-md px-3 py-2 transition-colors duration-200
                ${location.pathname.startsWith(menuItem.path) ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-white'}`
              }
            >
              {React.cloneElement(menuItem.icon, { className: "h-5 w-5" })}
              <span>{menuItem.label}</span>
            </div>
          ))}
        </React.Fragment>
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
              <div className="flex flex-col items-start">
                <h1 className="text-xl font-extrabold text-gray-900 leading-none">WaleKreasi</h1>
                <p className="text-xs text-muted-foreground leading-none">Dashboard</p>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col flex-1 justify-between py-4">
            <MenuItems onNavigate={() => setOpen(false)} />
            <div className="mt-auto border-t pt-4">
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
          onClick={() => navigate("/admin")}
          className="flex cursor-pointer items-center justify-center pb-4 border-b space-x-2"
        >
          <img src={logoWaleKreasi} 
               alt="Logo WaleKreasi" 
               className="h-9 w-9" />

          <div className="flex flex-col items-start">
            <h1 className="text-xl font-extrabold text-gray-900 leading-none">WaleKreasi</h1>
            <p className="text-xs text-muted-foreground leading-none mt-1">Dashboard</p>
          </div>
        </div>
        
        <div className="flex flex-col flex-1 justify-between py-4">
          <MenuItems />
          <div className="mt-auto border-t pt-4">
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

export default AdminSideBar;
