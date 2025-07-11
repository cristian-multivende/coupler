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
      '000b74c1-ca65-442f-b234-ac13fa054298',
      '001d7a6e-ef0c-4947-834a-281da161f4c2',
      '00385714-a7eb-422a-89c6-90195b245bc1',
      '003f0558-719c-4d39-b98c-1915ab94ab38',
      '0050a20c-f83b-483e-a0cc-9a3bbc354b81',
      '00564672-e632-4bea-830c-6ee58c3aedc7',
      '006553d5-b309-421c-bc45-72bb0ba90db2',
      '006de172-ebe7-4d02-b606-32b8c2dc9aa4',
      '006dec94-acdd-4493-9472-ab8b89fbb02d',
      '008261db-6b48-449b-aa71-1a4d47e8f9f8',
      '0082eb74-2e21-4b82-9da3-6d1dd663efc1',
      '0094cfda-125f-432f-ad62-569d610f4e01'
    ];

    // cambiar dependiendo de la intencion
    // let synchronizationTaskType = config.synchronizationTask.TYPES.CREATE.CODE;
    let synchronizationTaskType = config.synchronizationTask.TYPES.UPDATE_STOCK.CODE;

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
      console.log("productlink----> ", productlink);
      //#PARAMETERS ZONE
      let task = {
        MarketplaceConnectionId: "0f149a35-ff1b-4da6-a21d-3b2826caec65",
        ProductLinkId: productlink,
        //syncTaskType: "prducts-to-create"
      };
      await productManagerAsyncOnlyRead.productStockUpdate(task);
    }


    console.log('FIN');

    // server/components/background-tasks/sync-manager/core/marketplace-sync-manager-async/marketplace-sync-manager-async.js


    return true;
  } catch (error) {
    console.log(error.stack);
  }
})();