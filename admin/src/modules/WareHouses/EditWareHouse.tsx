
import {
    Edit,
    SimpleForm,
    TextInput,
    ReferenceInput,
    SelectInput,
  } from "react-admin";
  
  const EditWareHouse = () => (
    <Edit>
      <SimpleForm>
        <TextInput source="name" />
        <TextInput source="location" />
  
        <ReferenceInput source="companyId" reference="companies">
          <SelectInput optionText="name" />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );
  
  export default EditWareHouse;