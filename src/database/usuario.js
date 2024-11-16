const pool = require('../config/dbConfig');

const Usuario = {
  createUsuario: async (data) => {
    const {
      nombre,
      apellido,
      correoElectronico,
      contrasenia,
      imagen = null,
      idUsuarioTipo,
    } = data;
    const query = `
      INSERT INTO usuarios (nombre, apellido, correoElectronico, contrasenia, imagen, idUsuarioTipo, activo) 
      VALUES (?, ?, ?, sha2(?,256), ?, ?, 1)
    `;
    const [result] = await pool.execute(query, [
      nombre,
      apellido,
      correoElectronico,
      contrasenia,
      imagen,
      idUsuarioTipo,
    ]);
    return result.insertId;
  },

  
  
  getUsuarios: async (idUsuarioTipo) => {
    const query = `SELECT idUsuario, nombre, apellido, correoElectronico, idUsuarioTipo, imagen, activo FROM usuarios WHERE idUsuarioTipo = ?`;
    const [result] = await pool.execute(query, [idUsuarioTipo]);
    return result;
  },

  getUsuarioByUsernameAndPassword: async (username, password) => {
    const query = `SELECT * FROM usuarios WHERE correoElectronico = '${username}' AND contrasenia = sha2('${password}',256) AND activo=1`;
    const [result] = await pool.execute(query, [username, password]);

    return result;
  },

  getUsuarioByUsernameAndPasswordHashed: async (username, password) => {
    const query = `SELECT * FROM usuarios WHERE correoElectronico = '${username}' AND contrasenia = '${password}' AND activo=1`;
    const [result] = await pool.execute(query, [username, password]);

    return result;
  },

  getUsuarioById: async (id, idTipo) => {
    const params = [id];
    let query = `SELECT u.idUsuario, u.nombre, u.apellido, 
    u.correoElectronico, u.idUsuarioTipo, u.imagen, u.activo
    FROM usuarios u 
    WHERE u.idUsuario = ?`;
    if (idTipo) {
      query += ' AND u.idUsuarioTipo = ?';
      params.push(idTipo);
    }
    const [result] = await pool.execute(query, params);
    return result[0];
  },

  updateUsuario: async (id, data, idTipo) => {
    const { nombre, apellido } = data;

    const query = `
      UPDATE usuarios 
      SET nombre = ?, apellido = ?
      WHERE idUsuario = ?
      AND idUsuarioTipo = ?
    `;

    await pool.execute(query, [nombre, apellido, id, idTipo]);
  },

  getImagenUsuario: async (id, idTipo) => {
    const query = ` SELECT u.imagen FROM usuarios u WHERE idUsuario= ? and idUsuarioTipo=? `;
    const [rows] = await pool.execute(query, [id, idTipo]);
    return rows[0]?.imagen;
  },

  updateImagenUsuario: async (id, rutaImagen, idTipo) => {
    const query = `
      UPDATE usuarios 
      SET imagen = ?
      WHERE idUsuario = ?
      AND idUsuarioTipo = ?
    `;
    await pool.execute(query, [rutaImagen, id, idTipo]);
  },

  deleteImagenUsuario: async (id, idTipo) => {
    const query = ` UPDATE usuarios SET imagen = null  WHERE idUsuario = ? AND idUsuarioTipo = ? `;
    await pool.execute(query, [id, idTipo]);
  },

  updateCorreoUsuario: async (id, data, idTipo) => {
    const { correoElectronico } = data;

    const query = `
      UPDATE usuarios 
      SET correoElectronico = ?
      WHERE idUsuario = ?
      AND idUsuarioTipo = ?
    `;
    await pool.execute(query, [correoElectronico, id, idTipo]);
  },

  updateContraseniaUsuario: async (id, data, idTipo) => {
    const { contrasenia } = data;

    const query = `
      UPDATE usuarios 
      SET contrasenia = sha2(?,256)
      WHERE idUsuario = ?
      AND idUsuarioTipo = ?
    `;
    await pool.execute(query, [contrasenia, id, idTipo]);
  },

  deleteUsuario: async (id, idTipo) => {
    const query = ` UPDATE usuarios SET activo = 0 WHERE idUsuario = ? AND idUsuarioTipo = ? `;
    await pool.execute(query, [id, idTipo]);
  },

  reactivarUsuario: async (id, idTipo) => {
    const query = ` UPDATE usuarios SET activo = 1 WHERE idUsuario = ? AND idUsuarioTipo = ? `;
    await pool.execute(query, [id, idTipo]);
  },

  existeUsuarioActivo: async (id, idTipo) => {
    const query = `SELECT 1
    FROM usuarios
    WHERE idUsuario = ?
    AND idUsuarioTipo = ?
    AND activo = 1`;
    const [result] = await pool.execute(query, [id, idTipo]);
    return result.length > 0;
  },

  existeUsuario: async (id, idTipo) => {
    const query = `SELECT 1
    FROM usuarios
    WHERE idUsuario = ?
    AND idUsuarioTipo = ?`;
    const [result] = await pool.execute(query, [id, idTipo]);
    return result.length > 0;
  },

  existeCorreo: async (correoElectronico) => {
    const query = `SELECT 1
    FROM usuarios
    WHERE correoElectronico = ?
    `;
    const [result] = await pool.execute(query, [correoElectronico]);
    return result.length > 0;
  },
};

module.exports = Usuario;
