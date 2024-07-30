import * as Cesium from 'cesium'
import Speed from '../speed.js'
import {
    configInit,
    viewerInit,
} from './config.js'

import VectorTileImageryProvider from 'cesiumvectortile';


/**
* @typedef {Object} sceneOptions 场景入参参数
* @property {Object} [center] 默认相机视角
* @property {number} center.lng 经度值, 180 - 180
* @property {number} center.lat 纬度值, -90 - 90
* @property {number} center.alt 高度值
* @property {number} [center.heading] 方向角度值，绕垂直于地心的轴旋转角度, 0至360
* @property {number} [center.pitch] 俯仰角度值，绕纬度线旋转角度,-90至90
* @property {number} [center.roll] 翻滚角度值，绕经度线旋转角度, -90至90
* @property {Object} [extent] 矩形范围 相机视角,与center二选一
* @property {number} [extent.roll] 最小经度值, -180 至 180
* @property {number} [extent.xmin] 最大经度值, -180 至 180
* @property {number} [extent.xmax] 最小纬度值, -90 至 90
* @property {number} [extent.ymax] 最大纬度值, -90 至 90
* @property {boolean} [removeDblClick=false] 是否移除Cesium默认的双击事件
* @property {string} [ionToken] Cesium Ion服务的 Token令牌
* @property {number} [resolutionScale=1.0] 获取或设置渲染分辨率的缩放比例。小于1.0的值可以改善性能不佳的设备上的性能，而值大于1.0则将以更高的速度呈现分辨率，然后缩小比例，从而提高视觉保真度。例如，如果窗口小部件的尺寸为640x480，则将此值设置为0.5将导致场景以320x240渲染，然后在设置时按比例放大设置为2.0将导致场景以1280x960渲染，然后按比例缩小。以下是Cesium.Scene对象相关参数
* @property {boolean} [showSun] 是否显示太阳，如修改对象可以用 map.scene.sun
* @property {boolean} [showMoon] 是否显示月亮，如修改对象可以用 map.scene.moon
* @property {boolean} [showSkyBox] 是否显示天空盒，如修改对象可以用 map.scene.skyBox
* @property {boolean} [showSkyAtmosphere] 是否显示地球大气层外光圈，如修改对象可以用 map.scene.skyAtmosphere
* @property {boolean} [fog] 是否启用雾化效果，如修改对象可以用 map.scene.fog
* @property {boolean} [fxaa] 是否开启快速抗锯齿
* @property {boolean} [highDynamicRange] 是否关闭高动态范围渲染(不关闭时地图会变暗)
* @property {string} [backgroundColor] 空间背景色 ，css颜色值以下是Cesium.Viewer所支持的options【控件相关的写在另外的control属性中】
* @property {Cesium.SceneMode} [sceneMode=Cesium.SceneMode.SCENE3D] 初始场景模式。可以设置进入场景后初始是2D、2.5D、3D 模式。
* @property {boolean} [scene3DOnly=false] 为 true 时，每个几何实例将仅以3D渲染以节省GPU内存。
* @property {Cesium.MapProjection} [mapProjection=new Cesium.GeographicProjection()] 在二维模式下时，地图的呈现坐标系，默认为EPSG4326坐标系，如果需要EPSG3857墨卡托坐标系展示，传 new Cesium.WebMercatorProjection() 即可
* @property {Cesium.MapMode2D} [mapMode2D=Cesium.MapMode2D.INFINITE_SCROLL] 在二维模式下时，地图是可旋转的还是可以在水平方向无限滚动。
* @property {boolean} [shouldAnimate=true] 是否开启时钟动画
* @property {boolean} [shadows=false] 是否启用日照阴影
* @property {boolean} [useDefaultRenderLoop=true] 如果此小部件应控制渲染循环，则为true，否则为false。
* @property {number} [targetFrameRate] 使用默认渲染循环时的目标帧速率。
* @property {boolean} [useBrowserRecommendedResolution=true] 如果为true，则以浏览器建议的分辨率渲染，并忽略 window.devicePixelRatio 。
* @property {boolean} [automaticallyTrackDataSourceClocks=true] 如果为true，则此小部件将自动跟踪新添加的数据源的时钟设置，并在数据源的时钟发生更改时进行更新。如果要独立配置时钟，请将其设置为false。
* @property {object} [contextOptions={}] WebGL创建属性 传递给 Cesium.Scene 的 options 。Cesium.Scene
* @property {boolean} [contextOptions.allowTextureFilterAnisotropic=true] 允许纹理过滤各向异性
* @property {boolean} [contextOptions.requestWebgl1=false] 是否启用webgl1，cesium v1.102起默认用webgl2渲染
* @property {object} [contextOptions.webgl] WebGL画布,用于 canvas.getContext("webgl", webglOptions)
* @property {boolean} [contextOptions.webgl.alpha=false] 是否包含alpha缓冲区，如果需要DIV透明时，需要改为true
* @property {boolean} [contextOptions.webgl.antialias] 是否执行抗锯齿
* @property {boolean} [contextOptions.webgl.failIfMajorPerformanceCaveat] 如果系统性能较低，是否创建上下文
* @property {boolean} [contextOptions.webgl.depth] 绘图缓冲区的深度缓冲区至少为16位
* @property {boolean} [contextOptions.webgl.stencil=true] 绘图缓冲区具有至少8位的模板缓冲区
* @property {string} [contextOptions.webgl.powerPreference="high-performance"] 对用户代理的提示，指示GPU的哪种配置适合WebGL上下文
*/

/**
* @typedef {Object} controlOptions 控件参数
* @property {Boolean}[options.baseLayerPicker=false]  - 是否显示底图切换按钮(cesium原生)
* @property {Boolean}[options.homeButton=true] -是否显示视角复位按钮(cesium原生)
* @property {Boolean}[options.fullscreenButton=false] -是否显示全屏按钮(cesium原生)
* @property {Boolean}[options.sceneModePicker=false] -是否显示二三维切换按钮(cesium原生)
* @property {Boolean}[options.navigationHelpButton=false] -是否显示帮助按钮(cesium原生)
* @property {Boolean}[options.showRenderLoopErrors=true] - 如果为true，则在发生渲染循环错误时，此小部件将自动向包含错误的用户显示HTML面板(cesium原生)
* @property {Boolean}[options.navigationInstructionsInitiallyVisible=false] -帮助按钮 在用户明确单击按钮之前是否自动显示(cesium原生)
* @property {Boolean}[options.infoBox=false] -是否显示点击要素之后显示的信息面板(cesium原生)
* @property {Boolean}[options.shouldAnimate=false] -是否开启时钟动画(cesium原生)
* @property {Boolean}[options.geocoder=false] -是否显示地名查找按钮(cesium原生)
* @property {Boolean}[options.timeline=false] -是否显示时间线控件面板(cesium原生)
* @property {Boolean}[options.animation=false] -是否显示时钟仪表控制面板(cesium原生)
* @property {Boolean}[options.selectionIndicator=false] -是否显示选择模型时的绿色框(cesium原生)
* @property {Boolean}[options.vrButton=false] -是否显示右下角vr虚拟现实按钮(cesium原生)

* @property {boolean}[homeButton=false] 视角复位按钮，是否显示
* @property {object} zoom 放大缩小按钮 , 对应 Zoom构造参数
* @property {boolean} [sceneModePicker=false] 二三维切换按钮，是否显示二维、三维、2.5D视图切换按钮
* @property {boolean}[projectionPicker=false] 投影切换按钮, 是否显示用于在透视和正投影之间进行切换按钮
* @property {boolean}[fullscreenButton=false] 全屏按钮，是否显示
* @property {Element | string}[fullscreenElement=document.body] 当按下全屏按钮时，要置于全屏模式的元素或id
* @property {boolean} [vrButton=false] VR效果按钮，是否显示
* @property {Array.<Cesium.GeocoderService>} [geocoder=false] 是否显示 地名查找按钮 控件，是Cesium原生控件
* @property {boolean}[navigationHelpButton=false] 帮助按钮，是否显示
* @property {boolean} [navigationInstructionsInitiallyVisible=true]	 帮助按钮 在用户明确单击按钮之前是否自动显示
* @property {boolean}[baseLayerPicker=false] 是否显示 底图切换 按钮，是Cesium原生控件, 如果true底图是Cesium机制控制，Map内的basemaps相关获取和控制将会无效。
* @property {Array.<Cesium.ProviderViewModel>}[imageryProviderViewModels] baseLayerPicker底图切换面板中，用于图像的ProviderViewModel实例数组，默认自动根据basemaps数组生成。
* @property {Cesium.ProviderViewModel}[selectedImageryProviderViewModel] baseLayerPicker底图切换面板中，如果没有提供当前基本图像层的视图模型，则使用第一个可用的图像层。默认为show:true的basemaps图层
* @property {Array.<Cesium.ProviderViewModel>} [terrainProviderViewModels] baseLayerPicker底图切换面板中，用于地形的ProviderViewModel实例数组。默认自动使用terrain配置+无地形。
* @property {Cesium.ProviderViewModel}[selectedTerrainProviderViewModel] baseLayerPicker底图切换面板中，如果没有提供当前基础地形层的视图模型，则使用第一个可用的地形层。
* @property {object}[compass] 导航球, 对应 Compass构造参数
* @property {object}[locationBar] 状态栏, 对应 LocationBar构造参数
* @property {boolean}[locationBar.fps] 是否显示实时FPS帧率
* @property {string | function}[locationBar.format] 显示内容的格式化html展示的内容格式化字符串。 支持以下模版配置：【鼠标所在位置】 经度:{lng}， 纬度:{lat}， 海拔：{alt}米， 【相机的】 方向角度：{heading}， 俯仰角度：{pitch}， 视高：{cameraHeight}米， 【地图的】 层级：{level}，
* @property {object}[distanceLegend] 比例尺, 对应 DistanceLegend构造参数
* @property {object}[clockAnimate] 时钟控制, 对应ClockAnimate构造参数
* @property {boolean}[animation=true] 时钟仪表控制(Cesium原生)
* @property {Array.<number>}[animationTicks] 时钟仪表控制(Cesium原生)的可选步长
* @property {boolean}[timeline=true] 时间线, 是否创建下侧时间线控件面板
* @property {object}[overviewMap] 鹰眼地图, 对应OverviewMap构造参数
* @property {object}[mapSplit] 卷帘对比, 对应MapSplit构造参数
* @property {object}[keyboardRoam] 键盘漫游, 对应KeyboardRoam构造参数
* @property {boolean} [mouseDownView] 鼠标滚轮缩放美化样式(指示图标), 对应 MouseDownView构造参数
* @property {boolean} [infoBox=true] 信息面板，是否显示点击要素之后显示的信息，是Cesium原生控件
* @property {boolean}[selectionIndicator=true] 选中框，是否显示选择模型时的绿色框，是Cesium原生控件
* @property {boolean}[showRenderLoopErrors=true] 如果为true，则在发生渲染循环错误时，此小部件将自动向包含错误的用户显示HTML面板，是Cesium原生控件
* @property {object}[contextmenu]  内置 右键菜单 控制参数, 对应ContextMenu构造参数
* @property {boolean}[contextmenu.preventDefault=true]  是否取消右键菜单
* @property {boolean}[contextmenu.hasDefault=true]  是否绑定默认的地图右键菜单
* @property {object}[popup]  内置 Popup 控制参数
* @property {boolean}[popup.depthTest=true]  是否打开深度判断（true时判断是否在球背面）
* @property {object}[tooltip]  内置 Tooltip 控制参数
* @property {number}[tooltip.cacheTime=20]  延迟缓存的时间，单位：毫秒
*/ 


/**
* @typedef {Object} effectOptions 添加到地图的特效 参数
* @property {object}[rain] 下雨天气,对应Rain构造参数
* @property {object}[snow] 下雪天气,对应Snow构造参数
* @property {object}[snowCover] 地面积雪,对应SnowCover构造参数
* @property {object}[fog] 大雾天气,对应Fog构造参数
* @property {object}[thunder] 雷电天气,对应Thunder构造参数
* @property {object}[depthOfField] 景深,对应DepthOfField构造参数
* @property {object}[mosaic] 马赛克,对应Mosaic构造参数
* @property {object}[nightVision] 夜视,对应NightVision构造参数
* @property {object}[outline] 对象轮廓描边,对应MosaicEffect构造参数
* @property {object}[bloomTarget] 对象泛光,对应MosaicEffect构造参数
* @property {object}[bloom] 泛光,对应MosaicEffect构造参数
* @property {object}[brightness] 亮度,对应MosaicEffect构造参数
* @property {object}[blackAndWhite] 黑白,对应MosaicEffect构造参数
* @example 7
// 调用
Speed.Map.effectOptions.blackAndWhite
*/

/**
* @typedef {Object} mouseOptions 鼠标参数
* @property {Number} [animation=false] animation - 通视距离，单位:米
*/

/**
* @typedef {Object} terrainOptions 地形服务参数
* @property {String | Number}[id] -地形id标识
* @property {Object}[type] 地形类型[none:无地形，xt：星图地形，mars：火星地形,arcgis:arcgis地形,ION:ION在线地形(cesium官方服务),XYZ:标准xyz瓦片地形]
* @property {String}[name] 地形服务名称
* @property {String}[icon] 地形图标
* @property {String}[tooltip] -地形服务描述
* @property {String | Cesium.Resource} url 地形服务地址
* @property {String}[key] 地形服务token
* @property {Boolean}[show] 是否显示地形
*/

/**
* @typedef {Object} basemapOptions 底图配置参数
* @property {String | Number}[id] 图层id标识
* @property {String | Number}[pid] 图层父级的id
* @property {String}[name] 图层名称
* @property {String}[icon] 图层图标
* @property {String}[type] 图层类型[group:图层组,用于将多个图层组合起来（比如将卫星底图和文字注记层放在一起控制管理）; tdt:天地图在线地图; xt:星图地球在线底图； arcgis:ArcGIS服务; arcgis_tile:ArcGIS瓦片服务（使用XYZ瓦片方式请求读取）; image：单张图片； xyz：标准XYZ金字塔； wms：OGC标准的WMS服务； wmts：OGC标准的WMTS服务]
* @property {String}[tooltip] 图层描述
* @property {String}[layer] 图层类型[vec_d: 电子图层；vec_z: 电子注记；vec_e: 电子注记英文；img_d: 卫星影像；img_z: 影像注记；img_e: 影像注记英文；ter_d: 地形渲染图；ter_z: 地形渲染图注记]
* @property {String}[key] 图层服务Token
* @property {String}[url] 图层服务地址
* @property {Boolean}[show] 图层是否显示
*/

/**
* @typedef {Object} layerOptions 叠加图层配置参数
* @property {Number} [animation=false] animation - 通视距离，单位:米
*/

/**
* @typedef {Object} tokenOptions 所有第3方Token
* @property {Number} [animation=false] animation - 通视距离，单位:米
*/

/**
*初始化地球参数
* @param {Object} options - 地球对象参数
* @param {String | Cesium.Viewer}[options.containID] -地图div容器的id 或 已构造好的Viewer对象
* @param {sceneOptions}[options.scene] 场景参数
*

* @param {Boolean}[options.shadows=false] -是否启用日照阴影
* @param {Cesium.ShadowMode}[options.terrainShadows=Cesium.ShadowMode.RECEIVE_ONLY] -确定地形是否投射或接收来自光源的阴影
* @param {Boolean}[options.skyBox] -天空盒用于渲染星星。当 undefined 时，使用默认的星星。如果设置为 false ，则不会添加天空盒、太阳或月亮。
* @param {Boolean}[options.scene3DOnly=false] -为 true 时，每个几何实例将仅以3D渲染以节省GPU内存。
* @param {String}[options.ionToken] -Cesium秘钥。
* @param {String}[options.scene] -地球相关参数。
* @param {String}[options.scene.depthTestAgainstTerrain=false] -是否启用深度监测,可以开启来测试矢量对象是否在地形下面或被遮挡。
*
*
*/
class Viewer extends Speed {

    constructor(id, options) {
        super(id, options);
        this.init(id, options)
    }



    init (id, options) {

        // init config
        this.parameter = configInit(options);

        // init globle
        this._viewer = new Cesium.Viewer(id, this.parameter);

        return Object.assign({}, this, viewerInit(this._viewer, this.parameter))
    }

    addStausBar () {
        this._statusBar = new statusBar(this._viewer, {
            fps: true,
        })
    }
    showStausBar (value) {
        if (this._statusBar) {
            this._statusBar.showBar(value)
        }
    }
    closeStausBar () {
        if (this._statusBar) {
            this._statusBar.destroy()
        }
    }

    addLayer (layer) {
        if (!this._viewer) return
        if (layer == null) return;
        if (layer instanceof Cesium.Cesium3DTileset) {
            this._viewer.scene.primitives.add(layer);
        } else if (layer instanceof Cesium.ImageryLayer) {
            this._viewer.imageryLayers.add(layer);
        } else if (layer instanceof Cesium.WebMapServiceImageryProvider || layer instanceof Cesium.WebMapTileServiceImageryProvider) {
            this._viewer.imageryLayers.addImageryProvider(layer);
        } else if (layer instanceof Cesium.GeoJsonDataSource || layer instanceof Cesium.KmlDataSource || layer instanceof Cesium.CzmlDataSource) {
            this._viewer.dataSources.add(layer)
        } else if (layer instanceof Cesium.Primitive) {
            this._viewer.scene.primitives.add(layer)
        } else if (layer instanceof Cesium.PrimitiveCollection) {
            this._viewer.scene.primitives.add(layer);
        } else if (layer instanceof Cesium.I3SDataProvider) {
            this._viewer.scene.primitives.add(layer);
        }
    }

    removeLayer (layer) {
        if (!this._viewer) return
        if (!layer) return;
        if (layer instanceof Cesium.Cesium3DTileset) {
            this._viewer.scene.primitives.remove(layer);
        } else if (layer instanceof Cesium.ImageryLayer) {
            this._viewer.imageryLayers.remove(layer, true)
        } else if (layer instanceof Cesium.GeoJsonDataSource) {
            this._viewer.dataSources.remove(layer, true)
        } else if (layer instanceof Cesium.Primitive) {
            this._viewer.scene.primitives.remove(layer)
        } else if (layer instanceof VectorTileImageryProvider) {
            this._viewer.imageryLayers.remove(layer)
        } else if (layer instanceof Cesium.PrimitiveCollection) {
            this._viewer.scene.primitives.remove(layer);
        } else if (layer instanceof Cesium.I3SDataProvider) {

            if (layer.isDestroyed()) {
                this._viewer.scene.primitives.remove(layer);
                layer.destroy()
            }

        }
    }



    flyto (layer) {
        let that = this
        if (layer instanceof Cesium.Cesium3DTileset) {
            // this._viewer.flyTo(tileset);
            layer.readyPromise.then(function (tileset) {
                that._viewer.camera.flyToBoundingSphere(tileset.boundingSphere, {})
            })
        } else if (layer instanceof Cesium.ImageryLayer) {
            layer.getViewableRectangle().then(function (rectangle) {
                that._viewer.camera.flyTo({
                    destination: rectangle
                })
            })
        } else if (layer instanceof Cesium.DataSource || layer instanceof Cesium.GeoJsonDataSource) {
            this._viewer.flyTo(layer);
        } else if (layer.destination instanceof Cesium.Cartesian3) {
            this._viewer.camera.flyTo({
                destination: layer.destination,
                orientation: layer.orientation || {
                    heading: Cesium.Math.toRadians(Cesium.defaultValue(layer.heading, 0)),
                    pitch: Cesium.Math.toRadians(Cesium.defaultValue(layer.pitch, -90)),
                    roll: Cesium.Math.toRadians(Cesium.defaultValue(layer.roll, 0))
                },
                duration: Cesium.defaultValue(layer.duration, 2),
            })
        } else if (layer instanceof Cesium.BoundingSphere) {
            this._viewer.camera.flyToBoundingSphere(layer);
        } else if (layer instanceof Cesium.Entity) {
            this._viewer.flyTo(layer);
        } else if (layer instanceof Cesium.I3SDataProvider) {
            layer.readyPromise.then(() => {
                this._viewer.camera.flyTo({
                    destination: layer.extent
                })
            })
        }

    }

    flytoExtent (rectangle) {
        let _destination = rectangle
        if (rectangle instanceof Cesium.Rectangle) {
            _destination = rectangle
        } else {
            _destination = Cesium.Rectangle.fromDegrees(rectangle.xmin, rectangle.ymin, rectangle.xmax, rectangle.ymax)
        }

        this._viewer.camera.flyTo({
            destination: _destination,
        })
    }

    depthTestAgainstTerrain (depthTestAgainstTerrain) {
        this._viewer.scene.globe.depthTestAgainstTerrain = depthTestAgainstTerrain
    }





}

export default Viewer
