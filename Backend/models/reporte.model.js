const dbConfig = require('../config/config');

const Reporte = {
  obtenerReporteServiciosPorRango: (fechaInicio, fechaFin, callback) => {
    dbConfig.connection.query(
      'CALL sp_reporte_servicios_por_rango(?, ?)',
      [fechaInicio, fechaFin],
      (err, results) => {
        if (err) {
          console.error('Error al ejecutar sp_reporte_servicios_por_rango:', err);
          return callback(err, null);
        }
        callback(null, results[0]);
      }
    );
  },
  obtenerReporteConteoClientes: (placa, numeroIdentificacion, estado, conServicios, soloClientes, callback) => {
    const paramPlaca = placa || null;
    const paramNumeroIdentificacion = numeroIdentificacion || null;
    const paramEstado = estado || null;
    const paramConServicios = (conServicios === true || conServicios === false) ? conServicios : null;
    const paramSoloClientes = (soloClientes === true || soloClientes === false) ? soloClientes : null;
    dbConfig.connection.query(
      'CALL sp_reporte_conteo_clientes(?, ?, ?, ?, ?)',
      [paramPlaca, paramNumeroIdentificacion, paramEstado, paramConServicios, paramSoloClientes],
      (err, results) => {
        if (err) {
          console.error('Error al ejecutar sp_reporte_conteo_clientes:', err);
          return callback(err, null);
        }
        callback(null, {
            detalles: results[0],
            conteos: results[1][0]
        });
      }
    );
  },
  obtenerConteoClientesResumen: (callback) => {
    dbConfig.connection.query(
      'CALL sp_obtener_conteo_clientes_resumen()',
      (err, results) => {
        if (err) {
          console.error('Error al ejecutar sp_obtener_conteo_clientes_resumen:', err);
          return callback(err, null);
        }
        callback(null, results[0][0]);
      }
    );
  },
  
};

module.exports = Reporte;