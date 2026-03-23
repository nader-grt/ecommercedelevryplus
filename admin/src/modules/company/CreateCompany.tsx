import {
    Create,
    SimpleForm,
    TextInput,
    SelectInput,
    BooleanInput,
  } from "react-admin";
  
  export const CreateCompany = () => (
    <Create>
      <SimpleForm>
        <TextInput source="name" required />
        <SelectInput
          source="type"
          choices={[
            { id: "SHOP", name: "SHOP" },
            { id: "WAREHOUSE", name: "WAREHOUSE" },
            { id: "HYBRID", name: "HYBRID" },
          ]}
        />
        <BooleanInput source="isActive" />
      </SimpleForm>
    </Create>
  );