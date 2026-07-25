import {
    Create,
    SimpleForm,
    ReferenceInput,
    AutocompleteInput,
    NumberInput,
  } from "react-admin";
  
  export const CreateInventorie = () => (
    <Create title="Add Stock">
      <SimpleForm>
  
        <ReferenceInput source="warehouseId" reference="warehouses">
          <AutocompleteInput optionText="name" />
        </ReferenceInput>
  
        <ReferenceInput source="variantId" reference="variants">
          <AutocompleteInput
            optionText={(r) =>
              r ? `${r.sku} - ${r.product?.name}` : ""
            }
          />
        </ReferenceInput>
  
        <NumberInput source="quantity" />
  
      </SimpleForm>
    </Create>
  );