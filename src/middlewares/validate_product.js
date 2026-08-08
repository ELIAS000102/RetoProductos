/**
 * Middleware para validar la creación de un producto (POST /producto).
 * Verifica que todos los campos requeridos estén presentes en el cuerpo de la petición (req.body)
 * y que cumplan con los tipos de datos y rangos permitidos (precio mayor a 0 y stock mayor o igual a 0).
 */
export const validateProduct = (req, res, next) => {
  const { nombre, precio, stock, correo } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({ mensaje: "Es obligatorio ingresar un nombre" });
  }


  if (!correo || correo.trim() === "") {
    return res.status(400).json({ mensaje: "Es obligatorio ingresar un correo" });
  }

  if (precio === undefined || typeof precio !== "number") {
    return res.status(400).json({ mensaje: "Es obligatorio ingresar un precio válido" });
  } else if (precio <= 0) {
    return res.status(400).json({ mensaje: "El precio debe ser mayor a 0" });
  }

  if (stock === undefined || typeof stock !== "number") {
    return res.status(400).json({ mensaje: "Es obligatorio ingresar un stock válido" });
  } else if (stock < 0) {
    return res.status(400).json({ mensaje: "El stock debe ser mayor o igual a 0" });
  }

  next();
};

/**
 * Middleware para validar la eliminación de un producto (DELETE /producto).
 * Comprueba que el cuerpo de la petición contenga el identificador del producto (idProducto) 
 * y el correo del propietario antes de permitir el procesamiento del borrado.
 */
export const validateDelete = (req, res, next) => {
  const { idProducto, correo } = req.body;

  if (!idProducto || idProducto.trim() === "") {
    return res.status(400).json({ mensaje: "Es obligatorio ingresar la ID del producto." });
  }

  if (!correo || correo.trim() === "") {
    return res.status(400).json({ mensaje: "Es obligatorio ingresar el correo." });
  }

  next();
};

/**
 * Middleware para validar la consulta de productos por usuario (GET /productos).
 * Inspecciona los parámetros de consulta (req.query) para asegurar que se proporcione 
 * el parámetro 'correo' antes de realizar la lectura en la base de datos.
 */
export const validateGet = (req, res, next) => {
  const { correo } = req.query;

  if (!correo || correo.trim() === "") {
    return res.status(400).json({
      mensaje: "Es obligatorio ingresar el parámetro 'correo' en la consulta."
    });
  }

  next();
};