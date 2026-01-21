export const registerFormControls = [
  {
      name : 'userName' ,
      label : 'Nama Pengguna', 
      placeholder :'Masukkan nama pengguna' ,
      componentType : 'input' , 
      type : 'text'   
  },
  {
      name : 'email' ,
      label : 'Email', 
      placeholder :'Masukkan Email Anda' ,
      componentType : 'input' , 
      type : 'email'   
  },
  {
    name : 'phoneNumber' ,
    label : 'Nomor Telepon', 
    placeholder :'08xxxxxxxxxx' ,
    componentType : 'input' , 
    type : 'tel'   
},
  {
      name : 'password' ,
      label : 'Kata Sandi', 
      placeholder :'Masukkan Kata Sandi' ,
      componentType : 'input' , 
      type : 'password'   
  }


];


export const sulutRegions = [
  "Manado",
  "Bitung",
  "Tomohon",
  "Kotamobagu",
  "Minahasa",
  "Minahasa Utara",
  "Minahasa Selatan",
  "Minahasa Tenggara",
  "Bolaang Mongondow",
  "Bolaang Mongondow Utara",
  "Bolaang Mongondow Selatan",
  "Bolaang Mongondow Timur",
  "Kepulauan Sangihe",
  "Kepulauan Talaud",
  "Kepulauan Siau Tagulandang Biaro (Sitaro)",
];

export const sellerRegisterFormControls = [
  // === Identitas Pemilik Usaha ===
  {
    name: "sellerName",
    label: "Nama Lengkap",
    placeholder: "Masukkan nama lengkap",
    componentType: "input",
    type: "text",
    section: "Identitas Pemilik Usaha",
  },
  {
    name: "phoneNumber",
    label: "Nomor Telepon",
    placeholder: "Masukkan nomor telepon aktif",
    componentType: "input",
    type: "text",
    section: "Identitas Pemilik Usaha",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Masukkan email aktif",
    componentType: "input",
    type: "email",
    section: "Identitas Pemilik Usaha",
  },
  {
    name: "password",
    label: "Kata Sandi",
    placeholder: "Masukkan kata sandi",
    componentType: "input",
    type: "password",
    section: "Identitas Pemilik Usaha",
  },
  {
    name: "province",
    label: "Provinsi",
    placeholder: "Sulawesi Utara",
    componentType: "select",
    section: "Identitas Pemilik Usaha",
    options: [{ label: "Sulawesi Utara", value: "Sulawesi Utara" }],
    defaultValue: "Sulawesi Utara",
  },
  {
    name: "cityOrRegency",
    label: "Kota / Kabupaten",
    placeholder: "Pilih kota atau kabupaten",
    componentType: "select",
    options: sulutRegions.map((region) => ({ label: region, value: region })),
    section: "Identitas Pemilik Usaha",
  },
  {
    name: "domicileAddress",
    label: "Alamat Domisili",
    placeholder: "Masukkan alamat domisili Anda",
    componentType: "textarea",
    section: "Identitas Pemilik Usaha",
  },

  // === Data Usaha / Toko ===
  {
    name: "storeName",
    label: "Nama Usaha / Toko",
    placeholder: "Masukkan nama usaha",
    componentType: "input",
    type: "text",
    section: "Data Usaha / Toko",
  },
  {
    name: "productionAddress",
    label: "Alamat Produksi",
    placeholder: "Masukkan alamat tempat produksi",
    componentType: "textarea",
    section: "Data Usaha / Toko",
  },
  {
    name: "storeDescription",
    label: "Deskripsi Usaha",
    placeholder: "Deskripsikan usaha Anda",
    componentType: "textarea",
    section: "Data Usaha / Toko",
  },

  // === Data Pembayaran ===
  {
    name: "bankAccountOwner",
    label: "Nama Pemilik Rekening",
    placeholder: "Masukkan nama pemilik rekening",
    componentType: "input",
    type: "text",
    section: "Data Pembayaran",
  },
  {
    name: "bankName",
    label: "Nama Bank",
    placeholder: "Masukkan nama bank",
    componentType: "input",
    type: "text",
    note: "contoh bank: BCA, BNI, Mandiri",
    section: "Data Pembayaran",
  },
  {
    name: "bankAccountNumber",
    label: "Nomor Rekening Bank",
    placeholder: "Masukkan nomor rekening bank",
    componentType: "input",
    type: "text",
    section: "Data Pembayaran",
  },
];

export const sellerProfileFormElements = [
  { label: "Nama Lengkap", name: "sellerName", type: "text" }, 
  { label: "Nomor Telepon", name: "phoneNumber", type: "text" }, 
  { label: "Email", name: "email", type: "email" }, 
  { label: "Kata Sandi", name: "password", type: "password" },
  { label: "Alamat Domisili", name: "domicileAddress", type: "text"}, 
  { label: "Kota / Kabupaten", name: "cityOrRegency", type: "text"}, 
  { label: "Provinsi", name: "province", type: "text", defaultValue: "Sulawesi Utara" }, 
  { label: "Nama Toko", name: "storeName", type: "text"}, 
  { label: "Deskripsi Toko", name: "storeDescription", type: "textarea" },
  { label: "Alamat Produksi", name: "productionAddress", type: "text" },
  { label: "Nama Pemilik Rekening", name: "bankAccountOwner", type: "text" },
  { label: "Nama Bank", name: "bankName", type: "text" },
  { label: "Nomor Rekening", name: "bankAccountNumber", type: "text" }
 
];

export const loginFormControls = [
  {
    name: "identifier",
    label: "Email atau Nomor Telepon",
    type: "text",
    placeholder: "Masukkan email atau nomor telepon",
    required: true,
  },
  {
    name: "password",
    label: "Kata Sandi",
    type: "password",
    placeholder: "Masukkan kata sandi",
    required: true,
  },
];


export const adminSideBarMenuItems = [
  {
      id :'dashboard' ,
      label : 'Dashboard' ,
      path : '/admin/dashboard'
  },
  {
      id :'products' ,
      label : 'Products' ,
      path : '/admin/products'
  },
  
  {
      id :'orders' ,
      label : 'Orders' ,
      path : '/admin/orders'
  },
]

export const addProductFormElements = [
  {
    label: "Nama Barang",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Masukkan Nama Barang",
  },
  {
    label: "Deskripsi",
    name: "description",
    componentType: "textarea",
    placeholder: "Masukkan Deskripsi Produk",
  },
  {
    label: "Kategori",
    name: "category",
    componentType: "select",
    options: [
      { id: "home-decor", label: "Dekorasi Rumah" },
      { id: "accessories-fashion", label: "Aksesori & Fashion" },
      { id: "souvenirs", label: "Souvenir & Oleh-Oleh" },
      { id: "traditional-tools", label: "Peralatan Tradisional" },
      { id: "eco-friendly", label: "Produk Ramah Lingkungan" },
    ],
  },
  {
    label: "Harga",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Masukkan Harga Barang",
  },
  {
    label: "Harga Diskon",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Masukkan Harga Diskon (opsional)",
  },
  {
    label: "Jumlah Stok",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Masukkan Jumlah Stok",
  },
  { name: "weight", 
    label: "Berat (gram)", 
    type: "number", 
    placeholder: "Masukkan Berat Produk (gram)",
    required: true, min: 1, max: 100000 }
];


export const shoppingViewHeaderMenuItems = [
  {
    id: "home-decor",
    label: "Dekorasi Rumah",
    path: "/shop/listing",
  },
  {
    id: "accessories-fashion",
    label: "Aksesoris & Fashion",
    path: "/shop/listing",
  },
  {
    id: "souvenirs",
    label: "Souvenir & Oleh-Oleh",
    path: "/shop/listing",
  },
  {
    id: "traditional-tools",
    label: "Peralatan Tradisional",
    path: "/shop/listing",
  },
  {
    id: "eco-friendly",
    label: "Produk Ramah Lingkungan",
    path: "/shop/listing",
  },
];

export const categoryOptionsMap = {
  "home-decor": "Dekorasi Rumah",
  "accessories-fashion": "Aksesori & Fashion",
  "souvenirs": "Souvenir & Oleh-Oleh",
  "traditional-tools": "Peralatan Tradisional",
  "eco-friendly": "Produk Ramah Lingkungan",
};

export const filterOptions = {
  category: [
    { id: "home-decor", label: "Dekorasi Rumah" },
    { id: "accessories-fashion", label: "Aksesori & Fashion" },
    { id: "souvenirs", label: "Souvenir & Oleh-Oleh" },
    { id: "traditional-tools", label: "Peralatan Tradisional" },
    { id: "eco-friendly", label: "Produk Ramah Lingkungan" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Harga: Terendah - Tertinggi" },
  { id: "price-hightolow", label: "Harga: Tertinggi - Terendah" },
  { id: "title-atoz", label: "Nama: A - Z" },
  { id: "title-ztoa", label: "Nama: Z - A" },
];

export const addressFormControls = [
  {
    label: "Nama Penerima",
    name: "receiverName",
    componentType: "input",
    type: "text",
    placeholder: "Masukkan Nama Penerima",
    maxLength: 50,
  },
  {
    label: "Alamat",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Masukkan Alamat Anda",
  },
  {
    label: "Kota/Kabupaten",
    name: "cityOrRegency",
    placeholder: "Pilih kota atau kabupaten",
    componentType: "select",
    options: sulutRegions.map((region) => ({
      id: region,      // menyesuaikan struktur CommonForm
      label: region,   // tetap untuk tampilan
    })),
  },
  {
    label: "Kode Pos",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Masukkan Kode Pos Anda",
  },
  {
    label: "Nomor Telepon",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Masukkan Nomor Telepon Penerima",
  },
  {
    label: "Catatan",
    name: "notes",
    componentType: "textarea",
    placeholder: "Masukkan catatan tambahan (jika ada)",
  },
];

export const orderStatusLabels = {
  pending: "Menunggu Konfirmasi",
  processing: "Diproses",
  shipped: "Dalam Pengiriman",
  delivered: "Sudah Diterima",
  rejected: "Ditolak",
};

export const orderStatusColors = {
  "Menunggu Konfirmasi": "bg-gray-500",
  "Diproses": "bg-yellow-500",
  "Dalam Pengiriman": "bg-blue-500",
  "Sudah Diterima": "bg-green-500",
  "Ditolak": "bg-red-600",
};




