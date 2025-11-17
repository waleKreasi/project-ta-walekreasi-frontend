import ProductImageUpload from "@/components/seller-dashboard/image-upload";
import SellerProductTile from "@/components/seller-dashboard/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/seller/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircleFadingPlus, ShoppingBasket } from "lucide-react";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  weight : 100
};

function SellerProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.sellerProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Produk Berhasil Ditambahkan",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="rounded-lg shadow-md p-4 border ">
        {/* Header */}
        <div className="mb-5 flex flex-col md:flex-row justify-between md:items-center px-4 py-3 border-b-2  sticky top-0 z-10 space-y-4 md:space-y-0">
          <div className="flex gap-2 items-center">
            <ShoppingBasket className="w-7 h-7 "/>
            <h1 className="text-2xl font-bold text-primary">Daftar Produk</h1>
          </div>

          <Button
            onClick={() => setOpenCreateProductsDialog(true)}
            className="flex w-full md:w-fit items-center gap-2 bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg shadow"
          >
            <CircleFadingPlus className="w-5 h-5" />
            Tambah Produk
          </Button>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 sm:px-4">
          {productList && productList.length > 0 ? (
            productList.map((productItem) => (
              <div
                key={productItem._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <SellerProductTile
                  setFormData={setFormData}
                  setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                  setCurrentEditedId={setCurrentEditedId}
                  product={productItem}
                  handleDelete={handleDelete}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-6 bg-white rounded-lg shadow-sm">
              Belum ada produk yang ditambahkan.
            </p>
          )}
        </div>

      </div>

      {/* Form Tambah/Ubah Produk */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent
          side="right"
          className="overflow-auto w-full sm:max-w-md bg-gray-50"
        >
          <SheetHeader className="border-b pb-3 mb-4">
            <SheetTitle className="text-lg font-bold text-gray-800">
              {currentEditedId !== null ? "Ubah Produk" : "Tambah Produk Baru"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="py-6 text-black">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Ubah" : "Tambah"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
              className="space-y-4"
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default SellerProducts;