<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>

</template>

<script>
import mapBox from '@/components/mapBox'
export default {
	name: "Buildings",
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
	height: 150px;
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
				<el-Button @click="setStyle1" style="background-image: url('img/speed3d/bt_sel.png');"
					title="动态渐变+动态光环">自定义特效1</el-Button>
				<el-Button @click="setStyle2" style="background-image: url('img/speed3d/bt_sel.png');"
					title="根据视角距离，模型呈现不同颜色">自定义特效2</el-Button>
				<el-Button @click="setStyle3('office')" style="background-image: url('img/speed3d/bt_sel.png');"
					title="夜景贴图">自定义特效3</el-Button>
				<el-Button @click="setDefaultStyle()"
					style="background-image: url('img/speed3d/bt_sel.png');">原始样式</el-Button>
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
import  ModelInfo from '@/utils/modelInfo'


export default {
	name: "Buildings",
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
		//底图调暗
		// Speed.baseMapLayer.modifyMap(this.map._viewer, {
		// 	//反色
		// 	invertColor: true,
		// 	//滤色值
		// 	filterRGB: [60, 145, 172]
		// })

		//加載模型
		this.loadBuilding()

	},
	methods: {
		initMap() {
			let data = {
				containID: this.mapid,
				// center: { lat: 32.019921, lng: 118.778803, alt: 1000, heading: 0, pitch: -25, duration: 0 },
				center: { lat: 31.267519, lng: 121.42728, alt: 1500, heading: 118, pitch: -27, duration: 0	 },
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
					},
					{
						id: 201,
						name: "天地图电子",
						icon: "img/basemaps/tdt_vec.png",
						tooltip: "天地图电子地图服务",
						type: "tdt",
						layers: [
							{ name: "底图", layer: "vec_d" },
							{ name: "注记", layer: "vec_z" }
						],
					},
					{
						id: 202,
						name: "天地图影像",
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
					{
						id: 402,
						name: "高德矢量",
						icon: "img/basemaps/gaode_vec.png",
						type: "gaode",
						tooltip: "高德矢量 地图服务",
						layer: "vec",
						crs: "WGS84",
					},
					{
						id: 701,
						name: "ArcGIS蓝色地图",
						icon: "img/basemaps/bd-c-midnight.png",
						type: "arcgis",
						tooltip: "ArcGIS地图服务",
						layer: "ChinaOnlineStreetPurplishBlue",
						crs: "WGS84",
						show: true
					},
				],
				baseLayerPicker: true, //底图切换
				homeButton: true, //回到默认视域
				sceneModePicker: true, //是否显示投影方式控件
				fullscreenButton: true, //全屏按钮
				zoom: true, //缩放按钮
				navigationControl: {
					compass: {
						show: true,
						style: { bottom: "270px", left: "1px" }
					},
					legend: {
						show: false,
						style: { left: "5px", bottom: "1px" }
					}
				},//导航球、比例尺
				statusBar: true,//状态栏
				toolBar: {
					style: { bottom: "5%", left: "25px" }
				},//基础工具
			};
			this.speedMap = new Speed.SpeedViewer()
			this.map = this.speedMap.init(data);
		},
		loadBuilding() {
			this.tilesetLayer = new Speed.TilesetLayer()
			let tileset = this.tilesetLayer.loadTilesetLayer({
				url: "//data.mars3d.cn/3dtiles/jzw-shanghai/tileset.json",
				style: {
					color: {
						conditions: [
							["`+"${floor}"+` >= 300", "rgba(45, 0, 75, 0.5)"],
							["`+"${floor}"+` >= 200", "rgb(102, 71, 151)"],
							["`+"${floor}"+` >= 100", "rgb(170, 162, 204)"],
							["`+"${floor}"+` >= 50", "rgb(224, 226, 238)"],
							["`+"${floor}"+` >= 30", "rgb(252, 230, 200)"],
							["`+"${floor}"+` >= 20", "rgb(248, 176, 87)"],
							["`+"${floor}"+` >= 10", "rgb(198, 106, 11)"],
							["true", "rgb(127, 59, 8)"],
						],
					},
				}
			});
			// let tileset = this.tilesetLayer.loadTilesetLayer({
			// 	url: ModelInfo.XINTAI,
			// 	style: {
			// 		color: {
			// 			conditions: [
			// 				["`+"${JZGD}"+` >= 300", "rgba(45, 0, 75, 0.5)"],
			// 				["`+"${JZGD}"+` >= 200", "rgb(102, 71, 151)"],
			// 				["`+"${JZGD}"+` >= 100", "rgb(170, 162, 204)"],
			// 				["`+"${JZGD}"+` >= 50", "rgb(224, 226, 238)"],
			// 				["`+"${JZGD}"+` >= 30", "rgb(252, 230, 200)"],
			// 				["`+"${JZGD}"+` >= 20", "rgb(248, 176, 87)"],
			// 				["`+"${JZGD}"+` >= 10", "rgb(198, 106, 11)"],
			// 				["true", "rgb(127, 59, 8)"],
			// 			],
			// 		},
			// 	}
			// });
			// let tileset = this.tilesetLayer.loadTilesetLayer({
			// 	url: ModelInfo.NANJING,
			// 	style: {
			// 		color: {
			// 			conditions: [
			// 				["`+"${Elevation}"+` >= 300", "rgba(45, 0, 75, 0.5)"],
			// 				["`+"${Elevation}"+` >= 200", "rgb(102, 71, 151)"],
			// 				["`+"${Elevation}"+` >= 100", "rgb(170, 162, 204)"],
			// 				["`+"${Elevation}"+` >= 50", "rgb(224, 226, 238)"],
			// 				["`+"${Elevation}"+` >= 30", "rgb(252, 230, 200)"],
			// 				["`+"${Elevation}"+` >= 20", "rgb(248, 176, 87)"],
			// 				["`+"${Elevation}"+` >= 10", "rgb(198, 106, 11)"],
			// 				["true", "rgb(127, 59, 8)"],
			// 			],
			// 		},
			// 	}
			// });
			this.tiles3dModel = tileset._tileset
			this.speedMap.addLayer(this.tiles3dModel)


		},
		setStyle1() {
			this.tiles3dModel.style = undefined
			this.tiles3dModel.customShader = new Cesium.CustomShader({
				lightingModel: Cesium.LightingModel.UNLIT,
				fragmentShaderText: \`
				void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
				{
					vec4 position = czm_inverseModelView * vec4(fsInput.attributes.positionEC,1); // 位置

					// 注意shader中写浮点数是，一定要带小数点，否则会报错，比如0需要写成0.0，1要写成1.0
					//上海市
					float _baseHeight = 0.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度
					float _heightRange = 60.0; // 高亮的范围
					float _glowRange = 400.0; // 光环的移动范围(高度)
					//新泰市
					// float _baseHeight = 200.0;
					// float _heightRange = 60.0;
					// float _glowRange = 200.0;
					//南京市
					// float _baseHeight = 520.0;
					// float _heightRange =80.0;
					// float _glowRange = 700.0;

					// 建筑基础色
					float speed_height = position.z  - _baseHeight;//上海市
					// float speed_height = position.y  - _baseHeight;//新泰市、南京市

					float speed3d_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
					float speed3d_a12 = speed_height / _heightRange + sin(speed3d_a11) * 0.1;
					material.diffuse = vec3(0.2, 0.1, 1.0); // 颜色
					material.diffuse *= vec3(speed3d_a12);// 渐变


					// 动态光环
					float time = fract(czm_frameNumber / 360.0);
					time = abs(time - 0.5) * 2.0;
					float speed3d_h = clamp(speed_height / _glowRange, 0.0, 1.0);
					float speed3d_diff = step(0.005, abs(speed3d_h - time));
					material.diffuse += material.diffuse * (1.0 - speed3d_diff);

				} \`
			})
		},
		setStyle2() {
			this.tiles3dModel.style = undefined
			this.tiles3dModel.customShader = new Cesium.CustomShader({
				lightingModel: Cesium.LightingModel.UNLIT,
				fragmentShaderText: \`
				void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
				{
					material.diffuse = vec3(0.0, 0.0, 1.0);
					material.diffuse.g = -fsInput.attributes.positionEC.z / 1.0e4;
				} \`
			})
		},
		setStyle3() {
			this.tiles3dModel.style = undefined

			this.tiles3dModel.customShader = new Cesium.CustomShader({
				lightingModel: Cesium.LightingModel.UNLIT,
				varyings: {
					v_speed3d3d_normalMC: Cesium.VaryingType.VEC3
				},
				uniforms: {
					u_speed3d3d_texture: {
						value: new Cesium.TextureUniform({
							url: "/img/textures/building.png"
						}),
						type: Cesium.UniformType.SAMPLER_2D
					}
				},
				vertexShaderText: \`
				void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput){
					v_speed3d3d_normalMC = vsInput.attributes.normalMC;
				}\`,
				fragmentShaderText: \`
				void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
					vec3 positionMC = fsInput.attributes.positionMC;
					if (dot(vec3(0.0, 0.0, 1.0), v_speed3d3d_normalMC) > 0.95) {
						//处理楼顶:统一处理成深色。
						// material.diffuse = vec3(0.079, 0.107, 0.111);
					} else {
						//处理四个侧面: 贴一样的图
						float speed3d3d_width = 100.0;
						float speed3d3d_height = 100.0;
						float speed3d3d_textureX = 0.0;
						float speed3d3d_dotXAxis = dot(vec3(0.0, 1.0, 0.0), v_speed3d3d_normalMC);
						if (speed3d3d_dotXAxis > 0.52 || speed3d3d_dotXAxis < -0.52) {
						speed3d3d_textureX = mod(positionMC.x, speed3d3d_width) / speed3d3d_width;
						} else {
						speed3d3d_textureX = mod(positionMC.y, speed3d3d_width) / speed3d3d_width;
						}
						float speed3d3d_textureY = mod(positionMC.z, speed3d3d_height) / speed3d3d_height;
						material.diffuse = texture2D(u_speed3d3d_texture, vec2(speed3d3d_textureX, speed3d3d_textureY)).rgb;
					}
				}\`
			})
		},

		setDefaultStyle() {
			this.tiles3dModel.customShader = undefined
			this.tiles3dModel.style = undefined
		},

		highlightChangeEvent() {
			if (this.highlightEnable) {
				this.highlight = new Speed.highlightFeature({
					speedViewer: this.map._viewer,
					border: true,
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
