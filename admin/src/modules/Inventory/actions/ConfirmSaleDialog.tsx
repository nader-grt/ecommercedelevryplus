// components/dialogs/ConfirmSaleDialog.tsx
import { useState } from "react";
import { useNotify, useRefresh } from "react-admin";
import { httpclientService } from "../../../auth/httpclientService/httpclientService";
import { createPortal } from "react-dom";

export const ConfirmSaleDialog = ({ record, onClose }: any) => {
  const [reservationId, setReservationId] = useState<number | "">("");
  const [qty, setQty] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const notify = useNotify();
  const refresh = useRefresh();

  const handleSubmit = async () => {
    if (!reservationId) {
      notify("Reservation ID is required", { type: "warning" });
      return;
    }

    try {
      setLoading(true);

      const { json } = await httpclientService(
        "http://localhost:4000/api/inventories/confirm-sale",
        {
          method: "POST",
          body: JSON.stringify({
            reservationId: Number(reservationId),
            quantity: qty ? Number(qty) : undefined,
          }),
        }
      );

      notify(json?.message || "Sale confirmed successfully", {
        type: "success",
      });

      refresh();
      onClose();
    } catch (e: any) {
      notify(e.message || "Error while confirming sale", {
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
        <h3>💰 Confirm Sale</h3>

        <p>
          <strong>Inventory ID:</strong> {record?.id}
        </p>

        <p>
          <strong>Product:</strong> {record?.variant?.product?.name}
        </p>

        <p>
          <strong>SKU:</strong> {record?.variant?.sku}
        </p>

        <p>
          <strong>Current Quantity:</strong> {record?.quantity}
        </p>

        <p>
          <strong>Reserved:</strong> {record?.reserved}
        </p>

        <input
          type="number"
          placeholder="Reservation ID *"
          value={reservationId}
          onChange={(e) =>
            setReservationId(
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
          type="number"
          placeholder="Quantity (optional)"
          value={qty}
          onChange={(e) =>
            setQty(e.target.value === "" ? "" : Number(e.target.value))
          }
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
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: "10px 20px",
              borderRadius: 4,
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: 4,
            }}
          >
            {loading ? "Processing..." : "Confirm Sale"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};