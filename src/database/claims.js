const pool = require('../config/dbConfig');
const { patchClaimsQueriesAdminHelper } = require('../utils/claimsQueries');

class Claims {
  constructor() {}
  getUserClaims = async (idUser) => {
    const [claims] = await pool.execute(
      'SELECT * FROM reclamos WHERE idUsuarioCreador = ?',
      [idUser]
    );
    return claims;
  };
  getClaimById = async (claimId, userId) => {
    const [claim] = await pool.execute(
      'SELECT * FROM `reclamos` r  where r.idReclamo=? AND idUsuarioCreador = ?',
      [claimId, userId]
    );

    // if(claimId.idReclamoTipo !== )

    return claim;
  };
  patchClaimClient = async (claimId, idUser) => {
    const [claimUpdate] = await pool.execute(
      `UPDATE reclamos r SET r.idReclamoEstado=3 , r.idUsuarioFinalizador = ? ,r.fechaCancelado=NOW()
      WHERE r.idReclamo =? ;`,
      [idUser, claimId]
    );
    return claimUpdate;
  };
  getClaimByClaimId = async (claimId) => {
    const [claim] = await pool.execute(
      'SELECT * FROM `reclamos` r  where r.idReclamo=?',
      [claimId]
    );

    // if(claimId.idReclamoTipo !== )

    return claim;
  };
  postClaim = async (asunto, descripcion, idReclamoTipo, idUsuario) => {
    const connection = await pool.getConnection();
    const [newClaimQuery] = await connection.query(
      'INSERT INTO reclamos (asunto , descripcion , fechaCreado,idReclamoTipo , idReclamoEstado , idUsuarioCreador) VALUES (?,?,?,?,1,?)',
      [asunto, descripcion, new Date(), idReclamoTipo, idUsuario]
    );
    connection.release();
    return newClaimQuery;
  };

  getClaimsEmployee = async (idUsuario) => {
    return await pool.execute(
      `SELECT r.* FROM reclamos as r 
        JOIN oficinas as o ON r.idReclamoTipo = o.idReclamoTipo 
        JOIN usuarios_oficinas as uo ON uo.idOficina = o.idOficina
        WHERE uo.idUsuario = ?`,
      [idUsuario]
    );
  };
  getClaimByClaimIdAndUserId = async (idUser, idClaim) => {
    const [claim] = await pool.execute(
      `SELECT r.* FROM reclamos as r 
        JOIN oficinas as o ON r.idReclamoTipo = o.idReclamoTipo
        JOIN usuarios_oficinas as uo ON uo.idOficina = o.idOficina
        WHERE r.idReclamo = ? AND uo.idUsuario = ?`,
      [idClaim, idUser]
    );
    return claim;
  };
  patchClaimEmployee = async (claimId, userId, claimNewStatus) => {
    const patchClaim = await pool.execute(
      `UPDATE reclamos r SET r.idReclamoEstado=? ,
       fechaFinalizado=${claimNewStatus === 4 ? 'NOW()' : 'NULL'}
      ,fechaCancelado=${
        claimNewStatus === 3 ? 'NOW()' : 'NULL'
      } , idUsuarioFinalizador=${
        claimNewStatus === 3 || claimNewStatus === 4 ? userId : 'NULL'
      } WHERE r.idReclamo =? ;`,
      [claimNewStatus, claimId]
    );
    return patchClaim;
  };
  getClaimsByClientId = async (userId) => {
    const connection = await pool.getConnection();
    const [getClaimsByClientId] = await connection.query(
      'SELECT * FROM `reclamos` r  where r.idUsuarioCreador=? ',
      [userId]
    );

    connection.release();
    return getClaimsByClientId;
  };
  getClaimsAdmin = async () => {
    return await pool.execute('SELECT * FROM reclamos');
  };
  patchClaimAdmin = async (body, reclamoId, idUsuario) => {
    const query = await patchClaimsQueriesAdminHelper(
      body.reclamoNuevoStatus,
      idUsuario
    );

    return await pool.execute(query, [
      body.descripcion ?? null,
      body.asunto ?? null,
      body.reclamoNuevoStatus,
      reclamoId,
    ]);
  };
  postClaimAdmin = async (data) => {
    const { idReclamoEstado, idReclamoTipo, asunto, descripcion, idUsuario } =
      data;
    return await pool.execute(
      'INSERT INTO reclamos  (idReclamoEstado ,idReclamoTipo, asunto , descripcion , idUsuarioCreador , fechaCreado) VALUES (?,?,?,?,?,?)',
      [
        idReclamoEstado,
        idReclamoTipo,
        asunto,
        descripcion,
        idUsuario,
        new Date(),
      ]
    );
  };
  reportesClaimQuery = async (idReclamoTipo) => {
    const [claims] = await pool.query(
      'SELECT r.idReclamo,r.asunto,r.descripcion,r.fechaCreado,r.fechaFinalizado,r.fechaCancelado,re.descripcion AS descripcionEstado,r.idReclamoTipo,r.idUsuarioCreador,r.idUsuarioFinalizador FROM reclamos r  join   reclamos_estado re  on r.idReclamoEstado = re.idReclamoEstado WHERE idReclamoTipo = ?',

      [idReclamoTipo]
    );
    return claims;
  };
  reportesClaimProcedure = async () => {
    const [claims] = await pool.query('call datosPDF()');
    return claims.flat()[0];
  };
  reportesCsvArchivoQuery = async () => {
    const sql = `SELECT r.idReclamo as 'reclamo' , rt.descripcion as 'tipo' , re.descripcion as 'estado' ,
    DATE_FORMAT(r.fechaCreado , '%Y-%m-%d %H:%i:%s') as 'fechaCreado' , CONCAT (u.nombre,' ',u.apellido) as cliente
    FROM reclamos as r INNER JOIN reclamos_tipo as rt ON rt.idReclamoTipo = r.idReclamoTipo INNER JOIN reclamos_estado as re ON re.idReclamoEstado = r.idReclamoEstado INNER JOIN usuarios as u ON u.idUsuario = r.idUsuarioCreador WHERE r.idReclamoEstado <> 4 ; 
    `;
    const [query] = await pool.execute(sql);
    return query;
  };
  //PAGINACION QUERIES
  claimsAdminPaginated = async (pagina) => {
    const sql = `SELECT * FROM reclamos LIMIT  6  OFFSET ? ;`;
    const [query] = await pool.execute(sql, [5 * pagina]);

    return query;
  };
  claimsClientePaginated = async (idUsuario, pagina) => {
    const sql = `SELECT * FROM reclamos r  where r.idUsuarioCreador=? LIMIT  6  OFFSET ? ;`;
    const [query] = await pool.execute(sql, [idUsuario, 5 * pagina]);

    return query;
  };
  claimsEmpleadosPaginated = async (idUsuario, pagina) => {
    const [query] = await pool.execute(
      `SELECT r.* FROM reclamos as r 
        JOIN oficinas as o ON r.idReclamoTipo = o.idReclamoTipo 
        JOIN usuarios_oficinas as uo ON uo.idOficina = o.idOficina
        WHERE uo.idUsuario = ?  ORDER BY r.idReclamo LIMIT 6 OFFSET  ? `,
      [idUsuario, 5 * pagina]
    );

    return query;
  };
  //PAGINACION QUERIES
}
module.exports = Claims;
