<template>
    <div id="appearanceLeft">
        <div class="tilt">
            <input class="communitySel" type="button">
            &nbsp;
            <p>南京市</p>
            <div class="father">
                <!-- <div class="children">
                    <input type="button" :class="{ communitySel: communityGL, communitySel1: !communityGL }">
                    &nbsp;
                    <div @click="addGL">
                        <p style="cursor: pointer;">谷里</p>
                    </div>
                </div> -->
                <div class="children">
                    <input type="button" :class="{ communitySel: communityXG, communitySel1: !communityXG }">
                    &nbsp;
                    <div @click="addXG">
                        <p style="cursor: pointer;">香港九龙</p>
                    </div>
                </div>
                <div class="children">
                    <input type="button" :class="{ communitySel: communityJXZ, communitySel1: !communityJXZ }">
                    &nbsp;
                    <div @click="addJXZ">
                        <p style="cursor: pointer;">江心洲</p>
                    </div>
                    <p style="margin-left: 35%;">(分层分户)</p>
                    <el-switch v-model="tiltOpen" style="margin-left: 0%;" :disabled=fcfhOpen size="small" />
                </div>
            </div>
        </div>
        <div class="BIM">
            <div>
                <button v-for="(val, index) in BIM" @click="bimSelect(index, val)"
                    :class="{ bimButton: bimClick[index] != index, bimButton1: bimClick[index] == index }">{{ val }}
                </button>
            </div>
        </div>
        <div class="whiteM">
            <el-radio-group v-model="radio" class="myRadio">
                <el-radio :label="3">默认</el-radio>
                <el-radio :label="6">渐变色</el-radio>
                <el-radio :label="9">夜视</el-radio>
            </el-radio-group>
            <button @click="whiteSelect(index, val)" :class="{ bimButton: !whiteClick, bimButton1: whiteClick }">南京建筑物
            </button>
        </div>
        <div class="pointCloud">
            <button @click="showZJS" :class="{ ZJS: !zjsClick, ZJS1: zjsClick }"></button>
        </div>
    </div>
    <div id="timeLine"></div>
    <div id="icon">
        <div @click="addMap" :class="{ map1: mpaClick, map: !mpaClick }"></div>

        <div @click="zoomIn" class="zoomIn"></div>

        <div @click="zoomOut" class="zoomOut"></div>

        <div @click="sunShow" :class="{ sunShow1: sunClick, sunShow: !sunClick }"></div>

        <div @click="roller" :class="{ roller1: rollerClick, roller: !rollerClick }"></div>

        <div @click="split" :class="{ split1: splitClick, split: !splitClick }"></div>
    </div>
    <rollerMap v-if="rollerClick"></rollerMap>
    <splitMap v-if="splitClick"></splitMap>
    <div class="aa"></div>
    <div class="bb"></div>
    <div class="cc"></div>
    <div class="dd"></div>
    <div class="ee"></div>
    <div class="ff"></div>
</template>
<script>
import { inject } from 'vue';
import * as Cesium from "cesium"
import * as Speed from "@/cesiumSDK/index";
import splitMap from '@/views/speed/NanJingCIM/NJGM/splitMap.vue';
import rollerMap from '@/views/speed/NanJingCIM/NJGM/rollerMap.vue';
import ModelInfo from '@/utils/modelInfo';
import terrainModelClick from "@/cesiumSDK/core/event/terrainModelClickEvent/terrainModelClick";
let terrainProvider;
let bimClickSum = [0, 0, 0, 0];
let bimClickKey = [0, 1, 2, 3];
let jxzTileset;
let DTHLayer = new Cesium.PrimitiveCollection()
export default ({
    name: 'appearance',
    components: { rollerMap, splitMap },
    props: {},
    data() {
        return {
            tiltOpen: false,
            fcfhOpen: true,
            mpaClick: false,
            sunClick: false,
            rollerClick: false,
            splitClick: false,
            communityJXZ: false,
            communityGL: false,
            communityXG: false,
            BIM: ['设计总院',  '官厅水库', '中丹化工'],
            bimClick: [5, 5, 5, 5],
            radio: 3,
            whiteClick: false,
            zjsClick: false,
        }
    },
    mounted() {
        this.map = inject("map");
        this.speedMap = inject("speedMap");
        this.sun = new Speed.SunShadows(this.map);
        this.myTiles = new Speed.TilesetLayer();
        // 初始化数据
        this.mapData();
        // 加载倾斜单体化数据
        this.loadModel();
        // this.tmClick = new terrainModelClick(this.map);
        // this.tmClick.click(terrainModelClick.EventType.LEFT_CLICK, (p) => { console.log([p.x, p.y, p.z]) });
    },
    methods: {
        mapData() {
            // 南京谷里倾斜数据
            this.glTileset = this.myTiles.loadQXTilesetLayer({
                url: ModelInfo.NANJINGGULI,
                alt: 0,
                show: false,
            })._tileset;
            this.speedMap.addLayer(this.glTileset);
            this.xgTileset = this.myTiles.loadQXTilesetLayer({
                url: ModelInfo.JIULONG,
                alt: 0,
                show: false,
            })._tileset;
            this.speedMap.addLayer(this.xgTileset);
            // BIM数据
            this.sjzyTileset = new Speed.TilesetLayer().loadBIMTilesetLayer({
                url: ModelInfo.SHEJIZONGYUAN,
                lat: 40.3904398326,
                lng: 115.6025572426,
                alt: 0,
                show: false,
            })._tileset;
            this.speedMap.addLayer(this.sjzyTileset);
            this.stskTileset = new Speed.TilesetLayer().loadBIMTilesetLayer({
                url: ModelInfo.GUANTINGSHUIKU,
                lat: 40.2305698326,
                lng: 115.6025572526,
                alt: 10,
                show: false,
            })._tileset;
            this.speedMap.addLayer(this.stskTileset);
            this.zdhgTileset = new Speed.TilesetLayer().loadBIMTilesetLayer({
                url: ModelInfo.ZHONGDANHUAGONG,
                lng: 119.933944,//经度
				lat: 32.137604,//纬度
				alt: 1,//高度
				rotationZ: -0.33,
				rotationX: 0.0,
				rotationY: 0.0,
                show: false,
            })._tileset;
            this.speedMap.addLayer(this.zdhgTileset);
            this.dxgxTileset = new Speed.TilesetLayer().loadBIMTilesetLayer({
                url: ModelInfo.DIXIAGUANXIAN,
                maximumScreenSpaceError: 16,
                lat: 31.844015,
                lng: 117.251229,
                alt: 38,
                show: false,
            })._tileset;
            this.speedMap.addLayer(this.dxgxTileset);
            // 白膜数据
            this.buildTileset = this.myTiles.loadTilesetLayer({
                url: ModelInfo.NANJING,
                show: false,
            })._tileset;
            this.speedMap.addLayer(this.buildTileset);
            // 点云数据
            this.dyTileset = this.myTiles.loadTilesetLayer({
                url: ModelInfo.DIANYUN,
                show: false,
            })._tileset;
            this.dyTileset.style = new Cesium.Cesium3DTileStyle({
                color: {
                    conditions: [
                        ['true', "color('#FFFF00', 0.5)"]
                    ]
                }
            });
            this.speedMap.addLayer(this.dyTileset);
        },
        loadModel() {
            jxzTileset = this.myTiles.loadQXTilesetLayer({
                url: ModelInfo.JIANGXINZHOU,
                alt: 9,
                show: false,
            })._tileset;
            this.speedMap.addLayer(jxzTileset);
            let that = this
            jxzTileset.readyPromise.then(function (tilesModel) {
                if (tilesModel.orginCenter) {
                    that.modelHeight = tilesModel.orginCenter.z
                    that.addDTH()
                }
            })
        },
        addDTH() {
            this.graphicLayer = new Speed.GeoJsonLayer(this.map)
            this.dthGracphics = this.graphicLayer.createDTHGraphics({
                name: "水韵华庭单体化",
                url: 'jxz.json',
                modelHeight: this.modelHeight,//模型高度
                buildings: {
                    buttomheight: "minHeight",//楼层底部高度，可填数字（默认:0）或属性字段名称（如:"bottomHeight"）
                    height: "maxHeight",// 楼层顶点高度，可填层高数值（默认3.5）或属性字段名称（如:"height"）
                    // floor:"floor"//楼层数，可填数值（默认1）或属性字段名称。如果输入floor,则默认楼高为height*floor
                },
                symbol: {
                    // color: "rgba(255, 255, 255, 0.1)",
                    // 鼠标单击后高亮的样式
                    highlight: {
                        type: "LEFT_CLICK",
                        color: "rgba(255,255,0,0.4)"
                    }
                },
            });
            this.dthGracphics.show = false;
            DTHLayer.add(this.dthGracphics);
            this.speedMap.addLayer(DTHLayer);
        },
        addJXZ() {
            this.communityJXZ = !this.communityJXZ;
            if (this.communityJXZ) {
                this.speedMap.flyto(jxzTileset);
                jxzTileset.show = true;
                this.fcfhOpen = false;
            } else {
                this.fcfhOpen = true;
                jxzTileset.show = false;
                this.tiltOpen = false;
            }
        },
        // 添加南京谷里数据
        addGL() {
            this.communityGL = !this.communityGL;
            if (this.communityGL) {
                this.speedMap.flyto(this.glTileset);
                this.glTileset.show = true;
            } else {
                this.glTileset.show = false;
            }
        },
        // 添加南京谷里数据
        addXG() {
            this.communityXG = !this.communityXG;
            if (this.communityXG) {
                this.speedMap.flyto(this.xgTileset);
                this.xgTileset.show = true;
            } else {
                this.xgTileset.show = false;
            }
        },
        // 添加BIM数据
        bimSelect(key, name) {
            this.bimClick[key] = key;
            if (bimClickKey[key] == key) {
                // 统计点击次数
                bimClickSum[key]++;
            }
            // 第一次点击
            if (bimClickSum[key] == 1) {
                switch (name) {
                    case this.BIM[0]:
                        this.sjzyTileset.show = true;
                        this.speedMap.flyto(this.sjzyTileset);
                        break;
                    // case this.BIM[1]:
                    //     this.dxgxTileset.show = true;
                    //     this.speedMap.flyto(this.dxgxTileset);
                    //     break;
                    case this.BIM[1]:
                        this.stskTileset.show = true;
                        this.speedMap.flyto(this.stskTileset);
                        break;
                    case this.BIM[2]:
                        this.zdhgTileset.show = true;
                        this.speedMap.flyto(this.zdhgTileset);
                        break;
                }
            } else if (bimClickSum[key] == 2) {
                // 第二次点击后重新统计点击次数
                bimClickSum[key] = 0;
                this.bimClick[key] = 5;
                switch (name) {
                    case this.BIM[0]:
                        this.sjzyTileset.show = false;
                        break;
                    // case this.BIM[1]:
                    //     this.dxgxTileset.show = false;
                    //     break;
                    case this.BIM[1]:
                        this.stskTileset.show = false;
                        break;
                    case this.BIM[2]:
                        this.zdhgTileset.show = false;
                        break;
                }
            }
        },
        // 添加白膜数据
        whiteSelect() {
            this.whiteClick = !this.whiteClick;
            if (this.whiteClick) {
                this.speedMap.flyto(this.buildTileset);
                this.buildTileset.show = true;
            } else {
                this.buildTileset.show = false;
            }
        },
        // 添加点云数据
        showZJS() {
            this.zjsClick = !this.zjsClick;
            if (this.zjsClick) {
                this.speedMap.flyto(this.dyTileset);
                this.dyTileset.show = true;
            } else {
                this.dyTileset.show = false;
            }
        },
        // 添加地形
        addMap() {
            this.mpaClick = !this.mpaClick;
            if (this.mpaClick) {
                terrainProvider = new Cesium.CesiumTerrainProvider({
                    url: Cesium.IonResource.fromAssetId(1),
                    requestWaterMask: false, // 请求水体效果所需要的海岸线数据
                    requestVertexNormals: false, // 请求地形照明数据
                });
                this.map.terrainProvider = terrainProvider;
                this.map.scene.globe.enableLighting = false; // 对大气和雾启用动态照明效果
            } else {
                this.map.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
                terrainProvider = null;
            }
        },
        // 放大地图
        zoomIn() {
            this.map.camera.moveForward(this.map.camera.positionCartographic.height / 10);
        },
        // 缩小地图
        zoomOut() {
            this.map.camera.moveBackward(this.map.camera.positionCartographic.height / 10);
        },
        // 添加日照
        sunShow() {
            this.sunClick = !this.sunClick;
            if (this.sunClick) {
                this.sun.startShadows();
            } else {
                this.sun.clearOpenLight();
            }
        },
        // 添加卷帘
        roller() {
            this.rollerClick = !this.rollerClick;
            this.splitClick = false;
            if (this.rollerClick) {
            } else {

            }
        },
        // 添加分屏
        split() {
            this.splitClick = !this.splitClick;
            this.rollerClick = false;
            if (this.splitClick) {

            } else {

            }
        },
    },
    watch: {
        radio(newVal) {
            switch (newVal) {
                case 3:
                    this.buildTileset.customShader = undefined;
                    this.buildTileset.style = undefined;
                    break;
                case 6:
                    this.buildTileset.style = undefined
                    this.buildTileset.customShader = new Cesium.CustomShader({
                        lightingModel: Cesium.LightingModel.UNLIT,
                        fragmentShaderText: `
				void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
				{
					vec4 position = czm_inverseModelView * vec4(fsInput.attributes.positionEC,1); // 位置

					// 注意shader中写浮点数是，一定要带小数点，否则会报错，比如0需要写成0.0，1要写成1.0
					float _baseHeight = 520.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度
					float _heightRange =80.0; // 高亮的范围(_baseHeight ~ _baseHeight + _heightRange)
					float _glowRange = 700.0; // 光环的移动范围(高度)
                    // 建筑基础色
                    float speed_height = position.y - _baseHeight;
                    float speed_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
                    float speed_a12 = speed_height / _heightRange + sin(speed_a11) * 0.1;
                    material.diffuse = vec3(0.2, 0.1, 1.0); // 颜色
                    material.diffuse *= vec3(speed_a12);// 渐变


					// 动态光环
					float time = fract(czm_frameNumber / 360.0);
					time = abs(time - 0.5) * 2.0;
                    float speed_h = clamp(speed_height / _glowRange, 0.0, 1.0);
                    float speed_diff = step(0.005, abs(speed_h - time));
                    material.diffuse += material.diffuse * (1.0 - speed_diff);

				} `
                    })
                    break;
                case 9:
                    this.buildTileset.style = undefined
                    this.buildTileset.customShader = new Cesium.CustomShader({
                        lightingModel: Cesium.LightingModel.UNLIT,
                        varyings: {
                            v_speed3d3d_normalMC: Cesium.VaryingType.VEC3
                        },
                        uniforms: {
                            u_speed3d3d_texture: {
                                value: new Cesium.TextureUniform({
                                    url: "/img/textures/buildings.png"
                                }),
                                type: Cesium.UniformType.SAMPLER_2D
                            }
                        },
                        vertexShaderText: `
				void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput){
					v_speed3d3d_normalMC = vsInput.attributes.normalMC;
				}`,
                        fragmentShaderText: `
                        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
					vec3 positionMC = fsInput.attributes.positionMC;
					if (dot(vec3(0.0, 1.0, 0.0), v_speed3d3d_normalMC) > 0.75) {
						//处理楼顶:统一处理成深色。
						material.diffuse = vec3(0.079, 0.107, 0.111);
					} else {
						//处理四个侧面: 贴一样的图
						float speed3d3d_width = 50.0;
						float speed3d3d_height = 50.0;
						float speed3d3d_textureX = 0.0;
						float speed3d3d_dotXAxis = dot(vec3(0.0, 1.0, 0.0), v_speed3d3d_normalMC);
						if (speed3d3d_dotXAxis > 0.92 || speed3d3d_dotXAxis < -0.92) {
						speed3d3d_textureX = mod(positionMC.x, speed3d3d_width) / speed3d3d_width;
						} else {
						speed3d3d_textureX = mod(positionMC.y, speed3d3d_width) / speed3d3d_width;
						}
						float speed3d3d_textureY = mod(positionMC.z, speed3d3d_height) / speed3d3d_height;
						material.diffuse = texture2D(u_speed3d3d_texture, vec2(speed3d3d_textureX, speed3d3d_textureY)).rgb;
					}
				}`
                    })
                    break;
            }
        },
        tiltOpen(newVal) {
            if (newVal) {
                this.map.camera.flyTo({
                    // fromDegrees()方法，将经纬度和高程转换为世界坐标
                    destination: Cesium.Cartesian3.fromDegrees(118.692304, 32.001743, 130), //设置位置
                    orientation: {
                        // 方向
                        heading: Cesium.Math.toRadians(40),
                        // 视角、倾斜角度
                        pitch: Cesium.Math.toRadians(-45),
                        roll: 0.0
                    }
                })
                // this.speedMap.flyto(this.dthGracphics) ;
                this.dthGracphics.show = true;
            }
            else { this.dthGracphics.show = false; }
        }
    }
})
</script>
<style scoped>
@import './appearance.css';
</style>
