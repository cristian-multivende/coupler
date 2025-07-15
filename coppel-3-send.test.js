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

    let marketplaceProvider = "coppel";
    let MarketplaceConnectionId = "528874e4-bb45-46ab-985e-6fee40742525";

    let priorityDictionary = {};
    let connector = require(`../../server/components/connect/${marketplaceProvider}`);
    let syncManagerMaster = require(`../../server/components/background-tasks/sync-manager/dequeue`);
    let useRealConfirmation = false;
    let syncManagerBrokerType = SyncManagerBrokerType.RASCAL;
    let runWorkerConsumers = false;

    let auxMarketplaceSyncManagerAsync = new MarketplaceSyncManagerAsync(marketplaceProvider, priorityDictionary, connector, syncManagerMaster, useRealConfirmation, syncManagerBrokerType, runWorkerConsumers);
    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    let mongoConfig = {};

    await mongoose.connect(dbUrl, mongoConfig);

    let namespace = MarketplaceSyncManagerNamespaces.PRODUCTS;
    let jobName = "sendTasksSubCollectionsForProductSynchronization";

    let scheduledJob = auxMarketplaceSyncManagerAsync.scheduledJobs[namespace][jobName];
    await scheduledJob.perform({ MarketplaceConnectionId, interval: "1 minute" });

    console.log("END OF SEND COLLECTION");
  } catch (error) {
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

/*
Borrar los
updateAttributes de "server/components/connect/exito/hanlde-notifications-manager.js"

en "server/components/connect/exito/exito-client.js"
Comentar los "updateAttributes"
*/