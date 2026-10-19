const crearServicioReserva = require("./servicios/reservas");
const crearControladorReservas = require("./controladores/reservas");
const validarReserva = require("./middleware/reservas");
const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");
const crearRouterReservas = require("./rutas/reservas");
const crearApp = require("./app");
const configuracion = require("./config/entorno");

const datosIniciales = [
  {
    id: 1,
    estudiante: "Lucia Gomez",
    email: "lucia@gmail.com",
    sala: "Sala Norte",
    fecha: "2026-09-01",
    turno: "Mañana",
    personas: 2,
  },
  {
    id: 2,
    estudiante: "Mateo Fernández",
    email: "mateo@gmail.com",
    sala: "Sala Sur",
    fecha: "2026-09-02",
    turno: "Tarde",
    personas: 4,
  },
  {
    id: 3,
    estudiante: "Sofía Rodríguez",
    email: "sofia@gmail.com",
    sala: "Sala Multimedia",
    fecha: "2026-09-03",
    turno: "Noche",
    personas: 3,
  },
  {
    id: 4,
    estudiante: "Tomás López",
    email: "tomas@gmail.com",
    sala: "Sala Norte",
    fecha: "2026-09-04",
    turno: "Mañana",
    personas: 1,
  },
];

const servicioReserva = crearServicioReserva(datosIniciales);
const controladorReservas = crearControladorReservas(servicioReserva);
const reservasRouter = crearRouterReservas(controladorReservas, validarReserva);

const app = crearApp(
  reservasRouter,
  servicioReserva,
  identificarSolicitud,
  medirDuracion,
);

app.listen(configuracion.puerto, () => {
  console.log(
    `Servidor ejecutándose en http://localhost:${configuracion.puerto}`,
  );
});
