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
import * as t1 from '../../server/components/connect/t1';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio t1-order.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl, options);

    // Orden
    const task = {
      MerchantId: '',
      MarketplaceConnectionId: '',
      OrderId: '',
    };

    await t1.handleOrderNotification(task);
    //

    console.log("Fin t1-order.test");
  } catch (error) {
    console.error("Error t1-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();