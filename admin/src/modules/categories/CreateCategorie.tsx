import { Create, SimpleForm, TextInput, required, SaveButton, Toolbar } from "react-admin";

const CustomToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

export const CreateCategorie = () => (
  <Create>
    <SimpleForm toolbar={<CustomToolbar />}>
      <TextInput
        source="name"
        label="Category Name"
        validate={[required()]}
        fullWidth
      />
    </SimpleForm>
  </Create>
);