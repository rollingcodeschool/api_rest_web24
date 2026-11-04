import { Router } from "express";
import { buscarProductos } from "../controllers/search.controller.js";

const router = Router();

router.get("/:termino", buscarProductos);

export default router;
