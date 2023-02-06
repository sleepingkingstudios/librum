import * as React from 'react';

import { Page } from '@components/page';
import { CoreNavigation } from '@core/navigation';

export const HomePage = (): JSX.Element => (
  <Page navigation={<CoreNavigation />}>
    <div>
      <p>
        At twilight&apos;s end, the shadows cross&apos;d<br />
        A new world birthed, the elder, lost-<br />
      </p>

      <p>
        Yet on the morn we wake to find<br />
        That mem&apos;ry left so far behind
      </p>

      <p>
        To deafened ears we ask, unseen-<br />
        Which is life, and which the dream?
      </p>
    </div>
  </Page>
);
