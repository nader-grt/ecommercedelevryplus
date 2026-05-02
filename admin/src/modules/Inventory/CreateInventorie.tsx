
import {
    Create,
    SimpleForm,
    ReferenceInput,
    SelectInput,
    NumberInput,
    AutocompleteInput,
  } from "react-admin";
  
  export const CreateInventorie = () => (
    <Create title="Add Stock">
      <SimpleForm>
  
        {/* Select Warehouse */}
        <ReferenceInput source="warehouseId" reference="warehouses">
          <SelectInput optionText="name" />
        </ReferenceInput>
  
        {/* Select Variant */}
        {/* <ReferenceInput source="variantId" reference="variants">
          <SelectInput optionText="sku" />
        </ReferenceInput> */}

{/* <ReferenceInput source="variantId" reference="variants">
  <SelectInput
    optionText={(record) =>
      `${record.sku} - ${record.product?.name}`
    }
  />
</ReferenceInput> */}
  

  {/* <ReferenceInput
  source="variantId"
  reference="variants"
  filterToQuery={(searchText) => ({ search: searchText })}
>
  <SelectInput
    optionText={(record) =>
      record ? `${record.sku} - ${record.product?.name}` : ""
    }
  />
</ReferenceInput> */}



<ReferenceInput source="variantId" reference="variants">
  <AutocompleteInput
    optionText={(record) =>
      record ? `${record.sku} - ${record.product?.name}` : ""
    }
  />
</ReferenceInput>
        {/* Quantity */}
        <NumberInput source="quantity" />
  
      </SimpleForm>
    </Create>
  );