const estadisticasService = require('../services/estadisticasService');

exports.getTotalesReclamosEstados = async (req, res) => {
  try {
    const totales = await estadisticasService.getTotalesReclamosEstados();
    res.status(200).json({ ok: true, data: totales });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

exports.getUsuariosPorOficinas= async (req, res) => {
  try {
    const totales = await estadisticasService.getUsuariosPorOficinas();
    res.status(200).json({ ok: true, data: totales });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};