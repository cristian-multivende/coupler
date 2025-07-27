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
    console.log('Inicio liverpool-1-create.test');

    const productManagerAsync = new ProductManagerAsync(new ProductManagerAsyncHandler(), true);

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const productLinks = [
      '66dd3106-3707-41bc-ae78-b414b6d21a22',
    ];

    for (const productlink of productLinks) {
      console.log("productlink:", productlink);
      const task = {
        MarketplaceConnectionId: '969ee47f-0abc-430f-a724-9ab418d800aa',
        ProductLinkId: productlink,
      };
      await productManagerAsync.productUpload(task);
    }
    //

    console.log('Fin liverpool-1-create.test');
  } catch (error) {
    console.error("Error liverpool-1-create.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

/*
En "server/components/connect/marketplace/product-manager-async.js", comentar el "updateAttributes" en la función "updateProductLinkStatus".
*/