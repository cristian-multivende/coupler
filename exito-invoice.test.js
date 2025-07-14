//@ts-check
"use strict";
import config from '../../server/config/environment';
import mongoose from "mongoose";
import i18n from 'i18n';
import ElectronicBillingDocumentManager from '../../server/components/connect/exito/electronic-billing-document-manager';
const initSyncManagers = require('./utils/initSyncManagers');

i18n.configure({
  directory: __dirname + '/../../server/i18n',
  prefix: 'locale_',
  defaultLocale: 'es_CL'
});

(async () => {
  await initSyncManagers();

  try {
    console.log("Inicio exito-invoice.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const electronicBillingDocumentManager = new ElectronicBillingDocumentManager();
    const invoiceTask = {
      MarketplaceConnectionId: '',
      ElectronicBillingDocumentFileId: ''
    };

    const resultInvoice = await electronicBillingDocumentManager.sendCheckoutElectronicBillingDocument(invoiceTask);
    console.log('resultInvoice:', resultInvoice);
    //

    console.log("Fin exito-invoice.test");
  } catch (error) {
    console.error("Error exito-invoice.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();