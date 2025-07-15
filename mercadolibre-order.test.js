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

//
import * as mercadolibre from '../../server/components/connect/mercadolibre-v2';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio mercadolibre-order.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    mongoose.connect(dbUrl, {});

    // Test
    let task = {
      MerchantId: '',
      MarketplaceConnectionId: '',
      OrderId: '',
    };

    await mercadolibre.handleOrderNotification(task);
    //

    console.log("Fin mercadolibre-order.test");
  } catch (error) {
    console.error("Error mercadolibre-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();