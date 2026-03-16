import { List, Datagrid, TextField, EmailField, EditButton } from "react-admin";

export const ListUsers = () => (
  <List
  exporter={false}
  >
    <Datagrid>
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
      <EditButton />
    </Datagrid>
  </List>
);


