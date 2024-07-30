<template>
	<div class="countryside-left">
		<div class="xcjx">
			<div class="xcjx_back">
				<el-carousel arrow="never">
					<el-carousel-item v-for="(item, index) in countrydata" :key="index">
						<el-image class="xcjx_img" :src=item.img fit="fill" />
						<div class="xcjx_content">
							{{ item.content }}
						</div>
					</el-carousel-item>
				</el-carousel>
			</div>
			<div class="xcjx_title"></div>
		</div>
		<!-- <div class="rygk">
			<div class="rygk_back">
				<div class="rygk_content">
					<div class="rygk_item" v-for="(item, index) in person" :key="index">
						<div>{{ item.name }}</div>
						<div class="rygk_num">
							<div class="rygk_font">{{ item.num }}</div>
							&nbsp
							<div>{{ item.unit }}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="rygk_title"></div>
		</div> -->
		<div class="hnzn">
			<div class="hnzn_back">
				<div class="hnzn_content">
					<div class="hnzn_item" :class="item.check == true ? 'hnzn_item_Active' : ''"
						v-for="(item, index) in HNZN" :key="index" @click="loadHNZNData(item.type)">
						<img :src="item.icon" style="padding-right:5px" alt="" />
						<div>
							<div>{{ item.type }}</div>
							<div class="hnzn_num">
								<div class="hnzn_font">{{ item.num }}</div>
								&nbsp
								<div>家</div>
							</div>
						</div>

					</div>
				</div>
			</div>
			<div class="hnzn_title"></div>
		</div>
		<div class="ssjk">
			<div class="ssjk_back">
				<div class="ssjk_content">
					<div class="ssjk_item" v-for="(item, index) in videos" :key="index">
						<video class="ssjk_vidio" controls poster loop autoplay muted>
							<source :src=item type="video/mp4">
						</video>
					</div>
				</div>
			</div>
			<div class="ssjk_title"></div>
		</div>
	</div>

	<el-button class="searchBtn" title="搜索" @click="setShow" v-show="!isshow"></el-button>
	<div class="searchDialog" :panelVisible="isshow">
		<div class="searchClose" @click="setShow">
			<span>X</span>
		</div>
		<div class="search">
			<input class="searchIpt" v-model="searchKey" type="text" placeholder="请输入关键字" @keyup.enter.native="searchPOIFn">
			<el-button class="searchButton" @click="searchPOIFn">
				<svg t="1681458667424" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
					p-id="2628" width="32" height="32">
					<path
						d="M929.299 739.872L774.98 634.816c31.086-51.044 48.995-110.994 48.995-175.129 0-186.22-150.96-337.181-337.18-337.181s-337.18 150.962-337.18 337.182c0 186.218 150.961 337.179 337.181 337.179 101.842 0 193.139-45.151 254.964-116.527l155.843 106.097a28.021 28.021 0 0 0 15.823 4.886c9.006 0 17.854-4.312 23.306-12.316 8.752-12.86 5.424-30.377-7.433-39.135zM596.1 718.493c-34.589 14.629-71.364 22.047-109.304 22.047s-74.716-7.418-109.305-22.047c-33.437-14.142-63.478-34.4-89.29-60.213-25.811-25.811-46.068-55.852-60.213-89.29-14.63-34.589-22.047-71.368-22.047-109.303 0-37.941 7.417-74.715 22.047-109.304 14.145-33.438 34.402-63.48 60.213-89.29 25.813-25.813 55.854-46.07 89.29-60.214 34.589-14.63 71.365-22.049 109.305-22.049s74.715 7.419 109.304 22.049c33.437 14.144 63.479 34.4 89.291 60.214 25.81 25.81 46.069 55.852 60.212 89.29 14.63 34.589 22.047 71.362 22.047 109.304 0 37.935-7.417 74.714-22.047 109.303a279.709 279.709 0 0 1-26.677 48.872 28.078 28.078 0 0 0-7.705 7.616 28.142 28.142 0 0 0-3.768 8 284.009 284.009 0 0 1-22.063 24.802c-25.812 25.813-55.854 46.072-89.29 60.213z"
						fill="#ffffff" p-id="2629" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path>
					<path
						d="M661.921 328.785a22.414 22.414 0 0 1-11.787-3.346 179.688 179.688 0 0 0-23.571-12.198c-11.446-4.884-16.764-18.119-11.881-29.563 4.884-11.446 18.12-16.765 29.563-11.881a224.827 224.827 0 0 1 29.505 15.268c10.598 6.522 13.9 20.4 7.38 30.996-4.252 6.915-11.646 10.724-19.209 10.724M317.785 352.971c-4.808 0-9.649-1.53-13.749-4.694-9.852-7.603-11.675-21.75-4.071-31.602 33.717-43.69 82.21-73.227 136.543-83.166 43.232-7.907 87.37-3.009 127.637 14.177 11.446 4.884 16.764 18.12 11.881 29.564-4.884 11.445-18.12 16.765-29.564 11.88-32.114-13.703-67.331-17.608-101.846-11.299-43.365 7.937-82.07 31.507-108.978 66.373-4.441 5.752-11.111 8.767-17.853 8.767"
						fill="#E84C57" p-id="2630"></path>
				</svg>
			</el-button>
		</div>
		<div class="search_result">
			<div class="search_content" v-for="item in searchPOIData" :key="item.id" @click="zoomToPOI(item.id)">
				<div class="search_name">{{ item.名称 }}</div>
				<p class="search_address">地址：{{ item.地址 }}</p>
			</div>
		</div>



	</div>

	<div class="countryside-right">
		<div class="ggss">
			<div class="ggss_content">
				<div class="ggss_public">
					<div class="ggss_item" :class="item.check == true ? 'ggss_item_Active' : ''"
						v-for="(item, index) in GGSS" :key="index" @click="loadGGSSData(item.类型)">
						<img :src="item.icon" style="width:24px; " alt="" />
						<div style="display: contents;">
							<div>{{ item.类型 }}</div>
							<!-- <div>{{ item.num }}</div> -->
						</div>
					</div>
				</div>
			</div>
			<div class="ggss_title"></div>
		</div>
		<div class="sszt">
			<div class="sszt_content">
				<div class="sszt_chart" ref="chartSSZT"></div>
			</div>
			<div class="sszt_title"></div>
		</div>
		<div class="ywjl">
			<div class="ywjl_content">
				<div class="ywjl_back">
					<Vue3SeamlessScroll class="scroll_box" hover-stop="true" :list="records" hover="true" step="0.3"
						singleHeight="75" waitTime="6000">
						<div class="ywjlLst" v-for="(item, index) in records" :key="index">
							<div class="ywjl_record">
								<div class="ywjl_type">{{ item.type }}</div>
								<div class="ywjl_time">{{ item.time }}</div>
							</div>
							<div class="ywjl_info">{{ item.content }}</div>
						</div>
					</Vue3SeamlessScroll>
				</div>


			</div>
			<div class="ywjl_title"></div>
		</div>
	</div>
</template>

<script>

import ModelInfo from '@/utils/modelInfo'
import { createCircleChart } from '@/views/speed/case/civil/community/gridEcharts';
import { Vue3SeamlessScroll } from "vue3-seamless-scroll"

export default {
	name: "countryside",
	components: {
		Vue3SeamlessScroll
	},
	data() {
		return {
			isshow: false,
			searchKey: "",
			countrydata: [
				{
					name: "渔业村",
					img: require("@/assets/speed/case/civil/village/yyc.jpg"),
					content: "渔业村是黑龙江佳木斯市同江市街津口赫哲族乡下辖的行政村,地处街津口赫哲族乡政府所在地，距同江市区45公里，是全国人口较少少数民族之一赫哲族人的聚居地。1947年建村，是省级文明村示范村，新农村省级重点示范村、省级巾帼文明示范村。全村232户，人口447人，其中党员18名，入党积极分子9名。辖区总面积4.2万亩，耕地面积29286亩。"
				},
				{
					name: "卫明村",
					img: require("@/assets/speed/case/civil/village/wmc.jpg"),
					content: "卫明村是黑龙江佳木斯市同江市街津口乡下辖的行政村，城乡分类代码为220，为村庄。区划代码为230881204201，居民身份证号码前6位为230881。邮政编码为154000，长途电话区号为0454 ，车牌号码为黑D。卫明村与街津口村、卫垦村、卫星村、卫华村、卫国村、渔业村相邻。"
				},
				{
					name: "八岔村",
					img: require("@/assets/speed/case/civil/village/bcc.jpg"),
					content: "八岔村位于黑龙江省佳木斯市同江市东北140公里处的黑龙江南岸，八岔赫哲族乡政府所在地，由赫哲老区和赫哲新区两部分组成。北隔黑龙江与俄罗斯相望，是我国赫哲族的主要集居地之一。境内黑龙江从此流过，同抚路穿乡而过，交通便利。村域内泡泽、河流众多，有著名的“四泡一河”，八岔岛国家级自然保护区。"
				}
			],
			person: [
				{
					name: "总户数",
					num: 232,
					unit: "户"
				},
				{
					name: "总人数",
					num: 447,
					unit: "人"
				},
				{
					name: "党员",
					num: 418,
					unit: "人"
				},
				{
					name: "入党积极分子",
					num: 9,
					unit: "人"
				}
			],

			records: [
				{
					time: "2023-1-6 18:00:20",
					type: "垃圾处理",
					content: "为营造卫生舒适的生活环境，村委会组织村民对全村各处进行大扫除，清理垃圾站垃圾。"
				},
				{
					time: "2023-2-12 10:20:03",
					type: "设备维修",
					content: "由于XXXXX路口监控异常，张三师傅于2023年2月12日对该监控探头进行维修。"
				},
				{
					time: "2023-3-16 14:34:18",
					type: "设备维修",
					content: "为保证村民的消防安全，村委会与消防大队对全村消防设备进行检查维修。"
				},
				{
					time: "2023-3-28 17:52:53",
					type: "垃圾处理",
					content: "由于某某垃圾站垃圾存放过多，村委会组织相关人员对垃圾站进行清理。"
				},
				{
					time: "2023-4-2 09:43:19",
					type: "设备安装",
					content: "为了营造良好的运动环境，村部在XXXXXX广场新增多种全民健身设备。"
				},
				{
					time: "2023-4-8 15:38:11",
					type: "设备维修",
					content: "由于XX小组停电，电力公司相关人员对电力设备进行检修。"
				},
			],
			videos: [
				"http://36.152.66.51:8088/video/JKvideo1.mp4",
				"http://36.152.66.51:8088/video/JKvideo2.mp4",
				"http://36.152.66.51:8088/video/木都力巷.mp4",
				"http://36.152.66.51:8088/video/卫明村安良巷.mp4",
				// "http://36.152.66.51:8088/video/卫明村北环路.mp4",
				// "http://36.152.66.51:8088/video/秀乌路.mp4",

				// "https://dmfw.mca.gov.cn/video/640/%E6%B5%B7%E5%8D%97/%E3%80%8A%E5%B1%B1%E6%B5%B7%E6%9C%89%E5%90%8D%E3%80%8B%E7%AC%AC%E4%BA%8C%E5%AD%A3%E7%AC%AC1%E9%9B%86%E3%80%8A%E5%A4%A7%E5%B1%B1%E6%9C%89%E7%81%B5%E3%80%8B.mp4",
				// "https://dmfw.mca.gov.cn/video/640/%E6%B1%9F%E8%A5%BF/1.%E6%B1%9F%E5%8D%97%E8%A5%BF%E9%81%93%E6%80%BB%E7%AF%87%E7%AB%A0.mp4",
				// "https://dmfw.mca.gov.cn/video/640/%E6%B9%96%E5%8D%97/%E4%B8%89%E6%B9%98%E5%9C%B0%E5%90%8D%E8%A1%8C%E4%B9%8B%E9%92%9F%E7%81%B5%E6%AF%93%E7%A7%80%E9%86%89%E7%BE%8E%E9%BB%84%E6%A1%91.mp4",
				// "https://dmfw.mca.gov.cn/video/640/%E6%B5%99%E6%B1%9F/%E3%80%8A%E5%9C%B0%E5%90%8D%E9%87%8C%E7%9A%84%E4%B9%A1%E6%84%81%E3%80%8B%E6%B8%A9%E5%B2%AD%E5%B8%82%E5%B3%A8%E5%B5%8B%E5%B1%B1%E6%9D%91.mp4"
			],
			POI: [
				{
					id: "df9dd33d-ee07-4691-83a1-a46469369629",
					img: require("@/assets/speed/case/civil/POI/dm/cmwyh.png"),
					"名称": "卫明村民委员会",
					"地址": "外环路与乌日贡大街交叉路口西侧",
					"电话": "134****5573",
					"X坐标": 132.840251,
					"Y坐标": 47.936275,
					"高度": 69,
					"备注": null
				},
				{
					id: "6c5bc206-5028-4911-b393-67f908a68792",
					img: require("@/assets/speed/case/civil/POI/dm/cmwyh.png"),
					"名称": "渔业村村民委员会",
					"地址": "街津口赫哲族乡渔业村",
					"电话": "134****1122",
					"X坐标": 132.835415,
					"Y坐标": 47.936829,
					"高度": 58,
					"备注": "1984年因赫哲族生计而命名渔业村。赫哲族以打鱼为生。1963年成立赫哲族人民公社，属抚远县管辖。 1984年3月为街津口乡赫哲族村，归属街津口乡。现改名渔业村，名称沿用至今。"
				},
				{
					id: "4c1231f6-0f3a-40e9-af92-083cd2ea8d7d",
					img: require("@/assets/speed/case/civil/POI/dm/zf.png"),
					"名称": "街津口赫哲族乡人民政府",
					"地址": "同江市外环路街津口赫哲族乡政府",
					"电话": "134****1110",
					"X坐标": 132.840493,
					"Y坐标": 47.932924,
					"高度": 61,
					"备注": null
				},
				{
					id: "fb81be7b-daad-4dfd-b8f9-c3c4bf62d2c6",
					img: require("@/assets/speed/case/civil/POI/dm/pcs.png"),
					"名称": "街津口边防派出所",
					"地址": "街津口赫哲族乡人民政府西南侧",
					"电话": "134****1133",
					"X坐标": 132.839911,
					"Y坐标": 47.932826,
					"高度": 72,
					"备注": null
				},
				{
					id: "fb70d2e0-78f3-486a-96de-7750457e259a",
					img: require("@/assets/speed/case/civil/POI/dm/sfj.png"),
					"名称": "同江市司法局(街津口司法所)",
					"地址": "街津口赫哲族乡人民政府",
					"电话": "134****2233",
					"X坐标": 132.840312,
					"Y坐标": 47.93319,
					"高度": 72,
					"备注": null
				},
				{
					id: "87cef3fd-260e-46a9-b639-d12eccd64430",
					img: require("@/assets/speed/case/civil/POI/dm/ldbzsws.png"),
					"名称": "街津口乡劳动保障事务所",
					"地址": "街津口赫哲族乡人民政府",
					"电话": "134****3344",
					"X坐标": 132.840493,
					"Y坐标": 47.933230,
					"高度": 72,
					"备注": null
				},
				{
					id: "902512e6-01d4-4bea-91af-d12252e34452",
					img: require("@/assets/speed/case/civil/POI/dm/yz.png"),
					"名称": "中国邮政(街津口邮政支局) ",
					"地址": "外环路与乌日贡大街交叉口西北方向150米",
					"电话": "(0454)2985118",
					"X坐标": 132.841568,
					"Y坐标": 47.933034,
					"高度": 67,
					"备注": null
				},
				{
					id: "aad10da6-1beb-4a35-9bf6-3274f103e0f4",
					img: require("@/assets/speed/case/civil/POI/dm/bwg.png"),
					"名称": "赫哲族历史博物馆",
					"地址": "外环路街津口边防派出所西侧约170米",
					"电话": "13512637111",
					"X坐标": 132.838063,
					"Y坐标": 47.933053,
					"高度": 64,
					"备注": null
				},
				{
					id: "1bec8370-1f58-431d-b2dd-e1deea3fc7e3",
					img: require("@/assets/speed/case/civil/POI/dm/xx.png"),
					"名称": "街津口中心学校",
					"地址": "赫哲族乡人民政府东侧约140米",
					"电话": "134****5566",
					"X坐标": 132.843116,
					"Y坐标": 47.933525,
					"高度": 63,
					"备注": null
				},
				{
					id: "a0c6df6d-fc5a-440d-8572-a13b52d35940",
					img: require("@/assets/speed/case/civil/POI/dm/fd.png"),
					"名称": "街珒口饭店",
					"地址": "赫哲族乡人民政府东侧约120米",
					"电话": "15245628188",
					"X坐标": 132.841915,
					"Y坐标": 47.932675,
					"高度": 66,
					"备注": null
				},
				// {
				// 	id: "13a20dfe-471a-4386-99cf-dc9c21766787",
				// 	img: require("@/assets/speed/case/civil/POI/dm/bhsd.png"),
				// 	"名称": "通达百货商店",
				// 	"地址": "赫哲族乡人民政府东北侧约110米",
				// 	"电话": "(0454)2985288",
				// 	"X坐标": 132.84105,
				// 	"Y坐标": 47.934197,
				// 	"高度": 65,
				// 	"备注": null
				// },
				// {
				// 	id: "361c1fa3-a64b-4e3a-917b-2b5fe9bb811a",
				// 	img: require("@/assets/speed/case/civil/POI/dm/wsy.png"),
				// 	"名称": "街津口卫生院",
				// 	"地址": "街津口乡卫明村",
				// 	"电话": "(0454)2985016",
				// 	"X坐标": 132.840764,
				// 	"Y坐标": 47.935421,
				// 	"高度": 60,
				// 	"备注": null
				// },
				{
					id: "c8382925-17d6-4ad9-914c-7199de16734d",
					img: require("@/assets/speed/case/civil/POI/dm/hzyph.png"),
					"名称": "赫哲鱼皮画",
					"地址": "赫哲族乡人民政府北侧约160米",
					"电话": "134****6677",
					"X坐标": 132.840583,
					"Y坐标": 47.934844,
					"高度": 69,
					"备注": null
				},
				{
					id: "C803BE43-D01F-4EBC-9233-1A27565C7896",
					img: require("@/assets/speed/case/civil/POI/dm/jyz.png"),
					"名称": "街津山加油站(八街线站)",
					"地址": "街津口客运站西北侧约100米",
					"电话": "134****7788",
					"X坐标": 132.842953,
					"Y坐标": 47.931728,
					"高度": 62,
					"备注": null
				},
				{
					id: "a180381a-6949-4c09-83f3-a9cfa5bb2113",
					img: require("@/assets/speed/case/civil/POI/dm/qcz.png"),
					"名称": "街津口客运站",
					"地址": "八街线北段",
					"电话": "134****8899",
					"X坐标": 132.843651,
					"Y坐标": 47.931005,
					"高度": 63,
					"备注": null
				},
				{
					id: "7af98348-2654-434e-bc05-4f68f3f19ec4",
					img: require("@/assets/speed/case/civil/POI/dm/lydjq.png"),
					"名称": "同江市街津口赫哲族旅游度假区",
					"地址": "同江市区东北45公里处",
					"电话": "134****8899",
					"X坐标": 132.835278,
					"Y坐标": 47.938056,
					"高度": 65,
					"备注": "街津口赫哲族旅游度假区位于同江市区东北45公里处，是我国民族大家庭中六小民族之一的赫哲族聚居地。景区建有赫哲民族文化村和钓鱼台两大景点，在这里既能体会浓郁古朴的赫哲风情，又能领略松花江、黑龙江两江汇聚于此的磅礴气势。景区内有钓鱼台、赫哲族博物馆、黑龙江渔类展览馆、别亚湾公园、抗日战壕、得勒乞民俗休闲体验度假区等名胜古迹和自然风光，还可以欣赏精彩的民俗演出。"
				},
				{
					id: "C16C731E-79C5-7773-E588-073EF7AB09F8",
					img: require("@/assets/speed/case/civil/POI/dm/jd.png"),
					"名称": "赫哲渔家酒店",
					"地址": "赫哲族乡人民政府北侧约190米",
					"电话": "18645438237",
					"X坐标": 132.841168,
					"Y坐标": 47.933938,
					"高度": 65,
					"备注": null
				},
			],
			GGSS: [
				{
					"编号": "YYC008",
					"类型": "监控",
					"地址": "乌日贡大街18号",
					"负责人": "李明",
					"状态": "正常",
					"归属": "街津口赫哲族乡人民政府",
					"朝向": "西北",
					"型号": "海康威视DS-2CC1185P",
					"X坐标": 132.841974,
					"Y坐标": 47.932854,
					"高度": 69,
					"备注": null,
					num: 6,
					img: require("@/assets/speed/case/civil/POI/defalut/jk.png"),
					icon: require("@/assets/speed/case/civil/POI/icon/jk.png"),
					check: false,
					coverImg: require("@/assets/speed/case/civil/POI/cover/jk.png"),
					checkImg: require("@/assets/speed/case/civil/POI/check/jk.png"),
				},
				{
					"编号": "YYC009",
					"类型": "路灯",
					"地址": "乌日贡大街69号",
					"状态": "异常",
					"归属": "街津口赫哲族乡人民政府",
					"负责人": "李明",
					"电话": "134********",
					"X坐标": 132.842387,
					"Y坐标": 47.93214,
					"高度": 70,
					"备注": null,
					num: 21,
					img: require("@/assets/speed/case/civil/POI/defalut/ld.png"),
					icon: require("@/assets/speed/case/civil/POI/icon/ld.png"),
					check: false,
					coverImg: require("@/assets/speed/case/civil/POI/cover/ld.png"),
					checkImg: require("@/assets/speed/case/civil/POI/check/ld.png"),
				},
				{
					"编号": "YYC007",
					"类型": "公厕",
					"地址": "乌日贡大街28号",
					"状态": "正常",
					"归属": "街津口赫哲族乡人民政府",
					"负责人": "王五",
					"电话": "134********",
					"X坐标": 132.835458,
					"Y坐标": 47.937593,
					"高度": 66,
					"备注": null,
					num: 2,
					img: require("@/assets/speed/case/civil/POI/defalut/gc.png"),
					icon: require("@/assets/speed/case/civil/POI/icon/gc.png"),
					check: false,
					coverImg: require("@/assets/speed/case/civil/POI/cover/gc.png"),
					checkImg: require("@/assets/speed/case/civil/POI/check/gc.png"),
				},
				{
					"编号": "YYC004",
					"类型": "体育设施",
					"地址": "乌日贡大街45号",
					"状态": "正常",
					"归属": "街津口赫哲族乡人民政府",
					"负责人": "李四",
					"电话": "134********",
					"X坐标": 132.845895,
					"Y坐标": 47.934869,
					"高度": 68,
					"备注": null,
					num: 9,
					img: require("@/assets/speed/case/civil/POI/defalut/tyss.png"),
					icon: require("@/assets/speed/case/civil/POI/icon/tyss.png"),
					check: false,
					coverImg: require("@/assets/speed/case/civil/POI/cover/tyss.png"),
					checkImg: require("@/assets/speed/case/civil/POI/check/tyss.png"),
				},
				{
					"编号": "YYC005",
					"类型": "停车场",
					"地址": "乌日贡大街23号",
					"状态": "正常",
					"归属": "街津口赫哲族乡人民政府",
					"负责人": "李四",
					"电话": "134********",
					"X坐标": 132.840398,
					"Y坐标": 47.931631,
					"高度": 63,
					"备注": null,
					num: 1,
					img: require("@/assets/speed/case/civil/POI/defalut/tcc.png"),
					icon: require("@/assets/speed/case/civil/POI/icon/tcc.png"),
					coverImg: require("@/assets/speed/case/civil/POI/cover/tcc.png"),
					checkImg: require("@/assets/speed/case/civil/POI/check/tcc.png"),
					check: false,
				},
				{
					"编号": "YYC006",
					"类型": "垃圾站",
					"地址": "乌日贡大街76号",
					"状态": "正常",
					"归属": "街津口赫哲族乡人民政府",
					"负责人": "王五",
					"电话": "134********",
					"X坐标": 132.848084,
					"Y坐标": 47.937732,
					"高度": 68,
					"备注": null,
					num: 1,
					img: require("@/assets/speed/case/civil/POI/defalut/ljz.png"),
					icon: require("@/assets/speed/case/civil/POI/icon/ljz.png"),
					coverImg: require("@/assets/speed/case/civil/POI/cover/ljz.png"),
					checkImg: require("@/assets/speed/case/civil/POI/check/ljz.png"),
					check: false,
				},
				{
					"编号": "YYC003",
					"类型": "活动室",
					"地址": "乌日贡大街13号",
					"状态": "正常",
					"归属": "街津口赫哲族乡人民政府",
					"负责人": "张三",
					"电话": "134********",
					"X坐标": 132.840406,
					"Y坐标": 47.936359,
					"高度": 66,
					"备注": null,
					num: 2,
					img: require("@/assets/speed/case/civil/POI/defalut/hds.png"),
					icon: require("@/assets/speed/case/civil/POI/icon/hds.png"),
					coverImg: require("@/assets/speed/case/civil/POI/cover/hds.png"),
					checkImg: require("@/assets/speed/case/civil/POI/check/hds.png"),
					check: false,
				},
				// {
				// 	"编号": "YYC001",
				// 	"类型": "文化站",
				// 	"地址": "乌日贡大街1号",
				// 	"状态": "正常",
				// 	"归属": "街津口赫哲族乡人民政府",
				// 	"负责人": "张三",
				// 	"X坐标": 132.843742,
				// 	"Y坐标": 47.933833,
				// 	"高度": 69,
				// 	"备注": null,
				// 	num: 1,
				// 	img: require("@/assets/speed/case/civil/POI/defalut/whz.png"),
				// 	icon: require("@/assets/speed/case/civil/POI/icon/whz.png"),
				// 	coverImg: require("@/assets/speed/case/civil/POI/cover/whz.png"),
				// 	checkImg: require("@/assets/speed/case/civil/POI/check/whz.png"),
				// 	check: false,
				// },
				// {
				// 	"编号": "YYC002",
				// 	"类型": "广播站",
				// 	"地址": "乌日贡大街XXX号",
				// 	"状态": "正常",
				// 	"归属": "街津口赫哲族乡人民政府",
				// 	"负责人": "张三",
				// 	"X坐标": 132.836305,
				// 	"Y坐标": 47.937233,
				// 	"高度": 68,
				// 	"备注": null,
				// 	num: 1,
				// 	img: require("@/assets/speed/case/civil/POI/defalut/gbz.png"),
				// 	icon: require("@/assets/speed/case/civil/POI/icon/gbz.png"),
				// 	coverImg: require("@/assets/speed/case/civil/POI/cover/gbz.png"),
				// 	checkImg: require("@/assets/speed/case/civil/POI/check/gbz.png"),
				// 	check: false,
				// },
				{
					"编号": "CS001",
					"类型": "超市",
					"名称": "通达百货商店",
					"地址": "赫哲族乡人民政府东北侧约110米",
					"状态": "正常",
					"负责人": "张三",
					"电话": "(0454)2985288",
					"X坐标": 132.84105,
					"Y坐标": 47.934197,
					"高度": 65,
					"备注": null,
					img: require("@/assets/speed/case/civil/POI/defalut/shop.png"),
					icon: require("@/assets/speed/case/civil/POI/icon/shop.png"),
				},
				{
					"编号": "WSY001",
					"类型": "卫生院",
					"名称": "街津口卫生院",
					"地址": "街津口乡卫明村",
					"状态": "正常",
					"负责人": "王五",
					"电话": "(0454)2985016",
					"X坐标": 132.840764,
					"Y坐标": 47.935421,
					"高度": 63,
					"备注": null,
					img: require("@/assets/speed/case/civil/POI/defalut/wsy.png"),
					icon: require("@/assets/speed/case/civil/POI/icon/wsy.png"),

				},
			],
			searchPOIData: [],
			HNZN: [
				{
					id: 1,
					type: "快递物流",
					num: 3,
					icon: require("@/assets/speed/case/civil/POI/icon/kd.png"),
					mapicon: require("@/assets/speed/case/civil/POI/defalut/kdd.png"),
					check: false,
					data: [
						{
							id: "E77C6B8D-B6F8-4CCC-9426-5C0F9AD2C784",
							"名称": "邮政快递",
							"地址": "乌日贡大街渔猎人家酒店东南侧150米",
							"电话": "(0454)2985118",
							"X坐标": 132.841625,
							"Y坐标": 47.932939,
							"高度": 67,
							"备注": null
						},
						{
							id: "F7A4EAE0-63FC-4F52-9540-3CBF402D403A",
							"名称": "中通快递",
							"地址": "乌日贡大街XXXXX号",
							"电话": "138****1122",
							"X坐标": 132.842987,
							"Y坐标": 47.935425,
							"高度": 62,
							"备注": null
						},
						{
							id: "05B595EF-ABDA-468C-9204-1C5EAB647BE8",
							"名称": "韵达快递",
							"地址": "乌日贡大街XXXXX号",
							"电话": "139****2345",
							"X坐标": 132.845808,
							"Y坐标": 47.932939,
							"高度": 65,
							"备注": null
						},
					]
				},
				{
					id: 2,
					type: "农家乐",
					num: 5,
					icon: require("@/assets/speed/case/civil/POI/icon/njl.png"),
					mapicon: require("@/assets/speed/case/civil/POI/defalut/njl.png"),
					check: false,
					data: [
						{
							id: "FEA2A8B9-9F38-448C-8F1C-CD35D07C7066",
							"名称": "赫乡民族饭店",
							"地址": "同江市乌日贡大街乡政府旁",
							"电话": "184****2939",
							"X坐标": 132.841625,
							"Y坐标": 47.933221,
							"高度": 71,
							"备注": null
						},
						{
							id: "6D665EA6-19A3-4CE1-8748-3FD17FC29B43",
							"名称": "小把头鱼馆",
							"地址": "乌日贡大街XXXXXXX",
							"电话": "192****3637",
							"X坐标": 132.841798,
							"Y坐标": 47.933775,
							"高度": 66,
							"备注": null
						},
						{
							id: "356269E1-28DD-4B69-BC80-1CF95135552B",
							"名称": "家乡鱼馆",
							"地址": "同江市外环路XXXXX",
							"电话": "139****1283",
							"X坐标": 132.840851,
							"Y坐标": 47.931713,
							"高度": 65,
							"备注": null
						},
						{
							id: "4FC03568-710B-466F-BB47-FCDB87E22142",
							"名称": "额真江鱼馆",
							"地址": "乌日贡大街XXXXXXX",
							"电话": "187****2222",
							"X坐标": 132.841305,
							"Y坐标": 47.933732,
							"高度": 66,
							"备注": null
						},
						{
							id: "A6DB1CE0-334D-4104-A24A-B6824BBAC058",
							"名称": "旺江鸿鱼村",
							"地址": "同江市街津口赫哲族乡",
							"电话": "15845193131",
							"X坐标": 132.836693,
							"Y坐标": 47.937348,
							"高度": 58,
							"备注": null
						},
					]
				},
				{
					id: 3,
					type: "养殖基地",
					num: 1,
					icon: require("@/assets/speed/case/civil/POI/icon/yzjd.png"),
					mapicon: require("@/assets/speed/case/civil/POI/defalut/yzjd.png"),
					check: false,
					data: [
						{
							id: "072F0CC2-D57E-4BEA-AD9A-26DAF9CF1496",
							"名称": "同江市鲟鳇鱼放流站",
							"地址": "同江市秀乌路",
							"电话": "1843****2839",
							"X坐标": 132.834332,
							"Y坐标": 47.936591,
							"高度": 58,
							"备注": null
						}
					]
				},
				{
					id: 4,
					type: "农业合作社",
					num: 3,
					icon: require("@/assets/speed/case/civil/POI/icon/nyhzs.png"),
					mapicon: require("@/assets/speed/case/civil/POI/defalut/nyhzs.png"),
					check: false,
					data: [
						{
							id: "A8F1EBB7-123B-4557-B166-3E89AB5CC293",
							"名称": "街津口渔业村农机作业合作社",
							"地址": "外环路北50米",
							"电话": "1594659***",
							"X坐标": 132.835878,
							"Y坐标": 47.937012,
							"高度": 58,
							"备注": null
						},
						{
							id: "B0207A15-2F3D-477B-9F06-F4B2E4457C76",
							"名称": "中国供销合作社",
							"地址": "乌日贡大街XXXXXXX",
							"电话": "138****2839",
							"X坐标": 132.841578,
							"Y坐标": 47.93332,
							"高度": 67,
							"备注": null
						},
						{
							id: "DE5348D8-61B4-4861-B03C-751BD23F6236",
							"名称": "同江市绿农现代农机专业合作社",
							"地址": "同江市街津口赫哲族乡",
							"电话": "0454-291****",
							"X坐标": 132.840874,
							"Y坐标": 47.934918,
							"高度": 61,
							"备注": null
						},
					]
				},
			]

		}
	},

	created() {
	},

	mounted() {
		this.searchPOIData = this.POI
		this.$emit('loadYYCModel',
			{
				name: "渔业村",
				modelUrl: ModelInfo.yuyecun,
				alt: -15.00,
				// isDTH: true,
				// dthUrl: ModelInfo.YYC
			}
		)
		this.createChart()
		this.loadPOIData()
		// this.loadGGSSData()
		this.$emit('loadGGSSData', this.GGSS,false)
	},
	methods: {
		loadHNZNData(type) {
			let znData = this.HNZN.find(itm => itm.type === type)
			let check = znData.check
			if (!check) {
				this.$emit('loadHNZNData', znData)
			} else {
				this.$emit('removeHNZNData', znData)
			}

			this.HNZN.find(itm => itm.type === type).check = !znData.check

		},
		setShow() {
			this.isshow = !this.isshow
		},
		searchPOIFn() {
			if (this.searchKey == "") {
				this.searchPOIData = this.POI
			}
			this.searchPOIData = this.POI.filter(item => item.名称.includes(this.searchKey));

		},
		createChart() {
			let optionData = [
				{ name: '正常', value: 70 },
				{ name: '维修中', value: 6 },
				{ name: '异常', value: 13 }
			]
			createCircleChart(optionData, this.$refs['chartSSZT']);
		},
		loadPOIData() {
			this.$emit('loadPOIData', this.POI)
		},
		loadGGSSData(value) {
			let ggssDatas = this.GGSS.filter((i) => i.类型 == value);
			if (ggssDatas!=undefined && ggssDatas.length > 0) {
				let check = ggssDatas[0].check
				if (!check) {
					this.$emit('loadGGSSData', ggssDatas,true)
				} else {
					//this.$emit('removeGGSSData', ggssDatas)

					this.$emit('closeGGSSPuop')
				}
				this.GGSS.find(itm => itm.类型 === value).check = !check
			}

		},
		zoomTo(value) {
			this.$emit('zoomToGGSS', value)
		},
		zoomToPOI(value) {
			this.$emit('zoomToPOI', value)
		}
	}
};
</script>

<style scoped>
.searchBtn {
	position: absolute;
	left: 20%;
	top: 13%;
	z-index: 5;
	border: rgb(53 167 255 / 65%) 1px solid;
	border-radius: 6px;
	width: 40px;
	height: 40px;
	background: url("@/assets/speed/case/civil/searchicon.png") no-repeat;
	background-size: 70% 70%;
	background-position: 50% 50%;
	background-color: rgb(29 70 126 / 70%);
}

.searchDialog {
	position: absolute;
	top: 13%;
	left: 20%;
	z-index: 5;
	width: 18%;
	height: 50%;
	background: url("@/assets/speed/case/civil/broadside.png") no-repeat;
	background-size: 100% 100%;
	padding: 0.5%;
	transition: all 1s;
	transform: translateX(-215%);
}

.searchDialog[panelVisible="true"] {
	transform: translateX(0);
	opacity: 1;
}

.searchClose {
	float: right;
	cursor: pointer;
	color: #fff;
	font-size: 15px;
	width: 15px;
	height: 15px;
}

.search {
	width: 94%;
	height: 8%;
	overflow: hidden;
	display: flex;
	justify-content: flex-start;
	border: 1px solid rgba(70, 146, 255, 0.8);
	background: rgb(7 26 54 / 50%);
	margin-top: 7%;
	position: absolute;
}

.searchIpt {
	border: none;
	background: none;
	height: 100%;
	outline: none;
	padding-left: 10px;
	flex-grow: 1;
	font-size: 15px;
	color: white;
}

.searchButton {
	height: 100%;
	width: 55px;
	font-size: 14px;
	background: rgba(0, 138, 255, .5);
	border: none;
	padding-left: 10px;
	padding-right: 10px;
	color: #fff;
}

.search_result {
	/* position: absolute; */
	width: 100%;
	height: 85%;
	margin-top: 20%;
	border: 1px solid rgb(28 61 99);
	border-radius: 5px;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 1%;
}

.search_content {
	width: 100%;
	height: 13%;
	background: url("@/assets/speed/case/civil/list.png") no-repeat;
	background-size: 100% 100%;
	margin-top: 0.5%;
	padding-top: 1.5%;

}

.search_content:hover {
	transform: scale(1.05);
	cursor: pointer;
}

.search_name {
	text-align: left;
	height: 55%;
	text-indent: 10%;
	font-size: 15px;
	color: rgb(5 232 254 / 70%);
	font-weight: 400;
	text-shadow: -2px 0px 8px 2px rgba(9, 35, 81, 0.9);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	/*文本不换行*/

}

.search_address {
	color: white;
	text-align: left;
	text-indent: 10%;
	font-size: 10px;
	margin-top: -1%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	/*文本不换行*/
}


.countryside-left {
	width: 18%;
	height: 88%;
	position: absolute;
	z-index: 5;
	top: 9%;
	left: 0.8%;
}

.countryside-right {
	width: 18%;
	height: 88%;
	position: absolute;
	z-index: 5;
	top: 9%;
	right: 0.8%;
}

.xcjx {
	width: 100%;
	height: 38%;
	margin-bottom: 3%;
}

.xcjx_title {
	position: absolute;
	background: url("@/assets/speed/case/civil/xcjx_title.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 4.5%;
}

.xcjx_back {
	background: url("@/assets/speed/case/civil/xcjx_content.png") no-repeat;
	background-size: 100% 100%;
	padding: 3%;
	padding-top: 13%;
	position: absolute;
	width: 100%;
	height: 38%;
}


.el-carousel {
	position: absolute;
	width: 94%;
	height: 82%;
}

::v-deep .el-carousel__container {
	position: relative;
	height: 100%;
}

::v-deep .el-carousel__item {
	height: 90%;
}

.xcjx_img {
	position: absolute;
	width: 100%;
	height: 48%;
}

.xcjx_content {
	position: absolute;
	width: 100%;
	height: 50%;
	font-size: 12px;
	font-weight: 500;
	text-align: left;
	color: #ffffff;
	line-height: 20px;
	letter-spacing: 0.24px;
	overflow: hidden;
	text-overflow: ellipsis;
	bottom: 0%;
	padding-left: 1%;
	padding-right: 1%;
	text-indent: 24px;
}

.hnzn,
.rygk {
	width: 100%;
	height: 27%;
	margin-bottom: 3%;
}

.hnzn_title {
	position: absolute;
	background: url("@/assets/speed/case/civil/hnzn.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 4.5%;
}

.rygk_title {
	position: absolute;
	background: url("@/assets/speed/case/civil/rygk_title.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 4.5%;
}

.hnzn_back,
.rygk_back {
	background: url("@/assets/speed/case/civil/rygk_content.png") no-repeat;
	background-size: 100% 100%;
	padding: 8%;
	padding-top: 15%;
	position: absolute;
	width: 100%;
	height: 27%;
	display: flex;
}

.hnzn_content,
.rygk_content {
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	gap: 25px;
}

.hnzn_item,
.rygk_item {
	background: url("@/assets/speed/case/civil/gk_bg.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 100%;
	display: flex;
	/* flex-direction: column; */
	font-weight: 400;
	font-size: 14px;
	color: #ffffff;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	cursor: pointer;
}

.hnzn_item_Active {
	background: url("@/assets/speed/case/civil/gk_bg_check.png") no-repeat;
	background-size: 100% 100%;
}

.hnzn_num,
.rygk_num {
	display: flex;
	align-items: center;
	justify-content: center;
}

.hnzn_font,
.rygk_font {
	font-size: 16px;
	font-weight: 700;
	color: #05E8FE;
}

.ssjk {
	margin-bottom: 3%;
	height: 31%;
}

.ssjk_title {
	position: absolute;
	background: url("@/assets/speed/case/civil/ssjk_title.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 4.5%;
}

.ssjk_back {
	background: url("@/assets/speed/case/civil/ssjk_content.png") no-repeat;
	background-size: 100% 100%;
	padding: 5%;
	padding-top: 15%;
	position: absolute;
	width: 100%;
	height: 31%;
	display: flex;
}

.ssjk_content {
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1rf 1fr;
	gap: 5px;
}

.ssjk_item {
	height: 98%;
	width: 100%;
	background-image: url("@/assets/speed/case/civil/gk_bg.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	padding: 4%;
}

.ssjk_vidio {
	position: absolute;
	height: 30%;
	width: 41%;
}

.ggss {
	width: 100%;
	height: 24%;
	margin-bottom: 3%;
}

.ggss_title {
	position: absolute;
	background: url("@/assets/speed/case/civil/ggss_title.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 4.5%;
}

.ggss_content {
	background: url("@/assets/speed/case/civil/ggss_content.png") no-repeat;
	background-size: 100% 100%;
	padding: 3%;
	padding-top: 10%;
	position: absolute;
	width: 100%;
	height: 24%;

}

.ggss_public {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.ggss_item {
	background: url("@/assets/speed/case/civil/gk_bg.png") no-repeat;
	background-size: 100% 100%;
	color: white;
	width: 31%;
	height: 36px;
	display: flex;
	align-items: center;
	font-size: 14px;
	font-weight: 500;
	justify-content: space-around;
	margin-top: 4%;
	border-bottom: 1px solid #1fe2f8;
	cursor: pointer;
}

.ggss_item_Active {
	border-bottom: 1px solid #f4f81f;
}

.sszt {
	width: 100%;
	height: 35%;
	margin-bottom: 3%;
}

.sszt_title {
	position: absolute;
	background: url("@/assets/speed/case/civil/sszt_title.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 4.5%;
}

.sszt_content {
	background: url("@/assets/speed/case/civil/sszt_content.png") no-repeat;
	background-size: 100% 100%;
	padding: 3%;
	padding-top: 13%;
	position: absolute;
	width: 100%;
	height: 35%;
}

.ywjl {
	width: 100%;
	height: 37%;
	margin-bottom: 3%;
}

.ywjl_title {
	position: absolute;
	background: url("@/assets/speed/case/civil/ywjl_title.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 4.5%;
}

.ywjl_content {
	background: url("@/assets/speed/case/civil/ywjl_content.png") no-repeat;
	background-size: 100% 100%;
	padding: 3%;
	padding-top: 13%;
	position: absolute;
	width: 100%;
	height: 37%;
}

.sszt_chart {
	width: 100%;
	height: 100%;
	padding: 2%;
}

.ywjl_back {
	width: 100%;
	height: 100%;
	overflow-y: scroll;
}

.ywjlLst {
	margin: 2% 0;
	color: white;
}

.ywjl_info {
	background: url("@/assets/speed/case/civil/wgyback.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	padding: 3%;
	height: 100%;

}

.ywjl_record {
	background: linear-gradient(to right, rgba(36, 201, 255, 0.5) 0%, rgba(36, 201, 255, .2) 50%, rgba(36, 201, 255, 0) 100%);
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-left: 5%;
	padding-right: 35%;
}

.ywjl_type {
	font-weight: 700;
	color: #d7aa67;
	overflow: hidden;

}

.ywjl_time {
	color: white;
	font-weight: 700;
}
</style>
