import React from 'react';
import classNames from 'classnames';

import {
  withZoomInOut,
} from 'src';

import MapToolbar_ from './MapToolbar_.styl';

const MapToolbar = withZoomInOut(({
  className,
  zoom,
  maxZoom,
  minZoom,
  zoomIn,
  zoomOut,
}) => (
  <div className={classNames(className)}>
    <div className={MapToolbar_.Panel}>
      <button
        className={MapToolbar_.Button}
        onClick={zoomIn}
        disabled={zoom === maxZoom}
      >
        +
      </button>
      <button
        className={MapToolbar_.Button}
        onClick={zoomOut}
        disabled={zoom === minZoom}
      >
        &minus;
      </button>
    </div>
  </div>
));

export default MapToolbar;
