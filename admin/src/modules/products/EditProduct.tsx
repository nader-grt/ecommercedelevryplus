import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  Toolbar,
  SaveButton,
  required,
  ReferenceInput,
  SelectInput,
  ImageField,
} from "react-admin";

import { useFormContext } from "react-hook-form";

// ===============================
// TOOLBAR
// ===============================
const CustomToolbar = () => (
  <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    <SaveButton />
  </Toolbar>
);

// ===============================
// IMAGE INPUT
// ===============================
const ProductImageInput = () => {
  const { setValue } = useFormContext();

  return (
    <input
      type="file"
      name="imageName"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];

        if (file) {
          setValue("imageName", file);
        }
      }}
    />
  );
};

// ===============================
// EDIT PRODUCT
// ===============================
export const EditProduct = () => {
  return (
    <Edit>
      <SimpleForm toolbar={<CustomToolbar />}>
        
        {/* ================= */}
        {/* BASIC FIELDS */}
        {/* ================= */}
        <TextInput source="name" validate={required()} />
        <NumberInput source="price" />

        {/* CATEGORY */}
        <ReferenceInput source="categoryId" reference="categories">
          <SelectInput optionText="name" />
        </ReferenceInput>

        <TextInput source="supplierId" />
        <TextInput source="type" defaultValue="VARIABLE" />

        {/* ================= */}
        {/* VARIANTS */}
        {/* ================= */}
        <ArrayInput source="variants" defaultValue={[]}>
          <SimpleFormIterator>
            <TextInput source="sku" />
            <TextInput source="color" />
            <TextInput source="size" />
            <NumberInput source="price" />
          </SimpleFormIterator>
        </ArrayInput>

        {/* ================= */}
        {/* IMAGE PREVIEW */}
        {/* ================= */}
        <ImageField source="urlImage" />

        {/* ================= */}
        {/* IMAGE UPLOAD */}
        {/* ================= */}
        <ProductImageInput />

      </SimpleForm>
    </Edit>
  );
};