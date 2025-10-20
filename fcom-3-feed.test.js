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
    console.log("Inicio fcom-3-feed.test");

    const marketplaceProvider = "fcom";
    const priorityDictionary = {};
    const connector = require(`../../server/components/connect/fcom-v2`);
    const syncManagerMaster = require('../../server/components/background-tasks/sync-manager/dequeue');
    const useRealConfirmation = false;
    const syncManagerBrokerType = SyncManagerBrokerType.RASCAL;
    const runWorkerConsumers = false;

    MarketplaceSyncManagerAsync.prototype.getSchedulerConfiguration = async () => ({});

    const auxMarketplaceSyncManagerAsync = new MarketplaceSyncManagerAsync(marketplaceProvider, priorityDictionary, connector, syncManagerMaster, useRealConfirmation, syncManagerBrokerType, runWorkerConsumers);

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const MarketplaceConnectionId = '';
    const namespace = MarketplaceSyncManagerNamespaces.PRODUCTS;
    const jobName = "productFeedResolution";
    const scheduledJob = auxMarketplaceSyncManagerAsync.scheduledJobs[namespace][jobName];

    await scheduledJob.perform({ MarketplaceConnectionId, interval: "1 minute" });
    //

    console.error("Fin fcom-3-feed.test");
  } catch (error) {
    console.error("Error fcom-3-feed.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
