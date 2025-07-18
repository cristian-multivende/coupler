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
        // productPriceListId: '85b45487-2005-471d-9de3-e6557b10b8f1',
        productVersionId: '17ac7513-5721-4e37-a4fc-57ab1d8fe4b5',
      },
      body: [
        {
          amount: 1000,
          type: "DECREASE",
          comment: "Venta de producto",
          // ProductRelocationCategoryId: "uuid-de-categoría",
          // OriginProviderId: "uuid-del-proveedor",
          // CostCurrencyId: "uuid-de-moneda",
          unitCost: 100,
          // ProductStockBatchId: "uuid-de-batch"
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