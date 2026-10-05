import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  MenuItem,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { httpclientService } from "../../auth/httpclientService/httpclientService";

const apiUrl = "http://localhost:4000/api";

export const EditCompanySetting = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCompanySettings = async () => {
      try {
        setLoading(true);
        setError("");

        const { json } = await httpclientService(
          `${apiUrl}/company/settings`
        );

        console.log("Edit Company Settings response:", json);

        const data = json?.message?.data;

        if (!data) {
          throw new Error("Company settings data not found");
        }

        setSettings(data);
      } catch (error) {
        console.error("Edit Company Settings error:", error);
        setError("Unable to load company settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanySettings();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setSettings((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = sessionStorage.getItem("accessToken");

      const response = await fetch(`${apiUrl}/company/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          currency: settings.currency,
          language: settings.language,
          timezone: settings.timezone,
          taxRate: settings.taxRate,
          logoCompany: settings.logoCompany,
          addressCompany: settings.addressCompany,
          phoneCompany: settings.phoneCompany,
          emailCompany: settings.emailCompany,
          isActive: settings.isActive,
        }),
      });

      const json = await response.json();

      console.log("Company Settings PUT response:", json);

      if (!response.ok) {
        throw new Error(
          json?.message || "Failed to update company settings"
        );
      }

      const updatedSettings = json?.message?.data;

      if (updatedSettings) {
        setSettings(updatedSettings);
      }

      setSuccess("Company settings updated successfully.");

    } catch (error) {
      console.error("Company Settings update error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update company settings."
      );
    } finally {
      setSaving(false);
    }
  };

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

  if (error && !settings) {
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
          Edit Company Settings
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Update your company's configuration and preferences.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Currency"
              name="currency"
              value={settings.currency ?? ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Language"
              name="language"
              value={settings.language ?? ""}
              onChange={handleChange}
            >
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ar">Arabic</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Timezone"
              name="timezone"
              value={settings.timezone ?? ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Tax Rate (%)"
              name="taxRate"
              value={settings.taxRate ?? ""}
              onChange={handleChange}
              inputProps={{
                min: 0,
                max: 100,
                step: 0.01,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Company Address"
              name="addressCompany"
              value={settings.addressCompany ?? ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Company Phone"
              name="phoneCompany"
              value={settings.phoneCompany ?? ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="email"
              label="Company Email"
              name="emailCompany"
              value={settings.emailCompany ?? ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Company Logo"
              name="logoCompany"
              value={settings.logoCompany ?? ""}
              onChange={handleChange}
            />
          </Grid>

        </Grid>

        <Divider sx={{ my: 3 }} />

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{ mr: 2 }}
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/company-settings")}
          disabled={saving}
        >
          Cancel
        </Button>
      </CardContent>
    </Card>
  );
};