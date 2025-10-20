import * as ripley from '../../server/components/connect/ripley/index';

const task = {
	ProductLinkId: '',
	MarketplaceConnectionId: '',
	SynchronizationTasksCollectionId: '',
};

ripley.sendRepublishProductsSynchronizationTasksCollectionToRemote(task);