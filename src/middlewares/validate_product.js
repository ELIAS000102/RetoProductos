export const validateProduct = (req, res, next) => {
  const { nombre, precio, stock, correo } = req.body;

  // 1. Validar nombre
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

export const validateDelete = (req, res, next) => {
  const { idProducto, correo } = req.body;

  if (!idProducto || idProducto.trim() === "") {
    return res.status(400).json({ mensaje: "Es obligatorio ingresar el idProducto." });
  }

  if (!correo || correo.trim() === "") {
    return res.status(400).json({ mensaje: "Es obligatorio ingresar el correo." });
  }

  next();
};

export const validateGet = (req, res, next) => {
  const { correo } = req.query;

  if (!correo || correo.trim() === "") {
    return res.status(400).json({
      mensaje: "Es obligatorio ingresar el parámetro 'correo' en la consulta."
    });
  }

  next();
};