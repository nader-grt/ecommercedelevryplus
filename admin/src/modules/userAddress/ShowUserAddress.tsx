import {
    Show,
    SimpleShowLayout,
    TextField,
    ReferenceManyField,
    Datagrid,
    EditButton,
    DeleteButton,
  } from "react-admin";
  
  export const ShowUserAddress = () => (
    <Show>
      <SimpleShowLayout>
       
        <TextField source="id" />
        <TextField source="firstName" />
        <TextField source="lastName" />
        <TextField source="email" />
  
        
        <ReferenceManyField
          reference="usersAddress"
          target="userId"
          label="Addresses"
        >
          <Datagrid>
            <TextField source="id" />
            <TextField source="street" />
            <TextField source="city" />
            <TextField source="country" />
  
            <EditButton />
            <DeleteButton />
          </Datagrid>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );