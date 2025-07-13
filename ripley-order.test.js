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
import * as ripley from '../../server/components/connect/ripley-v2';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio ripley-order.test");

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
    const task = {
      MerchantId: '',
      MarketplaceConnectionId: '',
      OrderId: '',
    };

    await ripley.handleOrderNotification(task);
    //

    console.log("Fin ripley-order.test");
  } catch (error) {
    console.error("Error ripley-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();