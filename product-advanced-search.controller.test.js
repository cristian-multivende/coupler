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

//
import * as productAdvancedSearch from '../../server/api/product-advanced-search/product-advanced-search.controller';
//

(async () => {
  try {
    console.log("Inicio mercadolibre-connection.controller.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const req = {
      params: {
        page: ''
      },
      body: {
        _marketplace_connection_id: ''
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
            console.log("End called");
          }
        };
      }
    };

    await productAdvancedSearch.advancedSearch(req, res);
    //

    console.log("Fin mercadolibre-connection.controller.test");
  } catch (error) {
    console.error("Error mercadolibre-connection.controller.test");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();