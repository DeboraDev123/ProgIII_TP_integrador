const Estadisticas = require('../database/estadisticas');

exports.getTotalesReclamosEstados = async () => {
  const estadisticas = await Estadisticas.getTotalesReclamosEstados();
  return estadisticas;
};

exports.getUsuariosPorOficinas = async () => {
  const estadisticas = await Estadisticas.getUsuariosPorOficinas();
  return estadisticas;
};
