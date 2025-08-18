import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoWaleKreasi from "../../assets/logo-WaleKreasi.png";

const sections = [
  {
    title: "1. Kriteria Pengguna & Produk",
    items: [
      "Pengguna: Aplikasi ini ditujukan bagi Warga Negara Indonesia (WNI) yang berdomisili di Provinsi Sulawesi Utara dan memiliki usaha kerajinan lokal.",
      "Produk: Produk yang diunggah harus merupakan hasil karya sendiri di wilayah Sulawesi Utara, mencerminkan nilai budaya dan kearifan lokal. Penjualan produk yang melanggar hukum atau mengandung unsur sensitif (SARA/pornografi) sangat dilarang."
    ],
  },
  {
    title: "2. Akurasi Data dan Tanggung Jawab",
    items: [
      "Data: Pengguna bertanggung jawab penuh atas kebenaran data pribadi dan deskripsi produk yang diunggah.",
      "Pengiriman: Pengemasan, pengiriman, dan kualitas produk merupakan tanggung jawab penuh pengguna."
    ],
  },
  {
    title: "3. Hak dan Wewenang Pengelola Aplikasi",
    items: [
      "Pengelola berhak melakukan verifikasi dan kurasi terhadap setiap produk yang didaftarkan.",
      "Pengelola berhak menangguhkan atau menonaktifkan akun pengguna jika ditemukan data palsu, pelanggaran ketentuan, atau menerima laporan negatif dari pembeli.",
      "Syarat dan ketentuan ini dapat diubah atau diperbarui oleh pengelola tanpa pemberitahuan sebelumnya."
    ],
  },
  {
    title: "6. Persetujuan",
    items: [
      "Dengan melanjutkan proses pendaftaran, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.",
    ],
  },
];

export default function TermsSection({ onAgree }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="w-full space-y-14">
      <div className="flex flex-col items-center mt-6">
        <div className="lg:hidden text-center">
          <img
            src={logoWaleKreasi}
            alt="Logo Wale Kreasi"
            className="h-20 w-20 mb-4"
          />
        </div>
        <div className="text-center text-2xl md:text-3xl font-bold text-gray-900">
          <h1>Syarat & Ketentuan Pendaftaran </h1>
        </div>
      </div>
      <div className="space-y-6 text-foreground max-h-96 overflow-y-auto text-justify text-base">
        <p>
          Terima kasih telah berminat untuk menjadi Seller di platform kami :
        </p>

        {sections.map((section, idx) => (
          <div key={idx}>
            <h2 className="font-bold text-base">{section.title}</h2>
            {section.paragraph && <p>{section.paragraph}</p>}
            <ul className="list-disc list-inside space-y-2 ml-4">
              {section.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="agree" className="text-base text-gray-800">
          Saya sudah membaca dan bersedia memenuhi syarat & ketentuan yang berlaku.
        </label>
      </div>

      <div className="text-center">
        <Button onClick={onAgree} disabled={!agreed}>
          Lanjut Mendaftar
        </Button>
      </div>
    </div>
  );
}
