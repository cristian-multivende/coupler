import config from '../../server/config/environment';
import mongoose from "mongoose";
import i18n from 'i18n';
i18n.configure({
  directory: __dirname + '/../../server/i18n',
  prefix: 'locale_',
  defaultLocale: 'es_CL'
});
const initSyncManagers = require('./initSyncManagers');

// Importaciones
import * as walmart from '../../server/components/connect/walmart';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio walmart-order.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    let options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      sslValidate: config.mongodb.sslValidate,
      sslCA: sslCA,
      ssl: config.mongodb.ssl,
      tlsAllowInvalidHostnames: config.mongodb.tlsAllowInvalidHostnames,
    };
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl, options);

    // Test
    let task = {
      MerchantId: '872146f3-1221-4c3e-8986-b2f9d9575d2e',
      MarketplaceConnectionId: "7915c2ee-6a1a-4621-9f58-3c8bef71e672",
      OrderId: '600000022495527',
      orderType: 'FULLFILMENT'
    };

    await walmart.handleOrderNotification(task);
    //
    console.log("Fin del test");
  } catch (error) {
    console.error(error);
  }
})();