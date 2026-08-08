import { ListBackupsCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { docClient } from "../src/config/database.js";

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