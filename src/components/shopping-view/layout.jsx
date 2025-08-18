import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./footer";
import MobileHeaderFooterLayout from "./mobile-header-footer";
import InstallButton from "../common/installButton";
import CustomerServiceButton from "../common/csButton";

function ShoppingLayout() {
  return (
    <>
      <div className="lg:hidden">
        <MobileHeaderFooterLayout>
          <main className="flex-1 w-full">
            <Outlet />
          </main>
          <Footer />
        </MobileHeaderFooterLayout>
      </div>

      <div className="hidden lg:flex flex-col bg-white overflow-hidden min-h-screen">
        <ShoppingHeader />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
        <Footer />
      </div>

      <CustomerServiceButton/>
      <InstallButton />
    </>
  );
}

export default ShoppingLayout;
