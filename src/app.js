const express = require("express");
const expressLayout = require("express-ejs-layouts");
const morgan = require("morgan");
const path = require("node:path");
const configuracion = require("./config/entorno");

function crearApp(
  reservasRouter,
  servicioReservas,
  identificarSolicitud,
  medirDuracion,
) {
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));

  const formatoMorgan =
    configuracion.entorno === "production" ? "combined" : "dev";

  app.use(morgan(formatoMorgan));
  app.use(identificarSolicitud);
  app.use(medirDuracion);

  app.use(expressLayout);
  app.set("layout", "layouts/main");

  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use("/reservas", reservasRouter);

  app.get("/", (req, res) => {
    res.render("inicio", { title: "Inicio" });
  });

  app.get("/estado", (req, res) => {
    res.json({
      servicio: "activo",
      reservas: servicioReservas.contar(),
      solicitudId: res.locals.solicitudId,
    });
  });

  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      title: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  return app;
}

module.exports = crearApp;
