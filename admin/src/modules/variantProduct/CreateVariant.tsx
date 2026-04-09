import {
    Create,
    NumberInput,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextInput,
  } from "react-admin";
  import { useLocation } from "react-router-dom";
  
  export const CreateVariant = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
  
    const productId = query.get("productId");
  
    return (
      <Create>
        <SimpleForm
          defaultValues={{
            productId: productId ? Number(productId) : undefined,
          }}
        >
  
          {/* PRODUCT */}
          <ReferenceInput source="productId" reference="products">
            <SelectInput optionText="name" />
          </ReferenceInput>
  
          {/* VARIANT FIELDS */}
          <TextInput source="sku" label="SKU" />
          <TextInput source="color" />
          <TextInput source="size" />
          <NumberInput source="price" />
  
        </SimpleForm>
      </Create>
    );
  };