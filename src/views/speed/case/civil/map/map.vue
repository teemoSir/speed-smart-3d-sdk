<template>
	<div class="civil_map" :id="mapid"></div>
	<div id="housePoup" class="housePoup">
		<!-- <div class="popup-background"> -->
		<div class="popleInfo">
			<ul class="master">
				<li class="masterList ">户主姓名：<span class="list-content">{{ peoplename }}</span></li>
				<li class="masterList ">同住人数：<span class="list-content">{{ peopleNum }}人</span></li>
			</ul>
			<ul class="masterinfo">
				<li class="masterList">男性：<span class="list-content">1人</span>
					&nbsp&nbsp 女性：
					<span class="list-content">{{ peopleNum - 1 }}人</span>
				</li>
				<li class="masterList">网格员姓名：<span class="list-content">林佳</span></li>
				<li class="masterList">网格员电话：<span class="list-content">18745450505</span></li>
			</ul>

		</div>

		<div class="roomInfo">
			<el-image class="roomInfo-pic" :src="curPhotos[0]" :preview-src-list="curPhotos" fit="contain"
				hide-on-click-modal="true" />
			<el-image class="roomInfo-pic" :src="imageUrls[0]" :zoom-rate="1.2" :preview-src-list="imageUrls"
				fit="contain" />
		</div>

	</div>
	<div id="addressPoup">
		<div class="diming">
			<p>标准名称：{{ checkedAddress.标准名称 }}</p>
			<p>地名代码：{{ checkedAddress.地名代码 }}</p>
			<p class="diminglaili">地名来历：{{ checkedAddress.地名的来历 }}</p>
		</div>

		<div class="biaozhi">
			<div v-for="item in dmbz" :key="item.标志代码" class="biaozhi_content">
				<p>标准地名：{{ item.标准地名 }}</p>
				<p>标志代码：{{ item.标志代码 }}</p>
			</div>
		</div>
	</div>

	<div id="communtiyPoup">
		<!-- <div class="title">{{ curCommuntiyData.name }}</div> -->
		<div class="gridtitle">
			<div class="wgbh">{{ curCommuntiyData.name }}</div>
			<span class="close-button" @click="closeCommuntiyPuop">×</span>
		</div>
		<!-- <div class="communtiy"> -->
		<div class="wg_message">三级网格长：{{ curCommuntiyData.网格长 }}</div>
		<div class="wg_message">职务：{{ curCommuntiyData.职务 }}</div>
		<!-- <hr /> -->
		<div class="wg_message">户数：{{ curCommuntiyData.户数 }} 户</div>
		<div class="wg_message">人口：{{ curCommuntiyData.人口 }} 人</div>
		<div class="wg_message">网格：{{ curCommuntiyData.网格 }} 个</div>
		<!-- </div> -->
	</div>

	<div id="gridPopup" class="gridPopup">
		<div class="gridtitle">
			<div class="wgbh">{{ gridInfo.gridNo }}网格</div>
			<span class="close-button" @click="closeGridPuop">×</span>
		</div>
		<div class="grid_message lymc">楼宇名称：{{ gridInfo.buildings }}</div>
		<div class="grid_message hs">户数：{{ gridInfo.house }}</div>
		<div class="grid_message rk">人口：{{ gridInfo.population }}</div>
		<div class="grid_message wgy">网格员：{{ gridInfo.name }}</div>
		<div class="grid_message zw">职务：{{ gridInfo.post }}</div>
		<div class="grid_message lxdh">联系电话：{{ gridInfo.tel }}</div>
	</div>

	<div id="poiPopup" class="poiPopup">
		<div class="poititle">
			<div class="poiname">{{ poiTitle }}</div>
			<span class="close-button" @click="closePOIPuop">×</span>
		</div>
		<div class="poi_message ">名称：{{ poiDatas.名称 }}</div>
		<div class="poi_message ">地址：{{ poiDatas.地址 }}</div>
		<div class="poi_message ">电话：{{ poiDatas.电话 }}</div>
		<div class="poi_message poi_remark">说明：{{ poiDatas.备注 }}</div>
	</div>

	<div id="ggssPopup" class="ggssPopup">
		<div class="ggsstitle">
			<div class="ggssname">{{ ggssDatas.类型 }}</div>
			<span class="close-button" @click="closeGGSSPuop">×</span>
		</div>
		<div class="ggss_message ">编号：{{ ggssDatas.编号 }}</div>
		<div class="ggss_message " v-if="ggssDatas.名称 != undefined">名称：{{ ggssDatas.名称 }}</div>
		<div class="ggss_message ">状态：<span :style="ggssDatas.状态 == '正常' ? 'color:green;' : 'color:red;'">{{
			ggssDatas.状态 }}</span></div>
		<div class="ggss_message ">地址：{{ ggssDatas.地址 }}</div>
		<div class="ggss_message " v-if="ggssDatas.归属 != undefined">归属：{{ ggssDatas.归属 }}</div>
		<div class="ggss_message ">负责人：{{ ggssDatas.负责人 }}</div>
		<div class="ggss_message ">电话：{{ ggssDatas.电话 }}</div>
	</div>

	<div id="jkPopup" class="jkPopup">
		<div class="ggsstitle">
			<div class="ggssname">监控详情</div>
			<span class="close-button" @click="closeGGSSPuop">×</span>
		</div>
		<div class="jk_content">
			<div class="control_message">
				<div class="jk_message ">编号：{{ ggssDatas.编号 }}</div>
				<div class="jk_message ">型号：{{ ggssDatas.型号 }}</div>
				<div class="jk_message ">朝向：{{ ggssDatas.朝向 }}</div>
				<div class="jk_message ">状态：<span :style="ggssDatas.状态 == '正常' ? 'color:green;' : 'color:red;'">{{
					ggssDatas.状态 }}</span></div>
				<div class="jk_message ">地址：{{ ggssDatas.地址 }}</div>
				<div class="jk_message ">负责人：{{ ggssDatas.负责人 }}</div>
			</div>
			<div class="control_vedio">
				<video class="jk_vedio" controls poster loop autoplay muted>
					<source src="http://36.152.66.51:8088/video/JKvideo1.mp4" type="video/mp4">
				</video>
			</div>
		</div>


	</div>

	<div id="shbzPopup" class="shbz-popup">
		<div class="ggsstitle">
			<div class="ggssname">人员信息</div>
			<span class="close-button" @click="closeSHBZPopup">×</span>
		</div>
		<div class="base-info">
			<div class="photo-info">
				<el-image class="photo-img" :src="shbzData.photo" fit="cover" />
			</div>
			<div class="other-base-info">
				<div class="shbz-message ">姓名：<span class="message-color">{{ shbzData.name }}</span></div>
				<div class="shbz-message ">性别：<span class="message-color">{{ shbzData.sex }}</span></div>
				<div class="shbz-message ">年龄：<span class="message-color">{{ shbzData.age }}</span></div>
				<div class="shbz-message ">出生日期：<span class="message-color">{{ shbzData.birthDate }}</span></div>
				<div class="shbz-message ">联系电话：<span class="message-color">{{ shbzData.tel }}</span></div>
			</div>
		</div>
		<div class="other-info">
			<div class="shbz-message ">居住地址：<span class="message-color">{{ shbzData.village }} {{ shbzData.number }}</span>
			</div>
			<div class="shbz-message ">户籍地址：<span class="message-color">{{ shbzData.village }} {{ shbzData.number }}</span>
			</div>
			<div class="shbz-message ">备注说明：<span class="message-color">{{ shbzData.remarks }}</span></div>
		</div>
		<div class="relevant-info">
			<el-tabs v-model="activeName" class="tabs-style">
				<el-tab-pane label="监护人信息" name="first">
					<div class="tabs-item" v-if="activeName === 'first'">
						<div class="item-row">
							<div class="item-column">
								<div class="shbz-message margin-style">姓名：<span class="message-color">{{ shbzData.jhrxx.name
								}}</span></div>
								<div class="shbz-message margin-style">年龄：<span class="message-color">{{ shbzData.jhrxx.age
								}}</span></div>
							</div>
							<div class="item-column">
								<div class="shbz-message margin-style">性别：<span class="message-color">{{
									shbzData.jhrxx.gender }}</span></div>
								<div class="shbz-message margin-style">户主关系：<span class="message-color">{{
									shbzData.jhrxx.relationship }}</span></div>
							</div>
						</div>
						<div class="shbz-message">联系电话：<span class="message-color">{{ shbzData.jhrxx.telephone }}</span>
						</div>
						<div class="shbz-message">户籍地址：<span class="message-color">{{ shbzData.jhrxx.registeredAddress
						}}</span></div>
						<div class="shbz-message">居住地址：<span class="message-color">{{ shbzData.jhrxx.address }}</span></div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="紧急联系人" name="second">
					<div class="tabs-item" v-if="activeName === 'second'">
						<div class="item-row">
							<div class="item-column">
								<div class="shbz-message margin-style">姓名：<span class="message-color">{{ shbzData.jhrxx.name
								}}</span></div>
								<div class="shbz-message margin-style">年龄：<span class="message-color">{{ shbzData.jhrxx.age
								}}</span></div>
							</div>
							<div class="item-column">
								<div class="shbz-message margin-style">性别：<span class="message-color">{{
									shbzData.jhrxx.gender }}</span></div>
								<div class="shbz-message margin-style">户主关系：<span class="message-color">{{
									shbzData.jhrxx.relationship }}</span></div>
							</div>
						</div>
						<div class="shbz-message">联系电话：<span class="message-color">{{ shbzData.jhrxx.telephone }}</span>
						</div>
						<!-- <div class="shbz-message">户籍地址：<span class="message-color">{{ shbzData.jhrxx.registeredAddress
						}}</span></div>
						<div class="shbz-message">居住地址：<span class="message-color">{{ shbzData.jhrxx.address }}</span></div> -->
					</div>
				</el-tab-pane>
				<!-- <el-tab-pane label="养老机构" name="third">
          <div class="tabs-item" v-if="activeName === 'third'">
          </div>
        </el-tab-pane> -->
			</el-tabs>
		</div>
	</div>

	<div id="doorPopup" class="doorPopup">
		<div class="doortitle">
			<div class="doorname">门牌信息</div>
			<span class="close-button" @click="closeRoadPuop">×</span>
		</div>
		<div class="door_message ">门牌号：{{ curRoadData.门牌号 }}</div>
		<div class="door_message ">户主：{{ curRoadData.POI }}</div>
		<div class="door_message ">乡镇街道：{{ curRoadData.乡镇街道 }}</div>
		<div class="door_message ">地址：{{ curRoadData.街路 }}</div>
		<div class="door_message ">家庭成员：{{ curRoadData.家庭成员 }}人</div>
		<div class="door_message ">家庭状况：{{ curRoadData.家庭状况 }}</div>
	</div>

	<div id="roadPopup" class="roadPopup">
		<div class="doortitle">
			<div class="doorname">道路信息</div>
			<span class="close-button" @click="closeRoadPuop">×</span>
		</div>
		<div class="door_message ">名称：{{ curRoadData.name }}</div>
		<div class="door_message ">设立时间：{{ curRoadData.slsj }}</div>
		<div class="door_message ">行政区划：{{ curRoadData.xzqh }}</div>
		<div class="door_message roadInfo">地名含义：{{ curRoadData.dmhy }}</div>
		<div class="door_message roadInfo">历史沿革：{{ curRoadData.lsyg }}</div>
	</div>
</template>

<script>
import * as Speed from "@/cesiumSDK/index";
import * as uuid from "uuid";
import * as Cesium from "cesium";
import "@/cesiumSDK/core/material/ShuttleLineMaterialProperty";
import bz from "../address/bz.js";
import RECORDS from "../security/dlmp_tj";

let lastFeature = undefined

export default {
	name: "civilMap",
	data() {
		return {
			poiTitle: "地名信息",
			datalist: [],
			spherePositions: [],
			dmbz: [],
			address: [],
			checkedAddress: {},
			peoplename: "",
			peopleNum: 1,
			photos: [
				"http://36.152.66.51:8088/3dtiles/长安新城/长安新城1幢/1单元/201.jpg",
				"http://36.152.66.51:8088/3dtiles/长安新城/长安新城1幢/1单元/202.jpg",
				"http://36.152.66.51:8088/3dtiles/长安新城/长安新城1幢/2单元/201.jpg",
				"http://36.152.66.51:8088/3dtiles/长安新城/长安新城1幢/2单元/202.jpg",
				"http://36.152.66.51:8088/3dtiles/长安新城/长安新城1幢/3单元/201.jpg",
				"http://36.152.66.51:8088/3dtiles/长安新城/长安新城1幢/3单元/202.jpg",
				"http://36.152.66.51:8088/3dtiles/长安新城/长安新城1幢/3单元/203.jpg",
				"http://36.152.66.51:8088/3dtiles/长安新城/长安新城1幢/4单元/201.jpg",
				"http://36.152.66.51:8088/3dtiles/长安新城/长安新城1幢/4单元/202.jpg",
				"http://36.152.66.51:8088/3dtiles/长安新城/长安新城1幢/4单元/203.jpg",
			],
			curPhotos: [],
			loadCommuntiyData: [],
			curCommuntiyData: {},
			imageUrls: [require("@/assets/speed/case/civil/QRcode.png")],
			gridInfo: [],
			allGridMans: [],
			villagePOIDatas: [],
			poiDatas: [],
			villageGGSSDatas: [],
			ggssDatas: [],
			activeName: 'first',
			shbzData: {
				jhrxx: {}
			},
			sqDatas: [],
			hnznDatas: [],

			allDoorDatas: [],
			allRoadDatas: [],
			curRoadData: [],
		};
	},

	created() {
		this.mapid = uuid.v4();
	},
	watch: {},
	mounted() {
		this.initMap();
	},
	methods: {
		initMap() {
			let data = {
				containID: this.mapid,
				terrains: [
					{
						type: "xt",
						name: "星图地形",
						icon: "img/basemaps/terrain.png",
						tooltip: "星图地球提供的地形服务",
						url: "https://tiles1.geovisearth.com/base/v1/terrain",
						// type: "mars",
						// name: "火星地形",
						// icon: "img/basemaps/terrain.png",
						// tooltip: "火星科技提供的中国国内地形",
						// url: "http://data.mars3d.cn/terrain",
					},
				],
				basemaps: [
					{
						type: "xt",
						layers: [
							{ name: "底图", layer: "img_d" },
							{ name: "注记", layer: "img_z" },
						],
					},
				],
				// center: {
				// 	lat: 46.786217,
				// 	lng: 130.322039,
				// 	alt: 1200,
				// 	heading: 0,
				// 	pitch: -35,
				// },
				statusBar: true,
			};
			this.speedMap = new Speed.SpeedViewer();
			this.map = this.speedMap.init(data);
			window.app.config.globalProperties.$map = this.map;
		},
		showStausBar(value) {
			this.speedMap.showStausBar(value)
		},
		setView() {
			// this.map._viewer.camera.setView({
			// 	destination: Cesium.Cartesian3.fromDegrees(116.435314, 40.960521, 12000000.0),
			// });
		},

		loadCommunityData(modelData, communityData) {
			this.loadCommuntiyData = communityData;
			if (communityData != undefined && communityData.length > 0) {
				this.polylineMetry(communityData);
			}

			if (modelData != undefined && modelData.modelUrl != undefined)
				this.loadModel(modelData);
		},
		loadGridData(gridData, gridMans) {
			this.allGridMans = gridMans
			let that = this
			let graphicLayer = new Speed.GeoJsonLayer(this.map._viewer)
			const promise = graphicLayer.loadGeoJson({
				name: "新城社区网格",
				url: gridData,
				clampToGround: true,
				type: "polygon",
				symbol: {
					opacity: 0.4,
					outline: true,
					outlineWidth: 3,
					randomColor: true,
					show: false
				},
				label: {
					text: "{wgbm}",
					addtext: "网格",
					color: "#ffffff",
					background: true,
					backgroundColor: "rgba(12,20,43,0.5)",
					font: "12px Microsoft-Yahei",
					height: 120
				}
			})
			Promise.resolve(promise)
				.then(function (dataSource) {
					that.gridLayer = dataSource
					that.speedMap.addLayer(that.gridLayer)
				})
				.catch(function (error) {
					console.log(error)
				})
			this.bindGridEvent()
		},
		bindGridEvent() {
			let that = this;
			if (this.event) return;
			else {
				this.gridHander = new Speed.Cesium.ScreenSpaceEventHandler(
					that.map._viewer.scene.canvas
				);
				this.gridHander.setInputAction((movement) => {
					let pickedObject = that.map._viewer.scene.pick(movement.position);
					if (
						pickedObject != undefined &&
						pickedObject.primitive != undefined &&
						pickedObject.id != undefined &&
						pickedObject.primitive._text != undefined &&
						pickedObject.primitive._text.includes("网格")
					) {
						console.log(that.gridLayer._entityCollection._entities._array)
						that.gridLayer._entityCollection._entities._array.forEach((e) => {
							if (e._id == pickedObject.id._id && e._label._text._value == pickedObject.primitive._text) {
								let text = pickedObject.primitive._text
								text = text.replace('网格', '');
								let grids = that.allGridMans.filter((j) => j.gridNo == text)
								if (grids.length > 0) {
									that.gridInfo = grids[0];
								} else {
									that.gridInfo = that.allGridMans[0]
								}
								// 世界坐标转换为弧度
								let ellipsoid = that.map._viewer.scene.globe.ellipsoid;
								let cartographic = ellipsoid.cartesianToCartographic(e._position._value);
								// 弧度转换为经纬度
								let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
								let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
								let alt = cartographic.height; // 高度
								var obj = {
									lng: lng,
									lat: lat,
									height: alt,
								};

								let popupHtml = document.getElementById("gridPopup");
								popupHtml.style.display = "block";
								that.map._viewer.scene.preRender.addEventListener(function () {
									let position = Cesium.Cartesian3.fromDegrees(
										obj.lng,
										obj.lat,
										obj.height
									);
									let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(
										position
									);
									if (Cesium.defined(canvasPosition)) {
										popupHtml.style.position = "fixed";
										popupHtml.style.top =
											canvasPosition.y - popupHtml.offsetHeight - 10 + "px";
										popupHtml.style.left =
											canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
									}
								});
							}
						});
					} else {
						that.closeGridPuop();
					}
				}, Speed.Cesium.ScreenSpaceEventType.LEFT_CLICK);
			}
		},
		closeGridPuop() {
			let popupHtml = document.getElementById("gridPopup");
			popupHtml.style.display = "none";
		},
		removeGridData() {
			if (this.gridLayer) {
				this.map._viewer.dataSources.remove(this.map._viewer.dataSources.getByName('新城社区网格')[0])
				this.gridLayer == undefined;
			}
			this.closeGridPuop();
			if (this.gridHander) {
				this.gridHander.destroy();
				this.gridHander = undefined;
			}
		},
		polylineMetry(communityData) {
			const img = require("@/assets/speed/case/civil/line.png");
			let viewer = this.map._viewer;
			this.communityPolylines = viewer.scene.primitives.add(
				new Cesium.PolylineCollection()
			);
			this.communityLabel = viewer.scene.primitives.add(new Cesium.LabelCollection());
			for (let index = 0; index < communityData.length; index++) {
				const item = communityData[index].coordinates;
				let positions = [];
				const polygonArr = item.toString().split(",");
				// 将字符串数组转换为数字数组
				for (let item of polygonArr) {
					positions.push(Number(item));
				}
				let polyline = this.communityPolylines.add({
					positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
					width: 4,
					material: new Cesium.Material({
						fabric: {
							uniforms: {
								image: img,
							},
							source: `
								czm_material czm_getMaterial(czm_materialInput materialInput)
								{
									// 生成默认的基础材质
									czm_material material = czm_getDefaultMaterial(materialInput);
									vec2 st = materialInput.st;
									// 定义动画持续时间,从0到1
									float durationTime = 2.0;
									// 获取当前帧数,fract(x) 返回x的小数部分
									float time = fract(czm_frameNumber / (60.0 * durationTime));
									// 根据uv采样颜色
									vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));
									material.alpha = colorImage.a;
									material.diffuse = colorImage.rgb * 1.5 ;
									return material;
								}
								`,
						},
					}),
				});

				let center = communityData[index].center;
				let label = this.communityLabel.add({
					id: communityData[index].id,
					position: Cesium.Cartesian3.fromDegrees(center[0], center[1], 150),
					text: communityData[index].name,
					font: "16px Microsoft-Yahei",
					fillColor: Cesium.Color.WHITE,
					outlineWidth: 1.0,
					showBackground: true,
					backgroundColor: new Cesium.Color.fromCssColorString("rgba(21,209,242,0.5)"),
					backgroundPadding: new Cesium.Cartesian2(7, 5),
					pixelOffset: new Cesium.Cartesian2(-60.0, 0),
				});
			}
			this.bindCommunityEvent();
		},

		polylineMetry1(communityData) {
			let viewer = this.map._viewer;
			var polylines = viewer.scene.primitives.add(new Cesium.PolylineCollection());
			for (let index = 0; index < communityData.length; index++) {
				const item = communityData[index].coordinates;
				let positions = [];
				const polygonArr = item.toString().split(",");
				for (let item of polygonArr) {
					positions.push(Number(item));
				}
				var fadingPolyline = polylines.add({
					positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
					width: 3,
					material: Cesium.Material.fromType(Cesium.Material.FadeType, {
						repeat: true,
						fadeInColor: Cesium.Color.CYAN,
						fadeOutColor: Cesium.Color.CYAN.withAlpha(0),
						time: new Cesium.Cartesian2(0.0, 0.0),
						fadeDirection: {
							x: true,
							y: false,
						},
					}),
				});
			}
			var i = 0;
			this.map._viewer.scene.preRender.addEventListener(function () {
				i += 0.01;
				if (i >= 1.0) {
					i = 0; // 控制在0.0到1.0之间
				}
				fadingPolyline.material.uniforms.time.x = i;
			});
		},

		bindCommunityEvent() {
			let that = this;
			if (this.event) return;
			else {
				this.cHander = new Speed.Cesium.ScreenSpaceEventHandler(
					that.map._viewer.scene.canvas
				);
				this.cHander.setInputAction((movement) => {
					let pickedObject = that.map._viewer.scene.pick(movement.position);
					if (
						pickedObject != undefined &&
						pickedObject.primitive != undefined &&
						pickedObject.id != undefined &&
						pickedObject.primitive._text != undefined &&
						pickedObject.primitive._text.includes("社区")
					) {
						that.communityLabel._labels.forEach((e) => {
							if (e.id == pickedObject.id && e.text == pickedObject.primitive._text) {
								that.curCommuntiyData = that.loadCommuntiyData.filter(
									(j) => j.name == e._text
								)[0];
								// 世界坐标转换为弧度
								let ellipsoid = that.map._viewer.scene.globe.ellipsoid;
								let cartographic = ellipsoid.cartesianToCartographic(e._position);
								// 弧度转换为经纬度
								let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
								let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
								let alt = cartographic.height; // 高度
								var obj = {
									lng: lng,
									lat: lat,
									height: alt,
								};

								let popupHtml = document.getElementById("communtiyPoup");
								popupHtml.style.display = "block";
								that.map._viewer.scene.preRender.addEventListener(function () {
									let position = Cesium.Cartesian3.fromDegrees(
										obj.lng,
										obj.lat,
										obj.height
									);
									let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(
										position
									);
									if (Cesium.defined(canvasPosition)) {
										popupHtml.style.position = "fixed";
										popupHtml.style.top =
											canvasPosition.y - popupHtml.offsetHeight - 30 + "px";
										popupHtml.style.left =
											canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
									}
								});
							}
						});
					} else {
						that.closeCommuntiyPuop();
					}
				}, Speed.Cesium.ScreenSpaceEventType.LEFT_CLICK);
			}
		},

		closeCommuntiyPuop() {
			let popupHtml = document.getElementById("communtiyPoup");
			popupHtml.style.display = "none";
		},

		removeCommunityData() {
			if (this.communityPolylines) {
				this.communityPolylines.removeAll();
			}
			if (this.communityLabel) {
				this.communityLabel.removeAll();
			}
			this.closeCommuntiyPuop();
			if (this.cHander) {
				this.cHander.destroy();
				this.cHander = undefined;
			}

			this.removeSQData();
		},
		remove3dModel() {
			if (this.tiles3dModel) {
				this.speedMap.removeLayer(this.tiles3dModel);
				this.tiles3dModel = undefined;
			}
			if (this.tilesYYCModel) {
				this.speedMap.removeLayer(this.tilesYYCModel);
				this.tilesYYCModel = undefined;
			}
		},
		removeHQModel() {
			if (this.tiles3dModel) {
				this.speedMap.removeLayer(this.tiles3dModel);
				this.tiles3dModel = undefined;
			}

			this.removeDTHData();
		},

		removeYYCModel() {
			if (this.tilesYYCModel) {
				this.speedMap.removeLayer(this.tilesYYCModel);
				this.tilesYYCModel = undefined;
			}

			this.removeYYCDTHData();
		},
		removeDTHData() {
			if (this.dthGracphics) {
				this.dthGracphics.removeAll();
				this.dthGracphics == undefined;
			}
			this.closePopup();
			if (this.communityHandler) {
				this.communityHandler.destroy();
				this.communityHandler = undefined;
			}
		},
		removeYYCDTHData() {
			if (this.yycdthGracphics) {
				this.yycdthGracphics.removeAll();
				this.yycdthGracphics == undefined;
			}
			this.closePopup();
			if (this.YYCHandler) {
				this.YYCHandler.destroy();
				this.YYCHandler = undefined;
			}
		},

		flyAddress(data) {
			let that = this;
			if (data.type === "点状地址") {
				let po = JSON.parse(data.geometry)[0];
				this.peoplename = data.properties.master;
				this.peopleNum = data.properties.people;
				this.addPopup({
					lng: po[0],
					lat: po[1],
					height: po[2],
				});
				that.speedMap.flyto({
					destination: Cesium.Cartesian3.fromDegrees(po[0], po[1] - 0.001, po[2] + 200),
					orientation: {
						pitch: Cesium.Math.toRadians(-60.0),
					},
				});
			} else {
				this.addressBillboardCollection._billboards.forEach((e) => {
					if (e.id == data.地名代码) {
						var ellipsoid = that.map._viewer.scene.globe.ellipsoid;
						var cartesian3 = e._position;
						var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
						var lat = Cesium.Math.toDegrees(cartographic.latitude);
						var log = Cesium.Math.toDegrees(cartographic.longitude);
						var height = cartographic.height;

						that.speedMap.flyto({
							destination: Cesium.Cartesian3.fromDegrees(log, lat, height + 500),
						});
					}
				});
			}
		},

		point(position, data, flag, home) {
			let text =
				data.标准名称.length > 8 ? data.标准名称.substr(0, 8) + "..." : data.标准名称;
			this.addressLabelCollection.add({
				id: data.地名代码,
				position: position, // Speed.Cesium.Cartesian3.fromDegreesArray(po)[0],
				text: home === false ? text : data.标准名称, //.slice(0,8),
				font: "14px sans-serif bold",
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
				pixelOffset:
					home === false ? new Cesium.Cartesian2(0, -92) : new Cesium.Cartesian2(0, -30),
				fillColor: home === false ? Cesium.Color.WHITE : Cesium.Color.YELLOW,
				outlineColor: Cesium.Color.WHITE,
				outlineWidth: 1,
				// eyeOffset: new Cesium.Cartesian3(0, 0, -10),
				backgroundColor: new Cesium.Color(1, 1, 1, 0), //背景颜色
				showBackground: true,
				// heightReference:
				// 	Speed.Cesium.HeightReference.CLAMP_TO_GROUND,
				// eyeOffset: new Cesium.Cartesian3(0, 0, 10),

				disableDepthTestDistance: Number.POSITIVE_INFINITY,
				distanceDisplayCondition:
					home === false ? undefined : new Cesium.DistanceDisplayCondition(0, 2000),
			});

			// Cesium.Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid, result)

			this.addressBillboardCollection.add({
				id: data.地名代码,
				// key:data.地名代码,
				position: position,
				image:
					home === false
						? require("@/assets/speed/case/civil/dmdw.png")
						: require("@/assets/speed/case/civil/point.png"),
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				scale: home === false ? 1 : 0.5,
				distanceDisplayCondition:
					home === false ? undefined : new Cesium.DistanceDisplayCondition(0, 8000),
				// heightReference:
				// 	Speed.Cesium.HeightReference.CLAMP_TO_GROUND,
				// eyeOffset: new Cesium.Cartesian3(0, 0, 0)
			});

			if (!home) {

				this.spherePositions.push(position);
				//console.log(this.spherePositions, flag);
				if (flag) {
					this.speedMap.flyto(Cesium.BoundingSphere.fromPoints(this.spherePositions));
				}
			}

		},

		closeAddress() {
			this.closePuop();

			if (this.addressBillboardCollection) {
				this.addressBillboardCollection.removeAll();
			}

			if (this.addressLabelCollection) {
				this.addressLabelCollection.removeAll();
			}

			if (this.event) {
				this.event.destroy();
				this.event = undefined;
			}
		},

		locationAddress(datas, home = false) {
			let that = this;
			this.spherePositions = [];
			that.address = datas;
			let _viewer = this.map._viewer;
			if (!this.addressBillboardCollection) {
				this.addressBillboardCollection = new Speed.Cesium.BillboardCollection({
					scene: _viewer.scene,
				});
				this.addressLabelCollection = new Speed.Cesium.LabelCollection({
					scene: _viewer.scene,
				});
				_viewer.scene.primitives.add(this.addressBillboardCollection);
				_viewer.scene.primitives.add(this.addressLabelCollection);
			} else {
				this.addressBillboardCollection.removeAll();
				this.addressLabelCollection.removeAll();
			}

			datas.forEach((data, index) => {
				let flag = false;

				if (index == datas.length - 1) {
					flag = true;
				}

				let po = JSON.parse(data.geometry)[0];
				if (data.type !== "点状地址") {
					if (_viewer.scene.clampToHeightSupported) {
						let tilesHeight = _viewer.scene.clampToHeightMostDetailed(
							Speed.Cesium.Cartesian3.fromDegreesArray(po)
						);

						tilesHeight.then(function (tilesHeights) {
							let e = tilesHeights[0];
							if (Cesium.defined(e)) {
								that.point(e, data, flag, home);
							} else {
								const positions = [Cesium.Cartographic.fromDegrees(po[0], po[1])];
								const promise = Cesium.sampleTerrainMostDetailed(
									_viewer.terrainProvider,
									positions
								);
								Promise.resolve(promise).then(function (updatedPositions) {
									let e = updatedPositions[0];
									if (Cesium.defined(e)) {
										that.point(
											Cesium.Cartesian3.fromDegrees(
												Cesium.Math.toDegrees(e.longitude),
												Cesium.Math.toDegrees(e.latitude),
												e.height
											),
											data,
											flag,
											home
										);
									}
								});
							}
						});
					}
				}
			});
			if (!home) {
				this.closePuop();
				this.bindEvent();
			}
		},

		bindEvent() {
			let that = this;
			if (this.event) return;
			else {
				this.event = new Speed.Cesium.ScreenSpaceEventHandler(
					that.map._viewer.scene.canvas
				);
				this.event.setInputAction((movement) => {
					let pickedObject = that.map._viewer.scene.pick(movement.position);
					if (
						pickedObject != undefined &&
						pickedObject.id != undefined &&
						pickedObject.id
					) {
						that.addressBillboardCollection._billboards.forEach((e) => {
							if (e.id == pickedObject.id) {
								// console.log(movement.position);
								//openPoup
								// console.log(that.address);
								that.checkedAddress = that.address.filter((j) => j.地名代码 == e.id)[0];

								that.dmbz = bz.filter((j) => j.地名代码 == that.checkedAddress.地名代码);
								// console.log(that.dmbz);
								// console.log(that.checkedAddress);

								//TODO 撒点地名标志

								// 世界坐标转换为弧度
								let ellipsoid = that.map._viewer.scene.globe.ellipsoid;
								let cartographic = ellipsoid.cartesianToCartographic(e._position);
								// 弧度转换为经纬度
								let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
								let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
								let alt = cartographic.height; // 高度
								var obj = {
									lng: lng,
									lat: lat,
									height: alt,
								};

								let popupHtml = document.getElementById("addressPoup");
								popupHtml.style.display = "block";
								that.map._viewer.scene.preRender.addEventListener(function () {
									let position = Cesium.Cartesian3.fromDegrees(
										obj.lng,
										obj.lat,
										obj.height
									);
									let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(
										position
									);
									if (Cesium.defined(canvasPosition)) {
										popupHtml.style.position = "fixed";
										popupHtml.style.top =
											canvasPosition.y - popupHtml.offsetHeight - 120 + "px";
										popupHtml.style.left =
											canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
									}
								});
							}
						});
					} else {
						//closePoup
						that.closePuop();
					}
				}, Speed.Cesium.ScreenSpaceEventType.LEFT_CLICK);
			}
		},

		closePuop() {
			let popupHtml = document.getElementById("addressPoup");
			popupHtml.style.display = "none";
		},

		loadModel(modelData) {
			if (this.tiles3dModel == undefined) {
				this.tilesetLayer = new Speed.TilesetLayer();
				let tileset = this.tilesetLayer.loadQXTilesetLayer({
					url: modelData.modelUrl,
					alt: modelData.alt || 0,
				});
				this.tiles3dModel = tileset._tileset;
				this.speedMap.addLayer(this.tiles3dModel);
			}
			this.speedMap.flyto(this.tiles3dModel);
			// this.dthGracphics=null
			this.communityHandler = new Cesium.ScreenSpaceEventHandler(
				this.map._viewer.scene.canvas
			);
			if (
				modelData.isDTH &&
				(this.dthGracphics == undefined || this.dthGracphics.length == 0)
			) {
				let that = this;
				this.tiles3dModel.readyPromise.then(function (tilesModel) {
					if (tilesModel.orginCenter) {
						that.modelHeight = tilesModel.orginCenter.z;

						that.graphicLayer = new Speed.GeoJsonLayer(that.map._viewer);
						that.dthGracphics = that.graphicLayer.createDTHGraphics({
							name: modelData.name,
							url: modelData.dthUrl,
							modelHeight: modelData.alt || 0, //模型高度
							buildings: {
								buttomheight: "minHeight", //楼层底部高度，可填数字（默认:0）或属性字段名称（如:"bottomHeight"）
								height: "maxHeight", // 楼层顶点高度，可填层高数值（默认3.5）或属性字段名称（如:"height"）
							},
							symbol: {
								highlight: {
									type: "LEFT_CLICK",
									color: "rgba(255,255,0,0.4)",
								},
							},
						});
						that.speedMap.addLayer(that.dthGracphics);

						that.addDTH(modelData, that.communityHandler);
					}
				});
			}
		},
		loadYYCModel(modelData) {
			if (this.tilesYYCModel == undefined) {
				this.tilesetLayer = new Speed.TilesetLayer();
				let tileset = this.tilesetLayer.loadQXTilesetLayer({
					url: modelData.modelUrl,
					alt: modelData.alt || 0,
				});
				this.tilesYYCModel = tileset._tileset;
				this.speedMap.addLayer(this.tilesYYCModel);
			}
			this.speedMap.flyto(this.tilesYYCModel);
			// this.yycdthGracphics =undefined
			this.YYCHandler = new Cesium.ScreenSpaceEventHandler(this.map._viewer.scene.canvas);
			if (
				modelData.isDTH &&
				(this.yycdthGracphics == undefined || this.yycdthGracphics.length == 0)
			) {
				let that = this;
				this.tilesYYCModel.readyPromise.then(function (tilesModel) {
					if (tilesModel.orginCenter) {
						that.modelHeight = tilesModel.orginCenter.z;

						that.graphicLayer = new Speed.GeoJsonLayer(that.map._viewer);
						that.yycdthGracphics = that.graphicLayer.createDTHGraphics({
							name: modelData.name,
							url: modelData.dthUrl,
							modelHeight: modelData.alt || 0, //模型高度
							buildings: {
								buttomheight: "minHeight", //楼层底部高度，可填数字（默认:0）或属性字段名称（如:"bottomHeight"）
								height: "maxHeight", // 楼层顶点高度，可填层高数值（默认3.5）或属性字段名称（如:"height"）
							},
							symbol: {
								highlight: {
									type: "LEFT_CLICK",
									color: "rgba(255,255,0,0.4)",
								},
							},
						});
						that.speedMap.addLayer(that.yycdthGracphics);

						that.addDTH(modelData, that.YYCHandler);
					}
				});
			}
		},

		addDTH(modelData, hander) {
			// this.graphicLayer = new Speed.GeoJsonLayer(this.map._viewer)
			// this.dthGracphics = this.graphicLayer.createDTHGraphics({
			// 	name: modelData.name,
			// 	url: modelData.dthUrl,
			// 	modelHeight: modelData.alt || 0,//模型高度
			// 	buildings: {
			// 		buttomheight: "minHeight",//楼层底部高度，可填数字（默认:0）或属性字段名称（如:"bottomHeight"）
			// 		height: "maxHeight",// 楼层顶点高度，可填层高数值（默认3.5）或属性字段名称（如:"height"）
			// 	},
			// 	symbol: {
			// 		// color:"rgba(1,237,254,0.1)",
			// 		// 鼠标单击后高亮的样式
			// 		highlight: {
			// 			type: "LEFT_CLICK",
			// 			color: "rgba(255,255,0,0.4)"
			// 		}
			// 	}
			// })
			// this.speedMap.addLayer(this.dthGracphics)
			let that = this;
			// if (hander) return;
			// else {
			// this.communityHandler = new Cesium.ScreenSpaceEventHandler(this.map._viewer.scene.canvas);
			hander.setInputAction(function (movement) {
				const pickedObject = that.map._viewer.scene.pick(movement.position);
				if (
					Cesium.defined(pickedObject) &&
					Cesium.defined(pickedObject.primitive) &&
					pickedObject.primitive.type === "DTH"
				) {
					let primitive = pickedObject.primitive;
					that.peoplename = primitive.properties.master;
					that.peopleNum = primitive.properties.people;

					let cartesian = that.map._viewer.scene.pickPosition(movement.position);
					if (Cesium.defined(cartesian)) {
						let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
						let lng = Number(Cesium.Math.toDegrees(cartographic.longitude).toFixed(5));
						let lat = Number(Cesium.Math.toDegrees(cartographic.latitude).toFixed(5));
						let height = Number(cartographic.height.toFixed(2));
						var obj = {
							lng: lng,
							lat: lat,
							height: height,
						};
						that.addPopup(obj);
					} else {
						that.closePopup();
					}
				} else {
					that.closePopup();
				}
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			// }
		},

		addPopup(obj) {
			this.curPhotos = [];
			let index = Math.floor(Math.random() * 10);
			this.curPhotos.push(this.photos[index]);

			let that = this;
			let popupHtml = document.getElementById("housePoup");
			popupHtml.style.display = "block";

			let result = new Cesium.Cartesian2();
			this.map._viewer.scene.preRender.addEventListener(function () {
				let position = Cesium.Cartesian3.fromDegrees(obj.lng, obj.lat, obj.height);
				let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(
					position,
					result
				);
				if (Cesium.defined(canvasPosition)) {
					popupHtml.style.position = "fixed";
					popupHtml.style.top = canvasPosition.y - popupHtml.offsetHeight / 1.6 + "px";
					popupHtml.style.left = canvasPosition.x + "px";
				}
			});
		},
		closePopup() {
			let popupHtml = document.getElementById("housePoup");
			popupHtml.style.display = "none";
		},

		loadDoorData(datas, home = false) {
			let that = this;
			this.spherePositions = [];
			//that.allRoadDatas = []
			this.allDoorDatas = []
			this.closeRoadPuop();
			if (!datas || datas.length <= 0) {
				this.doorBillboardCollection.removeAll();
				this.doorLabelCollection.removeAll();
				// this.roadCollection.removeAll();
				return;
			}
			let _viewer = this.map._viewer;
			if (!this.doorBillboardCollection) {
				this.doorBillboardCollection = new Speed.Cesium.BillboardCollection({
					scene: _viewer.scene,
				});
				this.doorLabelCollection = new Speed.Cesium.LabelCollection({
					scene: _viewer.scene,
				});
				_viewer.scene.primitives.add(this.doorLabelCollection);
				_viewer.scene.primitives.add(this.doorBillboardCollection);
			} else {
				this.doorBillboardCollection.removeAll();
				this.doorLabelCollection.removeAll();
			}

			// if (_viewer.entities._entities.length > 0) {
			// 	_viewer.entities.removeAll();
			// }
			let item = false;
			datas.forEach((data, index) => {
				if (index == datas.length - 1) {
					item = true;
				}
				if (!data.type) {
					let log = Number(data.东经);
					let lat = Number(data.北纬);
					let heightZ = 0;
					if (data.hasOwnProperty("height") && Number(data.height) != 0) {
						heightZ = Number(data.height);
						let position = Cesium.Cartesian3.fromDegrees(log, lat, heightZ);
						that.doorPoint(position, data, item, home);
					} else {
						const cartesian1 = new Cesium.Cartesian3.fromDegrees(log, lat)
						this.getHeightByType([cartesian1], 'model').then(results => {
							// console.log('拾取结果：', results)
							if (results && results.length > 0) {
								that.doorPoint(results[0], data, item, home);
							}
						})
					}
				} else {
					// let cartesians = []
					// data.geometry.coordinates.forEach((item) => {
					// 	let cartesian = Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2] - 14.5)
					// 	cartesians.push(cartesian)
					// })

					// var polyCenter = Cesium.BoundingSphere.fromPoints(cartesians).center;
					// polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
					// _viewer.entities.add({
					// 	position: polyCenter,
					// 	id: data.properties.id,
					// 	name: "道路",
					// 	polyline: {
					// 		positions: cartesians,
					// 		width: 10,
					// 		material: new Cesium.PolylineGlowMaterialProperty({
					// 			color: Cesium.Color.DEEPSKYBLUE,
					// 			glowPower: 0.25,
					// 		}),
					// 		//clampToGround: true,
					// 		distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 15000.0),
					// 		classificationType: Cesium.ClassificationType.BOTH
					// 	},
					// 	label: {
					// 		text: data.properties.name,
					// 		verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					// 		horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
					// 		pixelOffset: new Cesium.Cartesian2(0, -10),
					// 		font: "24px sans-serif bold",
					// 		heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
					// 		disableDepthTestDistance: Number.POSITIVE_INFINITY,
					// 		distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 15000.0),
					// 		scaleByDistance: new Cesium.NearFarScalar(5000, 1, 15000, 0.5),
					// 	},

					// })
				}
				// that.allRoadDatas.push(data)
				that.allDoorDatas.push(data)
			});
			this.bindDoorEvent()

		},
		loadRoadData(datas) {
			if (!datas || datas.length <= 0) {
				return;
			}
			if (!this.roadBillboardCollection) {
				this.roadBillboardCollection = new Speed.Cesium.PolylineCollection({
					scene: this.map._viewer.scene,
				});
				this.map._viewer.scene.primitives.add(this.roadBillboardCollection);
			} else {
				this.roadBillboardCollection.removeAll();
			}
			this.allRoadDatas = []
			datas.forEach((data, index) => {
				let cartesians = []
				data.geometry.coordinates.forEach((item) => {
					let cartesian = Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2] - 14.5)
					cartesians.push(cartesian)
				})
				let roads = this.roadBillboardCollection.add({
					positions: cartesians,
					id: data.properties.id + "_道路",
					width: 8,
					material: Cesium.Material.fromType(Cesium.Material.PolylineGlowType, {
						color: Cesium.Color.DEEPSKYBLUE,
						glowPower: 0.25,
					}),
				});
				this.allRoadDatas.push(data)
			})
			this.bindDoorEvent()
		},

		/**
		 * 采集高度
		 * @param {*} cartesians：笛卡尔坐标组成的数组
		 * @param {*} type：'terrain' 获取地形高度，'model'获取模型高度
		 * @returns 采集结果：笛卡尔坐标组成的数组
		 */
		getHeightByType(cartesians, type) {
			if (type === 'model') {
				return new Promise(async resolve => {
					try {
						let promise = this.map._viewer.scene.clampToHeightMostDetailed(cartesians)
						promise.then(updatedCartesians => resolve(updatedCartesians))
					} catch (e) {
						resolve(false)
					}
				})
			} else if (type = 'terrain') {
				// 首先将cartesians转为positions
				let positions = []
				cartesians.forEach(cartesian => {
					positions.push(this.cartesianToCartographic(cartesian))
				})
				let terrain = this.map._viewer.terrainProvider
				return new Promise(async resolve => {
					try {
						// 当前场景中没有使用地形
						if (!terrain) resolve(false)
						const promise = Cesium.sampleTerrainMostDetailed(terrain, positions);
						promise.then(updatedPositions => {
							let resultCartesians = []
							updatedPositions.forEach(position => {
								if (position) {
									// 采集成功，转为笛卡尔坐标
									resultCartesians.push(this.cartographicToCartesian(position))
								} else {
									// postion为undefined时，说明该位置采集失败
									// resultCartesians.push(position)
								}
							})
							resolve(resultCartesians)
						})
					} catch (e) {
						resolve(false)
					}
				})
			}
		},
		bindDoorEvent() {
			let that = this;
			if (this.doorHander) return;
			else {
				this.doorHander = new Speed.Cesium.ScreenSpaceEventHandler(
					that.map._viewer.scene.canvas
				);
				this.doorHander.setInputAction((movement) => {
					let pickedObject = that.map._viewer.scene.pick(movement.position);
					if (lastFeature) {
						that.roadBillboardCollection._polylines.forEach((e) => {
							if (e._id == lastFeature.id) {
								e._material.uniforms.color = Cesium.Color.DEEPSKYBLUE
							}
						});
					}
					if (Cesium.defined(pickedObject) && pickedObject != undefined && pickedObject.id != undefined && pickedObject.id) {
						let ellipsoid = that.map._viewer.scene.globe.ellipsoid;

						if (pickedObject.hasOwnProperty('id') && typeof (pickedObject.id) == 'string' && pickedObject.id.indexOf("_门牌") != -1) {
							let id = pickedObject.id.substring(0, pickedObject.id.indexOf('_'))
							let popupHtml1 = document.getElementById("roadPopup");
							popupHtml1.style.display = "none";
							that.doorBillboardCollection._billboards.forEach((e) => {
								if (e._id == pickedObject.id) {
									that.curRoadData = that.allDoorDatas.filter((i) => i.序号 == id)[0];
									let cartographic = ellipsoid.cartesianToCartographic(e._position);
									let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
									let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
									let alt = cartographic.height; // 高度
									let popupHtml = document.getElementById("doorPopup");
									popupHtml.style.display = "block";
									that.map._viewer.scene.preRender.addEventListener(function () {
										let position = Cesium.Cartesian3.fromDegrees(lng, lat, alt);
										let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(position);
										if (Cesium.defined(canvasPosition)) {
											popupHtml.style.position = "fixed";
											popupHtml.style.top =
												canvasPosition.y - popupHtml.offsetHeight - 75 + "px";
											popupHtml.style.left =
												canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
										}
									});
								}
							});
						} else if (pickedObject.hasOwnProperty('id') && typeof (pickedObject.id) == 'string' && pickedObject.id.indexOf("_道路") != -1) {
							pickedObject.primitive._material.uniforms.color = Cesium.Color.RED
							lastFeature = pickedObject.primitive

							let id = pickedObject.id.substring(0, pickedObject.id.indexOf('_'))
							that.curRoadData = that.allRoadDatas.filter((i) => i.properties.id == id)[0].properties
							let popupHtml1 = document.getElementById("doorPopup");
							popupHtml1.style.display = "none";
							let lon
							let lat
							let height
							let cartesian3 = that.map._viewer.scene.pickPosition(movement.position);
							if (cartesian3) {
								let cartographic3 = ellipsoid.cartesianToCartographic(cartesian3);
								lon = Cesium.Math.toDegrees(cartographic3.longitude)
								lat = Cesium.Math.toDegrees(cartographic3.latitude)
								height = cartographic3.height
							}

							let popupHtml = document.getElementById("roadPopup");
							popupHtml.style.display = "block";
							that.map._viewer.scene.preRender.addEventListener(function () {
								let position = Cesium.Cartesian3.fromDegrees(lon, lat, height);
								let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(position);
								if (Cesium.defined(canvasPosition)) {
									popupHtml.style.position = "fixed";
									popupHtml.style.top =
										canvasPosition.y - popupHtml.offsetHeight + "px";
									popupHtml.style.left =
										canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
								}
							});
						}
					} else {
						that.closeRoadPuop();
					}
				}, Speed.Cesium.ScreenSpaceEventType.LEFT_CLICK);
				this.doorHander.setInputAction((movement) => {
					const pickedObject = that.map._viewer.scene.pick(movement.endPosition);
					if (Cesium.defined(pickedObject) && pickedObject.id != undefined) {
						that.map._viewer._container.style.cursor = "pointer";
					} else {
						that.map._viewer._container.style.cursor = "default";
					}
				}, Speed.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			}
		},
		closeRoadPuop() {
			let popupHtml = document.getElementById("roadPopup");
			popupHtml.style.display = "none";

			let popupHtml1 = document.getElementById("doorPopup");
			popupHtml1.style.display = "none";
		},

		doorPoint(position, data, flag, home) {

			this.doorBillboardCollection.add({
				id: data.序号 + "_门牌",
				position: position,
				image: require("@/assets/speed/case/civil/mp.png"),
				scale: 0.3,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
				// pixelOffset: new Cesium.Cartesian2(0, -30),
				distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 15000.0),
				scaleByDistance: new Cesium.NearFarScalar(5000, 1, 15000, 0.5),
			});
			this.doorLabelCollection.add({
				id: data.序号,
				position: position,
				text: data.POI,
				font: "14px sans-serif bold",
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
				pixelOffset: new Cesium.Cartesian2(0, -70),
				disableDepthTestDistance: Number.POSITIVE_INFINITY,
				fillColor: home === false ? Cesium.Color.WHITE : Cesium.Color.YELLOW,
				outlineColor: Cesium.Color.WHITE,
				outlineWidth: 1,
				distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 15000.0),
				scaleByDistance: new Cesium.NearFarScalar(5000, 1, 15000, 0.5),
			});

			if (!home) {
				this.spherePositions.push(position);
				if (flag) {
					this.speedMap.flyto(Cesium.BoundingSphere.fromPoints(this.spherePositions));
				}
			}

		},

		zoomtoDoor(data) {
			let that = this
			let _viewer = this.map._viewer;
			let ellipsoid = this.map._viewer.scene.globe.ellipsoid;
			if (data.type) {
				//let id = data.properties.id
				// this.streetLine = _viewer.entities.getById(data.properties.id)
				// _viewer.flyTo(this.streetLine, {
				// 	duration: 1,
				// 	offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-60), 1200)
				// })
				// this.setEntityFlicker(this.streetLine, 2)

				that.roadBillboardCollection._polylines.forEach((e) => {
					if (lastFeature && e._id == lastFeature._id) {
						e._material.uniforms.color = Cesium.Color.DEEPSKYBLUE
						return
					}
				});
				that.roadBillboardCollection._polylines.forEach((e) => {
					let id = e._id.substring(0, e._id.indexOf('_'))
					if (id == data.properties.id) {
						e._material.uniforms.color = Cesium.Color.RED
						lastFeature = e
						return
					}
				});

				let popupHtml1 = document.getElementById("doorPopup");
				popupHtml1.style.display = "none";
				this.curRoadData = data.properties

				let points = []
				for (let index = 0; index < data.geometry.coordinates.length; index++) {
					const point = data.geometry.coordinates[index];
					let cartesian = Speed.Cesium.Cartesian3.fromDegrees(point[0], point[1], point[2])
					points.push(cartesian)
				}

				this.speedMap.flyto(Cesium.BoundingSphere.fromPoints(points))

				// 获取中心点
				let cartesian = Cesium.BoundingSphere.fromPoints(points).center
				// 转换成经纬度
				const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
				let lon = Cesium.Math.toDegrees(cartographic.longitude)
				let lat = Cesium.Math.toDegrees(cartographic.latitude)
				let height = cartographic.height

				let popupHtml = document.getElementById("roadPopup");
				popupHtml.style.display = "block";
				this.map._viewer.scene.preRender.addEventListener(function () {
					let position = Cesium.Cartesian3.fromDegrees(lon, lat, height);
					let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(position);
					if (Cesium.defined(canvasPosition)) {
						popupHtml.style.position = "fixed";
						popupHtml.style.top =
							canvasPosition.y - popupHtml.offsetHeight + "px";
						popupHtml.style.left =
							canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
					}
				});

			} else {
				let log = Number(data.东经);
				let lat = Number(data.北纬);
				let height = 0;
				if (_viewer.scene.clampToHeightSupported) {
					let tilesHeight = _viewer.scene.clampToHeightMostDetailed(
						Speed.Cesium.Cartesian3.fromDegrees(log, lat)
					);
					tilesHeight.then(function (height) {
						let e = height[0];
						if (Cesium.defined(e)) {
							height = e.z;
						} else {
							const positions = [Cesium.Cartographic.fromDegrees(log, lat)];
							const promise = Cesium.sampleTerrainMostDetailed(
								_viewer.terrainProvider,
								positions
							);
							Promise.resolve(promise).then(function (updatedPositions) {
								let e = updatedPositions[0];
								if (Cesium.defined(e)) {
									height = e.height;
								}
							});
						}
					});
				}
				this.speedMap.flyto({
					destination: Cesium.Cartesian3.fromDegrees(log, lat, height + 500),
					// orientation: {
					// 	heading: Cesium.Math.toRadians(0),
					// 	pitch: Cesium.Math.toRadians(-35.0),
					// 	roll: 0.0
					// }
				});

				let popupHtml1 = document.getElementById("roadPopup");
				popupHtml1.style.display = "none";
				this.doorBillboardCollection._billboards.forEach((e) => {
					let id = e._id.substring(0, e._id.indexOf('_'))
					if (id == data.序号) {
						this.curRoadData = data;
						let cartographic = ellipsoid.cartesianToCartographic(e._position);
						let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
						let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
						let alt = cartographic.height; // 高度
						let popupHtml = document.getElementById("doorPopup");
						popupHtml.style.display = "block";
						this.map._viewer.scene.preRender.addEventListener(function () {
							let position = Cesium.Cartesian3.fromDegrees(lng, lat, alt);
							let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(position);
							if (Cesium.defined(canvasPosition)) {
								popupHtml.style.position = "fixed";
								popupHtml.style.top =
									canvasPosition.y - popupHtml.offsetHeight - 75 + "px";
								popupHtml.style.left =
									canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
							}
						});
					}
				});
			}

		},

		setEntityFlicker(entity, second) {
			if (!entity) return;
			let x = 1;
			let flog = true;
			let fs = [];
			let callback = new Cesium.CallbackProperty(() => {
				if (flog) {
					x = x - 0.03;
					if (x <= 0) {
						flog = false;
					}
				} else {
					x = x + 0.03;
					if (x >= 1) {
						flog = true;
					}
				}
				return x >= 0.5;
			}, false);
			if (entity.label) {
				entity.label.show = callback;
				fs.push(entity.label);
			}
			if (entity.polyline) {
				entity.polyline.show = callback;
				fs.push(entity.polyline);
			}
			setTimeout(function () {
				fs.forEach((f) => {
					f.show = true;
				});
			}, second * 1000);
		},
		clearDoorData(isClose = false) {
			if (this.doorLabelCollection) {
				this.doorLabelCollection.removeAll();
			}

			if (this.doorBillboardCollection) {
				this.doorBillboardCollection.removeAll();
			}

			if (isClose) {
				if (this.roadBillboardCollection) {
					this.roadBillboardCollection.removeAll();
				}
			}


			this.closeRoadPuop()
		},

		loadRangeData(options) {
			const position = Cesium.Cartesian3.fromDegrees(
				options.position.lng,
				options.position.lat,
				options.position.height * 2
			);
			let num = 0;
			const _heading = Cesium.Math.toRadians(num); //水平旋转
			const _pitch = Cesium.Math.toRadians(0.0);
			const _roll = Cesium.Math.toRadians(0.0);
			let _headingPitchRoll = new Cesium.HeadingPitchRoll(_heading, _pitch, _roll);
			let _orientation = Cesium.Transforms.headingPitchRollQuaternion(
				position,
				_headingPitchRoll
			);

			let model = this.map._viewer.entities.add({
				position: position,
				orientation: _orientation,
				model: {
					uri: options.modelUrl,
					scale: options.modelScale,
				},
				type: "range",
			});
			setInterval(() => {
				num += 4;
				if (num >= 360 || num <= -360) {
					num = 0;
				}
				model.orientation = Cesium.Transforms.headingPitchRollQuaternion(
					Cesium.Cartesian3.fromDegrees(
						options.position.lng,
						options.position.lat,
						options.position.height
					),
					new Cesium.HeadingPitchRoll(
						Cesium.Math.toRadians(num),
						Cesium.Math.toRadians(0),
						Cesium.Math.toRadians(0)
					)
				);
			}, 50);

			this.circle = new Speed.SpreadCircle(this.map._viewer);
			for (let index = 0; index < options.circles.length; index++) {
				const option = options.circles[index];
				this.circle.createCircle(
					[options.position.lng, options.position.lat, options.position.height],
					option,
					options.circles[index + 1]
				);
			}

			this.speedMap.flyto({
				destination: new Cesium.Cartesian3.fromDegrees(
					options.position.lng,
					options.position.lat,
					8000
				),
			});
		},
		closeRangeData() {
			let idLst = [];
			this.map._viewer.entities.values.forEach((entity) => {
				if (entity.type == "range") {
					idLst.push(entity.id);
				}
			});
			for (let index = 0; index < idLst.length; index++) {
				this.map._viewer.entities.remove(this.map._viewer.entities.getById(idLst[index]));
			}
		},
		searchDTH(options) {
			let primitives = this.map._viewer.scene.primitives._primitives;
			for (let index = 0; index < primitives.length; index++) {
				if (primitives[index] instanceof Cesium.PrimitiveCollection) {
					primitives[index]._primitives.forEach((item) => {
						if (item.type == "DTH") {
							if (item.properties.master.includes(options)) {
								var ellipsoid = this.map._viewer.scene.globe.ellipsoid;
								var cartographic = ellipsoid.cartesianToCartographic(item.position);
								var longitude = Cesium.Math.toDegrees(cartographic.longitude);
								var latitude = Cesium.Math.toDegrees(cartographic.latitude);
								this.peoplename = item.properties.master;
								this.peopleNum = item.properties.people;
								let height = cartographic.height - item.properties.floorHeight;
								var obj = { lng: longitude, lat: latitude, height: height };
								this.addPopup(obj);

								const heading = Cesium.Math.toRadians(25.0);
								const pitch = Cesium.Math.toRadians(-30.0);
								const range = 80.0;
								let points = [];
								points.push(Cesium.Cartesian3.fromDegrees(longitude, latitude, height));
								this.map._viewer.camera.flyToBoundingSphere(
									Cesium.BoundingSphere.fromPoints(points),
									{
										offset: new Cesium.HeadingPitchRange(heading, pitch, range),
									}
								);
								return;
								//定位
								// let entity = new Cesium.Entity({
								// 	name: "point",
								// 	position: new Cesium.Cartesian3.fromDegrees(longitude, latitude, height), // 点的经纬度坐标
								// 	point: {
								// 		show: true,
								// 		pixelSize: 15,
								// 		color: Cesium.Color.RED,

								// 	}
								// })
								// this.map._viewer.entities.add(entity)
								// this.map._viewer.flyTo(entity)
								// this.timer = setInterval(() => {
								// 	this.map._viewer.entities.remove(entity)
								// 	clearInterval(this.timer)
								// }, 3000)
							}
						}
					});
				}
			}
		},

		flyLabel(data) {
			this.speedMap.flyto({
				destination: Cesium.Cartesian3.fromDegrees(data.lng, data.lat, 500),
			});
		},
		zoomToHQModel() {
			if (this.tiles3dModel) {
				this.speedMap.flyto(this.tiles3dModel);
			}
		},
		zoomToYYCModel() {
			if (this.tilesYYCModel) {
				this.speedMap.flyto(this.tilesYYCModel);
			}
		},

		flyCunAddress(data) {
			// this.peoplename = data[3].name;
			// this.peopleNum = data[3].family;
			this.shbzData = data[3]
			if (!this.shbzData.photo) this.shbzData.photo = require('@/assets/speed/case/civil/photo.png')
			if (!this.shbzData.sex) this.shbzData.sex = '男'
			if (!this.shbzData.birthDate) this.shbzData.birthDate = 2023 - this.shbzData.age + '-05-09'
			if (!this.shbzData.tel) this.shbzData.tel = '14756154512'
			this.shbzData.jhrxx = {
				name: '王六',
				gender: '男',
				age: '35',
				relationship: '亲戚',
				telephone: '14786465865',
				registeredAddress: this.shbzData.village + this.shbzData.number,
				address: this.shbzData.village + this.shbzData.number,
			}

			this.addSHBZPopup({
				lng: data[0],
				lat: data[1],
				height: data[2],
			});
			this.speedMap.flyto({
				destination: Cesium.Cartesian3.fromDegrees(
					data[0],
					data[1] - 0.001,
					data[2] + 200
				),
				orientation: {
					pitch: Cesium.Math.toRadians(-60.0),
				},
			});
		},

		loadCunEvent() {
			let that = this;
			this.sse = new Cesium.ScreenSpaceEventHandler(this.map._viewer.scene.canvas);
			this.sse.setInputAction((movement) => {
				const pickedObject = this.map._viewer.scene.pick(movement.position);

				if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.primitive)) {
					let cartesian = this.map._viewer.scene.pickPosition(movement.position);
					if (Cesium.defined(cartesian)) {
						let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
						let lng = Number(Cesium.Math.toDegrees(cartographic.longitude).toFixed(5));
						let lat = Number(Cesium.Math.toDegrees(cartographic.latitude).toFixed(5));
						let height = Number(cartographic.height.toFixed(2));
						let data = RECORDS.filter((item) => item.ID == pickedObject.id);
						if (data[0]) {
							var obj = [data[0].center[0], data[0].center[1], height, data[0]];

							// this.$emit("flyCunAddress", obj);

							async function getaddress() {
								await setTimeout(function () {
									that.flyCunAddress(obj);
								}, 500);
							}
							getaddress();
						} else {
							this.closeSHBZPopup()
						}
					} else {
						this.closeSHBZPopup();
					}
				} else {
					this.closeSHBZPopup();
				}
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			this.sse.setInputAction((movement) => {
				const pickedObject = that.map._viewer.scene.pick(movement.endPosition);
				if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.primitive) && pickedObject.id != undefined) {
					that.map._viewer._container.style.cursor = "pointer";
				} else {
					that.map._viewer._container.style.cursor = "default";
				}

			}, Speed.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		},

		loadCunData(datas) {
			this.loadCunEvent();
			this.dbPoint && this.dbPoint.removeAll();
			this.dbLabel && this.dbLabel.removeAll();
			let _viewer = this.map._viewer;
			if (!this.dbPoint) {
				this.dbPoint = new Speed.Cesium.BillboardCollection({
					scene: _viewer.scene,
				});
				_viewer.scene.primitives.add(this.dbPoint);
			}

			if (!this.dbLabel) {
				this.dbLabel = new Speed.Cesium.LabelCollection({
					scene: _viewer.scene,
				});
				_viewer.scene.primitives.add(this.dbLabel);
			}

			datas.forEach((data, index) => {
				let image = require("@/assets/speed/case/civil/ptry.png")
				switch (data.remarks) {
					case "低保户":
						image = require("@/assets/speed/case/civil/dbh.png");
						break;
					case "退伍军人":
						image = require("@/assets/speed/case/civil/twjr.png");
						break;
					case "高龄老人":
						image = require("@/assets/speed/case/civil/gnlr.png");
						break;
					case "残疾户":
						image = require("@/assets/speed/case/civil/cjr.png");
						break;
					default:
						image = require("@/assets/speed/case/civil/ptry.png");
						break;
				}
				this.dbPoint.add({
					id: data.ID,
					position: Cesium.Cartesian3.fromDegrees(data.center[0], data.center[1], 75),
					image: image,
					scale: 0.3,
					distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 15000.0),
					scaleByDistance: new Cesium.NearFarScalar(5000, 1, 15000, 0.5),
				});
				this.dbLabel.add({
					id: data.ID,
					position: Cesium.Cartesian3.fromDegrees(data.center[0], data.center[1], 80),
					text: 132.839942 == data.center[0] ? "" : data.name,
					font: "12px Microsoft Yahei bold",
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
					pixelOffset: new Cesium.Cartesian2(0, -25),
					disableDepthTestDistance: Number.POSITIVE_INFINITY,
					fillColor: Cesium.Color.WHITE,
					distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 15000.0),
					scaleByDistance: new Cesium.NearFarScalar(5000, 1, 15000, 0.5),
					style: Cesium.LabelStyle.FILL_AND_OUTLINE,
					outlineColor: Cesium.Color.WHITE,
				});
			});
		},
		removeCunData() {

			this.closeSHBZPopup()
			if (this.dbPoint) {
				this.dbPoint.removeAll();
			}

			if (this.dbLabel) {
				this.dbLabel.removeAll();
			}

			if (this.sse) {
				this.sse.destroy();
				this.sse = undefined;
			}
		},
		flyto(options) {
			this.speedMap.flyto(options)
		},
		loadPOIData(datas) {
			let that = this;
			if (datas == undefined || datas.length == 0) {
				return
			}
			that.villagePOIDatas = datas;

			let _viewer = this.map._viewer;
			if (!this.villagePOICollection) {
				this.villagePOICollection = new Speed.Cesium.BillboardCollection({
					scene: _viewer.scene,
				});
				_viewer.scene.primitives.add(this.villagePOICollection);
			} else {
				this.villagePOICollection.removeAll();
			}

			datas.forEach((data, index) => {
				let position = Cesium.Cartesian3.fromDegrees(data.X坐标, data.Y坐标, data.高度)
				that.villagePOICollection.add({
					id: data.id,
					position: position,
					image: data.img,
					scale: 0.3,
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 15000.0),
					scaleByDistance: new Cesium.NearFarScalar(5000, 1, 15000, 0.5),

				});
			});
			this.bindPOIEvent();
		},
		bindPOIEvent() {
			let that = this;

			if (this.poiHander) return;
			else {
				this.poiHander = new Speed.Cesium.ScreenSpaceEventHandler(
					that.map._viewer.scene.canvas
				);
				this.poiHander.setInputAction((movement) => {
					let pickedObject = that.map._viewer.scene.pick(movement.position);
					if (pickedObject != undefined && pickedObject.id != undefined && pickedObject.id) {
						that.villagePOICollection._billboards.forEach((e) => {
							if (e._id == pickedObject.id) {
								that.poiDatas = that.villagePOIDatas.filter((i) => i.id == e.id)[0];
								let ellipsoid = that.map._viewer.scene.globe.ellipsoid;
								let cartographic = ellipsoid.cartesianToCartographic(e._position);
								let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
								let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
								let alt = cartographic.height; // 高度
								var obj = {
									lng: lng,
									lat: lat,
									height: alt,
								};
								that.poiTitle = "地名信息"
								that.closeGGSSPuop();
								let popupHtml = document.getElementById("poiPopup");
								popupHtml.style.display = "block";
								that.map._viewer.scene.preRender.addEventListener(function () {
									let position = Cesium.Cartesian3.fromDegrees(
										obj.lng,
										obj.lat,
										obj.height
									);
									let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(
										position
									);
									if (Cesium.defined(canvasPosition)) {
										popupHtml.style.position = "fixed";
										popupHtml.style.top =
											canvasPosition.y - popupHtml.offsetHeight - 65 + "px";
										popupHtml.style.left =
											canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
									}
								});
							}
						});
					} else {
						that.closePOIPuop();
					}
				}, Speed.Cesium.ScreenSpaceEventType.LEFT_CLICK);
				this.poiHander.setInputAction((movement) => {
					const pickedObject = that.map._viewer.scene.pick(movement.endPosition);
					if (Cesium.defined(pickedObject) && pickedObject.id != undefined) {
						that.map._viewer._container.style.cursor = "pointer";
					} else {
						that.map._viewer._container.style.cursor = "default";
					}
				}, Speed.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			}
		},
		closePOIPuop() {
			let popupHtml = document.getElementById("poiPopup");
			popupHtml.style.display = "none";
		},
		closePOIData() {
			this.closePOIPuop();

			if (this.villagePOICollection) {
				this.villagePOICollection.removeAll();
			}

			if (this.poiHander) {
				this.poiHander.destroy();
				this.poiHander = undefined;
			}
		},
		loadGGSSData(datas, isZoom) {
			let that = this;
			if (datas == undefined || datas.length == 0) {
				return
			}
			if (isZoom)
				this.zoomToGGSS(datas)
			else {
				let _viewer = this.map._viewer;
				if (!this.villageGGSSCollection) {
					this.villageGGSSCollection = new Speed.Cesium.BillboardCollection({
						scene: _viewer.scene,
					});
					_viewer.scene.primitives.add(this.villageGGSSCollection);
				}
				// else {
				// 	this.villageGGSSCollection.removeAll();
				// }

				datas.forEach((data, index) => {
					let position = Cesium.Cartesian3.fromDegrees(data.X坐标, data.Y坐标, data.高度)
					that.villageGGSSCollection.add({
						id: data.编号,
						position: position,
						image: data.img,
						scale: 0.3,
						VerticalOrigin: Cesium.VerticalOrigin.BOTTOM,
						distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 20000.0),
						scaleByDistance: new Cesium.NearFarScalar(5000, 1, 20000, 0.5),

					});
					that.villageGGSSDatas.push(data)

				});
				this.bindGGSSEvent();
			}
		},
		removeGGSSData(datas) {
			if (!this.villageGGSSCollection || !this.villageGGSSCollection._billboards || datas == undefined) {
				return
			}
			for (let index = 0; index < datas.length; index++) {
				const temp = datas[index];
				this.villageGGSSCollection._billboards.forEach((item) => {
					if (item != undefined && item._id === temp.编号) {
						this.villageGGSSCollection.remove(item)
					}
				})
				this.villageGGSSDatas.map((itm, idx) => {
					if (itm.编号 === temp.编号) {
						this.villageGGSSDatas.splice(idx, 1);
					}
				});
			}
			this.closeGGSSPuop();
			if (this.ggssHander) {
				this.ggssHander.destroy();
				this.ggssHander = undefined;
			}
		},

		bindGGSSEvent() {
			let that = this;
			if (this.ggssHander) return;
			else {
				this.ggssHander = new Speed.Cesium.ScreenSpaceEventHandler(
					that.map._viewer.scene.canvas
				);
				this.ggssHander.setInputAction((movement) => {
					let pickedObject = that.map._viewer.scene.pick(movement.position);
					if (pickedObject != undefined && pickedObject.id != undefined && pickedObject.id) {
						that.villageGGSSCollection._billboards.forEach((e) => {
							if (e._id == pickedObject.id) {
								that.ggssDatas = that.villageGGSSDatas.filter((i) => i.编号 == e.id)[0];
								let ellipsoid = that.map._viewer.scene.globe.ellipsoid;
								let cartographic = ellipsoid.cartesianToCartographic(e._position);
								let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
								let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
								let alt = cartographic.height; // 高度
								var obj = {
									lng: lng,
									lat: lat,
									height: alt,
								};
								that.closePOIPuop();
								let popupHtml
								if (that.ggssDatas.类型 == "监控") {
									popupHtml = document.getElementById("jkPopup");
									let popupHtml1 = document.getElementById("ggssPopup");
									popupHtml1.style.display = "none";
								} else {
									popupHtml = document.getElementById("ggssPopup");
									let popupHtml1 = document.getElementById("jkPopup");
									popupHtml1.style.display = "none";
								}
								popupHtml.style.display = "block";
								that.map._viewer.scene.preRender.addEventListener(function () {
									let position = Cesium.Cartesian3.fromDegrees(
										obj.lng,
										obj.lat,
										obj.height
									);
									let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(
										position
									);
									if (Cesium.defined(canvasPosition)) {
										popupHtml.style.position = "fixed";
										popupHtml.style.top =
											canvasPosition.y - popupHtml.offsetHeight - 30 + "px";
										popupHtml.style.left =
											canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
									}
								});
							}
						});
					} else {
						that.closeGGSSPuop();
					}
				}, Speed.Cesium.ScreenSpaceEventType.LEFT_CLICK);
				this.ggssHander.setInputAction((movement) => {
					const pickedObject = that.map._viewer.scene.pick(movement.endPosition);
					if (Cesium.defined(pickedObject) && pickedObject.id != undefined) {
						that.map._viewer._container.style.cursor = "pointer";
					} else {
						that.map._viewer._container.style.cursor = "default";
					}
					// that.villageGGSSCollection._billboards.forEach((e) => {
					// 	if (e._id == pickedObject.id) {
					// 		let tempdata = that.villageGGSSDatas.filter((i) => i.编号 == e.id)[0];
					// 		e.image = tempdata.checkImg
					// 	}
					// });
				}, Speed.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			}
		},
		closeGGSSPuop() {
			let popupHtml = document.getElementById("ggssPopup");
			popupHtml.style.display = "none";

			let popupHtml1 = document.getElementById("jkPopup");
			popupHtml1.style.display = "none";
		},
		addSHBZPopup(point) {
			let popupHtml = document.getElementById("shbzPopup")
			popupHtml.style.display = "block"

			let result = new Cesium.Cartesian2()
			this.map._viewer.scene.preRender.addEventListener(() => {
				let position = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.height)
				let canvasPosition = this.map._viewer.scene.cartesianToCanvasCoordinates(
					position,
					result
				);
				if (Cesium.defined(canvasPosition)) {
					popupHtml.style.position = "fixed"
					popupHtml.style.top = canvasPosition.y - popupHtml.offsetHeight + 100 + "px"
					popupHtml.style.left = canvasPosition.x + 20 + "px"
				}
			})
		},
		closeSHBZPopup() {
			let popupHtml = document.getElementById("shbzPopup");
			popupHtml.style.display = "none";
		},
		closeGGSSData() {
			this.closeGGSSPuop();

			if (this.villageGGSSCollection) {
				this.villageGGSSCollection.removeAll();
			}

			if (this.ggssHander) {
				this.ggssHander.destroy();
				this.ggssHander = undefined;
			}
		},
		zoomToGGSS(value) {
			if (!value) return
			this.closeGGSSPuop()
			this.closePOIPuop()
			//this.ggssDatas = this.villageGGSSDatas.filter((i) => i.类型 == value)[0];
			this.ggssDatas = value[0]
			let lng = Number(this.ggssDatas.X坐标)
			let lat = Number(this.ggssDatas.Y坐标)
			let height = Number(this.ggssDatas.高度)
			this.speedMap.flyto({
				destination: Cesium.Cartesian3.fromDegrees(lng, lat - 0.006, 500),
				orientation: {
					heading: Cesium.Math.toRadians(0),
					pitch: Cesium.Math.toRadians(-30),
					roll: Cesium.Math.toRadians(0)
				},
				duration: 1
			})

			let that = this;
			let popupHtml
			if (that.ggssDatas.类型 == "监控") {
				popupHtml = document.getElementById("jkPopup");
			} else {
				popupHtml = document.getElementById("ggssPopup");
			}
			popupHtml.style.display = "block";

			let result = new Cesium.Cartesian2();
			this.map._viewer.scene.preRender.addEventListener(function () {
				let position = Cesium.Cartesian3.fromDegrees(lng, lat, height);
				let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(
					position,
					result
				);
				if (Cesium.defined(canvasPosition)) {
					popupHtml.style.position = "fixed";
					popupHtml.style.top = canvasPosition.y - popupHtml.offsetHeight - 40 + "px";
					popupHtml.style.left = canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
				}
			});

		},
		zoomToPOI(value) {
			this.closeGGSSPuop()
			this.closePOIPuop()

			this.poiDatas = this.villagePOIDatas.filter((i) => i.id == value)[0];
			let lng = Number(this.poiDatas.X坐标)
			let lat = Number(this.poiDatas.Y坐标)
			let height = Number(this.poiDatas.高度)
			this.speedMap.flyto({
				destination: Cesium.Cartesian3.fromDegrees(lng, lat - 0.006, 500),
				orientation: {
					heading: Cesium.Math.toRadians(0),
					pitch: Cesium.Math.toRadians(-30),
					roll: Cesium.Math.toRadians(0)
				},
				duration: 1
			})

			let that = this;
			that.poiTitle = "地名信息"
			let popupHtml = document.getElementById("poiPopup");
			popupHtml.style.display = "block";

			let result = new Cesium.Cartesian2();
			this.map._viewer.scene.preRender.addEventListener(function () {
				let position = Cesium.Cartesian3.fromDegrees(lng, lat, height);
				let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(
					position,
					result
				);
				if (Cesium.defined(canvasPosition)) {
					popupHtml.style.position = "fixed";
					popupHtml.style.top = canvasPosition.y - popupHtml.offsetHeight - 65 + "px";
					popupHtml.style.left = canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
				}
			});
		},
		loadBMFWData(type, data) {
			let that = this;
			this.villagePOIDatas = data
			let datas = data.filter((j) => j.类型 == type);
			if (datas == undefined || datas.length == 0) {
				return
			}
			let _viewer = this.map._viewer;
			if (!this.bmssCollection) {
				this.bmssCollection = new Speed.Cesium.BillboardCollection({
					scene: _viewer.scene,
				});
				_viewer.scene.primitives.add(this.bmssCollection);
			} else {
				this.bmssCollection._billboards.forEach((e) => {
					if (e != undefined && e.id == type) {
						let ellipsoid = that.map._viewer.scene.globe.ellipsoid;
						let cartographic = ellipsoid.cartesianToCartographic(e._position);
						let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
						let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
						let alt = cartographic.height; // 高度
						that.speedMap.flyto({
							destination: Cesium.Cartesian3.fromDegrees(lng, lat - 0.001, 500),
							orientation: {
								pitch: Cesium.Math.toRadians(-60.0),
							},
						});
						return
					}
				});
			}
			datas.forEach((data, index) => {
				let position = Cesium.Cartesian3.fromDegrees(data.X坐标, data.Y坐标, data.高度)
				that.bmssCollection.add({
					id: data.编号,
					position: position,
					image: data.img,
					scale: 0.8,
					VerticalOrigin: Cesium.VerticalOrigin.BOTTOM
				});
			});
			this.bindBMFFEvent()
		},
		bindBMFFEvent() {
			let that = this;
			if (this.bmfwHander) return;
			else {
				this.bmfwHander = new Speed.Cesium.ScreenSpaceEventHandler(
					that.map._viewer.scene.canvas
				);
				this.bmfwHander.setInputAction((movement) => {
					let pickedObject = that.map._viewer.scene.pick(movement.position);
					if (pickedObject != undefined && pickedObject.id != undefined && pickedObject.id) {
						that.bmssCollection._billboards.forEach((e) => {
							if (e._id == pickedObject.id) {
								that.poiDatas = that.villagePOIDatas.filter((i) => i.编号 == e.id)[0];
								let ellipsoid = that.map._viewer.scene.globe.ellipsoid;
								let cartographic = ellipsoid.cartesianToCartographic(e._position);
								let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
								let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
								let alt = cartographic.height; // 高度
								var obj = {
									lng: lng,
									lat: lat,
									height: alt,
								};
								that.poiTitle = "地名信息"
								let popupHtml = document.getElementById("poiPopup");
								popupHtml.style.display = "block";
								that.map._viewer.scene.preRender.addEventListener(function () {
									let position = Cesium.Cartesian3.fromDegrees(
										obj.lng,
										obj.lat,
										obj.height
									);
									let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(
										position
									);
									if (Cesium.defined(canvasPosition)) {
										popupHtml.style.position = "fixed";
										popupHtml.style.top =
											canvasPosition.y - popupHtml.offsetHeight - 65 + "px";
										popupHtml.style.left =
											canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
									}
								});
							}
						});
					} else {
						that.closePOIPuop();
					}
				}, Speed.Cesium.ScreenSpaceEventType.LEFT_CLICK);
			}
		},
		removeBMFWData(type, data) {
			let temp = data.filter((i) => i.类型 == type);
			let removeDatas = []
			this.bmssCollection._billboards.forEach((e) => {
				for (let i = 0; i < temp.length; i++) {
					const element = temp[i];
					if (e.id == element.编号) {
						removeDatas.push(e)
					}
				}
			});
			for (let index = 0; index < removeDatas.length; index++) {
				const item = removeDatas[index];
				this.bmssCollection.remove(item);
			}
		},
		removeAllBMFWData() {
			if (!this.bmssCollection || !this.bmssCollection._billboards) {
				return
			}
			this.bmssCollection.removeAll();
			this.closePOIPuop();
			if (this.bmfwHander) {
				this.bmfwHander.destroy();
				this.bmfwHander = undefined;
			}
		},
		loadSQData(data) {
			let that = this;
			this.sqDatas = data
			if (data == undefined || data.length == 0) {
				return
			}
			let _viewer = this.map._viewer;
			if (!this.sqCollection) {
				this.sqCollection = new Speed.Cesium.BillboardCollection({
					scene: _viewer.scene,
				});
				this.sqLabelCollection = new Speed.Cesium.LabelCollection({
					scene: _viewer.scene,
				});
				_viewer.scene.primitives.add(this.sqCollection);
				_viewer.scene.primitives.add(this.sqLabelCollection);

			} else {
				this.sqCollection.removeAll()
				this.sqLabelCollection.removeAll()
			}
			data.forEach((data, index) => {
				let position = Cesium.Cartesian3.fromDegrees(data.X坐标, data.Y坐标, data.高度)
				that.sqCollection.add({
					id: data.编号,
					position: position,
					image: data.img,
					scale: 0.8,
					VerticalOrigin: Cesium.VerticalOrigin.BOTTOM
				});
				this.sqLabelCollection.add({
					id: data.编号,
					position: position,
					text: data.名称,
					font: "14px sans-serif bold",
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
					pixelOffset: new Cesium.Cartesian2(0, -20),
					fillColor: Cesium.Color.WHITE,
				});
			});
			this.bindSQEvent()
		},
		bindSQEvent() {
			let that = this;
			if (this.sqHander) return;
			else {
				this.sqHander = new Speed.Cesium.ScreenSpaceEventHandler(
					that.map._viewer.scene.canvas
				);
				this.sqHander.setInputAction((movement) => {
					let pickedObject = that.map._viewer.scene.pick(movement.position);
					if (pickedObject != undefined && pickedObject.id != undefined && pickedObject.id) {
						that.sqCollection._billboards.forEach((e) => {
							if (e._id == pickedObject.id) {
								that.poiDatas = that.sqDatas.filter((i) => i.编号 == e.id)[0];
								let ellipsoid = that.map._viewer.scene.globe.ellipsoid;
								let cartographic = ellipsoid.cartesianToCartographic(e._position);
								let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
								let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
								let alt = cartographic.height; // 高度
								var obj = {
									lng: lng,
									lat: lat,
									height: alt,
								};
								that.closePopup();
								that.poiTitle = "地名信息"
								let popupHtml = document.getElementById("poiPopup");
								popupHtml.style.display = "block";
								that.map._viewer.scene.preRender.addEventListener(function () {
									let position = Cesium.Cartesian3.fromDegrees(
										obj.lng,
										obj.lat,
										obj.height
									);
									let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(
										position
									);
									if (Cesium.defined(canvasPosition)) {
										popupHtml.style.position = "fixed";
										popupHtml.style.top =
											canvasPosition.y - popupHtml.offsetHeight - 65 + "px";
										popupHtml.style.left =
											canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
									}
								});
							}
						});
					} else {
						that.closePOIPuop();
					}
				}, Speed.Cesium.ScreenSpaceEventType.LEFT_CLICK);
			}
		},
		removeSQData() {
			if (!this.sqCollection || !this.sqCollection._billboards) {
				return
			}
			this.sqCollection.removeAll();
			this.sqLabelCollection.removeAll()

			this.closePOIPuop();
			if (this.sqHander) {
				this.sqHander.destroy();
				this.sqHander = undefined;
			}
		},
		loadHNZNData(data) {
			let that = this;
			if (data == undefined || data.length == 0) {
				return
			}
			this.closePOIPuop();
			this.closeGGSSPuop();

			this.spherePositions = [];
			let _viewer = this.map._viewer;
			if (!this.hnznCollection) {
				this.hnznCollection = new Speed.Cesium.BillboardCollection({
					scene: _viewer.scene,
				});
				this.hnznLabelCollection = new Speed.Cesium.LabelCollection({
					scene: _viewer.scene,
				});
				let keyPtPrimitives = _viewer.scene.primitives.add(this.hnznCollection);
				keyPtPrimitives.key = "keyPts";
				_viewer.scene.primitives.add(this.hnznLabelCollection);

			}
			// else {
			// 	this.hnznCollection.removeAll()
			// 	this.hnznLabelCollection.removeAll()
			// }
			const saveData = new Array(); //对象存储容器
			data.data.forEach((item, index) => {
				let position = Cesium.Cartesian3.fromDegrees(item.X坐标, item.Y坐标, item.高度)
				let billboard = that.hnznCollection.add({
					id: item.id,
					position: position,
					image: data.mapicon,
					scale: 0.3,
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 20000.0),
					scaleByDistance: new Cesium.NearFarScalar(5000, 1, 20000, 0.5),
				});
				this.hnznLabelCollection.add({
					id: item.id,
					position: position,
					text: item.名称,
					font: "12px Microsoft Yahei bold",
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
					pixelOffset: new Cesium.Cartesian2(0, -50),
					fillColor: Cesium.Color.WHITE,
					distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 15000.0),
				});

				this.hnznDatas.push(item)
				this.spherePositions.push(position);

				//为Cesium.Billboard对象添加弹跳动画
				// this.addAnimationForBillboard(billboard, item.X坐标, item.Y坐标, item.高度)
				// let pieceNum = 300
				// //判断是否需要执行分段
				// if (index !== 0 && (index + 1) % pieceNum === 0) {
				// 	saveData.push(that.hnznCollection.length);
				// 	//创建新的Collection集合
				// 	that.hnznCollection = new Cesium.BillboardCollection({
				// 		show: true,
				// 	});
				// 	keyPtPrimitives = _viewer.scene.primitives.add(that.hnznCollection);
				// 	keyPtPrimitives.key = "keyPts";
				// }
			});
			//最后一次添加尚未保存的数据
			if (that.hnznCollection.length !== 0) {
				saveData.push(that.hnznCollection);
			}
			this.bindHNZNEvent()

			this.speedMap.flyto(Cesium.BoundingSphere.fromPoints(this.spherePositions));

		},
		//为Cesium.Billboard对象添加弹跳动画
		addAnimationForBillboard(_billboard, _longitude, _latitude, _curHeight) {
			let minHeight = _curHeight
			let maxHeight = _curHeight + 20
			let heightDelta = 1
			this.map._viewer.scene.preUpdate.addEventListener(function (scene, time) {
				_curHeight += heightDelta;
				_billboard.position = Cesium.Cartesian3.fromDegrees(_longitude, _latitude, _curHeight);
				const cartesian3_pos = _billboard.position;
				const cartographic_pos = Cesium.Cartographic.fromCartesian(cartesian3_pos, Cesium.Ellipsoid.WGS84)
				if (cartographic_pos.height >= maxHeight ||
					cartographic_pos.height <= minHeight) {
					heightDelta *= -1.0;
				}
			});
		},
		bindHNZNEvent() {
			let that = this;
			if (this.hnznHander) return;
			else {
				this.hnznHander = new Speed.Cesium.ScreenSpaceEventHandler(
					that.map._viewer.scene.canvas
				);
				this.hnznHander.setInputAction((movement) => {
					let pickedObject = that.map._viewer.scene.pick(movement.position);
					if (pickedObject != undefined && pickedObject.id != undefined && pickedObject.id) {
						that.hnznCollection._billboards.forEach((e) => {
							if (e._id == pickedObject.id) {
								that.poiDatas = that.hnznDatas.filter((i) => i.id == e._id)[0];
								let ellipsoid = that.map._viewer.scene.globe.ellipsoid;
								let cartographic = ellipsoid.cartesianToCartographic(e._position);
								let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
								let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
								let alt = cartographic.height; // 高度
								var obj = {
									lng: lng,
									lat: lat,
									height: alt,
								};
								that.poiTitle = "惠农助农信息"
								that.closeGGSSPuop();
								let popupHtml = document.getElementById("poiPopup");
								popupHtml.style.display = "block";
								that.map._viewer.scene.preRender.addEventListener(function () {
									let position = Cesium.Cartesian3.fromDegrees(
										obj.lng,
										obj.lat,
										obj.height
									);
									let canvasPosition = that.map._viewer.scene.cartesianToCanvasCoordinates(
										position
									);
									if (Cesium.defined(canvasPosition)) {
										popupHtml.style.position = "fixed";
										popupHtml.style.top =
											canvasPosition.y - popupHtml.offsetHeight - 55 + "px";
										popupHtml.style.left =
											canvasPosition.x - popupHtml.offsetWidth / 2 + "px";
									}
								});
							}
						});
					} else {
						that.closePOIPuop();
					}
				}, Speed.Cesium.ScreenSpaceEventType.LEFT_CLICK);
				this.hnznHander.setInputAction((movement) => {
					const pickedObject = that.map._viewer.scene.pick(movement.endPosition);
					if (Cesium.defined(pickedObject) && pickedObject.id != undefined) {
						that.map._viewer._container.style.cursor = "pointer";
					} else {
						that.map._viewer._container.style.cursor = "default";
					}
				}, Speed.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			}
		},
		removeHNZNData(datas) {
			debugger
			if (!this.hnznCollection || !this.hnznCollection._billboards || datas == undefined || datas.data == undefined) {
				return
			}
			for (let index = 0; index < datas.data.length; index++) {
				const temp = datas.data[index];
				this.hnznCollection._billboards.forEach((item) => {
					if (item != undefined && item._id === temp.id) {
						this.hnznCollection.remove(item)
					}
				})
				this.hnznLabelCollection._labels.forEach((labelitm) => {
					if (labelitm._id === temp.id) {
						this.hnznLabelCollection.remove(labelitm)
					}
				})

				this.hnznDatas.map((itm, idx) => {
					if (itm.id === temp.id) {
						this.hnznDatas.splice(idx, 1);
					}
				});

			}

			this.closePOIPuop();
			if (this.hnznHander) {
				this.hnznHander.destroy();
				this.hnznHander = undefined;
			}
		},
		removeAllHNZNData() {
			if (!this.hnznCollection || !this.hnznCollection._billboards) {
				return
			}
			this.hnznCollection.removeAll();
			this.hnznLabelCollection.removeAll();

			this.closePOIPuop();
			if (this.hnznHander) {
				this.hnznHander.destroy();
				this.hnznHander = undefined;
			}
		},

	},

};
</script>

<style scoped>
.civil_map {
	width: 100%;
	height: 100%;
	z-index: 1;
	position: relative;
	background-color: #000;
}

#addressPoup {
	z-index: 100;
	width: 340px;
	height: 414px;
	background-size: 100% 100%;
	background: url("@/assets/speed/case/civil/bg.png") no-repeat;
	display: none;
}

/* #communtiyPoup {
	z-index: 100;
	width: 230px;
	height: 220px;
	background: url("@/assets/speed/case/civil/IMG_3978.PNG") no-repeat;
	background-size: 100% 100%;
	display: none;
} */
#roadPopup,
#doorPopup,
#ggssPopup,
#poiPopup,
#communtiyPoup,
#gridPopup {
	z-index: 100;
	width: 300px;
	height: 200px;
	background: rgba(7, 26, 54, 0.6);
	display: none;
}

#jkPopup {
	z-index: 100;
	width: 380px;
	height: 360px;
	background: rgba(7, 26, 54, 0.6);
	display: none;
}

.control_message {
	width: 100%;
	height: 30%;
	display: grid;
	grid-template-rows: 1fr 1fr;
	grid-template-columns: 1fr 1fr;
}

.jk_content {
	width: 100%;
	height: 90%;
	padding: 3%;
}

.jk_message {
	height: 25px;
	color: white;
	display: flex;
	overflow: hidden;
	align-items: center;
	text-overflow: ellipsis;
	background: linear-gradient(to right, rgba(36, 201, 255, 0) 0%, rgba(36, 201, 255, .2) 50%, rgba(36, 201, 255, 0) 100%);
}

.control_vedio {
	width: 100%;
	height: 65%;
	margin-top: 4%;
	background: url("@/assets/speed/case/civil/gk_bg.png") no-repeat;
	background-size: 100% 100%;
}

.jk_vedio {
	width: 90%;
	height: 50%;
	position: absolute;
	left: 50%;
	transform: translate(-50%, 4%);
}

.doortitle,
.ggsstitle,
.poititle,
.gridtitle {
	width: 100%;
	height: 35px;
	background-image: url("@/assets/speed/case/civil/title.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	padding: 1px 0 0;
}

.close-button {
	color: rgb(34 255 254);
	position: absolute;
	top: 0;
	right: 0;
	padding: 4px 4px 0 0;
	text-align: center;
	width: 20px;
	height: 20px;
	font: 16px/14px Tahoma, Verdana, sans-serif;
	text-decoration: none;
	font-weight: 700;
	background: transparent;
	z-index: 20170825;
	cursor: pointer;
}

.doorname,
.ggssname,
.poiname,
.wgbh {
	margin: 1px 0 0 16px;
	font-style: normal;
	font-weight: 600;
	font-size: 18px;
	line-height: 27px;
	letter-spacing: .06em;
	background: linear-gradient(180deg, #fff 0%, #22fffe 100%);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.door_message,
.ggss_message,
.poi_message,
.wg_message,
.grid_message {
	height: 20px;
	color: white;
	display: flex;
	margin-top: 5px;
	margin-left: 40px;
	margin-right: 40px;
	overflow: hidden;
	text-overflow: ellipsis;
	background: linear-gradient(to right, rgba(36, 201, 255, 0) 0%, rgba(36, 201, 255, .2) 50%, rgba(36, 201, 255, 0) 100%);
}

.roadInfo {
	height: 35px;
}

.wg_message,
.poi_message {
	margin-top: 10px;
}

.poi_remark {
	height: 50px;
}

.title {
	padding: 15% 12%;
	font-size: 16px;
	font-weight: 700;
	color: #ffffff;
}

.housePoup {
	position: absolute;
	z-index: 999;
	display: none;
	width: 400px;
	height: 350px;
	background: url("@/assets/speed/case/civil/pop-up.png") no-repeat;
	background-size: 100% 100%;

	/* padding: 2.8% 1% 0.8% 5.5%; */
}

.masterList {
	color: #C1E1FF;
	font-size: 14px;
}


.list-content {
	color: white;
	font-size: 14px;
	line-height: 24px;
}

li::marker {
	color: #02EEFF;
}


.master {
	width: 100%;
	display: inline-grid;
	grid-template-columns: 55% 45%;
	grid-template-rows: 100%;
	height: 32px;
	align-items: center;
}

.masterinfo {
	display: inline-grid;
	width: 100%;
	height: 95px;
	align-items: center;

}

.popleInfo {
	position: absolute;
	margin-left: 27%;
	margin-top: 14%;
}

.roomInfo {
	position: absolute;
	height: 30%;
	width: 70%;
	margin-top: 60%;
	margin-left: 26%;

}

.roomInfo-pic {
	width: 34%;
	height: 90%;
	margin-right: 5%;
	background: #071a36;
	border: 1px solid #017ede;
}

.communtiy,
.diming {
	position: absolute;
	left: 2%;
	top: 8%;
	padding: 2%;
	font-size: 14px;
	font-family: Source Han Sans CN, Source Han Sans CN-Bold;
	font-weight: 700;
	text-align: left;
	color: #ffffff;
	line-height: 26px;
}

.communtiy {
	padding: 20%;
}

.biaozhi {
	position: absolute;
	left: 2%;
	top: 56%;
	padding: 2%;
	font-size: 14px;
	font-family: Source Han Sans CN, Source Han Sans CN-Bold;
	font-weight: 700;
	text-align: left;
	color: #ffffff;
	line-height: 26px;
	width: 96%;
	height: 40%;
	overflow: auto;
}

.biaozhi_content {
	background: url("@/assets/speed/case/civil/img_dmbz.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	padding: 1%;
}

.diminglaili {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
}

.shbz-popup {
	z-index: 100;
	width: 350px;
	height: 450px;
	background: rgba(7, 26, 54, 0.6);
	display: none;
}

.base-info {
	height: 140px;
	padding: 2px 5px;
	display: flex;
}

.photo-info {
	width: 35%;
}

.other-base-info {
	width: 65%;
}

.relevant-info {
	padding: 5px 10px;
}

.shbz-message {
	height: 20px;
	color: white;
	display: flex;
	overflow: hidden;
	text-overflow: ellipsis;
	background: linear-gradient(to right, rgba(36, 201, 255, 0) 0%, rgba(36, 201, 255, .2) 50%, rgba(36, 201, 255, 0) 100%);
	margin: 5px 10px;
	/* justify-content: space-between; */
	line-height: 20px;
}

.photo-img {
	width: 100%;
	height: 100%;
	border: 1px solid white;
}

.tabs-item {
	max-height: 135px;
	overflow: auto;
}

.item-row {
	display: flex;
}

.item-column {
	display: flex;
	flex-direction: column;
	width: 50%;
}

.margin-style {
	margin: 2.5px 10px;
}

.message-color {
	color: aqua;
}

::v-deep .el-tabs__item {
	color: white;
}

::v-deep .el-tabs__item.is-active {
	color: var(--el-color-primary);
}
</style>
