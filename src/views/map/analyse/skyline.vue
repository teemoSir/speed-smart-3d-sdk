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
  name: "skyline",
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

.starClearBtn {
  width: 100%;
  height: 32px;
  text-align: center;
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Medium;
  font-weight: 600;
  color: #4783ad;
}
.cscBtn {
  background: url("img/speed3d/bt_nor@2x.png") no-repeat;
  background-size: 100% 100%;
  color: #0099ff;
}

.addBtn {
  background: url("img/speed3d/bt_sel@2x.png") no-repeat;
  background-size: 100% 100%;
  color: white;
}

.parameters {
  color: white;
  font-weight: 600;

  display: flex;
  align-items: top;
}

.el-row {
  margin-bottom: 20px;
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

::v-deep .el-form-item__label {
  font-weight: 600;
}
::v-deep .el-input__inner {
  color: #0099ff;
}

::v-deep .el-input__wrapper {
  background-color: transparent;
  box-shadow: 0px 0px 10px 0px rgba(0, 153, 255, 0.7) inset;
  height: 40px;
}

::v-deep .el-form-item__label {
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Medium;
  font-weight: 500;
  color: #f0f0f0;
}
      `,
      htmlCode: `
      <div :id="mapid" class="ktmap">
    <div class="vatool">
      <!--标题-->
      <el-row :gutter="10">
        <el-col :span="3"
          ><img src="img/speed3d/ic_ymfx@2x.png" style="width: 45px" alt=""
        /></el-col>
        <el-col :span="21" class="headerText"> 天际线分析</el-col>
      </el-row>

      <!--绘制-->
      <el-row :gutter="10">
        <el-col :span="15"
          ><div class="grid-content ep-bg-purple" />
          <el-button class="starClearBtn addBtn" link @click="openSkyline"
            >开启天际线</el-button
          ></el-col
        >
        <el-col :span="8"
          ><div class="grid-content ep-bg-purple" />
          <el-button class="starClearBtn addBtn" link @click="closeSkyline"
            >关闭</el-button
          ></el-col
        >
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <p class="parameters">线条颜色</p>
        </el-col>
        <el-col :span="15">
          <el-color-picker v-model="this.color" @change="colorPicker" show-alpha="true" />
        </el-col>
        <el-col :span="3">
          <p class="parameters"></p>
        </el-col>
      </el-row>

      <!--警告-->
      <!-- <el-alert
          type="info"
          show-icon
          :closable="false"
          style="background-color: rgba(34, 34, 34, 0)"
        >
          <p>左键开始绘制，左键结束绘制。</p>
        </el-alert> -->
    </div>
  </div>
        `,
      javascriptCode: `
      import * as uuid from "uuid";
import * as Speed from "@/cesiumSDK/index";
import * as Cesium from "cesium";
import axios from "axios";
import ModelInfo from "@/utils/modelInfo";

let speedMap;
let tilesetLayer;
let tiles3dModel;
const mesh = {};
let highlight;
let feaProperty;

export default {
  name: "3dtilesModel",
  data() {
    return {
      color: "red",
      activeKey: ["1", "2", "3", "4"],
      model: {
        url: ModelInfo.ZHONGDANHUAGONG,
        lng: 119.933944, //经度
        lat: 32.137604, //纬度
        alt: 10, //高度
        rotationZ: -0.33,
        rotationX: 0.0,
        rotationY: 0.0,
        scale: 1,
        opacity: 1,
        maximumScreenSpaceError: 16,
        // type: 1,
        highlightEnable: false,
        propertyEnable: false,
      },
      depthTestAgainstTerrain: false,
      dialogVisible: false,
      cancelTree: false,
      treeData: [],
      treeExpandData: [], //自己定义的用于接收tree树id的数组
      property: [],
      showProperty: false,
    };
  },
  created() {
    this.mapid = uuid.v4();
  },
  mounted() {
    this.initMap();

    //  this.loadModel(true);
  },
  methods: {
    initMap() {
      let option = {
        tiles3dModel: undefined,
        containID: this.mapid,
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
      this.speedMap = new Speed.SpeedViewer();
      this.map = this.speedMap.init(option);

      this.speedMap.flyto({
        destination: Cesium.Cartesian3.fromDegrees(
          97.42740836467664,
          29.241938559172688,
          6000
        ),
        orientation: {
          heading: 4.081859967458229,
          pitch: -0.11161614819542,
          roll: 0.00012768403421414,
        },
      });
    },

    // 颜色更新
    colorPicker() {
      if (this.color) {
        this.skyline && this.skyline.setProperty("color", this.color);
      }
    },

    // 开启天际线
    openSkyline() {
      this.skyline = this.skyline || new Speed.Skyline(this.map);
      this.skyline.activation();
    },

    // 关闭天际线
    closeSkyline() {
      this.skyline && this.skyline.deactivation();
      this.skyline = undefined;
    },
  },
};
      `,
    };
  },
};
</script>

<style scoped></style>
