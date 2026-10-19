function crearControladorReservas(servicioReservas) {
  function listar(req, res) {
    res.render("reservas/lista", {
      title: "Reservas",
      reservas: servicioReservas.listar(),
    });
  }

  function mostrarNueva(req, res) {
    res.render("reservas/nueva", {
      title: "Nueva reserva",
      valores: {},
      error: null,
    });
  }

  function mostrarDetalle(req, res) {
    const id = Number(req.params.id);
    const reserva = servicioReservas.buscarPorId(id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        title: "Página no encontrada",
        mensaje: "La reserva solicitada no existe.",
      });
    }

    res.render("reservas/detalle", {
      title: "Detalle de reserva",
      reserva,
    });
  }

  function crear(req, res) {
    servicioReservas.crear(req.reservaValidada);
    res.redirect("/reservas");
  }

  return {
    listar,
    mostrarNueva,
    mostrarDetalle,
    crear,
  };
}

module.exports = crearControladorReservas;
