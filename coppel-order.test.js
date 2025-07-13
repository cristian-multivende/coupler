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
import * as coppel from '../../server/components/connect/coppel';

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio coppel-order.test");

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
    const task = {
      MerchantId: 'be133293-15a1-4f01-822a-60428b07e2f8',
      MarketplaceConnectionId: "6d686ff2-e9e5-49f4-941f-cc15209a2784",
      OrderId: '302667060',
    };

    await coppel.handleOrderNotification(task);
    //

    console.log("Fin coppel-order.test");
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();