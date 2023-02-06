import { generateResourcesApi } from './api';
import { generateResourcePages } from './pages';
import { generateResourceRoutes} from './routes';
import type { ResourceProps } from './types';

export { generateResourcesApi } from './api';

export const generateResource = (resource: ResourceProps) => {
  const apiHooks = generateResourcesApi(resource);
  const Pages = generateResourcePages({
    apiHooks,
    ...resource,
  });
  const routes = () => generateResourceRoutes({
    Pages,
    ...resource,
  });

  return {
    Pages,
    apiHooks,
    resource,
    routes,
  };
};
