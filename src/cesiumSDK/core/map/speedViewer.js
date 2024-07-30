import * as Cesium from 'cesium'
import Speed from '../speed.js'
import * as token from '../util/token'
import CesiumZh from '../util/cesiumlocal'
import * as uuid from "uuid"
import { isPCBroswer } from '../util/util';

import terrainLayer from '../layer/terrainLayer.js';
import baseMapLayer from '../layer/baseMapLayer.js';
import xtLayer from "../layer/xtLayer";
import xyzLayer from "../layer/XYZLayer"
import VectorTileImageryProvider from 'cesiumvectortile';
import toolBar from '../../widgets/toolbar/toolBar'
import navigationControl from '../../widgets/toolbar/navigationControl'
import statusBar from '../../widgets/statusBar/statusBar'
import MouseZoomStyle from '../../widgets/toolbar/MouseZoomStyle';

/**
 * 三维地球
 */
class SpeedViewer extends Speed {

    constructor(options) {
        super(options);
    }

    /**
     * 地球对象
     * @member {Cesium.Viewer}
     */
    _viewer;

    /**地球配置参数 */
    parameter;

    /**
    *初始化地球参数
    * @param {Object} options - 地球对象参数
    * @param {String | Cesium.Viewer}[options.containID] -地图div容器的id 或 已构造好的Viewer对象
    * @param {Object}[options.center] -默认相机视角.[lng:经度值, 180 - 180,lat:纬度值, -90 - 90; alt:高度值; heading:方向角度值，绕垂直于地心的轴旋转角度, 0至360; pitch:俯仰角度值，绕纬度线旋转角度,-90至90; roll:翻滚角度值，绕经度线旋转角度, -90至90]
    *
    * @param {Array<Object>|Object}[options.terrains] -地形服务配置
    * @param {String | Number}[options.terrains.id] -地形id标识
    * @param {Object}[options.terrains.type] -地形类型[none:无地形，xt：星图地形，mars：火星地形,arcgis:arcgis地形,ION:ION在线地形(cesium官方服务),XYZ:标准xyz瓦片地形]
    * @param {String}[options.terrains.name] -地形服务名称
    * @param {String}[options.terrains.icon] -地形图标
    * @param {String}[options.terrains.tooltip] -地形服务描述
    * @param {String | Cesium.Resource}[options.terrains.url] -地形服务地址
    * @param {String}[options.terrains.key] -地形服务token
    * @param {String}[options.terrains.url] -地形服务地址
    * @param {Boolean}[options.terrains.show] -是否显示地形
    *
    * @param {Array<Object>|Object}[options.basemaps] -底图图层配置
    * @param {String | Number}[options.basemaps.id] -图层id标识
    * @param {String | Number}[options.basemaps.pid] -图层父级的id
    * @param {String}[options.basemaps.name] -图层名称
    * @param {String}[options.basemaps.icon] -图层图标
    * @param {String}[options.basemaps.type] -图层类型[group:图层组,用于将多个图层组合起来（比如将卫星底图和文字注记层放在一起控制管理）; tdt:天地图在线地图; xt:星图地球在线底图； arcgis:ArcGIS服务; arcgis_tile:ArcGIS瓦片服务（使用XYZ瓦片方式请求读取）; image：单张图片； xyz：标准XYZ金字塔； wms：OGC标准的WMS服务； wmts：OGC标准的WMTS服务]
    * @param {String}[options.basemaps.tooltip] -图层描述
    * @param {String}[options.basemaps.layer] -图层类型[vec_d: 电子图层；vec_z: 电子注记；vec_e: 电子注记英文；img_d: 卫星影像；img_z: 影像注记；img_e: 影像注记英文；ter_d: 地形渲染图；ter_z: 地形渲染图注记]
    * @param {String}[options.basemaps.key] -图层服务Token
    * @param {String}[options.basemaps.url] -图层服务地址
    * @param {Boolean}[options.basemaps.show] -图层是否显示
    *
    * @param {Boolean}[options.baseLayerPicker=false]  - 是否显示底图切换按钮(cesium原生)
    * @param {Boolean}[options.homeButton=true] -是否显示视角复位按钮(cesium原生)
    * @param {Boolean}[options.fullscreenButton=false] -是否显示全屏按钮(cesium原生)
    * @param {Boolean}[options.sceneModePicker=false] -是否显示二三维切换按钮(cesium原生)
    * @param {Boolean}[options.navigationHelpButton=false] -是否显示帮助按钮(cesium原生)
    * @param {Boolean}[options.showRenderLoopErrors=true] - 如果为true，则在发生渲染循环错误时，此小部件将自动向包含错误的用户显示HTML面板(cesium原生)
    * @param {Boolean}[options.navigationInstructionsInitiallyVisible=false] -帮助按钮 在用户明确单击按钮之前是否自动显示(cesium原生)
    * @param {Boolean}[options.infoBox=false] -是否显示点击要素之后显示的信息面板(cesium原生)
    * @param {Boolean}[options.shouldAnimate=false] -是否开启时钟动画(cesium原生)
    * @param {Boolean}[options.geocoder=false] -是否显示地名查找按钮(cesium原生)
    * @param {Boolean}[options.timeline=false] -是否显示时间线控件面板(cesium原生)
    * @param {Boolean}[options.animation=false] -是否显示时钟仪表控制面板(cesium原生)
    * @param {Boolean}[options.selectionIndicator=false] -是否显示选择模型时的绿色框(cesium原生)
    * @param {Boolean}[options.vrButton=false] -是否显示右下角vr虚拟现实按钮(cesium原生)
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
    init (options) {
        var opts = {
            animation: false, //是否创建动画小器件，左下角仪表
            timeline: false, //是否显示时间线控件
            vrButton: false, //右下角vr虚拟现实按钮
            geocoder: false, //是否显示地名查找控件
            navigationInstructionsInitiallyVisible: false, //帮助按钮 在用户明确单击按钮之前是否自动显示
            infoBox: false, //是否显示点击要素之后显示的信息
            selectionIndicator: false, //选择模型是是否显示绿色框,
            shouldAnimate: true,//是否开启时钟动画
            showRenderLoopErrors: true, //是否显示错误弹窗信息
            shadows: false, //确定阴影是否由光源投射
            terrainShadows: Cesium.ShadowMode.RECEIVE_ONLY, //确定地形是否从光源投射或阴影

            loadBaseMap: true,//baseLayerPicker为false时，默认加载底图
            baseLayerPicker: false, //Cesium原生控件 底图切换 按钮
            homeButton: false, //回到默认视域按钮
            navigationHelpButton: false, //是否显示帮助信息控件
            sceneModePicker: false, //是否显示投影方式控件
            fullscreenButton: false, //全屏按钮

            mouseZoom: true,//鼠标旋转、缩放样式
            statusBar: {
                show: false,
                fps: true
            },//状态栏
            navigationControl: {
                compass: {
                    show: false,
                    style: { top: "50px", left: "5px" }
                },
                legend: {
                    show: false,
                    style: { left: "5px", bottom: "1px" }
                }
            },//导航球
            toolBar: {
                style: { bottom: "5%", left: "25px" }
            },//基础工具
        };
        for (let key in options) {
            opts[key] = options[key];
        }

        if (opts.navigationControl == true) {
            opts.navigationControl = {
                compass: {
                    show: true,
                    style: { top: "50px", left: "5px" }
                },
                legend: {
                    show: true,
                    style: { left: "5px", bottom: "1px" }
                }
            }
        }
        opts.id = opts.id == undefined ? uuid.v4() : opts.id;
        Cesium.Ion.defaultAccessToken = opts.ionToken || token.ion;
        //底图(cesium原生底图选择器)
        var zjlayer;
        var googleLayer;
        if (!opts.baseLayerPicker && !opts.loadBaseMap) {
            opts.imageryProvider = false //不加载底图
        }
        else if (opts.baseLayerPicker && opts.basemaps == undefined) {
            opts.baseLayerPicker = false //如果未配置底图，底图选择器必须设置为不显示，否则会自动加载cesium自带底图
            var layer = xtLayer.xtImageryProvider({
                type: "xt",
                layer: "img_d",
                key: token.xingtu,
            })
            zjlayer = xtLayer.xtImageryProvider({
                type: "xt",
                layer: "img_z",
                key: token.xingtu,
            })
            googleLayer = xyzLayer.xyzImageryProvider({
                url: "http://36.152.66.51:18088/{z}/{x}/{reverseY}.jpg",
                maximumLevel: 20
            })
            opts.imageryProvider = layer
            // 地形
            if (opts.terrains) {
                var layeropts
                if (opts.terrains instanceof Array && opts.terrains.length > 0) {
                    layeropts = opts.terrains[0]
                } else {
                    layeropts = opts.terrains
                }
                var terrainProvider = terrainLayer.getTerrainProvider(layeropts);
                opts.terrainProvider = terrainProvider;
            } else {
                opts.terrainProvider = new Cesium.EllipsoidTerrainProvider({
                    ellipsoid: Cesium.Ellipsoid.WGS84
                });
            }
        } else {
            if (opts.baseLayerPicker) {
                //有baseLayerPicker插件时
                if (!opts.imageryProviderViewModels && opts.basemaps && opts.basemaps instanceof Array) {
                    var imgOBJ = baseMapLayer.getImageryProviderModels(opts.basemaps);
                    opts.imageryProviderViewModels = imgOBJ.providerViewModels
                    opts.selectedImageryProviderViewModel = imgOBJ.providerViewModels[imgOBJ.index];

                }
                if (!opts.terrainProviderViewModels && opts.terrains && opts.terrains instanceof Array) {
                    var terOBJ = terrainLayer.getTerrainProviderViewModelsArr(opts.terrains);
                    opts.terrainProviderViewModels = terOBJ.terrainModels;
                    opts.selectedTerrainProviderViewModel = opts.terrainProviderViewModels[terOBJ.index];
                }
            } else {
                //底图
                if (opts.basemaps) {
                    var layeropts
                    if (opts.basemaps instanceof Array && opts.basemaps.length > 0) {
                        layeropts = opts.basemaps[0]
                    } else {
                        layeropts = opts.basemaps
                    }

                    var imgOBJ = baseMapLayer.getImageryProviderNew(layeropts);
                    opts.imageryProvider = imgOBJ.layer
                    zjlayer = imgOBJ.zjlayer
                    googleLayer = imgOBJ.googleLayer
                } else {
                    var layer = xtLayer.xtImageryProvider({
                        type: "xt",
                        layer: "img_d",
                        key: token.xingtu,
                    })
                    zjlayer = xtLayer.xtImageryProvider({
                        type: "xt",
                        layer: "img_z",
                        key: token.xingtu,
                    })
                    googleLayer = xyzLayer.xyzImageryProvider({
                        url: "http://36.152.66.51:18088/{z}/{x}/{reverseY}.jpg",
                        maximumLevel: 20
                    })
                    opts.imageryProvider = layer
                }

                // 地形
                if (opts.terrains) {
                    var layeropts
                    if (opts.terrains instanceof Array && opts.terrains.length > 0) {
                        layeropts = opts.terrains[0]
                    } else {
                        layeropts = opts.terrains
                    }
                    var terrainProvider = terrainLayer.getTerrainProvider(layeropts);
                    opts.terrainProvider = terrainProvider;
                } else {
                    opts.terrainProvider = new Cesium.EllipsoidTerrainProvider({
                        ellipsoid: Cesium.Ellipsoid.WGS84
                    });
                }
            }
        }

        //创建地球
        let speedViewer = new Cesium.Viewer(options.containID, opts);
        // const handler = new Cesium.ScreenSpaceEventHandler(speedViewer.scene.canvas);
        // handler.setInputAction(function (movement) {
        // 	const pickedObject = speedViewer.scene.pick(movement.endPosition);
        // 	if (Cesium.defined(pickedObject)) {
        // 		speedViewer._container.style.cursor = "pointer";
        // 	} else {
        // 		speedViewer._container.style.cursor = "default";
        // 	}
        // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        // 添加注记
        if (googleLayer)
            speedViewer.imageryLayers.addImageryProvider(googleLayer);
        if (zjlayer)
            speedViewer.imageryLayers.addImageryProvider(zjlayer);

        speedViewer.cesiumWidget.creditContainer.style.display = "none";// 去除logo
        CesiumZh.load(); //汉化
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(90, -20, 110, 90);//设置相机初始位置为中国上空
        // 抗锯齿
        speedViewer.scene.fxaa = false;
        speedViewer.scene.postProcessStages.fxaa.enabled = false;
        if (opts.scene) {
            speedViewer.scene.globe.depthTestAgainstTerrain = Cesium.defaultValue(opts.scene.depthTestTerrain, false); //是否开启深度监测
            speedViewer.scene.screenSpaceCameraController.enableCollisionDetection = Cesium.defaultValue(opts.scene.enableCollisionDetection, false);//启用或禁用相机与地形的碰撞检测。
            //speedViewer.scene.debugShowFramesPerSecond = Cesium.defaultValue(opts.scene.FPS, false);//显示每秒帧数和帧之间的时间。

            //是否显示晨昏线，可以看到地球的昼夜区域
            speedViewer.scene.globe.enableLighting = Cesium.defaultValue(opts.scene.lighting, false);
            //是否显示地球大气层外光圈
            speedViewer.scene.skyAtmosphere.show = Cesium.defaultValue(opts.scene.showSkyAtmosphere, true);
            //是否在地球上绘制的地面大气
            speedViewer.scene.globe.showGroundAtmosphere = Cesium.defaultValue(opts.scene.showAtmosphere, true);

            //限制缩放级别
            speedViewer.scene.screenSpaceCameraController.maximumZoomDistance = Cesium.defaultValue(
                opts.scene.maxzoom,
                20000000
            ); //变焦时相机位置的最大值（以米为单位）
            speedViewer.scene.screenSpaceCameraController.minimumZoomDistance = Cesium.defaultValue(
                opts.scene.minzoom,
                1
            ); //变焦时相机位置的最小量级（以米为单位）。默认为1.0。

            speedViewer.scene.screenSpaceCameraController._zoomFactor = 3; //鼠标滚轮放大的步长参数
            speedViewer.scene.screenSpaceCameraController.minimumCollisionTerrainHeight = 15000000; //低于此高度时绕鼠标键绕圈，大于时绕视图中心点绕圈。
        }
        //工具按钮
        this._toolBar = toolBar.loadToolBar(speedViewer, opts)


        //状态栏控件
        if (opts.statusBar == true || opts.statusBar.show) {
            this._statusBar = new statusBar(speedViewer, {
                fps: Cesium.defaultValue(opts.statusBar.fps, true),
            })
        }
        //导航球、比例尺
        if (opts.navigationControl == true || (opts.navigationControl.compass && opts.navigationControl.compass.show)
            || (opts.navigationControl.legend && opts.navigationControl.legend.show)) {
            this._navigationControl = new navigationControl(speedViewer, opts.navigationControl)
        }

        //鼠标滚轮缩放美化样式
        if (opts.mouseZoom && isPCBroswer()) {
            this._mouseZoomStyle = new MouseZoomStyle(speedViewer, opts.mouseZoom);
        }

        //定位至指定位置
        if (opts.center) {
            // var optsClone = {};
            // optsClone.destination = Cesium.Cartesian3.fromDegrees(opts.center.lng, opts.center.lat, opts.center.alt); //经度、纬度、高度
            // optsClone.orientation = {
            // 	heading: Cesium.Math.toRadians(Cesium.defaultValue(opts.center.heading, 0)), //绕垂直于地心的轴旋转
            // 	pitch: Cesium.Math.toRadians(Cesium.defaultValue(opts.center.pitch, -90)), //绕纬度线旋转
            // 	roll: Cesium.Math.toRadians(Cesium.defaultValue(opts.center.roll, 0)) //绕经度线旋转
            // };
            // optsClone.duration = Cesium.defaultValue(opts.center.duration, 2)
            // speedViewer.camera.flyTo(optsClone);

            speedViewer.camera.setView({
                // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
                // fromDegrees()方法，将经纬度和高程转换为世界坐标
                destination: Cesium.Cartesian3.fromDegrees(opts.center.lng, opts.center.lat, opts.center.alt),
                orientation: {
                    heading: Cesium.Math.toRadians(Cesium.defaultValue(opts.center.heading, 0)), //绕垂直于地心的轴旋转
                    pitch: Cesium.Math.toRadians(Cesium.defaultValue(opts.center.pitch, -90)), //绕纬度线旋转
                    roll: Cesium.Math.toRadians(Cesium.defaultValue(opts.center.roll, 0)) //绕经度线旋转
                },
            });

        }
        this._viewer = speedViewer;
        this.parameter = opts;

        // 清晰度优化
        this.optimize()



        return this
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
           
            if(layer.isDestroyed()){
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
            // let rectangle = layer.rectangle
            // if (Cesium.defined(rectangle)) {
            // 	this._viewer.camera.flyTo({
            // 		destination: rectangle,
            // 		// duration: duration
            // 	});
            // }
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
            layer.readyPromise.then( ()=> {
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

    optimize () {
        if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {//判断是否支持图像渲染像素化处理
            this._viewer.resolutionScale = window.devicePixelRatio;
        }
        // 改善实体的文字和图片清晰度
        this._viewer.scene.fxaa = true;
        this._viewer.scene.postProcessStages.fxaa.enabled = true;
        // 降低性能提供图片质量
        this._viewer.scene.globe.maximumScreenSpaceError = 4 / 3;

        // 改变地图灰度系数
        let layer0 = this._viewer.scene.imageryLayers.get(0);
        if (layer0)
            layer0.gamma = 0.66;
    }

	get viewer() {
		if (this._viewer) {
			return this._viewer;
		}
		return undefined;
	}

	get entities() {
		if (this._viewer) {
			return this._viewer.entities;
		}
		return undefined;
	}

	get scene() {
		if (this._viewer) {
			return this._viewer.scene;
		}
		return undefined;
	}

	get camera() {
		if (this._viewer) {
			return this._viewer.camera;
		}
		return undefined;
	}

	get clock() {
		if (this._viewer) {
			return this._viewer.clock;
		}
		return undefined;
	}

	get cesiumWidget() {
		if (this._viewer) {
			return this._viewer.cesiumWidget;
		}
		return undefined;
	}

	get canvas() {
		if (this._viewer) {
			return this._viewer.scene.canvas;
		}
		return undefined;
	}
}

export default SpeedViewer
