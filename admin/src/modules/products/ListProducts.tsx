import {
  List,
  Datagrid,
  TextField,
  ImageField,
  FunctionField,
  ReferenceInput,
  SelectInput,
  ChipField,
  Button,
  useNotify,
  useRefresh,
  EditButton,
} from "react-admin";
import { useState } from "react";
import axios from "axios";
import { CreateVariantModal } from "../../shared/components/CreateVariantModal";

import VariantExpandTwo from "./VariantExpandTwo";
import { DeleteProductVariantButton } from "./DeleteProductVariantButton";

//
// ===============================
// 🔹 TYPES
// ===============================
//

type Variant = {
  sku?: string;
  color?: string;
  price: number;
};

type Product = {
  id: number;
  name: string;
  type: "SIMPLE" | "VARIABLE";
  price?: number;
  variants?: Variant[] | Variant;
};

//
// ===============================
// 🔹 HELPERS
// ===============================
//

const normalizeVariants = (record?: Product): Variant[] => {
  if (!record?.variants) return [];

  return Array.isArray(record.variants)
    ? record.variants
    : [record.variants];
};



//
// ===============================
// 🔹 ACTION BUTTONS
// ===============================
//

// Convert SIMPLE → VARIABLE
const ConvertToVariableButton = ({ record }: { record?: Product }) => {
  const notify = useNotify();
  const refresh = useRefresh();

  if (!record || record.type !== "SIMPLE") return null;

  const handleClick = async () => {
    try {
      await axios.patch(
        `http://localhost:4000/api/products/${record.id}/convert-to-variable`,
        {},
        { withCredentials: true }
      );

      notify("Converted to VARIABLE", { type: "success" });
      refresh();
    } catch (error: any) {
      notify(error?.message || "Error occurred", { type: "error" });
    }
  };

  return <Button label="Convert" onClick={handleClick} />;
};

// Add Variant Modal
const AddVariantButton = ({ record }: { record?: Product }) => {
  const [open, setOpen] = useState(false);

  if (!record || record.type !== "VARIABLE") return null;

  return (
    <>
      <Button label="Add Variant" onClick={() => setOpen(true)} />
      <CreateVariantModal
        open={open}
        onClose={() => setOpen(false)}
        productId={record.id}
      />
    </>
  );
};


// Delete button product with variant 

// const DeleteProductVariantButton = ({ record }: any) => {
//   const notify = useNotify();
//   const refresh = useRefresh();

//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure?")) return;

//     try {
//       await axios.delete(
//         `http://localhost:4000/api/products/${record.id}`,
//         { withCredentials: true }
//       );

//       notify("Product deleted", { type: "success" });
//       refresh();
//     } catch (e: any) {
//       notify(e.message, { type: "error" });
//     }
//   };

//   return <Button label="Delete" onClick={handleDelete} />;
// };
//
// ===============================
// 🔹 FILTERS
// ===============================
//

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

//
// ===============================
// 🔹 LIST
// ===============================
//

export const ListProducts = () => {
  return (
    <List filters={productFilters} exporter={false}>
      <Datagrid expand={<VariantExpandTwo />} rowClick="expand">
        {/* BASIC */}
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="price" label="Base Price" />
        <ChipField source="type" />

        {/* VARIANTS INFO */}
        <FunctionField<Product>
          label="Variants"
          render={(record) => {
            const variants = normalizeVariants(record);

            if (record.type === "SIMPLE") {
              return `${record.price ?? 0} TND`;
            }

            return variants.length
              ? `${variants.length} variants`
              : "No variants";
          }}
        />

        {/* MIN MAX */}
        <FunctionField<Product>
          label="Min - Max"
          render={(record) => {
            const variants = normalizeVariants(record);

            if (!variants.length) return "-";

            const prices = variants
              .map((v) => Number(v.price))
              .filter(Boolean);

            if (!prices.length) return "-";

            return `${Math.min(...prices)} - ${Math.max(...prices)} TND`;
          }}
        />

        {/* IMAGE */}
        <ImageField
          source="urlImage"
          label="Image"
          sx={{
            width: 64,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& img": {
              width: 56,
              height: 56,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #fff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              transition: "0.3s",
            },
            "& img:hover": {
              transform: "scale(1.2)",
            },
          }}
        />

        {/* ACTIONS */}
        <FunctionField<Product>
          label="Actions"
          render={(record) => (
            <>
              <ConvertToVariableButton record={record} />
              <AddVariantButton record={record} />
              <DeleteProductVariantButton record={record} />
            </>
          )}
        />
        <EditButton 
        onClick={(e:any) => {
          e.stopPropagation(); //
        }}
        
        />
        
      </Datagrid>
    </List>
  );
};

// <DeleteProductVariantButton/>