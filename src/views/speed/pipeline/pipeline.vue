<template>
	<div :id="mapid" class="ktmap">
		<div id="header">
			<div style="text-align:center;">
				<button @click="click1 = false" :class="{ view: click1, view1: !click1 }">大屏首页</button>
				<button class="platform"></button>
				<button @click="click1 = true" :class="{ analysis: !click1, analysis1: click1 }">三维分析</button>
			</div>
			<button class="admin">
				<p style="margin-left: 25px;color: #3399EF;">admin</p>
			</button>
		</div>
		<div v-show="!click1">
			<myView v-if='isView'></myView>
		</div>
		<div v-show="click1">
			<myAnalysis v-if='isView'></myAnalysis>
		</div>
	</div>

</template>

<script>
import myView from '@/views/speed/pipeline/myView.vue';
import myAnalysis from '@/views/speed/pipeline/myAnalysis.vue';
import { provide } from 'vue';
import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
export default ({
	name: '',
	components: {
		myView,
		myAnalysis,
	},
	props: {},
	data() {
		return {
			click1: false,
			isView: false,
		}
	},
	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap();
	},
	methods: {
		initMap() {
			let data = {
				containID: this.mapid,
				center: { lat: 32.1265, lng: 118.707, alt: 1000, heading: 0, pitch: -90 },
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
			}
			let map = new Speed.SpeedViewer().init(data)._viewer;
			map.scene.globe.depthTestAgainstTerrain = true; 
			provide("map", map);
			this.isView = true;
			// 设置地图透明
			// map.scene.globe.baseColor = Cesium.Color.TRANSPARENT;
			// map.scene.globe.translucency.enabled = true;
			// map.scene.globe.undergroundColor = undefined;
		},
	},
	watch: {

	},
})
</script>

<style scoped>
.ktmap {
	width: 100%;
	height: 100%;
	background-color: #000;
	position: absolute;
	z-index: 0;
}

/*头部*/
#header {
	width: 100%;
	height: 13%;
	top: 0;
	position: absolute;
	background: url("@/assets/speed/communityPNG/头部.png") no-repeat center center;
	background-size: 100% 100%;
	z-index: 100;
}

.view,
.platform,
.analysis {
	width: 100px;
	background: transparent;
	border: none;
	color: #ffffff;
	font-size: larger;
}

.view1,
.analysis1 {
	background: transparent;
	border: none;
	color: #ffffff;
	font-size: larger;
	width: 100px;
	background: url("@/assets/speed/communityPNG/dpsy_sel.png") no-repeat center center;
	background-size: 100% 100%;
}

.platform {
	width: 15%;
	height: 45px;
	background: url("@/assets/speed/communityPNG/title.png") no-repeat center center;
	background-size: 100% 100%;
	position: relative;
	margin: 1% 8% 0 8%;
}

.admin {
	background: url('@/assets/speed/communityPNG/ic_wd 拷贝.png') no-repeat center;
	position: absolute;
	top: 25%;
	right: 10%;
	background-size: 100% 100%;
	height: 25px;
	width: 25px;
	border: none;
}
</style>