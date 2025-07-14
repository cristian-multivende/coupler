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
    console.log('Inicio coppel-1-create.test');

    const productManagerAsync = new ProductManagerAsync(new ProductManagerAsyncHandler(), true);

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    let productLinks = [

    ];

    for (const productlink of productLinks) {
      console.log("productlink:", productlink);
      const task = {
        MarketplaceConnectionId: '',
        ProductLinkId: productlink,
      };
      await productManagerAsync.productUpload(task);
    }
    //

    console.log('Fin coppel-1-create.test');
  } catch (error) {
    console.error("Error coppel-1-create.test:");
    console.log(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();