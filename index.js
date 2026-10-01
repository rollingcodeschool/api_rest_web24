import express from "express";
import cors from "cors";
import { dbConnect } from "./src/config/database.js";
import authRoutes from "./src/routes/auth.routes.js";
const app = express();
const PORT = 4500;

app.use(express.json());
app.use(cors());

//Rutas
app.use("/api/auth", authRoutes);

await dbConnect();

app.listen(PORT, () => console.log(`Server online en puerto: ${PORT}`));
