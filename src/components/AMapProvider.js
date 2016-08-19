import { Children, Component, PropTypes } from 'react';
import createHelper from 'recompose/createHelper';
import getContext from 'recompose/getContext';

import { withAMap } from './AMapLoader';

class AMapProvider extends Component {
  static propTypes = {
    AMap: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    getOptions: PropTypes.func,
  };

  static defaultProps = {
    getOptions: () => ({}),
  };

  static childContextTypes = {
    map: PropTypes.object,
    $map: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.initialMap();
  }

  getChildContext() {
    return {
      map: this.map,
      $map: this.$map,
    };
  }

  componentWillUnmount() {
    this.$map = null;
    this.map = null;
  }

  initialMap() {
    const { AMap, getOptions } = this.props;

    this.$map = global.document.createElement('div');
    this.$map.setAttribute('style', 'width: 100%; height: 100%;');

    // no method to get zooms;
    const defaultOptions = {
      zooms: [3, 18],
    };

    const finalGetOptions = () => ({
      ...defaultOptions,
      ...getOptions(this.props),
    });

    this.map = new AMap.Map(this.$map, finalGetOptions());

    Object.assign(this.map, {
      getOptions: finalGetOptions,
    });
  }

  render() {
    return Children.only(this.props.children);
  }
}

export default withAMap(AMapProvider);

export const withMap = createHelper(
  getContext(AMapProvider.childContextTypes),
  'withMap',
  true,
  true
);

