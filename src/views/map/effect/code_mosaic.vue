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
            <el-tab-pane label="方形" name="cube"></el-tab-pane>
            <el-tab-pane label="菱形" name="diamond"></el-tab-pane>
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

      <!--方形-->
      <div v-if="effectType == 'cube'">
        <el-row :gutter="10" v-for="item in cube" :key="item.id">
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

      <!--菱形-->
      <div v-if="effectType == 'diamond'">
        <el-row :gutter="10" v-for="item in diamond" :key="item.id">
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
      effectType: "cube",
      cube: {
        width: {
          id: 1,
          name: "图形宽度",
          val: 5,
          unit: "px",
          min: 0,
          max: 100,
        },
        height: {
          id: 2,
          name: "图形高度",
          val: 5,
          unit: "px",
          min: 0,
          max: 100,
        },
      },

      diamond: {
        width: {
          id: 1,
          name: "图形宽度",
          val: 5,
          unit: "px",
          min: 0,
          max: 100,
        },
        height: {
          id: 2,
          name: "图形高度",
          val: 5,
          unit: "px",
          min: 0,
          max: 100,
        },
      },


      iShowBtn: false,

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
        this.speedMap.addLayer(this.tiles3dModel);
       this.speedMap.flyto(this.tiles3dModel);

      // 添加瓦片坐标信息
      //   this.viewer._viewer.imageryLayers.addImageryProvider(
      //     new Cesium.TileCoordinatesImageryProvider()
      //   );
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
      ElMessage.success(this.iShowBtn ? `开启特效` : `移除特效`);

      if (this.iShowBtn) {
        this.openEffect();
      } else {
        this.closeEffect();
      }
    },


    // 开启马赛克
    openEffect() {
      this.mosaic = this.mosaic || new Speed.Mosaic(this.viewer);
      this.mosaic.activate(this.effectType || "cube",{
        x: this.cube.width.val,
        y: this.cube.height.val,
      });
    },

    // 关闭特效
    closeEffect() {
      this.mosaic && this.mosaic.deactivate();
    },

   // 属性修改
   rangeVal(i, key) {
      i.val = Number(event.srcElement.value);
      switch (i.name) {
        case "图形宽度":

        this.cube.width.val= Number(i.val)
 
          this.mosaic &&
            this.mosaic.setProperty("x", Number(i.val));
          break;
        case "图形高度":

        this.cube.height.val= Number(i.val)
          this.mosaic &&
            this.mosaic.setProperty("y", Number(i.val));
          break;
      }
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
