import {
    List,
    Datagrid,
    TextField,
    DateField,
    NumberField,
    TextInput,
  } from "react-admin";
  
  const warehouseFilters = [
    <TextInput source="name" label="Search by name" alwaysOn />,
  ];
  
  const ListWareHouses = () => {
    return (
      <List filters={warehouseFilters} perPage={10}  exporter={false}>
        <Datagrid rowClick="show">
          
          <NumberField source="id" />
  
          <TextField source="name" label="Warehouse Name" />
  
          <TextField source="location" />
  
         
          <TextField source="company.name" label="Company" />
  
          <DateField source="createdAt" showTime />
  
        </Datagrid>
      </List>
    );
  };
  
  export default ListWareHouses;