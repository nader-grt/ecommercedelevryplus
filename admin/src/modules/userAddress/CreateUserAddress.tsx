import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  required,
  SelectInput,
} from "react-admin";

export const CreateUserAddress = () => (
  <Create>
    <SimpleForm>
      {/* ================= User Fields ================= */}
      <TextInput source="firstName" validate={required()} />
      <TextInput source="lastName" validate={required()} />
      <TextInput source="email" type="email" validate={required()} />
      <TextInput source="phone" validate={required()} />

      {/* ================= ROLE (NO ADMIN) ================= */}
      <SelectInput
        source="role"
        defaultValue="USER"
        choices={[
          { id: "USER", name: "User" },
          { id: "OWNER", name: "Owner" },
          { id: "SUPPLIER", name: "Supplier" },
          { id: "DELIVERER", name: "Deliverer" },
          { id: "SECRTRIE", name: "Secrtrie" },
        ]}
      />

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