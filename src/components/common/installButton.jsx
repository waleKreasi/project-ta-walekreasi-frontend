import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 👉 Simulasikan tombol tampil di mode development
    if (process.env.NODE_ENV === "development") {
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    } else {
      // Fallback saat development atau prompt tidak tersedia
      console.log("Install prompt not available (likely in dev mode)");
    }
  };

  return (
    <>
      {isInstallable && (
        <motion.div
          onClick={handleInstallClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-16 md:bottom-6 right-8 z-50 flex items-center bg-primary text-white shadow-lg cursor-pointer rounded-full transition-all duration-300 ease-in-out overflow-hidden"
          style={{
            width: isHovered ? "150px" : "48px",
            height: "48px",
          }}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <FaDownload className="w-16"/>
          </div>

          <motion.span
            className="ml-2 text-sm font-medium whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            Install
          </motion.span>
        </motion.div>
      )}
    </>
  );
};

export default InstallButton;
