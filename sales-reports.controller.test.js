//@ts-check
"use strict";
import mongoose from "mongoose";
import config from '../../server/config/environment/index.js';
import i18n from 'i18n';
i18n.configure({
  directory: __dirname + '/../../server/i18n',
  prefix: 'locale_',
  defaultLocale: 'es_CL'
});

// server/api/sales-reports/sales-reports.controller.js
import * as salesReports from '../../server/api/sales-reports/sales-reports.controller';
//

(async () => {
  try {
    console.log("Inicio product-price.controller.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const req = {
      user: {
        _id: '11c500df-ebb0-475b-ba4d-06704a5bf7bb'
      },
      params: {
        merchantId: '1a8440b5-c0a4-400f-af2e-a3683637a1f9',
        type: 'sales-detail-report',
        format: 'xlsx'
      },
      body: {
        type: 'sales-detail-report',
        format: 'xlsx',
        parameters: {
          generateTotal: true,
          includeCanceled: false,
          // predefinedDateCode: '_predefined_date_today',
          disableDateFilters: true,
          _from_date_: '2023-01-01T00:00:00.000Z',
          _to_date_: '2025-07-18T03:59:59.999Z',
          TimezoneId: 'dee790bc-fdef-492b-9637-7cfd1f1fc031'
        }
      }
    };

    const res = {
      status: (code) => {
        console.log("Status:", code);
        return {
          json: (data) => {
            console.log("Response:");
            console.log(data);
            // console.log(JSON.stringify(data, null, 2));
          },
          send: (data) => {
            console.log("Send:");
            console.log(data);
            // console.log(JSON.stringify(data, null, 2));
          },
          end: () => {
            console.log("End");
          }
        };
      }
    };

    await salesReports.create(req, res);
    //

    console.log("Fin product-price.controller.test");
  } catch (error) {
    console.error("Error product-price.controller.test");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
  }
})();