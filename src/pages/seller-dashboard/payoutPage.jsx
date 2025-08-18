import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerPayouts } from "@/store/seller/payout-slice";
import { Loader2, Eye } from "lucide-react";

const SellerPayoutPage = () => {
  const dispatch = useDispatch();

  const { payouts = [], loading = false, error = null } = useSelector(
    (state) => state.payout
  );

  useEffect(() => {
    dispatch(fetchSellerPayouts());
  }, [dispatch]);

  const formatCurrency = (value) =>
    typeof value === "number"
      ? `Rp ${value.toLocaleString("id-ID")}`
      : "-";

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "-";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Riwayat Payout</h1>

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" /> Memuat data...
        </div>
      )}

      {error && (
        <p className="text-red-500 bg-red-50 border border-red-200 p-3 rounded">
          {error}
        </p>
      )}

      {!loading && payouts.length === 0 && !error && (
        <p className="text-gray-500">Belum ada riwayat payout.</p>
      )}

      {!loading && payouts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left border-b">Tanggal</th>
                <th className="py-2 px-4 text-left border-b">Jumlah</th>
                <th className="py-2 px-4 text-left border-b">Status</th>
                <th className="py-2 px-4 text-left border-b">Bukti Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => {
                const status = payout.status || (payout.paidAt ? "paid" : "pending");
                return (
                  <tr key={payout._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{formatDate(payout.paidAt)}</td>
                    <td className="py-2 px-4 border-b">{formatCurrency(payout.amount)}</td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          status === "paid"
                            ? "bg-green-100 text-green-700"
                            : status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {payout.paymentProofUrl ? (
                        <a
                          href={payout.paymentProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" /> Lihat
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerPayoutPage;
