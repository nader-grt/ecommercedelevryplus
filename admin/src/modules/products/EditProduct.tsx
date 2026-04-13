import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  Toolbar,
  SaveButton,
  useNotify,
  useRedirect,
  required,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import axios from "axios";

// ===============================
// 🔹 TOOLBAR
// ===============================
const CustomToolbar = () => (
  <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    <SaveButton />
  </Toolbar>
);

// ===============================
// 🔹 EDIT
// ===============================
export const EditProduct = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSave = async (values: any) => {
    try {
      const { id, variants = [], ...productData } = values;

      await axios.put(
        `http://localhost:4000/api/products/${id}`,
        {
          ...productData,
          variants,
        },
        { withCredentials: true }
      );

      notify("Product updated", { type: "success" });
      redirect("/products");
    } catch (e: any) {
      notify(e.message || "Error updating product", {
        type: "error",
      });
    }
  };

  return (
    <Edit>
      <SimpleForm toolbar={<CustomToolbar />} onSubmit={handleSave}>

        {/* ===================== */}
        {/* 🔹 PRODUCT FIELDS */}
        {/* ===================== */}
        <TextInput source="name" validate={required()} />
        <NumberInput source="price" />

        {/* ===================== */}
        {/* 🔥 FIX CATEGORY (IMPORTANT) */}
        {/* ===================== */}
        <ReferenceInput source="categoryId" reference="categories">
          <SelectInput optionText="name" />
        </ReferenceInput>

        <TextInput source="supplierId" />

        {/* ===================== */}
        {/* 🔹 VARIANTS */}
        {/* ===================== */}
        <ArrayInput source="variants" defaultValue={[]}>
          <SimpleFormIterator>
            <TextInput source="id" disabled />
            <TextInput source="sku" />
            <TextInput source="color" />
            <TextInput source="size" />
            <NumberInput source="price" />
          </SimpleFormIterator>
        </ArrayInput>

      </SimpleForm>
    </Edit>
  );
};