<template>
	<div class="plateLeft">
		<div class="tit_j"></div>
		<div class="bg_left_s">
			<el-image :src="require('@/assets/speed/case/village/img1.png')" />
			<span class="introduction_content"
				>谷里街道，隶属于江苏省南京市江宁区，地处江宁区西南部,东与秣陵街道相邻,南与横溪街道接，西与江宁街道相连，
				北与雨花台区板桥街道、铁心桥街道和西善桥街道接壤,街道办事处距江宁区政府24千米,行政区域总面积158平方千米，截至2011年末，谷里街道总人口为6万人。
			</span>
			<el-link class="link" href="http://www.baidu.com" type="warning">
				>>点击详情百度百科
			</el-link>
		</div>
		<div class="tit_ts"></div>

		<div class="bg_left_x">
			<div
				class="producebackground"
				v-for="(item, index) in produces"
				:key="index"
			>
				<!-- <div  class="produce_img" :style="{ 'background-image' :'url('+item.url+')'}"> </div> -->
				<el-image class="produce_img" :src="item.url" />
				<div class="produce_introduction">

					<div class="p_title"> {{item.name}} </div>
					<span class="p_content"> {{item.content}} </span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "plateLeft",
	data() {
		return {
			produces: [
				{
					name: "横溪西瓜",
					url: require("@/assets/speed/case/village/img2.png"),
					content:"横溪西瓜，江苏省南京市江宁区特产，全国农产品地理标志,横溪西瓜种植历史悠久，瓜农经验丰富，再加上低山丘陵地区的沙质土壤和得天独厚的温、光、水、肥条件以及优良品种和先进栽培技术的综合应用，成就了横溪西瓜皮薄、瓤脆、甘甜、多汁、爽口的特点"
				},
				{
					name: "土桥大米",
					url: require("@/assets/speed/case/village/img3.png"),
					content:"土桥大米粒形椭圆、米粒饱满，色泽晶莹，米饭清香松软，入口爽滑，柔韧筋糯，回味留香，冷饭不硬"
				},
				{
					name: "南京金箔",
					url: require("@/assets/speed/case/village/img4.png"),
					content:"土桥大米粒形椭圆、米粒饱满，色泽晶莹，米饭清香松软，入口爽滑，柔韧筋糯，回味留香，冷饭不硬"
				},
				{
					name: "周岗红木",
					url: require("@/assets/speed/case/village/img5.png"),
					content:"周岗红木雕刻，第一批市级非物质文化遗产代表性项目名录传统美术类项目"
				},
			],
		};
	},
};
</script>

<style>
.plateLeft {
	width: 18%;
	height: 100%;
	z-index: 100;
	position: absolute;
	top: 0%;
	padding: 0.1%;
	padding-top: 4%;
	padding-bottom: 2%;
	padding-left: 0.2%;
	background-image: linear-gradient(
		to right,
		rgba(4, 18, 17, 0.9),
		rgba(4, 18, 17, 0)
	);
}
.tit_j {
	width: 100%;
	height: 4%;
	background: url("@/assets/speed/case/village/tit_j.png") no-repeat;
	background-size: 100% 100%;
	margin-bottom: 2%;
}
.bg_left_s {
	width: 100%;
	height: 44.5%;
	background: url("@/assets/speed/case/village/bg_left_s.png") no-repeat;
	background-size: 100% 100%;
	margin-bottom: 3%;
	padding: 2%;
}

.tit_ts {
	width: 100%;
	height: 4%;
	background: url("@/assets/speed/case/village/tit_ts.png") no-repeat;
	background-size: 100% 100%;
	margin-bottom: 2%;
}
.bg_left_x {
	width: 100%;
	height: 44.5%;
	background: url("@/assets/speed/case/village/bg_left_x.png") no-repeat;
	background-size: 100% 100%;
	padding: 2%;
	overflow-y: scroll;
}
.introduction_content {
	width: 100%;
	height: 40%;
	display: inline-block;
	padding: 1%;
	text-indent: 1cm;
	font-size: 14px;
	font-family: Source Han Sans CN, Source Han Sans CN-Regular;
	/* font-weight: bold; */
	text-align: justifyLeft;
	color: #eaf8f4;
	letter-spacing: 1pt;
	overflow: hidden;
	text-overflow: ellipsis;
}
.link {
	position: absolute;
	display: block;
	right: 6%;
}
.producebackground {
	width: 100%;
	height: 30%;
	background: url("@/assets/speed/case/village/list Border.png") no-repeat;
	background-size: 100% 100%;
	padding: 2%;
}
.produce_img {
	width: 37%;
	height: 96%;
	display: inline-block;
	background-size: 100% 100%;
	float: left;
}
.produce_introduction {
	display: inline-block;
	width: 60%;
	height: 96%;
	float: left;
	padding: 2%;
}
.p_title{

	background: url("@/assets/speed/case/village/p_title.png") no-repeat;
	background-size: 100% 100%;
	color: white;
	text-align: center;
	width: 70%;
	font-size: 14px;
	font-family: Source Han Sans CN, Source Han Sans CN-Regular;
	font-weight: bold;
	letter-spacing: 2pt;
	/* background-image: linear-gradient(
		rgba(15,71,72, 0.9),
		rgba(15,71,72, 0)
	); */
	line-height:36px;

}

.p_content{
	width: 100%;
	height: 68%;
	display: inline-block;
	font-size: 14px;
	font-family: Source Han Sans CN, Source Han Sans CN-Regular;
	/* font-weight: bold; */
	text-align: justifyLeft;
	color: #eaf8f4;
	overflow: hidden;
	-webkit-line-clamp: 3;
	display: -webkit-box;
	-webkit-box-orient: vertical;
}
</style>
