import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import fightersRoutes from "./routes/fighersRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/fighters", fightersRoutes);

app.listen(5000, () => console.log("Backend running on port 5000"));