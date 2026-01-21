import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { registerSeller } from "@/store/auth-slice";
import logoWaleKreasi from "../../assets/logo-WaleKreasi.webp";
import { sellerProfileFormElements } from "../../config";

export default function AuthRegisterSeller({ agreedToTerms }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // =========================
  // KONFIGURASI STEP
  // =========================
  const sections = useMemo(
    () => ["Identitas Pemilik Usaha", "Data Usaha / Toko"],
    []
  );

  const sectionFields = useMemo(
    () => ({
      "Identitas Pemilik Usaha": [
        "sellerName",
        "phoneNumber",
        "email",
        "password",
        "domicileAddress",
        "cityOrRegency",
        "province",
      ],
      "Data Usaha / Toko": [
        "storeName",
        "storeDescription",
        "productionAddress",
      ],
    }),
    []
  );

  // =========================
  // STATE
  // =========================
  const initialState = useMemo(() => {
    return sellerProfileFormElements.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {});
  }, []);

  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const isLastStep = step === sections.length - 1;
  const currentSection = sections[step];

  const controlsToRender = sellerProfileFormElements.filter((field) =>
    sectionFields[currentSection].includes(field.name)
  );

  // =========================
  // HANDLE CHANGE
  // =========================
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  }

  // =========================
  // VALIDASI
  // =========================
  function validateFields(fields) {
    const errors = {};

    fields.forEach((name) => {
      const fieldDef = sellerProfileFormElements.find((f) => f.name === name);
      const value = formData[name]?.trim();

      if (fieldDef?.required && !value) {
        errors[name] = `${fieldDef.label} wajib diisi`;
      }

      if (
        name === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        errors[name] = "Format email tidak valid";
      }
    });

    return errors;
  }

  function validateCurrentStep() {
    const errors = validateFields(sectionFields[currentSection]);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateAllSteps() {
    let combinedErrors = {};

    sections.forEach((section) => {
      const errors = validateFields(sectionFields[section]);
      combinedErrors = { ...combinedErrors, ...errors };
    });

    setFormErrors(combinedErrors);
    return Object.keys(combinedErrors).length === 0;
  }

  // =========================
  // NAVIGASI STEP
  // =========================
  function handleNext(e) {
    e.preventDefault();

    if (!validateCurrentStep()) {
      toast({
        title: "Lengkapi data terlebih dahulu",
        description: "Beberapa field wajib belum diisi.",
        variant: "destructive",
      });
      return;
    }

    setStep((prev) => prev + 1);
  }

  function handleBack(e) {
    e.preventDefault();
    setStep((prev) => prev - 1);
  }

  // =========================
  // SUBMIT FINAL
  // =========================
  async function handleSubmit(e) {
    e.preventDefault();

    if (!isLastStep) return;

    if (!validateAllSteps()) {
      toast({
        title: "Lengkapi semua data",
        description: "Masih ada data yang belum valid.",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Persetujuan diperlukan",
        description: "Anda harus menyetujui syarat & ketentuan.",
        variant: "destructive",
      });
      return;
    }

    // Hapus field kosong sebelum kirim ke backend
    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value.trim() !== "")
    );

    setSubmitting(true);

    try {
      const result = await dispatch(
        registerSeller({ ...cleanedData, agreedToTerms: true })
      );

      if (result.payload?.success) {
        toast({ title: "Pendaftaran berhasil, Silahkan Login" });
        navigate("/auth/login");
      } else {
        toast({
          title: "Pendaftaran gagal",
          description: result.payload?.message || "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Terjadi kesalahan",
        description: "Silakan coba kembali",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <img src={logoWaleKreasi} alt="Logo" className="h-20 w-20 mb-3" />
        <h1 className="text-2xl font-bold text-gray-800">
          Pendaftaran Seller WaleKreasi
        </h1>
      </div>

      {/* Step Indicator */}
      <div className="flex gap-2">
        {sections.map((section, index) => (
          <div
            key={section}
            className={`flex-1 text-center border-b-2 pb-2 ${
              index === step
                ? "border-primary text-primary"
                : "border-gray-300 text-gray-400"
            }`}
          >
            {section}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          {controlsToRender.map(({ name, label, type }) => (
            <div key={name}>
              <label className="block mb-1 text-sm font-medium">{label}</label>

              {type === "textarea" ? (
                <textarea
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-full border rounded-md p-2 ${
                    formErrors[name] ? "border-red-500" : "border-gray-300"
                  }`}
                />
              ) : (
                <input
                  name={name}
                  type={type || "text"}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-full border rounded-md p-2 ${
                    formErrors[name] ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}

              {formErrors[name] && (
                <p className="text-xs text-red-600 mt-1">
                  {formErrors[name]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-8">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-md border border-gray-300"
            >
              Kembali
            </button>
          ) : (
            <div />
          )}

          {!isLastStep ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 rounded-md bg-primary text-white"
            >
              Selanjutnya
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-md bg-primary text-white disabled:opacity-60"
            >
              {submitting ? "Memproses..." : "Daftar Seller"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
