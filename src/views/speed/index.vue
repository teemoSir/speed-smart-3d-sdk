<template>
	<div class="common-layout">
		<el-container>
			<el-header v-show="this.$route.meta.show"
				:style="style">
				<div class="logo" v-show="speed.show"></div>
				<div class="homeName">{{speed.title}}</div>
				<div class="Nav">
					<button @click="myRouter1 = 1"
						:class="{ firetPage1: myRouter1 != 1, firetPage2: myRouter1 == 1 }">首页</button>
					<button @click="myRouter1 = 2" :class="{ GNYL1: myRouter1 != 2, GNYL2: myRouter1 == 2 }">功能样例</button>
					<button @click="YYAL" :class="{ YYAL1: myRouter1 != 3, YYAL2: myRouter1 == 3 }">应用案例</button>
					<button @click="handleSolutionClick"
						:class="{ solution1: myRouter1 != 4, solution2: myRouter1 == 4 }">解决方案</button>
					<button @click="myRouter1 = 5"
						:class="{ fastStart1: myRouter1 != 5, fastStart2: myRouter1 == 5 }">快速开始</button>
				</div>
			</el-header>
			<div> <router-view></router-view> </div>
			<div class="about" v-show="speed.show && this.$route.meta.show1">
				<div style="width: 20%; margin-left: 10%">
					<el-image class="aboutImg" :src="require('@/assets/speed/home/logo.png')" />
					<div class="content4">
						<p>缔造世界级时空信息王国</p>
					</div>
					<div class="phone">
						<img src="@/assets/speed/home/ic_dh.png" />
						<div>025-85584401</div>
					</div>
				</div>

				<table class="gridtable">
					<tr>
						<th>在线体验</th>
						<th>开发帮助</th>
						<th>解决方案</th>
						<th>联系我们</th>
					</tr>
					<tr>
						<td>功能样例</td>
						<td>在线API</td>
						<td>园区与建筑</td>
						<td>
							联系地址：江苏省南京市玄武区玄武大道699-22号江苏软件园8幢
						</td>
					</tr>
					<tr>
						<td>应用案例</td>
						<td>github</td>
						<td>城市与新区</td>
						<td>邮箱：office@speedchina.cn</td>
					</tr>
					<tr>
						<td></td>
						<td></td>
						<td></td>
						<td>联系电话：025-85581101</td>
					</tr>
				</table>
			</div>
			<el-footer v-show="speed.show && this.$route.meta.show1"
				style="text-align: center;color: white;background-color: #1b1c20;line-height: 100%;padding: 50px 15px;">
				Copyright © 2017.Speed China Technology Co.,Ltd. All rights
				reserved. 速度时空信息科技股份有限公司 苏ICP备18054352号
			</el-footer>
		</el-container>
		<div id="myNavigation" v-show="showMyNavigation">
			<div class="titleN">
				<h3>应用案例</h3>
				<br>
				<div style="height:1px;width:100%;background-color: #162946;"></div>
				<div class="myButton" v-if="myRouter1 === 3">
					<button @click="myRouter = 1" :class="{ smartCS1: myRouter != 1, smartCS2: myRouter == 1 }">
						<p>智慧城市</p>
					</button>
					<button @click="myRouter = 2" :class="{ smartYQ1: myRouter != 2, smartYQ2: myRouter == 2 }">
						<p>智慧园区</p>
					</button>
					<button @click="myRouter = 3" :class="{ smartSQ1: myRouter != 3, smartSQ2: myRouter == 3 }">
						<p>智慧社区</p>
					</button>
					<button @click="myRouter = 4" :class="{ smartGC1: myRouter != 4, smartGC2: myRouter == 4 }">
						<p>智慧工厂</p>
					</button>
				</div>

				<div class="solution-navigation-button" v-if="myRouter1 === 4">
					<button @click="myRouter = 5; showMyNavigation = false" :class="{ building1: myRouter != 5, building2: myRouter == 5 }">
						<p>园区与建筑</p>
					</button>
					<button @click="myRouter = 6; showMyNavigation = false" :class="{ city1: myRouter != 6, city2: myRouter == 6 }">
						<p>城市与新区</p>
					</button>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
let scrollTop;
let n = 0;
export default {
	data() {
		return {

			speed:{
				show:true,
				title:process.env.VUE_APP_TITLE
				// title:'JSATI3D'
			},

			foot: true,
			activeIndex: "/speed/home",
			a: true,
			headShow: true,
			style: {
				backgroundColor: "",
			},
			style1: {
				backgroundColor: "rgba(31, 52, 88,1)",
			},
			myRouter1: 0,
			myRouter: 0,
			showAbout: true,
			showMyNavigation: false,
			myButton: [
				{ p: '智慧城市', class1: 'smartCS1', class2: 'smartCS2' },
				{ p: '智慧园区', bg: require("@/assets/speed/home/下拉框切图/智慧园区-默认.png") },
				{ p: '智慧社区', bg: require("@/assets/speed/home/下拉框切图/智慧社区-默认.png") },
				{ p: '智慧工厂', bg: require("@/assets/speed/home/下拉框切图/智慧工厂-默认.png") },
			],
		};
	},
	mounted() {
		this.activeIndex = this.$route.path;
		if (this.$route.path != "/speed/home") {
			this.handleSelect();
		}
		window.addEventListener("scroll", this.handleScroll);
		if(this.$route.meta.show1 == false){
			this.style.backgroundColor = `rgba(31, 52, 88,1)`;
		}
	},
	methods: {
		handleScroll() {
			scrollTop =
				window.pageYOffset ||
				document.documentElement.scrollTop ||
				document.body.scrollTop;
			if (scrollTop > 20) {
				this.style.backgroundColor = `rgba(31, 52, 88,1)`;
			} else if (scrollTop == 0 && this.$route.meta.show1 != false) {
				this.style.backgroundColor = "transparent";
			}
		},
		handleSelect(node) {
			this.activeIndex = node;
			if (this.activeIndex === "/speed/home") {
				this.foot = true;
				this.a = true;
			} else {
				this.a = false;
				this.foot = false;
			}
		},
		YYAL() {
			if (n == 1 || this.myRouter == 0 || this.myRouter1 != 3) {
				this.$router.replace('/speed/smartCity');
			}
			this.myRouter1 = 3;
			this.showMyNavigation = true;
			n++;
		},
		handleSolutionClick() {
			if (n == 1 || this.myRouter == 0 || this.myRouter1 != 4) {
				this.$router.replace('/speed/solution/building');
			}
			this.myRouter1 = 4;
			this.showMyNavigation = true;
			n++;
		}
	},
	watch: {
		myRouter1(newVal) {
			if (newVal != 3 && newVal != 4) {
				this.showMyNavigation = false
			}
			if (newVal != 2 && scrollTop == 0) {
				this.style.backgroundColor = "transparent";
			}
			if (newVal == 1)
				this.$router.replace('/speed/home');
			else if (newVal == 2) {
				this.$router.replace('/speed/function');
				this.style.backgroundColor = 'rgba(31, 52, 88)';
			}
			else if (newVal == 4)
				this.$router.replace('/speed/solution/building');
			else if (newVal == 5)
				this.$router.replace('/speed/home');
		},
		myRouter(newVal) {
			this.showMyNavigation = false
			if (newVal == 1) { this.$router.replace('/speed/smartCity'); }
			else if (newVal == 2)
				this.$router.replace('/speed/smartPark');
			else if (newVal == 3)
				this.$router.replace('/speed/smartCommunity');
			else if (newVal == 4)
				this.$router.replace('/speed/smartFactory');
			else if (newVal == 5)
				this.$router.replace('/speed/solution/building');
			else if (newVal == 6)
				this.$router.replace('/speed/solution/city');
		}
	},
	beforeUnmount() {
		window.removeEventListener("scroll", this.handleScroll);
	},
};
</script>

<style scoped>
::v-deep .el-header {
	width: 100%;
	height: 6%;
	background-color: transparent;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;
	border: none;
}

.headerMain-bg {
	background-color: #5c5357;
}

::v-deep .el-main[a=true] {
	overflow: hidden;
	display: block;
}

::v-deep .el-main {
	overflow: auto;
	margin-top: 2.8%;
}

::v-deep .el-footer {
	border-top: 1px solid #5c5357;
	height: 4%;
}

.el-menu-info {
	height: 100%;
	position: absolute;
	right: 1%;
	background-color: transparent;
	color: white !important;
}

::v-deep .el-menu-item {
	color: white !important;
}

/* ::v-deep .el-menu-item:hover{
		background-color: #1F3458 !important;
	} */
::v-deep .el-menu--horizontal>.el-sub-menu .el-sub-menu__title {
	color: white !important;
}

::v-deep .el-main {
	--el-main-padding: 0;
	padding: 0;
}

.logo {
	width: 109px;
	height: 27px;
	position: absolute;
	top: 32%;
	left: 15%;
	display: inline-block;
	background-image: url("@/assets/speed/home/logo@2x.png");
	background-size: 100% 100%;
	background-repeat: no-repeat;
}

.homeName {
	width: 66px;
	height: 22px;
	position: absolute;
	left: 21%;
	margin-top: 5px;
	display: inline-block;
	color: white;
	font-weight: bold;
}

/* 功能案例弹窗 */
#myNavigation {
	position: fixed;
	/* display: ; */
	top: 0;
	width: 100%;
	height: 35%;
	background-color: #031024;
	z-index: 1000;
}

#myNavigation .titleN {
	color: aliceblue;
	font-size: larger;
	position: relative;
	width: 56%;
	top: 40%;
	left: 22%;
}


#myNavigation .titleN .myButton {
	display: flex;
}

#myNavigation .titleN .solution-navigation-button {
	display: flex;
	justify-content: center;
}

#myNavigation .myButton button {
	border: none;
	margin-top: 30px;
	width: 22%;
	height: 80px;
	color: aliceblue;
	/* background: url("@/assets/speed/home/下拉框切图/智慧城市-默认.png"); */
	background-size: 100% 100%;
	flex: 1;
	margin-left: 4%;
}

#myNavigation .solution-navigation-button button {
	border: none;
	margin-top: 30px;
	width: 315px;
	height: 80px;
	color: aliceblue;
	/* background: url("@/assets/speed/home/下拉框切图/智慧城市-默认.png"); */
	background-size: 100% 100%;
	margin-left: 4%;
}

.smartCS1,
.smartCS2,
.smartGC1,
.smartGC2,
.smartSQ1,
.smartSQ2,
.smartYQ1,
.smartYQ2 {
	border: none;
	margin-top: 30px;
	width: 22%;
	height: 80px;
	color: aliceblue;
	background: url("@/assets/speed/home/下拉框切图/智慧城市-默认.png");
	background-size: 100% 100%;
	flex: 1;
	margin-left: 4%;
}

.smartCS1 {
	background-image: url("@/assets/speed/home/下拉框切图/智慧城市-默认.png");
	background-size: 100% 100%;
}

.smartCS2,
.smartCS1:hover {
	background-image: url("@/assets/speed/home/下拉框切图/智慧城市-选中.png");
	background-size: 100% 100%;
}

.building1 {
	background-image: url("@/assets/speed/home/下拉框切图/智慧城市-默认.png");
	background-size: 100% 100%;
}

.building2,
.building1:hover {
	background-image: url("@/assets/speed/home/下拉框切图/智慧城市-选中.png");
	background-size: 100% 100%;
}

.city1 {
	background-image: url("@/assets/speed/home/下拉框切图/智慧园区-默认.png");
	background-size: 100% 100%;
}

.city2,
.city1:hover {
	background-image: url("@/assets/speed/home/下拉框切图/智慧园区-选中.png");
	background-size: 100% 100%;
}

.smartYQ1 {
	background-image: url("@/assets/speed/home/下拉框切图/智慧园区-默认.png");
	background-size: 100% 100%;
}

.smartYQ1:hover,
.smartYQ2 {
	background-image: url("@/assets/speed/home/下拉框切图/智慧园区-选中.png");
	background-size: 100% 100%;
}

.smartSQ1 {
	background-image: url("@/assets/speed/home/下拉框切图/智慧社区-默认.png");
	background-size: 100% 100%;
}

.smartSQ1:hover,
.smartSQ2 {
	background-image: url("@/assets/speed/home/下拉框切图/智慧社区-选中.png");
	background-size: 100% 100%;
}

.smartGC1 {
	background-image: url("@/assets/speed/home/下拉框切图/智慧工厂-默认.png");
	background-size: 100% 100%;
}

.smartGC1:hover,
.smartGC2 {
	background-image: url("@/assets/speed/home/下拉框切图/智慧工厂-选中.png");
	background-size: 100% 100%;
}

#myNavigation button:first-child {
	margin-left: 0;
}

#myNavigation button p {
	position: relative;
	color: aliceblue;
	margin: 0 0 15px -5px;
}

.Nav {
	position: absolute;
	right: 10%;
	height: 100%;
}

.firetPage1,
.firetPage2,
.GNYL1,
.GNYL2,
.YYAL1,
.YYAL2,
.solution1,
.solution2,
.fastStart2,
.fastStart1,
.fastStart2 {
	margin: 20px 30px 20px 30px;
	padding-bottom: 5px;
	border: none;
	background: none;
	color: aliceblue;
}

.firetPage2,
.GNYL2,
.YYAL2,
.solution2,
.fastStart2,
.fastStart2 {
	font-weight: bold;
	border-bottom: 2px seashell solid;
}

/* about */
.about {
	display: flex;
	width: 100%;
	height: 300px;
	background-color: #1b1c20;
	color: aliceblue;
}

.aboutImg {
	margin-top: 50px;
	margin-left: 10%;
}

.content4 {
	margin-left: 10%;
	width: 100%;
}

.phone {
	display: flex;
	margin-left: 10%;
	margin-bottom: 5%;
	margin-top: 30px;
}

.phone img {
	width: 30px;
	height: 30px;
}

.phone div {
	margin-top: 5px;
	margin-left: 10px;
	font-size: larger;
	font-weight: bolder;
	color: #c5d9e7;
}

.gridtable {
	margin-left: 10%;
	width: 50%;
	height: 50%;
	border-style: none;
	border-collapse: collapse;
}

.gridtable th,
.gridtable td {
	font-size: 18px;
	border-style: none;
	color: #ffffff;
	text-align: left;
	padding: 60px 28px 20px 28px;
	line-height: 20px;
}

.gridtable td {
	font-size: 14px;
	padding: 20px 28px 0px 28px;
	color: #a1a1a3;
}
</style>
