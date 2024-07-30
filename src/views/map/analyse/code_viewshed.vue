<template>
  <div :id="mapid" class="ktmap">
    <div class="vatool">
      <el-row :gutter="10">
        <el-col :span="12" v-for="item in tabBtn" :key="item.id"
          ><div class="grid-content ep-bg-purple" />
          <el-button
            class="tabBtn"
            link
            :class="item.active == active ? 'tabBtnActive' : ''"
            @click="
              active = item.active;
              this.flyTo(item.fun);
            "
            >{{ item.name }}</el-button
          ></el-col
        >
      </el-row>

      <!--绘制与清空-->
      <el-row :gutter="10">
        <el-col :span="12" v-for="item in addClearBtn" :key="item.id"
          ><div class="grid-content ep-bg-purple" />
          <el-button class="addClearBtn" link :class="item.class" @click="item.fun()">{{
            item.name
          }}</el-button></el-col
        >
      </el-row>

      <el-row>
        <!-- {{ this.depthTestAgainstTerrain }} -->

        <el-switch
          v-model="depthTestAgainstTerrain"
          active-text="开启深度检测"
          @change="changeDepth"
          style="--el-switch-on-color: #4d9efd; --el-switch-off-color: #cccccc"
        />
      </el-row>

      <!--观察点坐标-->
      <el-row :gutter="10">
        <el-col :span="3"
          ><img src="img/speed3d/ic_qdxx@2x.png" style="width: 45px" alt=""
        /></el-col>
        <el-col :span="21" class="headerText"> 相机位置</el-col>
        <el-col :span="8"
          ><div class="block">
            <div class="triangle"></div>
            <div class="blockdiv">
              {{ beginPoint.x ? beginPoint.x.toFixed(5) : "" }}
              <div class="blocktext">经度</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="block">
            <div class="triangle"></div>
            <div class="blockdiv">
              {{ beginPoint.y ? beginPoint.y.toFixed(5) : "" }}
              <div class="blocktext">纬度</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="block">
            <div class="triangle"></div>
            <div class="blockdiv">
              {{ beginPoint.z ? beginPoint.z.toFixed(5) : "" }}
              <div class="blocktext">高程</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!--目标点坐标-->
      <el-row :gutter="10">
        <el-col :span="3"
          ><img src="img/speed3d/ic_zdxx@2x.png" style="width: 45px" alt=""
        /></el-col>
        <el-col :span="21" class="headerText">视距位置</el-col>
        <el-col :span="8"
          ><div class="block">
            <div class="triangle"></div>
            <div class="blockdiv">
              {{ endPoint.x ? endPoint.x.toFixed(5) : "" }}
              <div class="blocktext">经度</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="block">
            <div class="triangle"></div>
            <div class="blockdiv">
              {{ endPoint.y ? endPoint.y.toFixed(5) : "" }}
              <div class="blocktext">纬度</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="block">
            <div class="triangle"></div>
            <div class="blockdiv">
              {{ endPoint.z ? endPoint.z.toFixed(5) : "" }}
              <div class="blocktext">高程</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!--分析结果-->
      <el-row :gutter="10">
        <el-col :span="3"
          ><img src="img/speed3d/ic_tsfx@2x.png" style="width: 45px" alt=""
        /></el-col>
        <el-col :span="21" class="headerText">可视域参数设置</el-col>
      </el-row>

      <el-row :gutter="10" v-for="item in parameters" :key="item.id">
        <el-col :span="6">
          <p class="parameters">{{ item.name }}</p>
        </el-col>
        <el-col :span="15">
          <input
            type="range"
            class="slider"
            name=""
            id=""
            @input="rangeVal(item)"
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
</template>

<script>
import * as uuid from "uuid";
import * as Speed from "@/cesiumSDK/index";
import { ElMessage } from "element-plus";
import ModelInfo from '@/utils/modelInfo';

let mapid = undefined;
let viewer = undefined;
let tilesetLayer = undefined;
let visible;

export default {
  name: "3dtilesModel",
  data() {
    return {
      clickIndex: 0,
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
      addClearBtn: [
        {
          id: 1,
          name: "图上标绘",
          class: "addBtn",
          fun: this.viewshed,
        },
        {
          id: 2,
          name: "清除",
          class: "clearBtn",
          fun: this.viewshedClear,
        },
      ],
      parameters: {
        horizontalViewAngle: {
          id: 1,
          name: "水平可视夹角",
          val: 90,
          unit: "°",
          min: 1,
          max: 179,
        },
        verticalViewAngle: {
          id: 2,
          name: "俯仰可视夹角",
          val: 60,
          unit: "°",
          min: 1,
          max: 89,
        },
        viewHeading: {
          id: 3,
          name: "观测方位角",
          val: 0,
          unit: "°",
          min: 1,
          max: 359,
        },
        viewPitch: {
          id: 3,
          name: "观测俯仰角",
          val: 0,
          unit: "°",
          min: 1,
          max: 179,
        },
        viewDistance: {
          id: 4,
          name: "观测距离",
          val: 200,
          unit: "m",
          min: 0,
          max: 2000,
        },
        // opacity: {
        //   id: 5,
        //   name: "透明度",
        //   val: 0.5,
        //   unit: "%",
        //   min: 0,
        //   max: 100,
        // },
      },
      depthTestAgainstTerrain: true,
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
          lat: 30.054604,
          lng: 108.885436,
          alt: 17536414,
          heading: 0,
          pitch: -90,
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
            show: true,
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

    // 创建与分析
    viewshed() {
      // 清空历史
      this.viewshedClear();
      // 实例化手绘工具
      this.drawHandler = new Speed.DrawHandler(this.viewer, {
        draw: false,
        stopLength: 2,
        ground: true,
      });

      this.drawHandler.draw(
        Speed.DrawMode.POINT,
        (resultData) => {
          // 初始坐标
          let pointA = Speed.DrawHandler.toDegrees(resultData.positions[0]);

          this.beginPoint = {
            x: pointA.longitude,
            y: pointA.latitude,
            z: pointA.height,
          };
          // 点击回调
          if (!this.viewShed) {
            this.viewShed = new Speed.ViewShed(this.viewer, {
              viewPosition: resultData.positions[0],
                 viewPositionEnd: resultData.positions[0],
            });
          }
        },
        (resultData) => {
          // 移动回调
          if (this.viewShed) {
            // let pointB = Speed.DrawHandler.toDegrees(resultData.positions);

            // this.endPoint = {
            //   x: pointB.longitude,
            //   y: pointB.latitude,
            //   z: pointB.height,
            // };
            // 更新并获得参数
            let result = this.viewShed.update({
              viewPositionEnd: resultData.positions,
            });

            // 更新面板
            // this.parameters.horizontalViewAngle.val = result.horizontalViewAngle.toFixed(
            //   2
            // );
            // this.parameters.verticalViewAngle.val = result.verticalViewAngle.toFixed(2);
            // this.parameters.viewDistance.val = result.viewDistance.toFixed(2);
            // this.parameters.viewHeading.val = result.viewHeading.toFixed(2);
            // this.parameters.viewPitch.val = result.viewPitch.toFixed(2);
          }
        }
      );
    },

    // 重置
    viewshedClear() {
      this.viewShed && this.viewShed.clear();
      this.viewShed && (this.viewShed = undefined);
      this.drawHandler && this.drawHandler.clear();
    },

    changeDepth() {
      this.viewer._viewer.scene.globe.depthTestAgainstTerrain = this.depthTestAgainstTerrain;
      ElMessage.success(this.depthTestAgainstTerrain ? "深度检测开启" : "深度检测关闭");
    },

    rangeVal(i) {
      i.val = Number(event.srcElement.value);

      // 更新
      this.viewShed &&
        this.viewShed.update({
          horizontalViewAngle: Number(this.parameters.horizontalViewAngle.val),
          verticalViewAngle: Number(this.parameters.verticalViewAngle.val),
          viewHeading: Number(this.parameters.viewHeading.val),
          viewPitch: Number(this.parameters.viewPitch.val),
          viewDistance: Number(this.parameters.viewDistance.val),
          //   shadowVisibleColor: `rgba(0,255,0,{a})`.replace(
          //     "{a}",
          //     this.parameters.opacity.val / 100
          //   ),
          //   inshadowVisibleColor: `rgba(255,0,0,{a})`.replace(
          //     "{a}",
          //     this.parameters.opacity.val / 100
          //   ),
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
  background: linear-gradient(0deg, #2b99fd 0%, #2b99fd 100%);
  border-radius: 4px;
  width: 100%;
}

input[type="range"]::-webkit-slider-runnable-track {
  /* height: 8px;
    border-radius: 4px; 
    background: linear-gradient(0deg, #0099ff 0%, #43d6d9 100%);
    width: 100%; */
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 5px;
  margin-top: -2px;
  background: #ffffff;
  border-radius: 3px;
  border: 0;
  box-shadow: 0 0.125em 0.125em #3b4547;
}

.parameters {
  color: white;
  font-weight: 600;
}
</style>
