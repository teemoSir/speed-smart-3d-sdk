<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>

</template>

<script>
import mapBox from '@/components/mapBox'
export default {
	name: "3dtilesDTH",
	components: {
		mapBox
	},
	data(){
		return {
			cssCode:`
			.ktmap {
	width: 100%;
	height: 100%;
	background-color: #000;
	position: relative;
}
			`,
			htmlCode:`
			<div :id="mapid" class="ktmap">
			</div>
			`,
			javascriptCode:`
			import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import ModelInfo from '@/utils/modelInfo'

export default {
	name: "DTH",
	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap()
		//加載模型
		this.loadModel()
	},
	methods: {
		initMap() {
			let data = {
				containID: this.mapid,
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


				],
				center: { lat: 32.131390, lng: 118.715877, alt: 400, heading: 335, pitch: -45 },
				baseLayerPicker: true, //底图切换
				homeButton: true, //回到默认视域
				navigationControl: {
					compass: {
						show: true,
						style: { bottom: "120px", left: "1px" }
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
		loadModel() {
			this.tilesetLayer = new Speed.TilesetLayer()
			let tileset = this.tilesetLayer.loadQXTilesetLayer({
				url: ModelInfo.taishan,
				alt:15,
			});

			this.tiles3dModel = tileset._tileset
			this.speedMap.addLayer(this.tiles3dModel)
			// this.speedMap.flyto(this.tiles3dModel)
			let that = this
			this.tiles3dModel.readyPromise.then(function (tilesModel) {
				if (tilesModel.orginCenter) {
					that.modelHeight = tilesModel.orginCenter.z
					that.addDTH()
				}
			})
		},

		addDTH() {
			this.graphicLayer = new Speed.GeoJsonLayer(this.map._viewer)
			let dthGracphics = this.graphicLayer.createDTHGraphics({
				name: "弘扬旭日单体化",
				url: ModelInfo.JBHY_DTH,
				modelHeight: 15,//模型高度
				buildings: {
					// buttomheight: "minHeight",//楼层底部高度，可填数字（默认:0）或属性字段名称（如:"bottomHeight"）
					height: "floorHeight",// 楼层顶点高度，可填层高数值（默认3.5）或属性字段名称（如:"height"）
					floor:"thisFloor"//楼层数，可填数值（默认1）或属性字段名称。如果输入floor,则默认楼高为height*floor
				},
				symbol: {
					// color: "rgba(255, 255, 255, 0.1)",
					// 鼠标单击后高亮的样式
					highlight: {
						type: "LEFT_CLICK",
						color: "rgba(255,255,0,0.4)"
					}
				},
				popup: [
					{ field: "houseType", name: "户型" },
					{ field: "thisFloor", name: "楼层" },
					{ field: "name", name: "户号" }
				]
			})
			this.speedMap.addLayer(dthGracphics)
			this.timer = setInterval(() => {
				for (let index = 0; index < dthGracphics._primitives.length; index++) {
					const primitive = dthGracphics._primitives[index];
					this.tableData.push(primitive.properties)
				}
				this.total = this.tableData.length
				clearInterval(this.timer)

			}, 2000)
		},

	},

}
			`
		}
	}

}
</script>

<style scoped>

</style>
