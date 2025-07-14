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
import * as dafiti from '../../server/components/connect/dafiti-v2';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio dafiti-order.test");

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

    await dafiti.handleOrderNotification(task);
    //

    console.log("Fin dafiti-order.test");
  } catch (error) {
    console.error("Error dafiti-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();