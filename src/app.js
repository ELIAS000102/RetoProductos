import express from "express";
import productoRoute from "./routes/product_routes.js"

const app = express();

app.use(express.json());

app.use(productoRoute)

app.use((req, res) => {
    res.status(404).json({
        mensaje: "La ruta solicitada no existe"
    });
});

export default app;