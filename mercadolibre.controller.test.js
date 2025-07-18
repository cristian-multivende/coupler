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
import * as mercadolibre from '../../server/api/mercadolibre/mercadolibre.controller';
//

(async () => {
  try {
    console.log("Inicio mercadolibre-connection.controller.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const req = {
      params: { connectionId: '7bf9a0e9-fde6-4254-9642-e955cba0922d' },
      body: {
        _id: 'a03db559-f5f0-4d3a-b84a-3eb1ec51d3d2',
        name: 'Ofertas julio',
        code: 'hasta_agotar_stock',
        description: null,
        position: 27,
        activeFrom: '2025-07-17T13:05:09.534Z',
        activeTo: '2025-08-12T07:59:59.000Z',
        status: 'created',
        processStatus: 'pending',
        createdAt: '2025-06-26T17:38:03.000Z',
        updatedAt: '2025-06-26T17:38:03.000Z',
        MerchantId: 'db7bca2c-9dab-4ee9-bea3-24a6e67e17ee',
        CurrencyId: '9990cefa-f160-4c29-ba1e-dc707b2ae871',
        CreatedById: 'a7f123a5-c1a6-4c2a-8a43-8a6574978358',
        UpdatedById: 'a7f123a5-c1a6-4c2a-8a43-8a6574978358',
        TimezoneId: 'dee790bc-fdef-492b-9637-7cfd1f1fc031'
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

    await mercadolibre.createCampaignRemote(req, res);
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