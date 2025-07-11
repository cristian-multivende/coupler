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
  /**
   * 
   * @param {string} processingSynchronizationStatus 
   * @param {string} productLinkLogEntryType 
   * @param {string} productLinkLogEntryCode 
   * @param {*} productLinkLogEntry 
   * @param {*} productLink 
   */
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
  }
}
(async () => {
  try {
    let productLinks = [
      'e996dd34-5375-487d-866b-25b4eb55e5d5'
    ];

    let masterSyncManager = require(`../../server/components/background-tasks/sync-manager/dequeue`);
    const SyncManagerFactory = require("../../server/utils/sync-manager-factory");
    const HookSyncManagerFactory = require("../../server/utils/hook-sync-manager-factory");
    await SyncManagerFactory.initializeFactory(masterSyncManager);
    await HookSyncManagerFactory.initializeFactory(masterSyncManager);
    let productManagerAsyncOnlyRead = new ProductManagerAsyncOnlyRead();
    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    let mongoConfig = {};
    console.log("Attempt to connect");
    await mongoose.connect(dbUrl, mongoConfig);

    for (let productlink of productLinks) {
      console.log("productlink:", productlink);
      let task = {
        MarketplaceConnectionId: "528874e4-bb45-46ab-985e-6fee40742525",
        ProductLinkId: productlink,
        //syncTaskType: "prducts-to-create"
      };
      await productManagerAsyncOnlyRead.productUpload(task);
    }

    console.log('FIN');
    return;
  } catch (error) {
    console.log(error.stack);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();