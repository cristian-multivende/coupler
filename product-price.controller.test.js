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
import * as productPrice from '../../server/api/product-price/product-price.controller.js';
//

(async () => {
  try {
    console.log("Inicio product-price.controller.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const req = {
      params: {
        productPriceListId: '85b45487-2005-471d-9de3-e6557b10b8f1',
        productVersionId: '181-1374-24',
      },
      body: {
        net: 0,
        tax: 0,
        gross: 129.90,
        priceWithDiscount: 0
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

    await productPrice.setProductVersionPrice(req, res);
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