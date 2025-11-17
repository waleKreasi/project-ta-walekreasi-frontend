import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import AddressSelected from "@/components/shopping-view/address-selected";
import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import axios from "axios";

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { cartData } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [shippingCosts, setShippingCosts] = useState({});
  const [totalShippingCost, setTotalShippingCost] = useState(0);

  const api = axios.create({
    baseURL: "https://walekreasi-backend-thrid.onrender.com/api",
    withCredentials: true,
  });

  // ✅ Hitung total harga produk
  const totalCartAmount =
    cartData?.reduce((sum, storeGroup) => {
      return (
        sum +
        storeGroup.items.reduce((storeSum, item) => {
          const product = item.productId?._id
            ? item.productId
            : productList.find((p) => p._id === item.productId);

          if (!product) return storeSum;

          const price =
            product.salePrice > 0 ? product.salePrice : product.price || 0;

          return storeSum + price * item.quantity;
        }, 0)
      );
    }, 0) || 0;

  // 🧮 Hitung ongkir setiap toko berdasarkan kota pembeli
  useEffect(() => {
    const fetchShippingCosts = async () => {
      if (!currentSelectedAddress || !cartData?.length) return;

      const buyerCity = currentSelectedAddress.cityOrRegency;
      const costMap = {};
      let totalCost = 0;

      try {
        // Gunakan Promise.all agar lebih cepat
        await Promise.all(
          cartData.map(async (storeGroup) => {
            const sellerId = storeGroup.storeId;
            const response = await api.get(`/store/shipping/public/${sellerId}`);
            const allShipping = response.data?.data || [];

            // Cari ongkir berdasarkan kota pembeli
            let matched = allShipping.find((s) => s.cityOrRegency === buyerCity);

            // Jika tidak ada, coba fallback ke “Luar Daerah”
            if (!matched) {
              matched = allShipping.find((s) => s.cityOrRegency === "Luar Daerah");
            }

            const cost = matched ? matched.cost : 0;
            costMap[sellerId] = cost;
            totalCost += cost;
          })
        );

        setShippingCosts(costMap);
        setTotalShippingCost(totalCost);
      } catch (error) {
        console.error("Gagal memuat ongkir:", error);
        toast({
          title: "Gagal memuat ongkir.",
          description: "Periksa koneksi atau coba lagi nanti.",
          variant: "destructive",
        });
      }
    };

    fetchShippingCosts();
  }, [currentSelectedAddress, cartData]);

  // 🏁 Proses pembayaran Midtrans
  function handleInitiateMidtransPayment() {
    if (!cartData?.length) {
      toast({ title: "Keranjang kosong.", variant: "destructive" });
      return;
    }

    if (!currentSelectedAddress) {
      toast({ title: "Pilih alamat pengiriman.", variant: "destructive" });
      return;
    }

    const allItems = cartData.flatMap((storeGroup) =>
      storeGroup.items.map((item) => {
        const product = productList.find(
          (p) => p?._id?.toString() === item?.productId?.toString()
        );
        return {
          productId: item.productId,
          title: product?.title || "Produk",
          image: product?.image || "",
          price:
            product?.salePrice > 0 ? product.salePrice : product?.price || 0,
          quantity: item.quantity,
          sellerId: storeGroup.storeId,
          storeName: storeGroup.storeName,
        };
      })
    );

    const grandTotal = totalCartAmount + totalShippingCost;

    const orderData = {
      userId: user?.id,
      cartItems: allItems,
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        receiverName: currentSelectedAddress?.receiverName,
        address: currentSelectedAddress?.address,
        cityOrRegency: currentSelectedAddress?.cityOrRegency,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      totalAmount: Number(totalCartAmount),
      shippingTotal: Number(totalShippingCost),
      grandTotal: Number(grandTotal),
    };

    setIsPaymentStart(true);

    dispatch(createNewOrder(orderData)).then((data) => {
      const snapToken = data?.payload?.snapToken;
      if (snapToken) {
        window.snap.pay(snapToken, {
          onSuccess: () => (window.location.href = "/shop/payment-success"),
          onPending: () => toast({ title: "Transaksi tertunda." }),
          onError: () =>
            toast({ title: "Pembayaran gagal.", variant: "destructive" }),
          onClose: () => toast({ title: "Transaksi dibatalkan." }),
        });
      } else {
        setIsPaymentStart(false);
        toast({
          title: "Gagal membuat pesanan atau mengambil snap token.",
          variant: "destructive",
        });
      }
    });
  }

  // ❌ Tombol batal
  function handleCancelCheckout() {
    navigate("/shop/home");
  }

  return (
    <div className="flex flex-col gap-4 mt-5 p-5 max-w-6xl mx-auto">
      {/* 🏠 Alamat */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <AddressSelected
          selectedAddress={currentSelectedAddress}
          onChoose={() => setShowAddressDialog(true)}
        />
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <Address
            selectedId={currentSelectedAddress}
            setCurrentSelectedAddress={(address) => {
              setCurrentSelectedAddress(address);
              setShowAddressDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* 🛒 Daftar Produk per Toko */}
      <div className="flex flex-col gap-5 border rounded-md p-5 bg-white shadow-sm">
        {cartData?.map((storeGroup) => {
          const storeCost = shippingCosts[storeGroup.storeId] || 0;
          return (
            <div key={storeGroup.storeId} className="border-b pb-3">
              <h3 className="font-semibold text-base mb-3 text-gray-700">
                Toko: {storeGroup.storeName}
              </h3>

              <div className="space-y-2">
                {storeGroup.items.map((item) => {
                  const product = productList.find(
                    (p) => p?._id?.toString() === item?.productId?.toString()
                  );
                  return (
                    <UserCartItemsContent
                      cartItem={{ ...item, product }}
                      key={item.productId}
                    />
                  );
                })}
              </div>

              <p className="text-sm text-gray-600 mt-2">
                Ongkir ({currentSelectedAddress?.cityOrRegency || "-"}) :{" "}
                <span className="font-semibold text-gray-800">
                  Rp {storeCost.toLocaleString("id-ID")}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {/* 💰 Total & Tombol Aksi */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 bg-white p-5 rounded-md shadow-sm border">
        <div className="flex-1 text-sm text-gray-600 text-right sm:text-left">
          <p>Total Belanja: Rp {totalCartAmount.toLocaleString("id-ID")}</p>
          <p>Total Ongkir: Rp {totalShippingCost.toLocaleString("id-ID")}</p>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            Grand Total: Rp{" "}
            {(totalCartAmount + totalShippingCost).toLocaleString("id-ID")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancelCheckout}
            disabled={isPaymentStart}
          >
            Batal
          </Button>
          <Button
            onClick={handleInitiateMidtransPayment}
            className="w-full sm:w-auto"
            disabled={isPaymentStart}
          >
            {isPaymentStart ? "Memproses Pembayaran..." : "Bayar Sekarang"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
