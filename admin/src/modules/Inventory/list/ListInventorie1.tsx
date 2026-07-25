// import { Link } from "react-router-dom";
// import {
//     List,
//     Datagrid,
//     TextField,
//     NumberField,
//     Filter,
//     TextInput,
//     EditButton,
//     ShowButton,
//     FunctionField,
//     useRecordContext,
//   } from "react-admin";
  
//   const InventoryFilter = (props: any) => (
//     <Filter {...props}>
//       {/* <TextInput label="Search SKU" source="sku" alwaysOn /> */}
//       <TextInput label="Search SKU" source="variant.sku" alwaysOn />
//       <TextInput label="Warehouse" source="warehouse.name" />
//       <TextInput label="Product" source="variant.product.name" />
//     </Filter>
//   );
  
// //   const AvailableField = ({ record }: any) => {
// //     if (!record) return null;
// //     return <span>{record.quantity - record.reserved}</span>;
// //   };


// const CustomShowButton = () => {
//     const record = useRecordContext();
  
//     if (!record) return null;
  
//     return (
//       <ShowButton
//         component={Link}
//         to={{
//           pathname: `/inventories/${record.id}/show`,
//         //  search: `?variantId=${record.variantId}&warehouseId=${record.warehouseId}`,
//           search: `?variantId=${record.variant?.id}&warehouseId=${record.warehouse?.id}`,
//         }}
//       />
//     );
//   };
  
//   export const ListInventorie = () => (
//     <List filters={<InventoryFilter />} exporter={false}>
//       <Datagrid rowClick="show"> {/* optional: click row to show */}
  
//         <TextField source="id" />
  
//         {/* Warehouse */}
//         <TextField source="warehouse.name" label="Warehouse" />
  
//         {/* Variant */}
//         <TextField source="variant.sku" label="SKU" />
//         <TextField source="variant.color" />
//         <TextField source="variant.size" />
  
//         {/* Product */}
//         <TextField source="variant.product.name" label="Product" />
  
//         {/* Stock */}
//         <NumberField source="quantity" />
//         <NumberField source="reserved" />
  
//         {/* Available */}
//         <FunctionField
//           label="Available"
//           render={(record: any) => record.quantity - record.reserved}
//         />
  
//         {/*  Action Buttons */}
//         {/* <ShowButton /> */}
//         {/* <ShowButton
//   record={{
//     ...record,
//     meta: {
//       variantId: record.variantId,
//       warehouseId: record.warehouseId,
//     },
//   }}
// />
//        */}

// <FunctionField
//         label="Status"
//         render={(record: any) =>
//           record.available === 0
//             ? " Out"
//             : record.available < 10
//             ? "⚠️ Low"
//             : " OK"
//         }
//       />

//  <CustomShowButton/>
// <EditButton />
// {/* <FunctionField
//   label="Actions"
//   render={(record: any) => (
//     <Link
//       to={`/inventories/${record.id}/show?variantId=${record.variantId}&warehouseId=${record.warehouseId}`}
//     >
//       Show
//     </Link>
//   )}
// />
//    */}
//       </Datagrid>
//     </List>
//   );




import {
  List,
  Datagrid,
  TextField,
  NumberField,
  TextInput,
  FunctionField,
  useRecordContext,
  TopToolbar,
  CreateButton,
} from "react-admin";

// ==============================
// 🔍 FILTERS (Business oriented)
// ==============================
const InventoryFilter = [
  <TextInput source="variant.sku" label="SKU" alwaysOn />,
  <TextInput source="variant.product.name" label="Product" />,
  <TextInput source="warehouse.name" label="Warehouse" />,

  // 🔥 Business filters
  <TextInput source="available_lt" label="Low Stock (<)" />,
  <TextInput source="available_eq" label="Out of Stock (=0)" />,
];

// ==============================
// 📊 STATUS FIELD (Smart)
// ==============================
const StatusField = () => {
  const record = useRecordContext<any>();
  if (!record) return null;

  if (record.available === 0) {
    return <span style={{ color: "red", fontWeight: "bold" }}>❌ Out</span>;
  }

  if (record.available < (record.variant?.minStock || 10)) {
    return <span style={{ color: "orange" }}>⚠️ Low</span>;
  }

  if (record.reserved > record.quantity * 0.7) {
    return <span style={{ color: "purple" }}>🔥 High Demand</span>;
  }

  return <span style={{ color: "green" }}>✅ OK</span>;
};

// ==============================
// ⚡ ACTIONS (CORE BUSINESS)
// ==============================
const ActionsField = () => {
  const record = useRecordContext<any>();
  if (!record) return null;

  const handleAddStock = () => {
    // open dialog / call API
    console.log("Add Stock", record);
  };

  const handleReserve = () => {
    console.log("Reserve", record);
  };

  const handleSell = () => {
    console.log("Sell", record);
  };

  const handleTransfer = () => {
    console.log("Transfer", record);
  };

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button onClick={handleAddStock}>➕</button>
      <button onClick={handleReserve}>🔒</button>
      <button onClick={handleSell}>💰</button>
      <button onClick={handleTransfer}>🔁</button>
    </div>
  );
};

// ==============================
// 📦 MAIN LIST
// ==============================
export const ListInventorie = () => (
  <List filters={InventoryFilter} perPage={25} exporter={false}>
    <Datagrid rowClick="show">

      {/* ID */}
      <TextField source="id" />

      {/* Product */}
      <TextField source="variant.product.name" label="Product" />

      {/* SKU */}
      <TextField source="variant.sku" label="SKU" />

      {/* Attributes */}
      <TextField source="variant.color" label="Color" />
      <TextField source="variant.size" label="Size" />

      {/* Unit (🔥 مهم للدبوات) */}
      <TextField source="variant.unit" label="Unit" />

      {/* Warehouse */}
      <TextField source="warehouse.name" label="Warehouse" />

      {/* Stock */}
      <NumberField source="quantity" />
      <NumberField source="reserved" />

      {/* Available */}
      <FunctionField
        label="Available"
        render={(record: any) => record.quantity - record.reserved}
      />

      {/* Status */}
      <StatusField />

      {/* Actions */}
      <ActionsField />

    </Datagrid>
  </List>
);