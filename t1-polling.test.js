//@ts-check
"use strict";
import config from '../../server/config/environment';
import mongoose from "mongoose";
import i18n from 'i18n';
i18n.configure({
  directory: __dirname + '/../../server/i18n',
  prefix: 'locale_',
  defaultLocale: 'es_CL'
});
const initSyncManagers = require('./utils/initSyncManagers');

//
import * as t1 from '../../server/components/connect/t1';
//

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio t1-polling.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    mongoose.connect(dbUrl, {});

    //
    const minutes = 120;

    await t1.handlePollingOrder('', (remoteOrders) => {
      console.log(remoteOrders);
    }, '* * * * *', minutes);
    //

    console.log("Fin t1-polling.test");
  } catch (error) {
    console.error("Error t1-polling.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();