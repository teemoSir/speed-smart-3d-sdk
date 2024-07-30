<template>
	<div class="factory-map" :id="mapId">
		<div id="main-product-popup">
			<div class="main-product-header">
				<span class="main-product-title">{{ mainProductName }}</span>
			</div>
			<div class="content">
				<el-scrollbar>
					<span class="name">描述：</span>
					<span class="value">{{ mainProductDescription }}</span>
				</el-scrollbar>
			</div>
		</div>

		<div id="environment-monitor-popup" :class="clickedEnvironmentMonitorClass">
			<span class="device-name">{{ clickedEnvironmentMonitorData.name }}</span>

			<div class="info">
				<span class="label">设备数值:</span>
				<span class="value">{{ clickedEnvironmentMonitorData.value }}</span>
			</div>
			<div class="info">
				<span class="label">设备状态:</span>
				<span class="value">{{ clickedEnvironmentMonitorData.status }}</span>
			</div>
			<div class="info">
				<span class="label">设备指标:</span>
				<span class="value">{{ clickedEnvironmentMonitorData.target }}</span>
			</div>
			<div class="info">
				<span class="label">报警次数:</span>
				<span class="value">{{ clickedEnvironmentMonitorData.count }}</span>
			</div>
		</div>

		<div id="personnel-popup">
			<div class="personnel-header">
				<span class="personnel-title">{{ clickedPersonnel.name }}</span>
			</div>
			<div class="content">
				<el-scrollbar>
					<div class="name-value">
						<span class="name">职位：</span>
						<span class="value">{{ clickedPersonnel.job }}</span>
					</div>
					<div class="name-value">
						<span class="name">电话：</span>
						<span class="value">{{ clickedPersonnel.phone }}</span>
					</div>
					<div class="name-value">
						<span class="name">车间：</span>
						<span class="value">{{ clickedPersonnel.group }}</span>
					</div>
					<div class="name-value">
						<span class="name">职业认证：</span>
						<el-image v-if="clickedPersonnel.certificationImage"
								  :src="clickedPersonnel.certificationImage"
								  :preview-src-list="[clickedPersonnel.certificationImage]" preview-teleported/>
						<span class="value" v-else>无</span>
					</div>
				</el-scrollbar>
			</div>
		</div>

		<div id="hazard-popup">
			<div class="hazard-header">
				<span class="hazard-title">{{ clickedHazard.name }}</span>
			</div>
			<div class="content">
				<el-scrollbar>
					<div class="name-value">
						<span class="name">当前状态：</span>
						<span class="value">{{ clickedHazard.type }}</span>
					</div>
					<div class="name-value">
						<span class="name">上报人：</span>
						<span class="value">{{ clickedHazard.uploadPerson }}</span>
					</div>
					<div class="name-value">
						<span class="name">上报时间：</span>
						<span class="value">{{ clickedHazard.uploadDate }}</span>
					</div>
					<div class="name-value" v-if="clickedHazard.resolvePerson">
						<span class="name">解决人：</span>
						<span class="value">{{ clickedHazard.resolvePerson }}</span>
					</div>
					<div class="name-value" v-if="clickedHazard.resolveDate">
						<span class="name">解决时间：</span>
						<span class="value">{{ clickedHazard.resolveDate }}</span>
					</div>
					<div class="name-value">
						<span class="name">隐患现场：</span>
						<el-image
							:src="clickedHazard.riskPicture"
							:preview-src-list="[clickedHazard.riskPicture]" preview-teleported/>
					</div>
					<div class="name-value" v-if="clickedHazard.resolvePicture">
						<span class="name">处理结果：</span>
						<el-image
							:src="clickedHazard.resolvePicture"
							:preview-src-list="[clickedHazard.resolvePicture]" preview-teleported/>
					</div>
				</el-scrollbar>
			</div>
		</div>

		<div id="device-popup">
			<div class="device-header">
				<span class="device-title">{{ clickedDevice.name }}</span>
			</div>
			<div class="content">
				<el-scrollbar>
					<div class="name-value" v-if="clickedDevice.deviceImage">
						<span class="name">设备图片：</span>
						<el-image
							:src="clickedDevice.deviceImage"
							:preview-src-list="[clickedDevice.deviceImage]" preview-teleported/>
					</div>
					<div class="name-value">
						<span class="name">设备总数：</span>
						<span class="value">{{ clickedDevice.count }}台</span>
					</div>
					<div class="name-value">
						<span class="name">作业设备：</span>
						<span class="value">{{ clickedDevice.work }}台</span>
					</div>
					<div class="name-value">
						<span class="name">离线设备：</span>
						<span class="value">{{ clickedDevice.offline }}台</span>
					</div>
					<div class="name-value">
						<span class="name">异常报警：</span>
						<span class="value">{{ clickedDevice.alarm }}次</span>
					</div>
				</el-scrollbar>
			</div>
		</div>

		<div id="alarm-popup">
			<div class="alarm-header">
				<span class="alarm-title">{{ clickedAlarm.name }}</span>
			</div>
			<div class="content">
				<el-scrollbar>
					<div class="name-value">
						<span class="name">警告详情：</span>
						<span class="value">{{ clickedAlarm.detail }}</span>
					</div>
					<div class="name-value">
						<span class="name">时间：</span>
						<span class="value">{{ clickedAlarm.time }}</span>
					</div>
				</el-scrollbar>
			</div>
		</div>

		<video id="video-1" controls loop autoplay muted crossorigin>
			<source :src="videos[0].src" type="video/mp4"/>
		</video>

		<video id="video-2" controls loop autoplay muted crossorigin>
			<source :src="videos[1].src" type="video/mp4"/>
		</video>
	</div>
</template>

<script>
import * as Speed from "@/cesiumSDK/index";
import { cartesian2lonlat as cartesian2LonLatAlt, cartesianToWindowPosition } from "@/cesiumSDK/core/util/pointconvert"
import { drawBillboard, drawGradientWall } from "@/cesiumSDK/core/entityJS/draw";
import RemoveEntity from "@/cesiumSDK/core/entityJS/removeEntity";
import modelRoam from "@/cesiumSDK/core/roam/modelRoam";
import * as Cesium from "cesium";
import * as uuid from "uuid";
import axios from "axios";

const modelUrl = "http://36.152.66.51:8088/3dtiles/中丹化工/tileset.json";

let _leftClickHandler;

let _removeEntity;

let _mainProductsEntities = [];

let _environmentMonitorEntities = [];

let _personnelEntities = [];

let _hazardEntities = [];

let _deviceEntities = [];

let _alarmEntities = [];

let _riskOperationsEntities = [];

let _videoEntities = [];

let _clickedCartesian;

let _popupHtml;

export default {
	name: "FactoryMap",
	data() {
		return {
			mapId: "",
			modelComponents: [],
			// featureQueryEnabled: true,
			mainProducts: [
				{
					name: "异硫氰酸烯丙酯",
					description: "异硫氰酸烯丙酯，是一种有机化合物，化学式为C4H5NS，主要用于配制香辛料和芥子型香精，供泡菜、罐头、沙司、调味料等用，也可用作熏蒸剂，军用毒气等。",
					longitude: 119.930547,
					latitude: 32.136372,
					height: 5.3,
					size: 40,
					image: require("@/assets/speed/case/factory/enterprise/main-products/异硫氰酸烯丙酯.png"),
				},
				{
					name: "乙氧基喹啉",
					description: "乙氧基喹啉(ethoxyquin)简称乙氧喹，商品名为山道喹或虎皮灵，化学名称为6-乙氧基1,2-二氢化2,2,4 三甲基喹啉，是黄褐色粘稠液体，不易于饲料混合均匀，所以通常加工成约含乙氧喹25%的添加剂。乙氧基喹啉的生产原料是对氨基苯乙醚和丙酮，在催化剂的存在下加热脱水缩合制得粗品。催化剂早期采用卤化氢，后来多用磺酸类(如苯磺酸、甲基磺酸、甲酚磺酸等)。粗品的后处理工艺有减压蒸馏、萃取后减压蒸馏及酸性水处理回收精制等。",
					longitude: 119.930893,
					latitude: 32.137045,
					height: 12,
					size: 40,
					image: require("@/assets/speed/case/factory/enterprise/main-products/乙氧基喹啉.png"),
				},
				{
					name: "邻氨基苯乙醚",
					description: "邻氨基苯乙醚，又名2-氨基苯乙醚、2-乙氧基苯胺、邻乙氧基苯胺，是一种有机化合物，化学式为C8H11NO，主要用作染料、香料、医药的中间体。",
					longitude: 119.931021,
					latitude: 32.136764,
					height: 10.4,
					size: 40,
					image: require("@/assets/speed/case/factory/enterprise/main-products/邻氨基苯乙醚.png"),
				},
				{
					name: "S-(2)氯丙酸甲酯",
					description: "S-(2)氯丙酸甲酯，是一种有机化合物，化学式为C4H7ClO2，主要用作农药产品中间体。",
					longitude: 119.931123,
					latitude: 32.136511,
					height: 9,
					size: 40,
					image: require("@/assets/speed/case/factory/enterprise/main-products/S-2氯丙酸甲酯.png"),
				},
				{
					name: "对氨基苯甲醚",
					description: "分子式(Formula)：C7H9NO，分子量(Molecular Weight)：123.15，熔点 57.2℃；沸点 243℃；相对密度1.071；折射率 1.5559；溶解性：溶于乙醇和乙醚，微溶于水。凝固点：57℃ 。",
					longitude: 119.931666,
					latitude: 32.136821,
					height: 9,
					size: 40,
					image: require("@/assets/speed/case/factory/enterprise/main-products/对氨基苯甲醚.png"),
				},
				{
					name: "对氨基苯乙醚",
					description: "对氨基苯乙醚，又名4-氨基苯乙醚、4-乙氧基苯胺、对乙氧基苯胺，是一种有机化合物，化学式为C8H11NO，主要用作氧化还原指示剂。",
					longitude: 119.931792,
					latitude: 32.136556,
					height: 6,
					size: 40,
					image: require("@/assets/speed/case/factory/enterprise/main-products/对氨基苯乙醚.png"),
				}
			],
			mainProductName: "",
			mainProductDescription: "",
			videos: [
				{
					id: "video_0",
					name: "大门左侧监控",
					rectangle: [119.934307, 32.136199, 119.934520, 32.136381],
					src: "http://36.152.66.51:8088/video/JKvideo1.mp4",
				},
				{
					id: "video_1",
					name: "大门右侧监控",
					rectangle: [119.934631, 32.136305, 119.934871, 32.136450],
					src: "http://36.152.66.51:8088/video/JKvideo2.mp4",
				},
			],
			riskOperations: [
				{
					id: "重大风险",
					color: "#ff2121",
					positions: [119.930640, 32.136865, 0.9, 119.930486, 32.137221, 0.9, 119.931031, 32.137380, 0.9, 119.931173, 32.137021, 0.9, 119.930640, 32.136865, 0.9],
					maximumHeights: [100, 100, 100, 100, 100],
					minimumHeights: [0, 0, 0, 0, 0],
				},
				{
					id: "较大风险",
					color: "#e8b816",
					positions: [119.932804, 32.136871, 0.9, 119.932711, 32.137083, 0.9, 119.933293, 32.137248, 0.9, 119.933367, 32.137035, 0.9, 119.932804, 32.136871, 0.9],
					maximumHeights: [100, 100, 100, 100, 100],
					minimumHeights: [0, 0, 0, 0, 0],
				},
				{
					id: "一般风险",
					color: "#169fe8",
					positions: [119.934487, 32.138016, 0.9, 119.934177, 32.138742, 0.9, 119.934640, 32.138880, 0.9, 119.934951, 32.138135, 0.9, 119.934487, 32.138016, 0.9],
					maximumHeights: [100, 100, 100, 100, 100],
					minimumHeights: [0, 0, 0, 0, 0],
				},
				{
					id: "低风险",
					color: "#00ff33",
					positions: [119.931392, 32.136649, 0.9, 119.931247, 32.137002, 0.9, 119.931857, 32.137185, 0.9, 119.932004, 32.136820, 0.9, 119.931392, 32.136649, 0.9],
					maximumHeights: [100, 100, 100, 100, 100],
					minimumHeights: [0, 0, 0, 0, 0],
				},
			],
			environmentMonitors: [
				{
					id: "environment_monitor_0",
					type: "temperature",
					name: "温度传感器",
					longitude: 119.933850,
					latitude: 32.137538,
					altitude: 10.5,
					image: require("@/assets/speed/case/civil/POI/defalut/hds.png"),
					unit: "°C",
					currentValue: "12",
					status: "正常",
					target: "温度",
					count: 0,
				},
				{
					id: "environment_monitor_1",
					type: "humidity",
					name: "湿度传感器",
					longitude: 119.934504,
					latitude: 32.137703,
					altitude: 10.5,
					image: require("@/assets/speed/case/civil/POI/defalut/hds.png"),
					unit: "%",
					currentValue: "50",
					status: "报警",
					target: "湿度",
					count: 5,
				},
				{
					id: "environment_monitor_2",
					type: "odor",
					name: "气味传感器",
					longitude: 119.933990,
					latitude: 32.137201,
					altitude: 10.5,
					image: require("@/assets/speed/case/civil/POI/defalut/hds.png"),
					unit: "ppb",
					currentValue: "5",
					status: "正常",
					target: "气味",
					count: 0,
				},
				{
					id: "environment_monitor_3",
					type: "noise",
					name: "噪音传感器",
					longitude: 119.934615,
					latitude: 32.137399,
					altitude: 10.6,
					image: require("@/assets/speed/case/civil/POI/defalut/hds.png"),
					unit: "dB",
					currentValue: "73",
					status: "报警",
					target: "噪音",
					count: 10,
				},
				{
					id: "environment_monitor_4",
					type: "radiation",
					name: "辐射传感器",
					longitude: 119.934266,
					latitude: 32.137447,
					altitude: 10.9,
					image: require("@/assets/speed/case/civil/POI/defalut/hds.png"),
					unit: "mSv/h",
					currentValue: "10",
					status: "正常",
					target: "辐射",
					count: 0,
				},
			],
			clickedEnvironmentMonitorClass: "",
			clickedEnvironmentMonitorData: {},
			personnel: [
				{
					id: "personnel_0",
					longitude: 119.931381,
					latitude: 32.136614,
					altitude: 1,
					image: require("@/assets/speed/case/civil/POI/dm/pcs.png"),
					name: "张三",
					job: "钳工",
					phone: "186****4606",
					group: "1车间1号生产线",
					certificationImage: require("@/assets/speed/case/factory/workshop/personnel/certificate.png"),
				},
				{
					id: "personnel_1",
					longitude: 119.932535,
					latitude: 32.137396,
					altitude: 1,
					image: require("@/assets/speed/case/civil/POI/dm/pcs.png"),
					name: "李四",
					job: "电工",
					phone: "186****4606",
					group: "1车间2生产线",
					certificationImage: require("@/assets/speed/case/factory/workshop/personnel/certificate.png"),
				},
				{
					id: "personnel_2",
					longitude: 119.935227,
					latitude: 32.137531,
					altitude: 1,
					image: require("@/assets/speed/case/civil/POI/dm/pcs.png"),
					name: "王五",
					job: "车工",
					phone: "186****4606",
					group: "1车间3号生产线",
					certificationImage: require("@/assets/speed/case/factory/workshop/personnel/certificate.png"),
				},
				{
					id: "personnel_3",
					longitude: 119.935751,
					latitude: 32.138824,
					altitude: 1,
					image: require("@/assets/speed/case/civil/POI/dm/pcs.png"),
					name: "赵六",
					job: "经理",
					phone: "186****4606",
					group: "1车间(1-3号生产线)",
				},
			],
			clickedPersonnel: "",
			hazard: [
				{
					id: "hazard_0",
					longitude: 119.933585,
					latitude: 32.137209,
					altitude: 10.8,
					image: require("@/assets/speed/case/factory/workshop/hazard/icon-hazard-dcl.png"),
					type: "待处理",
					name: "机械设备老化",
					uploadPerson: "张三",
					uploadDate: "2023-04-05",
					riskPicture: require("@/assets/speed/case/factory/workshop/hazard/example2.png"),
				},
				{
					id: "hazard_1",
					longitude: 119.932422,
					latitude: 32.137116,
					altitude: 11.3,
					image: require("@/assets/speed/case/factory/workshop/hazard/icon-hazard-shpf.png"),
					type: "审核派发",
					name: "机械设备老化",
					uploadPerson: "张三",
					uploadDate: "2023-04-05",
					resolvePerson: "李四",
					resolveDate: "2023-04-26",
					riskPicture: require("@/assets/speed/case/factory/workshop/hazard/example2.png"),
					resolvePicture: require("@/assets/speed/case/factory/workshop/hazard/example1.png"),
				},
				{
					id: "hazard_2",
					longitude: 119.936584,
					latitude: 32.137429,
					altitude: 9.9,
					image: require("@/assets/speed/case/factory/workshop/hazard/icon-hazard-ycl.png"),
					type: "已处理",
					name: "机械设备老化",
					uploadPerson: "张三",
					uploadDate: "2023-04-05",
					resolvePerson: "李四",
					resolveDate: "2023-04-26",
					riskPicture: require("@/assets/speed/case/factory/workshop/hazard/example2.png"),
					resolvePicture: require("@/assets/speed/case/factory/workshop/hazard/example1.png"),
				},
				{
					id: "hazard_3",
					longitude: 119.935078,
					latitude: 32.139186,
					altitude: 11,
					image: require("@/assets/speed/case/factory/workshop/hazard/icon-hazard-yhjc.png"),
					type: "隐患解除",
					name: "机械设备老化",
					uploadPerson: "张三",
					uploadDate: "2023-04-05",
					resolvePerson: "李四",
					resolveDate: "2023-04-26",
					riskPicture: require("@/assets/speed/case/factory/workshop/hazard/example2.png"),
					resolvePicture: require("@/assets/speed/case/factory/workshop/hazard/example1.png"),
				},
			],
			clickedHazard: "",
			device: [
				{
					id: "device_0",
					longitude: 119.930245,
					latitude: 32.137108,
					altitude: 10.4,
					image: require("@/assets/speed/case/civil/POI/dm/cmwyh.png"),
					name: "设备A",
					count: 100,
					work: 20,
					offline: 15,
					alarm: 6,
					deviceImage: require("@/assets/speed/case/factory/production-line/device/example.png"),
				},
				{
					id: "device_1",
					longitude: 119.930338,
					latitude: 32.136870,
					altitude: 10.5,
					image: require("@/assets/speed/case/civil/POI/dm/cmwyh.png"),
					name: "设备B",
					count: 100,
					work: 20,
					offline: 15,
					alarm: 6,
					deviceImage: require("@/assets/speed/case/factory/production-line/device/example.png"),
				},
				{
					id: "device_2",
					longitude: 119.930941,
					latitude: 32.137246,
					altitude: 6.8,
					image: require("@/assets/speed/case/civil/POI/dm/cmwyh.png"),
					name: "设备C",
					count: 100,
					work: 20,
					offline: 15,
					alarm: 6,
					deviceImage: require("@/assets/speed/case/factory/production-line/device/example.png"),
				},
				{
					id: "device_3",
					longitude: 119.931071,
					latitude: 32.136846,
					altitude: 12.5,
					image: require("@/assets/speed/case/civil/POI/dm/cmwyh.png"),
					name: "设备D",
					count: 100,
					work: 20,
					offline: 15,
					alarm: 6,
					deviceImage: require("@/assets/speed/case/factory/production-line/device/example.png"),
				},
			],
			clickedDevice: "",
			alarm: [
				{
					id: "alarm_0",
					longitude: 119.931907,
					latitude: 32.136710,
					altitude: 4.7,
					image: require("@/assets/speed/case/civil/POI/dm/sfj.png"),
					name: "设备A",
					detail: "温度过高",
					time: "11:22:33",
				},
				{
					id: "alarm_1",
					longitude: 119.931847,
					latitude: 32.136657,
					altitude: 4.7,
					image: require("@/assets/speed/case/civil/POI/dm/sfj.png"),
					name: "设备B",
					detail: "温度过高",
					time: "11:22:32",
				},
				{
					id: "alarm_2",
					longitude: 119.931771,
					latitude: 32.136627,
					altitude: 4.7,
					image: require("@/assets/speed/case/civil/POI/dm/sfj.png"),
					name: "设备C",
					detail: "温度过高",
					time: "11:22:31",
				},
				{
					id: "alarm_3",
					longitude: 119.931684,
					latitude: 32.136649,
					altitude: 4.7,
					image: require("@/assets/speed/case/civil/POI/dm/sfj.png"),
					name: "设备D",
					detail: "温度过高",
					time: "11:22:30",
				},
				{
					id: "alarm_4",
					longitude: 119.931902,
					latitude: 32.136614,
					altitude: 6,
					image: require("@/assets/speed/case/civil/POI/dm/sfj.png"),
					name: "设备E",
					detail: "温度过高",
					time: "11:22:29",
				},
				{
					id: "alarm_5",
					longitude: 119.931844,
					latitude: 32.136542,
					altitude: 6,
					image: require("@/assets/speed/case/civil/POI/dm/sfj.png"),
					name: "设备F",
					detail: "温度过高",
					time: "11:22:28",
				},
				{
					id: "alarm_6",
					longitude: 119.931681,
					latitude: 32.136557,
					altitude: 6,
					image: require("@/assets/speed/case/civil/POI/dm/sfj.png"),
					name: "设备G",
					detail: "温度过高",
					time: "11:22:27",
				},
				{
					id: "alarm_7",
					longitude: 119.931615,
					latitude: 32.136463,
					altitude: 6,
					image: require("@/assets/speed/case/civil/POI/dm/sfj.png"),
					name: "设备H",
					detail: "温度过高",
					time: "11:22:26",
				},
			],
			clickedAlarm: "",
		}
	},
	created() {
		this.mapId = uuid.v4();
	},
	mounted() {
		this.initMap();
	},
	beforeUnmount() {
		// this.destroyFeatureQuery();
		this.removeLeftClickEventListener();
		this.removeMainProductsEntities();
		this.removeRiskOperationWalls();
		this.removeVideoEntities();
		this.removeEnvironmentMonitorEntities();
		this.removePersonnelEntities();
		this.removeHazardEntities();
		this.removeDeviceEntities();
		this.removeAlarmEntities();
		this.stopRoam();
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
						show: true,
					},
					{
						id: 202,
						type: "xt",
						name: "星图地形",
						icon: "img/basemaps/terrain.png",
						tooltip: "星图地球提供的地形服务",
						url: "https://tiles1.geovisearth.com/base/v1/terrain",
					},
				],
				basemaps: [
					{
						id: 101,
						name: "星图影像",
						icon: "img/basemaps/google_img.png",
						type: "xt",
						tooltip: "星图影像地图服务",
						layers: [
							{name: "底图", layer: "img_d"},
							{name: "注记", layer: "img_z"},
						],
						show: true,
					},
					{
						id: 102,
						name: "星图电子",
						icon: "img/basemaps/tdt_vec.png",
						tooltip: "星图电子地图服务",
						type: "xt",
						layer: "vec",
					},
					{
						id: 201,
						name: "天地图影像(EPSG:3857)",
						icon: "img/basemaps/tdt_img.png",
						tooltip: "天地图影像地图服务",
						type: "tdt",
						layers: [
							{name: "底图", layer: "img_d"},
							{name: "注记", layer: "img_z"},
						],
					},
					{
						id: 202,
						name: "天地图电子",
						icon: "img/basemaps/tdt_vec.png",
						tooltip: "天地图电子地图服务",
						type: "tdt",
						layers: [
							{name: "底图", layer: "vec_d"},
							{name: "注记", layer: "vec_z"},
						],
					},
				],
				center: {
					lat: 30.054604,
					lng: 108.885436,
					alt: 17536414,
					heading: 0,
					pitch: -90,
				},
				statusBar: {
					show: false,
				},
			};
			this.speedMap = new Speed.SpeedViewer().init(data);
			this.modelLayer = new Speed.TilesetLayer();
			this.modelLayer.loadTilesetLayer({
				url: "http://36.152.66.51:8088/3dtiles/中丹化工/tileset.json",
				maximumScreenSpaceError: 16,
			});
			this.model = this.modelLayer._tileset;
			this.model.readyPromise.then((model) => {
				this.modelLayer.updateModel(model, {
					lng: 119.933944,
					lat: 32.137604,
					alt: 0,
					scale: 1,
					rotationX: 0,
					rotationY: 0,
					rotationZ: -0.33,
					opacity: 1,
				});
				this.speedMap.addLayer(this.model);
				this.flyToModel();

				this.fetchModelComponents();

				// this.initFeatureQuery();
				this.speedMap.cesiumWidget.screenSpaceEventHandler.removeInputAction(
					Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
				_removeEntity = new RemoveEntity();

				this.initLeftClickEventListener();

				if (this.$route.path === "/speed/case/factory/zhongdan/enterprise") {
					this.drawMainProductsEntities();
				} else if (this.$route.path === "/speed/case/factory/zhongdan/factoryarea") {
					this.drawVideoEntities();
					this.drawRiskOperationWalls();
				} else if (this.$route.path === "/speed/case/factory/zhongdan/workshop") {
					this.drawEnvironmentMonitorEntities();
					this.drawPersonnelEntities();
					this.drawHazardEntities();
				} else if (this.$route.path === "/speed/case/factory/zhongdan/productionline") {
					this.drawDeviceEntities();
					this.drawAlarmEntities();
				}
			});
		},

		flyToMainProduct(index) {
			if (_mainProductsEntities.length > index) {
				this.speedMap.flyto(_mainProductsEntities[index]);
			}
		},

		toggleRiskOperations(show) {
			_riskOperationsEntities.forEach((entity) => {
				entity.show = show;
			});
		},

		flyToRiskOperation(name) {
			const find = _riskOperationsEntities.find((item) => item.id === "risk_operation_" + name);
			if (find) {
				this.speedMap.flyto(find);
			}
		},

		flyToEnvironmentMonitor(index) {
			if (_environmentMonitorEntities.length > index) {
				this.speedMap.flyto(_environmentMonitorEntities[index]);
			}
		},

		flyToPersonnel(index) {
			if (_personnelEntities.length > index) {
				this.speedMap.flyto(_personnelEntities[index]);
			}
		},

		flyToDevice(index) {
			if (_deviceEntities.length > index) {
				this.speedMap.flyto(_deviceEntities[index]);
			}
		},

		flyToAlarm(index) {
			if (_alarmEntities.length > index) {
				this.speedMap.flyto(_alarmEntities[index]);
			}
		},

		fetchModelComponents() {
			axios.get(`${modelUrl.substring(0, modelUrl.lastIndexOf("/"))}/scenetree.json`)
				.then((res) => {
					if (res.status === 200) {
						this.modelComponents = res.data.scenes[0].children;
					}
				});
		},

		highlightComponent(componentName) {
			const component = this.modelComponents.find((item) => item.name === componentName);
			if (component) {
				this.flyToComponent(componentName);
				this.model.style = new Cesium.Cesium3DTileStyle({
					color: {
						conditions: [
							["${id}==='" + component.id + "'", "rgba(222,35,62,0.5)"]
							// ["true", "rgba(255, 200, 200,0.1)"]
						]
					}
				})
			}
		},

		flyToComponent(componentName) {
			const component = this.modelComponents.find((item) => item.name === componentName);
			if (component) {
				const originTransform = this.model.orgtransform;
				let componentSphere = component.sphere;
				let center = new Cesium.Cartesian3(componentSphere[0], componentSphere[1], componentSphere[2]);
				let originMatrix = new Cesium.Matrix4.inverse(
					new Cesium.Matrix4.fromArray(originTransform),
					new Cesium.Matrix4()
				);
				if (originMatrix) {
					const matrix = new Cesium.Matrix4.multiply(
						this.model.root.transform,
						originMatrix,
						new Cesium.Matrix4()
					);
					center = new Cesium.Matrix4.multiplyByPoint(matrix, center, new Cesium.Cartesian3());
				}
				const sphere = new Cesium.BoundingSphere(center, componentSphere[3]);
				this.speedMap.camera.flyToBoundingSphere(sphere, {
					offset: new Cesium.HeadingPitchRange(this.speedMap.camera.heading, this.speedMap.camera.pitch, componentSphere[3] * 1.5),
					duration: 0.5
				});
			}
		},

		clearHighlightComponent() {
			this.model.style = undefined;
		},

		flyToModel() {
			this.speedMap.flyto(this.model);
		},

		// initFeatureQuery() {
		// 	this.featureProperty = new Speed.featureProperty({
		// 		viewer: this.speedMap._viewer,
		// 		success: (features) => {
		// 			if (this.featureQueryEnabled) {
		// 				eventBus.$emit("feature-query", features);
		// 			}
		// 		},
		// 	});
		// },

		// destroyFeatureQuery() {
		// 	if (this.featureProperty) {
		// 		this.featureProperty.destroy();
		// 	}
		// },

		// setFeatureQueryEnabled(enabled) {
		// 	this.featureQueryEnabled = enabled;
		// },

		initLeftClickEventListener() {
			_leftClickHandler = new Cesium.ScreenSpaceEventHandler(this.speedMap.canvas);
			_leftClickHandler.setInputAction((movement) => {
				const pickedObject = this.speedMap.scene.pick(movement.position);
				if (Cesium.defined(pickedObject)) {
					if (pickedObject.id === undefined) {
						this.closeMainProductPopup();
						this.closeEnvironmentMonitorPopup();
						this.closePersonnelPopup();
						this.closeHazardPopup();
						this.closeDevicePopup();
						this.closeAlarmPopup();
					} else {
						if (!(pickedObject.id instanceof Cesium.Entity)) {
							// skip
						} else {
							if (pickedObject.id.id.startsWith("environment_monitor_")) {
								// 点击环境监控entity
								this.closePersonnelPopup();
								this.closeHazardPopup();
								const clickedIndex = this.environmentMonitors.findIndex((item) => item.id === pickedObject.id.id);
								if (clickedIndex !== -1) {
									const data = this.environmentMonitors[clickedIndex];
									this.clickedEnvironmentMonitorClass = data.type;
									this.clickedEnvironmentMonitorData.name = data.name;
									this.clickedEnvironmentMonitorData.value = `${data.currentValue}${data.unit}`;
									this.clickedEnvironmentMonitorData.status = data.status;
									this.clickedEnvironmentMonitorData.target = data.target;
									this.clickedEnvironmentMonitorData.count = `${data.count}次`;
									const clicked = _environmentMonitorEntities[clickedIndex];
									const result = cartesian2LonLatAlt(clicked.position._value);
									const params = {
										longitude: result[0],
										latitude: result[1],
										altitude: result[2],
									};
									this.addEnvironmentMonitorPopup(params);
								}
							} else if (pickedObject.id.id.startsWith("personnel_")) {
								// 点击人员情况entity
								this.closeEnvironmentMonitorPopup();
								this.closeHazardPopup();
								const clickedIndex = this.personnel.findIndex((item) => item.id === pickedObject.id.id);
								if (clickedIndex !== -1) {
									this.clickedPersonnel = this.personnel[clickedIndex];
									const clicked = _personnelEntities[clickedIndex];
									const result = cartesian2LonLatAlt(clicked.position._value);
									const params = {
										longitude: result[0],
										latitude: result[1],
										altitude: result[2],
									};
									this.addPersonnelPopup(params);
								}
							} else if (pickedObject.id.id.startsWith("hazard_")) {
								// 点击隐患信息entity
								this.closeEnvironmentMonitorPopup();
								this.closePersonnelPopup();
								const clickedIndex = this.hazard.findIndex((item) => item.id === pickedObject.id.id);
								if (clickedIndex !== -1) {
									this.clickedHazard = this.hazard[clickedIndex];
									const clicked = _hazardEntities[clickedIndex];
									const result = cartesian2LonLatAlt(clicked.position._value);
									const params = {
										longitude: result[0],
										latitude: result[1],
										altitude: result[2],
									};
									this.addHazardPopup(params);
								}
							} else if (pickedObject.id.id.startsWith("device_")) {
								// 点击设备信息entity
								const clickedIndex = this.device.findIndex((item) => item.id === pickedObject.id.id);
								if (clickedIndex !== -1) {
									this.clickedDevice = this.device[clickedIndex];
									const clicked = _deviceEntities[clickedIndex];
									const result = cartesian2LonLatAlt(clicked.position._value);
									const params = {
										longitude: result[0],
										latitude: result[1],
										altitude: result[2],
									};
									this.addDevicePopup(params);
								}
							} else if (pickedObject.id.id.startsWith("alarm_")) {
								// 点击告警信息entity
								const clickedIndex = this.alarm.findIndex((item) => item.id === pickedObject.id.id);
								if (clickedIndex !== -1) {
									this.clickedAlarm = this.alarm[clickedIndex];
									const clicked = _alarmEntities[clickedIndex];
									const result = cartesian2LonLatAlt(clicked.position._value);
									const params = {
										longitude: result[0],
										latitude: result[1],
										altitude: result[2],
									};
									this.addAlarmPopup(params);
								}
							} else {
								// 点击主要产品entity
								const clickedIndex = _mainProductsEntities.findIndex((item) => item.id === pickedObject.id.id);
								if (clickedIndex !== -1) {
									this.mainProductName = this.mainProducts[clickedIndex].name;
									this.mainProductDescription = this.mainProducts[clickedIndex].description;
									const clicked = _mainProductsEntities[clickedIndex];
									const result = cartesian2LonLatAlt(clicked.position._value);
									const params = {
										longitude: result[0],
										latitude: result[1],
										altitude: result[2],
									};
									this.addMainProductPopup(params);
								}
							}
						}
					}
				} else {
					this.closeMainProductPopup();
					this.closeEnvironmentMonitorPopup();
					this.closePersonnelPopup();
					this.closeHazardPopup();
					this.closeDevicePopup();
					this.closeAlarmPopup();
				}
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		},

		removeLeftClickEventListener() {
			if (_leftClickHandler) {
				_leftClickHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
			}
		},

		/**
		 * 根据cartesian坐标获取屏幕坐标
		 */
		getWindowPositionByCartesian(position) {
			const cartesian3 = Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, position.altitude);
			return cartesianToWindowPosition(cartesian3, this.speedMap.scene);
		},

		popupRenderEvent() {
			if (_clickedCartesian && _popupHtml) {
				const canvasPosition = this.getWindowPositionByCartesian(_clickedCartesian);
				if (Cesium.defined(canvasPosition)) {
					_popupHtml.style.position = "fixed"
					_popupHtml.style.top = canvasPosition.y - _popupHtml.offsetHeight - 30 + "px";
					_popupHtml.style.left = canvasPosition.x - _popupHtml.offsetWidth / 2 + "px";
				}
			}
		},

		showPopupDelegate(popupHtml, params) {
			_clickedCartesian = params;
			_popupHtml = popupHtml;
			popupHtml.style.display = "flex";
			this.speedMap.scene.preRender.addEventListener(this.popupRenderEvent);
		},

		addMainProductPopup(params) {
			const popupHtml = document.getElementById("main-product-popup");
			if (popupHtml) {
				this.showPopupDelegate(popupHtml, params);
			}
		},

		closeMainProductPopup() {
			this.speedMap.scene.preRender.removeEventListener(this.popupRenderEvent);
			const popupHtml = document.getElementById("main-product-popup");
			if (popupHtml) {
				popupHtml.style.display = 'none';
			}
			this.mainProductName = "";
			this.mainProductDescription = "";
		},

		// 绘制主要产品entity
		drawMainProductsEntities() {
			this.mainProducts.forEach((item) => {
				_mainProductsEntities.push(drawBillboard({
					longitude: item.longitude,
					latitude: item.latitude,
					height: item.height,
					billboardWidth: item.size,
					billboardHeight: item.size,
					image: item.image,
				}, this.speedMap.viewer));
			});
		},

		// 移除主要产品entity
		removeMainProductsEntities() {
			if (this.speedMap && _removeEntity) {
				_mainProductsEntities.forEach((item) => {
					_removeEntity.removeByObj(this.speedMap.viewer, item);
				});
				_mainProductsEntities = [];
			}
		},

		// 绘制摄像头entity
		drawVideoEntities() {
			const video1Element = document.getElementById("video-1");
			const video2Element = document.getElementById("video-2");
			new Cesium.VideoSynchronizer({
				clock: this.speedMap.clock,
				element: video1Element,
			});
			new Cesium.VideoSynchronizer({
				clock: this.speedMap.clock,
				element: video2Element,
			});
			_videoEntities.push(this.speedMap.entities.add({
				id: this.videos[0].id,
				rectangle: {
					coordinates: Cesium.Rectangle.fromDegrees(...this.videos[0].rectangle),
					material: video1Element,
					height: 1,
					rotation: Cesium.Math.toRadians(18),
				},
			}));
			_videoEntities.push(this.speedMap.entities.add({
				id: this.videos[1].id,
				rectangle: {
					coordinates: Cesium.Rectangle.fromDegrees(...this.videos[1].rectangle),
					material: video2Element,
					height: 1,
					rotation: Cesium.Math.toRadians(18),
				},
			}));
			this.speedMap.clock.shouldAnimate = true;
		},

		// 移除摄像头entity
		removeVideoEntities() {
			if (this.speedMap && _removeEntity) {
				_videoEntities.forEach((item) => {
					_removeEntity.removeByObj(this.speedMap.viewer, item);
				})
				_videoEntities = [];
			}
		},

		// 绘制风险作业区域墙
		drawRiskOperationWalls() {
			this.riskOperations.forEach((item) => {
				_riskOperationsEntities.push(drawGradientWall({
					id: "risk_operation_" + item.id,
					color: Cesium.Color.fromCssColorString(item.color),
					positions: Cesium.Cartesian3.fromDegreesArrayHeights(item.positions),
					maximumHeights: item.maximumHeights,
					minimumHeights: item.minimumHeights,
				}, this.speedMap.viewer));
			});
		},

		// 移除风险作业区域墙
		removeRiskOperationWalls() {
			if (this.speedMap && _removeEntity) {
				_riskOperationsEntities.forEach((item) => {
					_removeEntity.removeByObj(this.speedMap.viewer, item);
				});
				_riskOperationsEntities = [];
			}
		},

		addEnvironmentMonitorPopup(params) {
			const popupHtml = document.getElementById("environment-monitor-popup");
			if (popupHtml) {
				this.showPopupDelegate(popupHtml, params);
			}
		},

		closeEnvironmentMonitorPopup() {
			this.speedMap.scene.preRender.removeEventListener(this.popupRenderEvent);
			const popupHtml = document.getElementById("environment-monitor-popup");
			if (popupHtml) {
				popupHtml.style.display = 'none';
			}
			this.clickedEnvironmentMonitorData = {};
		},

		drawEnvironmentMonitorEntities() {
			this.environmentMonitors.forEach((item) => {
				_environmentMonitorEntities.push(drawBillboard({
					id: item.id,
					longitude: item.longitude,
					latitude: item.latitude,
					height: item.altitude,
					image: item.image,
					billboardWidth: 40,
					billboardHeight: 62,
					scaleByDistance: new Cesium.NearFarScalar(5000, 1, 20000, 0.5),
				}, this.speedMap.viewer));
			});
		},

		removeEnvironmentMonitorEntities() {
			if (this.speedMap && _removeEntity) {
				_environmentMonitorEntities.forEach((item) => {
					_removeEntity.removeByObj(this.speedMap.viewer, item);
				});
				_environmentMonitorEntities = [];
			}
		},

		addPersonnelPopup(params) {
			const popupHtml = document.getElementById("personnel-popup");
			if (popupHtml) {
				this.showPopupDelegate(popupHtml, params);
			}
		},

		closePersonnelPopup() {
			this.speedMap.scene.preRender.removeEventListener(this.popupRenderEvent);
			const popupHtml = document.getElementById("personnel-popup");
			if (popupHtml) {
				popupHtml.style.display = 'none';
			}
			this.clickedPersonnel = "";
		},

		drawPersonnelEntities() {
			this.personnel.forEach((item) => {
				_personnelEntities.push(drawBillboard({
					id: item.id,
					longitude: item.longitude,
					latitude: item.latitude,
					image: item.image,
					billboardWidth: 62,
					billboardHeight: 62,
					scaleByDistance: new Cesium.NearFarScalar(5000, 1, 20000, 0.5),
				}, this.speedMap.viewer));
			});
			this.speedMap.clock.shouldAnimate = true;
			this.speedMap.clock.onTick.addEventListener(this.clockOnTickEventHandler);
		},

		removePersonnelEntities() {
			if (this.speedMap && _removeEntity) {
				_personnelEntities.forEach((item) => {
					_removeEntity.removeByObj(this.speedMap.viewer, item);
				});
				_personnelEntities = [];
			}
			this.speedMap.clock.onTick.removeEventListener(this.clockOnTickEventHandler);
		},

		clockOnTickEventHandler(clock) {
			const seconds = clock.currentTime.secondsOfDay;
			if (_personnelEntities.length) {
				for (let i = 0; i < _personnelEntities.length; i++) {
					const position = Cesium.Cartesian3.fromDegrees(
						this.personnel[i].longitude + 0.00005 * Math.sin((seconds % 10)),
						this.personnel[i].latitude + 0.00005 * Math.cos((seconds % 10)),
						this.personnel[i].altitude,
					);
					_personnelEntities[i].position = position;
				}
			}
		},

		addHazardPopup(params) {
			const popupHtml = document.getElementById("hazard-popup");
			if (popupHtml) {
				this.showPopupDelegate(popupHtml, params);
			}
		},

		closeHazardPopup() {
			this.speedMap.scene.preRender.removeEventListener(this.popupRenderEvent);
			const popupHtml = document.getElementById("hazard-popup");
			if (popupHtml) {
				popupHtml.style.display = 'none';
			}
			this.clickedHazard = "";
		},

		drawHazardEntities() {
			this.hazard.forEach((item) => {
				_hazardEntities.push(drawBillboard({
					id: item.id,
					longitude: item.longitude,
					latitude: item.latitude,
					height: item.altitude,
					image: item.image,
					billboardWidth: 54,
					billboardHeight: 54,
					scaleByDistance: new Cesium.NearFarScalar(5000, 1, 20000, 0.5),
				}, this.speedMap.viewer));
			});
		},

		removeHazardEntities() {
			if (this.speedMap && _removeEntity) {
				_hazardEntities.forEach((item) => {
					_removeEntity.removeByObj(this.speedMap.viewer, item);
				});
				_hazardEntities = [];
			}
		},

		startRoam() {
			this.modelPath = new modelRoam(this.speedMap.viewer);
			const modelRoamParam = {
				modelPath: "models/GroundVehicle/GroundVehicle.glb",
				modelPoints: [
					[119.93463354567642, 32.137370532475806, 5.580405983240496],
					[119.9340040221121, 32.137192496422216, 5.592276390848046],
					[119.93388607504197, 32.13750728858288, 5.66335659141439],
					[119.93447961608379, 32.13769306174605, 5.63527019436789],
					[119.93463354567642, 32.137370532475806, 5.580405983240496]
				],
				speed: 0.15,
				showTrack: false,
				showModel: false,
			};
			this.modelPath.changeView("first");
			this.modelPath.start(modelRoamParam);
		},

		resumeRoam() {
			if (this.modelPath) {
				this.speedMap.clock.shouldAnimate = true;
				this.modelPath.changeView("first");
			}
		},

		pauseRoam() {
			if (this.modelPath) {
				this.modelPath.stop();
			}
			this.speedMap.clock.shouldAnimate = true;
		},

		stopRoam() {
			if (this.modelPath) {
				this.modelPath.quit();
				this.modelPath = null;
			}
			this.speedMap.clock.shouldAnimate = true;
		},

		addDevicePopup(params) {
			const popupHtml = document.getElementById("device-popup");
			if (popupHtml) {
				this.showPopupDelegate(popupHtml, params);
			}
		},

		closeDevicePopup() {
			this.speedMap.scene.preRender.removeEventListener(this.popupRenderEvent);
			const popupHtml = document.getElementById("device-popup");
			if (popupHtml) {
				popupHtml.style.display = 'none';
			}
			this.clickedDevice = "";
		},

		drawDeviceEntities() {
			this.device.forEach((item) => {
				_deviceEntities.push(drawBillboard({
					id: item.id,
					longitude: item.longitude,
					latitude: item.latitude,
					height: item.altitude,
					image: item.image,
					billboardWidth: 54,
					billboardHeight: 54,
					scaleByDistance: new Cesium.NearFarScalar(5000, 1, 20000, 0.5),
				}, this.speedMap.viewer));
			});
		},

		removeDeviceEntities() {
			if (this.speedMap && _removeEntity) {
				_deviceEntities.forEach((item) => {
					_removeEntity.removeByObj(this.speedMap.viewer, item);
				});
				_deviceEntities = [];
			}
		},

		addAlarmPopup(params) {
			const popupHtml = document.getElementById("alarm-popup");
			if (popupHtml) {
				this.showPopupDelegate(popupHtml, params);
			}
		},

		closeAlarmPopup() {
			this.speedMap.scene.preRender.removeEventListener(this.popupRenderEvent);
			const popupHtml = document.getElementById("alarm-popup");
			if (popupHtml) {
				popupHtml.style.display = 'none';
			}
			this.clickedAlarm = "";
		},

		drawAlarmEntities() {
			this.alarm.forEach((item) => {
				_alarmEntities.push(drawBillboard({
					id: item.id,
					longitude: item.longitude,
					latitude: item.latitude,
					height: item.altitude,
					image: item.image,
					billboardWidth: 54,
					billboardHeight: 54,
					scaleByDistance: new Cesium.NearFarScalar(5000, 1, 20000, 0.5),
				}, this.speedMap.viewer));
			});
		},

		removeAlarmEntities() {
			if (this.speedMap && _removeEntity) {
				_alarmEntities.forEach((item) => {
					_removeEntity.removeByObj(this.speedMap.viewer, item);
				});
				_alarmEntities = [];
			}
		},
	}
};
</script>

<style lang="scss" scoped>
.factory-map {
	width: 100%;
	height: 100%;
	z-index: 1;

	#main-product-popup {
		display: none;
		flex-direction: column;
		position: absolute;
		z-index: 150;
		width: 200px;
		height: 250px;
		background-color: #00000099;
		border-radius: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

		.main-product-header {
			width: 100%;
			height: 36px;
			padding: 0 20px;
			display: flex;
			align-items: center;
			background-color: #2c6d9166;

			.main-product-title {
				color: white;
				font-size: 14px;
			}
		}

		.content {
			flex: 1;
			padding: 10px 0 10px 20px;
			overflow: hidden;

			:deep(.el-scrollbar) {
				.el-scrollbar__view {
					padding-right: 20px;
				}
			}

			.name {
				display: inline;
				color: #b4e2f7;
				font-size: 14px;
			}

			.value {
				color: white;
				font-size: 14px;
			}
		}
	}

	#environment-monitor-popup {
		display: none;
		flex-direction: column;
		position: absolute;
		z-index: 150;
		width: 295px;
		height: 253px;
		padding: 0 28px;
		background-size: 100% 100%;
		background-repeat: no-repeat;

		&.temperature {
			background-image: url("~@/assets/speed/case/factory/workshop/monitor/temperature-dialog-background.png");
		}

		&.humidity {
			background-image: url("~@/assets/speed/case/factory/workshop/monitor/humidity-dialog-background.png");
		}

		&.odor {
			background-image: url("~@/assets/speed/case/factory/workshop/monitor/odor-dialog-background.png");
		}

		&.noise {
			background-image: url("~@/assets/speed/case/factory/workshop/monitor/noise-dialog-background.png");
		}

		&.radiation {
			background-image: url("~@/assets/speed/case/factory/workshop/monitor/radiation-dialog-background.png");
		}

		.device-name {
			margin-top: 38px;
			margin-left: 33px;
			font-size: 18px;
			font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
			font-weight: 700;
			font-style: italic;
			line-height: 18px;
			text-align: left;
			color: #c4f0ee;
			text-shadow: 0 3px rgba(1, 25, 29, 0.30);
		}

		.info {
			height: 28px;
			padding: 0 14px;
			display: flex;
			align-items: center;
			box-shadow: 0 0 10px 0 #13bbd9 inset;

			&:first-of-type {
				margin-top: 23px;
			}

			&:not(:first-of-type) {
				margin-top: 9px;
			}

			.label {
				width: 61px;
				font-size: 14px;
				font-family: Source Han Sans CN, Source Han Sans CN-Regular;
				line-height: 14px;
				color: #f0f0f0;
			}

			.value {
				margin-left: 9px;
				font-size: 14px;
				font-family: Source Han Sans CN, Source Han Sans CN-Regular;
				font-weight: 700;
				line-height: 14px;
				color: #f0f0f0;
			}

			&:nth-of-type(1) {
				.value {
					color: #13ecff;
				}
			}

			&:nth-of-type(4) {
				.value {
					color: #d4ae2d;;
				}
			}
		}
	}

	#personnel-popup {
		display: none;
		flex-direction: column;
		position: absolute;
		z-index: 150;
		width: 200px;
		height: 270px;
		background-color: #00000099;
		border-radius: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

		.personnel-header {
			width: 100%;
			height: 36px;
			padding: 0 20px;
			display: flex;
			align-items: center;
			background-color: #2c6d9166;

			.personnel-title {
				color: white;
				font-size: 14px;
			}
		}

		.content {
			flex: 1;
			padding: 10px 0 10px 20px;
			overflow: hidden;

			:deep(.el-scrollbar) {
				.el-scrollbar__view {
					padding-right: 20px;
				}
			}

			.name-value {
				display: flex;
				align-items: flex-start;

				&:not(:first-of-type) {
					margin-top: 15px;
				}

				.name {
					width: 75px;
					display: inline;
					color: #b4e2f7;
					font-size: 14px;
				}

				.value {
					flex: 1;
					color: white;
					font-size: 14px;
				}

				.el-image {
					flex: 1;
					height: auto;
				}
			}
		}
	}

	#hazard-popup {
		display: none;
		flex-direction: column;
		position: absolute;
		z-index: 150;
		width: 250px;
		height: 350px;
		background-color: #00000099;
		border-radius: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

		.hazard-header {
			width: 100%;
			height: 36px;
			padding: 0 20px;
			display: flex;
			align-items: center;
			background-color: #2c6d9166;

			.hazard-title {
				color: white;
				font-size: 14px;
			}
		}

		.content {
			flex: 1;
			padding: 10px 0 10px 20px;
			overflow: hidden;

			:deep(.el-scrollbar) {
				.el-scrollbar__view {
					padding-right: 20px;
				}
			}

			.name-value {
				display: flex;
				align-items: flex-start;

				&:not(:first-of-type) {
					margin-top: 15px;
				}

				.name {
					width: 75px;
					display: inline;
					color: #b4e2f7;
					font-size: 14px;
				}

				.value {
					flex: 1;
					color: white;
					font-size: 14px;
				}

				.el-image {
					flex: 1;
					height: auto;
				}
			}
		}
	}

	#device-popup {
		display: none;
		flex-direction: column;
		position: absolute;
		z-index: 150;
		width: 250px;
		height: 350px;
		background-color: #00000099;
		border-radius: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

		.device-header {
			width: 100%;
			height: 36px;
			padding: 0 20px;
			display: flex;
			align-items: center;
			background-color: #2c6d9166;

			.device-title {
				color: white;
				font-size: 14px;
			}
		}

		.content {
			flex: 1;
			padding: 10px 0 10px 20px;
			overflow: hidden;

			:deep(.el-scrollbar) {
				.el-scrollbar__view {
					padding-right: 20px;
				}
			}

			.name-value {
				display: flex;
				align-items: flex-start;

				&:not(:first-of-type) {
					margin-top: 15px;
				}

				.name {
					width: 75px;
					display: inline;
					color: #b4e2f7;
					font-size: 14px;
				}

				.value {
					flex: 1;
					color: white;
					font-size: 14px;
				}

				.el-image {
					flex: 1;
					height: auto;
				}
			}
		}
	}

	#alarm-popup {
		display: none;
		flex-direction: column;
		position: absolute;
		z-index: 150;
		width: 250px;
		height: 120px;
		background-color: #00000099;
		border-radius: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

		.alarm-header {
			width: 100%;
			height: 36px;
			padding: 0 20px;
			display: flex;
			align-items: center;
			background-color: #2c6d9166;

			.alarm-title {
				color: white;
				font-size: 14px;
			}
		}

		.content {
			flex: 1;
			padding: 10px 0 10px 20px;
			overflow: hidden;

			:deep(.el-scrollbar) {
				.el-scrollbar__view {
					padding-right: 20px;
				}
			}

			.name-value {
				display: flex;
				align-items: flex-start;

				&:not(:first-of-type) {
					margin-top: 15px;
				}

				.name {
					width: 75px;
					display: inline;
					color: #b4e2f7;
					font-size: 14px;
				}

				.value {
					flex: 1;
					color: white;
					font-size: 14px;
				}

				.el-image {
					flex: 1;
					height: auto;
				}
			}
		}
	}

	#video-1, #video-2 {
		display: none;
	}
}
</style>
