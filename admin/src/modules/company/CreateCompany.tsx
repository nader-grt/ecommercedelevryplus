import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  AutocompleteInput,
  required,
  ArrayInput,
  SimpleFormIterator,
  NumberInput,
} from "react-admin";

export const CreateCompany = () => (
  <Create
    transform={(data: any) => ({
      company: {
        name: data.name,
        type: data.type,
        status: data.status || "ACTIVE",
        trade_name: data.trade_name,
        tax_number: data.tax_number,
        registration_number: data.registration_number,
      },
      owner: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        ownerId: data.ownerId,
        addresses: data.addresses || [],
      },
    })}
  >
    <SimpleForm>

      {/* ================= COMPANY ================= */}

      <TextInput source="name" label="Company Name" validate={required()} fullWidth />

      <TextInput source="trade_name" label="Trade Name" fullWidth />

      <TextInput source="tax_number" label="Tax Number" fullWidth />

      <TextInput source="registration_number" label="Registration Number" fullWidth />

      <SelectInput
        source="type"
        choices={[
          { id: "SHOP", name: "SHOP" },
          { id: "WAREHOUSE", name: "WAREHOUSE" },
          { id: "HYBRID", name: "HYBRID" },
        ]}
        defaultValue="SHOP"
        validate={required()}
        fullWidth
      />

      <SelectInput
        source="status"
        choices={[
          { id: "ACTIVE", name: "ACTIVE" },
          { id: "SUSPENDED", name: "SUSPENDED" },
          { id: "DELETED", name: "DELETED" },
        ]}
        defaultValue="ACTIVE"
        fullWidth
      />

      {/* ================= OWNER ================= */}

      <TextInput source="firstName" label="Owner First Name" validate={required()} fullWidth />

      <TextInput source="lastName" label="Owner Last Name" validate={required()} fullWidth />

      <TextInput source="email" label="Owner Email" validate={required()} fullWidth />

      <TextInput source="phone" label="Owner Phone" fullWidth />


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