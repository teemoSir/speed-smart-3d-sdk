<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>

</template>

<script>
import mapBox from '@/components/mapBox'
export default {
	name: "OSMBuildings",
	components: {
		mapBox
	},
	data(){
		return {
			cssCode:`.ktmap {
	width: 100%;
	height: 100%;
	background-color: #000;
	position: relative;
}


.buttonTool {
	position: absolute;
	z-index: 8;
	margin: 40px;
	width: 290px;
	height: 200px;
	background-color: rgb(6 34 62 / 80%);
	box-shadow: 0 4px 15px 1px #02213bb3;
	border: 1px solid #008aff70;

}

.modelTool {
	display: flex;
	align-items: center;
	margin-left: 15px;
	color: white;

}

.el-button {
	color: white;
	background: no-repeat;
	width: 120px;
	height: 32px;
	margin: 10px;
	border: none;
	/* background-image: url('img/speed3d/bt_sel.png'); */
}

::v-deep .el-table__inner-wrapper {
	margin-left: 25px;
	margin-right: 25px;
}

.property {
	position: absolute;
	z-index: 8;
	top: 15px;
	right: 15px;
	max-height: 700px;
	transition: all 1s;
	transform: translateX(110%);
}

.property[showProperty="true"] {
	transform: translateX(0);
	opacity: 1;
}

::v-deep .el-table,
.el-table__expanded-cell {
	background: transparent;
}

::v-deep .el-table__body {
	-webkit-border-vertical-spacing: 13px;
	background: transparent;

}

/* 每行（表头除外） */
::v-deep .el-table tr {
	background: rgb(50 79 103 / 50%);
}

/* 表头 */
::v-deep .el-table__header th {
	background: rgb(50 79 103 / 60%);
	color: #0099FF;
	font-size: 18px;
	font-weight: bold;
}

::v-deep .el-table .el-table__body-wrapper {
	background: #3a536200;
	color: white;
}

/* 鼠标经过单元格背景色透明 */
::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td {
	background-color: transparent;
}`,
			htmlCode:`<div :id="mapid" class="ktmap">
		<div class="buttonTool">
			<el-form>
				<el-Button @click="colorByMaterial" style="background-image: url('img/speed3d/bt_sel.png');"
					title="按建筑物材质属性渲染样式">样式1</el-Button>
				<el-Button @click="setStyle2" style="background-image: url('img/speed3d/bt_sel.png');"
					title="高亮住宅楼">样式2</el-Button>
				<el-Button @click="setStyle3('office')" style="background-image: url('img/speed3d/bt_sel.png');"
					title="按属性显示建筑物（只显示办公楼）">样式3</el-Button>
				<el-Button @click="setStyle4()" style="background-image: url('img/speed3d/bt_sel.png');"
					title="根据建筑物与选定中心位置的距离为建筑物着色。\r单击建筑物以选择中心位置。">样式4</el-Button>
				<el-Button @click="setStyle5()" style="background-image: url('img/speed3d/bt_sel.png');"
					title="夜景贴图">样式5</el-Button>
				<el-Button @click="setDefaultStyle()"
					style="background-image: url('img/speed3d/bt_sel.png');">默认样式</el-Button>
				<div class="modelTool">
					<p>单击高亮构件</p>
					<el-switch v-model="highlightEnable" @change="highlightChangeEvent()" />
					&nbsp;&nbsp;&nbsp;&nbsp;
					<p>显示构件属性</p>
					<el-switch v-model="propertyEnable" @change="propertyChange()" />
				</div>
			</el-form>
		</div>
		<speeddialog class="property" :showProperty="showProperty">
			<div>
				<el-table :data="property" max-height="650">
					<el-table-column prop="key" label="属性名称" />
					<el-table-column prop="value" label="属性值" />
				</el-table>
			</div>
		</speeddialog>
	</div>`,
			javascriptCode:`import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import * as Cesium from "cesium"
import { ElMessage } from 'element-plus'
import { zepto } from "@/cesiumSDK/core/util/zepto";


export default {
	name: "OSMBuildings",
	data() {
		return {
			property: [],
			showProperty: false,
			highlightEnable: false,
			propertyEnable: false
		}
	},
	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap()
		//加載模型
		this.loadOsmBuilding()
		this.handler = new Cesium.ScreenSpaceEventHandler(this.map._viewer.scene.canvas);

	},
	methods: {

		initMap() {
			let data = {
				containID: this.mapid,
				center: { lat: 31.2322, lng: 121.44363, alt: 1989, heading: 87, pitch: -25, duration: 0 },
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
						show: true
					}
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
							{ name: "注记", layer: "img_z" }
						],
						show: true
					},
					{
						id: 201,
						name: "天地图影像(EPSG:3857)",
						icon: "img/basemaps/tdt_img.png",
						tooltip: "天地图影像地图服务",
						type: "tdt",
						layers: [
							{ name: "底图", layer: "img_d" },
							{ name: "注记", layer: "img_z" }
						],
					},
					{
						id: 202,
						name: "天地图影像(EPSG:4326)",
						icon: "img/basemaps/tdt_img.png",
						tooltip: "天地图影像地图服务",
						type: "tdt",
						crs: "EPSG:4326",
						layers: [
							{ name: "底图", layer: "img_d" },
							{ name: "注记", layer: "img_z" }
						],
					},
					{
						id: 301,
						type: "xyz",
						name: "江苏影像",
						icon: "img/basemaps/tdt_img.png",
						tooltip: "江苏影像服务",
						url: "http://172.16.40.18:8088/{z}/{x}/{reverseY}.jpg",
					},

				],
				baseLayerPicker: true, //底图切换
				homeButton: true, //回到默认视域
				sceneModePicker: true, //是否显示投影方式控件
				fullscreenButton: true, //全屏按钮
				zoom: true, //缩放按钮
				navigationControl:{
					compass: {
						show: true,
						style: { bottom: "270px", left: "1px" }
					}
				},//导航球、比例尺
				statusBar:true,//状态栏
				toolBar:{
					style: { bottom: "5%", left: "25px" }
				},//基础工具
			};
			this.speedMap = new Speed.SpeedViewer()
			this.map = this.speedMap.init(data);
		},
		loadOsmBuilding() {
			let that = this
			this.tilesetLayer = new Speed.OsmBuildingsLayer()
			let tileset = this.tilesetLayer.loadOsmBuildingLayer();
			this.tiles3dModel = tileset._osmBuildingsLayer
			this.speedMap.addLayer(this.tiles3dModel)

		},
		colorByMaterial() {
			this.removeLeftClick()
			this.tiles3dModel.customShader = undefined
			this.tiles3dModel.style = new Cesium.Cesium3DTileStyle({
				defines: {
					material: "`+"${feature['building:material']}"+`",
				},
				color: {
					conditions: [
						["`+"${material}"+` === null", "color('white')"],
						["`+"${material}"+` === 'glass'", "color('skyblue', 0.5)"],
						["`+"${material}"+` === 'concrete'", "color('grey')"],
						["`+"${material}"+` === 'brick'", "color('indianred')"],
						["`+"${material}"+` === 'stone'", "color('lightslategrey')"],
						["`+"${material}"+` === 'metal'", "color('lightgrey')"],
						["`+"${material}"+` === 'steel'", "color('lightsteelblue')"],
						["true", "color('white')"],
					],
				},
			});
		},
		setStyle2() {
			this.removeLeftClick()
			this.tiles3dModel.customShader = undefined
			this.tiles3dModel.style = new Cesium.Cesium3DTileStyle({
				color: {
					conditions: [
						[
							"`+"${feature['building']}"+` === 'apartments' || `+"${feature['building']}"+` === 'residential'",
							"color('cyan', 0.9)",
						],
						[true, "color('white')"],
					],
				},
			});
		},
		setStyle3(buildingType) {
			this.removeLeftClick()
			this.tiles3dModel.customShader = undefined
			switch (buildingType) {
				case "office":
					this.tiles3dModel.style = new Cesium.Cesium3DTileStyle({
						show: "`+"${feature['building']}"+` === 'office'",
					});
					break;
				case "apartments":
					this.tiles3dModel.style = new Cesium.Cesium3DTileStyle({
						show: "`+"${feature['building']}"+` === 'apartments'",
					});
					break;
				default:
					break;
			}
		},
		setStyle4() {
			let that = this
			this.tiles3dModel.customShader = undefined
			// ElMessage({
			// 	message: '单击建筑物以选择中心位置。',
			// })
			// let message = zepto(".el-message");
			// message.css({
			// 	border: "none",
			// 	backgroundColor: "rgb(16 45 73 / 80%)",
			// })
			// let content = zepto(".el-message__content");
			// content.css({
			// 	color: "#ffffff",
			// })
			// let icon = zepto(".el-icon");
			// icon.css({
			// 	color: "#ffffff",
			// })

			this.colorByDistanceToCoordinate(31.24194, 121.49517);
			this.handler.setInputAction(function (movement) {
				that.map._viewer.selectedEntity = undefined;
				const pickedBuilding = that.map._viewer.scene.pick(movement.position);
				if (pickedBuilding) {
					const pickedLatitude = pickedBuilding.getProperty(
						"cesium#latitude"
					);
					const pickedLongitude = pickedBuilding.getProperty(
						"cesium#longitude"
					);
					that.colorByDistanceToCoordinate(pickedLatitude, pickedLongitude);
				}
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		},
		setStyle5() {
			this.removeLeftClick()
			this.tiles3dModel.style = undefined

			this.tiles3dModel.customShader = new Cesium.CustomShader({
				lightingModel: Cesium.LightingModel.UNLIT,
				varyings: {
					v_speed3d_normalMC: Cesium.VaryingType.VEC3
				},
				uniforms: {
					u_speed3d_texture: {
						value: new Cesium.TextureUniform({
							url: "/img/textures/buildings.png"
						}),
						type: Cesium.UniformType.SAMPLER_2D
					}
				},
				vertexShaderText: /* glsl */ \`
				void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput){
					v_speed3d_normalMC = vsInput.attributes.normalMC;
				}\`,
				fragmentShaderText: /* glsl */ \`
				void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
				vec3 positionMC = fsInput.attributes.positionMC;
				if (dot(vec3(0.0, 0.0, 1.0), v_speed3d_normalMC) > 0.95) {
					//处理楼顶:统一处理成深色。
					material.diffuse = vec3(0.079, 0.107, 0.111);
				} else {
					//处理四个侧面: 贴一样的图
					float speed3d_width = 100.0;
					float speed3d_height = 100.0;
					float speed3d_textureX = 0.0;
					float speed3d_dotXAxis = dot(vec3(0.0, 1.0, 0.0), v_speed3d_normalMC);
					if (speed3d_dotXAxis > 0.52 || speed3d_dotXAxis < -0.52) {
					speed3d_textureX = mod(positionMC.x, speed3d_width) / speed3d_width;
					} else {
					speed3d_textureX = mod(positionMC.y, speed3d_width) / speed3d_width;
					}
					float speed3d_textureY = mod(positionMC.z, speed3d_height) / speed3d_height;
					material.diffuse = texture2D(u_speed3d_texture, vec2(speed3d_textureX, speed3d_textureY)).rgb;
				}
				}\`
			})
		},
		setDefaultStyle() {
			this.removeLeftClick()
			this.tiles3dModel.customShader = undefined
			this.tiles3dModel.style = undefined
		},
		colorByDistanceToCoordinate(pickedLatitude, pickedLongitude) {
			this.tiles3dModel.style = new Cesium.Cesium3DTileStyle({
				defines: {
					distance: \`distance(vec2(\\\${feature['cesium#longitude']}, \\\${feature['cesium#latitude']}), vec2(`+"${pickedLongitude}"+`,`+"${pickedLatitude}"+`))\`,
				},
				color: {
					conditions: [
						["`+"${distance}"+` > 0.014", "color('blue')"],
						["`+"${distance}"+` > 0.010", "color('green')"],
						["`+"${distance}"+` > 0.006", "color('yellow')"],
						["`+"${distance}"+` > 0.0001", "color('red')"],
						["true", "color('white')"],
					],
				},
			});
		},
		removeLeftClick() {
			this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
		},
		highlightChangeEvent() {
			if (this.highlightEnable) {
				this.highlight = new Speed.highlightFeature({
					speedViewer: this.map._viewer,
					color: Cesium.Color.GREENYELLOW,
					length: 0.01
				})
			} else {
				this.highlight.destroy()
			}

		},
		propertyChange() {
			let that = this
			if (this.propertyEnable) {
				this.feaProperty = new Speed.featureProperty({
					viewer: this.map._viewer,
					success: function (data) {
						that.property = data
						that.showProperty = true
					}
				})

			} else {
				this.feaProperty.destroy()
				that.showProperty = false
				that.property = []
			}
		},

	},

}`
		}
	}

}
</script>

<style scoped>

</style>
