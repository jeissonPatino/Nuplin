const Reporte = require('../models/reporte.model');

exports.getReporteServicios = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query; // Obtén las fechas de los query parameters

    // Validar que las fechas estén presentes
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: 'Se requieren fechaInicio y fechaFin.' });
    }

    Reporte.obtenerReporteServiciosPorRango(fechaInicio, fechaFin, (err, data) => {
      if (err) {
        console.error('Error al obtener reporte de servicios:', err);
        return res.status(500).json({ message: 'Error al obtener el reporte de servicios.' });
      }
      res.status(200).json(data);
    });
  } catch (error) {
    console.error('Error en getReporteServicios:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener el reporte.' });
  }
};

exports.getReporteConteoClientes = async (req, res) => {
  try {
    const { placa, numeroIdentificacion, estado, conServicios, soloClientes } = req.query;
    const parsedConServicios = conServicios === 'true' ? true : (conServicios === 'false' ? false : null);
    const parsedSoloClientes = soloClientes === 'true' ? true : (soloClientes === 'false' ? false : null);

    Reporte.obtenerReporteConteoClientes(
      placa,
      numeroIdentificacion,
      estado,
      parsedConServicios,
      parsedSoloClientes,
      (err, data) => {
        if (err) {
          console.error('Error al obtener reporte de conteo de clientes:', err);
          return res.status(500).json({ message: 'Error al obtener el reporte de conteo de clientes.' });
        }
        res.status(200).json(data);
      }
    );
  } catch (error) {
    console.error('Error en getReporteConteoClientes:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener el reporte de clientes.' });
  }

};

exports.getConteoClientesResumen = async (req, res) => {
    try {
        Reporte.obtenerConteoClientesResumen((err, data) => {
            if (err) {
                console.error('Error al obtener conteo de clientes resumen:', err);
                return res.status(500).json({ message: 'Error al obtener el conteo de clientes.' });
            }
            res.status(200).json(data);
        });
    } catch (error) {
        console.error('Error en getConteoClientesResumen:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener el conteo de clientes.' });
    }
};