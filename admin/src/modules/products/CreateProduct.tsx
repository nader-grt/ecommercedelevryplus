import {
  Create,
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
// FILE INPUT (IMPORTANT FIX)
// ===============================
const ProductImageInput = () => {
  const { setValue } = useFormContext();

  return (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];

        if (file) {
          setValue("imageName", file); // 🔥 MUST MATCH backend
        }
      }}
    />
  );
};

// ===============================
// CREATE PRODUCT
// ===============================
export const CreateProduct = () => {
  return (
    <Create>
      <SimpleForm toolbar={<CustomToolbar />}>

        <TextInput source="name" validate={required()} />
        <NumberInput source="price" />

        <ReferenceInput source="categoryId" reference="categories">
          <SelectInput optionText="name" />
        </ReferenceInput>

        <TextInput source="supplierId" />

        <TextInput source="type" defaultValue="VARIABLE" />

        <ArrayInput source="variants" defaultValue={[]}>
          <SimpleFormIterator>
            <TextInput source="sku" />
            <TextInput source="color" />
            <TextInput source="size" />
            <NumberInput source="price" />
          </SimpleFormIterator>
        </ArrayInput>

        <ProductImageInput />

      </SimpleForm>
    </Create>
  );
};