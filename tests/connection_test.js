import { ListBackupsCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { docClient } from "../src/config/database.js";

/**
 * Prueba la conectividad con AWS DynamoDB listando las tablas de la cuenta 
 * y mostrando en consola la respuesta o gestionando el error en caso de fallo.
 */
async function testConnection() {
    console.log("Intentando conectar con AWS DynamoDB...");

    try {
        const command = new ListTablesCommand({});
        const response = await docClient.send(command);
        console.log("¡Conexión exitosa!")
        console.log(`Tablas encontradas en tu cuenta: ${response.TableNames}`);
    } catch (error) {
        console.error("Error de conexión con DynamoDB:");
        console.error(`Mensaje: ${error.message}`);
        console.error(`Código de error: ${error.name}`);
        process.exit(1);
    }
}

testConnection();