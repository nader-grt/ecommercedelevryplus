
import { Show, SimpleShowLayout, TextField, DateField } from "react-admin";

const ShowWareHouse = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="name" />
      <TextField source="location" />
      <TextField source="company.name" />
      <DateField source="createdAt" />
    </SimpleShowLayout>
  </Show>
);

export default ShowWareHouse;