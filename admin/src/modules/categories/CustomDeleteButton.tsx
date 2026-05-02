import { useState } from "react";
import {
  Button,
  useDataProvider,
  useNotify,
  useRefresh,
  useRecordContext,
} from "react-admin";
import DeleteModal from "./DeleteModal";




export const CustomDeleteButton = () => {
  const record = useRecordContext();

  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<any>(null);

  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleOpenConfirm = (e: any) => {
    e.stopPropagation();

    setResult({
      status: "PENDING",
      id: record?.id,
    });

    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await dataProvider.delete("categories", {
        id: result.id,
      });

      const data = response.data;

      setResult(data);

      if (data.status === "DELETED") {
        notify("Deleted successfully", { type: "success" });
        refresh();
      }
    } catch (error: any) {
      notify(error.message || "Error", { type: "error" });
    }
  };

  return (
    <>
      <Button
        label="Delete"
        color="error"
        onClick={handleOpenConfirm}
      />

      <DeleteModal
        open={open}
        onClose={() => setOpen(false)}
        result={result}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};