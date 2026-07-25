import { useState } from "react";
import {
  useNotify,
  useRefresh,
  useGetOne,
} from "react-admin";
import { createPortal } from "react-dom";
import { httpclientService } from "../../../auth/httpclientService/httpclientService";

export const AdjustStockDialog = ({ record, onClose }: any) => {
  const [actualQuantity, setActualQuantity] = useState<number | "">("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const notify = useNotify();
  const refresh = useRefresh();

  const { data: fullRecord } = useGetOne("inventories", {
    id: record.id,
  });

  const handleSubmit = async () => {
    if (actualQuantity === "") {
      notify("Actual quantity is required", {
        type: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      const { json } = await httpclientService(
        "http://localhost:4000/api/inventories/adjust-stock",
        {
          method: "POST",
          body: JSON.stringify({
            variantId: fullRecord?.variantId,
            warehouseId: fullRecord?.warehouseId,
            actualQuantity: Number(actualQuantity),
            reason: reason || undefined,
          }),
        }
      );

      notify(json?.message || "Stock adjusted successfully", {
        type: "success",
      });

      refresh();
      onClose();
    } catch (e: any) {
      notify(e.message || "Error while adjusting stock", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          padding: 24,
          borderRadius: 8,
          minWidth: 400,
          maxWidth: 500,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>⚖️ Adjust Stock</h3>

        <p><strong>Inventory ID:</strong> {record?.id}</p>
        <p><strong>Product:</strong> {record?.variant?.product?.name}</p>
        <p><strong>SKU:</strong> {record?.variant?.sku}</p>
        <p><strong>Warehouse:</strong> {record?.warehouse?.name}</p>
        <p><strong>Current Quantity:</strong> {record?.quantity}</p>
        <p><strong>Reserved:</strong> {record?.reserved}</p>

        <input
          type="number"
          placeholder="Actual Quantity *"
          value={actualQuantity}
          onChange={(e) =>
            setActualQuantity(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          style={{
            width: "100%",
            padding: 10,
            marginTop: 10,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />

        <input
          type="text"
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 10,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />

        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing..." : "Adjust Stock"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};