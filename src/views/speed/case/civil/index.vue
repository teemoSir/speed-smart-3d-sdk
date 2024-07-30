<template>
	<div class="civil">
		<civil-map ref="civilMap" />
		<div class="civil_top" v-if="activiteID != 0">
			<div v-for="item in menus" :key="item.id" class="tip_menu"
				:class="[item.id == 1 ? 'fisrt' : '', item.id == activiteID ? 'activiteClass' : '']"
				@click="activite(item)">
				{{ item.name }}
			</div>


			<div class="closeBtn" @click="closeFn">
				<el-image class="closeImg" :src="require('@/assets/speed/case/civil/close.png')" />
				&nbsp退出
			</div>

			<!-- <div v-for="item in menus1" :key="item.id" class="tip_menu"
				:class="[item.id == 2 ? 'fisrt' : '', item.id == activiteID ? 'activiteClass' : '']"
				@click="activite(item)">
				{{ item.name }}
			</div>

			<div v-for="item in menus2" :key="item.id" class="tip_menu"
				:class="[item.id == 4 ? 'second' : '', item.id == activiteID ? 'activiteClass' : '']"
				@click="activite(item)">
				{{ item.name }}
			</div> -->

		</div>
		<div class="contactInfo" v-if="activiteID != 0">联系我们
			<div class="contactDialog">
				<el-image class="contact_img" :src="require('@/assets/speed/case/civil/ewm.png')" fit="fill" />
			</div>
		</div>

		<router-view ref="child" @flyCunAddress="flyCunAddress" @loadCunData="loadCunData" @flyLabel="flyLabel"
			@communityFn="communityData" @loadRangeData="loadRangeData" @closeRangeData="closeRangeData" @address="address"
			@doorolate="doorolate" @zoomtoDoor="zoomtoDoor" @flyAddress="flyAddress" @load3dModel="load3dModel"
			@remove3DModel="remove3DModel" @closeAddress="closeAddress" @closeDoor="closeDoor" @searchDTH="searchDTH"
			@loadYYCModel="loadYYCModel" @zoomToHQModel="zoomToHQModel" @zoomToYYCModel="zoomToYYCModel"
			@loadGridData="loadGridData" @removeGridData="removeGridData" @flyto="flyto" @onlyAddress="onlyAddress"
			@loadPOIData="loadPOIData" @loadGGSSData="loadGGSSData" @zoomToGGSS="zoomToGGSS" @zoomToPOI="zoomToPOI"
			@loadBMFWData="loadBMFWData" @removeBMFWData="removeBMFWData" @loadSQData="loadSQData"
			@loadHNZNData="loadHNZNData" @removeHNZNData="removeHNZNData" @removeGGSSData="removeGGSSData"
			@closeGGSSPuop="closeGGSSPuop" @login="login" @loginFn="loginFn" @loadRoadData="loadRoadData">
		</router-view>

	</div>
</template>

<script>

import civilMap from "./map/map.vue";
import ModelInfo from '@/utils/modelInfo'


export default {
	components: { civilMap },
	data() {
		return {
			activiteID: 0,
			menus: [
				// {
				// 	id: 0,
				// 	name: "智慧民政",
				// 	router: "/speed/case/civil/earth"
				// },
				{
					id: 1,
					name: "智慧乡村",
					router: "/case/civil/countryside"
				},
				{
					id: 2,
					name: "社会保障",
					router: "/case/civil/security"
				},
				{
					id: 3,
					name: "道路门牌",
					router: "/case/civil/doorplate"
				},
				{
					id: 4,
					name: "文化旅游",
					router: "/case/civil/tourism"
				},
				{
					id: 5,
					name: "智慧社区",
					router: "/case/civil/community"
				},
				{
					id: 6,
					name: "地名地址",
					router: "/case/civil/address"
				},
			],
			menus1: [

				{
					id: 2,
					name: "地名地址",
					router: "/case/civil/address"
				},
				{
					id: 3,
					name: "智慧社区",
					router: "/case/civil/community"
				},
				{
					id: 7,
					name: "智慧乡村",
					router: "/case/civil/countryside"
				},
			],
			menus2: [
				{
					id: 4,
					name: "社会保障",
					router: "/case/civil/security"
				},
				{
					id: 5,
					name: "道路门牌",
					router: "/case/civil/doorplate"
				},
				{
					id: 6,
					name: "文化旅游",
					router: "/case/civil/tourism"
				}
			],

		}
	},
	mounted() {
		this.activiteID = this.$route.meta.id
	},

	methods: {
		loginFn() {
			this.activiteID = 0
			this.$refs.civilMap.showStausBar(false);
			// this.$refs.civilMap.setView()
			this.closeFn()
		},
		login() {
			this.activiteID = 1
			this.$refs.civilMap.showStausBar(true);
		},
		closeFn() {
			this.$refs.civilMap.closePOIData();
			this.$refs.civilMap.closeGGSSData();
			this.$refs.civilMap.removeAllHNZNData()
			this.$refs.civilMap.removeCunData()
			this.$refs.civilMap.clearDoorData(true);
			this.$refs.civilMap.removeYYCDTHData()
			this.closeCommunity()
			this.closeRangeData()
			this.removeGridData()
			this.$refs.civilMap.closePopup()
			this.$refs.civilMap.removeYYCModel()
			this.$refs.civilMap.removeHQModel()
			this.closeAddress();
			this.$refs.civilMap.closePopup()

			this.$router.push('/case/civil/earth');
		},
		load3dModel(data) {
			this.$refs.civilMap.loadModel(data);
		},
		loadYYCModel(data) {

			this.$refs.civilMap.loadYYCModel(data);
		},
		remove3DModel() {
			this.$refs.civilMap.remove3dModel();
		},
		closeAddress() {
			this.$refs.civilMap.closeAddress();
		},

		flyAddress(data) {
			this.$refs.civilMap.flyAddress(data);
		},
		address(data, type, home) {
			this.$refs.civilMap.loadModel({
				name: "新城社区",
				modelUrl: ModelInfo.xincheng,
				alt: -15.00,
				isDTH: true,
				dthUrl: ModelInfo.CAXC
			});
			if (type == 1) {
				this.$refs.civilMap.locationAddress(data, home);
			}

		},
		onlyAddress(data, home) {
			this.$refs.civilMap.locationAddress(data, home);
		},

		activite(item) {
			this.activiteID = item.id
			this.$router.push({ path: item.router })

			if (this.activiteID == 0) {

			}
			if (this.activiteID != 1) {
				this.$refs.civilMap.closePOIData();
				this.$refs.civilMap.closeGGSSData();
				this.$refs.civilMap.removeAllHNZNData()
			}
			if (this.activiteID != 2) {
				this.$refs.civilMap.removeCunData()
			}
			if (this.activiteID != 3) {
				this.$refs.civilMap.clearDoorData(true);
				this.$refs.civilMap.removeYYCDTHData()
			}
			if (this.activiteID != 4) {

			}
			if (this.activiteID != 5) {
				this.closeCommunity()
				this.closeRangeData()
				this.removeGridData()
				this.$refs.civilMap.closePopup()
			}
			if (this.activiteID == 5) {
				this.$refs.civilMap.removeYYCModel()
			}
			if (this.activiteID != 5 && this.activiteID != 6) {
				this.$refs.civilMap.removeHQModel()
			}

			if (this.activiteID != 6) {
				this.closeAddress();
				this.$refs.civilMap.closePopup()
			}

		},
		zoomToHQModel() {
			this.$refs.civilMap.zoomToHQModel()
		},
		zoomToYYCModel() {
			this.$refs.civilMap.zoomToYYCModel()
		},
		communityData(model, data) {
			this.$refs.civilMap.loadCommunityData(model, data);
		},
		removeGridData() {
			this.$refs.civilMap.removeGridData();
		},
		loadGridData(gridData, gridMans) {
			this.$refs.civilMap.loadGridData(gridData, gridMans);
		},
		searchDTH(options) {
			this.$refs.civilMap.searchDTH(options);
		},
		loadRangeData(rangeData) {
			this.$refs.civilMap.loadRangeData(rangeData);
		},
		closeRangeData() {
			this.$refs.civilMap.closeRangeData();
		},
		closeCommunity() {
			this.$refs.civilMap.removeCommunityData();
			this.$refs.civilMap.removeAllBMFWData()
		},
		doorolate(data, home) {
			// this.$refs.civilMap.loadModel({
			// 	name: "新城社区",
			// 	modelUrl: ModelInfo.xincheng,
			// 	alt: -15.00,
			// 	isDTH: true,
			// 	dthUrl: ModelInfo.CAXC
			// });
			this.$refs.civilMap.loadYYCModel({
				name: "渔业村",
				modelUrl: ModelInfo.yuyecun,
				alt: -15.00,
				isDTH: true,
				dthUrl: ModelInfo.YYC
			});
			this.$refs.civilMap.zoomToYYCModel()
			this.$refs.civilMap.loadDoorData(data, home);

		},
		loadRoadData(data){
			this.$refs.civilMap.loadRoadData(data)
		},
		zoomtoDoor(data) {
			this.$refs.civilMap.zoomtoDoor(data);
		},
		closeDoor(data) {
			this.$refs.civilMap.clearDoorData(data);
		},
		flyLabel(data) {
			this.$refs.civilMap.flyLabel(data);
		},
		loadCunData(datas) {
			this.$refs.civilMap.loadCunData(datas);
		},
		flyCunAddress(data) {
			this.$refs.civilMap.flyCunAddress(data);
		},
		flyto(options) {
			this.$refs.civilMap.flyto(options);
		},
		loadPOIData(data) {
			this.$refs.civilMap.loadPOIData(data);
		},
		loadGGSSData(data, isZoom) {
			this.$refs.civilMap.loadGGSSData(data, isZoom);
		},
		removeGGSSData(data) {
			this.$refs.civilMap.removeGGSSData(data);
		},
		closeGGSSPuop() {
			this.$refs.civilMap.closeGGSSPuop();

		},
		zoomToGGSS(value) {
			this.$refs.civilMap.zoomToGGSS(value);
		},
		zoomToPOI(value) {
			this.$refs.civilMap.zoomToPOI(value);

		},
		loadBMFWData(type, data) {
			this.$refs.civilMap.loadBMFWData(type, data);
		},
		removeBMFWData(type, data) {
			this.$refs.civilMap.removeBMFWData(type, data);
		},
		loadSQData(data) {
			this.$refs.civilMap.loadSQData(data);
		},
		loadHNZNData(data) {
			this.$refs.civilMap.loadHNZNData(data);
		},
		removeHNZNData(data) {
			this.$refs.civilMap.removeHNZNData(data);
		}
	}
};

</script>

<style scoped>
.civil {
	position: relative;
	width: 100%;
	height: 100%;
}

.civil_top {
	position: fixed;
	background: url("@/assets/speed/case/civil/top1.png");
	background-size: 100% 100%;
	width: 100%;
	height: 12.3%;
	z-index: 100;
	top: 0%;
}

.contactInfo {
	position: fixed;
	width: 4%;
	height: 2%;
	z-index: 100;
	bottom: 0.3%;
	left: 1%;
	cursor: pointer;
	color: white;
	font-size: 13px;
	overflow: hidden;
	text-overflow: ellipsis;
}

.contactInfo:hover {
	color: #008cff;
}

.contactInfo:hover .contactDialog {
	display: block;
}

.contactDialog {
	display: none;
	position: fixed;
    width: 8%;
    height: 8%;
    z-index: 100;
    bottom: 14%;
    left: 1%;
}

.activiteClass {
	background: url("@/assets/speed/case/civil/tab.png") no-repeat;
	background-size: 100% 100%;
}

.closeBtn {
	position: fixed;
	width: 4%;
	height: 4%;
	color: #00D8FF;
	font-size: 15px;
	font-weight: 700;
	display: flex;
	align-items: center;
	right: 0.5%;
	top: 1.5%;
	cursor: pointer;
	overflow: hidden;
	text-overflow: ellipsis;
}

.closeImg {
	width: 29.05%;
	height: 60%;
}

.tip_menu {
	width: 9%;
	height: 60%;
	display: inline-block;
	text-align: center;
	color: white;
	font-size: 20px;
	padding-top: 0.8%;
	/* margin-left: 1%; */
	font-family: PangMenZhengDao-3, PangMenZhengDao-3-Regular;
	letter-spacing: 1.2px;
	text-shadow: -2px 0px 8px 2px rgba(9, 35, 81, 0.90);
}

.tip_menu:hover {
	cursor: pointer;
	color: lightseagreen;
}

.fisrt {
	margin-left: 40%
}

.second {
	margin-left: 44%
}
</style>
