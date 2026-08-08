import { PutCommand, GetCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../config/database.js";

const tableName = process.env.PRODUCTS_TABLE_NAME || "Products";

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