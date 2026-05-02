import {
  List,
  Datagrid,
  TextField,
  EmailField,
  FunctionField,
  ShowButton,
} from "react-admin";
import { Chip, Tooltip } from "@mui/material";

export const OwnersCompanyList = () => (
  <List exporter={false} perPage={25} title="Company Owners">
    <Datagrid rowClick="show">

      {/* ================= OWNER ================= */}
      <TextField source="id" label="ID" />
      <TextField source="firstName" label="Owner Name" />
      <EmailField source="email" label="Email" />

      {/* ================= COMPANY ================= */}
      <FunctionField
        label="Company"
        render={(record: any) => record?.company?.name || "-"}
      />

      <FunctionField
        label="Type"
        render={(record: any) => record?.company?.type || "-"}
      />

      {/* ================= STATUS ================= */}
      <FunctionField
        label="Status"
        render={(record: any) => {
          const status = record?.company?.status;

          if (!status) return "-";

          const color =
            status === "ACTIVE"
              ? "success"
              : status === "SUSPENDED"
              ? "warning"
              : status === "DELETED"
              ? "error"
              : "default";

          return <Chip label={status} color={color as any} size="small" />;
        }}
      />

      {/* ================= ADDRESSES (SAFE + CLEAN) ================= */}
      <FunctionField
        label="Addresses"
        render={(record: any) => {
          const addresses = record?.addresses ?? [];
          const count = addresses.length;

          if (count === 0) {
            return <Chip label="0" size="small" />;
          }

          const first = addresses[0];
          const preview = `${first?.street || "-"}, ${first?.city || "-"}`;

          const tooltipText = addresses
            .map(
              (a: any) =>
                `${a.street || "-"}, ${a.city || "-"}, ${a.country || "-"}`
            )
            .join("\n");

          return (
            <Tooltip title={tooltipText} arrow>
              <Chip
                label={`${count} • ${preview}`}
                color="primary"
                size="small"
              />
            </Tooltip>
          );
        }}
      />

      <ShowButton />

    </Datagrid>
  </List>
);