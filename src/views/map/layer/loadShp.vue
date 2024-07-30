<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>


</template>

<script>
import mapBox from '@/components/mapBox'
export default {
	name: "loadShp",
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
}

::v-deep .el-collapse-item__content {
	padding-bottom: 15px;
}

::v-deep .el-collapse {
	--el-collapse-border-color: #0099ff70;
	--el-collapse-header-bg-color: none;
	--el-collapse-header-text-color: #ffffff;
	--el-collapse-content-bg-color: none;
	--el-collapse-content-text-color: #ffffff;
	--el-text-color-regular: #ffffff;
	--el-collapse-header-font-size: 18px;
	border-top: none;
	border-bottom: none;
}

.tool-item {
	border: 1px dashed darkgray;
	margin: 10px;
	padding: 5px;
}

.serviceUrl {
	height: 25px;
	width: 215px;
	border: none;
	margin-right: 10px;
}`,
			htmlCode:`<div :id="mapid" class="ktmap">
		<speeddialog class="dialog">
			<div class="modelView">
				<div class="content">
					<el-collapse v-model="activeKey">
						<el-collapse-item name="1" title="ShapeFile">
							<div>
								<div class="tool-item">
									<label class="item-title" for="shpfile">本地shp (必须同时选择.shp和.dbf两文件)</label>
									<span>
										<input type="file" id="shpfile" multiple accept=".shp,.dbf"
											@change="loadLocalShp" />
									</span>
								</div>
								<div class="tool-item">
									<label class="item-title" for="urlPath">服务端shp (例：http://localhost/test.shp)</label>
									<span>
										<input class="serviceUrl" type="text" id="urlPath" :value="serviceUrl" />
										<el-button class="loadurl" type="primary" size="small"
											@click="loadServiceShp">加载</el-button>
									</span>
								</div>
								<div class="tool-item">
									<el-button type="primary" @click="loadVectorTile">瓦片方式加载shp</el-button>
								</div>
							</div>
						</el-collapse-item>

						<el-collapse-item name="2" title="GeoJson">
							<el-space wrap>
								<el-button type="primary" @click="addChina">中国省界</el-button>
								<el-button type="primary" @click="addArea">区域面</el-button>
								<el-button type="primary" @click="addDTH">单体化面</el-button>
								<el-button type="primary" @click="addBuilding">立体建筑物</el-button>
								<el-button type="primary" @click="addWall">边界墙</el-button>
								<el-button type="primary" @click="addFloor">分层分户楼栋</el-button>
							</el-space>
						</el-collapse-item>

						<el-collapse-item name="3" title="KML">
							<el-button type="primary" @click="addKml">全球各国GDP</el-button>
						</el-collapse-item>

						<el-collapse-item name="4" title="CZML">
							<el-button type="primary" @click="addCzml">船舶编队</el-button>
						</el-collapse-item>

					</el-collapse>
				</div>
			</div>
		</speeddialog>
	</div>`,
			javascriptCode:`
			import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import * as Cesium from "cesium";

let speedMap = undefined
let curLayer
let graphicLayer
let kmlLayer
let czmlLayer

export default {
	name: "loadMapFile",
	data() {
		return {
			activeKey: ['1', '2', '3', '4'],
			serviceUrl: ""
		}
	},

	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap()

		graphicLayer = new Speed.GeoJsonLayer(this.map._viewer)
		kmlLayer = new Speed.KmlLayer(this.map._viewer)
		czmlLayer = new Speed.CzmlLayer(this.map._viewer)
	},
	methods: {
		initMap() {
			let data = {
				containID: this.mapid,
				center: { lat: 30.054604, lng: 108.885436, alt: 18000000, heading: 0, pitch: -90 },
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
						id: 203,
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
						id: 301,
						name: "高德影像",
						icon: "img/basemaps/gaode_img.png",
						type: "gaode",
						tooltip: "高德影像 地图服务",
						layers: [
							{ name: "底图", layer: "img_d" },
							{ name: "注记", layer: "img_z" }
						],
						crs: "WGS84"
					},
					{
						id: 302,
						name: "高德矢量",
						icon: "img/basemaps/gaode_vec.png",
						type: "gaode",
						tooltip: "高德矢量 地图服务",
						layer: "vec_d",
						crs: "WGS84"
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
		loadVectorTile() {
			this.speedMap.removeLayer(this.curLayer)

			let that = this
			Promise.all([
				Cesium.Resource.fetchBlob({ url: "//data.mars3d.cn/file/shp/hefei_xz.shp" }),
				Cesium.Resource.fetchBlob({ url: "//data.mars3d.cn/file/shp/hefei_xz.dbf" }),
				Cesium.Resource.fetchBlob({ url: "//data.mars3d.cn/file/shp/hefei_xz.prj" })
			]).then(function (files) {
				files[0].name = "hefei.shp"
				files[1].name = "hefei.dbf"
				files[2].name = "hefei.prj"

				that.curLayer = Speed.VectorTileLayer.vectorTileLayer({
					source: files,
					defaultStyle: {
						tileCacheSize: 200,
						fill: true, // 是否填充，仅面数据有效。
						fillColor: "rgba(135,206,235,0.5)",
						outline: true, // 是否显示边，仅面数据有效。
						outlineColor: "rgba(65,105,225,1)",
						lineWidth: 1,
						showMaker: false,
						showCenterLabel: true,//是否显示文本，仅对线和面数据有效
						fontColor: "rgba(255,0,0,1)",
						labelOffsetX: -10,
						labelOffsetY: -5,
						fontSize: 13,
						fontFamily: "黑体",
						centerLabelPropertyName: "NAME"
					},
					maximumLevel: 20,
					minimumLevel: 1,
					simplify: false
				})
				that.speedMap.addLayer(that.curLayer)

			})
			this.speedMap.flytoExtent({
				xmin: 116.708826,
				xmax: 117.74627,
				ymin: 31.482157,
				ymax: 32.222559
			})
		},
		loadLocalShp() {
			this.speedMap.removeLayer(this.curLayer)

			let that = this
			let shpFile, dbfFile, _shpData, _dbfData;
			let filesSelect = Array.from(document.getElementById("shpfile").files)
			if (filesSelect.length != 2) {
				console.log(
					"注意：请同时选择.shp和.dbf两个文件！！！"
				)
				return
			}
			filesSelect.forEach((element) => {
				if (element.name.indexOf(".shp") > 0) {
					shpFile = element
				} else if (element.name.indexOf(".dbf") > 0) {
					dbfFile = element
				}
			})
			if (!shpFile || !dbfFile) {
				console.log(
					"注意：请同时选择.shp和.dbf两个文件！！！"
				)
				return
			}

			let readShp = new FileReader();
			readShp.readAsArrayBuffer(shpFile, "UTF-8") //读取文件的内容
			readShp.onload = function () {
				_shpData = this.result
				let readDbf = new FileReader()
				readDbf.readAsArrayBuffer(dbfFile, "UTF-8") //读取文件的内容
				readDbf.onload = function () {
					_dbfData = this.result

					that.addSHPData(_shpData, _dbfData)
				}
			}
		},
		loadServiceShp() {
			this.speedMap.removeLayer(this.curLayer)

			let _shpData, _dbfData;
			_shpData = document.getElementById("urlPath").value.trim();
			if (_shpData.indexOf(".shp") < 0) {
				console.log("注意：输入的shp服务端地址有误！");
				return;
			}
			_dbfData = _shpData.substr(0, _shpData.length - 3) + "dbf";
			this.addSHPData(_shpData, _dbfData)
		},
		addSHPData(_shpData, _dbfData) {
			let that = this
			const promise = new Speed.ShapeFileLayer().createAndLoadShp(_shpData, _dbfData, {
				encoding: "utf-8",
				clampToGround: true,
				borderColor: Cesium.Color.RED,
				fillColor: Cesium.Color.PINK.withAlpha(0.5),
				width: 3,
			})
			Promise.resolve(promise)
				.then(function (dataSource) {
					that.curLayer = dataSource
					that.speedMap.addLayer(that.curLayer)
					that.speedMap.flyto(that.curLayer)
				})
				.catch(function (error) {
					console.log(error)
				})
		},

		addChina() {
			graphicLayer.destory()
			this.speedMap.removeLayer(this.curLayer)
			this.speedMap.removeLayer(this.tiles3dModel)

			const promise = graphicLayer.loadGeoJson({
				name: "中国各省",
				url: "http://36.152.66.51:8088/3dtiles/geojson/xzqh/china.json",
				type: "polylineP",
				symbol: {
					width: 2,
				}
			})
			let that = this
			Promise.resolve(promise)
				.then(function (dataSource) {
					that.curLayer = dataSource
					that.speedMap.addLayer(that.curLayer)
				})
				.catch(function (error) {
					console.log(error)
				})
			var optsClone = {};
			optsClone.destination = Cesium.Cartesian3.fromDegrees(108.885436, 30.054604, 7100000);
			this.speedMap.flyto(optsClone)

		},

		addArea() {
			graphicLayer.destory()
			this.speedMap.removeLayer(this.curLayer)
			this.speedMap.removeLayer(this.tiles3dModel)

			this.curLayer = graphicLayer.loadGeoJson({
				name: "江苏省",
				url: "http://36.152.66.51:8088/3dtiles/geojson/xzqh/jiangsu.json",
				clampToGround: true,
				type: "polygon",
				symbol: {
					opacity: 0.8,
					outline: true,
					outlineWidth: 2,
					randomColor: true
				},
				label: {
					// 面中心点，显示文字的配置
					text: "{name}", // 对应的属性名称
					color: "#ffffff",
					outlineColor: "#000000",
					outlineWidth: 1,
				}
			})
			let that = this
			Promise.resolve(this.curLayer)
				.then(function (dataSource) {
					that.curLayer = dataSource
					that.speedMap.addLayer(that.curLayer)
					that.speedMap.flyto(that.curLayer)
				})
		},

		addDTH() {
			graphicLayer.destory()
			this.speedMap.removeLayer(this.curLayer)
			this.speedMap.removeLayer(this.tiles3dModel)

			let tileset = new Speed.TilesetLayer().loadQXTilesetLayer({
				url: "http://data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
				maximumScreenSpaceError: 1,
				maximumMemoryUsage: 1024,
				alt: 85,
			});
			this.tiles3dModel = tileset._tileset
			this.speedMap.addLayer(this.tiles3dModel)
			this.speedMap.flyto(this.tiles3dModel)

			this.curLayer = graphicLayer.createDTHGraphics({
				name: "文庙单体化",
				url: "http://36.152.66.51:8088/3dtiles/geojson/dth-wm.json",
				buildings: {
					height: 100,
				},
				symbol: {
					// 单体化默认显示样式
					color: "rgba(255, 255, 255, 0.01)",
					clampToGround: true,
					// 单体化鼠标移入或单击后高亮的样式
					highlight: {
						type: "MOUSE_MOVE",
						color: "rgba(255,255,0,0.4)"
					}
				}
			})

			this.speedMap.addLayer(this.curLayer)

		},

		addBuilding() {
			graphicLayer.destory()
			this.speedMap.removeLayer(this.curLayer)
			this.speedMap.removeLayer(this.tiles3dModel)

			this.curLayer = graphicLayer.loadGeoJson({
				name: "建筑物面",
				url: "http://36.152.66.51:8088/3dtiles/geojson/buildings.json",
				type: "polygon",
				buildings: {
					floor: "floors",//层数
					height: "flo_height" //层高
				},
				symbol: {
					opacity: 0.8,
					color: "#00C5CD",
					outline: true,
					outlineColor: "#00868B",
				}
			})
			let that = this
			Promise.resolve(this.curLayer)
				.then(function (dataSource) {
					that.curLayer = dataSource
					that.speedMap.addLayer(that.curLayer)
				})

			var center = {};
			center.destination = Cesium.Cartesian3.fromDegrees(120.420654, 31.928659, 838); //经度、纬度、高度
			center.orientation = {
				heading: Cesium.Math.toRadians(344), //绕垂直于地心的轴旋转
				pitch: Cesium.Math.toRadians(-42), //绕纬度线旋转
				roll: Cesium.Math.toRadians(0) //绕经度线旋转
			}
			this.speedMap.flyto(center)

		},

		addWall() {
			graphicLayer.destory()
			this.speedMap.removeLayer(this.curLayer)
			this.speedMap.removeLayer(this.tiles3dModel)

			this.curLayer = graphicLayer.loadGeoJson({
				name: "边界墙",
				url: "http://36.152.66.51:8088/3dtiles/geojson/xzqh/nanjing.json",
				type: "wall",
				symbol: {
					height: 5000, // 墙高
					opacity: 0.8,
					color: "#00C5CD",

				},
			})
			let that = this
			Promise.resolve(this.curLayer)
				.then(function (dataSource) {
					that.curLayer = dataSource
					that.speedMap.addLayer(that.curLayer)
				})

			var optsClone = {};
			optsClone.destination = Cesium.Cartesian3.fromDegrees(118.875000, 31.600632, 50000);
			optsClone.orientation = {
				heading: Cesium.Math.toRadians(0), //绕垂直于地心的轴旋转
				pitch: Cesium.Math.toRadians(-40), //绕纬度线旋转
				roll: Cesium.Math.toRadians(0) //绕经度线旋转
			}
			this.speedMap.flyto(optsClone)
		},

		addFloor() {
			graphicLayer.destory()
			this.speedMap.removeLayer(this.curLayer)
			this.speedMap.removeLayer(this.tiles3dModel)


			this.curLayer = graphicLayer.loadGeoJson({
				name: "分层分户建筑物面",
				url: "http://36.152.66.51:8088/3dtiles/geojson/huxing.json",
				type: "polygon",
				buildings: {
					buttomheight: "floorh",//底部高度
					height: "layerh" //层高
				},
				symbol: {
					color: "#ffffff",
					opacity: 0.2,
					outline: true,
					outlineColor: "#63AEFF",
					outlineOpacity: 0.3,
					highlight: {
						type: "LEFT_CLICK",
						color: "#00ffff",
						opacity: 0.6
					}
				},

			})
			let that = this
			Promise.resolve(this.curLayer)
				.then(function (dataSource) {
					that.curLayer = dataSource
					that.speedMap.addLayer(that.curLayer)
				})
			var optsClone = {};
			optsClone.destination = Cesium.Cartesian3.fromDegrees(117.179329, 31.821524, 255);
			optsClone.orientation = {
				heading: Cesium.Math.toRadians(25), //绕垂直于地心的轴旋转
				pitch: Cesium.Math.toRadians(-48), //绕纬度线旋转
				roll: Cesium.Math.toRadians(0) //绕经度线旋转
			}
			this.speedMap.flyto(optsClone)
		},
		addKml() {
			graphicLayer.destory()
			this.speedMap.removeLayer(this.curLayer)
			this.speedMap.removeLayer(this.tiles3dModel)

			this.curLayer = kmlLayer.LoadKmlLayer({
				name: "全球各国GDP",
				url: "//data.mars3d.cn/file/kml/gdpPerCapita2008.kmz",
			})
			let that = this
			Promise.resolve(this.curLayer)
				.then(function (dataSource) {
					that.curLayer = dataSource
					that.speedMap.addLayer(that.curLayer)
				})
		},
		addCzml(){

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
