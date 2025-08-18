import { Outlet } from "react-router-dom";
import { useState } from "react";
import SellerSideBar from "./sidebar";
import SellerDashboardHeader from "./header";
import CustomerServiceButton from "../common/csButton";
import InstallButton from "../common/installButton";

function SellerDashboardLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <SellerSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        <SellerDashboardHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      
      <InstallButton/>
      <CustomerServiceButton/>

    </div>
  );
}

export default SellerDashboardLayout;
