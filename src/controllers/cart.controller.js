import Cart from "../models/Cart.js";
import Producto from "../models/Product.js";

//Obtener carrito del usuario
export const getItems = async (req, res) => {
  try {
    const cart = await Cart.findOne({ usuario: req.user._id }).populate(
      "items.producto",
    );
    // console.log(cart.items.length);
    return res.status(200).json(cart || { items: [], total: 0 });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

//Agregar item al carrito

export const addItem = async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;
    //traer los datos del producto
    let producto = await Producto.findById(productoId);
    //buscar el carrito del usuario
    let cart = await Cart.findOne({ usuario: req.user._id });

    if (!cart) {
      cart = new Cart({ usuario: req.user._id, items: [] });
    }

    //si el carrito existe
    const itemExiste = cart.items.find(
      (item) => item.producto.toString() === productoId,
    );
    // [producto, cantidad, precioUnitario]
    if (itemExiste) {
      itemExiste.cantidad += cantidad;
    } else {
      cart.items.push({
        producto: productoId,
        cantidad,
        precioUnitario: producto.precio,
      });
    }
    cart.calcularTotal();
    await cart.save();

    return res.status(201).json({
      ok: true,
      message: "Producto agregado al carrito",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

//eliminar un item del carrito

export const deleteItem = async (req, res) => {
  try {
    const { productoId } = req.params;
    let cart = await Cart.findOne({ usuario: req.user._id });

    if (!cart) {
      return res
        .status(404)
        .json({ ok: false, message: "Carrito no encontrado" });
    }

    cart.items = cart.items.filter(
      (item) => item.producto.toString() !== productoId,
    );

    cart.calcularTotal();
    await cart.save();

    const cartPopulate = await cart.populate("items.producto");

    return res.status(200).json({
      ok: true,
      cartPopulate,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

//actualizar cantidad de producto en el carrito
export const updateCant = async (req, res) => {
  try {
    const { productoId } = req.params;

    const { cantidad } = req.body;

    if (!cantidad || cantidad < 1) {
      return res.status(400).json({
        ok: false,
        message: "La cantidad debe ser mayor que 0",
      });
    }

    const cart = await Cart.findOne({ usuario: req.user._id });

    if (!cart) {
      return res.status(404).json({
        ok: false,
        message: "Carrito no encontrado",
      });
    }

    const item = cart.items.find(
      (item) => item.producto.toString() === productoId,
    );

    if (!item) {
      return res.status(404).json({
        ok: false,
        message: "Item no encontrado en el carrito",
      });
    }

    item.cantidad = cantidad;
    cart.calcularTotal();
    await cart.save();

    const cartPopulate = await cart.populate("items.producto");

    return res.status(200).json({
      ok: true,
      cartPopulate,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

// eliminar carrito
export const deleteCart = async (req, res) => {
  try {
    //buscar carrito del usuario
    const cart = await Cart.findOne({ usuario: req.user._id });
    if (!cart) {
      return res.status(404).json({
        ok: false,
        message: "Carrito no encontrado",
      });
    }

    cart.items = [];
    cart.total = 0;

    await cart.save();

    return res.status(200).json({
      ok: true,
      message: "Carrito vacio",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};
