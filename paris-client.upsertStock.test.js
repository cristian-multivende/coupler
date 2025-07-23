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
        MerchantId: '',
        _id: '',
      },
      raw: true,
      nest: true
    });

    if (!marketplaceConnection) {
      throw new Error("MarketplaceConnection not found");
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

    const skuList = Array.from(new Set([

    ]));

    await updateStockToZero(parisAPIClient, skuList);
    await verifyStockIsZero(parisAPIClient, skuList);
    console.log('FIN');
  } catch (error) {
    console.error(error);
  }

})();

async function updateStockToZero(parisAPIClient, skuList) {
  for (const sku of skuList) {
    const product = await parisAPIClient.getStockSkus(sku, null);
    console.log('Producto obtenido para', sku, ':', JSON.stringify(product, null, 2));

    const stockPayload = product.response.skus.map((item) => ({ sku: item.sku, quantity: 0 }));
    const updateResponse = await parisAPIClient.upsertStock({ skus: stockPayload });
    console.log('Stock actualizado a 0 para variantes de', sku, ':', JSON.stringify(updateResponse, null, 2));
  }
}

async function verifyStockIsZero(parisAPIClient, skuList) {
  const skusWithZeroStock = new Set();
  const skusWithRemainingStock = new Set();
  const skusFulfillment = new Set();
  const skusWithErrors = new Set();

  for (const parentSku of skuList) {
    let verification;
    try {
      verification = await parisAPIClient.getStockSkus(parentSku, null);
    } catch (error) {
      console.error(`Error al consultar SKU ${parentSku}:`, error.message);
      skusWithErrors.add(parentSku);
      continue;
    }

    if (!verification.response?.skus || verification.response.skus.length === 0) {
      console.warn(`No hay SKUs para el producto ${parentSku}, saltando...`);
      skusWithErrors.add(parentSku);
      continue;
    }

    let allZero = true;
    let hasFulfillmentWithStock = false;

    verification.response.skus.forEach((item) => {
      console.log(`SKU: ${item.sku}, Stock: ${item.quantity}, isFulfillment: ${item.isFulfillment}`);
      if (item.quantity !== 0) {
        allZero = false;
        if (item.isFulfillment) {
          hasFulfillmentWithStock = true;
        }
      }
    });

    if (allZero) {
      skusWithZeroStock.add(parentSku);
    } else if (hasFulfillmentWithStock) {
      skusFulfillment.add(parentSku);
    } else {
      skusWithRemainingStock.add(parentSku);
    }
  }

  console.log('Resultados:');

  console.log(`SKUs procesados [${skuList.length}]:`);
  skuList.forEach((sku) => console.log(sku));

  console.log(`SKUs sin stock [${skusWithZeroStock.size}]:`);
  skusWithZeroStock.forEach((sku) => console.log(sku));

  console.log(`SKUs con stock [${skusWithRemainingStock.size}]:`);
  skusWithRemainingStock.forEach((sku) => console.log(sku));

  console.log(`SKUs fulfillment [${skusFulfillment.size}]:`);
  skusFulfillment.forEach((sku) => console.log(sku));

  console.log(`SKUs con errores en consulta [${skusWithErrors.size}]:`);
  skusWithErrors.forEach((sku) => console.log(sku));
}