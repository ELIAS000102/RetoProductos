import { productService } from "../services/product_service.js";

/**
 * Controlador para la creación de un nuevo producto.
 * Recibe los datos filtrados por el middleware, delega la verificación de duplicados, 
 * generación de ID e inserción al servicio, y responde con el producto creado.
 */
export const createProduct = async (req, res) => {
    try {
        const {nombre, precio, stock, correo} = req.body;

        const newProduct = await productService.create({nombre, precio, stock, correo});

        return res.status(200).json({
            mensaje: "Producto registrado con exito",
            producto: newProduct
        });


    } catch(error){
        if(error.statusCode === 409){
            return res.status(409).json({
                mensaje: error.message
            });
        };

        console.error(`Error al registrar: ${error}`);

        return res.status(500).json({
            mensaje: "Error del servidor"
        })
    };
};

/**
 * Controlador para la eliminación de un producto.
 * Recibe los datos validados por el middleware y consulta al servicio para verificar que 
 * el producto pertenezca al usuario y tenga stock en 0 antes de realizar el borrado.
 */
export const deleteProduct = async (req, res) => {
  try {
    const { idProducto, correo } = req.body;

    const result = await productService.delete(idProducto, correo);

    return res.status(200).json({
      mensaje: result.mensaje
    });

  } catch (error) {
    if (error.statusCode === 409 || error.status === 409) {
      return res.status(409).json({
        mensaje: error.message
      });
    }

    console.error(`Error al eliminar: ${error}`);
    return res.status(500).json({
      mensaje: "Error del servidor"
    });
  }
};

/**
 * Controlador para la consulta de productos por usuario.
 * Recibe el parámetro correo desde req.query (validado por el middleware) y retorna 
 * la lista de productos obtenida del servicio, filtrada y ordenada alfabéticamente.
 */
export const getProducts = async (req, res) => {
  try {
    const { correo } = req.query;

    const productos = await productService.get(correo);

    return res.status(200).json({
      total: productos.length,
      productos
    });

  } catch (error) {
    console.error(`Error al listar productos: ${error}`);
    return res.status(500).json({
      mensaje: "Error del servidor"
    });
  }
};