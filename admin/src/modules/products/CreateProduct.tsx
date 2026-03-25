import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  required,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  FormDataConsumer,
  ImageInput,
  ImageField,
  ReferenceInput,
} from "react-admin";

export const CreateProduct = () => {
  return (
    <Create>
      <SimpleForm>
        {/* NAME */}
        <TextInput
          source="name"
          label="Product Name"
          validate={[required()]}
        />

        {/* CATEGORY */}
        <ReferenceInput
          source="categoryId"
          reference="categories"
          label="Category"
        >
          <SelectInput optionText="name" />
        </ReferenceInput>

        {/* TYPE */}
        <SelectInput
          source="type"
          label="Product Type"
          choices={[
            { id: "SIMPLE", name: "Simple Product" },
            { id: "VARIABLE", name: "Variable Product" },
          ]}
          defaultValue="SIMPLE"
          validate={[required()]}
        />

        {/* PRICE (ALWAYS SHOWN) */}
        <FormDataConsumer>
          {({ formData }) => (
            <NumberInput
              source="price"
              label={
                formData?.type === "VARIABLE"
                  ? "Default Price (optional)"
                  : "Price"
              }
              validate={
                formData?.type === "SIMPLE" ? [required()] : []
              }
            />
          )}
        </FormDataConsumer>

        {/* VARIANTS (VARIABLE ONLY) */}
        <FormDataConsumer>
          {({ formData }) =>
            formData?.type === "VARIABLE" ? (
              <ArrayInput source="variants" label="Variants">
                <SimpleFormIterator>
                  <TextInput source="color" label="Color" />
                  <TextInput source="size" label="Size" />
                  <NumberInput source="price" label="Price" />
                </SimpleFormIterator>
              </ArrayInput>
            ) : null
          }
        </FormDataConsumer>

        {/* IMAGE */}
        <ImageInput
          source="image"
          label="Product Image"
          accept={{ "image/*": [] }}
          maxSize={7 * 1024 * 1024}
        >
          <ImageField source="src" title="preview" />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
};