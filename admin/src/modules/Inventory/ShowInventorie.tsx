import { Show, SimpleShowLayout, TextField } from "react-admin";

export const ShowInventorie = () => {
  return (
    <Show
      queryOptions={{
        meta: {
          variantId: undefined,
          warehouseId: undefined,
        },
      }}
    >
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="warehouse.name" />
        <TextField source="variant.sku" />
        <TextField source="variant.color" />
        <TextField source="variant.size" />
        <TextField source="quantity" />
      </SimpleShowLayout>
    </Show>
  );
};