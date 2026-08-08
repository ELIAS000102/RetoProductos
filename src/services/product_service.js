import { PutCommand, GetCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../config/database.js";

const tableName = process.env.PRODUCTS_TABLE_NAME || "Products";

/**
 * Función auxiliar para generar un ID autoincrementable con formato 'P0000'.
 * Analiza los productos existentes, extrae el número más alto omitiendo IDs no válidos (UUIDs)
 * y genera el siguiente valor correlativo formateado a 4 dígitos con ceros a la izquierda.
 */
function generateID(items) {

  if (!items || items.length === 0) {
    return "P0001";
  }

  const numbers = items
    .map(item => {
      if (item && typeof item.idProducto === "string" && item.idProducto.startsWith("P")) {
        const numPart = item.idProducto.substring(1); 
        const parsed = parseInt(numPart, 10);
        return isNaN(parsed) ? null : parsed;
      }
      return null;
    })
    .filter(num => num !== null);

  if (numbers.length === 0) {
    return "P0001";
  }

  const maxNumber = Math.max(...numbers);

  if (!isFinite(maxNumber) || isNaN(maxNumber)) {
    return "P0001";
  }

  const nextNumber = maxNumber + 1;

  return `P${String(nextNumber).padStart(4, "0")}`;
}

export const productService = {

    /**
   * Consulta todos los productos en DynamoDB para verificar si ya existe un registro 
   * perteneciente al mismo correo con el mismo nombre (ignora mayúsculas y minúsculas).
   * Retorna la lista completa de ítems para reutilizarla y el objeto duplicado si existe.
   */
  async findDuplicate(email, name) {
    const response = await docClient.send(new ScanCommand({
      TableName: tableName
    }));

    const items = response.Items || [];

    const duplicate = items.find(
      item => item.correo === email && item.nombre.toLowerCase() === name.toLowerCase()
    );

    return { allItems: items, duplicate };
  },

  /**
   * Registra un nuevo producto en DynamoDB.
   * Valida la no duplicidad por correo y nombre, genera el ID correlativo único (P0000)
   * y guarda el producto asegurando que precio y stock se almacenen como números.
   */
  async create(productData) {
    const { nombre, precio, stock, correo } = productData;

    const { allItems, duplicate } = await this.findDuplicate(correo, nombre);

    if (duplicate) {
      const error = new Error(`El producto "${nombre}" ya existe.`);
      error.statusCode = 409;
      throw error;
    }

    const idProducto = generateID(allItems);

    const newProduct = {
      idProducto,
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      correo
    };

    await docClient.send(new PutCommand({
      TableName: tableName,
      Item: newProduct,
    }));

    return newProduct;
  },

  /**
   * Elimina un producto de DynamoDB evaluando las reglas de negocio.
   * Verifica la existencia del producto mediante GetCommand, valida la pertenencia al correo
   * y confirma que el stock sea exactamente 0 antes de proceder con el borrado.
   */
  async delete(idProducto, correo) {

    const getResult = await docClient.send(new GetCommand({
      TableName: tableName,
      Key: { idProducto }
    }));

    const product = getResult.Item;

    if (!product || product.correo !== correo) {
      const error = new Error("El producto indicado no existe.");
      error.statusCode = 409;
      throw error;
    }

    if (product.stock > 0) {
      const error = new Error(`El producto "${product.nombre}" tiene stock: "${product.stock}".`);
      error.statusCode = 409;
      throw error;
    }

    await docClient.send(new DeleteCommand({
      TableName: tableName,
      Key: { idProducto }
    }));

    return { mensaje: "Producto eliminado." };
  },

  /**
   * Obtiene todos los productos pertenecientes a un correo electrónico.
   * Escanea la tabla en DynamoDB, filtra los registros por el correo especificado
   * y retorna el listado ordenado alfabéticamente de la A a la Z según el nombre del producto.
   */
  async get(correo) {
    const response = await docClient.send(new ScanCommand({
      TableName: tableName
    }));

    const items = response.Items || [];

    const userProducts = items.filter(
      item => item.correo && item.correo.toLowerCase() === correo.toLowerCase()
    );

    userProducts.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));

    return userProducts;
  }

};