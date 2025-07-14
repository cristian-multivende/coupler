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
import * as shopify from '../../server/components/connect/shopify-v2';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio shopify-order.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const task = {
      MerchantId: '',
      MarketplaceConnectionId: '',
      OrderId: '',
    };

    await shopify.handleOrderNotification(task);
    //

    console.log("Fin shopify-order.test");
  } catch (error) {
    console.error("Error shopify-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
  }
})();