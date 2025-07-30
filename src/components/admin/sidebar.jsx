import { LayoutDashboard, Wallet, BarChartBig, Store, User2, Handshake, Settings } from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

// ✅ Tambahkan item menu Dashboard ke sini
const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin",
    icon: <BarChartBig />,
  },
  {
    id: "payout",
    label: "Pembayaran ke Seller",
    path: "/admin/payout",
    icon: <Wallet />,
  },
  {
    id: "sellers",
    label: "Daftar Seller",
    path: "/admin/sellers",
    icon: <Store />,
  },

  {
    id: "customers",
    label: "Daftar Customer",
    path: "/admin/customers",
    icon: <User2 />, 
  },

  {
    id: "transactions",
    label: "Transaksi",
    path: "/admin/transactions",
    icon: <Handshake />, 
  },
  {
    id: "setting",
    label: "Pengaturan",
    path: "/admin/setting ",
    icon: <Settings />, 
  },

  
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            if (setOpen) setOpen(false);
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Sidebar responsive untuk mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Sidebar untuk desktop */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin")}
          className="flex cursor-pointer items-center gap-2"
        >
          <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
