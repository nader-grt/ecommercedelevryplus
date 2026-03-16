import {
  List,
  Datagrid,
  TextField,
  ReferenceInput,
  SelectInput,
  ImageField,
} from "react-admin";

const productFilters = [
  <ReferenceInput
    key="category-filter"
    label="Category"
    source="categoryId"        
    reference="categories"     
    alwaysOn
  >
    <SelectInput optionText="name" />  
  </ReferenceInput>,
];

export const ListProducts = () => (
  <List filters={productFilters}  exporter={false}>
    <Datagrid>
      <TextField source="name" />
      <TextField source="price" />
      <ImageField
        source="urlImage"
        label="Image"
        sx={{ width: 100, height: 100, objectFit: "cover" }}
      />
    </Datagrid>
  </List>
);
