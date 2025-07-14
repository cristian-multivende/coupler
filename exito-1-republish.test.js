//@ts-check
"use strict";
import config from '../../server/config/environment';
import mongoose from "mongoose";
import i18n from 'i18n';
import _ from "lodash";

i18n.configure({
  directory: __dirname + '/../../server/i18n',
  prefix: 'locale_',
  defaultLocale: 'es_CL'
});

const { ProductManagerAsync, ProductManagerAsyncHandler } = require("../../server/components/connect/marketplace/product-manager-async");

class ProductManagerAsyncOnlyRead extends ProductManagerAsync {
  constructor() {
    super(new ProductManagerAsyncHandler());
  }

  async updateProductLinkStatus(processingSynchronizationStatus, productLinkLogEntryType, productLinkLogEntryCode, productLinkLogEntry, productLink) {
    /** @type {any} */
    let updates = {
      synchronizationStatus: processingSynchronizationStatus,
      externalContent: JSON.stringify({
        type: productLinkLogEntryType,
        code: productLinkLogEntryCode
      }),
      // @ts-ignore
      LastProductLinkLogEntryId: _.toString(productLinkLogEntry?._id)
    };
    console.log(updates);
  }
}

(async () => {
  console.log('Inicio exito-1-republish.test');
  try {
    let productLinks = [

    ];

    let masterSyncManager = require(`../../server/components/background-tasks/sync-manager/dequeue`);
    const SyncManagerFactory = require("../../server/utils/sync-manager-factory");
    const HookSyncManagerFactory = require("../../server/utils/hook-sync-manager-factory");
    await SyncManagerFactory.initializeFactory(masterSyncManager);
    await HookSyncManagerFactory.initializeFactory(masterSyncManager);
    let productManagerAsyncOnlyRead = new ProductManagerAsyncOnlyRead();
    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    let mongoConfig = {};
    await mongoose.connect(dbUrl, mongoConfig);

    for (let productLink of productLinks) {
      console.log("productlink:", productLink);
      const task = {
        MarketplaceConnectionId: '', // MarketplaceConnectionId
        ProductLinkId: productLink,
      };
      await productManagerAsyncOnlyRead.productRepublish(task);
    }

    console.log("Fin exito-1-republish.test");
  } catch (error) {
    console.error("exito-1-republish.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();