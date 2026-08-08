# API REST - Gestión de Productos con DynamoDB

Esta API REST permite realizar el registro, la eliminación con reglas de negocio y el listado ordenado de productos, utilizando **Node.js**, **Express** y **AWS DynamoDB**.

---

## Herramientas y Tecnologías

* **Entorno de ejecución:** Node.js (versión v18+)
* **Framework Web:** Express.js
* **Base de Datos NoSQL:** AWS DynamoDB
* **Plataforma de Despliegue:** Railway / Hostinger

---

## Librerías Utilizadas e Instalación

### Dependencias de Producción:
* **express:** Framework web para la creación de rutas, middlewares y controladores HTTP.
* **@aws-sdk/client-dynamodb:** Cliente oficial v3 de AWS SDK para la gestión de DynamoDB.
* **@aws-sdk/lib-dynamodb:** Cliente de alto nivel (Document Client) que facilita el manejo de objetos JSON nativos de JS hacia AWS.
* **dotenv:** Carga las variables de entorno desde el archivo .env.
* **cors:** Middleware para permitir peticiones HTTP desde clientes externos.

### Dependencias de Desarrollo:
* **nodemon:** Monitor de archivos que reinicia automáticamente el servidor ante cualquier cambio en el código.

### Comando para instalar todas las librerías desde cero:
```bash
npm install express @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb dotenv cors
npm install -D nodemon
```

---

## Guía de Instalación Local

Si clonas este repositorio en tu máquina local, ejecuta el siguiente comando para descargar e instalar automáticamente todas las dependencias necesarias:

```bash
npm install
```

> **Nota:** Asegúrate de crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
PRODUCTS_TABLE_NAME=Products
```

---

## Comandos de Ejecución (Scripts)

En el archivo `package.json` disponemos de los siguientes scripts ejecutables:

* **Modo Desarrollo (con reinicio automático):**
```bash
npm run dev
```

* **Modo Producción / Compilación normal:**
```bash
npm start
```

* **Prueba de conexión a DynamoDB (Testeo):**
```bash
npm run test:db
```

---

## Arquitectura y Lógica del Proyecto

El proyecto está diseñado bajo una arquitectura por capas, separando de forma estricta las responsabilidades:

```
RETOPRODUCTOS/
├── node_modules/
├── src/
│   ├── config/         # Configuración y conexión con AWS DynamoDB
│   ├── controllers/    # Manejo de peticiones/respuestas HTTP
│   ├── middlewares/    # Validaciones de formato e integridad sintáctica HTTP
│   ├── routes/         # Definición de las rutas y mapeo de endpoints
│   ├── services/       # Lógica de negocio y consultas a DynamoDB
│   └── app.js          # Configuración principal de la aplicación Express
├── tests/              # Archivo de testeo de conexión a DynamoDB
├── .env
├── .gitignore
├── index.js            # Punto de entrada del servidor
├── package-lock.json
├── package.json
└── README.md
```

---

## Explicación de Responsabilidades

**Conexión a la Base de Datos (`src/config/database.js`):**

Se encarga de instanciar y configurar el cliente de AWS SDK DynamoDB Document Client utilizando las credenciales globales cargadas desde las variables de entorno (.env).

**Gestión de Rutas (`src/routes/product_routes.js`):**

Define las URLs expuestas por la API (/product, /products), especifica los métodos HTTP (POST, DELETE, GET) y encadena la ejecución de los middlewares con sus respectivos controladores.

**Validación de Peticiones (`src/middlewares/validate_product.js`):**

Es el primer filtro al recibir una petición. Se encarga de evaluar la integridad sintáctica de la solicitud HTTP (verificar que los parámetros existan, que el correo no esté vacío, o que los valores de precio y stock sean de tipo número válido).

**Manejo de Solicitudes y Respuestas (`src/controllers/product_controller.js`):**

Recibe la petición HTTP ya validada por el middleware, invoca al servicio correspondiente para ejecutar la acción necesaria, gestiona las excepciones mediante respuestas de error (409 Conflict, 500 Server Error) y retorna la respuesta en formato JSON (200 OK).

**Aplicación de Lógica de Negocio y Operaciones (`src/services/product_service.js`):**

Contiene el núcleo del negocio. Se encarga de hacer las consultas a DynamoDB (PutCommand, GetCommand, ScanCommand, DeleteCommand) para:

* Evaluar si un producto ya se encuentra duplicado para un mismo correo.
* Generar automáticamente el identificador correlativo único (P0001, P0002).
* Validar que un producto tenga stock en 0 antes de autorizar su borrado.
* Filtrar y ordenar alfabéticamente los productos por usuario.

**Pruebas de Conexión (`tests/`):**

Contiene el archivo encargado de testear la conexión a DynamoDB, permitiendo verificar de forma rápida que las credenciales y la configuración de AWS estén correctamente establecidas antes de levantar el servidor.