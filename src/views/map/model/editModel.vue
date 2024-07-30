<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>
</template>

<script>
import mapBox from '@/components/mapBox'
export default {
	name: "editModel",
	components: {
		mapBox
	},
	data() {
		return {
			cssCode: `.ktmap {
	width: 100%;
	height: 100%;
	background-color: #000;
	position: relative;
}

.tools {
    position: absolute;
    margin: 10px;
	margin-left: 60px;
    padding: 10px;
    z-index: 10;
  }
			`,
			htmlCode: `<div :id="mapid" class="ktmap">
		<div class="tools">
			<el-button class="btnTool" @click="start()">开始编辑</el-button>
			<el-button class="btnTool" @click="distance()">平移</el-button>
			<el-button class="btnTool" @click="rotation()">旋转</el-button>
			<el-button class="btnTool" @click="destroy()">关闭编辑</el-button>
		</div>
	</div>
			`,
			javascriptCode: `
			import * as uuid from "uuid";
import * as Speed from "@/cesiumSDK/index";
import * as Cesium from 'cesium'

let gltf = undefined;
let editObj = undefined;

export default {
	name: "editModel",
	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap();

		this.initdata();
	},
	methods: {
		initMap() {
			let option = {
				tiles3dModel: undefined,
				containID: this.mapid,
				scene: { FPS: true, depthTestTerrain: true }, //显示帧率
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
				statusBar: true,//状态栏
			};

			// 初始化实例
			this.speedMap = new Speed.SpeedViewer();
			this.viewer = this.speedMap.init(option);
		},

		initdata() {
			const position = Cesium.Cartesian3.fromDegrees(118.708695, 32.053089, 1000);
			let heading = Cesium.Math.toRadians(0);
			//弧度的螺距分量。
			let pitch = 0;
			//滚动分量（以弧度为单位）
			let roll = 0;
			//HeadingPitchRoll旋转表示为航向，俯仰和滚动。围绕Z轴。节距是绕负y轴的旋转。滚动是关于正x轴。
			let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
			let orientation = Cesium.Transforms.headingPitchRollQuaternion(
				position,
				hpr
			);

			gltf = this.viewer._viewer.entities.add({
				name: "Gltf模型Entity形式",
				position: position,
				orientation: orientation,
				model: {
					uri: "http://36.152.66.51:8088/3dtiles/gltf/walk.gltf",
					scale: 100,
				},
			});
			this.viewer._viewer.flyTo(this.viewer._viewer.entities);
		},
		start() {

			editObj = new Speed.EditGltf4Entity(this.viewer._viewer, gltf, 1, 1);
		},
		distance() {
			editObj && editObj.editTranslation();
		},
		rotation() {
			editObj && editObj.editRtation();
		},
		destroy() {
			editObj && editObj.destroy();
		},
		getLocation() {
			let handler = new Cesium.ScreenSpaceEventHandler(this.viewer._viewer.canvas);
			handler.setInputAction(function (event) {
				let earthPosition = this.viewer._viewer.scene.pickPosition(event.position);
				if (Cesium.defined(earthPosition)) {
					let cartographic = Cesium.Cartographic.fromCartesian(earthPosition);
					let lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
					let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);
					let height = cartographic.height.toFixed(2);
					console.log(earthPosition, {
						lon: lon,
						lat: lat,
						height: height,
					});
				}
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		},
	},
}
			`
		}
	}

}
</script>

<style scoped></style>
