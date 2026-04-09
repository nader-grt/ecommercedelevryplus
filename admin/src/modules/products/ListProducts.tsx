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
  useRecordContext,
} from "react-admin";
import { useState } from "react";
import axios from "axios";
import { CreateVariantModal } from "../../shared/components/CreateVariantModal";

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
// 🔹 VARIANT EXPAND COMPONENT 🔥
// ===============================
//

const VariantExpand = () => {
  const record = useRecordContext<Product>();
  if (!record) return null;

  const variants = normalizeVariants(record);

  if (record.type !== "VARIABLE") {
    return <div style={{ padding: 10 }}>No variants</div>;
  }

  return (
    <div style={{ padding: "15px 30px", background: "gray" }}>
      <h4>Variants</h4>

      {variants.length === 0 && <p>No variants</p>}

      {variants.map((v, index) => (
        <div
          key={index}
          style={{
            padding: "8px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <strong>SKU:</strong> {v.sku || "-"} <br />
          <strong>Color:</strong> {v.color || "-"} <br />
          <strong>Price:</strong> {v.price} TND
        </div>
      ))}
    </div>
  );
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
      <Datagrid expand={<VariantExpand />} rowClick="expand">
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
            </>
          )}
        />
      </Datagrid>
    </List>
  );
};