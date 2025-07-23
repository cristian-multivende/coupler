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
import * as fcom from '../../server/components/connect/fcom';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio fcom-product-2.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    mongoose.connect(dbUrl, {});

    //
    const task = {
      MarketplaceConnectionId: "8f2cb2d1-7b16-4205-a033-6aad79d46d94",
      UserId: "07eb972a-8de9-46f5-b0b1-88b92995cf56",
      SynchronizationTasksCollectionId: "7f83b790-5179-436f-8725-b69725b497f3"
    };

    await fcom.fetchProductsCreateTasksCollectionFeedStatus(task, config.fcom);
    //

    console.log("Fin fcom-product-1.test");
  } catch (error) {
    console.error("Error fcom-product-1.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();