# API REST Ecommerce

API REST en desarrollo para un proyecto de tipo ecommerce. Actualmente incluye la configuración inicial del servidor, la conexión a MongoDB y una base de rutas para usuarios.

## Tecnologías

- Node.js con módulos ES
- Express 5
- MongoDB mediante Mongoose
- CORS

## Requisitos

- Node.js
- pnpm
- MongoDB ejecutándose localmente en `127.0.0.1:27017`

## Instalación y ejecución

Instala las dependencias y ejecuta el servidor desde la raíz del proyecto:

```bash
pnpm install
node index.js
```

El servidor escucha en el puerto `5500` y se conecta a la base de datos `api_web24`.

## Rutas disponibles

La base de rutas está montada en `/api/auth`:

| Método | Ruta        | Descripción                                                                      |
| ------ | ----------- | -------------------------------------------------------------------------------- |
| `GET`  | `/api/auth` | Devuelve la lista de usuarios registrados.                                       |
| `POST` | `/api/auth` | Crea un usuario a partir de `username`, `email` y `password` enviados como JSON. |

Ejemplo de cuerpo para crear un usuario:

```json
{
  "username": "usuario",
  "email": "usuario@example.com",
  "password": "password"
}
```

## Estado actual

El modelo de usuario contempla nombre de usuario, correo, contraseña, rol y campos para una futura verificación del correo. El registro y la consulta básica de usuarios están implementados; el envío y la verificación del correo todavía no están desarrollados.

> La contraseña se guarda actualmente tal como se recibe. Este proyecto está en desarrollo y aún no debe utilizarse en producción.
