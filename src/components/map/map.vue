<template>
  <div id="map" v-contextmenu:contextmenu>
    <v-contextmenu class="vcontextmenu" ref="contextmenu">
      <v-contextmenu-item v-for="(obj,index) in menuData" :key="index" v-show="obj.show" @click="menuFn(obj.type)">
        {{obj.text}}
      </v-contextmenu-item>
    </v-contextmenu>
    <div class="toolBox" :isshow="isToolBoxShow">
      <ul class="drawToolTar">
        <li @click="measure.drawTriangle()">三角测量</li>
        <li @click="measure.drawLine()">距离测量</li>
        <li @click="measure.drawArea()">面积测量</li>
        <li @click="measure.remove()">清除</li>
        <li @click="tongshi2">通视分析</li>
        <li @click="clearTongshi2">移除通视分析</li>
        <li @click="tongshi">可视域分析</li>
        <li @click="clearTongshi">清除可视域分析</li>
        <li @click="cutAndFill">填挖方分析(地形)</li>
        <li @click="cutAndFillModel">填挖方分析(模型)</li>
        <li @click="slope">坡度分析</li>
        <li @click="removeSlope">移除坡度分析</li>
      </ul>
      <div style="clear: both;"></div>
    </div>
    <div class="infoToolbar">

      <ul class="infoFields">
        <li>经度:{{ currentViewInfo.lng.toFixed(6) }}</li>
        <li>纬度:{{ currentViewInfo.lat.toFixed(6) }}</li>
        <li>海拔:{{ currentViewInfo.alt }}米</li>
        <li>层级:{{ currentViewInfo.level }}</li>
        <li>方向:{{ currentViewInfo.heading }}°</li>
        <li>俯仰角:{{ currentViewInfo.pitch }}°</li>
        <li>视高:{{ currentViewInfo.viewHeight }}米</li>
        <li>要素：{{ featuresLength }}</li>
        <li>三角面：{{ trianglesLength }}</li>
        <li>纹理内存:{{ texturesByteLength }}</li>
        <li>几何内存:{{ geometryByteLength }}</li>
      </ul>
    </div>

    <div id="menuBar">
      <a-menu mode="horizontal" subMenuCloseDelay="0.2">
        <a-sub-menu key="layer" @click="showMenuToggle()">
          <template #title>图层</template>
        </a-sub-menu>
        <a-sub-menu key="tools" @click="showToolBox()">
          <template #title>工具</template>
        </a-sub-menu>
      </a-menu>
    </div>
    <div class="cutAndFillWin" :showstatus="cutAndFillOption.show">
      <span class="ct_closeBtn" @click="closeCutAndFillWin">X</span>
      <div class="ct_content">
        <button class="ct_drawBtn" @click="drawCutAndFill" :isactive="cutAndFillOption.btnactive">绘制区域</button>
        <ul class="ct_form">
          <li fullrow="true">填、挖方高度:<input @keyup="replaceNaN" type="text"
              v-model="cutAndFillOption.cutOrFillHeight" />m
          </li>
          <li><label>最高点:</label>{{ isNaN(cutAndFillOption.top) ? '' : cutAndFillOption.top.toFixed(2) + 'm' }}</li>
          <li><label>最低点:</label>{{ isNaN(cutAndFillOption.bottom) ? '' : cutAndFillOption.bottom.toFixed(2) + 'm' }}
          </li>
          <li><label>整体面积:</label>{{
          isNaN(cutAndFillOption.allArea) ? '' : cutAndFillOption.allArea.toFixed(2) + '㎡'
          }}
          </li>
          <li><label>单网格面积:</label>{{
          isNaN(cutAndFillOption.singleArea) ? '' : cutAndFillOption.singleArea.toFixed(2) + '㎡'
          }}
          </li>
          <li><label>挖方:</label>{{ isNaN(cutAndFillOption.cut) ? '' : cutAndFillOption.cut.toFixed(2) + 'm³' }}</li>
          <li><label>填方:</label>{{ isNaN(cutAndFillOption.fill) ? '' : cutAndFillOption.fill.toFixed(2) + 'm³' }}</li>

        </ul>
        <div style="clear:both"></div>
        <div class="ct_btnGroup">
          <button class="ct_clearBtn" @click="clearCutAndFill">清除</button>
          <button class="ct_calcBtn" @click="calcCutAndFill">计算</button>
        </div>
      </div>
    </div>
    <div class="cutAndFillWinModel" :showstatus="cutAndFillModelOption.show">
      <span class="ct_closeBtn" @click="closeCutAndFillModelWin">X</span>
      <div class="ct_content">
        <button class="ct_drawBtn" @click="drawBoundary">绘制区域</button>
        <ul class="ct_form">
          <li fullrow="true">填、挖方高度:<input @keyup="replaceNaN" type="text"
              v-model="cutAndFillModelOption.cutOrFillHeight" />m
          </li>
          <!--          <li><label>最高点:</label>{{-->
          <!--              isNaN(cutAndFillModelOption.top) ? '' : cutAndFillModelOption.top.toFixed(2) + 'm'-->
          <!--            }}-->
          <!--          </li>-->
          <!--          <li><label>最低点:</label>{{-->
          <!--              isNaN(cutAndFillModelOption.bottom) ? '' : cutAndFillModelOption.bottom.toFixed(2) + 'm'-->
          <!--            }}-->
          <!--          </li>-->

          <!--          <li><label>单网格面积:</label>{{-->
          <!--              isNaN(cutAndFillModelOption.singleArea) ? '' : cutAndFillModelOption.singleArea.toFixed(2) + '㎡'-->
          <!--            }}-->
          <!--          </li>-->
          <li><label>挖方体积:</label>{{
          isNaN(cutAndFillModelOption.cut) ? '' : cutAndFillModelOption.cut.toFixed(2) + 'm³'
          }}
          </li>
          <li><label>填方体积:</label>{{
          isNaN(cutAndFillModelOption.fill) ? '' : cutAndFillModelOption.fill.toFixed(2) + 'm³'
          }}
          </li>
          <li><label>挖方面积:</label>{{
          isNaN(cutAndFillModelOption.top) ? '' : cutAndFillModelOption.top.toFixed(2) + '㎡'
          }}
          </li>
          <li><label>填方面积:</label>{{
          isNaN(cutAndFillModelOption.bottom) ? '' : cutAndFillModelOption.bottom.toFixed(2) + '㎡'
          }}
          </li>
          <li fullrow="true"><label>整体面积:</label>{{
          isNaN(cutAndFillModelOption.allArea) ? '' : cutAndFillModelOption.allArea.toFixed(2) + '㎡'
          }}
          </li>
        </ul>
        <div style="clear:both"></div>
        <div class="ct_btnGroup">
          <button class="ct_clearBtn" @click="clearCutAndFillModel">清除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//正确
// import * as Widgets from 'cesium/Build/Cesium/Widgets/widgets.css' //正确
import eventBus from "../../utils/eventBus";

export let layers = [];

import * as mapLayer from "./layer";
import * as cesiumMeasure from "./cesium-measure";

import * as baseMap from "./map";
import Entitys from './entitys.js';
import entityFactory from './entityFactory.js';
import mouseManager from './mouseManager.js';
import Handler from './handler.js';
import Measure from './measure.js';
import Slope from './slope.js';
import Visibility from './visibility';
import CreatePolygon from "./CreatePolygon";
import CutFillAnalysis from "./CutFillAnalysis";
import { Modal } from 'ant-design-vue';
import { h } from 'vue';
import Menu from 'ant-design-vue/lib/menu'
export let map;
export let tiles3dLayer;
export let handler;
export let baseLayer = 1;
export let yxzjLayer = 1;
let token = "5352fb002f63b438c39fc6be824b5cbf93459ce74b00da0ed90609f2f6e9033e"

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);

  if (index > -1) {
    this.splice(index, 1);
  }
};

import Viewer from './viewer'
export default {
  name: "mapComponent",

  props: {
    center: {
      type: Map,
      default: {
        lat: 31.932687,
        lng: 118.67659,
        alt: 9201,
        heading: 4,
        pitch: -45,
      },
    },
    checkNode: undefined
  },
  watch: {
    checkNode: {
      handler() {

        if (this.checkNode.node.child != undefined && this.checkNode.node.child.length > 0) {
          const data = this.checkNode.node.dataRef.child
          data.forEach((item, index) => {
            if (item.modelType === 999) {
              if (item.name === "影像地图") {
                this.baseLayer.show = this.checkNode.checked
              }
              if (item.name === "影像注记") {
                this.yxzjLayer.show = this.checkNode.checked
              }
            }
          })
        } else if (this.checkNode.node.modelType === 999) {
          if (this.checkNode.node.name === "影像地图") {
            this.baseLayer.show = this.checkNode.checked
          }
          if (this.checkNode.node.name === "影像注记") {
            this.yxzjLayer.show = this.checkNode.checked
          }
        }

      },
      deep: true
    }
  },
  components: {
	  Menu
  },
  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZGJkNjZiZC0yZGUwLTQwZWItOGQyZi0wZjhjNTk4ZGM1YmEiLCJpZCI6NjMzMzcsImlhdCI6MTY2NDI2MTgyMX0.cir5_s5hs_chd0j5f1GEwI4_9OXABcIiSYwpdQZ1DYI";
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
      90,
      -20,
      110,
      90
    ); //西南东北，默认显示中国
debugger
    this.viewer = new Viewer();
	this.map =this.viewer.initViewer("map",{
      showRenderLoopErrors: true,
      baseLayerPicker: false, // 图层选择器
      homeButton: true, // 视角返回初始位置
      fullscreenButton: true, // 全屏
      sceneModePicker: true, // 选择视角的模式（球体、平铺、斜视平铺）
      navigationHelpButton: false, //导航帮助按钮
      terrainUrl:'https://tiles1.geovisearth.com/base/v1/terrain?token=' + token,//地形,
    });
	this.viewer.setScene(this.map,{
      depthTestAgainstTerrain:false,
      enableCollisionDetection:false,
      FPS:true,
      showTerrain:true
    })

    // this.map = new Cesium.Viewer("map", {
    //   showRenderLoopErrors: true,
    //   geocoder: false, // 位置查找工具
    //   baseLayerPicker: false, // 图层选择器（地形影像服务）
    //   timeline: false, // 底部时间线
    //   homeButton: true, // 视角返回初始位置
    //   fullscreenButton: true, // 全屏
    //   animation: false, // 左下角仪表盘（动画器件）
    //   sceneModePicker: true, // 选择视角的模式（球体、平铺、斜视平铺）
    //   navigationHelpButton: false, //导航帮助按钮
    //   //地形
    //   terrainProvider: new Cesium.CesiumTerrainProvider({
    //     url: 'https://tiles1.geovisearth.com/base/v1/terrain?token=' + token
    //   }),
    // });
debugger
    let instance = daas.useCesium(this.map);
    this.baselayer = instance.addLayer({
      name: '影像',
      index: 0,
      subdomains: '123',
      baseUrl: "https://tiles{s}.geovisearth.com/base/v1/img/{z}/{x}/{y}",
      tmsIds: "w",
      format: 'webp',
      token: token,
      minimumLevel: 0,
      maximumLevel: 18,
    });
    this.yxzjLayer = instance.addLayer({
      name: '影像注记',
      index: 1,
      subdomains: '123',
      baseUrl: "https://tiles{s}.geovisearth.com/base/v1/cia/{z}/{x}/{y}",
      tmsIds: "w",
      format: 'webp',
      token: token,
      minimumLevel: 0,
      maximumLevel: 18
    });
    this.baselayer.show = true
    this.yxzjLayer.show = true

    var iframe = document.getElementsByClassName("cesium-infoBox-iframe")[0];
    iframe.setAttribute(
      "sandbox",
      "allow-same-origin allow-scripts allow-popups allow-forms"
    );
    iframe.setAttribute("src", "");


    if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
      this.map.resolutionScale = window.devicePixelRatio;
    }

    //允许碰撞，禁地下
    let mapV = this.map;
    this.map.scene.screenSpaceCameraController.minimumZoomDistance = 100;
    this.map.clock.onTick.addEventListener(function () {
      if (mapV.camera.pitch > 0) {
        mapV.scene.screenSpaceCameraController.enableTilt = false;
      }
    });
    var mousePosition, startMousePosition;
    var handler = new Cesium.ScreenSpaceEventHandler(this.map.canvas);
    handler.setInputAction(function (movement) {
      mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
      handler.setInputAction(function (movement) {
        mousePosition = movement.endPosition;
        var y = mousePosition.y - startMousePosition.y;
        if (y > 0) {
          mapV.scene.screenSpaceCameraController.enableTilt = true;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);


    this.handler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
    cesiumMeasure.init(Cesium);
    this.mouseManager = new mouseManager(this.map);
    this.entitys = new Entitys(this.map);
    this.measure = new Measure(this.map);
    this.bindEvents();

    //单击高亮
    baseMap.addClickEvent(this.handler, this.map.scene, this);
    window.viewer = this.map;

    this.defaultMenu()

    this.getRightClickViewInfo(this.handler)///获取鼠标右键单击处的坐标信息
  },

  data() {
    return {
      featuresLength: 0,
      trianglesLength: 0,
      texturesByteLength: 0,
      geometryByteLength: 0,
      isToolBoxShow: false,
      currentViewInfo: {
        lng: 0,
        lat: 0,
        heading: 0,
        alt: 0,
        pitch: 0,
        level: 0,
        viewHeight: 0,
      },
      getMoveInfoThread: undefined,
      cameraChangeThread: undefined,
      tempEntities: [],
      pointNum: 0,
      floatingPoint: undefined,
      activeShape: undefined,
      measure: undefined,
      visibility: undefined,
      arrViewField: [],
      lzJson: [
        {
          id: 12,
          height: 19,
          bottomHeight: 90,
          coordinates: [
            116.644188, 28.273396, 116.64417, 28.273498, 116.644057, 28.273482,
            116.644074, 28.273383,
          ],
        },
        {
          id: 13,
          height: 19,
          bottomHeight: 90,
          coordinates: [
            116.64419, 28.273373, 116.644078, 28.273357, 116.644088, 28.27326,
            116.64421, 28.273275,
          ],
        },
        {
          id: 14,
          height: 19,
          bottomHeight: 90,
          coordinates: [
            116.644075, 28.273349, 116.643949, 28.273328, 116.643943, 28.273223,
            116.644083, 28.27324,
          ],
        },
        {
          id: 15,
          height: 19,
          bottomHeight: 90,
          coordinates: [
            116.644582, 28.273711, 116.644538, 28.273827, 116.644404, 28.273795,
            116.644447, 28.273678,
          ],
        },
        {
          id: 16,
          height: 19,
          bottomHeight: 90,
          coordinates: [
            116.644396, 28.273967, 116.64458, 28.274023, 116.644821, 28.274063,
            116.644868, 28.273927, 116.644723, 28.273903, 116.644729, 28.273877,
            116.644637, 28.27385, 116.644424, 28.273811,
          ],
        },
        {
          id: 17,
          height: 19.5,
          bottomHeight: 90,
          coordinates: [
            116.64502, 28.273942, 116.644985, 28.274088, 116.644835, 28.274058,
            116.644849, 28.274007, 116.644878, 28.274012, 116.644898, 28.273927,
          ],
        },
        {
          id: 18,
          height: 24,
          bottomHeight: 90,
          coordinates: [
            116.644985, 28.274088, 116.644964, 28.274186, 116.64481, 28.274161,
            116.644814, 28.274136, 116.644766, 28.27412, 116.644777, 28.274067,
            116.644818, 28.274076, 116.644819, 28.27406,
          ],
        },
        {
          id: 19,
          height: 23,
          bottomHeight: 90,
          coordinates: [
            116.644957, 28.274223, 116.644779, 28.274192, 116.644783, 28.274176,
            116.644786, 28.274154, 116.644962, 28.27419,
          ],
        },
        {
          id: 20,
          height: 26.5,
          bottomHeight: 90,
          coordinates: [
            116.644957, 28.274223, 116.644912, 28.274356, 116.644747, 28.274314,
            116.64478, 28.27419,
          ],
        },
        {
          id: 21,
          height: 26.5,
          bottomHeight: 90,
          coordinates: [
            116.644903, 28.274347, 116.644874, 28.274426, 116.644669, 28.274372,
            116.644689, 28.274309,
          ],
        },
        {
          id: 22,
          height: 26.5,
          bottomHeight: 90,
          coordinates: [
            116.643795, 28.273445, 116.643911, 28.273415, 116.643942, 28.273529,
            116.643828, 28.273549,
          ],
        },
        {
          id: 23,
          height: 26.5,
          bottomHeight: 90,
          coordinates: [
            116.644019, 28.273629, 116.644043, 28.273736, 116.643953, 28.273761,
            116.643924, 28.273646,
          ],
        },
        {
          id: 24,
          height: 7,
          bottomHeight: 90,
          coordinates: [
            116.644128, 28.273645, 116.644148, 28.27373, 116.644042, 28.273752,
            116.644026, 28.273662,
          ],
        },
        {
          id: 25,
          height: 24,
          bottomHeight: 90,
          coordinates: [
            116.644127, 28.273783, 116.644152, 28.27388, 116.644032, 28.273906,
            116.644007, 28.273806,
          ],
        },
        {
          id: 26,
          height: 24,
          bottomHeight: 90,
          coordinates: [
            116.644364, 28.2739, 116.644386, 28.27402, 116.644262, 28.274047,
            116.644234, 28.273924,
          ],
        },
        {
          id: 27,
          height: 24,
          bottomHeight: 90,
          coordinates: [
            116.644208, 28.273929, 116.644239, 28.274056, 116.644113, 28.274076,
            116.644078, 28.273955,
          ],
        },
        {
          id: 28,
          height: 24,
          bottomHeight: 90,
          coordinates: [
            116.644575, 28.274052, 116.644556, 28.274171, 116.644424, 28.274155,
            116.644446, 28.274041,
          ],
        },
        {
          id: 29,
          height: 24,
          bottomHeight: 90,
          coordinates: [
            116.644385, 28.274201, 116.644174, 28.274242, 116.644141, 28.274128,
            116.64438, 28.27408,
          ],
        },
      ],
      lcJson: [
        {
          id: 1,
          floorHeight: [56, 62.8, 66.8, 73],
          coordinates: [
            116.644769, 28.272714, 116.64467, 28.272777, 116.644776, 28.272893,
            116.64488, 28.272821,
          ],
        },
        {
          id: 2,
          floorHeight: [56, 62.8, 66.8, 73],
          coordinates: [
            116.644777, 28.27289, 116.64483, 28.272951, 116.644927, 28.272877,
            116.644874, 28.272822,
          ],
        },
        {
          id: 3,
          floorHeight: [56, 62.8, 66.8, 70.8, 74.8],
          coordinates: [
            116.644846, 28.272948, 116.645024, 28.273142, 116.645159, 28.27305,
            116.64499, 28.272849,
          ],
        },
        {
          id: 4,
          floorHeight: [58.5, 62.5, 66, 72],
          coordinates: [
            116.645024, 28.273144, 116.645099, 28.273226, 116.645235, 28.27313,
            116.645113, 28.273079,
          ],
        },
        {
          id: 5,
          floorHeight: [59, 63.5, 67.5, 70.5, 75],
          coordinates: [
            116.6451, 28.273228, 116.645194, 28.273337, 116.64531, 28.273257,
            116.645223, 28.273143,
          ],
        },
        {
          id: 6,
          floorHeight: [58.5, 63.5, 67.5, 73],
          coordinates: [
            116.644596, 28.273152, 116.644666, 28.273234, 116.644542, 28.273322,
            116.644476, 28.273237,
          ],
        },
        {
          id: 7,
          floorHeight: [58.5, 63.5, 66.5, 73],
          coordinates: [
            116.644655, 28.273242, 116.644744, 28.273336, 116.644664, 28.273392,
            116.644573, 28.273303,
          ],
        },
        {
          id: 8,
          floorHeight: [58.5, 63.5, 66.5, 73],
          coordinates: [
            116.644743, 28.273337, 116.644854, 28.273458, 116.644775, 28.273512,
            116.644746, 28.273482, 116.644713, 28.273502, 116.644671, 28.273457,
            116.644701, 28.273432, 116.644662, 28.273394,
          ],
        },
        {
          id: 9,
          floorHeight: [58.5, 63.5, 66.5, 73],
          coordinates: [
            116.644858, 28.273455, 116.64493, 28.273535, 116.644856, 28.273589,
            116.644782, 28.273508,
          ],
        },
        {
          id: 10,
          floorHeight: [56, 63.5, 67, 70.5, 75],
          coordinates: [
            116.644984, 28.273562, 116.645001, 28.273628, 116.644866, 28.273655,
            116.644848, 28.273593,
          ],
        },
        {
          id: 11,
          floorHeight: [56, 63.5, 67, 70.5, 75],
          coordinates: [
            116.645001, 28.273628, 116.645019, 28.273687, 116.64489, 28.273721,
            116.644866, 28.273655,
          ],
        },
      ],
      cutAndFillOption: {
        show: false,
        btnactive: false,
        cutOrFillHeight: 1000,
        cut: NaN,
        fill: NaN,
        allArea: NaN,
        singleArea: NaN,
        top: NaN,
        bottom: NaN
      },
      cutAndFillModelOption: {
        show: false,
        btnactive: false,
        cutOrFillHeight: 100,
        cut: NaN,
        fill: NaN,
        allArea: NaN,
        singleArea: NaN,
        top: NaN,
        bottom: NaN,
        boundary: undefined
      },
      entitys: undefined,
      mouseManager: undefined,
      areaSpace: {
        distance: 0,
        polyObj: null,
        tempPoints: [],
        positions: [],
        entity: [],
        redWall: undefined
      },
      _resultTip: undefined,
      _handler: undefined,
      slopIns: undefined,
      menuData: [
        {
          text: "查看此处坐标",
          show: true,
          type: "coordinate"
        },
        {
          text: "查看当前视角",
          show: true,
          type: "view"
        },
        {
          text: "开启深度检测",
          show: true,
          type: 'opendepth'
        },
        {
          text: "关闭深度检测",
          show: false,
          type: 'closedepth'
        },
        {
          text: "允许进入地下",
          show: true,
          type: 'allowenter'
        },
        {
          text: "禁止进入地下",
          show: false,
          type: 'noenter'
        },
        {
          text: "开启地形",
          show: false,
          type: 'openterrain'
        },
        {
          text: "关闭地形",
          show: true,
          type: 'closeterrain'
        },
        {
          text: "绕此处环绕飞行",
          show: true,
          type: 'flyaround'
        },
        {
          text: "停止环绕飞行",
          show: false,
          type: 'stopflyaround'
        }
      ],
      rightClickViewInfo: {
        lon: 0,
        lat: 0,
        height: 0,
        alt: 0,
        heading: 0,
        pitch: 0,
        roll: 0,
      },
    };
  },
  beforeDestroy() {
    this.map = undefined;
    this.tiles3dLayer = undefined;
    this.handler = undefined;
    this.layers = undefined;
    this.currentViewInfo = undefined;
    this.getMoveInfoThread = undefined;
    this.tempEntities = undefined;
    this.pointNum = undefined;
    this.floatingPoint = undefined;
    this.activeShape = undefined;
    this.measure = undefined;
    this.arrViewField = undefined;
    this.lzJson = undefined;
    this.lcJson = undefined;
    // this.baseLayer = undefined;
    // this.yxzjLayer = undefined;

  },
  methods: {
    getRightClickViewInfo(handler) {
      let that = this
      handler.setInputAction(function (e) {
        var scene = that.map.scene;
        var ellipsoid = scene.globe.ellipsoid;
        var cartesian = that.map.scene.pickPosition(e.position);
        if (cartesian) {
          var cartographic = ellipsoid.cartesianToCartographic(cartesian);
          let lon = Cesium.Math.toDegrees(cartographic.longitude);
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          //地理高度
          let height = cartographic.height;
          //相机高度
          let alt = that.map.camera.positionCartographic.height;
          //方向   围绕Z轴旋转
          let heading = Cesium.Math.toDegrees(that.map.camera.heading);
          //倾斜角度   围绕Y轴旋转
          let pitch = Cesium.Math.toDegrees(that.map.camera.pitch);
          //围绕X轴旋转
          let roll = Cesium.Math.toDegrees(that.map.camera.roll);
          // console.log('lon:' + lon + ";" + 'lat:' + lat + ";" + 'height:' + height);
          // console.log('heading:' + heading + ';' + 'pitch:' + pitch + ';' + 'roll:' + roll)
          that.rightClickViewInfo.lon = lon.toFixed(6)
          that.rightClickViewInfo.lat = lat.toFixed(6)
          that.rightClickViewInfo.height = height.toFixed(6)
          that.rightClickViewInfo.alt = alt.toFixed(6)
          that.rightClickViewInfo.heading = heading.toFixed(6)
          that.rightClickViewInfo.pitch = pitch.toFixed(6)
          that.rightClickViewInfo.roll = roll
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    },
    showModelTree(data) {
      mapLayer.showModelTree(data, this);
    },
    defaultMenu() {
      var depthStatus = this.map.scene.globe.depthTestAgainstTerrain;
      var enterStatus = this.map.scene.screenSpaceCameraController.enableCollisionDetection;
      var terrain = this.map.scene.terrainProvider;
      for (var i = 0; i < this.menuData.length; i++) {
        if (this.menuData[i].type == 'opendepth') {
          this.menuData[i].show = !depthStatus
        }
        if (this.menuData[i].type == 'closedepth') {
          this.menuData[i].show = depthStatus
        }

        if (this.menuData[i].type == 'allowenter') {
          this.menuData[i].show = !enterStatus
        }
        if (this.menuData[i].type == 'noenter') {
          this.menuData[i].show = enterStatus
        }

      }

    },

    menuFn(type) {
      switch (type) {
        case 'coordinate':
          Modal.info({
            title: () => '位置信息',
            content: () =>
              h('div', {}, [
                h('p', '经度：' + this.rightClickViewInfo.lon+ "，纬度：" + this.rightClickViewInfo.lat + "，海拔：" + this.rightClickViewInfo.height+"米"),
              ]),
            okText: () => '关闭'
          });
          break;
        case 'view':
          Modal.info({
            title: () => '当前视角信息',
            content: () =>
              h('div', {}, [
                h('p', '视高：' + this.rightClickViewInfo.alt + "，方向：" + this.rightClickViewInfo.heading + "，俯仰角：" + this.rightClickViewInfo.pitch),
              ]),
            okText: () => '关闭'
          });
          break;
        case 'opendepth':
          this.map.scene.globe.depthTestAgainstTerrain = true;
          for (var i = 0; i < this.menuData.length; i++) {
            if (this.menuData[i].type == 'opendepth') {
              this.menuData[i].show = false
            }
            if (this.menuData[i].type == 'closedepth') {
              this.menuData[i].show = true
            }
          }
          break;
        case 'closedepth':
          this.map.scene.globe.depthTestAgainstTerrain = false;
          for (var i = 0; i < this.menuData.length; i++) {
            if (this.menuData[i].type == 'opendepth') {
              this.menuData[i].show = true
            }
            if (this.menuData[i].type == 'closedepth') {
              this.menuData[i].show = false
            }
          }
          break;
        case 'allowenter':
          this.map.scene.screenSpaceCameraController.enableCollisionDetection = false;
          for (var i = 0; i < this.menuData.length; i++) {
            if (this.menuData[i].type == 'allowenter') {
              this.menuData[i].show = false
            }
            if (this.menuData[i].type == 'noenter') {
              this.menuData[i].show = true
            }
          }
          break;
        case 'noenter':
          this.map.scene.screenSpaceCameraController.enableCollisionDetection = true;
          for (var i = 0; i < this.menuData.length; i++) {
            if (this.menuData[i].type == 'allowenter') {
              this.menuData[i].show = true
            }
            if (this.menuData[i].type == 'noenter') {
              this.menuData[i].show = false
            }
          }
          break;
        case 'openterrain':
          this.map.scene.terrainProvider = new Cesium.CesiumTerrainProvider({
            url: 'https://tiles1.geovisearth.com/base/v1/terrain?token=' + token
          })
          for (var i = 0; i < this.menuData.length; i++) {
            if (this.menuData[i].type == 'openterrain') {
              this.menuData[i].show = false
            }
            if (this.menuData[i].type == 'closeterrain') {
              this.menuData[i].show = true
            }
          }
          break;
        case 'closeterrain':
          this.map.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
          for (var i = 0; i < this.menuData.length; i++) {
            if (this.menuData[i].type == 'openterrain') {
              this.menuData[i].show = true
            }
            if (this.menuData[i].type == 'closeterrain') {
              this.menuData[i].show = false
            }
          }
          break;
        case 'flyaround':
          this.startRotate()
          for (var i = 0; i < this.menuData.length; i++) {
            if (this.menuData[i].type == 'stopflyaround') {
              this.menuData[i].show = true
            }
            if (this.menuData[i].type == 'flyaround') {
              this.menuData[i].show = false
            }
          }
          break;
        case 'stopflyaround':
          this.map.clock.stopTime = this.map.clock.startTime.clone();
          for (var i = 0; i < this.menuData.length; i++) {
            if (this.menuData[i].type == 'stopflyaround') {
              this.menuData[i].show = false
            }
            if (this.menuData[i].type == 'flyaround') {
              this.menuData[i].show = true
            }
          }
          break
      }
    },
    startRotate() {
      if (this.rightClickViewInfo.lon == 0 || this.rightClickViewInfo.lat == 0) {
        return
      }
      let that = this
      var position = Cesium.Cartesian3.fromDegrees(this.rightClickViewInfo.lon, this.rightClickViewInfo.lat, this.rightClickViewInfo.height);

      // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值
      var pitch = Cesium.Math.toRadians(-30);
      // 给定飞行一周所需时间，比如30s, 那么每秒转动度数
      var angle = 360 / 30;//每秒转动角度,该设置需要转动30秒才一周
      // 给定相机距离点多少距离飞行
      var distance = 1000;
      var startTime = Cesium.JulianDate.fromDate(new Date());
      var stopTime = Cesium.JulianDate.addSeconds(startTime, 30, new Cesium.JulianDate());
      that.map.clock.stopTime = stopTime.clone();     // 结速时间
      that.map.clock.startTime = startTime.clone();  // 开始时间
      that.map.clock.currentTime = startTime.clone(); // 当前时间
      that.map.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
      that.map.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
      // 相机的当前heading
      var initialHeading = that.map.camera.heading;
      var Exection = function TimeExecution() {
        // 当前已经过去的时间，单位s
        var delTime = Cesium.JulianDate.secondsDifference(that.map.clock.currentTime, that.map.clock.startTime);
        var heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
        that.map.scene.camera.setView({
          destination: position,
          orientation: {
            heading: heading,
            pitch: pitch,
          }
        });
        that.map.scene.camera.moveBackward(distance);
        if (Cesium.JulianDate.compare(that.map.clock.currentTime, that.map.clock.stopTime) >= 0) {
          that.map.clock.onTick.removeEventListener(Exection);
        }
      };
      that.map.clock.onTick.addEventListener(Exection);
    },

    peoperty(data) {
      this.$emit("property", data);
      console.log(data);
    },

    selectMenu: (params) => {
      console.log(this);
    },
    tongshi2() {
      this.visibility = new Visibility(this.map, {});
    },
    clearTongshi2() {
      if (this.visibility) {
        this.visibility.remove();
      }
      this.visibility = undefined;
    },
    tongshi() {
      var viewModel = { verticalAngle: 90, horizontalAngle: 120, distance: 10 };
      var e = new Cesium.ViewShed3D(this.map, {
        horizontalAngle: Number(viewModel.horizontalAngle),
        verticalAngle: Number(viewModel.verticalAngle),
        distance: Number(viewModel.distance),
        calback: function () {
          viewModel.distance = e.distance;
        },
      });
      this.arrViewField.push(e);
    },
    clearTongshi() {
      for (var e = 0, i = this.arrViewField.length; e < i; e++) {
        this.arrViewField[e].destroy();
      }
      this.arrViewField = [];
    },
    showMenuToggle() {
      eventBus.$emit("isShow");
    },
    showToolBox() {
      this.isToolBoxShow = !this.isToolBoxShow;
    },
    updateModel(option) {
      let that = this;
      let layer = layers.find((item) => item.id === option.id);
      //调整BIM位置
      if (layer && option.modelType == 2) {
        let tileset = layer.layer;
        tileset.readyPromise.then(function (tileset) {
          tileset = mapLayer.modelMatrix(tileset, {
            positionLng: option.position.lng,
            positionLat: option.position.lat,
            positionAlt: option.position.alt,
            x: option.rotation.x,
            y: option.rotation.y,
            z: option.rotation.z,
          });
          tileset.style = new Cesium.Cesium3DTileStyle({
            color: "color('rgba(255,255,255," + option.opacity + ")')",
          });
          that.locateToModel(layer.id);
        });
      }
    },

    zoomToLayer(layerId) {
      let layer = layers.find((item) => item.id === layerId);
      if (layer.modelType == 4 && layer.lon != undefined && layer.lat != undefined && layer.alt != undefined) {
        this.map.camera.flyTo({
          // fromDegrees()将经纬度和高程转换为世界坐标
          destination: Cesium.Cartesian3.fromDegrees(layer.lon, layer.lat, layer.alt),
          orientation: {
            // 指向
            heading: Cesium.Math.toRadians(0.0),
            // 视角
            pitch: Cesium.Math.toRadians(-30.0),
            roll: 0.0
          }
        });
      } else {
        this.map.flyTo(layer.layer);
      }

    },

    init3dTileLayer(option) {
      let that = this;
      if (option.checked === true) {
        option.checkLayers.forEach((it) => {
          let isLoadLayer = layers.find((item) => item.id === it.id);
          if (isLoadLayer == undefined) {
            //加载数据
            var tileset = mapLayer.init3dTileLayer({
              url: it.url,
              maximumMemoryUsage: it.maximumMemoryUsage,
              show: true,
            });
            if (it.modelType == 4) {
              if (it.name == "南京市") {
                tileset.style = new Cesium.Cesium3DTileStyle({
                  color: {
                    conditions: [
                      ["${Elevation} >= 300", "rgba(45, 0, 75, 0.5)"],
                      ["${Elevation} >= 200", "rgb(102, 71, 151)"],
                      ["${Elevation} >= 100", "rgb(170, 162, 204)"],
                      ["${Elevation} >= 50", "rgb(224, 226, 238)"],
                      ["${Elevation} >= 30", "rgb(252, 230, 200)"],
                      ["${Elevation} >= 20", "rgb(248, 176, 87)"],
                      ["${Elevation} >= 10", "rgb(198, 106, 11)"],
                      ["true", "rgb(127, 59, 8)"]
                    ]
                  },
                });
              }
              if (it.name == "新泰市") {
                tileset.style = new Cesium.Cesium3DTileStyle({
                  color: {
                    conditions: [
                      // ["${JZGD} >= 300", "rgba(45, 0, 75, 0.5)"],
                      // ["${JZGD} >= 200", "rgb(102, 71, 151)"],
                      // ["${JZGD} >= 100", "rgb(170, 162, 204)"],
                      // ["${JZGD} >= 50", "rgb(224, 226, 238)"],
                      // ["${JZGD} >= 30", "rgb(252, 230, 200)"],
                      // ["${JZGD} >= 20", "rgb(248, 176, 87)"],
                      // ["${JZGD} >= 10", "rgb(198, 106, 11)"],
                      // ["true", "rgb(127, 59, 8)"]
                      ['true', 'rgba(0, 127.5, 255 ,1)']
                    ]
                  },
                });
              }
            }


            //调整BIM位置
            if (it.modelType == 2) {
              tileset.readyPromise.then(function (tileset) {
                tileset = mapLayer.modelMatrix(tileset, {
                  positionLng: it.positionLng,
                  positionLat: it.positionLat,
                  positionAlt: it.positionAlt,
                  x: it.rotationX,
                  y: it.rotationY,
                  z: it.rotationZ,
                });

                //TODO 显示构件树



              });
            }
            // let model = this.map.scene.primitives.add(tileset);
            tileset.readyPromise.then(function (tileset) {
              that.map.scene.primitives.add(tileset, 1);
              // 瓦片内容
              let tileLoadContent = [];
              tileset.tileLoad.addEventListener(function (tile) {
                if (
                  tile.content instanceof Cesium.Model3DTileContent &&
                  tileLoadContent.indexOf(tile.content) <= -1
                ) {
                  tileLoadContent.push(tile.content);
                }
              });


              // 监听相机移动事件
              that.map.camera.moveEnd.addEventListener(() => {
                try {
                  let viewRectangle = that.map.camera.computeViewRectangle();
                  that.featuresLength = 0;
                  that.trianglesLength = 0;
                  that.texturesByteLength = 0;
                  that.geometryByteLength = 0;
                  for (let tile of tileLoadContent) {
                    let center = tile.tile.boundingSphere.center;
                    if (
                      Cesium.Rectangle.contains(
                        viewRectangle,
                        Cesium.Cartographic.fromCartesian(center)
                      )
                    ) {
                      let tileLoadContentfeaturesLength = tile.featuresLength;
                      that.featuresLength += tileLoadContentfeaturesLength;
                      let tileLoadContenttrianglesLength = tile.trianglesLength;
                      that.trianglesLength += tileLoadContenttrianglesLength;

                      let tileLoadContenttexturesByteLength = tile.texturesByteLength;
                      that.texturesByteLength += tileLoadContenttexturesByteLength;

                      let tileLoadContentgeometryByteLength = tile.geometryByteLength;
                      that.geometryByteLength += tileLoadContentgeometryByteLength;
                    }
                  }

                  console.log(that.featuresLength,
                    that.trianglesLength,
                    that.texturesByteLength,
                    that.geometryByteLength
                  );
                } catch {
                }
              });
            });

            layers.push({
              id: it.id,
              layer: tileset,
              lon: it.positionLng,
              lat: it.positionLat,
              alt: it.positionAlt,
              modelType: it.modelType
            });

            //倾斜单体化
            if (it.name == "江西") {
              const ldCollection = new Cesium.PrimitiveCollection();
              //整栋
              for (var i = 0; i < this.lzJson.length; i++) {
                ldCollection.add(
                  baseMap.addLdPrimitive(
                    this.lzJson[i].id,
                    this.lzJson[i].coordinates,
                    undefined,
                    this.lzJson[i].bottomHeight,
                    this.lzJson[i].height
                  )
                );
              }
              //分层
              for (var i = 0; i < this.lcJson.length; i++) {
                var item = this.lcJson[i];
                for (var index = 0; index < item.floorHeight.length; index++) {
                  const height = item.floorHeight[index + 1];
                  if (height) {
                    const bottomHeight = item.floorHeight[index];
                    ldCollection.add(
                      baseMap.addLdPrimitive(item.id, item.coordinates, index, bottomHeight, height)
                    );
                  }
                }
              }
              this.map.scene.primitives.add(ldCollection);
            }
            // if (it.name == "江心洲") {
            //   const ldCollection = baseMap.loadJXZModel()
            //   this.map.scene.primitives.add(ldCollection);
            // }
          }
        });

        let layer = undefined;
        if (option.checkLayers.length === 1) {
          layer = layers.find((item) => item.id === option.checkLayers[0].id);
        } else {
          layer = layers.find(
            (item) =>
              item.id === option.checkLayers[option.checkLayers.length - 1].id
          );
        }
        layer.layer.show = true;
        if (layer.modelType == 4 && layer.lon != undefined && layer.lat != undefined && layer.alt != undefined) {
          this.map.camera.flyTo({
            // fromDegrees()将经纬度和高程转换为世界坐标
            destination: Cesium.Cartesian3.fromDegrees(layer.lon, layer.lat, layer.alt),
            orientation: {
              // 指向
              heading: Cesium.Math.toRadians(0.0),
              // 视角
              pitch: Cesium.Math.toRadians(-30.0),
              roll: 0.0
            }
          });
        } else {
          this.map.flyTo(layer.layer);
        }
      } else {
        option.checkLayers.forEach((it) => {
          let layer = layers.find((item) => item.id === it.id);
          layer.layer.show = false;
        });
      }
    },
    bindEvents() {
      let that = this;
      this.handler.setInputAction(function (movement) {
        if (that.getMoveInfoThread) {
          window.clearTimeout(that.getMoveInfoThread);
        }
        that.getMoveInfoThread = window.setTimeout(() => {
          var pick = movement.endPosition;
          var cartesian = that.map.scene.globe.pick(
            that.map.camera.getPickRay(pick),
            that.map.scene
          );
          var ellipsoid = that.map.scene.globe.ellipsoid;
          var cartographic = ellipsoid.cartesianToCartographic(cartesian);
          var lat = Cesium.Math.toDegrees(cartographic.latitude);
          var lon = Cesium.Math.toDegrees(cartographic.longitude);
          var alt = cartographic.height;
          console.log("经度：" + lon + "\n纬度：" + lat + "\n高度：" + alt);
          that.currentViewInfo.lng = lon;
          that.currentViewInfo.lat = lat;
          that.currentViewInfo.alt = alt.toFixed(2);
          //console.log('移动事件：',movement.endPosition);
        }, 200);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      this.map.camera.changed.addEventListener(() => {
        if (that.cameraChangeThread) {
          window.clearTimeout(that.cameraChangeThread);
        }
        that.cameraChangeThread = window.setTimeout(() => {
          var head = that.map.scene.camera.heading;
          var pitch = that.map.scene.camera.pitch;
          var roll = that.map.scene.camera.roll;
          var cameraHeight = that.map.camera.positionCartographic.height;

          that.currentViewInfo.heading = Cesium.Math.toDegrees(head).toFixed(2);
          that.currentViewInfo.pitch = Cesium.Math.toDegrees(pitch).toFixed(2);
          var info = {
            head: head,
            pitch: pitch,
            roll: roll,
            viewHeight: cameraHeight,
          };
          that.currentViewInfo.viewHeight = cameraHeight.toFixed(2);
          var level = that.map.scene._globe._surface._tilesToRender[0]._level;
          that.currentViewInfo.level = level;
          console.log(info);
        }, 500);
      });
    },

    locateToModel(layerId) {
      let layer = layers.find((item) => item.id === layerId);
      if (layer != undefined && layer.layer.boundingSphere) {
        this.map.camera.flyToBoundingSphere(layer.layer.boundingSphere, {
          offset: new Cesium.HeadingPitchRange(
            this.map.camera.heading,
            this.map.camera.pitch,
            layer.layer.boundingSphere.radius * 2
          ),
        });
      }
    },
    cutAndFill() {
      this.cutAndFillOption.show = true;
    },
    cutAndFillModel() {
      this.cutAndFillModelOption.show = true;
    },
    closeCutAndFillModelWin() {
      this.cutAndFillModelOption.show = false;
    },
    closeCutAndFillWin() {
      this.cutAndFillOption.show = false;
      this.clearCutAndFill();
    },
    clearCutAndFill() {
      this.cutAndFillOption.cut = NaN;
      this.cutAndFillOption.fill = NaN;
      this.cutAndFillOption.allArea = NaN;
      this.cutAndFillOption.singleArea = NaN;
      this.cutAndFillOption.top = NaN;
      this.cutAndFillOption.bottom = NaN;
      this.cutAndFillOption.btnactive = false;
      this.map._container.style.cursor = 'default';
      this.removeCutAndFill();
    },
    drawCutAndFill() {

      this.cutAndFillOption.btnactive = !this.cutAndFillOption.btnactive;
      if (this.cutAndFillOption.btnactive) {
        this.removeCutAndFill();
        let _self = this;
        _self._handler = new Handler(_self.map);
        _self.map._container.style.cursor = 'crosshair';
        _self.map.scene.screenSpaceCameraController.enableRotate = false;//锁定相机
        _self._resultTip = _self.entitys.createMsgTip();
        _self._handler.Action(function (e) { //第一次点击
          // if(_self.Tools.nullBool(e.position)){
          //   return false;
          // }
          let cartesian = _self.mouseManager.screenToWorld(e.position);
          if (_self.areaSpace.positions == 0) {
            _self.areaSpace.positions.push(cartesian.clone())
          }
          _self.areaSpace.positions.push(cartesian); //模拟

          let cartographic = Cesium.Cartographic.fromCartesian(_self.areaSpace.positions[_self.areaSpace.positions.length - 1]);
          _self.areaSpace.tempPoints.push({
            lon: Cesium.Math.toDegrees(cartographic.longitude),
            lat: Cesium.Math.toDegrees(cartographic.latitude),
            hei: cartographic.height
          });
          /**
           * 创建实体
           */
          let entity = _self.entitys.createEntity();
          entity.position = cartesian;
          entity.point = _self.entitys.getPoint();
          _self.areaSpace.entity.push(_self.entitys.add(entity)); //创建点
        }, _self._handler.LEFT_CLICK);
        _self._handler.Action(function (e) {

          let cartesian = _self.mouseManager.screenToWorld(e.endPosition);
          if (!cartesian) {
            return false;
          }
          if (_self.areaSpace.positions.length >= 2) {
            if (!Cesium.defined(_self.areaSpace.polyObj)) {
              _self.areaSpace.polyObj = new entityFactory({
                type: "createPolygon",
                data: { positions: _self.areaSpace.positions, material: Cesium.Color.CHARTREUSE.withAlpha(0.3) }
              });
              _self.areaSpace.entity.push(_self.entitys.add(_self.areaSpace.polyObj)); //创建线
            } else {
              _self.areaSpace.positions.pop();
              _self.areaSpace.positions.push(cartesian.clone());
            }
            _self.entitys.showTip(_self._resultTip, true, cartesian, '鼠标右键结束,平板长按结束');
          } else {
            _self.entitys.showTip(_self._resultTip, true, cartesian, '点击地图');
          }
        }, _self._handler.MOUSE_MOVE);
        _self._handler.Action(function (e) {
          _self._handler.destroy(); //关闭事件句柄
          _self.areaSpace.positions.pop(); //最后一个点无效
          //var textArea = _self.areaSpace.getArea(_self.areaSpace.tempPoints) + "平方公里";
          // let entity = _self.entitys.createEntity();
          // entity.position = _self.areaSpace.positions[_self.areaSpace.positions.length - 1];
          // entity.name = '多边形面积';
          // entity.label = _self.entitys.getLabel(textArea);

          //_self.areaSpace.entity.push(_self.entitys.add(entity));
          _self.map.scene.screenSpaceCameraController.enableRotate = true;//解锁相机
          _self.entitys.remove(_self._resultTip);
          _self.map._container.style.cursor = 'default';
          _self.cutAndFillOption.btnactive = false;
        }, _self._handler.RIGHT_CLICK);
      } else {
        this._handler.destroy(); //关闭事件句柄
        this.areaSpace.positions.pop(); //最后一个点无效
        this.map.scene.screenSpaceCameraController.enableRotate = true;//解锁相机
        this.entitys.remove(_self._resultTip);
        this.map._container.style.cursor = 'default';
        this.cutAndFillOption.btnactive = false;
      }


    },
    removeCutAndFill() {
      if (this._handler) this._handler.destroy();
      if (this._resultTip) this.entitys.remove(this._resultTip);
      this.areaSpace.positions = [];
      this.areaSpace.tempPoints = [];
      this.areaSpace.polyObj = null;
      if (this.areaSpace.entity.length > 0) {
        for (let i in this.areaSpace.entity)
          this.entitys.remove(this.areaSpace.entity[i]);
        this.areaSpace.entity = [];
      }


      if (this.areaSpace.redWall) {
        this.entitys.remove(this.areaSpace.redWall);
        this.areaSpace.redWall = undefined;
      }
    },
    calcCutAndFill() {
      console.log(this.areaSpace);
      let points = [];
      if (this.areaSpace.tempPoints.length == 0 || this.areaSpace.tempPoints.length < 3) {
        alert("请在地图上绘制一个多边形");
        return;
      }
      if (this.areaSpace.redWall) {
        this.entitys.remove(this.areaSpace.redWall);
        this.areaSpace.redWall = undefined;
      }

      this.areaSpace.tempPoints.forEach(item => {
        points.push([item.lon, item.lat]);
      });
      points.push(points[0]);
      let positions = [];
      points.forEach(item => {
        positions.push(...item, this.cutAndFillOption.cutOrFillHeight)
      })
      this.areaSpace.redWall = this.entitys.add({
        name: "redWall",
        wall: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
          material: new Cesium.Color(1.0, 0.0, 0.0, 0.3),
          outline: true,
        },
      });
      const turfPolygon = turf.polygon([points]);
      const turfExtent = turf.bbox(turfPolygon);
      let options = {
        gridType: 'points',
        units: 'kilometers'
      };
      let grid = turf.pointGrid(turfExtent, 0.3, options);

      let cPoints = [];
      for (let i = 0; i < grid.features.length; i++) {
        let coord = grid.features[i].geometry.coordinates;

        cPoints.push(Cesium.Cartographic.fromDegrees(...coord));


      }
      let _this = this;
      var promise = Cesium.sampleTerrain(this.map.terrainProvider, 11, cPoints);
      Promise.resolve(promise).then(function (updatedPositions) {
        // 计算当前范围最高点、最低点
        let [zenith, nadir] = [0, 99999];
        updatedPositions.forEach(item => {
          if (item.height > zenith) {
            zenith = item.height
          }
          if (item.height < nadir) {
            nadir = item.height
          }
        })
        _this.cutAndFillOption.top = zenith;
        _this.cutAndFillOption.bottom = nadir;

        // 计算挖方、填方
        const height = _this.cutAndFillOption.cutOrFillHeight;

        // 计算面积
        _this.cutAndFillOption.allArea = turf.area(turfPolygon);
        _this.cutAndFillOption.singleArea = _this.cutAndFillOption.allArea / grid.features.length;


        // 开始计算
        let [cut, fill] = [0, 0];
        updatedPositions.forEach(item => {
          if (item.height > height) {
            cut += (item.height - height) * _this.cutAndFillOption.singleArea
          } else if (item.height < height) {
            fill += (height - item.height) * _this.cutAndFillOption.singleArea
          }
        })
        _this.cutAndFillOption.cut = cut;
        _this.cutAndFillOption.fill = fill;
      });
    },
    replaceNaN() {
      this.cutAndFillOption.cutOrFillHeight = this.cutAndFillOption.cutOrFillHeight.replace(/[^\d\.]/g, '');
    },
    slope() {
      this.slopIns = new Slope(this.map, {});
    },
    removeSlope() {
      if (this.slopIns) {
        this.slopIns.remove();
      }
      this.slopIns = undefined;
    },
    drawBoundary() {
      this.clearCutAndFillModel();
      const $this = this;
      let cp = new CreatePolygon(window.viewer);
      cp.start(function () {
        $this.startAnalysis(cp);
      });
    },
    startAnalysis(boundary) {

      const analysisObj = new CutFillAnalysis(
        window.viewer,
        boundary.activeShapePoints,
        this.cutAndFillModelOption.cutOrFillHeight,
        512
      );
      let result = analysisObj.VolumeAnalysis();
      console.log(result);
      viewer.entities.remove(boundary.polygon);
      this.cutAndFillModelOption.allArea = result.allArea;
      this.cutAndFillModelOption.fill = result.fillVolume;
      this.cutAndFillModelOption.cut = result.cutVolume;
      this.cutAndFillModelOption.top = result.cutArea;
      this.cutAndFillModelOption.bottom = result.fillArea;

    },
    calcCutAndFillModel() {
      this.startAnalysis(this.cutAndFillModelOption.boundary)
    },
    clearCutAndFillModel() {
      window.viewer.entities.removeAll();
      let options = {
        show: true,
        btnactive: false,
        cutOrFillHeight: 100,
        cut: NaN,
        fill: NaN,
        allArea: NaN,
        singleArea: NaN,
        top: NaN,
        bottom: NaN,
        boundary: undefined
      };
      options.cutOrFillHeight = this.cutAndFillModelOption.cutOrFillHeight;
      this.cutAndFillModelOption = options;

    }
  },
};
</script>

<style lang="less" scoped>
.infoFields {
  position: absolute;
  right: 2rem;
  top: 0;
}

::v-deep .cesium-viewer-infoBoxContainer {
  display: none;
}

#menuBar {
  position: absolute;
  z-index: 999;
  margin-top: 0.2%;
  margin-left: 0.2%;
}

.menu_btn {
  width: 2.5rem;
  height: 2.5rem;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  z-index: 999;
  left: 2rem;
  top: 2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.5s;
  transform: translateX(0);
}

.ant-menu {
  background-color: rgba(23, 49, 71, 0.5) !important;
  color: white !important;
}

#menuBar {
  position: absolute;
  z-index: 999;
  margin-top: 0.2%;
  margin-left: 0.2%;
}

.menu_btn {
  width: 2.5rem;
  height: 2.5rem;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  z-index: 999;
  left: 2rem;
  top: 2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.5s;
  transform: translateX(0);
}

.ant-menu {
  background-color: rgba(23, 49, 71, 0.5) !important;
  color: white !important;
}

#map {
  width: 100%;
  height: 100%;
  position: relative;

  ::v-deep .cesium-viewer-fullscreenContainer {
    display: none !important;
  }

  .toolBox {
    width: 100%;
    height: auto;
    position: absolute;
    opcity: 0;
    bottom: 0;
    transform: translateY(100%);
    transition: all 0.5s;
    background-color: rgba(23, 49, 71, 0.5);
    padding: 1rem;
    z-index: 9;

    .drawToolTar {
      li {
        width: auto;
        height: 2rem;
        line-height: 2rem;
        border: 1px solid #fff;
        list-style: none;
        padding: 0 10px;
        float: left;
        color: #fff;
        margin-right: 1rem;
        cursor: pointer;
      }

      li:last-child {
        margin: 0;
      }
    }
  }

  .toolBox[isshow=true] {
    transform: translateY(-2rem);
    opcity: 111;
  }

  .infoToolbar {
    position: absolute;
    height: 2rem;
    width: 100%;
    line-height: 2rem;
    left: 0;
    bottom: 0;
    background-color: rgba(23, 49, 71, 0.5);
    z-index: 1;
  }


  .infoFields {
    position: absolute;
    right: 2rem;
    top: 0;

    li {
      width: auto;
      height: 2rem;
      float: left;
      color: #fff;
      list-style: none;
      padding: 0 10px;
    }
  }

  .cutAndFillWin,
  .cutAndFillWinModel {
    width: 32rem;
    height: 18rem;
    position: absolute;
    z-index: 999;
    right: 1rem;
    bottom: 3rem;
    background-color: rgba(23, 49, 71, 0.5);
    transform: translateX(120%);
    opacity: 0;
    box-shadow: 0 0 0.6rem #ffffff inset;
    transition: all 0.5s;
    padding: 1rem;
    padding-top: 2rem;

    .ct_closeBtn {
      width: 1rem;
      height: 1rem;
      display: block;
      right: 0.8rem;
      top: 0.5rem;
      position: absolute;
      color: #ffffff;
      text-align: center;
      line-height: 1rem;
      cursor: pointer;

    }

    .ct_content {
      width: 100%;
      height: 100%;

      button {
        padding: 0 1rem;
        background-color: transparent;
        border: 1px solid #ffffff;
        cursor: pointer;
        transition: all 0.5s;
      }

      button:hover {
        border: 1px solid #0088ff;
        background-color: #0088ff;
        box-shadow: 0 0 10px #0088ff;
      }

      .ct_btnGroup {
        position: absolute;
        width: calc(100% - 1rem);
        height: 1.5rem;
        bottom: 1rem;
        right: 0.5rem;
        padding-right: 1rem;

        button {
          float: right;
          margin-left: 1rem;

        }

      }
    }

    .ct_content * {
      color: #ffffff;
    }

    .ct_drawBtn[isactive=true] {
      border: 1px solid #0088ff;
      background-color: #0088ff;
      box-shadow: 0 0 10px #0088ff;

    }

    .ct_form {
      padding-top: 1rem;

      li {
        width: 50%;
        float: left;
        list-style: none;
        margin-bottom: 0.5rem;
        color: #22ee22;
        border-bottom: 1px solid #ffffff;
        height: 2rem;
        line-height: 2rem;

        label {
          display: inline-block;
          width: 5rem;
          text-align: right;
          margin-right: 0.5rem;
        }
      }


    }

    .ct_form li[fullrow=true] {
      width: 100%;
      color: #ffffff;
      border: 0;

      input[type=text] {
        border: 1px solid #ffffff;
        background-color: transparent;
        margin: 0 1rem;
        width: 5rem;
        text-align: center;
      }
    }
  }

  .cutAndFillWin[showstatus=true],
  .cutAndFillWinModel[showstatus=true] {
    opacity: 1;
    transform: translateX(0);
  }

}




.v-contextmenu-item {
  color: white !important;
}
</style>
