import React, { useState } from "react";
import { motion } from "framer-motion";
import { Headset } from "lucide-react";



// Ganti nomor dan pesan ini dengan data Anda
const WA_PHONE_NUMBER = "62895390729300"; // Ganti dengan nomor WhatsApp admin Anda
const WA_MESSAGE = "Halo admin, saya ingin bertanya tentang...."; // Ganti dengan pesan default

const CustomerServiceButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Fungsi untuk menangani klik tombol
  const handleWaClick = () => {
    // URL untuk chat WhatsApp
    const waUrl = `https://wa.me/${WA_PHONE_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <motion.div
      onClick={handleWaClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-6 md:bottom-6 right-8 z-50 flex items-center bg-accent text-white shadow-lg cursor-pointer rounded-full transition-all duration-300 ease-in-out overflow-hidden"
      style={{
        width: isHovered ? "200px" : "48px",
        height: "48px",
      }}
    >
      <div className="w-12 h-12  flex items-center justify-center">
        <Headset className="w-16" />
      </div>

      <motion.span
        className="ml-2 text-sm font-medium whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        Tanya Admin
      </motion.span>
    </motion.div>
  );
};

export default CustomerServiceButton;