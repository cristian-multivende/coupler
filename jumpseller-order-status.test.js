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
import * as jumpseller from '../../server/components/connect/jumpseller';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Comienza el test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    mongoose.connect(dbUrl, {});

    //
    let task = {
      MerchantId: '',
      MarketplaceConnectionId: '',
      OrderId: '',
      DeliveryOrderId: '',
    };

    await jumpseller.handleDeliveryOrderForChangeStatus(task);
    console.log("Fin del test");
  } catch (error) {
    console.error("Error jumpseller-order-status.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

/*
 * En order-manager, comentar las lineas updateAttributes de la función `handleDeliveryOrderForChangeStatus`
 */