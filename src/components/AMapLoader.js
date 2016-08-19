import { Component, PropTypes, Children } from 'react';
import createHelper from 'recompose/createHelper';
import getContext from 'recompose/getContext';

let isDOMReady = false;

global.document.addEventListener('DOMContentLoaded', () => {
  isDOMReady = true;
});

const loadAMapSDK = (key, callback) => {
  /* eslint global-require: 0 */
  const $script = require('scriptjs');

  const load = () => {
    $script(`//webapi.amap.com/maps?v=1.3&key=${key}`, () => {
      callback(global.AMap);
    });
  };

  if (isDOMReady) {
    load();
  } else {
    global.document.addEventListener('DOMContentLoaded', load);
  }

  // or add $.ready in index.js
};

class AMapLoader extends Component {
  static propTypes = {
    sdkKey: PropTypes.string.isRequired,
    plugins: PropTypes.arrayOf(PropTypes.string),
    loadSDK: PropTypes.func,
    children: PropTypes.node,
  };

  static defaultProps = {
    loadSDK: loadAMapSDK,
  };

  static childContextTypes = {
    AMap: PropTypes.object,
  };

  state = {
    AMap: null,
  };

  getChildContext() {
    return {
      AMap: this.state.AMap,
    };
  }

  componentDidMount() {
    const { loadSDK, sdkKey } = this.props;

    loadSDK(sdkKey, (AMap) => {
      this.setState({
        AMap,
      });
    });
  }

  isAMapLoaded() {
    return !!this.state.AMap;
  }

  render() {
    if (this.isAMapLoaded()) {
      return Children.only(this.props.children);
    }
    return null;
  }
}

export default AMapLoader;

export const withAMap = createHelper(
  getContext(AMapLoader.childContextTypes),
  'withAMap',
  true,
  true
);
