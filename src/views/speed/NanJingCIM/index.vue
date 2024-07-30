<template>
	<div :id="mapid1" class="ktmap">
		<div id="header">
			<myTimer></myTimer>
			<div style="text-align:center;margin-top: 1.2%;">
				<div style="position: absolute;left:10%">
					<button @click="click1 = 1" :class="{ appearance1: click1 == 1, appearance: click1 != 1 }"></button>
					&emsp;
					&emsp;
					<button @click="click1 = 2" :class="{ planning1: click1 == 2, planning: click1 != 2 }"></button>
				</div>
				<div style="position: absolute;right:10%">
					<button @click="click1 = 3" :class="{ buinding1: click1 == 3, buinding: click1 != 3 }"></button>
					&emsp;
					&emsp;
					<button @click="click1 = 4" :class="{ manage1: click1 == 4, manage: click1 != 4 }"></button>
				</div>
			</div>
			<myWeather></myWeather>
		</div>
		<div v-show="click1 == 1">
			<appearance v-if='isView'></appearance>
		</div>
		<div v-show="click1 == 2">
			<planning v-if='isView'></planning>
		</div>
		<div v-show="click1 == 3">
			<cityBuilding v-if='isView'></cityBuilding>
		</div>
		<div v-show="click1 == 4">
			<!-- <planning v-if='isView'></planning> -->
		</div>
		<div class="aa"></div>
		<div class="bb"></div>
		<div class="cc"></div>
	</div>
</template>

<script>
import appearance from '@/views/speed/NanJingCIM/NJGM/appearance.vue';
import cityBuilding from '@/views/speed/NanJingCIM/NJJS/cityBuilding.vue';
import planning from '@/views/speed/NanJingCIM/NJGH/planning.vue';
import { provide } from 'vue';
import * as uuid from "uuid";
import myTimer from "./timer.vue";
import myWeather from "./weather.vue";
import * as Speed from '@/cesiumSDK/index';

export default ({
	name: '',
	components: {
		appearance,
		cityBuilding,
		planning,
		myTimer,
		myWeather,
	},
	props: {},
	data() {
		return {
			click1: 1,
			isView: false,
		}
	},
	created() {
		this.mapid1 = uuid.v4();
	},
	mounted() {
		this.initMap();
	},
	methods: {
		initMap() {
			let data = {
				containID: this.mapid1,
				center: { lat: 31.902374, lng: 118.691157, alt: 13895.605504492269, heading: 0, pitch: -45, roll: 6.2831853071795845 },
				// terrains: [
				// 	{
				// 		id: 202,
				// 		type: "xt",
				// 		name: "星图地形",
				// 		icon: "img/basemaps/terrain.png",
				// 		tooltip: "星图地球提供的地形服务",
				// 		url: "https://tiles1.geovisearth.com/base/v1/terrain",
				// 		show: true,
				// 	},
				// ],
				basemaps: [
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
				],
			}
			this.speedMap = new Speed.SpeedViewer();
			this.map = this.speedMap.init(data)._viewer;
			this.map.scene.globe.depthTestAgainstTerrain = true;
			provide("map", this.map);
			provide("speedMap", this.speedMap);
			this.isView = true;
		},
	},
	watch: {

	},
})
</script>

<style scoped>
@import './index.css';
</style>