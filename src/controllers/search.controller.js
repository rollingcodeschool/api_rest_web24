import mongoose from "mongoose";

//Importar para verificar si es un ID
const { ObjectId } = mongoose.Types;

//importar los modelos
import Categoria from "../models/category.js";
import Producto from "../models/Product.js";

//definir las colecciones permitidas
const coleccionesPermitidas = ["categorias", "productos"];

//Función para buscar por categoría
const searchCategory = async (termino, res) => {
  //verificar si en vez del nombre manda el id
  const isMongoId = ObjectId.isValid(termino);
  if (isMongoId) {
    const categoria = await Categoria.findById(termino).populate(
      "usuario",
      "username",
    );
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }

  //Si la búsqueda es por el nombre
  const regex = new RegExp(termino, "i");

  const categorias = await Categoria.find({
    nombre: regex,
    estado: true,
  }).populate("usuario", "username");

  return res.status(200).json({
    total: categorias.length,
    results: categorias,
  });
};

//Función para buscar productos
const searchProduct = async (termino, res) => {
  //verificar si manda el id como termino
  const isMongoId = ObjectId.isValid(termino);
  if (isMongoId) {
    const producto = await Producto.findById(termino)
      .populate("usuario", "username")
      .populate("categoria", "nombre");

    return res.status(200).json({
      results: producto ? [producto] : [],
    });
  }

  //si el término es el nombre del producto
  const regex = new RegExp(termino, "i");

  const productos = await Producto.find({
    nombre: regex,
    estado: true,
  })
    .populate("usuario", "username")
    .populate("categoria", "nombre");

  return res.status(200).json({
    total: productos.length,
    results: productos,
  });
};

//Crear el controlador con la búsqueda flexible
const search = async (req, res) => {
  const { coleccion, termino } = req.params;

  //verificar si la coleccion está permitida
  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      ok: false,
      message: `Las colecciones permitidas son ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "categorias":
      searchCategory(termino, res);
      break;
    case "productos":
      searchProduct(termino, res);
      break;
    default:
      return res.status(500).json({
        ok: false,
        message: "No se generaron búsquedas",
      });
      break;
  }
};

export default search;
