<template>
	<div class="banner">
		<el-carousel>
			<el-carousel-item v-for="item in banner" :key="item.id"  style="width:100%;height:100%">
				<div class="content1">
					<p>{{ title }}</p>
				</div>
				<div class="content2">
					<p>{{ item.content2 }}</p>
				</div>

				<el-image :src="item.uri" style="width:100%;height:100%;" />
			</el-carousel-item>
		</el-carousel>
	</div>
	<div class="video" style="width: 100%; height: 640px">
		<el-image class="video_begin" :src="require('@/assets/speed/home/ic_bf.png')" />
		<div class="content3">
			<p>点击播放按钮</p>
		</div>
	</div>
	<div :class="{
		product1: divNum == 0,
		product2: divNum == 1,
		product3: divNum == 2,
		product4: divNum == 3,
		product5: divNum == 4,
	}">
		<div class="myTitle">
			<p class="myTitle_t">产品内容</p>
			<br />
			<p class="myTitle_c">Product content</p>
			<br />
		</div>
		<el-tabs tab-position="left" class="productTabs" @tab-click="handleClick">
			<el-tab-pane label="SDK">
				<p class="title2">SDK</p>
				<br />
				<p class="tab_content">
					所有核心功能都已经封装SDK库，该类库可以在官网或npm免费下载无限制使用。并且提供详细的完整API文档，可以在官网进行免费查阅
				</p>
			</el-tab-pane>
			<el-tab-pane label="功能样例">
				<p class="title2">功能样例</p>
				<br />
				<p class="tab_content">
					所有可实现的功能服务均有样例，需求方可在官网体验，也可免费下载查阅源码。功能样例在国内外各大开源平台进行开源，需求方可免费下载使用，或参考样例进行开发
				</p>
			</el-tab-pane>
			<el-tab-pane label="应用案例">
				<p class="title2">应用案例</p>
				<br />
				<p class="tab_content">
					公司过往业绩中具有代表性的案例，可充分体现本公司核心业务内容与技术储备，同时展现了公司深耕的业务领域，需求方可参考应用案例明确具体需求内容
				</p>
			</el-tab-pane>
			<el-tab-pane label="解决方案">
				<p class="title2">解决方案</p>
				<br />
				<p class="tab_content">
					根据指定需求，量身打造的解决方案，针对性地解决需求方具体的业务问题。并提供技术文档、源码、软件等多种成果形式
				</p>
			</el-tab-pane>
			<el-tab-pane label="轻量化">
				<p class="title2">轻量化</p>
				<br />
				<p class="tab_content">
					基于语义解析分割的图形轻量化技术和高性能三维模型切片技术，从轮廓提取、拓扑处理、投影转换等多个角度实现三角面片压缩优化与存储
				</p>
			</el-tab-pane>
		</el-tabs>
		<div class="myLine"></div>
	</div>
	<div class="aa"></div>
	<div class="bb"></div>
	<div class="cc"></div>
	<div class="dd"></div>
	<div class="case" style="width: 100%; height: 941px">
		<div class="myTitle">
			<p class="myTitle_t">应用案例</p>
			<br />
			<p class="myTitle_c">Application case</p>
		</div>
		<div class="caseImg">
			<el-image class="labelImg" :src="require('@/assets/speed/home/ic_cim@2x.png')" />
			<el-image class="labelImg" :src="require('@/assets/speed/home/ic_dxgx@2x.png')" />
			<el-image class="labelImg" :src="require('@/assets/speed/home/ic_yqgl@2x.png')" />
			<el-image class="labelImg" :src="require('@/assets/speed/home/ic_sjsw@2x.png')" />
		</div>
		<el-tabs class="caseTabs" @tab-click="getImg">
			<el-tab-pane label="智慧城市">
			</el-tab-pane>
			<el-tab-pane label="智慧社区">
			</el-tab-pane>
			<el-tab-pane label="智慧园区">
			</el-tab-pane>
			<el-tab-pane label="智慧工厂">
			</el-tab-pane>
			<el-carousel type="card" height="400px !important" :autoplay="false" indicator-position="none" ref="carousel">
				<el-carousel-item v-for="item in lastBanner" :key="item.id">
					<el-image class="banner_four_two_small" :src="item.uri" />
				</el-carousel-item>
			</el-carousel>
		</el-tabs>

	</div>
</template>

<script>
export default {
	data() {
		return {
			title:process.env.VUE_APP_TITLE,
			divNum: 0,
			banner: [
				{
					id: 1,
					uri: require("@/assets/speed/home/banner1.png"),
					content1: "Speed3D",
					content2: "功能样例丰富，成熟稳定",
				},
				{
					id: 2,
					uri: require("@/assets/speed/home/banner2.png"),
					content1: "Speed3D",
					content2: "功能样例丰富，成熟稳定",
				},
				{
					id: 3,
					uri: require("@/assets/speed/home/banner3.png"),
					content1: "Speed3D",
					content2: "功能样例丰富，成熟稳定",
				},
				{
					id: 4,
					uri: require("@/assets/speed/home/banner4.png"),
					content1: "Speed3D",
					content2: "功能样例丰富，成熟稳定",
				},
			],
			lastBanner: [
				{
					id: 1,
					uri:require('@/assets/speed/功能案例/智慧城市/智慧城市.png'),
					content1: "Speed3D",
					content2: "功能样例丰富，成熟稳定",
				},
				{
					id: 2,
					uri:require('@/assets/speed/功能案例/智慧城市/智慧民政.png'),
					content1: "Speed3D",
					content2: "功能样例丰富，成熟稳定",
				},
				{
					id: 3,
					uri:require('@/assets/speed/功能案例/智慧城市/智慧乡村.png'),
					content1: "Speed3D",
					content2: "功能样例丰富，成熟稳定",
				},
				{
					id: 4,
					uri:require('@/assets/speed/功能案例/智慧社区/管线.png'),
					content1: "Speed3D",
					content2: "功能样例丰富，成熟稳定",
				},
			],
		};
	},
	mounted() {
		console.log(document.getElementById("tab-0"));
	},
	methods: {
		handleClick(tab, event) {
			switch (tab.props.label) {
				case "SDK":
					this.divNum = 0;
					break;
				case "功能样例":
					this.divNum = 1;
					break;
				case "应用案例":
					this.divNum = 2;
					break;
				case "解决方案":
					this.divNum = 3;
					break;
				case "轻量化":
					this.divNum = 4;
					break;
			}
		},
		getImg(i) {
			switch (i.props.label) {
				case '智慧城市':
					this.$refs.carousel.setActiveItem(0);
					break;
				case '智慧社区':
					this.$refs.carousel.setActiveItem(1);
					break;
				case '智慧园区':
					this.$refs.carousel.setActiveItem(2);
					break;
				case '智慧工厂':
					this.$refs.carousel.setActiveItem(3);
					break;
			}
		}
	},
	watch: {
	},
};
</script>

<style scoped>
/* banner */
.content1,
.content2 {
	position: absolute;
	width: 30%;
	z-index: 999;
	margin-left: 35%;
	margin-top: 15%;
}

.content2 {
	margin-top: 20%;
}

.banner p {
	font-size: 48px;
	font-weight: Regular;
	color: white;
	text-align: center;
}

.banner_four_two_small {
	width: 100%;
	height: 100%;
}

/* video */
.video {
	background-image: url("@/assets/speed/home/img_sp.png");
	background-size: 100% 100%;
}

.video_begin {
	width: 3%;
	margin-left: 48.5%;
	margin-top: 16%;
}

.content3 {
	position: relative;
	width: 30%;
	z-index: 999;
	margin-left: 35%;
}

.content3 p {
	font-size: 24px;
	font-weight: Regular;
	color: white;
	text-align: center;
}

/* product */
.product1,
.product2,
.product3,
.product4,
.product5 {
	background-image: url("@/assets/speed/home/img_cpnr.png");
	background-size: 100% 100%;
	width: 100%;
	height: 704px;
	padding-top: 5%;
}

.product2,
.aa {
	background-image: url("@/assets/speed/home/img_gnyl.png");
}

.product3,
.bb {
	background-image: url("@/assets/speed/home/img_yyal1.png");
}

.product4,
.cc {
	background-image: url("@/assets/speed/home/img_jjfa.png");
}

.product5,
.dd {
	background-image: url("@/assets/speed/home/img_qlh.png");
}

.productTabs {
	height: 200px;
	width: 60%;
	margin-left: 32%;
	margin-top: 5%;
}

.productTabs .title2,
.productTabs .tab_content {
	color: white;
	font-size: 28px;
	margin-left: 50px;
	width: 50%;
}

.productTabs .tab_content {
	font-size: 18px;
	line-height: 30px;
}

::v-deep .productTabs .el-tabs__item:focus {
	background: linear-gradient(to right, #081137, #082973);
}

/* case */
.case {
	background-image: url("@/assets/speed/home/img_yyal.png");
	background-size: 100% 100%;
	padding-top: 5%;
}

.caseTabs {
	height: 70%;
	width: 70%;
	margin-left: 15%;
}

.caseTabs_content {
	height: 450px;
	width: 60%;
	position: relative;
	/* margin-top: 3%; */
	margin-left: 20%;
}

.caseTabs .title,
.caseTabs .tab_content {
	color: white;
	font-size: 28px;
	margin-left: 50px;
}

.caseTabs .tab_content {
	font-size: 18px;
}

::v-deep .caseTabs .el-tabs__nav {
	width: 100%;
}

::v-deep .caseTabs .el-tabs__item {
	width: 25%;
	text-align: center;
	/* 默认是偏右一点，为此修改过来 */
	padding: 0;
}

::v-deep .caseTabs .el-tabs__item:focus {
	color: #3a89fe;
}

.caseImg {
	width: 70%;
	margin-left: 15%;
}

.labelImg {
	width: 72px;
	height: 72px;
	margin-left: 10%;
	margin-right: 9.5%;
	margin-top: 3%;
	margin-bottom: 0%;
}

/* pruduct case 公共样式 */
/* 保持标签按钮字体颜色始终为白色 */
::v-deep .el-tabs__item {
	color: white;
}

/* 页面标题 */
.myTitle {
	margin-left: 46%;
	width: 8%;
}

.myTitle_t {
	color: white;
	font-size: 30px;
}

.myTitle_c {
	color: white;
	font-size: 16px;
}

::v-deep  .el-carousel__container {
	height: 764px !important;
}
::v-deep .caseTabs .el-carousel__container {
	margin-top: 3%;
}

::v-deep .el-carousel__mask {
	background-color: transparent;
}

.demo-tabs>.el-tabs__content {
	padding: 32px;
	color: #6b778c;
	font-size: 32px;
	font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
	height: 100%;
}


.banner {
	height: 764px
}

.myLine {
	width: 80px;
	height: 3px;
	background: white;
	position: relative;
	bottom: 30px;
	left: 40.2%;
}
</style>
