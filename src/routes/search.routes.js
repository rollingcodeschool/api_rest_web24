import { Router } from "express";
import search from "../controllers/search.controller.js";

const router = Router();

router.get("/:coleccion/:termino", search); //url/api/search/category/cfgdgbddg45345345

export default router;
