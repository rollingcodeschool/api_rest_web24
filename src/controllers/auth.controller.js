import User from "../models/User.js";
import { sendVerificationEmail } from "../config/nodemailer.js";
const getUsers = async (req, res) => {
  const users = await User.find();

  res.json({
    msg: "Todo bien",
    users,
  });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Crear el usuario
    const user = new User({ username, email, password });

    //Generar el código de verificación
    const verificationCode = user.generateVerificationCode();
    console.log(verificationCode);
    //Guardar el usuario
    await user.save();

    //Enviar el mail de verificación
    await sendVerificationEmail(email, username, verificationCode);
    //mandar respuesta
    return res.status(201).json({
      ok: true,
      msg: "Usuario creado!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("password");

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales incorrectas",
      });
    }

    //chequear que el password coincida
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

export { getUsers, register, login };
