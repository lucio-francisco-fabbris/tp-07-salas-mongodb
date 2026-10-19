function crearServicioReserva(datosIniciales) {
  const reservas = [...datosIniciales];

  function listar() {
    return reservas;
  }

  function buscarPorId(id) {
    return reservas.find((reserva) => reserva.id === id);
  }

  function contar() {
    return reservas.length;
  }

  function crear(datos) {
    const nuevaReserva = {
      id: reservas.length + 1,
      ...datos,
    };

    reservas.push(nuevaReserva);

    return nuevaReserva;
  }

  return {
    listar,
    buscarPorId,
    contar,
    crear,
  };
}

module.exports = crearServicioReserva;
