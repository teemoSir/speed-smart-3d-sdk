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
          <el-button
            v-show="item.show"
            class="addClearBtn"
            link
            :class="item.class"
            @click="item.fun"
            >{{ item.name }}</el-button
          ></el-col
        >
      </el-row>

      <!--测量模式-->
      <el-row :gutter="10">
        <el-col
          :span="8"
          v-for="item in measureBtn"
          :key="item.id"
          @click="measure(item.id)"
        >
          <!-- {{ addActive + "--" + item.id }} -->
          <div class="block">
            <img
              :src="addActive == item.id ? item.activeIcon : item.icon"
              style="width: 66px"
              alt=""
            />
            <div :class="addActive != item.id ? 'blocktext' : 'blocktexts'">
              {{ item.name }}
            </div>
          </div>
        </el-col>
      </el-row>

      <!--警告-->
      <el-alert
        type="info"
        show-icon
        :closable="false"
        style="background-color: rgba(34, 34, 34, 0)"
      >
        <p>左键量测，右键结束。</p>
      </el-alert>
    </div>
  </div>
</template>

<script>
import * as uuid from "uuid";
import * as Speed from "@/cesiumSDK/index";
import * as Cesium from "cesium";
import ModelInfo from "@/utils/modelInfo";
import { ElMessage } from "element-plus";

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
      active: 1,
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
          show: false,
        },
        {
          id: 2,
          name: "清除",
          class: "clearBtn",
          show: true,
          fun: this.clear,
        },
      ],
      addActive: -1,
      measureBtn: [
        {
          id: Speed.MeasureMode.SPACE_DISTANCE,
          name: "空间距离",
          icon: "img/speed3d/ic_d_nor@2x.png",
          activeIcon: "img/speed3d/ic_kjjl_sel@2x.png",
        },
        {
          id: Speed.MeasureMode.GROUND_DISTANCE,
          name: "贴地距离",
          icon: "img/speed3d/ic_tdjl_nor@2x.png",
          activeIcon: "img/speed3d/ic_qt_sel@2x.png",
        },
        {
          id: Speed.MeasureMode.SPACE_AREA,
          name: "空间面积",
          icon: "img/speed3d/ic_spmj_nor@2x.png",
          activeIcon: "img/speed3d/ic_x_sel@2x.png",
        },

        {
          id: Speed.MeasureMode.GROUND_AREA,
          name: "贴地面积",
          icon: "img/speed3d/ic_tdmj_nor@2x.png",
          activeIcon: "img/speed3d/ic_yz_sel@2x.png",
        },
        {
          id: Speed.MeasureMode.POSITION,
          name: "坐标测量",
          icon: "img/speed3d/ic_zbcl_nor@2x.png",
          activeIcon: "img/speed3d/ic_lj_sel@2x.png",
        },
        {
          id: Speed.MeasureMode.AZINUTH,
          name: "方位测量",
          icon: "img/speed3d/ic_fwj_nor@2x.png",
          activeIcon: "img/speed3d/ic_jt_sel@2x.png",
        },
        {
          id: Speed.MeasureMode.HEIGHT_DIFFERENCE,
          name: "高差测量",
          icon: "img/speed3d/ic_gdc_nor@2x.png",
          activeIcon: "img/speed3d/ic_m_sel@2x.png",
        },
        {
          id: Speed.MeasureMode.TRIANGLE_DISTANCE,
          name: "三角测量",
          icon: "img/speed3d/ic_sjcl_nor@2x.png",
          activeIcon: "img/speed3d/ic_sjcl_sel@2x.png",
        },
      ],
      depthTestAgainstTerrain: true,
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
        //97.38326266015687, latitude: 29.226403764390557,
        center: {
          lat: 29.226403764390557,
          lng: 97.38326266015687,
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
     // this.speedMap.flyto(this.tiles3dModel);
     this.flyTo("terrain")
    },

    flyTo(type) {
      if (type == "terrain") {
        this.speedMap.flyto({
          destination: Cesium.Cartesian3.fromDegrees(
            97.42740836467664,
            29.241938559172688,
            6000
          ),
          orientation: {
            heading: 4.081859967458229,
            pitch: -0.31161614819542,
            roll: 0.00012768403421414,
          },
        });
      } else if ("model") {
        this.speedMap.flyto(this.tiles3dModel);
      }
    },

    // 创建与分析
    measure(id) {
      // 实例化测量工具
      !this.measureHandler &&
        (this.measureHandler = new Speed.MeasureHandler(this.viewer));

      switch (id) {
        case Speed.MeasureMode.SPACE_DISTANCE:
          // 空间距离
          this.measureHandler.on(Speed.MeasureMode.SPACE_DISTANCE, (result) => {
            console.info(result);

            // 调起再次绘制
            this.measure(id);
          });
          break;

        case Speed.MeasureMode.GROUND_DISTANCE:
          // 贴地距离
          this.measureHandler.on(Speed.MeasureMode.GROUND_DISTANCE, (result) => {
            console.info(result);

            // 调起再次绘制
            this.measure(id);
          });
          break;
        case Speed.MeasureMode.SPACE_AREA:
          // 水平面积
          this.measureHandler.on(Speed.MeasureMode.SPACE_AREA, (result) => {
            console.info(result);

            // 调起再次绘制
              this.measure(id);
          });
          break;
        case Speed.MeasureMode.GROUND_AREA:
          // 贴地面积
          this.measureHandler.on(Speed.MeasureMode.GROUND_AREA, (result) => {
            console.info(result);

            // 调起再次绘制
             this.measure(id);
          });
          break;
        case Speed.MeasureMode.POSITION:
          // 坐标测量
          this.measureHandler.on(Speed.MeasureMode.POSITION, (result) => {
            console.info(result);

            // 调起再次绘制
            this.measure(id);
          });
          break;
        case Speed.MeasureMode.HEIGHT_DIFFERENCE:
          // 高差测量
          this.measureHandler.on(Speed.MeasureMode.HEIGHT_DIFFERENCE, (result) => {
            console.info(result);

            // 调起再次绘制
            this.measure(id);
          });
          break;
        case Speed.MeasureMode.AZINUTH:
          // 方位测量
          this.measureHandler.on(Speed.MeasureMode.AZINUTH, (result) => {
            console.info(result);

            // 调起再次绘制
            this.measure(id);
          });
          break;
        case Speed.MeasureMode.TRIANGLE_DISTANCE:
          // 三角测量
          this.measureHandler.on(Speed.MeasureMode.TRIANGLE_DISTANCE, (result) => {
            console.info(result);

            // 调起再次绘制
            this.measure(id);
          });
          break;
      }

      this.addActive = id;
    },

    // 重置
    clear() {
      // 测量功能重置
      this.addActive = -1;
      this.measureHandler && this.measureHandler.clear();
    },

    changeDepth() {
      this.viewer._viewer.scene.globe.depthTestAgainstTerrain = this.depthTestAgainstTerrain;
      ElMessage(this.depthTestAgainstTerrain ? "深度检测开启" : "深度检测关闭");
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
  padding: 5px;
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Medium;
  font-weight: 500;
  color: #f0f0f0;
}
.blockdiv {
  border: 1px solid #1a62a2;
  padding: 10px 0;
}
.blocktext {
  opacity: 0.65;
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 400;
  text-align: center;
  color: #f0f0f0;
}

.blocktexts {
  opacity: 0.65;
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 600;
  text-align: center;
  color: #01e8f3;
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
</style>
