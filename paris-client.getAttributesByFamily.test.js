import {
  MarketplaceConnection
} from '../../server/sqldb/index';
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
        MerchantId: '',
        _id: '',
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
      marketplaceConnectionId,
    );

    const familyId = '';

    const response = await parisAPIClient.getAttributesByFamily(familyId, null);

    console.log('Respuesta:');
    console.log(response);
    console.log(JSON.stringify(response, null, 2));
    //

    console.log("Fin paris-client.test");
  } catch (error) {
    console.error("Error paris-client.test:");
    console.error(error.stack ?? error.message);
  }
})();
