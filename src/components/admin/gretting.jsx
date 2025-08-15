import React, { useState, useEffect } from "react";

// Komponen sapaan yang lebih dinamis dan personal
function Greeting() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Fungsi untuk menentukan sapaan berdasarkan waktu
    const getGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 11) {
        return "Selamat Pagi";
      } else if (currentHour >= 11 && currentHour < 14) {
        return "Selamat Siang";
      } else if (currentHour >= 15 && currentHour < 18) {
        return "Selamat Sore";
      } else {
        return "Selamat Malam";
      }
    };
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold text-gray-900 leading-tight">
        {greeting}! 👋
      </h1>
      <p className="text-2xl text-gray-600 font-medium">
        Admin Marketplace Walekreasi
      </p>
    </div>
  );
}

export default Greeting;
