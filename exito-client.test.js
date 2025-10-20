import {
  MarketplaceConnection
} from '../../server/sqldb/index';
import config from '../../server/config/environment';
import * as crypto from '../../server/utils/crypto';

//
import ExitoAPIClient from '../../server/components/connect/exito/exito-client';
//

(async () => {
  try {
    console.log("Inicio exito-client.test");

    //
    const marketplaceConnection = await MarketplaceConnection.findOne({
      where: {
        MerchantId: '',
        _id: '',
      },
      raw: true,
      nest: true,
    });

    if (marketplaceConnection == null)
      throw new Error("MarketplaceConnection not found");

    const accessToken = crypto.decrypt(marketplaceConnection.access_token);
    const refreshToken = crypto.decrypt(marketplaceConnection.refresh_token);
    const marketplaceConnectionId = marketplaceConnection._id;
    const country = marketplaceConnection.country;

    const exitoAPIClient = new ExitoAPIClient(accessToken, refreshToken, marketplaceConnectionId, country);

    const categoryId = 27240;

    const response = await exitoAPIClient.getFeaturesbyCategoryId(categoryId);

    console.log('Respuesta:');
    // console.log(JSON.stringify(response, null, 2));
    console.log(response);
    //

    console.log("Fin exito-client.test");
  } catch (error) {
    console.error("Error exito-client.test:");
    console.error(error.stack ?? error.message);
  }
})();
