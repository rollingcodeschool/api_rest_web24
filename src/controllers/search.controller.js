import mongoose from "mongoose";
import Product from "../models/Product.js";

const { ObjectId } = mongoose.Types;

const buscarProductos = async (req, res) => {
  const { termino } = req.params;

  const esMongoId = ObjectId.isValid(termino);

  //buscar por id de producto
  if (esMongoId) {
    const producto = await Product.findById(termino).populate(
      "categoria",
      "nombre",
    );

    return res.status(200).json({
      results: producto ? [producto] : [],
    });
  }

  //buscar nombre de producto por término

  const regex = new RegExp(termino, "i");

  const productos = await Product.find({
    nombre: regex,
    estado: true,
  }).populate("categoria", "nombre");

  const total = await Product.countDocuments({
    nombre: regex,
    estado: true,
  });

  return res.status(200).json({
    total,
    results: productos,
  });
};

export { buscarProductos };
