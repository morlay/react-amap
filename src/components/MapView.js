import React from 'react';

import { withMap } from './AMapProvider';

export default withMap(({ className, $map }) => (
  <div
    className={className}
    ref={($elm) => {
      if ($elm) {
        $elm.appendChild($map);
      }
    }}
  />
));
