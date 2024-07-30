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
  name: "terrainExcavation",
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

.addBtn {
  background: url("img/speed3d/bt_sel@2x.png") no-repeat;
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
      <!--地形切换-->
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

      <!--表单-->
      <el-row :gutter="10" v-for="item in form" :key="item.id">
        <el-col :span="18">
          <el-form-item :label="item.name">
            <el-input v-model="item.val" />
          </el-form-item>
        </el-col>
        <el-col :span="6"> <el-form-item :label="item.unit"></el-form-item></el-col>
      </el-row>

      <!--绘制-->
      <el-row :gutter="10">
        <el-col :span="4"></el-col>

        <el-col :span="16"
          ><div class="grid-content ep-bg-purple" />
          <el-button class="starClearBtn addBtn" link @click="start"
            >开始开挖</el-button
          ></el-col
        >
        <el-col :span="4"></el-col>
      </el-row>

      <!--警告-->
      <el-alert
        type="info"
        show-icon
        :closable="false"
        style="background-color: rgba(34, 34, 34, 0)"
      >
        <p>左键开始绘制，右键结束绘制。</p>
      </el-alert>
    </div>
  </div>
      `,
      javascriptCode: `
      import * as uuid from "uuid";
import * as Speed from "@/cesiumSDK/index";
import * as Cesium from "cesium";
import ModelInfo from '@/utils/modelInfo';

let mapid = undefined;
let viewer = undefined;
let tilesetLayer = undefined;

export default {
  name: "digTerrain",
  data() {
    return {
      active: 1,
      tin: true,
      pauseFlood: true,
      addClearBtn: [
        {
          id: 1,
          name: "绘制开挖区域",
          class: "addBtn",
          fun: this.drawArea,
        },
        {
          id: 2,
          name: "清除",
          class: "clearBtn",
          fun: this.clearArea,
        },
      ],
      tabBtn: [
        // {
        //   id: 2,
        //   name: "定位模型",
        //   active: 0,
        //   fun: "model",
        // },
        {
          id: 1,
          name: "定位山区",
          active: 1,
          fun: "terrain",
        },
      ],
      form: {
        height: { id: 2, name: "开挖深度：", unit: "(m)", val: 600 },
      },
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
        drawHandler: undefined,
        center: {
          lat: 32.0663951,
          lng: 118.839294,
          alt: 5000,
          heading: 0,
          pitch: -70,
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

    // 绘制填挖方区域
    drawArea() {
      // 实例化手绘工具
      this.drawHandler = new Speed.DrawHandler(this.viewer, { draw: true,  ground: true });
      this.drawHandler.draw(Speed.DrawMode.POLYGON, (result) => {
        // 返回值
        this.drawHandlerResult = result.positions;
      });
    },

    // 清空手绘
    clearArea() {
      this.drawHandler && this.drawHandler.clear();
      this.drawHandler = undefined;

      // 清除
      this.terrainExcavation && this.terrainExcavation.clear();
      this.terrainExcavation = undefined;
    },

    // 启动分析
    start() {
      // 清空
      this.clearArea();
      if (!this.drawHandlerResult || this.drawHandlerResult.length < 2) {
        return;
      }
      // 实例化填挖方分析
      this.terrainExcavation = new Speed.TerrainExcavation(this.viewer, {
        height: this.form.height.val,
        positions: this.drawHandlerResult,
        autoFocus: true,
      });
    },
  },
  watch: {},
};
      `,
    };
  },
};
</script>

<style scoped></style>
