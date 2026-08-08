import { Router } from "express";
import { createProduct, deleteProduct, getProducts } from "../controllers/product_controller.js";
import { validateProduct, validateDelete, validateGet } from "../middlewares/validate_product.js";


const router = Router();

/**
 * Ruta para registrar un nuevo producto.
 * 1. Executa validateProduct: Valida que los campos enviados en req.body sean correctos.
 * 2. Executa createProduct: Genera el ID correlativo, verifica duplicados y guarda en DynamoDB.
 */
router.post("/product",validateProduct,createProduct);
/**
 * Ruta para eliminar un producto existente.
 * 1. Executa validateDelete: Verifica que idProducto y correo estén presentes en req.body.
 * 2. Executa deleteProduct: Comprueba que el producto pertenezca al usuario y tenga stock 0 antes de borrar.
 */
router.delete("/product",validateDelete,deleteProduct);
/**
 * Ruta para listar los productos asociados a un correo.
 * 1. Executa validateGet: Garantiza que el parámetro 'correo' venga en req.query.
 * 2. Executa getProducts: Obtiene los productos filtrados y ordenados alfabéticamente.
 */
router.get("/product",validateGet,getProducts);

export default router;