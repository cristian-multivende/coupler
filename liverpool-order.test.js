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

// Importaciones
import * as liverpool from '../../server/components/connect/liverpool';
//

(async () => {
  await initSyncManagers();

  try {
    console.info("Inicio liverpool-order.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    mongoose.connect(dbUrl, {});

    // Orden
    const task = {
      MerchantId: '',
      MarketplaceConnectionId: '',
      OrderId: '',
    };

    await liverpool.handleOrderNotification(task);
    //
    
    console.log("Fin liverpool-order.test");
  } catch (error) {
    console.error("Error liverpool-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();