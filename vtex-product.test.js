//@ts-check
'use strict';
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
import * as vtext from '../../server/components/connect/vtex-v2';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio vtext-product.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    mongoose.connect(dbUrl, {});

    const task = {
      MarketplaceConnectionId: '',
      ProductId: '',
      ProductLinkId: '',
    };

    // await vtext.productUpload(task);
    // await vtext.productUpdate(task);
    await vtext.productRepublish(task);
    // await vtext.productUnpublish(task);
    // await vtext.cancelPublication(task);
    // await vtext.productPriceUpdate(task);
    // await vtext.productStockUpdate(task);
    //

    console.log("Fin vtext-product.test");
  } catch (error) {
    console.error("Error vtext-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

/*
En 'server/components/connect/marketplace/standards/publication-product-standars.js' comentar los 'updateAttributes';
*/