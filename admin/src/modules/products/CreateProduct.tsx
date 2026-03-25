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
        {/* BASIC */}
        <TextInput source="name" label="Product Name" validate={[required()]} />


        <ReferenceInput
          source="categoryId"
          reference="categories"
          label="Category"
        //  validate={[required()]}
        >
          <SelectInput optionText="name" />
        </ReferenceInput>
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

        {/* PRICE (ONLY SIMPLE) */}
        <FormDataConsumer>
          {({ formData }) =>
            formData?.type === "SIMPLE" ? (
              <NumberInput
                source="price"
                label="Price"
                validate={[required()]}
              />
            ) : null
          }
        </FormDataConsumer>

        {/*  VARIANTS (ONLY VARIABLE) */}
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

        {/*  IMAGE (FIXED TS ERROR) */}
        <ImageInput
          source="image"
          label="Product Image"
          accept={{ "image/*": [] }} //  FIX TypeScript error
          maxSize={7 * 1024 * 1024} // 7MB
        >
          <ImageField source="src" title="preview" />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
};