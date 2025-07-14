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
import * as jumpseller from '../../server/components/connect/jumpseller';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio jumpseller-order.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    // Orden
    const task = {
      MerchantId: '',
      MarketplaceConnectionId: '',
      OrderId: '',
      DeliveryOrderId: '',
    };

    await jumpseller.handleOrderNotification(task);
    // await jumpseller.handleDeliveryOrderForChangeStatus(task);
    //

    console.log("Fin jumpseller-order.test");
  } catch (error) {
    console.error("Error jumpseller-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

/*
 * En order-manager, comentar las líneas updateAttributes de la función `handleDeliveryOrderForChangeStatus`
 */