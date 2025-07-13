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
import * as amazon from '../../server/components/connect/amazon';

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio amazon-order.test");

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

    // Orden
    let task = {
      MerchantId: '953532c0-0f79-4efb-a358-8da93ac70487',
      MarketplaceConnectionId: "c971904f-4cfb-4c17-a700-87f92b73168a",
      OrderId: '702-0921363-5013846',
    };

    await amazon.handleOrderNotification(task);

    console.log("Fin amazon-order.test");
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();