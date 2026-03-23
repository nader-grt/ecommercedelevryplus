import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    ArrayInput,
    SimpleFormIterator,
    required,
    SaveButton,
    Toolbar,
  } from "react-admin";
  

  const CustomToolbar = () => (
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <SaveButton />
    </Toolbar>
  );
  export const EditUserAddress = () => (
    <Edit>
      <SimpleForm    toolbar={<CustomToolbar />}>
        <TextInput source="firstName" validate={required()} />
        <TextInput source="lastName" validate={required()} />
        {/* <TextInput source="email" type="email" validate={required()} /> */}
        <TextInput source="phone" validate={required()} />
        <TextInput source="role" />
  
        <ArrayInput source="addresses">
          <SimpleFormIterator>
            <NumberInput source="zipCode" validate={required()} />
            <TextInput source="street" validate={required()} />
            <TextInput source="city" validate={required()} />
            <TextInput source="country" validate={required()} />
            <TextInput source="delegation" />
            <TextInput source="addressSuplementaire" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );