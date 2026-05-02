import { Card, CardContent, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useGetList } from "react-admin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const { total: totalWarehouses, data: warehouses = [], isLoading: loadingW } =
    useGetList("warehouses", { pagination: { page: 1, perPage: 50 } });

  const { total: totalCompanies, isLoading: loadingC } =
    useGetList("companies");

  const { total: totalUsers, isLoading: loadingU } =
    useGetList("users");

  //  OWNERS FIXED
  const {
    total: totalOwners,
    data: owners = [],
    isLoading: loadingO,
  } = useGetList("owners", {
    pagination: { page: 1, perPage: 50 },
  });

  // ================= KPI CARD =================
  const StatCard = ({ title, value, loading, color }: any) => (
    <Card sx={{ borderRadius: 3, boxShadow: 3, borderLeft: `6px solid ${color}` }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Box mt={1}>
          <Typography variant="h4" sx={{ color }}>
            {loading ? "..." : value ?? 0}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  // ================= SAFE KPI VALUES =================
  const safeTotalOwners = totalOwners ?? owners.length;
  const safeTotalWarehouses = totalWarehouses ?? warehouses.length;

  // ================= PIE DATA =================
  const pieData = warehouses
    .map((w: any) => ({
      name: w?.company?.name || "Unknown",
      value: 1,
    }))
    .reduce((acc: any[], curr: any) => {
      const existing = acc.find((a) => a.name === curr.name);
      if (existing) existing.value += 1;
      else acc.push(curr);
      return acc;
    }, []);

  // ================= BAR DATA =================
  const barData = warehouses
    .map((w: any) => ({
      city: w?.location?.split(" - ")?.[0] || "Unknown",
      count: 1,
    }))
    .reduce((acc: any[], curr: any) => {
      const existing = acc.find((a) => a.city === curr.city);
      if (existing) existing.count += 1;
      else acc.push(curr);
      return acc;
    }, []);

  // ================= OWNERS PER COMPANY =================
  const ownersByCompany = owners
    .map((o: any) => ({
      company: o?.company?.name || "No Company",
      count: 1,
    }))
    .reduce((acc: any[], curr: any) => {
      const existing = acc.find((a) => a.company === curr.company);
      if (existing) existing.count += 1;
      else acc.push(curr);
      return acc;
    }, []);

  // ================= OWNERS BY CITY (NEW ) =================
  const ownersByCity = owners
    .flatMap((o: any) => o.addresses || [])
    .map((addr: any) => ({
      city: addr?.city || "Unknown",
      count: 1,
    }))
    .reduce((acc: any[], curr: any) => {
      const existing = acc.find((a) => a.city === curr.city);
      if (existing) existing.count += 1;
      else acc.push(curr);
      return acc;
    }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

  const topWarehouses = warehouses.slice(0, 5);
  const topOwners = owners.slice(0, 5);

  return (
    <Box p={2}>
      <Grid container spacing={2}>

        {/* ================= KPI ================= */}
        <Grid item xs={12} md={3}>
          <StatCard title="Warehouses" value={safeTotalWarehouses} loading={loadingW} color="#1976d2" />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard title="Companies" value={totalCompanies ?? 0} loading={loadingC} color="#2e7d32" />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard title="Users" value={totalUsers ?? 0} loading={loadingU} color="#ed6c02" />
        </Grid>

        {/* FIXED KPI */}
        <Grid item xs={12} md={3}>
          <StatCard title="Owners" value={safeTotalOwners} loading={loadingO} color="#9c27b0" />
        </Grid>

        {/* ================= BAR ================= */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Warehouses by City</Typography>
              <BarChart width={400} height={250} data={barData}>
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1976d2" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>

        {/* ================= PIE ================= */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Warehouses by Company</Typography>
              <PieChart width={400} height={250}>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        {/* ================= OWNERS PER COMPANY ================= */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Owners per Company</Typography>
              <BarChart width={400} height={250} data={ownersByCompany}>
                <XAxis dataKey="company" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#9c27b0" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>

        {/* ================= NEW  OWNERS BY CITY ================= */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Owners by City</Typography>
              <BarChart width={400} height={250} data={ownersByCity}>
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ff5722" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>

        {/* ================= TOP ================= */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Top Warehouses</Typography>
              {topWarehouses.map((w: any) => (
                <Typography key={w.id}>
                  • {w.name} ({w.location})
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Top Owners</Typography>
              {topOwners.map((o: any) => (
                <Typography key={o.id}>
                  • {o.firstName} ({o?.company?.name || "No Company"})
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;