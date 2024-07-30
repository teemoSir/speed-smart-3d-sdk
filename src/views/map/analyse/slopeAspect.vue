<template>
    <mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode">
    </mapBox>
</template>
  
<script>
import mapBox from "@/components/mapBox";


export default {
    name: "fillCutVolume",
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
    background: url("/img/speed3d/背景框@2x.png") no-repeat;
    padding: 50px 40px;
    background-size: 100% 100%;
}
.parameters {
    color: white;
    font-weight: 600;
    font-size: 14px;
}

.addBtn {
    background: url("/img/speed3d/bt_sel@2x.png") no-repeat;
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

::v-deep .el-switch__label {
    color: white;
    font-weight: 800;
}

::v-deep .el-col {
    line-height: 50px;
}

::v-deep .el-row {
    display: flex;
    align-items: center;
}
.addBtn {
    background: url("/img/speed3d/bt_sel@2x.png") no-repeat;
    background-size: 100% 100%;
    color: white;
}
  
      `,
            htmlCode: `
            <div :id="mapid" class="ktmap">
        <div class="vatool">
            <!--标题-->
            <el-row :gutter="10">
                <el-col :span="12" class="headerText">坡度坡向分析</el-col>
                <el-col :span="12"> </el-col>
            </el-row>


            <!--选择色阶起止颜色-->
            <el-row :gutter="10">
                <el-col :span="8">
                    <p class="parameters">平原区域颜色</p>
                </el-col>
                <el-col :span="16">
                    <el-color-picker v-model="startColor" @change="startColorPicker" show-alpha />
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <p class="parameters">垂直壁区域颜色</p>
                </el-col>
                <el-col :span="16">
                    <el-color-picker v-model="endColor" @change="endColorPicker" show-alpha  />
                </el-col>
            </el-row>

            <!--绘制与清空-->
            <el-row :gutter="10">
                <el-col :span="12">
                    <div class="grid-content ep-bg-purple" />
                    <el-button class="starClearBtn addBtn" link @click="analysisByNum">绘制区域-等分处理</el-button>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content ep-bg-purple" />
                    <el-button class="starClearBtn addBtn" link @click="analysisByDistance">绘制区域-等距处理</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <div class="grid-content ep-bg-purple" />
                    <el-button class="starClearBtn addBtn" link @click="clearAll">清空所有</el-button>
                </el-col>

            </el-row>

            <!-- 启用 / 隐藏坡度Tip -->
            <el-row :gutter="10">
                <el-col :span="16">
                    <el-switch v-model="showTip" active-text=" 启用 / 隐藏坡度坡向Tip ">
                    </el-switch>
                </el-col>
            </el-row>
        </div>
    </div>
        `,
            javascriptCode: `
            import * as uuid from "uuid";
import * as Speed from "@/cesiumSDK/index";
import * as Cesium from 'cesium';
import { ElMessage } from "element-plus";


let mapid = undefined;
let viewer = undefined;
let saObj;


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
            showTip: true,
            startColor: 'rgba(85,182,43,0.4)',
            endColor: 'rgba(255,32,43,0.4)',
            gradient: []
        };
    },
    watch: {
        showTip(bool) {
            ElMessage.success(bool ? '启用坡度坡向Tip' : '隐藏坡度坡向Tip');
            bool ? this.saObj.openTip() : this.saObj.closeTip()
        }
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

            this.viewer.camera.setView({
                destination: new Cesium.Cartesian3(
                    -1210490.5711433399,
                    5370444.243625174,
                    3216385.6230325554
                ),
                orientation: {
                    heading: 0.43782636467719804,
                    pitch: -0.9314452708778465,
                    roll: 6.281245881898588
                }
            })

            // 根据默认颜色生成默认色阶，第三个参数色阶个数固定为7，因为分析结果按坡度分为七个等级
            this.gradient = new Speed.GradientColors(this.startColor, this.endColor, 7)

            //初始化坡面坡度分析实例
            this.saObj = new Speed.SlopeAspect(this.viewer)

            this.saObj.openTip()
        },
        startColorPicker() {
            this.gradient = new Speed.GradientColors(this.startColor, this.endColor, 7)
        },
        endColorPicker() {
            this.gradient = new Speed.GradientColors(this.startColor, this.endColor, 7)
        },

        // 绘制坡度分析区域并生成分析结果
        // 不传参数使用默认等分横纵网格个数
        analysisByNum() {
            // 第二个参数色阶数组不传，也有默认色阶
            this.saObj.analysisByNum(20, this.gradient)
        },
        // 不传参数使用默认网格间距 单位千米
        analysisByDistance() {
            this.saObj.analysisByDistance(0.05, this.gradient)
        },

        // 清除绘制区域及分析结果
        clearAll() {
            this.saObj && this.saObj.clear();
        },
    },
};
        `,
        };
    },
};
</script>
  
<style scoped></style>
  