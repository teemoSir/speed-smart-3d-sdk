<template>
  <div class="function">
    <el-container>
      <el-aside width="210px">
        <!-- active-text-color="#ffd04b" -->
        <el-menu
          style="position: fixed; width: 210px"
          :default-active="activeIndex"
          class="el-menu-vertical-info"
          mode="vertical"
          background-color="#1F3458"
          text-color="#fff"
          :ellipsis="false"
          :unique-opened="true"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
        >
          <el-sub-menu index="1">
            <template #title>三维地球</template>
            <el-menu-item index="1-1">创建地球</el-menu-item>
            <el-menu-item index="1-2">基础控件</el-menu-item>
            <el-menu-item index="1-3">状态栏</el-menu-item>
            <el-menu-item index="1-4">双屏对比</el-menu-item>
            <el-menu-item index="1-5">卷帘对比</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="2">
            <template #title>图层管理</template>
            <el-menu-item index="2-1">地图服务</el-menu-item>
            <el-menu-item index="2-2">矢量图层</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="3">
            <template #title>
              <span>模型管理</span>
            </template>
            <el-menu-item-group title="3DTiles模型">
              <el-menu-item index="3-1">三维模型编辑</el-menu-item>
              <el-menu-item index="3-2">全球城市建筑白膜</el-menu-item>
              <el-menu-item index="3-3">建筑白膜</el-menu-item>
              <el-menu-item index="3-4">三维模型单体化</el-menu-item>
            </el-menu-item-group>
            <!-- <el-menu-item-group title="GLB/GLTF">
							<el-menu-item index="3-5">glb/gltf</el-menu-item>
						</el-menu-item-group> -->
          </el-sub-menu>

          <el-sub-menu index="4">
            <template #title>覆盖物</template>
            <el-menu-item index="4-1">矢量绘制</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="5">
            <template #title>相机视角</template>
            <el-menu-item index="5-1">漫游</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="6">
            <template #title>空间分析</template>
            <el-menu-item index="6-1">量算</el-menu-item>
            <el-menu-item index="6-2">通视分析</el-menu-item>
            <el-menu-item index="6-3">可视域分析</el-menu-item>
            <el-menu-item index="6-4">地形开挖</el-menu-item>
            <el-menu-item index="6-5">淹没分析</el-menu-item>
            <el-menu-item index="6-6">填挖方分析</el-menu-item>
            <el-menu-item index="6-7">天际线</el-menu-item>
            <el-menu-item index="6-8">模型水平剖切</el-menu-item>
            <el-menu-item index="6-9">剖面分析</el-menu-item>
            <el-menu-item index="6-10">坡度坡向分析</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="7">
            <template #title>效果</template>
            <el-menu-item-group title="天气">
              <el-menu-item index="7-1">雨天</el-menu-item>
              <el-menu-item index="7-2">雪天</el-menu-item>
              <el-menu-item index="7-3">雾天</el-menu-item>
              <el-menu-item index="7-4">雷电</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="特效">
              <el-menu-item index="7-5">动态扩散范围</el-menu-item>
              <el-menu-item index="7-6">波动圆</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main style="padding: 5px; height: 100%">
        <el-divider content-position="left">三维地球/3D Earth</el-divider>

        <el-card
          :key="item.id"
          v-for="item in dataModel.earth"
          :body-style="{ padding: '0px' }"
          @click="routeExample(item)"
        >
          <img :src="item.src" class="image" />
          <div style="padding: 14px; text-align: center">
            <span>{{ item.content }}</span>
          </div>
        </el-card>

        <el-divider content-position="left">图层管理/Layer Management</el-divider>

        <el-card
          :key="item.id"
          v-for="item in dataModel.layer"
          :body-style="{ padding: '0px' }"
          @click="routeExample(item)"
        >
          <img :src="item.src" class="image" />
          <div style="padding: 14px; text-align: center">
            <span>{{ item.content }}</span>
          </div>
        </el-card>

        <el-divider content-position="left">模型管理</el-divider>

        <el-card
          :key="item.id"
          v-for="item in dataModel.model"
          :body-style="{ padding: '0px' }"
          @click="routeExample(item)"
        >
          <img :src="item.src" class="image" />
          <div style="padding: 14px; text-align: center">
            <span>{{ item.content }}</span>
          </div>
        </el-card>

        <el-divider content-position="left">覆盖物</el-divider>

        <el-card
          :key="item.id"
          v-for="item in dataModel.covering"
          :body-style="{ padding: '0px' }"
          @click="routeExample(item)"
        >
          <img :src="item.src" class="image" />
          <div style="padding: 14px; text-align: center">
            <span>{{ item.content }}</span>
          </div>
        </el-card>

        <el-divider content-position="left">相机视角</el-divider>

        <el-card
          :key="item.id"
          v-for="item in dataModel.camera"
          :body-style="{ padding: '0px' }"
          @click="routeExample(item)"
        >
          <img :src="item.src" class="image" />
          <div style="padding: 14px; text-align: center">
            <span>{{ item.content }}</span>
          </div>
        </el-card>

        <el-divider content-position="left">空间分析</el-divider>

        <el-card
          :key="item.id"
          v-for="item in dataModel.analyse"
          :body-style="{ padding: '0px' }"
          @click="routeExample(item)"
        >
          <img :src="item.src" class="image" />
          <div style="padding: 14px; text-align: center">
            <span>{{ item.content }}</span>
          </div>
        </el-card>
        <el-divider content-position="left">效果</el-divider>
        <el-card
          :key="item.id"
          v-for="item in dataModel.efftive"
          :body-style="{ padding: '0px' }"
          @click="routeExample(item)"
        >
          <img :src="item.src" class="image" />
          <div style="padding: 14px; text-align: center">
            <span>{{ item.content }}</span>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataModel: {
        earth: [
          {
            id: 1,
            src: require("@/assets/speed/earth/earth.png"),
            content: "创建地球",
            path: "/map/base/index",
          },
          {
            id: 2,
            src: require("@/assets/speed/earth/control.png"),
            content: "基础控件",
            path: "/map/toolbar/toolbar",
          },
          {
            id: 3,
            src: require("@/assets/speed/earth/statusbar.png"),
            content: "状态栏",
            path: "/map/toolbar/statusBar",
          },
          {
            id: 4,
            src: require("@/assets/speed/earth/mapCompare.png"),
            content: "双屏对比",
            path: "/map/toolbar/mapCompare",
          },
          {
            id: 5,
            src: require("@/assets/speed/earth/mapSplit.png"),
            content: "卷帘对比",
            path: "/map/toolbar/mapSplit",
          },
        ],
        layer: [
          {
            id: 21,
            src: require("@/assets/speed/layer/server.png"),
            content: "地图服务",
            path: "/map/layer/mapServer",
          },
          {
            id: 22,
            src: require("@/assets/speed/layer/layer.png"),
            content: "矢量图层",
            path: "/map/layer/loadShp",
          },
        
        ],
        model: [
          {
            id: 31,
            src: require("@/assets/speed/model/3dtiles.png"),
            content: "三维模型编辑",
            path: "/map/3dtiles/3dtilesModel",
          },
          {
            id: 32,
            src: require("@/assets/speed/model/osmbuildings.png"),
            content: "全球城市建筑白膜（OSM在线）",
            path: "/map/3dtiles/OSMBuildings",
          },
          {
            id: 33,
            src: require("@/assets/speed/model/buildings.png"),
            content: "建筑白膜",
            path: "/map/3dtiles/Buildings",
          },
          {
            id: 34,
            src: require("@/assets/speed/model/dth.png"),
            content: "三维模型单体化",
            path: "/map/3dtiles/3dtilesDTH",
          },
          {
            id: 35,
            src: require("@/assets/speed/model/editdth.png"),
            content: "单体化编辑",
            path: "/map/3dtiles/edit3dtilesDTH",
          },
          {
            id: 36,
            src: require("@/assets/speed/model/editmodel.png"),
            content: "GLB/GLTF模型编辑",
            path: "/map/model/editModel",
          },
          {
            id: 37,
            src: require("@/assets/speed/model/fcfh.png"),
            content: "分层分户",
            path: "/map/3dtiles/DTHsample",
          },
          {
            id: 38,
            src: require("@/assets/speed/model/i3s.jpg"),
            content: "I3S模型",
            path: "/map/effect/i3sLayer",
          },
        ],
        analyse: [
          {
            id: 11,
            src: require("@/assets/speed/analyse/lc.png"),
            content: "量测",
            path: "/map/analyse/measure",
          },
          {
            id: 12,
            src: require("@/assets/speed/analyse/tsfx.png"),
            content: "通视分析",
            path: "/map/analyse/visiblity",
          },
          {
            id: 13,
            src: require("@/assets/speed/analyse/ksyfx.png"),
            content: "可视域分析",
            path: "/map/analyse/viewshed",
          },

          {
            id: 14,
            src: require("@/assets/speed/analyse/ymfx.png"),
            content: "淹没分析",
            path: "/map/analyse/flood",
          },
          {
            id: 15,
            src: require("@/assets/speed/analyse/twffx.png"),
            content: "填挖方分析",
            path: "/map/analyse/fillCutVolume",
          },
          {
            id: 16,
            src: require("@/assets/speed/analyse/dxkw.png"),
            content: "地形开挖",
            path: "/map/analyse/terrainExcavation",
          },
          {
            id: 17,
            src: require("@/assets/speed/analyse/tjx.jpg"),
            content: "天际线",
            path: "/map/analyse/skyline",
          },
          {
            id: 18,
            src: require("@/assets/speed/analyse/sppq.jpg"),
            content: "模型水平剖切",
            path: "/map/analyse/modelSectional",
          },
          {
            id: 19,
            src: require("@/assets/speed/analyse/pmfx.jpg"),
            content: "剖面分析",
            path: "/map/analyse/profileAnalysis",
          },
          {
            id: 20,
            src: require("@/assets/speed/analyse/pdpxfx.jpg"),
            content: "坡度坡向分析",
            path: "/map/analyse/slopeAspect",
          },
          {
            id: 21,
            src: require("@/assets/speed/analyse/mxpmpq.jpg"),
            content: "模型多边形剖切",
            path: "/map/analyse/tilesetPlanClip",
          }
        ],
        covering: [
          {
            id: 4,
            src: require("@/assets/speed/covering/img.jpg"),
            content: "矢量绘制",
            path: "/map/drawCovering/showentity",
          },
        ],
        camera: [
          {
            id: 5,
            src: require("@/assets/speed/roam/img.jpg"),
            content: "地图漫游",
            path: "/map/roam/roamMap",
          },
        ],
        efftive: [
          {
            id: 1,
            src: require("@/assets/speed/effect/rain.gif"),
            content: "雨天",
            path: "/map/effect/rain",
          },
          {
            id: 2,
            src: require("@/assets/speed/effect/snow.gif"),
            content: "雪天",
            path: "/map/effect/snow",
          },
          {
            id: 3,
            src: require("@/assets/speed/effect/fog.jpg"),
            content: "雾天",
            path: "/map/effect/fog",
          },
          {
            id: 4,
            src: require("@/assets/speed/effect/thunder.gif"),
            content: "雷电",
            path: "/map/effect/thunder",
          },
          {
            id: 5,
            src: require("@/assets/speed/effect/circle.gif"),
            content: "动态扩散范围",
            path: "/map/effect/SpreadCircle",
          },
          {
            id: 6,
            src: require("@/assets/speed/effect/wave_circle.gif"),
            content: "波动圆",
            path: "/map/effect/WaveCircle",
          },
          {
            id: 7,
            src: require("@/assets/speed/effect/gy.jpg"),
            content: "光源",
            path: "/map/effect/LightSource",
          },
          {
            id: 8,
            src: require("@/assets/speed/effect/spwl.jpg"),
            content: "视频贴图",
            path: "/map/effect/videoMap",
          },
          {
            id: 9,
            src: require("@/assets/speed/effect/msk.jpg"),
            content: "马赛克",
            path: "/map/effect/mosaic",
          },
          {
            id: 10,
            src: require("@/assets/speed/effect/videoProjection.jpg"),
            content: "视频投影",
            path: "/map/effect/videoProjection",
          },
        ],
      },

      activeIndex: "1-1",
    };
  },
  methods: {
    routeExample(params) {
      let routeUrl = this.$router.resolve({
        path: params.path,
        query: {
          data: JSON.stringify(params.data),
        },
      });
      window.open(routeUrl.href, "_blank");
    },
  },
};
</script>

<style scoped>
.function {
  height: 100%;
  background-color: #f4f6f9;
  margin-top: 3%;
}

.el-menu-vertical-info {
  height: 100%;
  width: 100%;
}

::v-deep .el-menu-item.is-active {
  color: var(--el-menu-active-color) !important;
}

::v-deep .el-main {
  margin-top: 0%;
}

::v-deep .el-card {
  width: 16%;
  /* height: 10%; */
  padding: 4px;
  display: inline-block;
  margin: 10px;
  border-radius: 8px;
  background-color: #ffffff;
}

::v-deep .el-card:hover {
  transform: scale(1.01);
  box-shadow: 0px 0px 30px 0px rgba(61, 84, 113, 0.2);
  cursor: pointer;
}

.image {
  width: 100%;
  height: 150px;
  display: block;
}
</style>
