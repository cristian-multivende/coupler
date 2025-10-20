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
const { ProductManagerAsync, ProductManagerAsyncHandler } = require('../../server/components/connect/marketplace/product-manager-async');

(async () => {
  await initSyncManagers();

  try {
    console.log('Inicio walmart-1-update.test');

    const productManagerAsync = new ProductManagerAsync(new ProductManagerAsyncHandler());

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const productLinks = [
      '',
    ];

    for (const productlink of productLinks) {
      console.log("productlink:", productlink);
      const task = {
        MarketplaceConnectionId: '',
        ProductLinkId: productlink,
      };
      await productManagerAsync.productUpdate(task);
    }
    //

    console.log('Fin walmart-1-update.test');
  } catch (error) {
    console.error("Error walmart-1-update.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
