//@ts-check
"use strict";
import {
  MarketplaceConnection
} from '../../server/sqldb/index';
import config from '../../server/config/environment';
import * as crypto from '../../server/utils/crypto';

//
import VtexAPIClient from '../../server/components/connect/vtex-v2/vtex-client';
//

(async () => {
  try {
    console.log("Inicio vtex-client.test");

    //
    const marketplaceConnection = await MarketplaceConnection.findOne({
      where: {
        MerchantId: '',
        _id: '',
      },
      raw: true,
      nest: true
    });

    if (marketplaceConnection == null)
      throw new Error("marketplaceConnection not found");

    const accountName = marketplaceConnection.accountName;
    const environment = marketplaceConnection.environment;
    const appKey = crypto.decrypt(marketplaceConnection.api_key);
    const appSecret = crypto.decrypt(marketplaceConnection.api_secret_key);

    const apiClient = new VtexAPIClient(
      accountName,
      environment,
      appKey,
      appSecret
    );

    const response = await apiClient.getStores();

    console.log('Respuesta:');
    // console.log(JSON.stringify(response, null, 2));
    console.log(response);
    //

    console.log("Fin vtex-client.test");
  } catch (error) {
    console.error("Error vtex-client.test:");
    console.error(error.stack ?? error.message);
  }
})();