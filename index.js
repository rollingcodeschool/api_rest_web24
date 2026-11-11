import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import fileUpload from "express-fileupload";

import { dbConnect } from "./src/config/database.js";
import authRoutes from "./src/routes/auth.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import mercadoRoutes from "./src/routes/mercado.routes.js";
import searchRoutes from "./src/routes/search.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";

const app = express();
const PORT = process.env.PORT || 4500;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(fileUpload()); //para que la app pueda accder a los archivos del body

//Rutas
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
//MercadoPago
app.use("/api/mercado", mercadoRoutes);
//Buscador
app.use("/api/search", searchRoutes);
//Upload
app.use("/api/upload", uploadRoutes);

await dbConnect();

app.listen(PORT, () => console.log(`Server online en puerto: ${PORT}`));
