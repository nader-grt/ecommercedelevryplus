
import {
    Create,
    SimpleForm,
    TextInput,
   ReferenceInput,
    SelectInput,
  } from "react-admin";
  
  const CreateWareHouse = () => (
    <Create>
      <SimpleForm>
        <TextInput source="name" required />
        <TextInput source="location" required />
  
        {/* اختيار الشركة */}
        <ReferenceInput source="companyId" reference="companies">
          <SelectInput optionText="name" />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
  
  export default CreateWareHouse;