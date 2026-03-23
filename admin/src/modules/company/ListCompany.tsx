import {
    List,
    Datagrid,
    TextField,
    BooleanField,
    EditButton,
    ShowButton,
  } from "react-admin";
  
  export const ListCompany = () => (
    <List
    exporter={false}
    >
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="type" />
        <BooleanField source="isActive" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );