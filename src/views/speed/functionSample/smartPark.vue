<template>
	<!-- 智慧园区 -->
	<div class="banner" style="width: 100%; height: 764px">
	</div>
	<!-- 覆盖领域 -->
	<div class="banner_two" style="width: 100%; height: 840px">
		<el-image class="banner_two_small" :src="require('@/assets/speed/功能案例/title_faly.png')" />
		<div :class="[val.class]" v-for="(val, index) in myImg">
			<p>{{ val.p }}</p>
		</div>
	</div>
	<!-- 产品架构 -->
	<div class="banner_three" style="width: 100%; height: 1530px">
		<el-image class="banner_three_small" :src="require('@/assets/speed/功能案例/title_cpjg.png')" />
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

			],
			myImg: [
				{ class: 'jxcgl' },
				{ class: 'wygl' },
				{ class: 'zhjt' },
				{ class: 'hbjg' },
				{ class: 'xjzy' },
				{ class: 'afgl'},
				{ class: 'zcgl'},
				{ class: 'nygl'},
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
	background-size: 100% 100%;
	background-image: url("@/assets/speed/功能案例/智慧园区/banner_zhyq.png");
}

/* 2 */
.banner_two {
	background-image: url("@/assets/speed/功能案例/智慧园区/img_fgly_zhyq.png");
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
	background-size: 100% 100%;
	background-image: url("@/assets/speed/功能案例/智慧园区/img_cpjg.png");
}

.banner_three_small {
	margin-left: 40.8%;
	margin-top: 3%;
	/* margin:0 auto; */
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
.jxcgl,.wygl,.zhjt,.hbjg,.xjzy,.afgl,.zcgl,.nygl {
	position: absolute;
	/* 居中 */
	left: 45%;
	width: 10%;
	/* 上下左右偏移 */
	top: 25%;
	margin-left: -9%;
	height: 20%;
	background-size: 100% 100%;
	background-image: url("@/assets/speed/功能案例/智慧园区/进销存管理.png");
}

.wygl {
	margin-left: 9%;
	background-size: 100% 100%;
	background-image: url("@/assets/speed/功能案例/智慧园区/物业管理.png");
}
/* 第二层 */
.zhjt {
	top: 33%;
	margin-left: -21%;
	background-size: 100% 100%;
	background-image: url("@/assets/speed/功能案例/智慧园区/智慧家庭.png");
}

.hbjg {
	top: 33%;
	margin-left: 21%;
	background-size: 100% 100%;
	background-image: url("@/assets/speed/功能案例/智慧园区/环保监管.png");
}
/* 第三层 */
.xjzy {
	top: 53%;
	margin-left: -27%;
	background-size: 100% 100%;
	background-image: url("@/assets/speed/功能案例/智慧园区/巡检作业.png");
}

.afgl {
	top: 53%;
	margin-left: 27%;
	background-size: 100% 100%;
	background-image: url("@/assets/speed/功能案例/智慧园区/安防管理.png");
}
/* 第四层 */
.zcgl {
	top: 70%;
	margin-left: -14%;
	background-size: 100% 100%;
	background-image: url("@/assets/speed/功能案例/智慧园区/资产管理.png");
}

.nygl {
	top: 70%;
	margin-left: 14%;
	background-size: 100% 100%;
	background-image: url("@/assets/speed/功能案例/智慧园区/能源管理.png");
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
