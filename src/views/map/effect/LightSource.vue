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
	name: "LightSource",
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
.content-row > .el-select {
	flex: 1;
}
.content-row > .title {
	color: white;
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
`,
			htmlCode: `
<div :id="mapId" class="ktmap"></div>
<speeddialog class="dialog">
	<div class="content">
		<div class="content-row">
			<span class="title main">直射光源切换</span>
			<el-select v-model="lightDirection" @change="onDirectionChange">
				<el-option v-for="item in lightDirectionOptions" :key="item.vale" :label="item.label" :value="item.value" />
			</el-select>
		</div>
		<div class="content-row">
			<span class="title property">显示光源点</span>
			<el-switch v-model="showLightPoint" @change="onShowLightPointChange" />
		</div>
		<div class="content-row">
			<span class="title property">亮度</span>
			<el-slider v-model="lightBrightness" :max="5" :step="0.1" @change="onBrightnessChange" />
		</div>
		<div class="content-row">
			<span class="title property">饱和度</span>
			<el-slider v-model="lightSaturation" :max="5" :step="0.1" @change="onSaturationChange" />
		</div>
		<div class="content-row">
			<span class="title property">颜色</span>
			<el-color-picker v-model="lightColor" @change="onColorChange" show-alpha />
		</div>
	</div>
</speeddialog>
`,
			javascriptCode: `
import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import * as Cesium from "cesium";
import ModelInfo from '@/utils/modelInfo';

export default {
	name: "LightSource",
	data() {
		return {
			lightDirection: Speed.PointLightDirection.UP_TO_DOWN,
			lightDirectionOptions: [
				{label: "上", value: Speed.PointLightDirection.UP_TO_DOWN},
				{label: "下", value: Speed.PointLightDirection.DOWN_TO_UP},
				{label: "西->东", value: Speed.PointLightDirection.WEST_TO_EAST},
				{label: "东->西", value: Speed.PointLightDirection.EAST_TO_WEST},
				{label: "南->北", value: Speed.PointLightDirection.SOUTH_TO_NORTH},
				{label: "北->南", value: Speed.PointLightDirection.NORTH_TO_SOUTH},
			],
			showLightPoint: true,
			lightBrightness: 1,
			lightSaturation: 1,
			lightColor: "#FFFF00",
		}
	},
	created() {
		this.mapId = uuid.v4();
	},
	beforeUnmount() {
		this.pointLight && this.pointLight.destroy();
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
			};
			const speedMap = new Speed.SpeedViewer();
			this.map = speedMap.init(data);

			this.tilesetLayer = new Speed.TilesetLayer();
			const tileset = this.tilesetLayer.loadTilesetLayer({
				url: ModelInfo.JIANGXINZHOU,
				type: 1,
			});
			this.tiles3dModel = tileset._tileset;
			speedMap.addLayer(this.tiles3dModel);
			speedMap.flyto(this.tiles3dModel);
		},
		initData() {
			const position = Cesium.Cartesian3.fromDegrees(118.692115, 32.024699, 500);
			this.pointLight = new Speed.PointLight(this.map._viewer, {
				showLightPoint: this.showLightPoint,
				position: position,
				direction: this.lightDirection,
				brightness: this.lightBrightness,
				saturation: this.lightSaturation,
				color: Cesium.Color.fromCssColorString(this.lightColor),
			});
		},
		onDirectionChange() {
			if (this.pointLight) {
				this.pointLight.direction = this.lightDirection;
			}
		},
		onShowLightPointChange() {
			if (this.pointLight) {
				this.pointLight.showLightPoint = this.showLightPoint;
			}
		},
		onBrightnessChange(val) {
			if (this.pointLight) {
				this.pointLight.brightness = this.lightBrightness;
			}
		},
		onSaturationChange(val) {
			if (this.pointLight) {
				this.pointLight.saturation = this.lightSaturation;
			}
		},
		onColorChange(val) {
			if (this.pointLight) {
				this.pointLight.color = Cesium.Color.fromCssColorString(val);
			}
		},
	}
}`,
		};
	},
};
</script>

<style scoped></style>
