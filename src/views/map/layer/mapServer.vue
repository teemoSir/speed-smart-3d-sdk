<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>
</template>

<script>
import mapBox from '@/components/mapBox'
export default {
	name: "mapServer",
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

.dialog {
	position: absolute;
	z-index: 111;
	right: 2rem;
	top: 1rem;
}

.modelView {
	color: white;
	padding-left: 30px;
	padding-right: 25px;
	max-height: 700px;
}

.btnTool {
	border: 0.5px dashed #0099ff;
	border-radius: 10px;
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
	-webkit-background-clip: text;
}

.headerText img {
	width: 45px;
}

.el-row {
	margin-bottom: 10px;
	margin-top: 10px;
	text-align: center;
	align-items: center;

}

.el-button {
	background: no-repeat;
	width: 100px;
	height: 32px;
	border: none;
	background-size: 100% 100%;
	/* background-image: url('img/speed3d/bt_sel.png'); */
}


.parameter {
	margin-top: 20px;
}

.imagelayer-parameter {
	display: flex;
	color: white;
	align-items: center;
}

.demonstration {
	display: inline-block;
	width: 85px;
	font-size: 14px;
	text-align: right;
}

.p-slider {
	width: 200px;
	margin: 5px 10px;
	--el-slider-button-size: 15px;
}

.el-input {
	width: 65px;
	height: 24px;
}`,
			htmlCode:`<div :id="mapid" class="ktmap">
		<speeddialog class="dialog">
			<div class="modelView">
				<div>
					<el-row>
						<el-col :span="3"><img src="img/speed3d/ic_tclb.png" alt="" /></el-col>
						<el-col :span="15" class="headerText"> 图层列表</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<div class="content">OGC WMS</div>
						</el-col>
						<el-col :span="12">
							<el-button type="primary" size="small" @click="addWMS"
								style="background-image: url('img/speed3d/bt_sel.png');">添加</el-button>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<div class="content">OGC WMTS</div>
						</el-col>
						<el-col :span="12">
							<el-button type="primary" size="small" @click="addWMTS"
								style="background-image: url('img/speed3d/bt_sel.png');">添加</el-button>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<div class="content">OGC WFS</div>
						</el-col>
						<el-col :span="12">
							<el-button type="primary" size="small" @click="addWFS"
								style="background-image: url('img/speed3d/bt_sel.png');">添加</el-button>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<div class="content">OGC XYZ</div>
						</el-col>
						<el-col :span="12">
							<el-button type="primary" size="small" @click="addXYZ"
								style="background-image: url('img/speed3d/bt_sel.png');">添加</el-button>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<div class="content">ArcGIS Server动态服务</div>
						</el-col>
						<el-col :span="12">
							<el-button type="primary" size="small" @click="addArcServer"
								style="background-image: url('img/speed3d/bt_sel.png');">添加</el-button>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<div class="content">ArcGIS瓦片服务</div>
						</el-col>
						<el-col :span="12">
							<el-button type="primary" size="small" @click="addArcTile"
								style="background-image: url('img/speed3d/bt_sel.png');">添加</el-button>
						</el-col>
					</el-row>

				</div>

				<div class="btnTool">
					<el-row>
						<el-col :span="6">
							<el-switch v-model="showLayer" inline-prompt active-color="#13ce66" inactive-color="#6D7074"
								active-text="显示" inactive-text="隐藏" @change="hideLayer($event)" />
						</el-col>
						<el-col :span="9">
							<el-button type="primary" size="small" @click="location()"
								style="background-image: url('img/speed3d/bt_sel.png');" title="定位至当前图层">定位</el-button>
						</el-col>
						<el-col :span="9">
							<el-button type="primary" size="small" @click="delLayer()"
								style="background-image: url('img/speed3d/bt_sel.png');" title="移除当前图层">移除</el-button>
						</el-col>
					</el-row>
				</div>

				<div class="parameter" v-show="isShow">
					<el-row>
						<el-col :span="3"><img src="img/speed3d/ic_bjsx.png" style="width: 45px" alt="" /></el-col>
						<el-col :span="15" class="headerText"> 编辑属性</el-col>
					</el-row>

					<div class="imagelayer-parameter">
						<span class="demonstration">亮度：</span>
						<el-slider class="p-slider" v-model="Brightness" :min="0" :max="3" :step="0.01"></el-slider>
						<el-input v-model="Brightness" size="mini"></el-input>
					</div>
					<div class="imagelayer-parameter">
						<span class="demonstration">对比度：</span>
						<el-slider class="p-slider" v-model="Contrast" :min="0" :max="3" :step="0.01"></el-slider>
						<el-input v-model="Contrast" size="mini"></el-input>
					</div>
					<div class="imagelayer-parameter">
						<span class="demonstration">色调：</span>
						<el-slider class="p-slider" v-model="Hue" :min="0" :max="3" :step="0.01"></el-slider>
						<el-input v-model="Hue" size="mini"></el-input>
					</div>
					<div class="imagelayer-parameter">
						<span class="demonstration">饱和度：</span>
						<el-slider class="p-slider" v-model="Saturation" :min="0" :max="3" :step="0.01"></el-slider>
						<el-input v-model="Saturation" size="mini"></el-input>
					</div>
					<div class="imagelayer-parameter">
						<span class="demonstration">伽马校正：</span>
						<el-slider class="p-slider" v-model="Gamma" :min="0" :max="3" :step="0.01"></el-slider>
						<el-input v-model="Gamma" size="mini"></el-input>
					</div>
				</div>
			</div>

		</speeddialog>
	</div>`,
			javascriptCode:`
			import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import * as Cesium from "cesium"
import ServerInfo from '@/utils/serverInfo';

let curLayer

export default {
	name: "3dtilesModel",
	data() {
		return {
			isShow: false,
			showLayer: false,//控制图层显隐

			Brightness: 1.0, //图层的亮度。1.0 使用未修改的图像颜色。小于 1.0 会使图像更暗，而大于 1.0 会使图像更亮
			Contrast: 1.0, //图层的对比度。1.0 使用未修改的图像颜色。小于 1.0 会降低对比度，而大于 1.0 会增加对比度
			Hue: 0.0, //图层的色调。0.0 使用未修改的图像颜色
			Saturation: 1.0, //图层的饱和度。1.0 使用未修改的图像颜色。小于 1.0 会降低饱和度，而大于 1.0 会增加饱和度
			Gamma: 1.0, //应用于此图层的伽马校正。1.0 使用未修改的图像颜色
		}
	},
	watch: {

		Gamma(val) {
			curLayer.gamma = val;
		},
		Saturation(val) {
			curLayer.saturation = val;
		},
		Hue(val) {
			curLayer.hue = val;
		},
		Contrast(val) {
			curLayer.contrast = val;
		},
		Brightness(val) {
			curLayer.brightness = val;
		},

	},
	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap()

	},
	methods: {
		initMap() {
			let data = {
				containID: this.mapid,
				center: { lat: 30.054604, lng: 108.885436, alt: 17536414, heading: 0, pitch: -90 },
				scene: { FPS: true },//显示帧率
				terrains: [
					{
						id: 201,
						type: "none",
						name: "无地形",
						tooltip: "WGS84标准球体",
						icon: "img/basemaps/Ellipsoid.png",
						show: true
					},
					{
						id: 202,
						type: "xt",
						name: "星图地形",
						icon: "img/basemaps/terrain.png",
						tooltip: "星图地球提供的地形服务",
						url: "https://tiles1.geovisearth.com/base/v1/terrain",

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
				],
				baseLayerPicker: true, //底图切换按钮
				homeButton: true, //回到默认视域按钮
				sceneModePicker: true, //是否显示投影方式切换按钮
				fullscreenButton: true, //全屏按钮
				zoom: true, //缩放按钮,
				navigationControl:true,//导航球、比例尺
				statusBar:true,//状态栏
			};
			this.speedMap = new Speed.SpeedViewer()
			this.map = this.speedMap.init(data);
		},
		addWMS() {
			if (this.wfslayer) {
				this.wfslayer.removeLayer()
				this.wfslayer = undefined
			}
			this.speedMap.removeLayer(curLayer)
			curLayer = Speed.WMSLayer.wmsImageryLayer({
				url: ServerInfo.geoserverWMS,
				layers: "zhkt:xzq_cyq",
				parameters: {
					transparent: true,
					format: "image/png"
				},
				rectangle: {
					xmin: 116.293812, xmax: 116.717277, ymin: 39.800482, ymax: 40.092432
				}
			})
			this.speedMap.addLayer(curLayer)
			this.speedMap.flyto(curLayer)
			this.isShow = true
			this.showLayer = true
		},
		location() {

			if (this.wfslayer) {
				// 	this.speedMap.flyto(this.wfslayer)
				this.speedMap.flytoExtent({
					xmin: 117.695368,
					xmax: 117.698143,
					ymin: 35.860342,
					ymax: 35.865616
				})
			}else if (curLayer) {
				this.speedMap.flyto(curLayer)
			}
		},
		delLayer() {
			if (curLayer) {
				this.speedMap.removeLayer(curLayer)
				curLayer = undefined
				this.showLayer = false
			}
			if (this.wfslayer) {
				this.wfslayer.removeLayer()
				this.wfslayer = undefined
				this.showLayer = false

			}
		},
		hideLayer($event) {
			if (curLayer) {
				curLayer.show = $event
			}
			if (this.wfslayer) {
				this.wfslayer.hideLayer($event)
			}
			this.showLayer = $event

		},
		addWMTS() {
			if (this.wfslayer) {
				this.wfslayer.removeLayer()
				this.wfslayer = undefined
			}
			this.speedMap.removeLayer(curLayer)
			//默认情况下，加载3857坐标系的切片，只能访问使用EPSG:900913（标准名为EPSG:3875）
			curLayer = Speed.WMTSLayer.wmtsImageryLayer({

				url: ServerInfo.geoserverWMTS,
				layer: 'zhkt:cyq',
				style: 'zhkt:DLTB',
				format: 'image/png',
				tileMatrixSetID: 'EPSG:900913',
				tileMatrixLabels: ['EPSG:900913:0', 'EPSG:900913:1', 'EPSG:900913:2', 'EPSG:900913:3',
					'EPSG:900913:4', 'EPSG:900913:5', 'EPSG:900913:6', 'EPSG:900913:7', 'EPSG:900913:8',
					'EPSG:900913:9', 'EPSG:900913:10', 'EPSG:900913:11', 'EPSG:900913:12', 'EPSG:900913:13',
					'EPSG:900913:14', 'EPSG:900913:15', 'EPSG:900913:16', 'EPSG:900913:17', 'EPSG:900913:18'
					, 'EPSG:900913:19', 'EPSG:900913:20', 'EPSG:900913:21'],
				rectangle: {
					xmin: 116.293812, xmax: 116.717277, ymin: 39.800482, ymax: 40.092432
				}

			})

			this.speedMap.flyto(curLayer)
			this.speedMap.addLayer(curLayer)
			this.isShow = true
			this.showLayer = true

		},
		addXYZ() {
			if (this.wfslayer) {
				this.wfslayer.removeLayer()
				this.wfslayer = undefined
			}
			this.speedMap.removeLayer(curLayer)
			curLayer = Speed.XYZLayer.xyzImageryLayer({
				url: "http://data.mars3d.cn/tile/dizhiChina/{z}/{x}/{y}.png",
				minimumLevel: 1,
				maximumLevel: 19,
				rectangle: {
					xmin: 116.748826,
					xmax: 117.70627,
					ymin: 31.522157,
					ymax: 32.182559
				}
			})
			this.speedMap.flyto(curLayer)
			this.speedMap.addLayer(curLayer)
			this.isShow = true
			this.showLayer = true

		},
		addArcServer() {
			if (this.wfslayer) {
				this.wfslayer.removeLayer()
				this.wfslayer = undefined
			}
			this.speedMap.removeLayer(curLayer)
			curLayer = Speed.ArcGISLayer.arcgisImageryLayer({
				name: "朝阳区",
				url: ServerInfo.arcCYQ_WMS,
				// rectangle: {
				// 	xmin: 116.308812, xmax: 116.687277, ymin: 39.860482, ymax: 40.052432
				// }
			})
			this.speedMap.addLayer(curLayer)
			// this.speedMap.flyto(curLayer)
			this.speedMap.flytoExtent({ xmin: 116.308812, xmax: 116.687277, ymin: 39.860482, ymax: 40.052432 })
			this.isShow = true
			this.showLayer = true

		},

		addWFS() {
			if (this.wfslayer) {
				this.wfslayer.removeLayer()
				this.wfslayer = undefined
			}
			this.speedMap.removeLayer(curLayer)
			curLayer = undefined
			this.wfslayer = new Speed.WFSLayer(this.map._viewer, {
				url: ServerInfo.geoserverWFS,
				layer: "zhkt:jzw_xt",
				parameters: {
					// 支持所有wfs的参数
					maxFeatures: 210
				},
				minimumLevel: 12,
				buildings: {
					height: "jzgd"
				},
				symbol: {
					color: "#00469c",
					outline: true,
					opacity: 1
				},
			})
			this.wfslayer.loadWFSServer()
			this.speedMap.flytoExtent({
				xmin: 117.695368,
				xmax: 117.698143,
				ymin: 35.860342,
				ymax: 35.865616
			})
			this.isShow = false
			this.showLayer = true

		},
		addArcTile() {
			if (this.wfslayer) {
				this.wfslayer.removeLayer()
				this.wfslayer = undefined
			}
			this.speedMap.removeLayer(curLayer)

			curLayer = Speed.WMTSLayer.wmtsImageryLayer({
				url: 'http://61.175.211.102/arcgis/rest/services/TDT/SLDT/MapServer/WMTS/tile/1.0.0/TDT_SLDT/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
				layer: 'wzmap_map',
				style: 'default',
				tileMatrixSetID: 'default028mm',
				format: 'image/png',
				tilingScheme: new Cesium.GeographicTilingScheme(),
				mimimumLevel: 1,
				maximumLevel: 21,
				tileMatrixLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'],
				rectangle: { xmin: 119.644634, xmax: 121.904296, ymin: 27.205053, ymax: 28.502386 }

			})
			this.speedMap.addLayer(curLayer)
			this.speedMap.flyto(curLayer)
			this.isShow = true
			this.showLayer = true

		}
	},
}
			`
		}
	}

}
</script>

<style scoped>

</style>
