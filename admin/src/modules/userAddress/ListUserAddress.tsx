import {
    List,
    Datagrid,
    TextField,
    NumberField,
    ReferenceField,
    EditButton,
    ShowButton,
    EmailField,
  } from "react-admin";
  
  export const ListUserAddress = () => (
    <List
    exporter={false}
    >
      <Datagrid>
        {/* <ReferenceField source="userId" reference="Users" label="User"> */}
        <TextField source="id"
      sx={{
        maxWidth: '16em',
        '&.MuiTableCell-body': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
    }}
      />
      <TextField source="firstName"
      
      sx={{
        maxWidth: '16em',
        '&.MuiTableCell-body': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
    }}
      />

      <TextField source="lastName"
      
      
      sx={{
        maxWidth: '16em',
        '&.MuiTableCell-body': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
    }}
      />
 
      
      <EmailField source="email" />
          <TextField source="phone" /> 
        {/* </ReferenceField> */}
        <TextField source="street" />
        <TextField source="city" />
        <TextField source="country" />
        <NumberField source="zipCode" />
        <TextField source="delegation" />
        <TextField source="addressSuplementaire" />
  
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );