//@ts-check
"use strict";
import {
  MarketplaceConnection
} from '../../server/sqldb/index';
import config from '../../server/config/environment';
import * as crypto from '../../server/utils/crypto';

//
import RocketAPIClient from '../../server/components/connect/rocket/rocket-client.js';
//

(async () => {
  try {
    console.log("Inicio rocket-client.test");

    //
    const marketplaceConnection = await MarketplaceConnection.findOne({
      where: {
        MerchantId: 'c843cee8-f5ea-4513-afa5-6c05cf09e93d',
        _id: 'd302d9c8-d366-4b46-aa40-2530fe6ce8f4',
      },
      raw: true,
      nest: true
    });

    if (marketplaceConnection == null)
      throw new Error("marketplaceConnection not found");

    const configFcom = config.fcom;
    const country = marketplaceConnection.country;
    const api_username = marketplaceConnection.api_username;
    const api_key = crypto.decrypt(marketplaceConnection.api_key);
    const marketplaceConnectionId = marketplaceConnection._id;
    const sellerId = '';

    const rocketAPIClient = new RocketAPIClient(
      configFcom,
      country,
      api_username,
      api_key,
      marketplaceConnectionId,
      // sellerId,
    );

    const response = await rocketAPIClient.getFailureReasons();

    console.log('Respuesta:');
    console.log(JSON.stringify(response, null, 2));
    //

    console.log("Fin rocket-client.test");
  } catch (error) {
    console.error("Error rocket-client.test:");
    console.error(error.stack ?? error.message);
  }
})();