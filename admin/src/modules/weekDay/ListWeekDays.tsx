import { List, Datagrid, TextField } from "react-admin";

export const ListWeekDays = () => (
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
      <TextField source="nameDay"
      
      sx={{
        maxWidth: '16em',
        '&.MuiTableCell-body': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
    }}
      />

    
      {/* <ShowButton /> */}
    </Datagrid>
  </List>
);


