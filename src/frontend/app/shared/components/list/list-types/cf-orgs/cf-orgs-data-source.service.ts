import { Store } from '@ngrx/store';
import { schema } from 'normalizr';

import { getRowMetadata } from '../../../../../features/cloud-foundry/cf.helpers';
import { CloudFoundryEndpointService } from '../../../../../features/cloud-foundry/services/cloud-foundry-endpoint.service';
import { AppState } from '../../../../../store/app-state';
import { entityFactory, organisationSchemaKey } from '../../../../../store/helpers/entity-factory';
import { APIResource } from '../../../../../store/types/api.types';
import { ListDataSource } from '../../data-sources-controllers/list-data-source';
import { IListConfig } from '../../list.component.types';

export class CfOrgsDataSourceService extends ListDataSource<APIResource> {

  constructor(store: Store<AppState>, cfGuid: string, listConfig?: IListConfig<APIResource>) {
<<<<<<< HEAD
    const paginationKey = getPaginationKey('cf-organizations', cfGuid);
    const action = new GetAllOrganisations(paginationKey, cfGuid);
=======
    const action = CloudFoundryEndpointService.createGetAllOrganisations(cfGuid);
>>>>>>> v2-master
    super({
      store,
      action,
      schema: entityFactory(organisationSchemaKey),
      getRowUniqueId: getRowMetadata,
      paginationKey: action.paginationKey,
      isLocal: true,
      transformEntities: [],
      listConfig
    });
  }
}
