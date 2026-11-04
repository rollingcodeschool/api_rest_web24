import { Schema, model } from "mongoose";

const PaymentDataSchema = new Schema(
  {
    paymentId: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    currency_id: {
      type: String,
    },
    email: {
      type: String,
    },
    payment_method_id: {
      type: String,
    },
    status: {
      type: String,
    },
    status_detail: {
      type: String,
    },
    total_paid_amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

export default model("PaymentMercado", PaymentDataSchema);
