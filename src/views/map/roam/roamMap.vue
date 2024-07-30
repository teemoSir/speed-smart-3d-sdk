<template>
	<mapBox :css-code="cssCode" :html-code="htmlCode" :javascript-code="javascriptCode"></mapBox>
</template>
<script>
import mapBox from '@/components/mapBox'
export default {
	name: "roam",
	components: {
		mapBox
	},
	data() {
		return {
			cssCode: `* {
	padding: 0;
	margin: 0;
}

.ktmap {
	width: 100%;
	height: 100%;
	background-color: #000;
	position: relative;
}

#function {
	height: 96%;
	width: 20%;
	position: absolute;
	z-index: 200;
	top: 2%;
	left: 3%;
	background-image: url('/roam/漫游背景图.png');
	background-size: 100% 100%;
}

.chance {
	display: flex;
	width: 90%;
	height: 30px;
	margin-top: 12%;
	margin-left: 5%;
}

.default {
	flex: 1;
	font-size: medium;
	color: rgb(253, 253, 253);
	border: none;
	background: none;
}


.onChance {
	background-image: url('/roam/按钮.png');
	background-size: 100% 100%;
}

.roamDiv {
	width: 100%;
	height: 90%;
	margin-top: 7%;
	position: absolute;
	text-align:left;
}

/* 键盘漫游 */
.myslider {
	width: 200px;
	margin-top: 5%;
	margin-left: 5%;
	position: absolute;
	display: inline-block;
	z-index: 200;
}

p {
	color: aliceblue;
	font-size: 15px;
	margin-left: 30px;
	line-height: 45px;
	display: inline;
}

.keyBorard {
	width: 90%;
	margin-left: 5%;
	height: 80%;
	background-image: url('/roam/键盘漫游.png');
	background-size: 100% 100%;
}

/* 贴地漫游 */
.catButton,
.catButton1,
.manButton,
.manButton1,
.aircraftButton,
.aircraftButton1,
.modelInsidetButton,
.modelInsidetButton1,
.catModeltButton,
.catModeltButton1 {
	width: 38%;
	margin-left: 8%;
	height: 7%;
	border: none;
	background-color: transparent;
	background-image: url('/roam/小车贴地形漫游.png');
	background-size: 100% 100%;
}

.aa,
.catButton1:hover,
.catButton {
	background-image: url('/roam/小车贴地形漫游1.png');
	background-size: 100% 100%;
}

.bb,
.aircraftButton1:hover,

.aircraftButton {
	background-image: url('/roam/飞机空中漫游1.png');
	background-size: 100% 100%;
}

.aircraftButton1 {
	background-image: url('/roam/飞机空中漫游.png');
	background-size: 100% 100%;
}

.cc,
.manButton1:hover,
.manButton {
	margin-top: 5%;
	background-image: url('/roam/人物贴地表漫游1.png');
	background-size: 100% 100%;
}

.manButton1 {
	margin-top: 5%;
	background-image: url('/roam/人物贴地表漫游.png');
	background-size: 100% 100%;
}

.dd,
.modelInsidetButton1:hover,
.modelInsidetButton {
	background-image: url('/roam/模型内部漫游1.png');
	background-size: 100% 100%;
}

.modelInsidetButton1 {
	background-image: url('/roam/模型内部漫游.png');
	background-size: 100% 100%;
}

.ff,
.catModeltButton1:hover,
.catModeltButton {
	background-image: url('/roam/小车贴模型漫游1.png');
	background-size: 100% 100%;
}

.catModeltButton1 {
	background-image: url('/roam/小车贴模型漫游.png');
	background-size: 100% 100%;
}

/* 控制漫游开关 */
.roamSwitch {
	position: absolute;
	width: 100%;
	height: 40px;
	bottom: 10%;
	text-align:left;
}

.roamSwitch button{
	width: 38%;
	margin-left: 8%;
	height: 100%;
	border: none;
	background-color: transparent;
	background-image: url('/roam/开启漫游.png');
	background-size: 100% 100%;
}

.roamSwitch .stop {
	background-image: url('/roam/暂停漫游.png');
	background-size: 100% 100%;
}`,
			htmlCode: `
	<div :id="mapid" class="ktmap">
		<div id="function">
			<div class="chance">
				<button class="default" @click="roamKind = index" v-for="(val, index) in myButton"
					:class="roamKind == index ? 'onChance' : ''">{{ val.p }}</button>
			</div>
			<div class="roamDiv" v-show="roamKind == 0">
				<div>
					<p>平均步长:</p>
					<el-slider v-model="setSelectDate" class="myslider" :step="0.01" show-stops>
					</el-slider>
				</div>
				<div class="keyBorard"></div>
			</div>
			<div class="roamDiv" v-show="roamKind == 1">
				<p style="margin-left: 10%;">开启第一视角</p>
				<el-switch v-model="firstView" style="margin-top: -2%;" :disabled=viewOpen1 size="small" />
				<p style="margin-left: 15%;">开启上帝视角</p>
				<el-switch v-model="godView" style="margin-top: -2%;" :disabled=viewOpen2 size="small" />
				<br>
				<button @click="roamValue = 1" :class="{ catButton: roamValue == 1, catButton1: roamValue != 1 }"></button>
				<button @click="roamValue = 2"
					:class="{ aircraftButton: roamValue == 2, aircraftButton1: roamValue != 2 }"></button>
				<button @click="roamValue = 3" :class="{ manButton: roamValue == 3, manButton1: roamValue != 3, }"></button>
			</div>
			<div class="roamDiv" v-show="roamKind == 2">
				<button @click="roamValue = 4"
					:class="{ catModeltButton: roamValue == 4, catModeltButton1: roamValue != 4 }"></button>
				<button @click="roamValue = 5"
					:class="{ modelInsidetButton: roamValue == 5, modelInsidetButton1: roamValue != 5, }"></button>
			</div>
			<div class="roamSwitch" v-show="roamKind != 0">
				<button @click="startRoam" class="start"></button>
				<button @click="stopRoam" class="stop"></button>
			</div>
			<div class="aa"></div>
			<div class="bb"></div>
			<div class="cc"></div>
			<div class="dd"></div>
			<div class="ee"></div>
		</div>
	</div>`,
			javascriptCode: `import * as uuid from "uuid"
import * as Speed from '@/cesiumSDK/index'
import keyboardRoam from "@/cesiumSDK/core/roam/keyboardRoam";
import firstRoam from "@/cesiumSDK/core/roam/firstRoam";
import * as Cesium from 'cesium';
import ModelInfo from '@/utils/modelInfo';
import pathRoam from "@/cesiumSDK/core/roam/pathRoam";
import modelRoam from "@/cesiumSDK/core/roam/modelRoam";
// 飞机模型对象
let aircraf;
// 汽车模型对象
let cat;
// 人物模型对象
let man;
let catM;
let keyBoard;
// 是否显示模型
let modelShow;
// 是否显示模型运动轨迹
let trackShow;
// 模型运动路径平滑程度
let smooth = 10;
// 模型运动速度
let modelSpeed = 0.1;
// 第一视角漫游模型初始位置坐标
let startPosition = [118.7759, 32.1975, 100];
// 修改飞机第一视角漫游默认模型路径
let airModelPath = 'models/CesiumAir/Cesium_Air.glb';
// 修改小车贴地形漫游默认模型路径
let catModelPath = 'models/GroundVehicle/GroundVehicle.glb';
let promise;
// 小车贴地漫游模型中途点时间
let catGoTime = [
	"2023-04-01T15:18:00Z",
	"2023-04-01T15:24:00Z",
	"2023-04-01T15:30:00Z"
];
// 小车贴地漫游模型中途点位置
let catGoPoints = [
	[118.82128299962932, 32.06099728083867, 72.3969739980981],
	[118.83419428354406, 32.0806382465655, 86.27980635506334],
	[118.87238237825298, 32.07828798524092, 44.44684876531861]
];
// 小车漫游模型中途点位置
let catModelGoPoints = [
	[119.93528452112702, 32.13650830909409, 7.884052604449669],
	[119.93461603025949, 32.136308391251056, 7.885174732218523],
	[119.93445749810917, 32.1366551044606, 7.881831876992177],
	[119.93407360032295, 32.13657990557018, 7.881890567161905],
	[119.93347962663913, 32.13809080496706, 7.887796955311538],
	[119.93432417712874, 32.138330885807015, 7.917001846134436]
];
// 漫游内部模型中途点位置
let modelInnerGoPoints = [
	[119.93463354567642, 32.137370532475806, 10.580405983240496],
	[119.9340040221121, 32.137192496422216, 10.592276390848046],
	[119.93388607504197, 32.13750728858288, 10.66335659141439],
	[119.93447961608379, 32.13769306174605, 10.63527019436789],
	[119.93463354567642, 32.137370532475806, 10.580405983240496]
];
// 修改人物贴地表漫游默认模型路径
let manModelPath = 'models/CesiumMan/Cesium_Man.glb';
// 人物漫游模型中途点时间
let manGoTime = [
	"2023-04-01T14:00:00Z",
	"2023-04-01T15:00:00Z",
	"2023-04-01T16:00:00Z"
];
// 人物漫游模型中途点位置
let manGoPoints = [
	[118.8157709456067, 32.07830329173627, 26.181142787526746],
	[118.8418283326283, 32.062612248036324, 106.81188003609822],
	[118.87625120502646, 32.074383852346614, 37.63550968793676]
];
// 飞机漫游参数对象
let aircrafRoamParam = {
	modelPath: airModelPath,
	startPosition,
	// 模型显示的最大像素值
	maxSize: 130,
	// 模型显示的最小像素值
	minSize: 50,
	// 漫游速度
	speed: 10
}
// 人物贴地漫游参数对象
let manRoamParam = {
	modelPath: manModelPath,
	modelGoTime: manGoTime,
	modelGoPoints: manGoPoints,
	// 模型显示的最大像素值
	maxSize: 80,
	// 模型显示的最小像素值
	minSize: 40,
}
// 小车贴地漫游参数对象
let catRoamParam = {
	modelPath: catModelPath,
	modelGoTime: catGoTime,
	modelGoPoints: catGoPoints,
	// 模型显示的最大像素值
	maxSize: 80,
	// 模型显示的最小像素值
	minSize: 20,
}
// 小车模型上漫游参数对象
let catModelRoamParam = {
	modelPath: catModelPath,
	modelPoints: catModelGoPoints,
	speed: 0.2,
	showTrack: false,
}
// 模型内部漫游参数对象
let modelRoamParam = {
	modelPath: catModelPath,
	modelPoints: modelInnerGoPoints,
	showTrack: false,
	showModel: false,
}
export default {
	data() {
		return {
			viewOpen1: false,
			viewOpen2: false,
			firstView: false,
			godView: false,
			roamValue: 0,
			roamKind: 0,
			myButton: [{ p: '键盘漫游' }, { p: '贴地漫游' }, { p: '模型漫游' }],
			setSelectDate: 50,
		}
	},
	created() {
		this.mapid = uuid.v4();
	},
	mounted() {
		this.initMap();
		this.keyboard = new keyboardRoam();
		this.first = new firstRoam(this.map);
		this.path = new pathRoam(this.map);
		this.path1 = new modelRoam(this.map);
		// 默认开启键盘漫游事件
		keyBoard = this.keyboard.start(this.map, 1);
	},
	methods: {
		initMap() {
			let data = {
				containID: this.mapid,
				center: { lat: 32.1975, lng: 118.7759, alt: 130, pitch: -45, },
				baseLayerPicker: true,
				timeline: false,
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
			this.speedMap = new Speed.SpeedViewer();
			this.map = this.speedMap.init(data)._viewer;
			this.map.scene.globe.depthTestAgainstTerrain = true; // 启用深度测试，让地形后面的东西消失。
			this.zdhgTileset = new Speed.TilesetLayer().loadBIMTilesetLayer({
				url: ModelInfo.ZHONGDANHUAGONG,
				lng: 119.933944,//经度
				lat: 32.137604,//纬度
				alt: 7,//高度
				rotationZ: -0.33,
				rotationX: 0.0,
				rotationY: 0.0,
			})._tileset;
			this.speedMap.addLayer(this.zdhgTileset);
		},
		startRoam() {
			if (this.roamValue == 2) {
				aircraf = this.first.start(aircrafRoamParam);
			}
			else {
				this.map.clock.shouldAnimate = true;
				if (this.roamValue == 5) {
					this.path1.changeView('first');
				}
			}
		},
		stopRoam() {
			if (this.roamValue == 1 || this.roamValue == 3) {
				this.path.stop();
			} else if (this.roamValue == 2) {
				this.first.stop();
			} else if (this.roamValue == 4 || this.roamValue == 5) {
				this.path1.stop();
			}
		},
		// 关闭第一视角和上帝视角
		offView() {
			this.map.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
			if (this.roamValue == 2) {
				this.first.changeView('none');
			}
			if (this.roamValue == 1 || this.roamValue == 3) {
				this.path.changeView('none');
			}
		},
		// 销毁贴地表路径漫游事件
		quitPathRoam() {
			if (cat|| man) {
				this.firstView = false;
				this.godView = false;
				this.viewOpen1 = false;
				this.viewOpen2 = false;
				this.path.quit();
				cat = '';
				man = '';
			};
		},
		// 销毁第一视角漫游事件或者贴路径漫游事件
		quitFirstRoam() {
			if (aircraf) {
				this.firstView = false;
				this.godView = false;
				this.viewOpen1 = false;
				this.viewOpen2 = false;
				this.first.quit();
				aircraf = '';
			} else {
				this.quitPathRoam();
			}
		},
		// 相机视角切换方法
		setCamera(x, y, z) {
			this.map.camera.flyTo({
				// fromDegrees()方法，将经纬度和高程转换为世界坐标
				destination: Cesium.Cartesian3.fromDegrees(x, y, z), //设置位置
				orientation: {
					// 方向
					heading: Cesium.Math.toRadians(40),
					// 视角、倾斜角度
					pitch: Cesium.Math.toRadians(-90),
					roll: 0.0
				}
			})
		}
	},
	watch: {
		roamKind: function (newValue) {
			if(this.roamValue!=0){
				// 按钮取消选中状态
				this.roamValue=0;
			}
			if(cat || man){
				this.quitPathRoam();
			}else if(aircraf){
				this.quitFirstRoam();
			}else if(keyBoard){
				this.keyboard.quit();
				keyBoard = ''
			}else if (catM) {
				this.path1.quit();
				catM = ''
			}
			if (newValue == 0) {
				// 开启键盘漫游事件
				keyBoard = this.keyboard.start(this.map, this.setSelectDate / 10);
			} else if (newValue == 2) {
				// 缩放至CIM模型
				this.speedMap.flyto(this.zdhgTileset);
			} 
		},
		roamValue: function (newValue) {
			if (newValue == 1) {
				this.quitFirstRoam();
				// 小车贴地形漫游
				promise = this.path.start(catRoamParam);
				this.setCamera(118.83419428354406, 32.0806382465655, 8000);
				console.log(promise,'小车模型')
				promise.then((value) => { cat = value });
			} else if (newValue == 2) {
				this.quitPathRoam();
				alert("方向键控制飞行姿态")
				// 飞机漫游
				aircraf = this.first.start(aircrafRoamParam);
			} else if (newValue == 3) {
				this.quitFirstRoam();
				// 人物贴地表漫游
				promise = this.path.start(manRoamParam);
				this.setCamera(118.83419428354406, 32.0806382465655, 8000);
				console.log(promise,'人物模型')
				promise.then((value) => { man = value });
			} else if (newValue == 4) {
				if (catM) {
					this.path1.quit();
					catM = '';
				}
				this.setCamera(119.93461603025949, 32.136308391251056, 200);
				// 小车模型上漫游
				catM = this.path1.start(catModelRoamParam);
			} else if (newValue == 5) {
				if (catM) {
					this.path1.quit();
					catM = '';
				}
				this.path1.changeView('first');
				// 模型内部漫游
				catM = this.path1.start(modelRoamParam);
			}
		},
		firstView: function (newValue) {
			if (newValue) {
				this.viewOpen2 = true;
				if (this.roamValue == 2) {
					this.first.changeView('first');
				} else if (this.roamValue == 1 || this.roamValue == 3) {
					this.path.changeView('first');
				}
			} else {
				this.viewOpen2 = false;
				this.offView();
			}
		},
		godView: function (newValue) {
			if (newValue) {
				this.viewOpen1 = true;
				if (this.roamValue == 2) {
					this.first.changeView('god');
				} else if (this.roamValue == 1 || 3) {
					this.path.changeView('god');
				}
			} else {
				this.viewOpen1 = false;
				this.offView();

			}
		},
		setSelectDate: function (newValue) {
			this.keyboard.quit();
			keyBoard = this.keyboard.start(this.map, this.setSelectDate / 10);
		},
	}
}`,
		}
	}

}
</script>

<style scoped>

</style>
