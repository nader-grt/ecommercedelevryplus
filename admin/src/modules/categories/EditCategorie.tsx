import {
  Edit,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  required,
} from "react-admin";

const CustomToolbar = () => (
  <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    <SaveButton />
  </Toolbar>
);

export const EditCategorie = () => (
  <Edit>
    <SimpleForm toolbar={<CustomToolbar />}>
      {/* ID read-only */}
      <TextInput source="id" disabled fullWidth />

      {/* Name */}
      <TextInput
        source="name"
        label="Category Name"
        validate={[required()]}
        fullWidth
      />
    </SimpleForm>
  </Edit>
);