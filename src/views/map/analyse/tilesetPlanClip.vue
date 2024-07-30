<template>
    <mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>
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

.btnBox {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    gap: 10px;
    margin-bottom: 20px;
}

.directionBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    object-fit: contain;
    background: url("img/speed3d/img_d@2x.png") no-repeat;
    background-size: 100% 100%;
    font-size: 14px;
    font-family: Source Han Sans CN, Source Han Sans CN-Regular;
    font-weight: 400;
    color: #f0f0f0;
    cursor: pointer;
}

.activeColor {
    color: #0099ff;
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

::v-deep .el-radio__label {
    color: #ffffff;
}
      `,
            htmlCode: `
            <div :id="mapid" class="ktmap">
        <div class="vatool">
            <!--标题-->
            <el-row :gutter="10">
                <el-col :span="21" class="headerText"> 模型平面剖切</el-col>
            </el-row>

            <!--单面裁切-->
            <el-row :gutter="10">
                <el-col :span="24" class="headerText"> 单面</el-col>
            </el-row>

            <div class="btnBox">
                <template v-for=" (item, index) in directionBtns" :key="index">
                    <div class="directionBtn" @click="startSingleClip(item.direction, index)"
                        :class="activeIndex === index ? 'activeColor' : ''">
                        {{ item.name }}
                    </div>
                </template>
            </div>


            <el-row :gutter="10">
                <el-col :span="5">
                    <p class="parameters">裁剪距离</p>
                </el-col>
                <el-col :span="15">
                    <input type="range" class="slider" @input="rangeVal" :value="distance" :step="1" :min="-30" :max="30" />
                </el-col>
                <el-col :span="4">
                    <p class="parameters">{{ distance }}米</p>
                </el-col>
            </el-row>

            <!-- 多面裁切 -->
            <el-row :gutter="10">
                <el-col :span="24" class="headerText"> 多面</el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="11">
                    <el-radio-group v-model="modelType" @change="radioChange">
                        <el-radio label="0">外切</el-radio>
                        <el-radio label="1">内切</el-radio>
                    </el-radio-group>
                </el-col>

            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-button class="starClearBtn addBtn" link @click="startMultipleClip(modelType)">绘制多边形</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button class="starClearBtn cscBtn" link @click="clearClipPlan">清除</el-button>
                </el-col>
            </el-row>
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

export default {
    name: "3dtilesModel",
    data() {
        return {
            distance: 0,
            activeIndex: -1,

            directionBtns: [
                {
                    name: '北向南',
                    direction: 'N2S'
                },
                {
                    name: '南向北',
                    direction: 'S2N'
                },
                {
                    name: '东向西',
                    direction: 'E2W'
                },
                {
                    name: '西向东',
                    direction: 'W2E'
                },
                {
                    name: '上向下',
                    direction: 'U2D'
                },
                {
                    name: '下向上',
                    direction: 'D2U'
                }
            ],
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
            modelType: '0',    //裁切类型
            isClearActive: false,
            isDrawActive: false,
            clipTool: undefined,
        };
    },
    created() {
        this.mapid = uuid.v4();
    },
    mounted() {
        this.initMap()
    },
    methods: {
        initMap() {
            let option = {
                tiles3dModel: undefined,
                containID: this.mapid,
                flood: undefined,
                drawHandler: undefined,

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

            this.viewer._viewer.clock.shouldAnimate = true;

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

            // 创建剖切工具实例
            this.clipTool = new Speed.TilesetPlanClip(this.viewer, this.tiles3dModel)
        },

        // 单面裁切
        startSingleClip(direction, index) {
            this.activeIndex = index
            this.distance = 0
            this.clipTool.singleClip(direction)
        },
        // 多边形裁切
        startMultipleClip(modelType) {
            this.clipTool.drawClipPlan(modelType)
        },
        // 绘制完成后手动切换内外切
        radioChange() {
            this.clipTool.controlClipping(this.modelType)
        },
        // 调整剖切距离
        rangeVal() {
            this.distance = Number(event.srcElement.value);
            this.clipTool && this.clipTool.rangeDistance(this.distance);
        },
        // 清空裁切结果
        clearClipPlan() {
            this.distance = 0
            this.activeIndex = -1
            this.clipTool.clearGeologyClipPlan()
        }
    },
};
        `,
        };
    },
};
</script>
  
<style scoped></style>
  