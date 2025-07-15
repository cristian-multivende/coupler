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

    let marketplaceProvider = "exito";
    let MarketplaceConnectionId = "0f149a35-ff1b-4da6-a21d-3b2826caec65";

    let priorityDictionary = {};
    let connector = require(`../../server/components/connect/exito`);
    let syncManagerMaster = require(`../../server/components/background-tasks/sync-manager/dequeue`);
    let useRealConfirmation = false;
    let syncManagerBrokerType = SyncManagerBrokerType.RASCAL;
    let runWorkerConsumers = false;

    let auxMarketplaceSyncManagerAsync = new MarketplaceSyncManagerAsync(marketplaceProvider, priorityDictionary, connector, syncManagerMaster, useRealConfirmation, syncManagerBrokerType, runWorkerConsumers);
    
    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const namespace = MarketplaceSyncManagerNamespaces.PRODUCTS;
    const jobName = "productFeedResolution";

    const scheduledJob = auxMarketplaceSyncManagerAsync.scheduledJobs[namespace][jobName];
    await scheduledJob.perform({ MarketplaceConnectionId, interval: "1 minute" });
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
Borrar los
updateAttributes de "server/components/connect/exito/hanlde-notifications-manager.js"

en "server/components/background-tasks/sync-manager/core/marketplace-sync-manager-async/marketplace-sync-manager-async.js"
Comentar la línea 57.
Cambiar la línea 62 a “true”.

en "server/components/connect/exito/exito-client.js"
Comentar los "updateAttributes"
*/