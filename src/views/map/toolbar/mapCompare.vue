<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>
</template>

<script>
import mapBox from '@/components/mapBox'
export default {
	name: "mapCompare",
	components: {
		mapBox
	},
	data() {
		return {
			cssCode: `.ktmap {
	width: 100%;
	height: 100%;
	position: relative;
}

.cesiumContainer1 {
	display: inline-block;
	width: 50%;
	height: 100%;
}

.cesiumContainer2 {
	display: inline-block;
	width: 50%;
	height: 100%;
}`,
			htmlCode: `<div class="ktmap">
		<div :id="mapidL" class="cesiumContainer1"></div>
		<div :id="mapidR" class="cesiumContainer2"></div>
	</div>`,
			javascriptCode: `import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import  ModelInfo from '@/utils/modelInfo'


export default {
	name: "mapCompare",
	created() {
		this.mapidL = uuid.v4();
		this.mapidR = uuid.v4();
	},
	mounted() {
		this.initMapL()

		this.initMapR()

		let syncObj = new Speed.SyncViewer(this.mapL._viewer, this.mapR._viewer);
		syncObj.sync(true)
	},
	methods: {
		initMapL() {
			let data = {
				containID: this.mapidL,
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
					show: true
				},
			],
			baseLayerPicker: true, //底图切换按钮
				homeButton: true, //回到默认视域按钮
				sceneModePicker: true, //是否显示投影方式切换按钮
				statusBar:{
					show:true,
					fps:false
				},
				navigationControl:{
					compass: {
						show: true,
						style: { top: "50px", left: "5px" }
					}
				}//导航球
			};
			this.speedMapL = new Speed.SpeedViewer()
			this.mapL = this.speedMapL.init(data);

			//加载模型
			let tileset = new Speed.TilesetLayer().loadTilesetLayer({
				url: ModelInfo.JIANGXINZHOU,
			});
			this.speedMapL.addLayer(tileset._tileset)
			this.speedMapL.flyto(tileset._tileset)

		},
		initMapR() {

			let data = {
				containID: this.mapidR,
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
					id: 201,
					name: "天地图电子",
					icon: "img/basemaps/tdt_vec.png",
					tooltip: "天地图电子地图服务",
					type: "tdt",
					layers: [
						{ name: "底图", layer: "vec_d" },
						{ name: "注记", layer: "vec_z" }
					],
					show: true
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
			],

				baseLayerPicker: true, //底图切换按钮
				homeButton: true, //回到默认视域按钮
				sceneModePicker: true, //是否显示投影方式切换按钮
				statusBar:{
					show:true,
					fps:false
				},
				navigationControl:{
					compass: {
						show: true,
						style: { top: "50px", left: "5px" }
					}
				}//导航球
			};
			this.mspeedMapR = new Speed.SpeedViewer()
			this.mapR = this.mspeedMapR.init(data);

			//加载模型
			let tileset = new Speed.TilesetLayer().loadTilesetLayer({
				url: ModelInfo.JIANGXINZHOU
			});
			this.mspeedMapR.addLayer(tileset._tileset)
			this.mspeedMapR.flyto(tileset._tileset)

		}

	},
}`
		}
	}

}
</script>

<style scoped></style>
