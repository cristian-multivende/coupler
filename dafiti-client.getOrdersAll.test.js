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

    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), 12, 0, 0, 0, 0);
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), 13, 0, 0, 0, 0);
    const dateStart = dayStart.toISOString();
    const dateEnd = dayEnd.toISOString();

    const qs = {
      limit: 50,
      offset: 0,
      sort: 'createdAt',
      sortDir: 'desc',
      dateStart,
      dateEnd
    };
    const response = await dafitiAPIClient.getOrdersAll(qs);

    // Búsqueda por string dentro de cada entry individual (no en el JSON completo)
    const wantedIds = ["1033780610", "243931199", "211471199"];
    const items = (response && response.response && Array.isArray(response.response.items)) ? response.response.items : [];

    const foundSet = new Set();
    const occurrences = []; // detalle: {id, orderIndex}

    items.forEach((entry, idx) => {
      const entryStr = JSON.stringify(entry);
      wantedIds.forEach(id => {
        if (!foundSet.has(id) && entryStr.includes(id)) {
          foundSet.add(id);
          occurrences.push({ id, orderIndex: idx });
        }
      });
    });

    const found = [...foundSet];
    const missing = wantedIds.filter(id => !foundSet.has(id));


    console.log('Respuesta:');
    console.log(JSON.stringify(response, null, 2));

    console.log("Verificación órdenes objetivo (string por entry individual):");
    console.log("Encontradas:", found);
    console.log("Faltantes:", missing);
    console.log("Detalles coincidencias:", occurrences);

    // Contenido completo de cada entry coincidente
    if (occurrences.length) {
      const matchedEntries = occurrences.map(o => {
        return {
          idBuscado: o.id,
          indexEnItems: o.orderIndex,
          entry: items[o.orderIndex] // objeto completo
        };
      });
      console.log("Entradas completas de coincidencias:");
      console.log(JSON.stringify(matchedEntries, null, 2));
    } else {
      console.log("No hay entradas coincidentes para mostrar contenido.");
    }

    console.log("Fin dafiti-client.test");
  } catch (error) {
    console.error("Error dafiti-client.test:");
    console.error(error.stack ?? error.message);
  }
})();