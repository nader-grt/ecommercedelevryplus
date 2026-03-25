// import {
//   List,
//   Datagrid,
//   TextField,
//   ReferenceInput,
//   SelectInput,
//   ImageField,
// } from "react-admin";

// const productFilters = [
//   <ReferenceInput
//     key="category-filter"
//     label="Category"
//     source="categoryId"        
//     reference="categories"     
//     alwaysOn
//   >
//     <SelectInput optionText="name" />  
//   </ReferenceInput>,
// ];

// export const ListProducts = () => (
//   <List filters={productFilters}  exporter={false}>
//     <Datagrid>
//       <TextField source="name" />
//       <TextField source="price" />
//       <ImageField
//         source="urlImage"
//         label="Image"
//         sx={{ width: 100, height: 100, objectFit: "cover" }}
//       />
//     </Datagrid>
//   </List>
// );

import {
  List,
  Datagrid,
  TextField,
  ImageField,
  FunctionField,
  ReferenceInput,
  SelectInput,
  ChipField,
} from "react-admin";

const productFilters = [
  <ReferenceInput
    key="category-filter"
    label="Category"
    source="categoryId"
    reference="categories"
    alwaysOn
  >
    <SelectInput optionText="name" />
  </ReferenceInput>,
];

export const ListProducts = () => (
  <List filters={productFilters} exporter={false}>
    <Datagrid rowClick="edit">
      {/* 🧱 BASIC */}
      <TextField source="name" />

      {/* 🔥 TYPE */}
      <ChipField source="type" />

      {/* 💰 PRICE / VARIANTS LOGIC */}
      <FunctionField
        label="Price / Variants"
        render={(record: any) => {
          if (record.type === "SIMPLE") {
            return `${record.price} TND`;
          }

          if (record.type === "VARIABLE") {
            if (!record.variants || record.variants.length === 0) {
              return "No variants";
            }

            return `${record.variants.length} variants`;
          }

          return "-";
        }}
      />

      {/* 🧠 OPTIONAL: MIN/MAX PRICE */}
      <FunctionField
        label="Price Range"
        render={(record: any) => {
          if (!record.variants || record.variants.length === 0) {
            return "-";
          }

          const prices = record.variants.map((v: any) => v.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);

          return `${min} - ${max} TND`;
        }}
      />

      {/* 🖼️ IMAGE */}
      <ImageField
        source="urlImage"
        label="Image"
        sx={{ width: 80, height: 80, objectFit: "cover" }}
      />
    </Datagrid>
  </List>
);