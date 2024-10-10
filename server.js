import express from "express";
import { configDotenv } from "dotenv";
import  connectDB  from "./services/DBConnection.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import cors from "cors";


configDotenv();
connectDB();

const app = express();
//app.use(cors({ origin: 'https://invocify-client.onrender.com' }));
app.use(express.json());
app.use(cookieParser());


app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
