import React from 'react';
import { render } from 'react-dom';

import Map from './map/containers/Map';

import './index.styl';

global.document.addEventListener('DOMContentLoaded', () => {
  render(<Map />, global.document.getElementById('root'));
});

