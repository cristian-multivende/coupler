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
import * as productLink from '../../server/api/product-link/product-link.controller';
//

(async () => {
  try {
    console.log("Inicio product-price.controller.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const req = {
        params: {
          marketplaceConnectionId: '11111111-2222-3333-4444-555555555555'
        },
        body: {
          productPairs: [
            {
              "ProductId": "00xxxxxx-10d6-45a5-a35e-xxxxxxxxx07a"
            }, {
              "ProductId": "00xxxxxx-5f76-4ae8-9133-xxxxxxxxxx487"
            }
          ],
          "startSynchronization": true
        },
        user: {
          _id: "11c500df-ebb0-475b-ba4d-06704a5bf7bb"
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

    await productLink.unpublish(req, res);
    //

    console.log("Fin product-price.controller.test");
  } catch (error) {
    console.error("Error product-price.controller.test");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();