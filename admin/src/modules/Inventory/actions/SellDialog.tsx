import { useState } from "react";
import { useDataProvider, useNotify, useRefresh } from "react-admin";

export const SellDialog = ({ record, onClose }: any) => {
    const [qty, setQty] = useState(0);
  
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();
  
    const handleSubmit = async () => {
      try {
        await dataProvider.create("inventories/confirm-sale", {
          data: {
            inventoryId: record.id,
            quantity: Number(qty),
          },
        });
  
        notify("Sold");
        refresh();
        onClose();
      } catch (e: any) {
        notify(e.message, { type: "error" });
      }
    };
  
    return (
      <div className="modal">
        <h3>Sell</h3>
        <input type="number" onChange={(e) => setQty(+e.target.value)} />
        <button onClick={handleSubmit}>Confirm</button>
      </div>
    );
  };