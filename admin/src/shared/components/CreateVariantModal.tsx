import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button as MuiButton,
  } from "@mui/material";
  
  import {
    SimpleForm,
    TextInput,
    NumberInput,
    useNotify,
    useRefresh,
    useCreate,
  } from "react-admin";
  
  export const CreateVariantModal = ({
    open,
    onClose,
    productId,
  }: any) => {
    const notify = useNotify();
    const refresh = useRefresh();
    const [create] = useCreate();
  
    const handleSubmit = async (data: any) => {
      try {
        await create("variants", {
          data: {
            ...data,
            productId,
          },
        });
  
        notify("Variant created", { type: "success" });
        refresh();
        onClose();
      } catch (e: any) {
        notify(e.message, { type: "error" });
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Add Variant</DialogTitle>
  
        <DialogContent>
          <SimpleForm onSubmit={handleSubmit}>
            <TextInput source="sku" label="SKU" />
            <TextInput source="color" />
            <TextInput source="size" />
            <NumberInput source="price" />
          </SimpleForm>
        </DialogContent>
  
        <DialogActions>
          <MuiButton onClick={onClose}>Cancel</MuiButton>
        </DialogActions>
      </Dialog>
    );
  };