import { Card, CardContent, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useGetList } from "react-admin";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const { total: totalWarehouses, data: warehouses, isLoading: loadingW } = useGetList("warehouses", { pagination: { page: 1, perPage: 50 }});
  const { total: totalCompanies, isLoading: loadingC } = useGetList("companies");
  const { total: totalUsers, isLoading: loadingU } = useGetList("users");

  const StatCard = ({ title, value, loading, color }: any) => (
    <Card sx={{ borderRadius: 3, boxShadow: 3, borderLeft: `6px solid ${color}` }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Box mt={1}>
          <Typography variant="h4" sx={{ color }}>{loading ? "..." : value || 0}</Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const pieData = warehouses?.map((w: any) => ({ name: w.company.name, value: 1 }))
      .reduce((acc: any[], curr: any) => {
        const existing = acc.find(a => a.name === curr.name);
        if (existing) existing.value += 1;
        else acc.push(curr);
        return acc;
      }, []) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF'];

  const barData = warehouses?.map((w: any) => ({ city: w.location.split(" - ")[0], count: 1 }))
    .reduce((acc: any[], curr: any) => {
      const existing = acc.find(a => a.city === curr.city);
      if (existing) existing.count += 1;
      else acc.push(curr);
      return acc;
    }, []) || [];

  const topWarehouses = warehouses?.slice(0, 5) || [];

  return (
    <Box p={2}>
      <Grid container spacing={2}>

        {/* KPI Cards */}
        <Grid item xs={12} md={4}><StatCard title="Warehouses" value={totalWarehouses} loading={loadingW} color="#1976d2" /></Grid>
        <Grid item xs={12} md={4}><StatCard title="Companies" value={totalCompanies} loading={loadingC} color="#2e7d32" /></Grid>
        <Grid item xs={12} md={4}><StatCard title="Users" value={totalUsers} loading={loadingU} color="#ed6c02" /></Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Warehouses by City</Typography>
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

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Warehouses by Company</Typography>
              <PieChart width={400} height={250}>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Warehouses */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top Warehouses</Typography>
              {topWarehouses.map((w: any) => (
                <Typography key={w.id}>• {w.name} ({w.location})</Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;