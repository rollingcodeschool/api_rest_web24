import { v2 as cloudinary } from "cloudinary";
import Producto from "../models/Product.js";

//Configuración de cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//función para actualizar la imagen del producto
const updateImageCloudinary = async (req, res) => {
  try {
    //obtener el id del producto
    const { id } = req.params;

    //buscar el producto por su id
    let producto = await Producto.findById(id);

    //validar que el producto exista
    if (!producto) {
      return res.status(404).json({
        ok: false,
        message: `No existe un producto con el id: ${id}`,
      });
    }

    // //Verificar que el cliente mandó un archivo
    // if (!req.files || !req.files.archivo) {
    //   return res.sattus(400).json({
    //     ok: false,
    //     message: "No hay archivos",
    //   });
    // }

    //guardo la request del archivo
    let file = req.files.archivo;

    //verificar que tenga buffer
    if (!file.data) {
      return res.status(400).json({
        ok: false,
        message: "Error en buffer",
      });
    }

    //Generar el archivo base64
    const dataUri = `data:${file.mimetype};base64,${file.data.toString("base64")}`;

    //subir imagen en cloudinary
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const result = await cloudinary.uploader.upload(dataUri, options);
    // console.log(result);

    //guardar la imagen en la coleccion de productos
    producto.img = result.secure_url;
    await producto.save();

    return res.status(200).json({
      ok: true,
      message: "Imagen actualizada!",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

export { updateImageCloudinary };
