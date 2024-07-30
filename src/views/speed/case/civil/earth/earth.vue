<template>
	<div class="cover_back">
		<div class="login_title"></div>
		<div class="login_content">
			<el-button type="text" class="login-btn" @click="loginFn"></el-button>
		</div>
	</div>
	<!-- <div class="chkModel" v-show="!card1">
		<el-form>
			<el-button @click="zoomToHQModel" type="primary" title="定位至红旗街道倾斜">红旗街道</el-button>
			<el-button @click="zoomToYYCModel" type="primary" title="定位至渔业村倾斜">渔 业 村</el-button>
		</el-form>

	</div>

	<div class="home-bottom">
		<div class="toolbar" @click="btnEvent(1)">
			<el-image v-show="card1" class="bottom_img" :src="imgLst.url1"></el-image>
			<el-image v-show="!card1" class="bottom_img" :src="imgLst.url2"></el-image>
		</div>

		<div class="toolbar" @click="btnEvent(2)">
			<el-image v-show="card2" class="bottom_img" :src="imgLst.url3"></el-image>
			<el-image v-show="!card2" class="bottom_img" :src="imgLst.url4"></el-image>
		</div>
		<div class="toolbar" @click="btnEvent(3)">
			<el-image v-show="card3" class="bottom_img" :src="imgLst.url5"></el-image>
			<el-image v-show="!card3" class="bottom_img" :src="imgLst.url6"></el-image>
		</div>
	</div> -->
</template>

<script>
import ModelInfo from '@/utils/modelInfo'
import address_data from "../address/data";
import doorData from "../doorplate/doorData";
import * as Cesium from "cesium";
import * as Speed from "@/cesiumSDK/index";


export default {
	data() {
		return {
			card1: false,
			card2: true,
			card3: true,
			imgLst: {
				url1: require('@/assets/speed/case/civil/bt_qxqj_nor.png'),
				url2: require('@/assets/speed/case/civil/bt_qxqj_sel.png'),
				url3: require('@/assets/speed/case/civil/bt_dmqj_nor.png'),
				url4: require('@/assets/speed/case/civil/bt_dmqj_sel.png'),
				url5: require('@/assets/speed/case/civil/bt_mpqj_nor.png'),
				url6: require('@/assets/speed/case/civil/bt_mpqj_sel.png'),
			},
			address: address_data,
			allDoorData: doorData,
		}
	},
	mounted() {
		// Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(90, -20, 110, 90);//设置相机初始位置为中国上空
		// this.$map._viewer.camera.setView({
		// 	destination: Cesium.Cartesian3.fromDegrees(90, -20, 110),
		// 	orientation: {
		// 		heading: Cesium.Math.toRadians(0), //绕垂直于地心的轴旋转
		// 		pitch: Cesium.Math.toRadians(-90), //绕纬度线旋转
		// 		roll: Cesium.Math.toRadians(0) //绕经度线旋转
		// 	},
		// });
		this.$emit('loginFn')

		this.$map._viewer.camera.setView({
			destination: Cesium.Cartesian3.fromDegrees(116.404269, 39.922793, 19999999),
		})
		// 地球球体自转
		this.globeRotate = new Speed.GlobeRotate(this.$map._viewer);
		this.globeRotate.start();
	},
	methods: {
		loginFn() {
			if (this.globeRotate) {
				this.globeRotate.stop();
			}
			this.$emit('login')
			this.$router.push('/case/civil/countryside');
		},
		btnEvent(type) {
			if (type == 1) {
				if (this.card1) {
					this.load3dModel()
				} else {
					this.remove3DModel()
				}
				this.card1 = !this.card1
			}
			if (type == 2) {
				if (this.card2) {
					this.loadAddress()
				} else {
					this.removeAddress()
				}
				this.card2 = !this.card2
			}
			if (type == 3) {
				if (this.card3) {
					this.loadDoor()
				} else {
					this.removeDoor()
				}
				this.card3 = !this.card3
			}
		},
		load3dModel() {
			this.$emit("load3dModel", {
				modelUrl: ModelInfo.xincheng,
				alt: -15,
			},)
			this.$emit("loadYYCModel", {
				modelUrl: ModelInfo.yuyecun,
				alt: -15.00,
			})
		},
		remove3DModel() {
			this.$emit("remove3DModel")
		},
		loadAddress() {
			let center = {
				destination: Cesium.Cartesian3.fromDegrees(130.321334, 46.791356, 1000),
				orientation: {
					heading: Cesium.Math.toRadians(0),
					pitch: Cesium.Math.toRadians(-45),
					roll: Cesium.Math.toRadians(0)
				}
			};
			this.$emit("flyto", center)

			this.$emit("onlyAddress", this.address, 1, true)
		},
		removeAddress() {
			this.$emit("closeAddress")
		},
		loadDoor() {
			let center = {
				destination: Cesium.Cartesian3.fromDegrees(132.842389, 47.935849, 800),
				orientation: {
					heading: Cesium.Math.toRadians(0),
					pitch: Cesium.Math.toRadians(-45),
					roll: Cesium.Math.toRadians(0)
				}
			};
			this.$emit("flyto", center)
			this.$emit("doorolate", this.allDoorData, true)

		},
		removeDoor() {
			this.$emit("closeDoor")
		},
		zoomToHQModel() {
			this.$emit("zoomToHQModel")
		},
		zoomToYYCModel() {
			this.$emit("zoomToYYCModel")
		}
	},
	// unmounted() {
	// 	if (this.globeRotate) {
	// 		this.globeRotate.stop();
	// 	}
	// }
}
</script>

<style scoped>
.cover_back {
	position: fixed;
	background: url("@/assets/speed/case/civil/bg_login.png");
	background-size: 100% 100%;
	width: 100%;
	height: 100%;
	z-index: 9999;
	top: 0;
	left: 0;
}

.login_title {
	background: url("@/assets/speed/case/civil/login_title.png");
	background-size: 100% 100%;
	width: 56.57%;
	height: 20.58%;
	position: absolute;
	top: 39.71%;
	left: 21.715%;
}

.login_content {
	background: url("@/assets/speed/case/civil/bt_jrxt_nor.png");
	background-size: 100% 100%;
	width: 14.64%;
	height: 9.05%;
	position: absolute;
	left: 42.68%;
	bottom: 10%;
}

.login-btn {
	width: 100%;
	height: 100%;
}

.chkModel {
	position: fixed;
	top: 10%;
	left: 2%;
	z-index: 5;
	width: 7%;
	height: 16%;
	/* background-color: rgb(6 34 62 / 80%);
	box-shadow: 0 4px 15px 1px #02213bb3;
	border: 1px solid #008aff70; */
	padding: 1%;
}

/* .el-button {
	color: white;
	width: 80px;
	height: 32px;
	margin: 5px;
} */

.title {
	color: white;
	font-size: 15px;
	font-weight: bold;
	margin-bottom: 10px;
}

.el-checkbox {
	color: #ffffff;
}

.home-bottom {
	width: 30%;
	height: 4.5%;
	position: fixed;
	left: 35%;
	bottom: 5.4%;
	z-index: 10;
	text-align: center;
}

.toolbar {
	display: inline-block;
	position: relative;
	bottom: 100%
}
</style>
