import React from 'react';

import {
  AMapLoader,
  AMapProvider,
  MapView,
} from 'src';

import MapToolbar from '../components/MapToolbar';

import Map_ from './Map_.styl';

const Map = () => (
  <AMapLoader sdkKey='dd78329a262137fb968fdbbaca8fb45b'>
    <div className={Map_.root}>
      <AMapProvider
        getOptions={() => ({
          zoom: 6,
          zooms: [7, 16],
        })}
      >
        <div className={Map_.Container}>
          <MapView className={Map_.MapView} />
          <MapToolbar className={Map_.MapToolbar} />
        </div>
      </AMapProvider>
      <AMapProvider
        getOptions={() => ({
          zoom: 16,
          zooms: [7, 16],
        })}
      >
        <div className={Map_.Container}>
          <MapView className={Map_.MapView} />
          <MapToolbar className={Map_.MapToolbar} />
        </div>
      </AMapProvider>
    </div>
  </AMapLoader>
);

export default Map;
