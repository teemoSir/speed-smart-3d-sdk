import * as uuid from "uuid"
import * as Cesium from 'cesium'
import * as token from '../util/token.js'
import terrainLayer from '../layer/terrainLayer.js';
import baseMapLayer from '../layer/baseMapLayer.js';
import xtLayer from "../layer/xtLayer.js";
import xyzLayer from "../layer/XYZLayer.js"
import CesiumZh from '../util/cesiumlocal.js'
import toolBar from '../../widgets/toolbar/toolBar.js'
import navigationControl from '../../widgets/toolbar/navigationControl.js'
import statusBar from '../../widgets/statusBar/statusBar.js'
import MouseZoomStyle from '../../widgets/toolbar/MouseZoomStyle.js';
import { isPCBroswer } from '../util/util.js';

const mapConfig = {
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
    id: uuid.v4(),
    containID: uuid.v4(),
    DEFAULT_VIEW_RECTANGLE: Cesium.Rectangle.fromDegrees(90, -20, 110, 90),//设置相机初始位置为中国上空
    //状态栏
    statusBar: {
        show: false,
        fps: true
    },
    //基础工具
    toolBar: {
        style: { bottom: "5%", left: "25px" }
    },
    zjlayer: xtLayer.xtImageryProvider({
        type: "xt",
        layer: "img_z",
        key: token.xingtu,
    }),
    googleLayer: xyzLayer.xyzImageryProvider({
        url: "http://36.152.66.51:18088/{z}/{x}/{reverseY}.jpg",
        maximumLevel: 20
    })
}

//导航球
const navigation = function (bools) {
    return {
        compass: {
            show: bools || false,
            style: { top: "50px", left: "5px" }
        },
        legend: {
            show: bools || false,
            style: { left: "5px", bottom: "1px" }
        }
    }
}


const configInit = function (options) {
    let opts = mapConfig;
    for (let key in options) {
        opts[key] = options[key];
    }

    opts.navigationControl = navigation(opts.navigationControl);
    Cesium.Ion.defaultAccessToken = opts.ionToken || token.ion;
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = mapConfig.DEFAULT_VIEW_RECTANGLE;



    if (!opts.baseLayerPicker && !opts.loadBaseMap) {
        opts.imageryProvider = false
    } else if (opts.baseLayerPicker && opts.basemaps == undefined) {
        opts.baseLayerPicker = false //如果未配置底图，底图选择器必须设置为不显示，否则会自动加载cesium自带底图
        var layer = xtLayer.xtImageryProvider({
            type: "xt",
            layer: "img_d",
            key: token.xingtu,
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
                mapConfig.zjlayer = imgOBJ.zjlayer
                mapConfig.googleLayer = imgOBJ.googleLayer
            } else {
                var layer = xtLayer.xtImageryProvider({
                    type: "xt",
                    layer: "img_d",
                    key: token.xingtu,
                })
                mapConfig.zjlayer = xtLayer.xtImageryProvider({
                    type: "xt",
                    layer: "img_z",
                    key: token.xingtu,
                })
                mapConfig.googleLayer = xyzLayer.xyzImageryProvider({
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





    return opts
}


const viewerInit = (map, opts) => {

    // 添加注记
    mapConfig.googleLayer && map.imageryLayers.addImageryProvider(mapConfig.googleLayer);
    mapConfig.zjlayer && map.imageryLayers.addImageryProvider(mapConfig.zjlayer);


    // 优化
    optimize(map)
    // 汉化
    CesiumZh.load();

    let _statusBar, _navigationControl, _mouseZoomStyle;
    if (opts.scene) {


        map.scene.globe.depthTestAgainstTerrain = Cesium.defaultValue(opts.scene.depthTestTerrain, false); //是否开启深度监测
        map.scene.screenSpaceCameraController.enableCollisionDetection = Cesium.defaultValue(opts.scene.enableCollisionDetection, false);//启用或禁用相机与地形的碰撞检测。
        //map.scene.debugShowFramesPerSecond = Cesium.defaultValue(opts.scene.FPS, false);//显示每秒帧数和帧之间的时间。

        //是否显示晨昏线，可以看到地球的昼夜区域
        map.scene.globe.enableLighting = Cesium.defaultValue(opts.scene.lighting, false);
        //是否显示地球大气层外光圈
        map.scene.skyAtmosphere.show = Cesium.defaultValue(opts.scene.showSkyAtmosphere, true);
        //是否在地球上绘制的地面大气
        map.scene.globe.showGroundAtmosphere = Cesium.defaultValue(opts.scene.showAtmosphere, true);

        //限制缩放级别
        map.scene.screenSpaceCameraController.maximumZoomDistance = Cesium.defaultValue(
            opts.scene.maxzoom,
            20000000
        ); //变焦时相机位置的最大值（以米为单位）
        map.scene.screenSpaceCameraController.minimumZoomDistance = Cesium.defaultValue(
            opts.scene.minzoom,
            1
        ); //变焦时相机位置的最小量级（以米为单位）。默认为1.0。

        map.scene.screenSpaceCameraController._zoomFactor = 3; //鼠标滚轮放大的步长参数
        map.scene.screenSpaceCameraController.minimumCollisionTerrainHeight = 15000000; //低于此高度时绕鼠标键绕圈，大于时绕视图中心点绕圈。



        //状态栏控件
        if (opts.statusBar || opts.statusBar.show) {
            _statusBar = new statusBar(map, {
                fps: Cesium.defaultValue(opts.statusBar.fps, true),
            })
        }
        //导航球、比例尺
        if (opts.navigationControl == true || (opts.navigationControl.compass && opts.navigationControl.compass.show)
            || (opts.navigationControl.legend && opts.navigationControl.legend.show)) {
            _navigationControl = new navigationControl(map, opts.navigationControl)
        }

        //鼠标滚轮缩放美化样式
        if (opts.mouseZoom && isPCBroswer()) {
            _mouseZoomStyle = new MouseZoomStyle(map, opts.mouseZoom);
        }

        //定位至指定位置
        if (opts.center) {
            map.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(opts.center.lng, opts.center.lat, opts.center.alt),
                orientation: {
                    heading: Cesium.Math.toRadians(Cesium.defaultValue(opts.center.heading, 0)), //绕垂直于地心的轴旋转
                    pitch: Cesium.Math.toRadians(Cesium.defaultValue(opts.center.pitch, -90)), //绕纬度线旋转
                    roll: Cesium.Math.toRadians(Cesium.defaultValue(opts.center.roll, 0)) //绕经度线旋转
                },
            });

        }
    }
    return {
        _statusBar,
        _navigationControl,
        _mouseZoomStyle
    }

}
const optimize = function (viewer) {
    if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {//判断是否支持图像渲染像素化处理
        viewer.resolutionScale = window.devicePixelRatio;
    }

    // 改善实体的文字和图片清晰度
    viewer.scene.fxaa = true;
    viewer.scene.postProcessStages.fxaa.enabled = true;

    // 降低性能提供图片质量
    viewer.scene.globe.maximumScreenSpaceError = 4 / 3;

    // 改变地图灰度系数
    viewer.scene.imageryLayers.get(0) && (viewer.scene.imageryLayers.get(0).gamma = 0.66);

    viewer.cesiumWidget.creditContainer && (viewer.cesiumWidget.creditContainer.style.display = "none")// 去除logo

}





export {
    configInit,
    viewerInit
}