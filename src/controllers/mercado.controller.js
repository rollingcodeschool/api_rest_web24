import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
// import Mercado from "../models/Mercado.js";
import PaymentMercado from "../models/PaymentData.js";

//Agrego modelo de carrito
import Cart from "../models/Cart.js";

const cliente = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN,
});

export const postPreference = async (req, res) => {
  try {
    const cart = await Cart.findOne({ usuario: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "No hay productos en el carrito",
      });
    }
    const preference = new Preference(cliente);

    const response = await preference.create({
      body: {
        items: [
          {
            title: "Pago total",
            unit_price: cart.total,
            quantity: 1,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: "https://frontendintegradorweb24.vercel.app/",
          failure: "https://frontendintegradorweb24.vercel.app/fallo",
          pending: "https://misitio.com/pendiente",
        },
        auto_return: "approved",
        notification_url:
          "https://eeeb-2803-9800-9443-a98a-c9f0-a379-ed9a-e266.ngrok-free.app/api/mercado/webhook",
      },
    });

    return res.status(200).json({
      ok: true,
      id: response.id,
      init_point: response.init_point, //url para realizar el pago
    });
  } catch (error) {
    console.log("Error al crear la referencia", error);
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

export const postWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    const topic = type || req.query.topic || req.query.type;
    const paymentId = data?.id || req.query["data.id"] || req.query.id;

    if (topic !== "payment" || !paymentId) {
      return res.status(200).json({
        ok: true,
        message: "Notificación ignorada",
      });
    }

    const payment = new Payment(cliente);
    const paymentData = await payment.get({ id: paymentId });

    console.log(`Estado del pago ${paymentId}:`, paymentData.status);

    if (paymentData.status !== "approved") {
      return res.status(200).json({
        ok: true,
        message: "El pago todavía no fue aprobado",
      });
    }

    const paymentRecord = {
      paymentId: String(paymentId),
      description: paymentData.description,
      currency_id: paymentData.currency_id,
      email: paymentData.payer.email,
      payment_method_id: paymentData.payment_method_id,
      status: paymentData.status,
      status_detail: paymentData.status_detail,
      total_paid_amount: paymentData.transaction_details.total_paid_amount,
    };

    try {
      await PaymentMercado.updateOne(
        { paymentId: paymentRecord.paymentId },
        { $setOnInsert: paymentRecord },
        { upsert: true },
      );
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }
    }

    /*
    EXPLICACIÓN
    updateOne(filtro, actualización, opciones) busca un documento cuyo paymentId coincida con el del pago recibido.
    $setOnInsert agrega los datos de paymentRecord solo si se va a insertar un documento nuevo. Si ya existe, no lo modifica.
    { upsert: true } significa: si no encuentra el documento, lo inserta.
    await espera a que MongoDB complete la operación.
    try/catch permite manejar errores de la base de datos.
    error.code === 11000 es un error de clave duplicada. Puede ocurrir si dos notificaciones intentan insertar el mismo pago casi simultáneamente y ambas encuentran que todavía no existe.
    
    
    */

    return res.status(200).json({
      ok: true,
      message: "El pago fue aprobado exitosamente!!",
    });
  } catch (error) {
    console.error("Error procesando el webhook:", error);
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};
