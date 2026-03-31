import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
  } from "react-admin";
  
  export const EditInventorie = () => (
    <Edit>
      <SimpleForm>
  
        {/* Read-only IDs (optional) */}
        <TextInput source="id" disabled />
  
        {/* Editable fields */}
        <NumberInput source="quantity" />
        <NumberInput source="reserved" />
  
      </SimpleForm>
    </Edit>
  );