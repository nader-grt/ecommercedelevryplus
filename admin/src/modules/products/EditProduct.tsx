import { Toolbar } from "@mui/material";
import { Edit, required, SaveButton, SimpleForm, TextInput } from "react-admin";


const CustomToolbar = () => (
  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton />
  </Toolbar>
);


export const  EditProduct = ()=> {
  return (
    <div>EditProduct</div>
  )
}

