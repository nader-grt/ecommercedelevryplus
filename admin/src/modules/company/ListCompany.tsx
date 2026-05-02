import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ShowButton,
  EmailField,
} from "react-admin";

export const ListCompany = () => (
  <List exporter={false} perPage={25}>
    <Datagrid rowClick="show">

      <TextField source="id" />

      <TextField source="name" label="Company Name" />

      <TextField source="type" label="Type" />

      {/* OWNER */}
      <TextField source="owner.firstName" label="Owner Name" />
      <EmailField source="owner.email" label="Owner Email" />

      {/* NEW FIELD */}
      <TextField source="status" label="Status" />

      <EditButton />
      <ShowButton />

    </Datagrid>
  </List>
);