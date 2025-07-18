//@ts-check
"use strict";
import config from '../../server/config/environment';
import mongoose from "mongoose";
import i18n from 'i18n';
i18n.configure({
  directory: __dirname + '/../../server/i18n',
  prefix: 'locale_',
  defaultLocale: 'es_CL'
});
const initSyncManagers = require('./utils/initSyncManagers');

//
import * as queue from '../../server/components/background-tasks/report-generator/report-generator-helper';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio test-reporte");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const task = {
      ReportGenerationTaskId: '52742042-ce90-4617-b60e-6430e52a0a4c',
    };

    await queue.generateReport(task);
    //

    console.log("Fin test-reporte");

    // Contexto: Me pidieron un reporte desde 2023. Voy a agarrar este reporte en base de datos, y le modificaré la fecha de inicio y fin para que sea desde 2023.
    // Modificar las variables de fecha aca server/components/report-data-generator/checkout/detail.js
    /*
      _where.soldAt = {
    $gte: moment('2023-01-01').utc(), // Fecha fija desde 2023
    $lte: moment().endOf('day').utc() // Hasta hoy al final del día
  }
     */

  } catch (error) {
    console.error("Error test-reporte:");
    console.error(error.stack ?? error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();