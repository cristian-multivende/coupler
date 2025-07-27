//@ts-check
"use strict";
import { MarketplaceSyncManagerNamespaces } from '../../server/components/background-tasks/sync-manager/core/marketplace-sync-manager/marketplace-sync-manager-namespaces';
import { SyncManagerBrokerType } from '../../server/components/background-tasks/sync-manager/core/sync-manager/sync-manager-broker';
import config from '../../server/config/environment';
const { MarketplaceSyncManagerAsync } = require("../../server/components/background-tasks/sync-manager/core/marketplace-sync-manager-async/marketplace-sync-manager-async");
import mongoose from "mongoose";
import i18n from 'i18n';

i18n.configure({
  directory: __dirname + '/../../server/i18n',
  prefix: 'locale_',
  defaultLocale: 'es_CL'
});

(async () => {
  try {

    let marketplaceProvider = "walmart";
    let MarketplaceConnectionId = "2ec82948-5e67-4ae9-af6d-facec2999fd3";

    let priorityDictionary = {};
    let connector = require(`../../server/components/connect/${marketplaceProvider}`);
    let syncManagerMaster = require(`../../server/components/background-tasks/sync-manager/dequeue`);
    let useRealConfirmation = false;
    let syncManagerBrokerType = SyncManagerBrokerType.RASCAL;
    let runWorkerConsumers = false;

    let auxMarketplaceSyncManagerAsync = new MarketplaceSyncManagerAsync(marketplaceProvider, priorityDictionary, connector, syncManagerMaster, useRealConfirmation, syncManagerBrokerType, runWorkerConsumers);
    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    let mongoConfig = {};

    console.log("Attempt to connect");

    await mongoose.connect(dbUrl, mongoConfig);

    let namespace = MarketplaceSyncManagerNamespaces.PRODUCTS;
    let jobName = "productFeedResolution";

    let scheduledJob = auxMarketplaceSyncManagerAsync.scheduledJobs[namespace][jobName];
    await scheduledJob.perform({ MarketplaceConnectionId, interval: "1 minute" });
    
    console.log("END OF FEED RESOLUTION");
  } catch (error) {
    console.log(error.stack);
  }
})();

/*
Borrar los
updateAttributes de "server/components/connect/exito/hanlde-notifications-manager.js"

en "server/components/background-tasks/sync-manager/core/marketplace-sync-manager-async/marketplace-sync-manager-async.js"
Comentar la línea 57.
Cambiar la línea 62 a “true”.

en "server/components/connect/exito/exito-client.js"
Comentar los "updateAttributes"
*/


// {
//   _id: ObjectId('66d77579ebbde027071d0aa6'),
//   collectionAvailability: 'open',
//   ttl: ISODate('2024-09-04T20:45:45.874Z'),
//   synchronizationStatus: 'pending',
//   tags: '',
//   status: 'created',
//   CreatedById: '55b2521d-c3fd-4c64-af08-926849a9ca04',
//   UpdatedById: '55b2521d-c3fd-4c64-af08-926849a9ca04',
//   MarketplaceConnectionId: '0fba8f2f-8e11-4b90-b235-d2635596dd23',
//   MerchantId: '1b4bf3da-ef77-4a7f-b9d2-db158e43b120',
//   createdAt: ISODate('2024-09-03T20:45:45.880Z'),
//   updatedAt: ISODate('2024-09-03T20:45:45.880Z'),
//   __v: 0
// }