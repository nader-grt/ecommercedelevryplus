import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { httpclientService } from "../../auth/httpclientService/httpclientService";

const apiUrl = "http://localhost:4000/api";

export const ShowCompanySetting = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanySettings = async () => {
      try {
        setLoading(true);
        setError("");

        const { json } = await httpclientService(
          `${apiUrl}/company/settings`
        );

        console.log("Company Settings response:", json);

        const data = json?.message?.data;

        if (!data) {
          throw new Error("Company settings data not found");
        }

        setSettings(data);
      } catch (error) {
        console.error("Company Settings error:", error);
        setError("Unable to load company settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanySettings();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (!settings) {
    return (
      <Card>
        <CardContent>
          <Alert severity="warning">
            No company settings found.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Company Settings
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Manage your company's configuration and preferences.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">
              Company ID
            </Typography>

            <Typography>
              {settings.companyId}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">
              Currency
            </Typography>

            <Typography>
              {settings.currency}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">
              Language
            </Typography>

            <Typography>
              {settings.language}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">
              Timezone
            </Typography>

            <Typography>
              {settings.timezone}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">
              Tax Rate
            </Typography>

            <Typography>
              {settings.taxRate}%
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">
              Active
            </Typography>

            <Typography>
              {settings.isActive ? "Yes" : "No"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">
              Company Address
            </Typography>

            <Typography>
              {settings.addressCompany || "-"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">
              Company Phone
            </Typography>

            <Typography>
              {settings.phoneCompany || "-"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">
              Company Email
            </Typography>

            <Typography>
              {settings.emailCompany || "-"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">
              Company Logo
            </Typography>

            <Typography>
              {settings.logoCompany || "-"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Button
          variant="contained"
          onClick={() => navigate("/company-settings/edit")}
        >
          Edit Settings
        </Button>
      </CardContent>
    </Card>
  );
};