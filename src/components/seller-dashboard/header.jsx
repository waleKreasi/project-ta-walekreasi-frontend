import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

function SellerDashboardHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b lg:hidden sm:block">
      <Button onClick={() => setOpen(true)} >
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
    </header>
  );
}

export default SellerDashboardHeader;