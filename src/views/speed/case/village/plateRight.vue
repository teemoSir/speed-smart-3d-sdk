<template>
	<div class="plateRight">
		<div class="dmwh"></div>
		<div class="dmwh_info">
			<div class="dmwh_content">南宋《景定建康志》记载，今境地属归善、建业、惠化三乡，以归善为主体。元代在此设“里”，地处金牛山谷，因名：谷里。</div>
		</div>
		<div class="whly"></div>
		<div class="whly_info">
			<div class="whly_info_frist">
				<el-image class="content_img" :src="require('@/assets/speed/case/village/img6.png')" fit="contain"/>
				<div class="content_travel">
					<div class="content_travel_title">银杏湖水世界</div>
					<div class="content_travel_introduction">
						占地十五平方公里！全省规模最大的生态主题游乐项目。银杏湖乐园分为游乐区、生态休闲区...
					</div>
					<div class="price_content">
						<div class="price_title">门票：</div>
						<div class="pricecost">￥150</div>
					</div>
				</div>
			</div>
			<div class="whly_info_frist">
				<div class="content_travel">
					<div class="content_travel_title">大塘金薰衣草园</div>
					<div class="content_travel_introduction">
						大塘金薰衣草园位于南京市江宁区谷里街道大塘金村，种植了“梯田式薰衣草”400亩，使得人们...
					</div>
					<div class="price_content">
						<div class="price_title">门票：</div>
						<div class="pricecost">￥150</div>
					</div>
				</div>
				<el-image class="content_img" :src="require('@/assets/speed/case/village/img7.png')" fit="contain"/>
			</div>
			<div></div>

		</div>
		<div class="tj"></div>
		<div class="tj_info">
			<div class="tj_content1">
				<el-image class="tj_img" :src="require('@/assets/speed/case/village/ic_tsdm.png')" />
				<div class="tj_introduction">
					<div class="tj_num"> 100 </div>
					<div class="tj_type"> 特色地名</div>
				</div>
			</div>
			<div class="tj_content2">
				<el-image class="tj_img" :src="require('@/assets/speed/case/village/ic_tsncp.png')" />
				<div class="tj_introduction">
					<div class="tj_num"> 300 </div>
					<div class="tj_type"> 特色农产品</div>
				</div>
			</div>
			<div class="tj_content3">
				<el-image class="tj_img" :src="require('@/assets/speed/case/village/ic_lyjd.png')" />
				<div class="tj_introduction">
					<div class="tj_num"> 20 </div>
					<div class="tj_type"> 旅游景点</div>
				</div>
			</div>
			<div class="tj_content4">
				<el-image class="tj_img" :src="require('@/assets/speed/case/village/ic_mshd.png')" />
				<div class="tj_introduction">
					<div class="tj_num"> 15 </div>
					<div class="tj_type"> 民俗活动</div>
				</div>
			</div>


		</div>
	</div>
</template>

<script>

export default {
	name: "plateRight",

}
</script>

<style>
.plateRight {
	width: 18%;
	height: 100%;
	z-index: 100;
	position: absolute;
	top: 0%;
	right: 0%;
	padding: 0.1%;
	padding-top: 4%;
	padding-bottom: 2%;
	padding-right: 0.2%;
	background-image: linear-gradient(to right, rgba(4, 18, 17, 0), rgba(4, 18, 17, 0.9));
}

.dmwh {
	width: 100%;
	height: 4%;
	background: url('@/assets/speed/case/village/tit_dmwh.png') no-repeat;
	background-size: 100% 100%;
	margin-bottom: 3%;
}

.dmwh_info {
	width: 100%;
	height: 12%;
	background: url('@/assets/speed/case/village/bg_right_s.png') no-repeat;
	background-size: 100% 100%;
	margin-bottom: 3%;
}


.whly {
	width: 100%;
	height: 4%;
	background: url('@/assets/speed/case/village/tit_whly.png') no-repeat;
	background-size: 100% 100%;
	margin-bottom: 3%;
}

.whly_info {
	width: 100%;
	height: 44.5%;
	background: url('@/assets/speed/case/village/bg_right_z.png') no-repeat;
	background-size: 100% 100%;
	margin-bottom: 3%;
	padding: 4%;
}

.tj {
	width: 100%;
	height: 4%;
	background: url('@/assets/speed/case/village/tit_tj.png') no-repeat;
	background-size: 100% 100%;
	margin-bottom: 3%;
}

.tj_info {
	width: 100%;
	height: 25%;
	background: url('@/assets/speed/case/village/bg_righr_x.png') no-repeat;
	background-size: 100% 100%;
	margin-bottom: 3%;

}


.dmwh_content {
	color: #EAF8F4;
	font-size: 14px;
	width: 100%;
	height: 100%;
	padding: 4%;
	font-family: Source Han Sans CN, Source Han Sans CN-Regular;
	font-weight: bold;
	text-align: justifyLeft;
	letter-spacing: 0.84px;
	overflow: hidden;
	text-overflow: ellipsis;
}

.content_travel_title {
	background: url('@/assets/speed/case/village/银杏湖水世界标题.png') no-repeat;
	background-size: 100% 100%;
	width: 95%;
	height: 25%;
	text-align: center;
	color: #EAF8F4;
	font-size: 14px;
	font-weight: 700;
	letter-spacing: 0.28px;
	overflow: hidden;
	padding: 6%;

}

.content_travel_introduction {
	width: 100%;
	height: 55%;
	font-size: 12px;
	font-family: Source Han Sans CN, Source Han Sans CN-Regular;
	font-weight: 400;
	text-align: left;
	color: #f0f0f0;
	letter-spacing: 0.24px;
	overflow: hidden;
	text-overflow: ellipsis;
}

.price_content {
	width: 100%;
	height: 15%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.price_title {
	width: 35%;
	height: 100%;
	color: #EAF8F4;
	font-size: 14px;
	font-weight: 700;
	overflow: hidden;
}

.pricecost {
	width: 65%;
	height: 100%;
	font-size: 20px;
	font-weight: 700;
	text-align: left;
	color: #fabf59;
	letter-spacing: 0.4px;
	overflow: hidden;
	line-height: 19px;
}

.whly_info_frist {
	width: 100%;
	height: 49%;
	border: 1px solid rgb(56 122 127 / 50%);
	margin-bottom: 2%;
	padding: 2%;
	display: flex;
	justify-content: space-between;
}

.content_img {
	width: 46%;
	height: 100%;
}

.content_travel {
	width: 50%;
	height: 100%;
}


.tj_content1,
.tj_content2,
.tj_content3,
.tj_content4 {
	width: 50%;
	height: 50%;
	float: left;
	text-align: center;
	padding: 3%;
	display: flex;
	justify-content: center;
}

.tj_introduction{
	width: 50%;
    height: 100%;
    padding-top: 7%;
}
.tj_img {
	width: 48%;
    height: 90%;
}

.tj_num {
	width: 100%;
	height: 50%;
	font-size: 24px;
	font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
	font-weight: 700;
	text-align: left;
	color: #fabf59;
	overflow: hidden;

}

.tj_type {
	width: 100%;
	height: 50%;
	font-size: 14px;
	font-family: Source Han Sans CN, Source Han Sans CN-Regular;
	font-weight: 400;
	text-align: left;
	color: #f0f0f0;
	overflow: hidden;

}
</style>
