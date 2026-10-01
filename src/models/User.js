import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    emailVerifed: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    verificationCodeExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

//Hasheo de contraseña
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

//Generar el código de verificación
UserSchema.methods.generateVerificationCode = function () {
  //código de 6 dígitos
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationCode = code;
  this.verificationCodeExpires = Date.now() + 15 * 60 * 1000; //15 min
  return code;
};

//método para comparar las contraseñas

export default model("User", UserSchema);
