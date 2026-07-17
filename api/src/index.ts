import app from "./app";
import { sequelize } from "./models/main.js";

const PORT = 4000;

async function startServer() {

  try {

    await sequelize.authenticate();

    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });

  } catch (err) {

    console.error(err);

    process.exit(1);
  }
}

startServer();