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
  const masterSyncManager = require(`../../server/components/background-tasks/sync-manager/dequeue`);
  const SyncManagerFactory = require("../../server/utils/sync-manager-factory");
  const HookSyncManagerFactory = require("../../server/utils/hook-sync-manager-factory");

  await Promise.all([
    SyncManagerFactory.initializeFactory(masterSyncManager),
    HookSyncManagerFactory.initializeFactory(masterSyncManager)
  ]);

  try {
    console.log('Inicio exito-1-create.test');

    // productLinks
    const productLinks = [

    ];

    const productManagerAsyncOnlyRead = new ProductManagerAsyncOnlyRead();
    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    const mongoConfig = {};
    await mongoose.connect(dbUrl, mongoConfig);

    for (const productlink of productLinks) {
      console.log("productlink:", productlink);

      // MarketplaceConnectionId
      const task = {
        MarketplaceConnectionId: '',
        ProductLinkId: productlink,
      };
      await productManagerAsyncOnlyRead.productUpload(task);
    }

    console.log('Fin exito-1-create.test');
  } catch (error) {
    console.error("exito-1-create.test:");
    console.log(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();