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
import * as walmart from '../../server/components/connect/walmart';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio walmart-order.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl, options);

    // Test
    const task = {
      MerchantId: '',
      MarketplaceConnectionId: '',
      OrderId: '',
      orderType: ''
    };

    await walmart.handleOrderNotification(task);
    //

    console.log("Fin walmart-order.test");
  } catch (error) {
    console.error("Error walmart-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();