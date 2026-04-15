import {
    Button,
    useNotify,
    useRefresh,
    Confirm,
  } from "react-admin";
  import { useState } from "react";
  import axios from "axios";
  
 export const DeleteProductVariantButton = ({ record }: any) => {
    const notify = useNotify();
    const refresh = useRefresh();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
  
    if (!record) return null;
  
    const handleDelete = async () => {
      try {
        setLoading(true);
  
        const res = await axios.delete(
          `http://localhost:4000/api/products/${record.id}`,
          { withCredentials: true }
        );
  
        const type = res.data?.type;
  
        if (type === "SOFT_DELETE") {
          notify("⚠️ Product archived (used in orders)", {
            type: "warning",
          });
        } else {
          notify("🗑️ Product deleted permanently", {
            type: "success",
          });
        }
  
        setOpen(false);
        refresh();
      } catch (e: any) {
        notify(e?.response?.data?.message || "Delete failed", {
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <>
        <Button
          label="Delete"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        />
  
        <Confirm
          isOpen={open}
          loading={loading}
          title="Delete Product"
          content="Are you sure you want to delete this product? If it's used in orders, it will be archived instead."
          onConfirm={handleDelete}
          onClose={() => setOpen(false)}
        />
      </>
    );
  };