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
import * as mercadolibre from '../../server/components/connect/mercadolibre-v2/';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio mercadolibre-product.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    mongoose.connect(dbUrl, {});

    //
    const task = {
      MarketplaceConnectionId: '',
      ProductLinkId: '',
    };

    await mercadolibre.productUpdate(task);
    // await mercadolibre.productUpdate(task);
    // await mercadolibre.productRepublish(task);
    // await mercadolibre.productUnpublish(task);
    // await mercadolibre.cancelPublication(task);
    // await mercadolibre.productPriceUpdate(task);
    // await mercadolibre.productStockUpdate(task);
    //

    console.log("Fin mercadolibre-product.test");
  } catch (error) {
    console.error("Error mercadolibre-product.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

// comentar los "updateAttributes" en "server/components/connect/marketplace/standards/publication-product-standars.js"