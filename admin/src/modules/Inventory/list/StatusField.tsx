import { useRecordContext } from "react-admin";

export const StatusField = () => {
  const record = useRecordContext<any>();
  if (!record) return null;

  if (record.available === 0) {
    return <span style={{ color: "red", fontWeight: "bold" }}>❌ Out</span>;
  }

  if (record.available < (record.variant?.minStock || 10)) {
    return <span style={{ color: "orange" }}>⚠️ Low</span>;
  }

  if (record.reserved > record.quantity * 0.7) {
    return <span style={{ color: "purple" }}> High</span>;
  }

  return <span style={{ color: "green" }}> OK</span>;
};