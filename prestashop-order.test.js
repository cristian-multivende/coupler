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
import * as prestashop from '../../server/components/connect/prestashop-v2';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio prestashop-order.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    // Orden
    const task = {
      MerchantId: '',
      MarketplaceConnectionId: '',
      OrderId: '',
    };

    await prestashop.handleOrderNotification(task);
    //

    console.log("Fin prestashop-order.test");
  } catch (error) {
    console.error("Error prestashop-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
  }
})()