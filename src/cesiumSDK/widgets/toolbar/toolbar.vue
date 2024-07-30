<template>
	<div>
		<div class="toolbar">
			<el-tooltip class="tooltip home" content="初始视图" placement="right" effect="light" hide-after="1">
				<el-button class="btn homeBtn" type="primary" v-show="options.initViewButton" @click="homeFn">
					<img src="img/speed3d/主页.png">
				</el-button>
			</el-tooltip>
			<el-tooltip class="tooltip zoomin" content="放大" placement="right" effect="light" hide-after="1">
				<el-button class="btn zoominBtn" type="primary" v-show="options.zoominButton" @click="zoominFn">
					<img src="img/speed3d/放大.png">
				</el-button>
			</el-tooltip>
			<el-tooltip class="tooltip zoomout" content="缩小" placement="right" effect="light" hide-after="1">
				<el-button class="btn zoomoutBtn" type="primary" v-show="options.zoomoutButton" @click="zoomoutFn">
					<img src="img/speed3d/缩小.png">
				</el-button>
			</el-tooltip>

			<div class="view">
				<el-tooltip class="tooltip view" content="三维视图" placement="bottom" effect="light" hide-after="1">
					<el-button class="btn viewBtn" type="primary" v-show="options.viewButton" @click="view3DFn">
						<img src="img/speed3d/三维视图.png">
					</el-button>
				</el-tooltip>
				<el-tooltip class="tooltip view" content="哥伦布2.5D视图" placement="bottom" effect="light" hide-after="1">
					<el-button class="btn viewBtn" type="primary" v-show="isShowView" @click="view25DFn">
						<img src="img/speed3d/2.5视图.png">
					</el-button>
				</el-tooltip>
				<el-tooltip class="tooltip view" content="二维视图" placement="bottom" effect="light" hide-after="1">
					<el-button class="btn viewBtn" type="primary" v-show="isShowView" @click="view2DFn">
						<img src="img/speed3d/二维视图.png">
					</el-button>
				</el-tooltip>
			</div>

			<el-tooltip class="tooltip mapbox" content="选择地图与地形" placement="right" effect="light" hide-after="1">
				<el-button class="btn mapboxBtn" @click="isShowMapBox = !isShowMapBox" v-show="options.mapboxButton">
					<img class="img" src="img/basemaps/地球.png">
				</el-button>
			</el-tooltip>
			<el-tooltip class="tooltip fullview" content="全屏" placement="right" effect="light" hide-after="1">
				<el-button class="btn fullviewBtn" type="primary" v-show="options.fullviewButton" @click="fullviewFn">
					<img src="img/speed3d/全屏.png">
				</el-button>
			</el-tooltip>
		</div>
		<baseMapSelector v-show="isShowMapBox" :terrains="options.terrains" :basemaps="options.basemaps"
			:viewer="viewer" />

	</div>
</template>

<script>
import baseMapSelector from '../baseMapSelector';
import * as Cesium from 'cesium'
// import CesiumNavigation from "cesium-navigation-es6";

export default {
	name: "toolbar",
	props: {
		options: Object,
		viewer: Object
	},

	watch: {
		viewer: {
			deep: true,
			handler: function (newVal, oldVal) {

			}
		},
		options: {
			deep: true,
			handler: function (newVal, oldVal) {
				this.$nextTick(() => {

				})
			}
		},
	},

	data() {
		return {
			isShowMapBox: false,
			isShowView: false,

		}
	},
	mounted() {
		// var opts = {};
		// // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
		// opts.defaultResetView = Cesium.Rectangle.fromDegrees(110, 20, 120, 30);
		// // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
		// opts.enableCompass = this.options.compass;
		// // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
		// opts.enableCompassOuterRing = this.options.compass;
		// // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
		// opts.enableZoomControls = false;
		// // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
		// opts.enableDistanceLegend = this.options.distanceLegend;
		// new CesiumNavigation(this.viewer, opts);

	},
	methods: {
		homeFn() {
			if (this.options.center) {
				var optsClone = {};
				optsClone.destination = Cesium.Cartesian3.fromDegrees(this.options.center.lng, this.options.center.lat, this.options.center.alt); //经度、纬度、高度
				optsClone.orientation = {
					heading: Cesium.Math.toRadians(Cesium.defaultValue(this.options.center.heading, 0)), //绕垂直于地心的轴旋转
					pitch: Cesium.Math.toRadians(Cesium.defaultValue(this.options.center.pitch, -90)), //绕纬度线旋转
					roll: Cesium.Math.toRadians(Cesium.defaultValue(this.options.center.roll, 0)) //绕经度线旋转
				};
				this.viewer.camera.flyTo(optsClone);
			}
		},
		view3DFn() {
			if (this.isShowView) {
				this.viewer.scene.morphTo3D()
			}
			this.isShowView = !this.isShowView
		},
		view25DFn() {
			this.viewer.scene.morphToColumbusView()
			this.isShowView = !this.isShowView
		},
		view2DFn() {
			this.viewer.scene.morphTo2D()
			this.isShowView = !this.isShowView
		},
		fullviewFn() {
			Cesium.Fullscreen.requestFullscreen(document.body)
		},
		zoominFn() {
			let position = this.viewer.camera.position;
			let cameraHeight = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
			// 每次缩小 20 倍，参数可改
			let moveRate = cameraHeight / 20.0;
			this.viewer.camera.moveForward(moveRate);
		},
		zoomoutFn() {
			let position = this.viewer.camera.position;
			let cameraHeight = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
			// 每次缩小 20 倍，参数可改
			let moveRate = cameraHeight / 20.0;
			this.viewer.camera.moveBackward(moveRate);
		},
	},
}
</script>

<style scoped>
.toolbar {
	position: absolute;
	z-index: 999;
	left: 2rem;
	bottom: 5rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: space-around;
}

.btn {
	width: 36px;
	height: 36px;
	background-color: rgba(23, 49, 71, 0.7);
	color: white;
	border: none;
	margin: 4px;

}

.btn:hover {
	background-color: rgba(0, 195, 255, 0.863);
}

.img {
	width: 36px;
	height: 36px;
}
</style>

<style>
/* 罗盘定位 */
.compass {
	position: absolute;
	left: 0px;
	top: 30px;
}

.distance-legend {
	position: absolute;
    left: 3px;
	bottom: 10px;
	color: rgb(255, 255, 255);
}
</style>
