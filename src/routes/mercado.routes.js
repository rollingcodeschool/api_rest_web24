import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  postPreference,
  postWebhook,
} from "../controllers/mercado.controller.js";
// import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
// import Mercado from "../models/Mercado.js";
const router = Router();

// const cliente = new MercadoPagoConfig({
//   accessToken: process.env.ACCESS_TOKEN,
// });

router.post("/create_preference", authenticate, postPreference);

router.post("/webhook", postWebhook);

//respuestas redireccionadas
router.get("/exito", async (req, res) => {
  const { payment_id, status, external_reference, merchant_order_id } =
    req.query;

  console.log("Datos recibidos en entorno de éxito:", {
    payment_id,
    status,
    external_reference,
    merchant_order_id,
  });

  //guardar en base de datos

  const mercado = new Mercado({
    payment_id,
    status,
    external_reference,
    merchant_order_id,
  });

  await mercado.save();

  return res.send(
    `<h1>¡Gracias por tu compra!</h1><p>Tu pago <strong>#${payment_id}</strong> fue procesado con éxito.</p> <p>Referencia de pedido: <strong>${external_reference}</strong></p>`,
  );
});

router.get("/fallo", (req, res) => {
  const { status } = req.query;
  return res.send(
    ` <h1>El pago no se pudo completar</h1> <p>Estado: ${status || "Rechazado/Cancelado"}</p> <a href="/create_preference">Intentar nuevamente</a> `,
  );
});

export default router;
