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
import * as amazon from '../../server/components/connect/amazon';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio amazon-order.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl, {});

    // Orden
    const task = {
      MerchantId: '',
      MarketplaceConnectionId: '',
      OrderId: '',
    };

    await amazon.handleOrderNotification(task);
    //

    console.log("Fin amazon-order.test");
  } catch (error) {
    console.error("Error amazon-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();