import config from '../../server/config/environment';
import mongoose from "mongoose";
import i18n from 'i18n';
i18n.configure({
  directory: __dirname + '/../../server/i18n',
  prefix: 'locale_',
  defaultLocale: 'es_CL'
});
const initSyncManagers = require('./utils/initSyncManagers');

// Importaciones
import * as exito from '../../server/components/connect/exito';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio exito-order.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl, {});

    // Orden
    const task = {
      MerchantId: '',
      MarketplaceConnectionId: '',
      OrderId: '',
    };

    await exito.handleOrderNotification(task);
    //

    console.log("Fin exito-order.test");
  } catch (error) {
    console.error("Error exito-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();