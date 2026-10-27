import { Router } from "express";
import { check } from "express-validator";
import { authenticate } from "../middlewares/auth.js";

import {
  handleValidationErrors,
  validarProductoPorId,
} from "../middlewares/validators.js";

//controladores

const router = Router();

router.get("/", authenticate, () => {});
router.post(
  "/",
  [
    authenticate,
    check("productId").custom(validarProductoPorId),
    check("cantidad")
      .notEmpty()
      .withMessage("La cantidad no puede estar vacia")
      .isInt({ min: 1 }),
    handleValidationErrors,
  ],
  () => {},
);
router.put(
  "/:productId",
  [
    authenticate,
    check("productId").isMongoId().withMessage("Debe ser un id válido"),
    handleValidationErrors,
  ],
  () => {},
);
router.delete(
  "/:productId",
  [
    authenticate,
    check("productId").isMongoId().withMessage("Debe ser un id válido"),
    handleValidationErrors,
  ],
  () => {},
);
router.delete("/",authenticate, () => {});

export default router;
