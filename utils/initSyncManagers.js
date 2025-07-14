async function initSyncManagers() {
  const SyncManagerFactory = require("../../../server/utils/sync-manager-factory");
  const HookSyncManagerFactory = require("../../../server/utils/hook-sync-manager-factory");
  const masterSyncManagerQueue = require('../../../server/components/background-tasks/sync-manager/queue');

  await Promise.all([
    SyncManagerFactory.initializeFactory(masterSyncManagerQueue),
    HookSyncManagerFactory.initializeFactory(masterSyncManagerQueue)
  ]);
}

module.exports = initSyncManagers;