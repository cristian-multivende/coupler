import {
  MarketplaceConnection
} from '../../server/sqldb/index';
import config from '../../server/config/environment';
import * as crypto from '../../server/utils/crypto';

import DafitiAPIClient from '../../server/components/connect/dafiti-v2/dafiti-client';

(async () => {
  try {
    console.log("Inicio dafiti-client.test");

    const marketplaceConnection = await MarketplaceConnection.findOne({
      where: {
        MerchantId: 'a152f822-4488-4c96-a250-2348b727b827',
        _id: 'e3699d6b-5904-4432-883e-2d91e4e3a4c3',
      },
      raw: true,
      nest: true
    });

    if (marketplaceConnection == null)
      throw new Error("MarketplaceConnection not found");

    const country = marketplaceConnection.country;
    const apiUserId = marketplaceConnection.api_user_id;
    const apiSecretKey = crypto.decrypt(marketplaceConnection.api_secret_key);
    const accessToken = marketplaceConnection.access_token;
    const marketplaceConnectionId = marketplaceConnection._id;
    
    const dafitiAPIClient = new DafitiAPIClient(
      country,
      apiUserId,
      apiSecretKey, 
      accessToken,
      marketplaceConnectionId
    );
    
    const response = await dafitiAPIClient.getOrderId('4694145');

    console.log('Respuesta:');
    console.log(JSON.stringify(response, null, 2));

    console.log("Fin dafiti-client.test");
  } catch (error) {
    console.error("Error dafiti-client.test:");
    console.error(error.stack ?? error.message);
  }
})();