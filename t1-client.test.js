//@ts-check
"use strict";
import {
  MarketplaceConnection
} from '../../server/sqldb/index';
import {
  MarketplaceConnectionServices
} from '../../server/services/marketplace-connection';
import config from '../../server/config/environment';
import * as crypto from '../../server/utils/crypto';

//
import T1Client from '../../server/components/connect/t1/t1-client';
//

(async () => {
  try {
    console.log("Inicio t1-client.test");

    //
    const marketplaceConnection = await MarketplaceConnection.findOne({
      where: {
        MerchantId: 'bf03e4e6-53a0-4082-9476-643633009049',
        _id: 'ccebeafb-4100-4f97-84c6-8521e15d4131',
      },
      raw: true,
      nest: true
    });

    if (marketplaceConnection == null)
      throw new Error("marketplaceConnection not found");
    
    const marketplaceConnectionId = marketplaceConnection._id;

    const marketplaceConnectionService = new MarketplaceConnectionServices();
    const marketplaceConnectionConfiguration = await marketplaceConnectionService.findMarketplaceConnectionConfiguration(marketplaceConnectionId, true, null);

    if (marketplaceConnectionConfiguration == null)
      throw new Error("marketplaceConnectionConfiguration not found");

    const clientId = marketplaceConnection.api_user_id;
    const username = marketplaceConnection.api_username;
    const password = crypto.decrypt(marketplaceConnection.api_key);
    const idCommerce = marketplaceConnectionConfiguration.shopCode;

    const t1Client = new T1Client(
      marketplaceConnectionId,
      clientId,
      username,
      password,
      idCommerce
    );

    const response = await t1Client.getToken();

    console.log('Respuesta:');
    console.log(JSON.stringify(response, null, 2));
    //

    console.log("Fin t1-client.test");
  } catch (error) {
    console.error("Error t1-client.test:");
    console.error(error.stack ?? error.message);
  }
})();