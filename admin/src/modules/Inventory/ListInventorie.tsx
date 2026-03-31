import { Link } from "react-router-dom";
import {
    List,
    Datagrid,
    TextField,
    NumberField,
    Filter,
    TextInput,
    EditButton,
    ShowButton,
    FunctionField,
    useRecordContext,
  } from "react-admin";
  
  const InventoryFilter = (props: any) => (
    <Filter {...props}>
      {/* <TextInput label="Search SKU" source="sku" alwaysOn /> */}
      <TextInput label="Search SKU" source="variant.sku" alwaysOn />
      <TextInput label="Warehouse" source="warehouse.name" />
      <TextInput label="Product" source="variant.product.name" />
    </Filter>
  );
  
//   const AvailableField = ({ record }: any) => {
//     if (!record) return null;
//     return <span>{record.quantity - record.reserved}</span>;
//   };


const CustomShowButton = () => {
    const record = useRecordContext();
  
    if (!record) return null;
  
    return (
      <ShowButton
        component={Link}
        to={{
          pathname: `/inventories/${record.id}/show`,
        //  search: `?variantId=${record.variantId}&warehouseId=${record.warehouseId}`,
          search: `?variantId=${record.variant?.id}&warehouseId=${record.warehouse?.id}`,
        }}
      />
    );
  };
  
  export const ListInventorie = () => (
    <List filters={<InventoryFilter />} exporter={false}>
      <Datagrid rowClick="show"> {/* optional: click row to show */}
  
        <TextField source="id" />
  
        {/* Warehouse */}
        <TextField source="warehouse.name" label="Warehouse" />
  
        {/* Variant */}
        <TextField source="variant.sku" label="SKU" />
        <TextField source="variant.color" />
        <TextField source="variant.size" />
  
        {/* Product */}
        <TextField source="variant.product.name" label="Product" />
  
        {/* Stock */}
        <NumberField source="quantity" />
        <NumberField source="reserved" />
  
        {/* Available */}
        <FunctionField
          label="Available"
          render={(record: any) => record.quantity - record.reserved}
        />
  
        {/* ✅ Action Buttons */}
        {/* <ShowButton /> */}
        {/* <ShowButton
  record={{
    ...record,
    meta: {
      variantId: record.variantId,
      warehouseId: record.warehouseId,
    },
  }}
/>
       */}

 <CustomShowButton/>
<EditButton />
{/* <FunctionField
  label="Actions"
  render={(record: any) => (
    <Link
      to={`/inventories/${record.id}/show?variantId=${record.variantId}&warehouseId=${record.warehouseId}`}
    >
      Show
    </Link>
  )}
/>
   */}
      </Datagrid>
    </List>
  );