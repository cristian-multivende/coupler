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
    console.log("HERE WE UPDATE PRODUCT LINK WITH THIS INFORMATION ");
    console.log(updates);
  }
}
(async () => {
  try {
    let productLinks = [
      '764f9c44-aa92-465f-a87e-2b51c99db08d'
    ];

    //#END PARAMETERS ZONE
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
      //#PARAMETERS ZONE
      const task = {
        MarketplaceConnectionId: "528874e4-bb45-46ab-985e-6fee40742525",
        ProductLinkId: productlink,
      };
      await productManagerAsyncOnlyRead.productUpdate(task);
    }

    console.log('FIN');
    return
  } catch (error) {
    console.log(error.stack);
  }
})();