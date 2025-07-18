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

    // Task PRODUCTO QUE ESTA MAL
    const taskA = {
      MarketplaceConnectionId: '32520563-d768-4931-a813-5c4f1cc16407',
      ProductId: '83c1f4f8-6cb9-4974-8d11-a754c0f901f6',
      ProductLinkId: 'b987a48c-7602-4bf3-aaaa-13fcccc4c916',
    };
    // Task PRODUCTO QUE ESTA BIEN
    const taskB = {
      MarketplaceConnectionId: '32520563-d768-4931-a813-5c4f1cc16407',
      ProductId: '11d37414-2e57-46e6-ba98-835c00d348b1',
      ProductLinkId: 'c951e38d-2cb2-438f-adeb-cb3ef17b3777',
    };

    // await vtext.productUpload(task);
    // await vtext.productUpdate(task);
    await vtext.productRepublish(taskA);
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