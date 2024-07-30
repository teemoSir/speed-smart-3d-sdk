<template>
	<div :id="mapid" class="ktmap">
	</div>
</template>

<script>
import * as uuid from "uuid"
import * as Speed from '../../cesiumSDK/index'
import * as token from '../../cesiumSDK/core/util/token'
import tdt_img from "@/assets/basemaps/tdt_img.png";

export default {
	name: "ktmap",
	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap();
	},
	methods: {
		initMap() {
			this.map = new Speed.SpeedViewer().init({
				containID: this.mapid,
				center: { lat: 30.054604, lng: 108.885436, alt: 17536414, heading: 0, pitch: -90 },
				terrain: {
					type: "xt",
					url: "https://tiles1.geovisearth.com/base/v1/terrain",
					key: token.xingtu,
				},
				basemaps: [
					{
						name: "星图影像",
						icon: tdt_img,
						type: "group",
						tooltip: "星图影像地图服务",
						layers: [
							{ name: "底图", type: "xt", layer: "img_d", key: token.xingtu },
							{ name: "注记", type: "xt", layer: "img_z", key: token.xingtu }
						],
						show: true
					},
					{
						name: "天地图影像(EPSG:3857)",
						icon: tdt_img,
						type: "tdt",
						tooltip: "天地图影像地图服务",
						layer: "img_d",
						key:  token.tianditu
					},
					// {
					// 	name: "天地图影像(EPSG:3857)",
					// 	icon: tdt_img,
					// 	type: "group",
					// 	tooltip: "天地图影像地图服务",
					// 	layers: [
					// 		{
					// 			name: "底图",
					// 			type: "tdt",
					// 			layer: "img_d",
					// 			key:  token.tianditu
					// 		},
					// 		{
					// 			name: "注记",
					// 			type: "tdt",
					// 			layer: "img_z",
					// 			key:  token.tianditu
					// 		}
					// 	]
					// },
					// {
					// 	name: "ArcGIS影像",
					// 	icon: tdt_img,
					// 	type: "arcgis",
					// 	tooltip: "ArcGIS影像地图服务",
					// 	url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
					// 	enablePickFeatures: false,
					// }

				]
			});

		},
	},

}
</script>

<style lang="scss" scoped>
.ktmap {
	width: 100%;
	height: 100%;
	background-color: #000;
	position: relative;

	.infoToolbar {
		position: absolute;
		height: 2rem;
		width: 100%;
		line-height: 2rem;
		left: 0;
		bottom: 0;
		background-color: rgba(23, 49, 71, 0.5);
		z-index: 1;
	}


	.infoFields {
		position: absolute;
		right: 2rem;
		top: 0;

		li {
			width: auto;
			height: 2rem;
			float: left;
			color: #fff;
			list-style: none;
			padding: 0 10px;
		}
	}
}
</style>
