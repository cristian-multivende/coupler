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
import * as fcom from '../../server/components/connect/fcom';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio falabella-order-status.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    mongoose.connect(dbUrl, {});

    //
    const task = {
      MerchantId: '',
      MarketplaceConnectionId: '',
      OrderId: '',
      DeliveryOrderId: '',
      DeliveryOrderStatusCode: config.deliveryOrderStatusCodes.READY_TO_SHIP
    };

    await fcom.handleDeliveryOrderForChangeStatus(task);
    //

    console.log("Fin falabella-order-status.test");
  } catch (error) {
    console.error("Error falabella-order-status.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

/*
 * En order-manager, comentar las lineas updateAttributes de la función `handleDeliveryOrderForChangeStatus`
 */