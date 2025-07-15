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
import * as paris from '../../server/components/connect/paris-v2/';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio paris-product.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    mongoose.connect(dbUrl, {});

    //
    const task = {
      MarketplaceConnectionId: '',
      ProductId: '',
      ProductLinkId: '',
    };

    await paris.productUpload(task);
    // await paris.productUpdate(task);
    // await paris.productRepublish(task);
    // await paris.productUnpublish(task);
    // await paris.cancelPublication(task);
    // await paris.productPriceUpdate(task);
    // await paris.productStockUpdate(task);
    //

    console.log("Fin paris-product.test");
  } catch (error) {
    console.error("Error paris-order.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

/*
En 'server/components/connect/marketplace/standards/publication-product-standars.js' comentar los 'updateAttributes';
*/