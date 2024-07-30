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
      <!--标题-->
      <el-row :gutter="10">
        <el-col :span="12" class="headerText">视频纹理</el-col>
        <el-col :span="12"> </el-col>
      </el-row>

      <!--绘制-->
      <el-row :gutter="10">
        <el-col :span="16"
          ><div class="grid-content ep-bg-purple" />
          <el-button class="starClearBtn addBtn" link @click="drawArea"
            >绘制播放区域</el-button
          ></el-col
        >
        <el-col :span="8">
          <div class="grid-content ep-bg-purple" />
          <el-button class="starClearBtn addBtn" link @click="clearVideoMap"
            >清空</el-button
          >
        </el-col>
      </el-row>

      <!--播放 / 暂停-->
      <el-row :gutter="10">
        <el-col :span="10">
          <el-switch
            v-model="play"
            active-text="播放 / 暂停"
            @change="changeDepth('play')"
            style="--el-switch-on-color: #4d9efd; --el-switch-off-color: #cccccc"
          />
        </el-col>
      </el-row>

      <!--video-->
      <el-row :gutter="10">
        <el-col :span="24"> <el-form-item label="参数设置"> </el-form-item></el-col>
        <el-col :span="6">
          <p class="parameters">视频地址</p>
        </el-col>
        <el-col :span="18">
          <el-radio-group v-model="radio">
            <el-radio label="v1">视频1</el-radio>
            <el-radio label="v2">视频2</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <p class="parameters">旋转角度</p>
        </el-col>
        <el-col :span="15">
          <el-slider
            v-model="angle"
            :min="Number(0)"
            :max="Number(360)"
            @input="changeDepth('angle')"
          ></el-slider>
        </el-col>
        <el-col :span="3">
          <p class="parameters">{{ angle }}°</p>
        </el-col>
      </el-row>

      <!--自动播放-->
      <el-row>
        <el-col :span="6">
          <p class="parameters">自动播放</p>
        </el-col>
        <el-col :span="18">
          <el-switch
            v-model="autoplay"
            active-text=" 启动 / 停止"
            @change="changeDepth('autoplay')"
            style="--el-switch-on-color: #4d9efd; --el-switch-off-color: #cccccc"
          />
        </el-col>
      </el-row>
      <!--循环播放-->
      <el-row>
        <el-col :span="6">
          <p class="parameters">循环播放</p>
        </el-col>
        <el-col :span="18">
          <el-switch
            v-model="loop"
            active-text=" 启用 / 停止"
            @change="changeDepth('loop')"
            style="--el-switch-on-color: #4d9efd; --el-switch-off-color: #cccccc"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as uuid from "uuid";
import { ElMessage } from "element-plus";
import ModelInfo from "@/utils/modelInfo";
import * as Speed from "@/cesiumSDK/index";
// import "@/utils/S3M_module/cesium-version.js";
// import "@/utils/S3M_module/cesium-when.js";
 //import "@/utils/S3M_module/SuperMap3D.js";
//  import S3MTilesLayer from "@/utils/S3M_module/S3MTiles/S3MTilesLayer.js";
// import Ext from "@/utils/S3M_module/S3MTilesLayer/Source/Ext/CesiumExt.js";

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

        scene: { FPS: true, depthTestTerrain: false }, //显示帧率
        terrains: [
          {
            id: 202,
            type: "xt",
            name: "星图地形",
            icon: "img/basemaps/terrain.png",
            tooltip: "星图地球提供的地形服务",
            url: "https://tiles1.geovisearth.com/base/v1/terrain",
            show: false,
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
            show: true,
          },
        ],
      };
      this.option = option;

      // 初始化实例
    //   this.speedMap = new Speed.SpeedViewer();
    //   this.viewer = this.speedMap.init(option);

      // 加载模型
      //   if (this.tiles3dModel) {
      //     this.speedMap.removeLayer(this.tiles3dModel);
      //     this.tiles3dModel = null;
      //   }
      //   this.tilesetLayer = new Speed.TilesetLayer();
      //   const tileset = this.tilesetLayer.loadTilesetLayer({
      //     url: ModelInfo.JIANGXINZHOU,
      //     type: 1,
      //   });
      //   this.tiles3dModel = tileset._tileset;
      //   this.speedMap.addLayer(this.tiles3dModel);
      // this.speedMap.flyto(this.tiles3dModel);
      this.loadS3M();
    },

    loadS3M() {
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZGJkNjZiZC0yZGUwLTQwZWItOGQyZi0wZjhjNTk4ZGM1YmEiLCJpZCI6NjMzMzcsImlhdCI6MTY2NDI2MTgyMX0.cir5_s5hs_chd0j5f1GEwI4_9OXABcIiSYwpdQZ1DYI";
         var viewer = new Cesium.Viewer(this.option.containID);
//          let scenes = [
//             "http://www.supermapol.com/realspace/services/3D-srsb/rest/realspace",
//             "http://www.supermapol.com/realspace/services/3D-suofeiya_church/rest/realspace",
// "http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace/datas/Building@CBD/config",

//             'https://www.supermapol.com/realspace/services/3D-Text01/rest/realspace',
//             "https://www.supermapol.com/realspace/services/3D-SGNS/rest/realspace",
//             'http://www.supermapol.com/realspace/services/3D-suofeiya_church/rest/realspace',
//             'https://www.supermapol.com/realspace/services/3D-CBD/rest/realspace',
//             'https://www.supermapol.com/realspace/services/3D-CQmodel_wireframe_2000/rest/realspace',
//             'https://www.supermapol.com/realspace/services/3D-cloud/rest/realspace'
//         ];

//         var promise =    viewer.scene.open(
//             "http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace/datas/Building@CBD/config"
//         );

        //  地形
//--------------------------------------------
viewer.camera.flyTo({
    destination : Cesium.Cartesian3.fromDegrees(114.35696772600375,36.16681021589896,1000.0)
});

          let layer = new S3MTilesLayer({
          context:  viewer.scene._context,
      //    url: "data/CBD/cbd.scp",
      url:"./data/comModel/comModel.scp"
        });
        console.log(layer);
        viewer.scene.primitives.add(layer);

        // BIM
//--------------------------------------------


      //   promise.then((t) => {

      //     viewer.scene.primitives.add(t[0]);

      //     console.log(t);
      //   });
      //http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace
        // let layer = new S3MTilesLayer({
        //   context:  viewer.scene._context,
        //   url: "data/CBD/cbd.scp",
        // });
        // console.log(layer);
        // viewer.scene.primitives.add(layer);

      // 场景添加S3M图层服务

      // if (this.options.layername) {
      // this.viewer._viewer.scene.addS3MTilesLayerByScp("data/CBD/cbd.scp", {
      // name: this.options.layername,
      // autoSetVie: this.options.flyTo,
      // cullEnabled: this.options.cullEnabled
      // });
      // } else {

      // }

      //     let layer = new S3MTilesLayer({
      //     context: this.viewer._viewer.scene._context,
      //     url:
      //      // "data/CBD/cbd.scp"
      //      "http://www.supermapol.com/realspace/services/3D-OlympicGreen/rest/realspace/datas/Building@OlympicGreen/config"
      //   });
      //   console.log(layer);
      //   this.viewer._viewer.scene.primitives.add(layer);

      //   layer.readyPromise
      //     .then((s3mLayer) => {
      //       console.log("s3m模型加载完成", s3mLayer);
      //       console.log(this.viewer._viewer);
      //       this.viewer._viewer.camera.setView({
      //         destination: new Cesium.Cartesian3(
      //           -2181968.890329965,
      //           4385313.17843029,
      //           4072712.8241634783
      //         ),
      //         orientation: {
      //           heading: 3.1756648661534443,
      //           pitch: -0.3715184468182904,
      //         },
      //       });
      //     })
      //     .otherwise(function (error) {
      //       console.log(error);
      //     });
    },
    // 绘制填挖方区域
    drawArea() {
      this.clearArea();
      // 实例化手绘工具
      this.drawHandler = new Speed.DrawHandler(this.viewer);
      this.drawHandler.draw(Speed.DrawMode.POLYGON, (result) => {
        // 返回值
        console.info(result);
        this.drawHandlerResult = result.positions;

        // 绘制结束事件中添加
        this.addVideoMap();
      });
    },

    addVideoMap() {
      let options = {
        url: this.radio == "v1" ? require("@/assets/v1.mp4") : require("@/assets/v2.mp4"),
        loop: this.loop,
        autoplay: this.autoplay,
        positions: this.drawHandlerResult,
        angle: this.angle,
      };
      this.videoMap = this.videoMap || new Speed.VideoMap(this.viewer);
      this.videoMap.add(options);

      //清空辅助图形
      this.clearArea();
    },

    clearVideoMap() {
      this.videoMap && this.videoMap.clear();
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

          ElMessage.success(this.play ? `播放` : `暂停`);
          break;
        case "autoplay":
          this.videoMap && this.videoMap.setProperty("autoplay", this.autoplay);
          ElMessage.success(this.autoplay ? `开启自动播放` : `停止自动播放`);
          break;
        case "loop":
          this.videoMap && this.videoMap.setProperty("loop", this.loop);
          ElMessage.success(this.loop ? `开启循环播放` : `停止循环播放`);
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
  background: url("../../../../public/img/speed3d/bt_sel@2x.png") no-repeat;
  background-size: 100% 100%;
  color: white;
}
</style>
