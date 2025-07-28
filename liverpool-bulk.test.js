//@ts-check
"use strict";
import config from '../../server/config/environment';
import mongoose from "mongoose";
import i18n from 'i18n';
const initSyncManagers = require('./utils/initSyncManagers');
import * as liverpoolConnect from '../../server/components/connect/liverpool';

i18n.configure({
  directory: __dirname + '/../../server/i18n',
  prefix: 'locale_',
  defaultLocale: 'es_CL'
});

(async () => {
  await initSyncManagers();

  try {
    console.info("Inicio liverpool-bulk.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    const task = {
      MarketplaceConnectionId: "969ee47f-0abc-430f-a724-9ab418d800aa",
      BulkActionsTaskId: "a3091e80-e09f-4d0e-a03b-fb18eea719be",
      UserId: "11c500df-ebb0-475b-ba4d-06704a5bf7bb",
      protectedResource: "enabled"
    };

    await liverpoolConnect.handleGenerateBulkDeliveryOrderTickets(task);

    console.log("Fin liverpool-bulk.test");
  } catch (error) {
    console.error("Error liverpool-bulk.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();