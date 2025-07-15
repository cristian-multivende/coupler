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
import * as coppelConnection from '../../server/api/coppel-connection/coppel-connection.controller';
//

(async () => {
  try {
    console.log("Inicio coppel-controller.test");

    const dbUrl = process.env.MONGO_URL || config.mongodb.uri;
    await mongoose.connect(dbUrl, {});

    //
    const req = {
      params: {
        merchantId: "56f0ee3f-4259-42ac-b635-d6fe20d3bc75",
        country: "mx"
      },
      body: {
        api_username: "chenliang2@midea.com",
        api_key: "2ea30e1d-5800-4bda-9134-e1e8c8eaa659"
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

    await coppelConnection.create(req, res);
    //

    console.log("Fin coppel-controller.test");
  } catch (error) {
    console.error("Error coppel-controller.test:");
    console.error(error.stack ?? error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();