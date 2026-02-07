import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import cpriRoutes from "./routes/cpri.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import workflowRoutes from "./routes/workflow.routes.js";
import reManufacturingRoutes from "./routes/reManufacturing.routes.js";
import testingRoutes from "./routes/testing.routes.js";
import searchRoutes from "./routes/search.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API Running"));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/testing", testingRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/cpri", cpriRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/workflow", workflowRoutes);
app.use("/api/re-manufacturing", reManufacturingRoutes);
app.use("/api/search", searchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
