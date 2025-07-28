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
import * as productStock from '../../server/api/product-stock/product-stock.controller';
//

(async () => {
  try {
    console.log("Inicio product-price.controller.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const req = {
      params: {
        productVersionId: '',
        warehouseId: ''
      },
      body: [
        {
          amount: 1,
          type: '',
          comment: '',
        }
      ]
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

    await productStock.updateProductVersionStock(req, res);
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