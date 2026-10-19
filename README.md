# Trabajo práctico 06 - Refactorización modular de reservas

## Descripción

El proyecto permite consultar las reservas de salas de estudio, ver el detalle de una reserva y crear nuevas reservas mediante un formulario web.

El código está organizado en módulos para separar las responsabilidades de la aplicación: configuración, rutas, controladores, servicios y middlewares.

Las reservas se almacenan únicamente en memoria. Por eso, al reiniciar el servidor vuelven a aparecer las cuatro reservas iniciales y se pierden las reservas creadas durante la ejecución anterior.

## Instalación

Para instalar las dependencias del proyecto, ejecutar en la terminal:

```bash
npm install
```

## Ejecución

Para iniciar el servidor:

```bash
npm start
```

Por defecto, la aplicación está disponible en:

http://localhost:3000

El puerto puede configurarse mediante la variable de entorno `PORT`. El entorno de ejecución se define con `NODE_ENV`.

## Comprobaciones y formato

Para comprobar el formato y analizar el código con ESLint:

```bash
npm run check
```

Para aplicar el formato con Prettier:

```bash
npm run format
```

Para comprobar únicamente el formato:

```bash
npm run format:check
```

Para analizar el código con ESLint:

```bash
npm run lint
```

También está disponible:

```bash
npm run lint:check
```

## Estructura del proyecto

```text
src/
├── index.js
├── app.js
├── configuracion.js
├── rutas/
│   └── reservas.js
├── controladores/
│   └── reservas.js
├── servicios/
│   └── reservas.js
└── middleware/
    ├── reservas.js
    └── solicitudes.js

public/
views/
.env.example
.gitignore
package.json
README.md
eslint.config.js
```

## Rutas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Página de inicio |
| GET | `/estado` | Estado del servicio en formato JSON |
| GET | `/reservas` | Lista de reservas |
| GET | `/reservas/nueva` | Formulario para crear una reserva |
| GET | `/reservas/:id` | Detalle de una reserva |
| POST | `/reservas` | Valida y crea una reserva |

Las rutas que no existen muestran una página de error 404.

## Responsabilidades de los módulos

- **index.js:** define las reservas iniciales, crea el servicio, el controlador y el router, y pone en marcha el servidor.
- **app.js:** configura Express, los middlewares globales, las rutas principales y la respuesta 404.
- **configuracion.js:** obtiene y valida el puerto y define el entorno de ejecución.
- **rutas/reservas.js:** define las rutas relacionadas con las reservas.
- **controladores/reservas.js:** recibe las solicitudes y coordina las respuestas.
- **servicios/reservas.js:** administra las reservas en memoria: listar, buscar, contar y crear.
- **middleware/reservas.js:** valida los datos recibidos para crear una reserva.
- **middleware/solicitudes.js:** identifica cada solicitud y registra su duración.

## Pipeline de middleware

El orden principal de la aplicación es:

1. Morgan registra las solicitudes HTTP.
2. `identificarSolicitud` asigna un identificador a cada solicitud.
3. `medirDuracion` registra cuánto tarda en finalizar la respuesta.
4. `express-ejs-layouts` configura el uso de layouts.
5. `express.static` permite servir archivos estáticos.
6. `express.urlencoded` interpreta los datos enviados mediante formularios.
7. `express.json` interpreta los cuerpos JSON.
8. Se procesan las rutas de la aplicación.
9. Las solicitudes que no coinciden con una ruta reciben una respuesta 404.

Dentro del router de reservas, el middleware personalizado establece información de la sección. La validación se ejecuta únicamente en el POST de `/reservas`, antes de crear la reserva.

### Uso de next()

`next()` permite continuar al siguiente middleware o controlador. Cuando una validación falla, se responde con estado 400 y se vuelve a mostrar el formulario con el error, sin continuar con la creación de la reserva.

### Parsers y evento finish

Los parsers permiten interpretar los datos enviados por el cliente y colocarlos en `req.body` antes de validarlos.

El evento `finish` permite registrar la duración de la solicitud cuando termina el envío de la respuesta.

## Validación de reservas

Se comprueban los siguientes datos:

- Estudiante obligatorio.
- Email con formato básico válido.
- Sala permitida.
- Fecha obligatoria.
- Turno válido.
- Entre 1 y 6 personas.

Cuando los datos no son válidos, el servidor responde con estado 400 y conserva los valores ingresados para facilitar la corrección.

## Pruebas manuales

Se verificaron las siguientes solicitudes:

- GET `/` → 200.
- GET `/estado` → 200.
- GET `/reservas` → 200.
- GET `/reservas/nueva` → 200.
- GET `/reservas/1` → 200.
- GET `/reservas/999` → 404.
- POST `/reservas` válido → 302 y redirección a `/reservas`.
- POST `/reservas` inválido → 400.
- GET `/cualquier-cosa` → 404.

También se comprobó que los identificadores de solicitud aumentan consecutivamente, que se registra la duración de las respuestas y que `npm run check` finaliza sin errores.

## Persistencia temporal

Las reservas se almacenan únicamente en memoria. Al reiniciar el servidor, se crea nuevamente el arreglo con las cuatro reservas iniciales. Las reservas agregadas durante la ejecución anterior no se conservan, ya que no se utiliza una base de datos ni un archivo de persistencia.

## Variables de entorno

El archivo `.env.example` documenta las variables de configuración utilizadas como referencia:

```dotenv
PORT=3000
NODE_ENV=development
```

El archivo `.env` está excluido de Git mediante `.gitignore`.
