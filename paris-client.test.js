import {
  MarketplaceConnection
} from '../../server/sqldb/index';
import config from '../../server/config/environment';
import * as crypto from '../../server/utils/crypto';

//
import ParisAPIClient from '../../server/components/connect/paris-v2/paris-client.js';
//

(async () => {
  try {
  console.log("Inicio paris-client.test");

  //
    const marketplaceConnection = await MarketplaceConnection.findOne({
      where: {
        MerchantId: '6f7b58ab-c802-445a-a2b1-44d4ada1ac83',
        _id: '8c8dcbe9-ffab-4493-81b3-865d90a7c9a2',
      },
      raw: true,
      nest: true
    });

    if (marketplaceConnection == null)
      throw new Error("MarketplaceConnection not found");

    const country = marketplaceConnection.country;
    const apiKey = crypto.decrypt(marketplaceConnection.api_key);
    const accessToken = marketplaceConnection.access_token;
    const marketplaceConnectionId = marketplaceConnection._id;

    const parisAPIClient = new ParisAPIClient(
      country,
      apiKey,
      accessToken,
      marketplaceConnectionId
    );
    
    const response = await parisAPIClient.getAttributesByFamily(familyId, null);

    console.log('Respuesta:');
    console.log(JSON.stringify(response, null, 2));
    //

    console.log("Fin paris-client.test");
  } catch (error) {
    console.error("Error paris-client.test:");
    console.error(error.stack ?? error.message);
  }
})();