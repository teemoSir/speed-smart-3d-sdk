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
  name: "visiblity",
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
}
::v-deep .el-switch__label.is-active {
  color: white;
  font-weight: 800;
}
::v-deep .el-switch__label {
  color: white;
  font-weight: 800;
}
    `,
      htmlCode: `
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
        <el-col :span="21" class="headerText"> 观察点信息</el-col>
        <el-col :span="8"
          ><div class="block">
            <div class="triangle"></div>
            <div class="blockdiv">
              {{ vabegin.x ? vabegin.x.toFixed(5) : "" }}
              <div class="blocktext">经度</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="block">
            <div class="triangle"></div>
            <div class="blockdiv">
              {{ vabegin.y ? vabegin.y.toFixed(5) : "" }}
              <div class="blocktext">纬度</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="block">
            <div class="triangle"></div>
            <div class="blockdiv">
              {{ vabegin.z ? vabegin.z.toFixed(5) : "" }}
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
        <el-col :span="21" class="headerText">目标点信息</el-col>
        <el-col :span="8"
          ><div class="block">
            <div class="triangle"></div>
            <div class="blockdiv">
              {{ vaend.x ? vaend.x.toFixed(5) : "" }}
              <div class="blocktext">经度</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="block">
            <div class="triangle"></div>
            <div class="blockdiv">
              {{ vaend.y ? vaend.y.toFixed(5) : "" }}
              <div class="blocktext">纬度</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="block">
            <div class="triangle"></div>
            <div class="blockdiv">
              {{ vaend.z ? vaend.z.toFixed(5) : "" }}
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
        <el-col :span="21" class="headerText">通视分析</el-col>
        <el-col :span="12"
          ><div class="block">
            <div class="triangle"></div>
            <div class="blockdiv">
              {{ varesult.visible ? varesult.visible.toFixed(5) : "" }}
              <div class="blocktext">可见距离</div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="block">
            <div class="triangle"></div>
            <div class="blockdiv">
              {{ varesult.inVisible ? varesult.inVisible.toFixed(5) : "" }}
              <div class="blocktext">不可见距离</div>
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
        <p>左键开始绘制观察点与目标点。</p>
      </el-alert>
    </div>
  </div>
      `,
      javascriptCode: `
      import * as uuid from "uuid";
        import * as Speed from "@/cesiumSDK/index";
        import * as Cesium from "cesium";
        import ModelInfo from '@/utils/modelInfo';
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
          fun: this.visiblity,
        },
        {
          id: 2,
          name: "清除",
          class: "clearBtn",
          fun: this.visiblityClear,
        },
      ],
      depthTestAgainstTerrain: true,
      vabegin: { x: 0, y: 0, z: 0 },
      vaend: { x: 0, y: 0, z: 0 },
      varesult: { visible: 0, inVisible: 0 },
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
          destination: Cesium.Cartesian3.fromDegrees(118.839294, 32.0663951, 3000),
        });
      } else if ("model") {
        this.speedMap.flyto(this.tiles3dModel);
      }
    },

    // 创建与分析
    visiblity() {
      // 实例化手绘工具
      this.drawHandler = new Speed.DrawHandler(this.viewer,  { draw: true, stopLength: 2, ground: false });
      this.drawHandler.draw(Speed.DrawMode.POLYLINE, (resultData) => {
        // 返回值

        if (resultData.positions.length < 2) {
          console.warn("坐标不能少于2个。");
          return;
        }
        console.log(resultData.positions)

        // 清空绘制线
        this.drawHandler && this.drawHandler.clear();

        // 初始化
        this.visible = new Speed.Visible();
        // 计算
        let result = this.visible.compute({
          speedViewer: this.viewer,
          origin: resultData.positions[0],
          target: resultData.positions[resultData.positions.length - 1],
          defaultDraw: true,
          autoFocus: true,
        });

        // 打印结果
        this.vabegin = this.visible.toDegrees(result.origin);
        this.vaend = this.visible.toDegrees(result.target);
        this.varesult = {
          visible: result.visibleDistance,
          inVisible: result.invisibleDistance,
        };
      });
    },

    // 重置
    visiblityClear() {
      this.visible && this.visible.clear();

      //重置面板
      this.vabegin = { x: 0, y: 0, z: 0 };
      this.vaend = { x: 0, y: 0, z: 0 };
      this.varesult = { visible: 0, inVisible: 0 };
    },

    changeDepth() {
      this.viewer._viewer.scene.globe.depthTestAgainstTerrain = this.depthTestAgainstTerrain;
      ElMessage(this.depthTestAgainstTerrain ? "深度检测开启" : "深度检测关闭");
    },
  },
};
      `,
    };
  },
};
</script>

<style scoped></style>
