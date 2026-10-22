# Trabajo práctico 07 - Persistencia inicial de reservas de salas (MongoDB)

## 1. Punto de partida y nombre de la copia
- **Nombre de la copia:** `tp-07-salas-mongodb`
- **Punto de partida:** Copia funcional del TP 06 (`tp-06-salas-modular`), conservando intacto el comportamiento previo del servidor web Express y sus rutas en memoria.

## 2. Versiones utilizadas y confirmación de clúster Atlas Free
- **Node.js:** v22.x
- **Mongoose:** v8.x
- **Clúster MongoDB:** Se confirma el uso de **MongoDB Atlas - Clúster Gratuito Free (M0)**.
- **Base de datos:** `reservas_salas_u7`

## 3. Pasos desde una descarga nueva (Instalación y Configuración)

### Paso 1: Instalar dependencias
Desde la raíz del proyecto, ejecutar:
```bash
npm install
```

### Paso 2: Preparar el clúster gratuito en MongoDB Atlas

1- Crear un clúster gratuito Free (M0) en MongoDB Atlas.

2- En Database Access, crear un usuario de base de datos con permisos de lectura y escritura (Read and write to any database).

3- En Network Access, agregar la IP actual o permitir acceso global (0.0.0.0/0) para el laboratorio.

4- Obtener la cadena de conexión (URI) para Node.js.

### Paso 3: Configurar la plantilla de entorno
Copiar la plantilla pública de entorno .env.example a un nuevo archivo .env:

```Bash
cp .env.example .env
```

Editar .env y reemplazar los marcadores por los datos reales del clúster:

Fragmento de código

```Bash
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u7?retryWrites=true&w=majority
```

## 4. Diagnóstico DNS y Comandos Exactos de Ejecución
Diagnóstico DNS y resolutores
En src/config/base-datos.js se configura la resolución DNS de Node.js mediante node:dns estableciendo resolutores públicos autorizados:

```Bash
dns.setServers(["8.8.8.8", "1.1.1.1"]);
```

Este ajuste soluciona problemas de resolución de registros SRV/TXT de MongoDB Atlas en redes que manipulan o bloquean consultas DNS, garantizando la conectividad a nivel del proceso de Node.js sin modificar la red del sistema operativo.

Comandos de ejecución

Prueba de Conexión:

```Bash
node --env-file=.env scripts/comprobar-conexion.js
```
Creación de Reserva en MongoDB:

```Bash
node --env-file=.env scripts/crear-reserva.js
```
Consulta de Reservas en MongoDB:

```Bash
node --env-file=.env scripts/listar-reservas.js
```
Calidad y Formato de Código (Prettier y ESLint):

```Bash
npm run format
npm run check
```
Arranque del Servidor Web (HTTP en memoria):

```Bash
npm start
```
Disponible en http://localhost:3000.

## 5. Mapa de archivos, Esquema, Modelo y Colección
Estructura del Proyecto

```Bash
tp-07-salas-mongodb/
├── src/
│   ├── config/
│   │   ├── entorno.js          # Lectura y validación de PORT, NODE_ENV y MONGODB_URI
│   │   └── base-datos.js       # Configuración DNS y funciones conectar/desconectar Mongoose
│   ├── modelos/
│   │   └── reserva.js          # Esquema y modelo Mongoose de Reserva
│   ├── rutas/
│   │   └── reservas.js         # Rutas web del TP 06
│   ├── controladores/
│   │   └── reservas.js         # Controladores HTTP del TP 06
│   ├── servicios/
│   │   └── reservas.js         # Servicio en memoria del TP 06
│   ├── middleware/
│   │   ├── reservas.js         # Validación HTTP en memoria
│   │   └── solicitudes.js      # Logger y tracking de solicitudes HTTP
│   ├── app.js
│   └── index.js
├── scripts/
│   ├── comprobar-conexion.js    # Script de diagnóstico de conexión
│   ├── crear-reserva.js        # Script de inserción con modelo Mongoose
│   └── listar-reservas.js      # Script de consulta con modelo Mongoose
├── public/
├── views/
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── package-lock.json
└── README.md
```

### Explicación de Esquema, Modelo y Colección
Esquema (reservaSchema): Define la estructura de los datos, tipos y las reglas de validación que debe cumplir cada objeto antes de guardarse.

Modelo (Reserva): Interfaz proporcionada por Mongoose para interactuar con la base de datos (realizar save(), find(), etc.).

Colección (reservas): Nombre explícito de la colección dentro de la base de datos reservas_salas_u7 donde se persisten los documentos.

## 6. Campos, Reglas y Límites No Controlados

### Campos y reglas de validación:

estudiante (String): Obligatorio (required), elimina espacios en extremos (trim: true).

email (String): Obligatorio (required), trim: true, exige presencia de @ (match: /@/).

sala (String): Obligatorio (required), restringido mediante enum a: "Sala Norte", "Sala Sur", "Sala Multimedia".

fecha (String): Obligatorio (required), no vacío tras trim: true.

turno (String): Obligatorio (required), restringido mediante enum a: "Mañana", "Tarde", "Noche".

personas (Number): Obligatorio (required), entero verificado con Number.isInteger, mínimo 1 (min: 1) y máximo 6 (max: 6).

### Límites que aún no se controlan en esta etapa:

No se realiza validación compleja de formato RFC de email.

No se verifica que la fecha sea futura o válida en el calendario.

No se controlan solapamientos de reservas, capacidad máxima por sala ni cupos compartidos.

No existen índices únicos para evitar reservas repetidas.

## 7. Matriz de Pruebas y Evidencia de Persistencia

### Evidencia del Ensayo de Persistencia entre Procesos

Para comprobar que los datos no residen únicamente en la memoria volátil del programa y que la persistencia se realiza de forma efectiva en la base de datos de MongoDB Atlas, se llevó a cabo la siguiente secuencia de ensayos independientes en la terminal:

1. Estado Inicial (Colección Limpia):
   Se ejecutó el programa de consulta `node --env-file=.env scripts/listar-reservas.js` sobre la base `reservas_salas_u7`. Al no haber documentos previos, el script finalizó exitosamente reportando **0 reservas recuperadas**.

2. Creación de Registro Persistente:
   Se ejecutó el script de creación `node --env-file=.env scripts/crear-reserva.js` con un objeto de prueba válido. MongoDB Atlas confirmó la inserción devolviendo un identificador único de tipo ObjectId: `6ad9124839123dee6e4eae90`. El proceso finalizó de forma limpia y cerró la conexión.

3. Comprobación en un Proceso Nuevo:
   Se cerró la terminal anterior y se inició un proceso completamente nuevo de Node.js ejecutando nuevamente `node --env-file=.env scripts/listar-reservas.js`. El programa leyó la base de datos remota, recuperó la reserva con el mismo `_id` generado anteriormente (`6ad9124839123dee6e4eae90`) y constató que la cantidad total aumentó a 1.

4. erificación de Estabilidad:
   Se realizaron consultas adicionales de lectura sin ejecutar escrituras intermedias, verificando que la cantidad se mantuvo estable en 1, lo que confirma que no se generan duplicaciones ni pérdidas de datos entre ejecuciones independientes.

### Matriz Mínima de Pruebas de Validación y Conexión

A continuación se detallan los resultados de las pruebas técnicas y los intentos de inserción con datos inválidos para corroborar que el modelo Mongoose intercepta los errores de validación antes de impactar en la base de datos:

#### A. Pruebas de Configuración, Red y Colección
- Conexión Válida: Muestra mensaje de éxito, conecta a Atlas y finaliza cerrando recursos en el bloque `finally`. (Cantidad de registros: N/A).
- Ajuste DNS / Red: Diagnosticado y resuelto aplicando `dns.setServers(["8.8.8.8", "1.1.1.1"])` en `src/config/base-datos.js` antes de la conexión. (Cantidad de registros: N/A).
- Variable `MONGODB_URI` Vacía: Se detecta la falta de configuración en `src/config/entorno.js` y el proceso finaliza con error sin anunciar éxito. (Cantidad de registros: N/A).
- Contraseña Incorrecta en `.env`: Falla la autenticación de Atlas, Mongoose captura el rechazo y no permite escrituras. (Cantidad de registros: N/A).
- Consulta con Colección Vacía: Responde de forma válida mostrando `Cantidad total de reservas recuperadas: 0`. (Cantidad antes/después: 0 / 0).

#### B. Pruebas de Escritura, Persistencia y Mantenimiento
- Creación de Reserva Válida: Guarda el documento en Atlas y devuelve el `_id` de confirmación. (Cantidad antes/después: 0 / 1).
- Consulta desde Proceso Nuevo: Recupera el registro persistido con su `_id` correspondiente en una ejecución posterior. (Cantidad antes/después: 1 / 1)*.
- Segunda Consulta Sin Escrituras: Verifica que la colección permanezca intacta sin agregar ni eliminar registros. *(Cantidad antes/después: 1 / 1).

#### C. Pruebas Negativas de Validación (Rechazos por Modelo)
Todas estas pruebas se realizaron modificando temporalmente un solo campo a la vez en `scripts/crear-reserva.js` y restaurándolo al terminar:

- Campo `estudiante` Vacío (`""`):** Rechazado por regla `required`. Muestra: `estudiante: El nombre del estudiante es obligatorio.` (Cantidad antes/después: 1 / 1)*.
- Campo `email` Sin `@` (`"luciagmail.com"`):** Rechazado por regla `match`. Muestra: `email: El email debe contener un carácter '@'.` (Cantidad antes/después: 1 / 1).
- Campo `sala` Inválido (`"Sala Oeste"`):** Rechazado por restricción `enum`. Muestra mensaje de opción no permitida. (Cantidad antes/después: 1 / 1).
- Campo `turno` Inválido (`"Nochecita"`): Rechazado por restricción `enum`. Muestra mensaje de turno no permitido. (Cantidad antes/después: 1 / 1).
- Campo `fecha` Vacío (`""`): Rechazado por regla `required`. Muestra: `fecha: La fecha es obligatoria.` (Cantidad antes/después: 1 / 1).
- Campo `personas` Fuera de Rango (`0` o `7`): Rechazado por reglas `min: 1` y `max: 6`. (Cantidad antes/después: 1 / 1).
- Campo `personas` Decimal (`2.5`): Rechazado por el validador personalizado `Number.isInteger`. (Cantidad antes/después: 1 / 1).
- Campo `personas` No Numérico (`"tres"`): Rechazado por Mongoose mediante un error de conversión de tipos (`CastError`) previo a intentar la inserción. (Cantidad antes/después: 1 / 1).

##  8. Explicación de Arquitectura y Continuidad HTTP
La aplicación web Express continúa operando intencionalmente con el servicio de almacenamiento en memoria (src/servicios/reservas.js).

### Esto se debe a la progresión pedagógica del curso:

Unidad 7 (Actual): Concentra la práctica exclusivamente en la configuración de la base de datos, conexión asíncrona, definición de esquemas/modelos con Mongoose y la ejecución de scripts independientes desde la consola.

Unidad 8 (Siguiente): Se abordará la migración completa del servicio HTTP y de los controladores de Express para sustituir el arreglo en memoria y conectar las vistas web con MongoDB mediante operaciones asíncronas (async/await).

El servidor web mantiene intactas las rutas y características probadas en el TP 06:

GET /, GET /estado, GET /reservas, GET /reservas/nueva, GET /reservas/:id, POST /reservas (creación en memoria) y manejo de errores 404.

## 9. Confirmación de Seguridad y Privacidad
El archivo .env está excluido del repositorio mediante .gitignore.

Solamente se versiona la plantilla pública .env.example con marcadores genéricos.

Se confirma que no se publicaron credenciales de usuario, contraseñas, URIs privadas ni datos personales en el repositorio.