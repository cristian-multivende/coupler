//@ts-check
"use strict";
import { MarketplaceSyncManagerNamespaces } from '../../server/components/background-tasks/sync-manager/core/marketplace-sync-manager/marketplace-sync-manager-namespaces';
import { SyncManagerBrokerType } from '../../server/components/background-tasks/sync-manager/core/sync-manager/sync-manager-broker';
import config from '../../server/config/environment';
import mongoose from "mongoose";
import i18n from 'i18n';
i18n.configure({
  directory: __dirname + '/../../server/i18n',
  prefix: 'locale_',
  defaultLocale: 'es_CL'
});

const { MarketplaceSyncManagerAsync } = require("../../server/components/background-tasks/sync-manager/core/marketplace-sync-manager-async/marketplace-sync-manager-async");

(async () => {
  try {
    console.log("Inicio walmart-2.test");

    const marketplaceProvider = 'walmart';
    const priorityDictionary = {};
    const connector = require(`../../server/components/connect/${marketplaceProvider}`);
    const syncManagerMaster = require(`../../server/components/background-tasks/sync-manager/dequeue`);
    const useRealConfirmation = false;
    const syncManagerBrokerType = SyncManagerBrokerType.RASCAL;
    const runWorkerConsumers = false;

    const auxMarketplaceSyncManagerAsync = new MarketplaceSyncManagerAsync(marketplaceProvider, priorityDictionary, connector, syncManagerMaster, useRealConfirmation, syncManagerBrokerType, runWorkerConsumers);

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const MarketplaceConnectionId = '';
    const collectionSize = 400;
    const splitLinkedProducts = false;
    const namespace = MarketplaceSyncManagerNamespaces.PRODUCTS;
    const jobNames = [
      "createTasksCollectionsForProductsCreate",
      "createTasksCollectionsForProductsUpdate",
      "createTasksCollectionsForProductStocksUpdate",
      "createTasksCollectionsForProductPricesUpdate",
      "createTasksCollectionsForProductsDeletion",
      "createTasksCollectionsForProductsPause",
      "createTasksCollectionsForProductPricesPromotionUpdate",
      "createTasksCollectionsForProductsResynchronization",
    ];
    for (const jobName of jobNames) {
      const scheduledJob = auxMarketplaceSyncManagerAsync.scheduledJobs[namespace][jobName];
      await scheduledJob.perform({ MarketplaceConnectionId, interval: "1 minute", collectionSize, splitLinkedProducts });
      console.log(`jobName: ${jobName}`);
    }
    //

    console.error("Fin walmart-2.test");
  } catch (error) {
    console.error("Error walmart-2.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

/*
en "server/components/background-tasks/sync-manager/core/marketplace-sync-manager-async/marketplace-sync-manager-async.js"
Comentar la línea 57.
Cambiar la línea 62 a “false”.
*/