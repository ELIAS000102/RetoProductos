import app from "./src/app.js"
import dotenv from "dotenv"

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Servidor en linea en el puerto: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`)
})