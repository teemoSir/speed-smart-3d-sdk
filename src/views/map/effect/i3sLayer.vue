<template>
  <mapBox
    :css-code="cssCode"
    :html-code="htmlCode"
    :javascript-code="javascriptCode"
  ></mapBox>
</template>

<script>
import mapBox from "@/components/mapBox";

export default {
  name: "I3S三维模型",
  components: {
    mapBox,
  },
  data() {
    return {
      cssCode: `
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
  background: url("img/speed3d/背景框@2x.png") no-repeat;
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
  background: url("img/speed3d/tab@2x.png") no-repeat;
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
  background: url("img/speed3d/bt_nor@2x.png") no-repeat;
  background-size: 100% 100%;
  color: white;
}
.addBtn {
  background: url("img/speed3d/bt_sel@2x.png") no-repeat;
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
  line-height: 45px;
}

.starClearBtn {
  width: 100%;
  height: 32px;
  text-align: center;
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Medium;
  font-weight: 600;
  color: #4783ad;
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

.addBtn {
  background: url("img/speed3d/bt_sel@2x.png") no-repeat;
  background-size: 100% 100%;
  color: white;
}
      `,
      htmlCode: `
        <div :id="mapid" class="ktmap">
    <div class="vatool">
    
      <!--标题-->
      <el-row :gutter="10">
        <el-col :span="12" class="headerText">I3S三维模型</el-col>
        <el-col :span="12"> </el-col>
      </el-row>

      <!--绘制-->
      <el-row :gutter="10">
        <el-col :span="24" v-for="item in uriList" :key="item.name"
          ><div class="grid-content ep-bg-purple" />
          <el-button class="starClearBtn addBtn" link @click="addI3SLayer(item.url)"
            >{{item.name}}</el-button
          ></el-col
        >
 
      </el-row>

    
    </div>
  </div>
        `,
      javascriptCode: `
        import * as uuid from "uuid";
import * as Speed from "@/cesiumSDK/index";
import { ElMessage } from "element-plus";
import ModelInfo from "@/utils/modelInfo";

let mapid = undefined;
let viewer = undefined;
let tilesetLayer = undefined;
let visible;

export default {
  name: "3dtilesModel",
  data() {
    return {
      radio: "v1",
      visible: undefined,
      active: 0,
      angle: 0,
      play: true,
      autoplay: true,
      loop: true,
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
      uriList: [
        {
          name: "纽约（白膜建筑）",
          url:
            "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/NYC_Attributed_v17/SceneServer/layers/0",
        },
        {
          name: "旧金山（3D Object模型）",
          url:
            "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
        },
        {
          name: "阿布扎比（建筑框架）",
          url:
            "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/BuildingWireframe_AbuDhabi/SceneServer/layers/0",
        },

        {
          name: "柏林（白膜建筑）",
          url:
            "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/NEUKOELLN/SceneServer/layers/0",
        },
        {
          name: "法兰克福（倾斜摄影）",
          url:
            "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/Frankfurt2017_vi3s_18/SceneServer/layers/0",
        },
        {
          name: "多伦多（白膜建筑）",
          url:
            "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/Toronto_LoD3_3D_Buildings/SceneServer/layers/0",
        },
        {
          name: "克鲁茨贝格（3D Object模型）",
          url:
            "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/FRIEDRICHSHAIN_KREUZBERG/SceneServer/layers/0",
        },
      ],
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
          //lat: 32.0200213627967,
          // lng: 118.69152080118508,
          lat: 40.710975,
          lng: -74.023923,

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
            show: true,
          },
        ],
        basemaps: [
          {
            id: 101,
            name: "星图影像",
            icon: "img/basemaps/google_img.png",
            type: "xt",
            tooltip: "星图影像地图服务",
            layers: [
              { name: "底图", layer: "img_d" },
              { name: "注记", layer: "img_z" },
            ],
            show: false,
          },
          {
            id: 201,
            name: "天地图影像(EPSG:3857)",
            icon: "img/basemaps/tdt_img.png",
            tooltip: "天地图影像地图服务",
            type: "tdt",
            layers: [
              { name: "底图", layer: "img_d" },
              { name: "注记", layer: "img_z" },
            ],
            show: false,
          },
        ],
      };

      // 初始化实例
      this.speedMap = new Speed.SpeedViewer();
      this.viewer = this.speedMap.init(option);

      // 叠加arcgis图层，国内图层清晰度级别不足
      this.addArcServer();

      this.addI3SLayer();
    },
    addI3SLayer(uri) {
      this.i3slayer = this.i3slayer || new Speed.I3SLayer();

      // 清空历史
      this.i3sdata && this.speedMap.removeLayer(this.i3sdata);
      this.i3sdata && (this.i3sdata = undefined);

      this.i3sdata = this.i3slayer.loadI3SLayer({
        url: uri ? uri : this.uriList[0].url,
        show: true,
        ready: function (data) {
          console.info("加载完成");
        },
      });

      this.speedMap.addLayer(this.i3sdata);
      uri && this.speedMap.flyto(this.i3sdata);
    },

    addArcServer() {
      this.curLayer && this.speedMap.removeLayer(this.curLayer);

      this.curLayer = Speed.ArcGISLayer.arcgisImageryLayer({
        layer: "default",
        url:
          "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      });
      this.speedMap.addLayer(this.curLayer);
    },



  

    // 清空手绘
    clearArea() {
      this.drawHandler && this.drawHandler.clear();
      this.drawHandler = undefined;
    },

    flyTo(type) {
      console.log(type);
      if (type == "terrain") {
        this.speedMap.flyto({
          destination: Cesium.Cartesian3.fromDegrees(118.839294, 32.0663951, 5000),
        });
      } else if ("model") {
        this.speedMap.flyto(this.tiles3dModel);
      }
    },

    // 属性调整
    changeDepth(type) {
      switch (type) {
        case "play":
          if (this.play) {
            this.videoMap && this.videoMap.play();
          } else {
            this.videoMap && this.videoMap.pause();
          }

          ElMessage.success(this.play ? '播放' : '暂停');
          break;
        case "autoplay":
          this.videoMap && this.videoMap.setProperty("autoplay", this.autoplay);
          ElMessage.success(this.autoplay ? '开启自动播放': '停止自动播放');
          break;
        case "loop":
          this.videoMap && this.videoMap.setProperty("loop", this.loop);
          ElMessage.success(this.loop ? '开启循环播放' : '停止循环播放');
          break;
        case "angle":
          console.log(this.angle);
          this.videoMap && this.videoMap.setProperty("angle", this.angle);
          break;

        default:
          break;
      }
    },
  },
};
        `,
    };
  },
};
</script>

<style scoped></style>
