const express = require('express');
const { handleTokenValidity } = require('../controllers/auth');
const { isAdmin } = require('../middlewares/authorization');

const { param } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const validateReportFormat = require('../validations/validateReportFormat');
const ReportesController = require('../controllers/reportesController');
const estadisticasController = require('../controllers/estadisticasController');

const router = express.Router();

const reportesController = new ReportesController();
router.use(handleTokenValidity);
router.use(isAdmin);

router.get(
  '/totalesReclamosEstados',
  estadisticasController.getTotalesReclamosEstados
);

router.get(
  '/UsuariosPorOficinas',
  estadisticasController.getUsuariosPorOficinas
);


router.get(
  '/:formatoReporte/:idReclamoTipo',
  [
    param('formatoReporte')
      .custom(validateReportFormat)
      .withMessage('error : formatos validos de reporte : pdf , csv'),
    param('idReclamoTipo')
      .isNumeric()
      .withMessage('id tipo de reclamo tiene que ser un numero'),
    validarCampos,
  ],
  reportesController.getReporte
);

router.get(
  '/:formatoReporte/',
  [
    param('formatoReporte')
      .custom(validateReportFormat)
      .withMessage('error : formatos validos de reporte : pdf , csv'),

    validarCampos,
  ],
  reportesController.getInforme
);

module.exports = router;
