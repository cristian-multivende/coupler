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
    let jobName = "sendTasksSubCollectionsForProductSynchronization";

    let scheduledJob = auxMarketplaceSyncManagerAsync.scheduledJobs[namespace][jobName];
    await scheduledJob.perform({ MarketplaceConnectionId, interval: "1 minute" });
    
    console.log("END OF SEND COLLECTION");
  } catch (error) {
    console.log(error.stack);
  }
})();

/*

*/