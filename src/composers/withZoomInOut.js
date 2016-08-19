import React, { PropTypes, Component } from 'react';
import createHelper from 'recompose/createHelper';

import { withAMap } from '../components/AMapLoader';
import { withMap } from '../components/AMapProvider';

const getZoomRangeFromOptions = (options) => ({
  minZoom: options.zooms[0],
  maxZoom: options.zooms[1],
});

const withZoomInOut = (BaseComponent) => {
  @withAMap
  @withMap
  class ZoomInOut extends Component {
    static propTypes = {
      className: PropTypes.string,
      AMap: PropTypes.object,
      map: PropTypes.object,
    };

    state = {
      zoom: this.props.map.getZoom(),
      ...getZoomRangeFromOptions(this.props.map.getOptions()),
    };

    componentDidMount() {
      const { map, AMap } = this.props;

      this.zoomChangeListener = AMap.event.addListener(map, 'zoomchange', () => {
        const nextZoom = map.getZoom();

        if (nextZoom !== this.state.zoom) {
          this.setState({
            zoom: nextZoom,
          });
        }
      });
    }

    componentWillUnmount() {
      this.props.AMap.event.removeListener(this.zoomChangeListener);
    }

    render() {
      const { map, ...otherProps } = this.props;

      return (
        <BaseComponent
          {...otherProps}
          {...this.state}
          zoomIn={() => map.zoomIn()}
          zoomOut={() => map.zoomOut()}
        />
      );
    }
  }

  return ZoomInOut;
};

export default createHelper(withZoomInOut, 'withZoomInOut', true, true);
