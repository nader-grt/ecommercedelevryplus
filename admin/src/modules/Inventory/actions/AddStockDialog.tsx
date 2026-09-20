// AddStockDialog.tsx
import { useState } from "react";
import { useGetOne } from "react-admin";
import { httpclientService } from "../../../auth/httpclientService/httpclientService";
import { createPortal } from "react-dom";

export const AddStockDialog = ({ record, onClose }: any) => {
  const [qty, setQty] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  // const notify = useNotify();
  // const refresh = useRefresh();


  


const { data: fullRecord } = useGetOne("inventories", { id: record.id });


console.log("undifuned ## \t is \t ",{ data: fullRecord } )
const handleSubmit = async () => {
  
  const { json } = await httpclientService(
    "http://localhost:4000/api/inventories/add-stock",
    {
      method: "POST",
      body: JSON.stringify({
        variantId: fullRecord?.variantId,      // ← من useGetOne
        warehouseId: fullRecord?.warehouseId,  // ← من useGetOne
        quantity: qty,
      }),
    }
  );

};

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
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
        //  backgroundColor: "white",
          padding: 24,
          borderRadius: 8,
          minWidth: 400,
          maxWidth: 500,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>➕ Add Stock</h3>
        <p><strong>Inventory ID:</strong> {record?.id}</p>
        <p><strong>Variant ID:</strong> {record?.variant.product?.name}</p>
        <p><strong>Variant ID:</strong> {record?.variant?.sku}</p>
        <p><strong>Warehouse ID:</strong> {record?.warehouseId}</p>
        <p><strong>Current Quantity:</strong> {record?.quantity}</p>
        <p><strong>Reserved:</strong> {record?.reserved}</p>

        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          placeholder="Enter quantity to add"
          style={{ width: "100%", padding: 10, marginTop: 10, borderRadius: 4, border: "1px solid #ccc" }}
        />

        <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} disabled={loading} style={{ padding: "10px 20px", borderRadius: 4 }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ padding: "10px 20px", backgroundColor: "#1976d2", color: "white", border: "none", borderRadius: 4 }}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};