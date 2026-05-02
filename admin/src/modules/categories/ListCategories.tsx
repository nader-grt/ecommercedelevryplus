import {
  List,
  Datagrid,
  TextField,
  EditButton,

} from "react-admin";
import { CustomDeleteButton } from "./CustomDeleteButton";

export const ListCategories = () => (
  <List exporter={false}>
    <Datagrid rowClick={false}>
      <TextField
        source="id"
        sx={{
          maxWidth: "16em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      />

      <TextField
        source="name"
        sx={{
          maxWidth: "16em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      />

      <EditButton />
      <CustomDeleteButton />
    </Datagrid>
  </List>
);