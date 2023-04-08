import { generateResourcePages } from './pages';
import { generateResourceRoutes} from './routes';
import type { ResourceProps } from './types';

export const generateResource = (resource: ResourceProps) => {
  const Pages = generateResourcePages(resource);
  const routes = () => generateResourceRoutes({
    Pages,
    ...resource,
  });

  return {
    Pages,
    resource,
    routes,
  };
};
