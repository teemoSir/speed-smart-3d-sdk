<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>

</template>

<script>
import mapBox from '@/components/mapBox'
export default {
	name: "toolbar",
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
}`,
			htmlCode:`
	<div :id="mapid" class="ktmap">
	</div>`,
			javascriptCode:`import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import * as token from '@/utils/token'

export default {
	name: "ktmap",
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
					},
					{
						id: 203,
						type: "mars",
						name: "火星地形",
						icon: "img/basemaps/terrain.png",
						tooltip: "火星科技提供的中国国内地形",
						url: "http://data.mars3d.cn/terrain",
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
						id: 102,
						name: "星图电子",
						icon: "img/basemaps/tdt_vec.png",
						tooltip: "星图电子地图服务",
						type: "xt",
						layer: "vec"
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
					{
						id: 401,
						name: "ArcGIS影像",
						icon: "img/basemaps/google_img.png",
						type: "arcgis",
						tooltip: "ArcGIS影像地图服务",
						url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
					},
					{
						id: 402,
						name: "ArcGIS蓝色地图",
						icon: "img/basemaps/bd-c-midnight.png",
						type: "arcgis",
						tooltip: "ArcGIS地图服务",
						layer:"ChinaOnlineStreetPurplishBlue",
						crs: "WGS84",
					},
					{
						id: 501,
						name: "腾讯影像",
						icon: "img/basemaps/bingimage.png",
						type: "tencent",
						tooltip: "腾讯影像地图服务",
						layers: [
							{ name: "底图", layer: "img_d" },
							{ name: "注记", layer: "img_z" }
						],
						crs: "WGS84"
					},
					{
						id: 502,
						name: "腾讯电子",
						icon: "img/basemaps/bd-c-pink.png",
						type: "tencent",
						tooltip: "腾讯地图服务",
						layer: "vec",
						crs: "WGS84"
					},
					{
						id: 601,
						name: "百度电子",
						icon: "img/basemaps/bd-vec.png",
						type: "baidu",
						layer: "vec",
						crs: "WGS84"
					},
					{
						id: 602,
						name: "百度影像",
						icon: "img/basemaps/bd-img.png",
						type: "baidu",
						layers: [
							{ name: "底图", layer: "img_d" },
							{ name: "注记", layer: "img_z" }
						],
						crs: "WGS84"
					},
					{
						id: 701,
						type: "xyz",
						name: "江苏影像",
						icon: "img/basemaps/tdt_img.png",
						tooltip: "XYZ影像地图服务",
						url: "http://36.152.66.51:18088/{z}/{x}/{reverseY}.jpg",
					}
				],
				baseLayerPicker: true, //底图切换按钮
				homeButton: true, //回到默认视域按钮
				sceneModePicker: true, //是否显示投影方式切换按钮
				fullscreenButton: true, //全屏按钮
				zoom: true, //缩放按钮,
				navigationControl:{
					compass: {
						show: true,
						style: { top: "50px", left: "5px" }
					},
					legend: {
						show: true,
						style: { left: "5px", bottom: "1px" }
					}
				}//导航球、比例尺
			};
			this.map = new Speed.SpeedViewer().init(data);
		},
	},
}`
		}
	}

}
</script>

<style scoped>

</style>
