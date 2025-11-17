import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSellerShipping,
  updateShippingCost,
  clearShippingMessages,
} from "@/store/seller/shipping-slice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Truck,
  MapPin,
  Loader2,
  AlertTriangle,
  Pencil,
  Save,
} from "lucide-react";

export default function SellerShippingPage() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { shippingList, isLoading, error, successMessage } = useSelector(
    (state) => state.shipping || {}
  );

  const [localData, setLocalData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    dispatch(fetchSellerShipping());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(shippingList) && shippingList.length > 0) {
      setLocalData(shippingList.map((item) => ({ ...item })));
    } else {
      setLocalData([]);
    }
  }, [shippingList]);

  useEffect(() => {
    if (successMessage) {
      toast({ description: successMessage });
      dispatch(clearShippingMessages());
    }
    if (error) {
      toast({ description: error, variant: "destructive" });
      dispatch(clearShippingMessages());
    }
  }, [successMessage, error, dispatch, toast]);

  // Format angka ke format rupiah
  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const handleChange = (index, value) => {
    let newCost = parseInt(value || 0);
    if (isNaN(newCost)) newCost = 0;
    if (newCost < 0) newCost = 0;
    if (newCost > 50000) {
      newCost = 50000;
      toast({
        description: "Maksimal ongkir adalah Rp 50.000/kg.",
        variant: "destructive",
      });
    }

    setLocalData((prevData) =>
      prevData.map((item, i) =>
        i === index ? { ...item, cost: newCost } : item
      )
    );
  };

  const handleSave = async (cityOrRegency, cost) => {
    await dispatch(updateShippingCost({ cityOrRegency, cost }));
    setEditingIndex(null);
  };

  const minCost =
    localData.length > 0 ? Math.min(...localData.map((d) => d.cost)) : 0;
  const maxCost =
    localData.length > 0 ? Math.max(...localData.map((d) => d.cost)) : 0;

  return (
    <Fragment>
      <div className="rounded-xl shadow-sm border bg-white p-6">
        <div className="mb-6">
          {/* HEADER TITLE */}
          <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-200">
            <Truck className="w-7 h-7 text-primary" />
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
              Pengaturan Ongkos Kirim
            </h1>
          </div>

          {/* SUBTEXT BELOW BORDER */}
          <div className="mt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs md:text-sm text-gray-600">
            <p>Atur biaya pengiriman berdasarkan wilayah Anda.</p>
            <p className="italic text-gray-500 mt-2 sm:mt-0">
              *Biaya dihitung per 1 kg
            </p>
          </div>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : localData && localData.length > 0 ? (
          <>
            <div className="space-y-3">
              {localData.map((item, index) => (
                <div
                  key={item._id || item.cityOrRegency}
                  className="flex flex-col sm:flex-row justify-between items-end border rounded-xl px-4 py-3 hover:bg-gray-50 transition"
                >
                  {/* Region info */}
                  <div className="flex gap-3 w-full sm:w-1/3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-800">
                        {item.cityOrRegency}
                      </h2>
                      <p className="text-xs text-gray-500">
                        Biaya kirim wilayah ini
                      </p>
                    </div>
                  </div>

                  {/* Cost + Action */}
                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    {editingIndex === index ? (
                      <>
                        <Input
                          type="number"
                          min={0}
                          max={50000}
                          value={item.cost}
                          onChange={(e) => handleChange(index, e.target.value)}
                          className="w-28 text-center font-medium text-gray-700 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <Button
                          size="icon"
                          onClick={() => handleSave(item.cityOrRegency, item.cost)}
                          disabled={isLoading}
                          className="border border-green-500 text-green-600 hover:bg-green-50 rounded-full transition-all duration-150"
                        >
                          <Save className="w-5 h-5" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-800 font-medium">
                          {formatRupiah(item.cost)} / kg
                        </span>
                        <Button
                          size="icon"
                          onClick={() => setEditingIndex(index)}
                          className="border border-gray-300 text-white hover:text-white hover:border-primary rounded-full transition-all duration-150"
                        >
                          <Pencil className="w-5 h-5" />
                        </Button>
                      </>
                    )}
                  </div>

                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 border-t pt-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <p className="text-sm italic">
                    Pastikan tarif sesuai kebijakan.
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 text-sm text-gray-700 bg-gray-50 border rounded-lg px-4 py-2">
                  <span className="font-semibold text-primary">
                    Rentang Ongkir:
                  </span>{" "}
                  {formatRupiah(minCost)} - {formatRupiah(maxCost)} / kg
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center py-10">
            Data ongkos kirim belum tersedia.
          </p>
        )}
      </div>
    </Fragment>
  );
}
