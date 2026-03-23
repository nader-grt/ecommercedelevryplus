import {
    Show,
    SimpleShowLayout,
    TextField,
    BooleanField,
  } from "react-admin";
  
  export const ShowCompany = () => (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="type" />
        <BooleanField source="isActive" />
      </SimpleShowLayout>
    </Show>
  );