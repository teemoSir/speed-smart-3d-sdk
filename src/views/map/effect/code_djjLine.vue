<template>
  <div :id="mapid" class="ktmap">
    <div class="vatool">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-tabs
            class="demo-tabs"
            @tab-click="handleClick"
            v-model="effectType"
            stretch="true"
          >
            <el-tab-pane label="雪" name="snow"></el-tab-pane>
            <el-tab-pane label="雨" name="rain"></el-tab-pane>
            <el-tab-pane label="雾" name="fog"></el-tab-pane>
            <el-tab-pane label="云" name="cloud"></el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <el-row>
        <!-- {{ this.iShowBtn }} -->

        <el-switch
          v-model="iShowBtn"
          active-text="启用 / 移除"
          @change="changeDepth"
          style="--el-switch-on-color: #4d9efd; --el-switch-off-color: #cccccc"
        />
      </el-row>

      <!--下雪-->
      <div v-if="effectType == 'snow'">
        <el-row :gutter="10" v-for="item in snow" :key="item.id">
          <el-col :span="6">
            <p class="parameters">{{ item.name }}</p>
          </el-col>
          <el-col :span="15">
            <input
              type="range"
              class="slider"
              name=""
              id=""
              @input="rangeVal(item, Object.keys(item))"
              :value="item.val"
              step="1"
              :min="item.min"
              :max="item.max"
            />
          </el-col>
          <el-col :span="3">
            <p class="parameters">{{ item.val }}{{ item.unit }}</p>
          </el-col>
        </el-row>
      </div>

      <!--下雨-->
      <div v-if="effectType == 'rain'">
        <el-row :gutter="10" v-for="item in rain" :key="item.id">
          <el-col :span="6">
            <p class="parameters">{{ item.name }}</p>
          </el-col>
          <el-col :span="15">
            <input
              type="range"
              class="slider"
              name=""
              id=""
              @input="rangeVal(item, Object.keys(item))"
              :value="item.val"
              step="1"
              :min="item.min"
              :max="item.max"
            />
          </el-col>
          <el-col :span="3">
            <p class="parameters">{{ item.val }}{{ item.unit }}</p>
          </el-col>
        </el-row>
      </div>

      <!--雾天-->
      <div v-if="effectType == 'fog'">
        <el-row :gutter="10" v-for="item in fog" :key="item.id">
          <el-col :span="6">
            <p class="parameters">{{ item.name }}</p>
          </el-col>
          <el-col :span="15">
            <input
              v-if="!item.type"
              type="range"
              class="slider"
              name=""
              id=""
              @input="rangeVal(item, Object.keys(item))"
              :value="item.val"
              step="1"
              :min="item.min"
              :max="item.max"
            />

            <el-color-picker
              v-model="this.fog.color.val"
              v-if="item.type"
              @change="colorPicker"
              show-alpha="true"
            />
          </el-col>
          <el-col :span="3">
            <p class="parameters" v-if="!item.type">{{ item.val }}{{ item.unit }}</p>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import * as uuid from "uuid";
import * as Speed from "@/cesiumSDK/index";
import { ElMessage } from "element-plus";
import ModelInfo from "@/utils/modelInfo";
import * as Cesium from "cesium";
import * as turf from "@turf/turf";

let mapid = undefined;
let viewer = undefined;
let tilesetLayer = undefined;
let visible;

export default {
  name: "3dtilesModel",
  data() {
    return {
      visible: undefined,
      active: 0,
      tabBtn: [
        {
          id: 2,
          name: "定位模型",
          active: 0,
          fun: "model",
        },
        {
          id: 1,
          name: "定位山区",
          active: 1,
          fun: "terrain",
        },
      ],
      effectType: "snow",

      snow: {
        level: {
          id: 1,
          name: "雪量大小",
          val: 50,
          unit: "",
          min: 0,
          max: 100,
        },
        direction: {
          id: 2,
          name: "下雪方向",
          val: 1,
          unit: "°",
          min: -80,
          max: 80,
        },
        speed: {
          id: 3,
          name: "下雪速度",
          val: 50,
          unit: "",
          min: 0,
          max: 100,
        },
        opacity: {
          id: 3,
          name: "积雪效果",
          val: 50,
          unit: "",
          min: 0,
          max: 100,
        },
      },

      rain: {
        level: {
          id: 1,
          name: "雨量大小",
          val: 50,
          unit: "",
          min: 0,
          max: 100,
        },
        direction: {
          id: 2,
          name: "下雨方向",
          val: 1,
          unit: "°",
          min: -80,
          max: 80,
        },
        speed: {
          id: 3,
          name: "下雨速度",
          val: 50,
          unit: "",
          min: 0,
          max: 100,
        },
        opacity: {
          id: 3,
          name: "积水效果",
          val: 50,
          unit: "",
          min: 0,
          max: 100,
        },
      },

      fog: {
        level: {
          id: 1,
          name: "大雾密度",
          val: 50,
          unit: "",
          min: 0,
          max: 100,
        },
        color: {
          id: 2,
          name: "大雾颜色",
          val: "#ffffff",
          unit: "",
          min: "",
          max: "",
          type: "color",
        },
      },

      iShowBtn: false,
      beginPoint: { x: 0, y: 0, z: 0 },
      endPoint: { x: 0, y: 0, z: 0 },
    };
  },
  watch: {},
  created() {
    this.mapid = uuid.v4();
  },
  mounted() {
    this.initMap();
  },
  destroyed() {
    this.speedMap && this.speedMap.destory();
    this.speedMap = undefined;
  },
  methods: {
    initMap() {
      let option = {
        tiles3dModel: undefined,
        containID: this.mapid,
        center: {
            lat: 32.0200213627967,
            lng: 118.69152080118508,
          //121.35604714208628, lat: 37.5721192931917
        //   lat: 37.5721192931917,
        //   lng: 121.35604714208628,
          alt: 5500,
          heading: 0,
          //  pitch: -15,
          roll: 0,
        },

        scene: { FPS: true, depthTestTerrain: true }, //显示帧率
        terrains: [
          {
            id: 202,
            type: "xt",
            name: "星图地形",
            icon: "img/basemaps/terrain.png",
            tooltip: "星图地球提供的地形服务",
            url: "https://tiles1.geovisearth.com/base/v1/terrain",
            //  show: true,
          },
        ],
      };

      // 初始化实例
      this.speedMap = new Speed.SpeedViewer();
      this.viewer = this.speedMap.init(option);

      // 加载模型
      if (this.tiles3dModel) {
        this.speedMap.removeLayer(this.tiles3dModel);
        this.tiles3dModel = null;
      }
      this.tilesetLayer = new Speed.TilesetLayer();
      const tileset = this.tilesetLayer.loadTilesetLayer({
        url: ModelInfo.JIANGXINZHOU,
        type: 1,
      });
      this.tiles3dModel = tileset._tileset;
      //  this.speedMap.addLayer(this.tiles3dModel);
      // this.speedMap.flyto(this.tiles3dModel);

      // 添加瓦片坐标信息
      //   this.viewer._viewer.imageryLayers.addImageryProvider(
      //     new Cesium.TileCoordinatesImageryProvider()
      //   );
      this.addMoveModel();
      this.addEvent();
    },

    addMoveModel() {
      this.height = 110;
      this.extrudedHeight = 100;
      this.pointa = [120.87140893447473, 31.877030830389447];
      this.position = Cesium.Cartesian3.fromDegrees(...this.pointa);
      Cesium.Cartesian3.fromDegreesArrayHeights;

      this.height2 = 110;
      this.extrudedHeight2 = 100;
      this.pointb = [120.87195793447473, 31.877030830389447];
      this.position2 = Cesium.Cartesian3.fromDegrees(...this.pointb);

      var pointEllipse = this.viewer._viewer.entities.add({
        name: "red",
        position: new Cesium.CallbackProperty(() => {
          return Cesium.Cartesian3.fromDegrees(...this.pointa);
        }, false),
        ellipse: {
          semiMinorAxis: 10.0, //短轴
          semiMajorAxis: 10.0, //长轴
          extrudedHeight: new Cesium.CallbackProperty(() => {
            return this.extrudedHeight;
          }, false),
          height: new Cesium.CallbackProperty(() => {
            return this.height;
          }, false),
          rotation: Cesium.Math.toRadians(0), //旋转
          fill: true, //是否显示圆的填充
          material: Cesium.Color.fromCssColorString(`red`), //圆的颜色,
          outline: true, //是否显示圆轮廓
          outlineColor: Cesium.Color.fromCssColorString(`rgba(255,255,0,1)`), //圆轮廓线的颜色,
        },
      });

      var pointEllipse2 = this.viewer._viewer.entities.add({
        name: "green",
        position: new Cesium.CallbackProperty(() => {
          return Cesium.Cartesian3.fromDegrees(...this.pointb);
        }, false),
        ellipse: {
          semiMinorAxis: 10.0, //短轴
          semiMajorAxis: 10.0, //长轴
          extrudedHeight: new Cesium.CallbackProperty(() => {
            return this.extrudedHeight2;
          }, false),
          height: new Cesium.CallbackProperty(() => {
            return this.height2;
          }, false),
          rotation: Cesium.Math.toRadians(0), //旋转
          fill: true, //是否显示圆的填充
          material: Cesium.Color.fromCssColorString(`green`), //圆的颜色,
          outline: true, //是否显示圆轮廓
          outlineColor: Cesium.Color.fromCssColorString(`rgba(255,255,0,1)`), //圆轮廓线的颜色,
        },
      });

      var polyline = this.viewer._viewer.entities.add({
        polyline: {
          positions: new Cesium.CallbackProperty(() => {
            return new Cesium.Cartesian3.fromDegreesArrayHeights([
              ...this.pointa,
              this.extrudedHeight,
              ...this.pointb,
              this.extrudedHeight2,
            ]);
          }, false),
          width: 3,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.YELLOW,
            dashLength: 20, //短划线长度
          }),
        },
      });

      var polylinea = this.viewer._viewer.entities.add({
        polyline: {
          positions: new Cesium.CallbackProperty(() => {
            return new Cesium.Cartesian3.fromDegreesArrayHeights([
              ...this.pointa,
              this.extrudedHeight,
              ...this.pointa,
              0,
            ]);
          }, false),
          width: 3,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.BLUE,
            dashLength: 20, //短划线长度
          }),
        },
      });
      var polylineb = this.viewer._viewer.entities.add({
        polyline: {
          positions: new Cesium.CallbackProperty(() => {
            return new Cesium.Cartesian3.fromDegreesArrayHeights([
              ...this.pointb,
              this.extrudedHeight2,
              ...this.pointb,
              0,
            ]);
          }, false),
          width: 3,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.BLUE,
            dashLength: 20, //短划线长度
          }),
        },
      });

      this.viewer._viewer.zoomTo(polyline);
    },
    addEvent() {
      let handler = new Cesium.ScreenSpaceEventHandler(this.viewer._viewer.canvas);

      handler.setInputAction((movement) => {
        var pickedObject = this.viewer._viewer.scene.pick(movement.position);
        if (
          Cesium.defined(pickedObject) &&
          Cesium.defined(pickedObject.id) &&
          Cesium.defined(pickedObject.id.ellipse)
        ) {
          this.cursorPolygon = pickedObject.id;
          this.cursorPolygon.ellipse.outline = true;
          this.cursorPolygon.ellipse.outlineColor = Cesium.Color.fromCssColorString(
            "red"
          );
          this.viewer._viewer.scene.screenSpaceCameraController.enableInputs = false;
        }

        // if (
        //   Cesium.defined(pickedObject) &&
        //   Cesium.defined(pickedObject.id) &&
        //   Cesium.defined(pickedObject.id.polyline)
        // ) {
        //   this.cursorLine = pickedObject.id;
        //   this.cursorLine.polyline.color = Cesium.Color.fromCssColorString("red");
        //   this.viewer._viewer.scene.screenSpaceCameraController.enableInputs = false;
        // }

        // 记住容差
        this.x = movement.position;
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      handler.setInputAction(() => {
        if (Cesium.defined(this.cursorPolygon)) {
          this.cursorPolygon.ellipse.outlineColor = Cesium.Color.WHITE;
          this.cursorPolygon.ellipse.outline = false;
          this.cursorPolygon = undefined;
        }

        // if (Cesium.defined(this.cursorLine)) {
        //   this.cursorLine.polyline.color = Cesium.Color.WHITE;

        //   this.cursorLine = undefined;
        // }
        this.x = undefined;
        this.viewer._viewer.scene.screenSpaceCameraController.enableInputs = true;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);

      // 移动
      handler.setInputAction((movement) => {
        if (Cesium.defined(this.cursorPolygon)) {
          // 平移
          let cartesian = this.viewer._viewer.scene.globe.pick(
            this.viewer._viewer.camera.getPickRay(movement.endPosition),
            this.viewer._viewer.scene
          );
          let ellipsoid = this.viewer._viewer.scene.globe.ellipsoid;
          let cartographic = ellipsoid.cartesianToCartographic(cartesian);
          let lon = Cesium.Math.toDegrees(cartographic.longitude); // 经度
          let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度

          this.x = {
            lng: this.pointa[0] - lon,
            lat: this.pointa[1] - lat,
          };
console.log(     this.x)
          // 垂直
          let deltaY = movement.startPosition.y - movement.endPosition.y;

          if (this.cursorPolygon._name == "green") {
            //   this.extrudedHeight2 += deltaY;
            //   this.height2 += deltaY;
            this.pointb = [lon, lat];
          } else {
            //    this.extrudedHeight += deltaY;
            //    this.height += deltaY;
            this.pointa = [lon-this.x.lng, lat-this.x.lat];
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },

    flyTo(type) {
      if (type == "terrain") {
        this.speedMap.flyto({
          destination: Cesium.Cartesian3.fromDegrees(118.839294, 32.0663951, 5000),
        });
      } else if ("model") {
        this.speedMap.flyto(this.tiles3dModel);
      }
    },
    handleClick(TabsPaneContext, Event) {
      this.effectType = TabsPaneContext.props.name;
      this.iShowBtn = false;
      this.closeEffect();
    },

    changeDepth() {
      ElMessage.success(this.iShowBtn ? `开启天气特效` : `移除天气特效`);

      if (this.iShowBtn) {
        this.openEffect();
      } else {
        this.closeEffect();
      }
    },

    openEffect() {
      this.mosaic = this.mosaic || new Speed.Mosaic(this.viewer);
    },

    // 关闭特效
    closeEffect() {
      this.weather && this.weather.deactivate();
    },

    // 属性修改
    rangeVal(i, key) {
      i.val = Number(event.srcElement.value);

      console.log(Object.hasOwnProperty(i), key);
      switch (i.name) {
        case "雪量大小":
          this.weather &&
            this.weather.setProperty(Speed.WeatherMode.SNOW, {
              level: Number(i.val),
            });
          break;
        case "下雪速度":
          this.weather &&
            this.weather.setProperty(Speed.WeatherMode.SNOW, {
              speed: Number(i.val),
            });
          break;
        case "下雪方向":
          this.weather &&
            this.weather.setProperty(Speed.WeatherMode.SNOW, {
              angle: Number(i.val),
            });
          break;
        case "积雪效果":
          this.weather &&
            this.weather.setProperty(Speed.WeatherMode.SNOWCOVER, {
              opacity: Number(i.val),
            });
          break;

        // 下雨
        case "雨量大小":
          this.weather &&
            this.weather.setProperty(Speed.WeatherMode.RAIN, {
              level: Number(i.val),
            });
          break;
        case "下雨速度":
          this.weather &&
            this.weather.setProperty(Speed.WeatherMode.RAIN, {
              speed: Number(i.val),
            });
          break;
        case "下雨方向":
          this.weather &&
            this.weather.setProperty(Speed.WeatherMode.RAIN, {
              angle: Number(i.val),
            });
          break;
        case "积水效果":
          this.weather &&
            this.weather.setProperty(Speed.WeatherMode.RAIN, {
              opacity: Number(i.val),
            });
          break;

        // 大雾
        case "大雾密度":
          this.weather &&
            this.weather.setProperty(Speed.WeatherMode.FOG, {
              level: Number(i.val),
            });
          break;
      }
    },

    // 大雾颜色
    colorPicker() {
      this.weather &&
        this.weather.setProperty(Speed.WeatherMode.FOG, {
          color: this.fog.color.val,
        });
    },
  },
};
</script>

<style scoped>
.ktmap {
  width: 100%;
  height: 100%;
  background-color: #000;
  position: relative;
}
.vatool {
  position: absolute;
  z-index: 111;
  left: 4.5rem;
  top: 2.5rem;
  width: 400px;
  height: calc(100% - 4rem);
  background: url("../../../../public/img/speed3d/背景框@2x.png") no-repeat;
  padding: 50px 40px;
  background-size: 100% 100%;
}
.tabBtn {
  width: 100%;
  height: 36px;
  text-align: center;
  font-size: 16px;
  font-family: Source Han Sans CN, Source Han Sans CN-Medium;
  font-weight: 600;
  color: #4783ad;
}
.tabBtnActive {
  background: url("../../../../public/img/speed3d/tab@2x.png") no-repeat;
  background-size: 100% 100%;
  color: white;
}

.addClearBtn {
  width: 100%;
  height: 32px;
  text-align: center;
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Medium;
  font-weight: 600;
  color: #4783ad;
}
.clearBtn {
  background: url("../../../../public/img/speed3d/bt_nor@2x.png") no-repeat;
  background-size: 100% 100%;
  color: white;
}
.addBtn {
  background: url("../../../../public/img/speed3d/bt_sel@2x.png") no-repeat;
  background-size: 100% 100%;
  color: white;
}
.el-row {
  margin-bottom: 20px;
}
.block {
  text-align: center;
  color: white;
  font-size: 16px;
  background-color: rgba(17, 43, 71, 0.6);
  padding: 5px;
}
.blockdiv {
  border: 1px solid #1a62a2;
  padding: 10px 0;
}
.blocktext {
  opacity: 0.65;
  font-size: 12px;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 400;
  text-align: center;
  color: #f0f0f0;
}
.triangle {
  width: 0;
  height: 0;
  border-top: 10px solid #1a62a2;
  border-right: 10px solid transparent;
  float: left;
}
.headerText {
  width: 100px;
  height: 45px;
  line-height: 45px;
  background: linear-gradient(0deg, #0099ff 0%, #ffffff 100%);
  font-size: 20px;
  font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
  font-weight: 700;
  font-style: italic;
  text-align: left;
  color: transparent;
  text-shadow: 0px 0px 10px 0px #00618b, 0px 0px 10px 0px #00618b;
  -webkit-background-clip: text;
}
.headerText img {
  width: 45px;
}
::v-deep .el-switch__label.is-active {
  color: white;
  font-weight: 800;
}
::v-deep .el-switch__label {
  color: white;
  font-weight: 800;
}

.slider {
  height: 8px;
  background: repeating-linear-gradient(to right, #0099ff, #43d6d9);
  border-radius: 4px;
  width: 100%;
  display: flex;
  align-items: center;
}

input[type="range"]::-webkit-slider-runnable-track {
  /* height: 8px;
    border-radius: 4px; 
    background: linear-gradient(0deg, #0099ff 0%, #43d6d9 100%);
    width: 100%; */
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 18px;
  width: 6px;
  background: #43d6d9;
  border-radius: 3px;
  border: 0;
  box-shadow: 0 0.125em 0.125em #3b4547;
}

.parameters {
  color: white;
  font-weight: 600;

  display: flex;
  align-items: top;
}
::v-deep .el-col {
  line-height: 50px;
}

::v-deep .el-row {
  display: flex;
  align-items: center;
}
::v-deep .is-active {
  color: #f1f3f6;
  font-weight: 600;
}

::v-deep .el-tabs__item {
  color: #f1f3f6;
}
</style>
