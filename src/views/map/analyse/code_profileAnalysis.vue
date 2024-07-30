<template>
    <div :id="mapid" class="ktmap">
        <div class="vatool">
            <!--地形切换-->
            <el-row :gutter="10">
                <el-col :span="12" v-for="item in tabBtn" :key="item.id">
                    <div class="grid-content ep-bg-purple" />
                    <el-button class="tabBtn" link :class="item.active == active ? 'tabBtnActive' : ''"
                        @click=terrainSwitch(item)>{{ item.name }}</el-button>
                </el-col>
            </el-row>

            <!--绘制与分析-->
            <el-row :gutter="10">
                <el-col :span="12" v-for="item in drawAnalysisBtn" :key="item.id">
                    <div class="grid-content ep-bg-purple" />
                    <el-button class="drawAnalysisBtn" link :class="item.class" @click="item.fun()">{{
                        item.name
                    }}</el-button>
                </el-col>
            </el-row>

            <!--警告-->
            <el-alert type="info" show-icon :closable="false" style="background-color: rgba(34, 34, 34, 0)">
                <p>左键开始绘制，右键结束绘制。</p>
            </el-alert>
        </div>

        <!-- 分析结果echarts图标 -->
        <div class="profile-echarts" v-if="show">
            <div id="profile-echarts"></div>
            <div class="echarts-close" @click="closeThis">×</div>
        </div>
    </div>
</template>
  
<script>
import * as uuid from "uuid";
import * as Speed from "@/cesiumSDK/index";
import * as Cesium from "cesium";
import * as echarts from "echarts";
import ModelInfo from '@/utils/modelInfo';

let mapid = undefined;
let viewer = undefined;
let tilesetLayer = undefined;
let profile = undefined

export default {
    name: "profileAnalysis",
    data() {
        return {
            active: 1,
            show: false,
            drawClicked: false,
            analysClicked: false,
            polyline: undefined,
            tin: true,
            pauseFlood: true,
            profileData: [],
            drawAnalysisBtn: [
                {
                    id: 1,
                    name: "绘制线",
                    class: "drawLineBtn",
                    fun: this.drawLine,
                },
                {
                    id: 2,
                    name: "开始剖面分析",
                    class: "startProfileBtn",
                    fun: this.startProfile,
                },
            ],
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
                flood: undefined,
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

            // 初始化剖面分析工具
            this.profile = new Speed.Profile(this.viewer)

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
        // 地形模型定位切换
        terrainSwitch(item) {
            this.closeThis()
            this.active = item.active;
            this.flyTo(item.fun);
        },

        // 绘制线
        drawLine() {
            if (!this.drawClicked) {
                this.drawClicked = true
                this.profile.draw((pl) => {
                    this.polyline = pl
                })
            }
        },

        // 开始分析
        startProfile() {
            if (this.polyline && !this.analysClicked) {
                this.show = true
                this.analysClicked = true
                let profileData = this.profile.interPoints(this.polyline, this.active);
                this.$nextTick(() => {
                    this.profile.initEcharts(profileData)
                })
            }
        },
        // 清除分析
        closeThis() {
            this.profile.destroy(() => {
                this.show = false
                this.drawClicked = false
                this.analysClicked = false
            })
        }
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


.startProfileBtn,
.drawLineBtn {
    background: url("../../../../public/img/speed3d/bt_nor@2x.png") no-repeat;
    background-size: 100% 100%;
    color: white;
}

.drawAnalysisBtn {
    width: 100%;
    height: 32px;
    text-align: center;
    font-size: 14px;
    font-family: Source Han Sans CN, Source Han Sans CN-Medium;
    font-weight: 600;
    color: #4783ad;
}

.profile-echarts {
    position: absolute;
    bottom: 24px;
    left: 15px;
    text-align: center;
    width: calc(100% - 30px);
    height: 300px;
    background: url("../../../../public/img/speed3d/bg_box_tb@2x.png") no-repeat;
    background-size: 100% 100%;
    z-index: 112;
    padding: 15px;
}

#profile-echarts {
    width: 100%;
    height: 100%;
}

.echarts-close {
    position: absolute;
    font-weight: bolder;
    font-size: 2rem;
    right: 15px;
    top: 5px;
    color: aliceblue;
    cursor: pointer;
}
.el-row {
    margin-bottom: 20px;
}
</style>
  