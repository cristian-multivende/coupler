import {
  MarketplaceConnection
} from '../../server/sqldb/index';
import config from '../../server/config/environment';
import ParisAPIClient from '../../server/components/connect/paris-v2/paris-client.js';
import * as crypto from '../../server/utils/crypto';

(async () => {
  try {
    const marketplaceConnection = await MarketplaceConnection.findOne({
      where: {
        MerchantId: 'be133293-15a1-4f01-822a-60428b07e2f8', // calvin klein: 'cfed12d2-ac5b-45d5-a53a-20cd462cad68',
        _id: '5611f961-45aa-41ce-b00b-bb0bf4076653', // calvin klein: '859bcdec-f729-4301-9416-93fbfb3e02ed',
      },
      raw: true,
      nest: true
    });

    if (!marketplaceConnection) {
      throw new Error("MarketplaceConnection not found.");
    }

    const country = marketplaceConnection.country;
    const apiKey = crypto.decrypt(marketplaceConnection.api_key);
    const accessToken = marketplaceConnection.access_token;
    const marketplaceConnectionId = marketplaceConnection._id;

    let parisAPIClient = new ParisAPIClient(
      country,
      apiKey,
      accessToken,
      marketplaceConnectionId
    );

    const skuList = [
      'MK3XUORODX',

    ];

    // await updateStockToZero(parisAPIClient, skuList);
    await verifyStockIsZero(parisAPIClient, skuList);
    console.log('FIN')
  } catch (error) {
    console.error(error);
  }

})();

async function updateStockToZero(parisAPIClient, skuList) {
  for (const sku of skuList) {
    const product = await parisAPIClient.getStockSkus(sku, null);
    console.log('Producto obtenido para', sku, ':', JSON.stringify(product, null, 2));

    const stockPayload = product.response.skus.map(item => ({ sku: item.sku, quantity: 0 }));
    const updateResponse = await parisAPIClient.upsertStock({ skus: stockPayload });
    console.log('Stock actualizado a 0 para variantes de', sku, ':', JSON.stringify(updateResponse, null, 2));
  }
}

async function verifyStockIsZero(parisAPIClient, skuList) {
  const parentSkusWithStock = new Set();

  for (const parentSku of skuList) {
    const verification = await parisAPIClient.getStockSkus(parentSku, null);
    console.log('Verificación stock para', parentSku, ':', JSON.stringify(verification.response.skus, null, 2));
    
    let allZero = true;
    verification.response.skus.forEach(item => {
      if (item.quantity !== 0) {
        console.error(`Stock de ${item.sku} es ${item.quantity}, esperado 0`);
        parentSkusWithStock.add(parentSku);
        allZero = false;
      }
    });
    
    if (allZero) {
      console.log('Todas las variantes de', parentSku, 'tienen stock 0');
    }
  }

  if (parentSkusWithStock.size > 0) {
    console.log('\n=== SKUs padres que aún tienen stock ===');
    [...parentSkusWithStock].forEach(sku => {
      console.log(`${sku}`);
    });
  }
}