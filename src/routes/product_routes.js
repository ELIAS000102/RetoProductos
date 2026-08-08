import { Router } from "express";
import { createProduct, deleteProduct, getProducts } from "../controllers/product_controller.js";
import { validateProduct, validateDelete, validateGet } from "../middlewares/validate_product.js";


const router = Router();

router.post("/product",validateProduct,createProduct);
router.delete("/product",validateDelete,deleteProduct);
router.get("/product",validateGet,getProducts);

export default router;