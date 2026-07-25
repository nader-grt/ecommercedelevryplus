import {
    List,
    Datagrid,
    TextField,
    NumberField,
    FunctionField,
  } from "react-admin";
  
  import { InventoryFilter } from "./InventoryFilter";
  import { StatusField } from "./StatusField";
  import { ActionsField } from "../actions/ActionsField";
  
  export const ListInventorie = () => (
    <List filters={InventoryFilter} perPage={25} exporter={false}>
      <Datagrid rowClick="show">
  
        <TextField source="id" />
        <TextField source="variant.product.name" label="Product" />
        <TextField source="variant.sku" label="SKU" />
        <TextField source="variant.color" />
        <TextField source="variant.size" />
        <TextField source="variant.unit" />
  
        <TextField source="warehouse.name" />
  
        <NumberField source="quantity" />
        <NumberField source="reserved" />
  
        <FunctionField
          label="Available"
          render={(r: any) => r.quantity - r.reserved}
        />
  
        <StatusField />
        <ActionsField />
  
      </Datagrid>
    </List>
  );