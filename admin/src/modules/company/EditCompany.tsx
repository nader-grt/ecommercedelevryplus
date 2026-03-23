import {
    Edit,
    SimpleForm,
    TextInput,
    SelectInput,
    BooleanInput,
  } from "react-admin";
  
  export const EditCompany = () => (
    <Edit>
      <SimpleForm>
        <TextInput source="id" disabled />
        <TextInput source="name" />
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
    </Edit>
  );