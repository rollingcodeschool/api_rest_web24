import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  handleValidationErrors,
  validarRolAdmin,
  validateImageFile,
} from "../middlewares/validators.js";
import { check } from "express-validator";
import { updateImageCloudinary } from "../controllers/upload.controller.js";

const router = Router();

router.put(
  "/:id",
  [
    authenticate,
    validarRolAdmin,
    validateImageFile,
    check("id", "no es un id de Mongo").isMongoId(),
    handleValidationErrors,
  ],
  updateImageCloudinary,
);

export default router;
