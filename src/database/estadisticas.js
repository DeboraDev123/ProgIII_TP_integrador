const pool = require('../config/dbConfig');

exports.getTotalesReclamosEstados = async () => {
  const [output] = await pool.query(
    'CALL totales_reclamos_estados();'
  );

  return output[0];
};

exports.getUsuariosPorOficinas = async () => {
  const [output] = await pool.query(
    'CALL usuarios_por_oficina();'
  );

  return output[0];
};