
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { checkAuth } from "./store/auth-slice";
import { Toast } from "@/components/ui/toast";

import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import RegisterSeller from "./pages/auth/registerSeller";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import NotFound from "./pages/not-found";

import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import StoreFrontPage from "./pages/shopping-view/store-page";

import SellerDashboardLayout from "./components/seller-dashboard/layout";
import SellerProducts from "./pages/seller-dashboard/products";
import SellerProfilePage from "./pages/seller-dashboard/profil";
import SellerOrders from "./pages/seller-dashboard/orders";
import SellerDetailPage from "./pages/admin/sellerDetail";

import AdminDashboardLayout from "./components/admin/layout";
import PayoutPage from "./pages/admin/PayoutPage";
import AdminDashboardPage from "./pages/admin/dashboard";
import SellersInfoPage from "./pages/admin/sellersInfo";
import CustomersInfoPage from "./pages/admin/customersInfo";
import TransactionsPage from "./pages/admin/transactionsPage";
import TransactionDetailPage from "./pages/admin/transactionsDetailPage";
import AdminSettingPage from "./pages/admin/settingPage";
import { Loader2 } from "lucide-react";

import { requestForToken, onMessageListener } from "./firebase/firebase.config";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const hasRequestedToken = useRef(false);

  useEffect(() => {
    dispatch(checkAuth());

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch]);

  useEffect(() => {
    if (user?.id && !hasRequestedToken.current) {
      hasRequestedToken.current = true;
      requestForToken(user.id);
      onMessageListener().then((payload) => {
        Toast({
          title: payload.notification?.title,
          description: payload.notification?.body,
        });
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-lg text-primary mt-4">Memuat...</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col overflow-x-hidden bg-white min-h-screen ${
        isOffline ? "pt-10" : ""
      }`}
    >
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 px-4 flex items-center justify-center gap-1 text-sm z-[9999]">
          <p>Koneksi Internet Terputus,</p>
          <button
            onClick={() => window.location.reload()}
            className="underline underline-offset-2 hover:text-red-200 transition"
          >
            Muat ulang
          </button>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/shop/home" replace />} />

        <Route path="/shop" element={<ShoppingLayout />}>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="store/:sellerId" element={<StoreFrontPage />} />
          <Route
            path="checkout"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingCheckout />
              </CheckAuth>
            }
          />
          <Route
            path="account"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingAccount />
              </CheckAuth>
            }
          />
          <Route
            path="payment-success"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <PaymentSuccessPage />
              </CheckAuth>
            }
          />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        <Route
          path="/auth/register-seller"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <RegisterSeller />
            </CheckAuth>
          }
        />

        <Route
          path="/store"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} requiredRole="seller">
              <SellerDashboardLayout />
            </CheckAuth>
          }
        >
          <Route path="profile" element={<SellerProfilePage />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="orders" element={<SellerOrders />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} requiredRole="admin">
              <AdminDashboardLayout />
            </CheckAuth>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="payout" element={<PayoutPage />} />
          <Route path="sellers" element={<SellersInfoPage />} />
          <Route path="seller/:id" element={<SellerDetailPage />} />
          <Route path="customers" element={<CustomersInfoPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="transactions/:id" element={<TransactionDetailPage />} />
          <Route path="setting" element={<AdminSettingPage />} />
        </Route>

        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
