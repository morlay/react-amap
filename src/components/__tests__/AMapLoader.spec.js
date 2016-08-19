import React from 'react';

import {
  expect,
  mount,
} from '@morlay/tests-react';

import AMapLoader, { withAMap } from '../AMapLoader';

describe(__filename, () => {
  describe('AMapLoader', () => {
    it('will load AMap and set AMap in context', (done) => {
      const sdkKey = '123';

      const loadSDK = (key, callback) => {
        setTimeout(() => {
          callback({
            Map: true,
          });
        }, 1000);
      };

      const Map = withAMap(() => <span />);

      const wrapper = mount(
        <AMapLoader
          sdkKey={sdkKey}
          loadSDK={loadSDK}
        >
          <div>
            <Map />
          </div>
        </AMapLoader>
      );

      expect(wrapper.find(Map)).to.have.length(0);

      setTimeout(() => {
        expect(wrapper.find(Map)).to.have.length(1);
        expect(wrapper.find(Map).get(0).context).to.eql({
          AMap: {
            Map: true,
          },
        });

        done();
      }, 1200);
    });
  });
});
