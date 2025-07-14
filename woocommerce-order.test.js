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
import * as woocommerce from '../../server/components/connect/woocommerce-v2';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio woocommerce-order.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const task = {
      MerchantId: '',
      MarketplaceConnectionId: '',
      OrderId: '',
    };

    await woocommerce.handleOrderNotification(task);
    //

    console.log("Fin woocommerce-order.test");
  } catch (error) {
    console.error("Error woocommerce-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
  }
})()