import { Router } from "express";
import { check } from "express-validator";
import { authenticate } from "../middlewares/auth.js";

import {
  handleValidationErrors,
  validarProductoPorId,
} from "../middlewares/validators.js";
import {
  addItem,
  deleteItem,
  getItems,
  updateCant,
  deleteCart,
} from "../controllers/cart.controller.js";

//controladores

const router = Router();

router.get("/", authenticate, getItems);
router.post(
  "/",
  [
    authenticate,
    check("productoId").custom(validarProductoPorId),
    check("cantidad")
      .notEmpty()
      .withMessage("La cantidad no puede estar vacia")
      .isInt({ min: 1 }),
    handleValidationErrors,
  ],
  addItem,
);
router.put(
  "/:productoId",
  [
    authenticate,
    check("productoId").isMongoId().withMessage("Debe ser un id válido"),
    handleValidationErrors,
  ],
  updateCant,
);
router.delete(
  "/:productoId",
  [
    authenticate,
    check("productoId").isMongoId().withMessage("Debe ser un id válido"),
    handleValidationErrors,
  ],
  deleteItem,
);
router.delete("/", authenticate, deleteCart);

export default router;
