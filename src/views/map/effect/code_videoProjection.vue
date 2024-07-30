<template>
    <div :id="mapid" class="ktmap">
        <div class="vatool">
            <!--标题-->
            <el-row :gutter="10">
                <el-col :span="12" class="headerText">视频投影</el-col>
            </el-row>

            <!--调参-->
            <el-row :gutter="10" v-for="item in parameters" :key="item.id">
                <el-col :span="6">
                    <p class="parameters">{{ item.name }}</p>
                </el-col>
                <el-col :span="15">
                    <input type="range" class="slider" @input="rangeVal(item)" :value="item.val" :step="item.step"
                        :min="item.min" :max="item.max" />
                </el-col>
                <el-col :span="3">
                    <p class="parameters">{{ item.val }}{{ item.unit }}</p>
                </el-col>
            </el-row>

            <!--自动播放-->
            <el-row>
                <el-col :span="6">
                    <p class="parameters">视椎框线</p>
                </el-col>
                <el-col :span="18">
                    <el-switch v-model="debugFrustum" active-text=" 显示 / 隐藏" @change="showFrustum"
                        style="--el-switch-on-color: #4d9efd; --el-switch-off-color: #cccccc" />
                </el-col>
            </el-row>
        </div>
    </div>
</template>
  
<script>
import * as uuid from "uuid";
import * as Speed from "@/cesiumSDK/index";
import * as Cesium from "cesium";
import ModelInfo from "@/utils/modelInfo";
import { ElMessage } from 'element-plus';

let mapid = undefined;
let viewer = undefined;
let tilesetLayer = undefined;
let video3d

export default {
    name: "videoProjection",
    data() {
        return {
            debugFrustum: true,
            parameters: {
                overturn: {
                    id: 1,
                    name: "垂直翻转",
                    val: -35,
                    unit: "°",
                    min: -180,
                    max: 180,
                    step: 1
                },
                rotate: {
                    id: 2,
                    name: "水平旋转",
                    val: -130,
                    unit: "°",
                    min: -180,
                    max: 180,
                    step: 1
                },
                angle: {
                    id: 3,
                    name: "张角",
                    val: 60,
                    unit: "°",
                    min: 1,
                    max: 90,
                    step: 1
                },
                opacity: {
                    id: 3,
                    name: "透明度",
                    val: 1,
                    unit: "",
                    min: 0,
                    max: 1,
                    step: 0.01
                },
            },

            proj_parameters: {
                x: -35,
                y: -130,
                fov: 10,
                far: 1000,
                near: 0.1,
                alpha: 1,
                cX: 118.690944326807,
                cY: 32.02048028644033,
                cH: 17.99254217137643,
                lockCamera: true,
            }
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
        video3d && video3d.destory()

    },
    methods: {

        initMap() {
            let option = {
                tiles3dModel: undefined,
                containID: this.mapid,

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
                        show: true,
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
            this.viewer = this.speedMap.init(option)._viewer;

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
            this.viewer.camera.setView({
                destination: new Cesium.Cartesian3(
                    -2598692.6959031424, 4748310.45024878, 3362405.790174115
                ),
                orientation: {
                    heading: 4.339317486244207,
                    pitch: -0.9027399945735803,
                    roll: 0.0000020629358399304465
                }
            })
            this.addVideoProjection()
        },

        // 创建视频投影实例
        addVideoProjection() {
            video3d = new Speed.VideoProjection(this.viewer, {
                position: {
                    x: this.proj_parameters.cX,
                    y: this.proj_parameters.cY,
                    z: this.proj_parameters.cH,
                },
                rotation: {
                    x: this.proj_parameters.x,
                    y: this.proj_parameters.y,
                },
                far: this.proj_parameters.far,
                near: this.proj_parameters.near,
                url: require("@/assets/v1.mp4"),
                debugFrustum: true,
            })
        },

        // 属性调整
        rangeVal(type) {
            type.val = Number(event.srcElement.value);
            switch (type.name) {
                case "垂直翻转":
                    this.proj_parameters.x = type.val
                    video3d.changeRotation(
                        type.val,
                        this.proj_parameters.y,
                    )
                    break;
                case "水平旋转":
                    this.proj_parameters.y = type.val
                    video3d.changeRotation(
                        this.proj_parameters.x,
                        type.val,
                    )
                    break;
                case "张角":
                    this.proj_parameters.fov = type.val
                    video3d.changeFov(type.val)
                    break;
                case "透明度":
                    this.proj_parameters.alpha = type.val
                    video3d.changeAlpha(type.val)
                    break;
                default:
                    break;
            }
        },
        // 控制视椎框线显隐
        showFrustum() {
            ElMessage.success(this.debugFrustum ? `显示视椎框线` : `隐藏视椎框线`);
            video3d.setShowDebugFrustum(this.debugFrustum)
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


.slider {
    height: 8px;
    background: repeating-linear-gradient(to right, #0099ff, #43d6d9);
    border-radius: 4px;
    width: 100%;
    display: flex;
    align-items: center;
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
::v-deep .el-switch__label.is-active {
  color: white;
  font-weight: 800;
}
::v-deep .el-switch__label {
  color: white;
  font-weight: 800;
}
</style>
  