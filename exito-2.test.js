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
    console.log("Inicio exito-2.test");

    const marketplaceProvider = "exito";
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
    const MarketplaceConnectionId = "0f149a35-ff1b-4da6-a21d-3b2826caec65";
    const collectionSize = 400;
    const splitLinkedProducts = true;
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

    console.error("Fin exito-2.test");
  } catch (error) {
    console.error("Error exito-2.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

/*
en "server/components/background-tasks/sync-manager/core/marketplace-sync-manager-async/marketplace-sync-manager-async.js:57"
Comentar la línea 57.
Cambiar la línea 62 a “true”.
*/