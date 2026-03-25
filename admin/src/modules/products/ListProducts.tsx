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
export const ListProducts = () => {
  return (
    <List filters={productFilters} exporter={false}>
      <Datagrid rowClick="edit">

        {/* BASIC */}
        <TextField source="name" />
        <TextField source="price"  label="base Price" />
        <ChipField source="type" />

        {/* NORMALIZE VARIANTS */}
        {/* <FunctionField
          label="Debug Variants"
          render={(record: any) => {
            const variants = record?.variants
              ? Array.isArray(record.variants)
                ? record.variants
                : [record.variants]
              : [];

            console.log("variants =>", variants);
            return variants.length;
          }}
        /> */}

        {/* PRICE / VARIANTS */}
        <FunctionField
          label="Price / Variants"
          render={(record: any) => {
            const variants = record?.variants
              ? Array.isArray(record.variants)
                ? record.variants
                : [record.variants]
              : [];

            if (record?.type === "SIMPLE") {
              return `${record.price} TND`;
            }

            if (record?.type === "VARIABLE") {
              if (variants.length === 0) {
                return "No variants";
              }

              return `${variants.length} variants`;
            }

            return "-";
          }}
        />

        {/* PRICE RANGE */}
        <FunctionField
          label="Min Max Price"
          render={(record: any) => {
            const variants = record?.variants
              ? Array.isArray(record.variants)
                ? record.variants
                : [record.variants]
              : [];

            if (variants.length === 0) return "-";

            const prices = variants
              .map((v: any) => Number(v.price))
              .filter(Boolean);

            const min = Math.min(...prices);
            const max = Math.max(...prices);

            return `${min} - ${max} TND`;
          }}
        />

        {/* IMAGE */}
        {/* <ImageField
          source="urlImage"
          label="Image"
          sx={{ width: 80, height: 80, objectFit: "cover" }}
        /> */}

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
      border: "3px solid #fff",
      boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
      transition: "all 0.3s ease",
    },
    "& img:hover": {
      transform: "scale(1.25)",
      boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
    },
  }}
/>

{/* <ImageField
  source="urlImage"
  label="Image"
  sx={{
    width: 80,
    height: 80,
    "& img": {
      width: 80,
      height: 80,
      borderRadius: "50%",
      objectFit: "cover",
    },
  }}
/> */}

      </Datagrid>
    </List>
  );
};