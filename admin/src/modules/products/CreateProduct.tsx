import { Create, required, SimpleForm, TextInput } from "react-admin"

export const  CreateProduct = () =>  {
  return (
    <Create>
    <SimpleForm>
        <TextInput source="name" validate={[required()]} />
        <TextInput source="price" validate={[required()]} />
        <TextInput source="teaser" multiline={true} label="Short description" />
       {/* // <RichTextInput source="body" /> */}
    </SimpleForm>
</Create>
  )
}

