
import {
    Create,
    SimpleForm,
    TextInput,
    NumberInput,
    ArrayInput,
    SimpleFormIterator,
    required,
  } from "react-admin";
  
  export const CreateUserAddress = () => (
    <Create>
      <SimpleForm>
        {/* ================= User Fields ================= */}
        <TextInput source="firstName" validate={required()} />
        <TextInput source="lastName" validate={required()} />
        <TextInput source="email" type="email" validate={required()} />
        <TextInput source="phone" validate={required()} />
        {/* <TextInput source="password" type="password" validate={required()} /> */}
        <TextInput source="role" defaultValue="USER" />
  
        {/* ================= Addresses Fields ================= */}
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
    </Create>
  );