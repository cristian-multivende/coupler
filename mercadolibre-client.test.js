//@ts-check
"use strict";
import {
  MarketplaceConnection
} from '../../server/sqldb/index';
import config from '../../server/config/environment';
import * as crypto from '../../server/utils/crypto';

//
import MercadolibreAPIClient from '../../server/components/connect/mercadolibre-v2/mercadolibre-client';
//

(async () => {
  try {
    console.log("Inicio mercadolibre-client.test");

    //
    const marketplaceConnection = await MarketplaceConnection.findOne({
      where: {
        MerchantId: 'ba0cdd4b-96dd-4572-9d36-c1d72fc5996f',
        _id: '59796349-8ee4-45a4-ae26-e3df8909e76c',
      },
      raw: true,
      nest: true
    });

    if (marketplaceConnection == null)
      throw new Error("marketplaceConnection not found");

    const country = marketplaceConnection.country;
    const userId = marketplaceConnection.user_id;
    const accessToken = marketplaceConnection.access_token;
    const refreshToken = marketplaceConnection.refresh_token;
    const marketplaceConnectionId = marketplaceConnection._id;

    const apiClient = new MercadolibreAPIClient(
      country,
      userId,
      accessToken,
      refreshToken,
      marketplaceConnectionId
    );

    const response = apiClient.getDiscountsAppliedToASale('2000011200020126');

    console.log('Respuesta:');
    console.log(JSON.stringify(response, null, 2));
    //

    console.log("Fin mercadolibre-client.test");
  } catch (error) {
    console.error("Error mercadolibre-client.test:");
    console.error(error.stack ?? error.message);
  }
})();