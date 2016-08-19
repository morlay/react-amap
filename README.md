## React AMap integration


```
AMapLoader
    |    
    | context.AMap // AMap SDK
    |
    AMapProvider
         |
         | context.$map // dom container of map instance
         | context.map // map instance of AMap
         |
         MapView // contains $map
         withZoomInOut(ZoomInOutControls)
    AMapProvider     
    AMapProvider
    ...
```

这不是一个完整的库, 而只是一个 React 集成较大型三方类库的的思路。

较大型三方类库的特点:

* 需加载 MapSDK.js 全局注册。
* 提供完整的 APIs 以操作自身对应元素。
* 一般伴有事件的注册与销毁机制, 方便状态的同步。

Map 便是其中较符合的一个例子。

在实际使用中, Map 往往会作为一个子应用, 存在大型系统中。
除了该子应用, 其他子应用中不应该去加载其所依赖的 MapSDK.js, 按需加载是一个很必要的需求。
同时被全局注册的 Map 类与方法, 不宜被直接调用(会增加测试的难度)。

React 提供了统一的 lifecycle, 在集成 Map 的时候, 可以加以利用。
同样, React.Context 也可以方便 Map 的使用。

### MapSDK 的准备 —— AMapLoader

其一是 MapSDK 的按需加载, 这点很容易想到利用 [script.js](https://github.com/ded/script.js/) 
一类的 JavaScript Loader 方案实现。

`componentDidMount` 中加载 MapSDK, 首次 render 的时候返回 `null` 或者别的 loading placeholder, 
加载完成后, `setState` re-render AMapLoader, 同时 AMapLoader 的 children 在此时才随之 mount。
以此, 确保子 Component 中的 MapSDK 的调用是存在的。

当然, 子 Component 中调用 MapSDK 可以从使用 `global.AMap`, 但这不利于测试, 也会对后期维护带来困扰。
将整个 AMap 对象放到 React.Context 会是个不错的选择 (参考 `react-router` 和 `redux` 的做法), 
且对于复杂 Map 应用, children 会是较复杂的结构, 因此不通过 `props` 传递, 
只是在需要使用 MapSDK 的组件处, 用 `withAMap`, 将 `AMap` 的引入 从 `context` 换至 `props`; 

### Map instance 和 composers

```
|----------------------------|
|           |                |
|  MapView  |  LocationList  |
|           |                |
|----------------------------|
```

应用场景的不同, Map 在子应用的位置也会是不同的, 使用到的功能也是组合多样。
过重的封装, 是没有必要的, 但依然可以有抽离公用部分的地方。
 
比如这里 AMapProvider 将创建 map instance 供 AMapProvider 的 children 访问, 
当然也是通过 React.Context。
这样做, 可以将 map instance 限定到较小的 scope 中, 同时利用 React 的 Component 模式隔离一些逻辑。

同时, 在 map 的控制逻辑中, 可以使用 High-order Component 将 map 的部分状态, 及其操作方法组合起来,
并确保 map instance 的对应状态的同步。
这样我们可以将 UI 独立, 随意变换, 而交互逻辑作为公用的 composer, 被复用。

如下:

```js
import React from 'react';
import classNames from 'classnames';

import {
  withZoomInOut,
} from 'react-amap';

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
```

更多细节参考源代码。