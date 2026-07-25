import { TextInput } from "react-admin";

export const InventoryFilter = [
  <TextInput source="variant.sku" label="SKU" alwaysOn />,
  <TextInput source="variant.product.name" label="Product" />,
  <TextInput source="warehouse.name" label="Warehouse" />,

  // business filters
  <TextInput source="available_lt" label="Low Stock (<)" />,
  <TextInput source="available_eq" label="Out of Stock (=0)" />,
];