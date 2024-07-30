import { terrainUrl } from "../../utils/config";
/**
 * 地球
 */
class Viewer {
  /**
   *初始化地球参数
   * @param {Element | String} container - 页面元素
   * @param {Object} options - 地球对象参数
   * @param {Boolean}[options.showRenderLoopErrors=true] - 如果为 true，如果出现渲染循环错误，此小部件将自动向用户显示包含错误的 HTML 面板
   * @param {Boolean}[options.baseLayerPicker=false]  - 是否显示底图切换按钮
   * @param {Boolean}[options.homeButton=true] -是否显示视角复位按钮
   * @param {Boolean}[options.fullscreenButton=true] -是否显示全屏按钮
   * @param {Boolean}[options.sceneModePicker=true] -是否显示二三维切换按钮
   * @param {Boolean}[options.navigationHelpButton=false] -是否显示帮助按钮
   * @param {Boolean}[options.geocoder=false] -是否显示地名查找按钮
   * @param {Boolean}[options.timeline=false] -是否显示下侧时间线控件面板
   * @param {Boolean}[options.animation=false] -是否显示时钟仪表控制面板
   * @param {String}[options.terrainUrl] -设置当前的地形服务
   *
  */
  initViewer(container, options) {

    return new Cesium.Viewer(container, {
      showRenderLoopErrors: options.showRenderLoopErrors == undefined ? true : options.showRenderLoopErrors,
      baseLayerPicker: options.baseLayerPicker == undefined ? false : options.baseLayerPicker, // 图层选择器（地形影像服务）
      homeButton: options.homeButton == undefined ? true : options.homeButton, // 视角返回初始位置
      fullscreenButton: options.fullscreenButton == undefined ? true : options.fullscreenButton, // 全屏
      sceneModePicker: options.sceneModePicker == undefined ? true : options.sceneModePicker, // 选择视角的模式（球体、平铺、斜视平铺）
      navigationHelpButton: options.navigationHelpButton == undefined ? false : options.navigationHelpButton, //导航帮助按钮
      geocoder: options.geocoder == undefined ? false : options.geocoder, // 位置查找工具
      timeline: options.timeline == undefined ? false : options.timeline, // 底部时间线
      animation: options.animation == undefined ? false : options.animation, // 左下角仪表盘（动画器件）
      //加载地形
      terrainProvider: new Cesium.CesiumTerrainProvider({
        url: options.terrainUrl == undefined ? terrainUrl : options.terrainUrl
      }),
    });
  }

  /**
   * 地球场景参数设置
   * @param {Object} map -三维地图对象
   * @param {Object} options -地球场景参数
   * @param {Boolean}[options.depthTestAgainstTerrain=false] -是否启用深度监测,可以开启来测试矢量对象是否在地形下面或被遮挡。
   * @param {Boolean}[options.enableCollisionDetection=false] -是否允许地形相机的碰撞检测；禁止/允许相机进入地下。
   * @param {Boolean}[options.FPS=true] -是否显示每秒帧数和帧之间的时间。
   * @param {Boolean}[options.showTerrain=true] -是否启用显示地形
   * @param {Boolean}[options.showGroundAtmosphere=false] -是否在地球上绘制的地面大气
   * @param {Boolean}[options.skyAtmosphere=false] -是否显示地球大气层外光圈光照
   *
   *
   */
  setScene(map, options) {
    map.scene.globe.depthTestAgainstTerrain = options.depthTestAgainstTerrain == undefined ? false : options.depthTestAgainstTerrain
    map.scene.screenSpaceCameraController.enableCollisionDetection = options.enableCollisionDetection == undefined ? false : options.enableCollisionDetection
    map.scene.debugShowFramesPerSecond = options.FPS == undefined ? true : options.FPS;
    if (!options.showTerrain) {
      map.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    } else {
      map.scene.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: terrainUrl
      })
    }
    map.scene.globe.showGroundAtmosphere = options.showGroundAtmosphere == undefined ? false : options.showGroundAtmosphere;
    map.scene.skyAtmosphere.show = options.skyAtmosphere == undefined ? false : options.skyAtmosphere;
  }

}

export default Viewer;
