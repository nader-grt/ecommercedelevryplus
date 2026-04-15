export const buildProductFormDataProvider = (data: any) => {
  const formData = new FormData();

  console.log("🔥 REAL DATA:", data);

  // ======================
  // TEXT FIELDS
  // ======================
  formData.append("name", String(data?.name ?? "").trim());
  formData.append("price", String(data?.price ?? 0));
  formData.append("categoryId", String(data?.categoryId ?? ""));
  formData.append("supplierId", String(data?.supplierId ?? ""));
  formData.append("type", data?.type ?? "VARIABLE");

  // ======================
  // VARIANTS
  // ======================
  formData.append(
    "variants",
    JSON.stringify(data?.variants ?? [])
  );

  // ======================
  // IMAGE
  // ======================
  const file = data?.imageName;

  console.log("🔥 IMAGE FILE:", file);

  if (file instanceof File) {
    formData.append("imageName", file);
  }

  return formData;
};