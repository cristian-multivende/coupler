import * as ripley from '../../server/components/connect/ripley/index';
import config from '../../server/config/environment';

const { ripley } = config;

const task = {
  MarketplaceConnectionId: "21355a16-5da2-483e-9380-937408f9a188",
  UserId: "11c500df-ebb0-475b-ba4d-06704a5bf7bb",
  SynchronizationTasksCollectionId: "a91dff2b-5f7c-477f-84fa-c0e327b646b0"
};

ripley.fetchProductsRepublishTasksCollectionFeedStatus(task, ripley);