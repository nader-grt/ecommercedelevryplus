import { Toolbar } from "@mui/material";
import { Edit, required, SaveButton, SimpleForm, TextInput } from "react-admin";


const CustomToolbar = () => (
  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton />
  </Toolbar>
);



export const EditUser = () => (
  <Edit>
    <SimpleForm         toolbar={<CustomToolbar />}>
      <TextInput source="id" disabled />
      <TextInput source="firstName" 
       validate={required()} 
       fullWidth 
      
      />
     
      <TextInput source="lastName" 
       validate={required()} 
       fullWidth 
      
      />
      <TextInput source="phone"
      
      validate={required()} 
      fullWidth 
      />
     
    </SimpleForm>
  </Edit>
);

// export default EditUser
/**
   firstName: 'user5',
      lastName: 'user',
      phone: '21655008007',
      email: 'user@test.com',
 */