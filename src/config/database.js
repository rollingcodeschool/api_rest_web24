import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/api_web24";

export const dbConnect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Base de datos conectada");
  } catch (error) {
    console.log("Error de conexión", error);
  }
};
