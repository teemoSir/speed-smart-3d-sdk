<template>
	<!-- 智慧社区 -->
	<div class="banner" style="width: 100%; height: 764px">
	</div>
	<!-- 覆盖领域 -->
	<div class="banner_two" style="width: 100%; height: 840px">
		<el-image class="banner_two_small" :src="require('@/assets/speed/功能案例/title_faly.png')" />
		<div :class="[val.class]" v-for="(val,index) in myImg">
			<div>
				<p>{{val.p}}</p>
			</div>
			<button>
			</button>
		</div>
	</div>
	<!-- 产品架构 -->
	<div class="banner_three" style="width: 100%; height: 1530px">
		<el-image class="banner_three_small" :src="require('@/assets/speed/功能案例/title_faly.png')" />
	</div>
	<!-- 经典案例 -->
	<div class="banner_four" style="width: 100%; height: 875px">
		<el-image class="banner_four_small" :src="require('@/assets/speed/功能案例/title_jdal.png')" />
		<el-carousel :interval="5000" type="card" height="500px !important" arrow="always">
			<el-carousel-item v-for="item in cases" :key="item.id">
				<el-image @click="goBack(item)" class="banner_four_two_small"
					:src="item.url" />
			</el-carousel-item>
		</el-carousel>
	</div>

</template>

<script>
export default {
	data() {
		return {
			cases:[
				{
					id:1,
					url:require('@/assets/speed/功能案例/智慧工厂/智慧工厂.png'),
					path:"/speed/case/factory/zhongdan"
				}
			],
			myImg:[
				{p:'材料管理',class:'csgh'},
				{p:'安全生产',class:'csyzt'},
				{p:'环境监测',class:'zhgl'},
				{p:'设备管理',class:'wlgz'},
				{p:'人员管理',class:'csxxmx'}
			]
		};
	},
	mounted() { },
	methods: {
		goBack(item) {
			let routeUrl = this.$router.resolve({
				path:item.path ,
			});
			window.open(routeUrl.href, "_blank");

		},
	},
};
</script>

<style scoped>
/* 1 */
.banner {
	background-image: url("@/assets/speed/功能案例/智慧工厂/banner_zhgc.png");
	background-size: 100% 100%;
}



/* 2 */
.banner_two {
	background-image: url("@/assets/speed/功能案例/智慧工厂/bg.png");
	position: relative;
	background-size: 100% 100%;
}

.banner_two_small {
	margin-left: 40.8%;
	margin-top: 3%;
	position: absolute;
	z-index: 2;
}



/* 3 */
.banner_three {
	background-image: url("@/assets/speed/功能案例/智慧工厂/img_cpjg.png");
	background-size: 100% 100%;
}

.banner_three_small {
	margin-left: 40.8%;
	margin-top: 3%;
}

/* 4 */
.banner_four_small {
	margin-left: 40.8%;
	margin-top: 57px;
	margin-bottom: 80px;
}

.banner_four_two_small {
	width: 100%;
	height: 100%;
}

.banner_four {
	background-image: url("@/assets/speed/功能案例/bg_jdal.png");
}

/* 覆盖领域 */
.csgh,
.csyzt,
.zhgl,
.wlgz,
.csxxmx {
	position: absolute;
	left: 46%;
	top: 28%;
	width: 8%;
	margin-left: -12%;
	height: 15%;
	background-color: transparent;
}

.csyzt {
	margin-left: 12%;
}

.zhgl {
	top: 45%;
	left: 45.5%;
	width: 9%;
	height: 18%;
	margin-left: -30%;
}

.wlgz {
	top: 45%;
	left: 45.5%;
	width: 9%;
	height: 18%;
	margin-left: 30%;
}

.csxxmx {
	top: 65%;
	left: 45%;
	width: 10%;
	height: 20%;
	margin-left: 0%;
}

.csyzt div,
.zhgl div,
.wlgz div,
.csxxmx div,
.csgh div {
	background-image: url("@/assets/speed/功能案例/img_btk.png");
	background-size: 100% 100%;
	width: 100%;
	height: 30%;
}

.csyzt div p,
.zhgl div p,
.wlgz div p,
.csxxmx div p,
.csgh div p {
	text-align: center;
	font-size: 19px;
	font-weight: bold;
	line-height: 50px;
	color: white;
}

.csyzt div p,
.csgh div p {
	font-size: 17px;
	line-height: 35px;
}

.zhgl div p,
.wlgz div p {
	font-size: 18px;
	line-height: 40px;
}

.csyzt button,
.zhgl button,
.wlgz button,
.csxxmx button,
.csgh button {
	width: 130%;
	height: 100%;
	margin-left: -15%;
	margin-top: 15%;
	border: none;
	background-image: url("@/assets/speed/功能案例/智慧工厂/img_clgl.png");
	background-size: 100% 100%;
	background-color: transparent;
}

.csyzt button {
	background-image: url("@/assets/speed/功能案例/智慧工厂/img_aqsc.png");
	background-size: 100% 100%;
}

.cszhglyzt button {
	background-image: url("@/assets/speed/功能案例/智慧工厂/img_hjjc.png");
	background-size: 100% 100%;
}

.wlgz button {
	background-image: url("@/assets/speed/功能案例/智慧工厂/ic_sbgl.png");
	background-size: 100% 100%;
}

.csxxmx button {
	margin-top: 5%;
	background-image: url("@/assets/speed/功能案例/智慧工厂/img_rygl.png");
	background-size: 100% 100%;
}

/* 修改走马灯原生样式 */

::v-deep .el-carousel__arrow--left,
::v-deep .el-carousel__arrow--right {
	background-image: url("@/assets/speed/功能案例/bt_z.png");
	background-size: 100% 100%;
	width: 50px;
	height: 50px;
	background-color: #3a89fe;
	left: 21%
}

::v-deep .el-carousel__arrow--right {
	background-image: url("@/assets/speed/功能案例/bt_y.png");
	background-size: 100% 100%;
	left: 76%;
}

::v-deep .el-carousel__arrow--left svg,
::v-deep .el-carousel__arrow--right svg {
	display: none;
}

::v-deep .el-carousel__mask {
	background-color: transparent;
}
</style>
