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
  name: "modelSectional",
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
        <el-col :span="21" class="headerText"> 模型水平剖切</el-col>
      </el-row>

      <!--绘制-->
      <el-row :gutter="10">
        <el-col :span="15"
          ><div class="grid-content ep-bg-purple" />
          <el-button class="starClearBtn addBtn" link @click="open"
            >激活剖切面</el-button
          ></el-col
        >

        <el-col :span="8"
          ><div class="grid-content ep-bg-purple" />
          <el-button class="starClearBtn addBtn" link @click="close"
            >关闭</el-button
          ></el-col
        >
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <p class="parameters">鼠标高度微调</p>
        </el-col>
        <el-col :span="10">
          <el-switch
            v-model="mouseControl"
            @change="changeMouseControl"
            style="--el-switch-on-color: #4d9efd; --el-switch-off-color: #cccccc"
          />
        </el-col>

        <el-col :span="8">
          <p class="parameters">{{ mouseControl ? "开启" : "关闭" }}</p>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <p class="parameters">高度</p>
        </el-col>
        <el-col :span="13">
          <input
            type="range"
            class="slider"
            name=""
            id=""
            @input="rangeVal('gd')"
            :value="gd"
            step="0.1"
            min="0.1"
            max="50"
          />
        </el-col>
        <el-col :span="5">
          <p class="parameters">{{ this.gd }}米</p>
        </el-col>
      </el-row>

      <!--裁剪面大小-->
      <el-row :gutter="10">
        <el-col :span="6">
          <p class="parameters">长度</p>
        </el-col>
        <el-col :span="13">
          <input
            type="range"
            class="slider"
            name=""
            id=""
            @input="rangeVal('cd')"
            :value="cd"
            step="1"
            min="1"
            max="5000"
          />
        </el-col>
        <el-col :span="5">
          <p class="parameters">{{ this.cd }}米</p>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <p class="parameters">宽度</p>
        </el-col>
        <el-col :span="13">
          <input
            type="range"
            class="slider"
            name=""
            id=""
            @input="rangeVal('kd')"
            :value="kd"
            step="1"
            min="1"
            max="5000"
          />
        </el-col>
        <el-col :span="5">
          <p class="parameters">{{ kd }}米</p>
        </el-col>
      </el-row>

      <!--警告-->
      <!-- <el-alert
        type="info"
        show-icon
        :closable="false"
        style="background-color: rgba(34, 34, 34, 0)"
      >
        <p>左键拖动，调整剖切位置。</p>
      </el-alert> -->
    </div>
  </div>
        `,
      javascriptCode: `
      import * as uuid from "uuid";
import * as Speed from "@/cesiumSDK/index";
import ModelInfo from "@/utils/modelInfo";
import * as Cesium from "cesium";

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
      gd: 30,
      cd: 500,
      kd: 500,
      mouseControl: true,
      activeKey: ["1", "2", "3", "4"],
      model: {
        url: ModelInfo.ZHONGDANHUAGONG,
        lng: 119.933944, //经度
        lat: 32.137604, //纬度
        alt: 10, //高度
        rotationZ: -0.33,
        rotationX: 0.01,
        rotationY: 0.01,
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

    this.loadModel(true);
  },
  methods: {
    initMap() {
      let data = {
        containID: this.mapid,
        center: {
          lat: 30.054604,
          lng: 108.885436,
          alt: 17536414,
          heading: 0,
          pitch: -90,
        },
        baseLayerPicker: true, //底图切换按钮
        homeButton: true, //回到默认视域按钮
        sceneModePicker: true, //是否显示投影方式切换按钮
        fullscreenButton: true, //全屏按钮
        zoom: true, //缩放按钮,
        navigationControl: true, //导航球、比例尺
        statusBar: true, //状态栏
        terrains: [
          {
            id: 201,
            type: "none",
            name: "无地形",
            tooltip: "WGS84标准球体",
            icon: "img/basemaps/Ellipsoid.png",
          },
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
          },
          {
            id: 102,
            name: "星图电子",
            icon: "img/basemaps/tdt_vec.png",
            tooltip: "星图电子地图服务",
            type: "xt",
            layer: "vec",
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
          {
            id: 202,
            name: "天地图电子",
            icon: "img/basemaps/tdt_vec.png",
            tooltip: "天地图电子地图服务",
            type: "tdt",
            layers: [
              { name: "底图", layer: "vec_d" },
              { name: "注记", layer: "vec_z" },
            ],
          },
        ],
      };
      this.speedMap = new Speed.SpeedViewer();
      this.viewer = this.speedMap.init(data);
    },
    loadModel(isInit) {
      if (this.tiles3dModel) {
        this.speedMap.removeLayer(this.tiles3dModel);
        this.tiles3dModel = null;
      }
      if (!this.model.url) {
        console.log("请输入模型地址");
        return;
      }
      this.tilesetLayer = new Speed.TilesetLayer();
      //加载模型
      let tileset = this.tilesetLayer.loadTilesetLayer({
        url: this.model.url,
        maximumScreenSpaceError: this.model.maximumScreenSpaceError,
      });
      this.tiles3dModel = tileset._tileset;
      let that = this;
      this.tiles3dModel.readyPromise.then(function (tiles3dModel) {
        if (isInit) {
          tiles3dModel = that.tilesetLayer.updateModel(tiles3dModel, {
            scale: that.model.scale,
            lng: that.model.lng,
            lat: that.model.lat,
            alt: that.model.alt,
            rotationX: that.model.rotationX,
            rotationY: that.model.rotationY,
            rotationZ: that.model.rotationZ,
            opacity: that.model.opacity,
            maximumScreenSpaceError: that.model.maximumScreenSpaceError,
          });
        } else {
          that.model.type = tiles3dModel.type;
          that.model.alt = tiles3dModel.orginCenter.z;
          that.model.lng = tiles3dModel.orginCenter.x;
          that.model.lat = tiles3dModel.orginCenter.y;
          that.model.rotationX = tiles3dModel.orginRotation.x;
          that.model.rotationY = tiles3dModel.orginRotation.y;
          that.model.rotationZ = tiles3dModel.orginRotation.z;
        }
      });
      // console.log(tileset);
      this.speedMap.addLayer(this.tiles3dModel);
      this.speedMap.flyto(this.tiles3dModel);
    },

    //开启
    open() {
      this.modelSectional = this.modelSectional || new Speed.ModelSectional(this.viewer);
      this.modelSectional.activation(this.tiles3dModel, {
        // color: this.color,
        // outlineColor: this.outlineColor,
        box: [this.cd, this.kd],
        height: 20,
        mouseControl: this.mouseControl,
      });
    },

    // 清空
    close() {
      this.modelSectional && this.modelSectional.deactivation();
    },

    // 长度高度宽度微调
    rangeVal(type) {
      if (type == "cd") {
        this.cd = Number(event.srcElement.value);
      } else if (type == "kd") {
        this.kd = Number(event.srcElement.value);
      } else {
        this.gd = Number(event.srcElement.value);
      }
      this.modelSectional && this.modelSectional.setProperty("box", [this.cd, this.kd]);
      this.modelSectional && this.modelSectional.setProperty("height", this.gd);
    },

    // 鼠标高度微调
    changeMouseControl() {
      this.modelSectional &&
        this.modelSectional.setProperty("mouseControl", this.mouseControl);
    },
  },
};
      `,
    };
  },
};
</script>

<style scoped></style>
