import { useState } from "react";
import { useRecordContext } from "react-admin";
import { AddStockDialog } from "./AddStockDialog";
import { AdjustStockDialog } from "./AdjustStockDialog";
import { ReserveDialog } from "./ReserveDialog";
import { ConfirmSaleDialog } from "./ConfirmSaleDialog";
import { TransferDialog } from "./TransferDialog";

export const ActionsField = () => {
  const record = useRecordContext<any>();
  const [action, setAction] = useState<string | null>(null);

  if (!record) return null;

  const handleClick = (e: React.MouseEvent, actionType: string) => {
    e.stopPropagation();
    e.preventDefault();
    setAction(actionType);
  };

  return (
    <>
      <div
        style={{ display: "flex", gap: 6 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={(e) => handleClick(e, "add")}>➕</button>
        <button onClick={(e) => handleClick(e, "adjust")}>⚖️</button>
        <button onClick={(e) => handleClick(e, "reserve")}>🔒</button>
        <button onClick={(e) => handleClick(e, "sell")}>💰</button>
        <button onClick={(e) => handleClick(e, "transfer")}>🔁</button>
      </div>

      {action === "add" && (
        <AddStockDialog
          record={record}
          onClose={() => setAction(null)}
        />
      )}

      {action === "adjust" && (
        <AdjustStockDialog
          record={record}
          onClose={() => setAction(null)}
        />
      )}

      {action === "reserve" && (
        <ReserveDialog
          record={record}
          onClose={() => setAction(null)}
        />
      )}

      {action === "sell" && (
        <ConfirmSaleDialog
          record={record}
          onClose={() => setAction(null)}
        />
      )}

      {action === "transfer" && (
        <TransferDialog
          record={record}
          onClose={() => setAction(null)}
        />
      )}
    </>
  );
};