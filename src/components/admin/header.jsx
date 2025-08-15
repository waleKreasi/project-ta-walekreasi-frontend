import { AlignJustify } from "lucide-react";
import { Button } from "../ui/button";

function AdminDashboardHeader({ setOpen }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b lg:hidden sm:block">
      {/* Tombol toggle menu untuk layar kecil tetap ada */}
      <Button onClick={() => setOpen(true)}>
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
    </header>
  );
}

export default AdminDashboardHeader;