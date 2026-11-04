import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const cliente = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN,
});

export const postPreference = async (req, res) => {
  try {
    const preference = new Preference(cliente);

    const response = await preference.create({
      body: {
        items: [
          {
            title: "Producto de prueba",
            unit_price: 100,
            quantity: 1,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success:
            "https://bd5d-2803-9800-9443-a98a-c9f0-a379-ed9a-e266.ngrok-free.app/api/mercado/exito",
          failure:
            "https://bd5d-2803-9800-9443-a98a-c9f0-a379-ed9a-e266.ngrok-free.app/api/mercado/fallo",
          pending: "https://misitio.com/pendiente",
        },
        auto_return: "approved",
        notification_url:
          "https://bd5d-2803-9800-9443-a98a-c9f0-a379-ed9a-e266.ngrok-free.app/api/mercado/webhook",
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

    if (topic === "payment" && paymentId) {
      const payment = new Payment(cliente);
      const paymentData = await payment.get({ id: paymentId });

      console.log(`Estado del pago ${paymentId}:`, paymentData.status);

      ///-----------------------------------------------
      if (paymentData.status === "approved") {
        console.log("El pago fue aprobado exitosamente!!");
        return res.status(200).json({
          ok: true,
          message: "El pago fue aprobado exitosamente!!",
        });
      }
    }
    ///--------------------------------------------------
  } catch (error) {
    console.error("Error procesando el webhook:", error);
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};
