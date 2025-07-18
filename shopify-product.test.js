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
import * as shopify from '../../server/components/connect/shopify-v2/';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio shopify-product.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    mongoose.connect(dbUrl, {});

    //
    const task = {
      MarketplaceConnectionId: '422db70f-c3e6-42de-a045-33f5bf81cde0',
      ProductId: 'a7fac736-1492-4f95-9daa-4123e813eebd',
      ProductLinkId: '15d7111b-027f-4f6d-885c-bd0ba3fce24d',
    };

    // await shopify.productUpload(task);
    // await shopify.productUpdate(task);
    await shopify.productRepublish(task);
    // await shopify.productUnpublish(task);
    // await shopify.cancelPublication(task);
    // await shopify.productPriceUpdate(task);
    // await shopify.productStockUpdate(task);
    //

    console.log("Fin shopify-product.test");
  } catch (error) {
    console.error("Error shopify-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

/*
En 'server/components/connect/marketplace/standards/publication-product-standars.js' comentar los 'updateAttributes';
*/