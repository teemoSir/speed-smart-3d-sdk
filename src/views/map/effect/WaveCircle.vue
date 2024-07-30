<template>
	<mapBox
		:css-code="cssCode"
		:html-code="htmlCode"
		:javascript-code="javascriptCode"
	></mapBox>
</template>

<script>
import mapBox from "@/components/mapBox";

export default {
	name: "WaveCircle",
	components: {
		mapBox,
	},
	data() {
		return {
			cssCode: `
.ktmap {
	width: 100%;
	height: 100%;
	position: relative;
	background-color: #000;
}
.dialog {
	position: absolute;
	left: 80px;
	top: 40px;
	z-index: 2;
}
.content {
	padding: 0 25px;
}
.content-row {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
.content-row:first-of-type {
	margin-bottom: 20px;
}
.content-row + .content-row {
	margin-top: 20px;
}
.content-row > .title {
	color: white;
}
.content-row > .el-input {
	width: 80px;
}
.content-row > .el-slider {
	flex: 1;
}
.title.main {
	margin-right: 20px;
	font-size: 24px;
	font-weight: bold;
	line-height: 24px;
}
.title.property {
	width: 80px;
	font-size: 14px;
	text-align: left;
}
.title.sub-property {
	font-size: 12px;
}
.title.longitude {
	margin-right: 10px;
}
.title.latitude {
	margin: 0 10px;
}
`,
			htmlCode: `
<div :id="mapId" class="ktmap"></div>
<speeddialog class="dialog">
	<div class="content">
		<div class="content-row">
			<span class="title main">波动圆</span>
			<el-switch v-model="waveShow" @change="onShowChange" />
		</div>
		<div class="content-row">
			<span class="title property">中心位置</span>
			<span class="title sub-property longitude">经度</span>
			<el-input v-model="longitude" type="number" size="small" placeholder="请输入经度" @change="onLongitudeChange" />
			<span class="title sub-property latitude">纬度</span>
			<el-input v-model="latitude" type="number" size="small" placeholder="请输入纬度" @change="onLatitudeChange" />
		</div>
		<div class="content-row">
			<span class="title property">高度</span>
			<el-input v-model="height" type="number" size="small" placeholder="请输入高度" @change="onHeightChange" />
		</div>
		<div class="content-row">
			<span class="title property">波动个数</span>
			<el-input v-model="waveCount" type="number" size="small" placeholder="请输入波动个数" @change="onWaveCountChange" />
		</div>
		<div class="content-row">
			<span class="title property">波动速度</span>
			<el-slider v-model="waveSpeed" @change="onWaveSpeedChange" />
		</div>
		<div class="content-row">
			<span class="title property">辐射半径</span>
			<el-slider v-model="waveRadius" @change="onWaveRadiusChange" />
		</div>
		<div class="content-row">
			<span class="title property">颜色</span>
			<el-color-picker v-model="waveColor" @change="onColorChange" show-alpha />
		</div>
	</div>
</speeddialog>
`,
			javascriptCode: `
import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import * as Cesium from "cesium";

export default {
	name: "WaveCircle",
	data() {
		return {
			waveShow: true,
			longitude: "118.891691",
			latitude: "32.105097",
			height: "0",
			waveCount: "4",
			waveSpeed: 10,
			waveRadius: 100,
			waveColor: "#FFFF00",
		}
	},
	created() {
		this.mapId = uuid.v4();
	},
	beforeUnmount() {
		this.waveCircle && this.waveCircle.destroy();
	},
	mounted() {
		this.initMap();
		this.initData();
	},
	methods: {
		initMap() {
			let data = {
				containID: this.mapId,
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
				},
				center: {
					lat: 32.105097,
					lng: 118.891691,
					alt: 2000,
					heading: 0,
					pitch: -90,
				},
			};
			const speedMap = new Speed.SpeedViewer()
			this.map = speedMap.init(data);
		},
		initData() {
			const position = Cesium.Cartesian3.fromDegrees(Number(this.longitude), Number(this.latitude));
			this.waveCircle = new Speed.WaveCircle(this.map._viewer, null, {
				position: position,
				height: Number(this.height),
				count: Number(this.waveCount),
				speed: this.waveSpeed,
				radius: this.waveRadius,
				color: this.waveColor,
			});
			this.waveCircle.createWaveCircle();
		},
		onShowChange(val) {
			if (this.waveCircle.entity) {
				this.waveCircle.show = val;
			}
		},
		onLongitudeChange(val) {
			if (this.waveCircle.entity) {
				const position = Cesium.Cartesian3.fromDegrees(Number(this.longitude), Number(this.latitude));
				if (position) {
					this.waveCircle.position = position;
				}
			}
		},
		onLatitudeChange(val) {
			if (this.waveCircle.entity) {
				const position = Cesium.Cartesian3.fromDegrees(Number(this.longitude), Number(this.latitude));
				if (position) {
					this.waveCircle.position = position;
				}
			}
		},
		onHeightChange(val) {
			if (this.waveCircle.entity) {
				this.waveCircle.height = Number(val) || 0;
			}
		},
		onWaveCountChange(val) {
			if (this.waveCircle.entity) {
				this.waveCircle.count = Number(val) || 4;
			}
		},
		onWaveSpeedChange(val) {
			if (this.waveCircle.entity) {
				this.waveCircle.speed = val;
			}
		},
		onWaveRadiusChange(val) {
			if (this.waveCircle.entity) {
				this.waveCircle.radius = val;
			}
		},
		onColorChange(val) {
			if (this.waveCircle.entity) {
				this.waveCircle.color = Cesium.Color.fromCssColorString(val);
			}
		},
	}
}`,
		};
	},
};
</script>

<style scoped></style>
