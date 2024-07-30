<template>
	<div class="community-left">
		<div class="jbxx">
			<el-image class="jbxx_img" :src="require('@/assets/speed/case/civil/community.png')" fit="contain" />
			<div class="content_jbxx">
				<div class="content_jbxx_title">新城社区基本信息</div>
				<div class="content_jbxx_intr">
					新城社区是黑龙江佳木斯市郊区红旗街道下辖的社区，城乡分类代码为112，为城乡结合区。区划代码为230811004005，居民身份证号码前6位为230811。邮政编码为154000，长途电话区号为0454
					，车牌号码为黑D。新城社区与冬梅社区、红旗社区、北焦化社区、清源社区、新府社区相邻。
					新城社区附近有佳木斯烈士陵园、卧佛山滑雪场、敖其湾影视基地、杏花谷、西浦森林公园、前董家子古山寨等旅游景点，有佳木斯大豆、佳木斯大米、脱毒种薯、万兴村番茄、佳木斯甜菜、山丁子等特产，有敖其嫁令阔、赫哲族剪纸、赫哲族说胡力、赫哲族鹿神舞、赫哲族婚俗等民俗文化。
				</div>
			</div>
		</div>
		<div class="wgyxx">
			<el-checkbox class="grid_show" @change="loadGridData">显示网格</el-checkbox>
			<div class="wgyxx_content">
				<!-- <div class="gridLst" v-for="(item, index) in gridmans" :key="index">
					<div class="image" :style="{ backgroundImage: `url(${item.url})` }"></div>
					<div class="grid_info">
						<div class="gridMan">{{ "网格" + item.gridNo + "-" + item.name }}</div>
						<div class="gridman_info">
							<el-image class="grid_icon" :src='require("@/assets/speed/case/civil/tel.png")' />
							<div class="tel">{{ item.tel }}</div>
						</div>
						<div class="gridman_info">
							<el-image class="grid_icon" :src='require("@/assets/speed/case/civil/gxq.png")' />
							<div class="area">{{ item.buildings }}</div>
						</div>

					</div>
				</div> -->
				<Vue3SeamlessScroll class="scroll_box" hover-stop="true" :list="gridmans" hover="true" step="0.3"
					singleHeight="94.8" waitTime="6000">
					<div class="gridLst" v-for="(item, index) in gridmans" :key="index">
						<div class="image" :style="{ backgroundImage: `url(${item.url})` }"></div>
						<div class="grid_info">
							<div class="gridMan">{{ "网格" + item.gridNo + "-" + item.name }}</div>
							<div class="gridman_info">
								<el-image class="grid_icon" :src='require("@/assets/speed/case/civil/tel.png")' />
								<div class="tel">{{ item.tel }}</div>
							</div>
							<div class="gridman_info">
								<el-image class="grid_icon" :src='require("@/assets/speed/case/civil/gxq.png")' />
								<div class="area">{{ item.buildings }}</div>
							</div>

						</div>
					</div>
				</Vue3SeamlessScroll>
			</div>
		</div>
		<div class="zbts">
			<div class="zbts_content">
				<div class="zbts_info" @click="loadYLData('医疗')">
					<el-image class="zbts_img"
						:src="check1 ? require('@/assets/speed/case/civil/yl-c.png') : require('@/assets/speed/case/civil/yl.png')" />
					<el-checkbox class="zbts_typex" @change="loadRangeData"> 医疗</el-checkbox>
				</div>
				<div class="zbts_info" @click="loadYLData('教育')">
					<el-image class="zbts_img"
						:src="check2 ? require('@/assets/speed/case/civil/jy-c.png') : require('@/assets/speed/case/civil/jy.png')" />
					<div class="zbts_type"> 教育</div>
				</div>
				<div class="zbts_info" @click="loadYLData('消防')">
					<el-image class="zbts_img"
						:src="check3 ? require('@/assets/speed/case/civil/xf-c.png') : require('@/assets/speed/case/civil/xf.png')" />
					<div class="zbts_type"> 消防</div>
				</div>
			</div>
			<div class="zbts_content">
				<div class="zbts_info" @click="loadYLData('供水')">
					<el-image class="zbts_img"
						:src="check4 ? require('@/assets/speed/case/civil/gs-c.png') : require('@/assets/speed/case/civil/gs.png')" />
					<div class="zbts_type"> 供水</div>
				</div>
				<div class="zbts_info" @click="loadYLData('供电')">
					<el-image class="zbts_img"
						:src="check5 ? require('@/assets/speed/case/civil/gd-c.png') : require('@/assets/speed/case/civil/gd.png')" />
					<div class="zbts_type"> 供电</div>
				</div>
				<div class="zbts_info" @click="loadYLData('快递')">
					<el-image class="zbts_img"
						:src="check6 ? require('@/assets/speed/case/civil/kd-c.png') : require('@/assets/speed/case/civil/kd.png')" />
					<div class="zbts_type"> 快递</div>
				</div>
			</div>


		</div>
	</div>

	<div class="search_dm">
		<el-button class="searchBtn1" title="搜索" @click="setShow" v-show="!isshow">
		</el-button>
		<div class="search_key" v-show="isshow">
			<el-input class="search_content" placeholder="请输入户主姓名" v-model="search_room"
				@keyup.enter.native="searchData()"></el-input>
			<el-button class="search_btn" @click="searchData"></el-button>
		</div>
	</div>

	<div class="community-right">
		<div class="nlkd" ref="chartNLKD"></div>
		<div class="rkxz" ref="chartRKXZ"></div>
		<!-- <div class="xbfb" ref="chartXBFB"></div> -->

		<div class="wgsj">
			<div class="wgsj_back" ref="chartWGSJ"></div>
			<div class="wgsj_title"></div>
		</div>

	</div>

	<div class="community-bottom">
		<div class="community-info">
			<el-card class="streetname">
				<div class="monitor-list">
					<!-- 左边按钮 -->
					<div class="btn" @click="scrollLeft">
						<el-image :src='require("@/assets/speed/case/civil/leftarrow.png")' />
					</div>
					<!-- 中间列表 -->
					<div id="list-box" class="list-box">
						<div id="list" class="list">
							<div class="list-item" v-for="(item, index) in communityLst" :key="index"
								:style="item.status == 1 ? 'color: #05E8FE' : 'color: #ffffff'">
								{{ item.name }}
							</div>
						</div>
					</div>
					<!-- 右边按钮 -->
					<div class="btn" @click="scrollRight">
						<el-image :src='require("@/assets/speed/case/civil/rightarrow.png")' />
					</div>
				</div>
			</el-card>
		</div>


		<div class="community-street">
			<el-dropdown trigger="click" @command="statusChange">
				<span class="el-dropdown-link">{{ selectStreet }}</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item v-for="(item, index) in streetData" :key="index" :command="item.label"
							:disabled="item.disabled">
							{{ item.label }}
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
import { createBarChart, createPieChart, createLineChart, create3DPieChart, createWGSJPieChart } from '@/views/speed/case/civil/community/gridEcharts';
import ModelInfo from '@/utils/modelInfo'
import { Vue3SeamlessScroll } from "vue3-seamless-scroll"

export default {
	name: "civilMap",
	data() {
		return {
			isshow: false,
			gridmans: [
				{
					gridNo: "011001",
					name: "陈莉丽",
					post: "党支部书记居委会主任",
					tel: "15645437633",
					buildings: "长安新城1#2#",
					house: 206,
					population: 515,
					url: require("@/assets/speed/case/civil/IDPhoto/4.png"),
				},
				{
					gridNo: "011002",
					name: "于林浮",
					post: "综治干事",
					tel: "13503690207",
					buildings: "长安新城3#4#5#",
					house: 211,
					population: 527,
					url: require("@/assets/speed/case/civil/IDPhoto/3.png"),
				},
				{
					gridNo: "011003",
					name: "田佳",
					post: "党支部书记综治干事",
					tel: "15145456211",
					buildings: "长安新城6#7#8#10#",
					house: 239,
					population: 598,
					url: require("@/assets/speed/case/civil/IDPhoto/6.png"),
				},
				{
					gridNo: "011004",
					name: "金胜良",
					post: "居委会副主任",
					tel: "18745498042",
					buildings: "长安新城11#12#13#14#15#",
					house: 223,
					population: 557,
					url: require("@/assets/speed/case/civil/IDPhoto/5.png"),
				},
				{
					gridNo: "011005",
					name: "王海英",
					post: "协理员",
					tel: "18945425257",
					buildings: "长安新城16#17#18#19#",
					house: 234,
					population: 585,
					url: require("@/assets/speed/case/civil/IDPhoto/4.png"),
				},
				{
					gridNo: "011006",
					name: "徐桂芳",
					post: "居委会副主任",
					tel: "13946412348",
					buildings: "长安新城20#21#22#",
					house: 222,
					population: 559,
					url: require("@/assets/speed/case/civil/IDPhoto/2.png"),
				},
				{
					gridNo: "011007",
					buildings: "长安新城23#24#25#",
					name: "丁艳波",
					post: "居委会委员",
					tel: "13903680823",
					house: 212,
					population: 530,
					url: require("@/assets/speed/case/civil/IDPhoto/4.png"),
				},
				{
					gridNo: "011008",
					buildings: "长安新城26#28#",
					name: "仲丹",
					post: "居委会委员",
					tel: "13555592938",
					house: 194,
					population: 485,
					url: require("@/assets/speed/case/civil/IDPhoto/4.png"),
				},
				{
					gridNo: "011009",
					buildings: "长安新城29#30#31#",
					name: "王佳琦",
					post: "社区工作者",
					tel: "15765490444",
					house: 208,
					population: 520,
					url: require("@/assets/speed/case/civil/IDPhoto/5.png"),
				},
				{
					gridNo: "011010",
					buildings: "长安新城32#33#34#35#",
					name: "宋晓雪",
					post: "协理员",
					tel: "15845400368",
					house: 216,
					population: 540,
					url: require("@/assets/speed/case/civil/IDPhoto/4.png"),
				}
			],
			communityData: [
				{
					id: 0,
					name: "新城社区居委会",
					coordinates: [
						[
							130.315155,
							46.80678,
							102.3
						],
						[
							130.318772,
							46.806889,
							100.4
						],
						[
							130.319993,
							46.806941,
							100.3
						],
						[
							130.322351,
							46.80696,
							100.3
						],
						[
							130.323836,
							46.80667,
							103.3
						],
						[
							130.324057,
							46.806611,
							103.1
						],
						[
							130.326095,
							46.805424,
							101.8
						],
						[
							130.324476,
							46.804382,
							98.8
						],
						[
							130.320301,
							46.804256,
							101
						],
						[
							130.320223,
							46.805,
							101.2
						],
						[
							130.317268,
							46.804973,
							100.2
						],
						[
							130.316258,
							46.805021,
							100.7
						],
						[
							130.315206,
							46.805085,
							100
						],
						[
							130.315155,
							46.80678,
							102.3
						],
					],
					center: [130.3281, 46.80044],
					网格长: "陈莉丽",
					户数: 3745,
					网格: 18,
					人口: 9368,
					职务: "居委会主任",

				},
				{
					id: 1,
					name: "佳西社区居委会",
					coordinates: [
						[
							130.31523,
							46.805012,
							101.3
						],
						[
							130.316919,
							46.804895,
							100.3
						],
						[
							130.318206,
							46.804896,
							100.4
						],
						[
							130.320201,
							46.804897,
							101.3
						],
						[
							130.32026,
							46.804262,
							100.8
						],
						[
							130.320201,
							46.804109,
							100.5
						],
						[
							130.32021,
							46.803698,
							100.3
						],
						[
							130.320377,
							46.800157,
							99.4
						],
						[
							130.318334,
							46.800099,
							100.8
						],
						[
							130.315412,
							46.800027,
							100.3
						],
						[
							130.31523,
							46.805012,
							101.3
						]
					],
					center: [130.3227, 46.80218],
					网格长: "周健佳",
					户数: 3790,
					网格: 15,
					人口: 11370,
					职务: "居委会主任",

				}, {
					id: 2,
					name: "万象社区居委会",
					coordinates: [
						[
							130.320423,
							46.804107,
							101
						],
						[
							130.324494,
							46.804236,
							99
						],
						[
							130.326184,
							46.805336,
							102.2
						],
						[
							130.328253,
							46.804093,
							100.9
						],
						[
							130.329851,
							46.803106,
							102.6
						],
						[
							130.329609,
							46.802739,
							102.3
						],
						[
							130.324448,
							46.802609,
							99.1
						],
						[
							130.324555,
							46.800226,
							100.3
						],
						[
							130.32055,
							46.800149,
							99.7
						],
						[
							130.320423,
							46.804107,
							101
						]
					],
					center: [130.3204, 46.80571],
					网格长: "刘英",
					户数: 3822,
					网格: 16,
					人口: 9534,
					职务: "居委会主任",

				}, {
					id: 3,
					name: "冬梅社区居委会",
					coordinates: [
						[
							130.324688,
							46.802544,
							99.4
						],
						[
							130.329705,
							46.80267,
							102.7
						],
						[
							130.32993,
							46.80301,
							102.6
						],
						[
							130.332276,
							46.80148,
							102.2
						],
						[
							130.332465,
							46.801345,
							102.1
						],
						[
							130.33261,
							46.801153,
							102
						],
						[
							130.332632,
							46.80096,
							101.8
						],
						[
							130.332602,
							46.80082,
							101.7
						],
						[
							130.332499,
							46.80057,
							99.7
						],
						[
							130.327718,
							46.797,
							100.8
						],
						[
							130.324879,
							46.798877,
							97.5
						],
						[
							130.324688,
							46.802544,
							99.4
						]
					],
					center: [130.3178, 46.8025],
					网格长: "付莹莹",
					户数: 3630,
					网格: 16,
					人口: 9077,
					职务: "居委会主任",

				}, {
					id: 4,
					name: "勤政社区居委会",
					coordinates: [
						[
							130.315413,
							46.799966,
							100.3
						],
						[
							130.324595,
							46.800124,
							100.7
						],
						[
							130.324657,
							46.798829,
							98.9
						],
						[
							130.327637,
							46.796884,
							101.6
						],
						[
							130.325978,
							46.79578,
							99.8
						],
						[
							130.325782,
							46.795716,
							99.4
						],
						[
							130.315629,
							46.795455,
							100.7
						],
						[
							130.315413,
							46.799966,
							100.3
						]
					],
					center: [130.3206, 46.79778],
					网格长: "林佳",
					户数: 3933,
					网格: 18,
					人口: 11666,
					职务: "居委会主任",

				}
			],
			// communityData: [
			// 	{
			// 		id: 0,
			// 		name: "新城社区居委会",
			// 		coordinates: [
			// 			[130.32465440759302, 46.80248166138074, 82.56],
			// 			[130.3248767618045, 46.79900014237876, 81.85],
			// 			[130.32500133300766, 46.79880820189072, 82.11],
			// 			[130.3275005177701, 46.79715407745488, 84.12],
			// 			[130.32976058417785, 46.79891541643781, 83.91],
			// 			[130.3299234245717, 46.798997345349505, 84.01],
			// 			[130.33014005151176, 46.799003716730056, 84.13],
			// 			[130.33020548668935, 46.79902453701385, 84.17],
			// 			[130.33026794754073, 46.79904833162391, 84.21],
			// 			[130.33214177308298, 46.80045221361746, 84.52],
			// 			[130.33222505421804, 46.80054144340511, 84.54],
			// 			[130.33229042711946, 46.80063612366433, 84.56],
			// 			[130.33237799128437, 46.800801734150355, 84.60],
			// 			[130.33239702697244, 46.800881684040064, 84.62],
			// 			[130.33241035195408, 46.80094640537948, 84.63],
			// 			[130.3324179662294, 46.80100541601246, 84.65],
			// 			[130.3324179662294, 46.80105490880135, 84.66],
			// 			[130.3324179662294, 46.801113919434215, 84.68],
			// 			[130.33241455466657, 46.80115973028086, 84.69],
			// 			[130.3324045524032, 46.80121182421004, 84.71],
			// 			[130.3323856055597, 46.80127572278269, 84.72],
			// 			[130.33237989485326, 46.801302372745795, 84.73],
			// 			[130.33236311965322, 46.80133056935887, 84.74],
			// 			[130.3322947101492, 46.801387081557664, 84.76],
			// 			[130.3299400431273, 46.80290336135755, 85.05],
			// 			[130.32969638632017, 46.80268825808264, 85.00],
			// 			[130.3296126292928, 46.80269206522013, 82.56],
			// 			[130.32465440759302, 46.80248166138074, 85.03]
			// 		]
			// 	},
			// 	{
			// 		id: 1,
			// 		name: "佳西社区居委会",
			// 		coordinates: [
			// 			[130.3295916027888, 46.80315974034937, 84.29],
			// 			[130.3261241828103, 46.80529451344847, 82.81],
			// 			[130.32442881684358, 46.804163079740135, 84.43],
			// 			[130.32040276882174, 46.80405957318641, 83.47],
			// 			[130.32057437242702, 46.800210678551025, 82.41],
			// 			[130.32444231277486, 46.80026049725859, 81.36],
			// 			[130.3243519404241, 46.8026360804684, 85.0],
			// 			[130.32961997191262, 46.802787176242305, 85.03],
			// 			[130.3295916027888, 46.80315974034937, 84.18]
			// 		]
			// 	},
			// 	{
			// 		id: 2,
			// 		name: "万象社区居委会",
			// 		coordinates: [
			// 			[130.32582451576786, 46.805425856442525, 87.35],
			// 			[130.32434710842938, 46.80632243734948, 86.12],
			// 			[130.32394402773502, 46.806536350893964, 85.57],
			// 			[130.32363958363078, 46.806611589450995, 85.15],
			// 			[130.32339993405185, 46.80666717032301, 83.98],
			// 			[130.3229533470768, 46.80677719993707, 82.18],
			// 			[130.3224244200486, 46.80689628658905, 86.78],
			// 			[130.3151631939976, 46.806746461266584, 85.50],
			// 			[130.3152161251079, 46.805142224690655, 85.25],
			// 			[130.31638385749375, 46.80501183419335, 84.13],
			// 			[130.3180217198195, 46.80500013517667, 83.24],
			// 			[130.3191236402796, 46.80501494732141, 83.84],
			// 			[130.32039427245684, 46.80503398300942, 83.90],
			// 			[130.32038136061942, 46.80430467122517, 84.30],
			// 			[130.32426449856746, 46.80440203293921, 83.36],
			// 			[130.32582451576786, 46.805425856442525, 84.18]
			// 		]
			// 	},
			// 	{
			// 		id: 3,
			// 		name: "冬梅社区居委会",
			// 		coordinates: [
			// 			[130.31526254839196, 46.80490820866635, 85.28], [130.31547236093763, 46.80007181180429, 83.37], [130.32033436952588, 46.80020163479685, 83.55], [130.3202659600222, 46.80184643721714, 85.39], [130.32022372458914, 46.80277026295272, 85.23], [130.3201630483336, 46.80404089512979, 84.57], [130.32026001136944, 46.80428241042182, 84.38], [130.3202594165043, 46.80487965513436, 84.06], [130.31875678687913, 46.804836824836286, 83.74], [130.31737550976527, 46.80482611726171, 83.02], [130.3162547836315, 46.80486537836828, 84.16], [130.31526254839196, 46.80490820866635, 85.28]
			// 		]
			// 	},
			// 	{
			// 		id: 4,
			// 		name: "勤政社区居委会",
			// 		coordinates: [
			// 			[130.31550351155693, 46.79990637765849, 83.39], [130.3156595201649, 46.7956216300459, 83.20], [130.32580108204252, 46.79592850949274, 84.85], [130.3273596290013, 46.79696952368283, 84.24], [130.32456094662416, 46.79878167161286, 81.98], [130.32450542586741, 46.799999955647706, 82.19], [130.31550351155693, 46.79990637765849, 83.39]
			// 		]
			// 	}
			// ],
			selectStreet: '红旗街道',
			streetData: [
				{ value: '1', label: '红旗街道', disabled: false },
				{ value: '2', label: '桥南街道', disabled: true },
				{ value: '3', label: '永安街道', disabled: true },
				{ value: '4', label: '建国街道', disabled: true },
			],
			communityLst: [
				{ id: 1, name: '北焦化社区', status: 0 },
				{ id: 2, name: '绿云社区', status: 0 },
				{ id: 3, name: '新城社区', status: 1 },
				{ id: 4, name: '勤政社区', status: 0 },
				{ id: 5, name: '佳西社区', status: 0 },
				{ id: 6, name: '冬梅社区', status: 0 },
				{ id: 7, name: '万象社区', status: 0 },
				{ id: 8, name: '新府社区', status: 0 },
			],
			search_room: "",
			hospitalRangeData: {
				position: { lng: 130.3322, lat: 46.800913, height:110},
				modelUrl: ModelInfo.centerzhui,
				modelScale: 100,
				circles: [
					{ raius: 500, clockwise: false, color: "#ff000090" },
					{ raius: 1000, clockwise: true, color: "#ffa50090" },
					{ raius: 1500, clockwise: false, color: "#9acd3290" }]
			},
			BMFWData: [
				{
					"编号": "jms001",
					"类型": "教育",
					"名称": "佳木斯市第十五小学(伟业街)",
					"地址": "万象街与伟业街交汇处东南角",
					"电话": "0454-8581217",
					"X坐标": 130.316826,
					"Y坐标": 46.799583,
					"高度": 100.5,
					"备注": null,
					img: require("@/assets/speed/case/civil/jymap.png"),
				},
				{
					"编号": "jms002",
					"类型": "教育",
					"名称": "佳木斯市第一小学",
					"地址": "佳木斯市向阳区文久街177号",
					"电话": "4546050527",
					"X坐标": 130.339279,
					"Y坐标": 46.80588,
					"高度": 100.5,
					"备注": null,
					img: require("@/assets/speed/case/civil/jymap.png"),
				},
				{
					"编号": "jms003",
					"类型": "教育",
					"名称": "佳木斯市第三中学",
					"地址": "佳木斯市向阳区文久街176号",
					"电话": "(0454)8225034",
					"X坐标": 130.338261,
					"Y坐标": 46.806433,
					"高度": 100.5,
					"备注": null,
					img: require("@/assets/speed/case/civil/jymap.png"),
				},
				{
					"编号": "jms004",
					"类型": "医疗",
					"名称": "佳木斯大学附属口腔医院",
					"地址": "佳木斯市郊区红旗路522号",
					"电话": "(0454)8625411",
					"X坐标": 130.331987,
					"Y坐标": 46.800913,
					"高度": 180.5,
					"备注": null,
					img: require("@/assets/speed/case/civil/ylmap.png"),
				},
				{
					"编号": "jms005",
					"类型": "消防",
					"名称": "佳木斯市郊区-消防大队",
					"地址": "佳木斯市郊区友谊路68号",
					"电话": "0454-8666342",
					"X坐标": 130.307569,
					"Y坐标": 46.806131,
					"高度": 100.5,
					"备注": null,
					img: require("@/assets/speed/case/civil/xfmap.png"),
				},
				{
					"编号": "jms006",
					"类型": "消防",
					"名称": "斯安消防",
					"地址": "向阳区长安西路331号",
					"电话": "13845419311",
					"X坐标": 130.338137,
					"Y坐标": 46.803681,
					"高度": 100.5,
					"备注": null,
					img: require("@/assets/speed/case/civil/xfmap.png"),
				},
				{
					"编号": "jms007",
					"类型": "供水",
					"名称": "佳木斯供水公司",
					"地址": "郊区光复西路790号",
					"电话": "0454-8289316",
					"X坐标": 130.313911,
					"Y坐标": 46.793104,
					"高度": 100.5,
					"备注": null,
					img: require("@/assets/speed/case/civil/gsmap.png"),
				},
				{
					"编号": "jms008",
					"类型": "供电",
					"名称": "佳西供电局",
					"地址": "向阳区保卫路沁香华庭东北侧约60米",
					"电话": "0454-8292467",
					"X坐标": 130.340291,
					"Y坐标": 46.802594,
					"高度": 100.5,
					"备注": null,
					img: require("@/assets/speed/case/civil/gdmap.png"),
				},
				{
					"编号": "jms009",
					"类型": "快递",
					"名称": "康宇足科·快递驿站",
					"地址": "郊区新城路长安新城-北区",
					"电话": "13803669202",
					"X坐标": 130.327101,
					"Y坐标": 46.802774,
					"高度": 180.5,
					"备注": null,
					img: require("@/assets/speed/case/civil/kdmap.png"),
				},
				{
					"编号": "jms010",
					"类型": "快递",
					"名称": "韵达速递(西林路店)",
					"地址": "郊区在林苑小镇附近西林路1376号",
					"电话": "95546",
					"X坐标": 130.309056,
					"Y坐标": 46.804102,
					"高度": 100.5,
					"备注": null,
					img: require("@/assets/speed/case/civil/kdmap.png"),
				},
				{
					"编号": "jms011",
					"类型": "快递",
					"名称": "中通快递(佳木斯一中营业厅)",
					"地址": "向阳区保卫路706号",
					"电话": 13136992926,
					"X坐标": 130.342507,
					"Y坐标": 46.803982,
					"高度": 100.5,
					"备注": null,
					img: require("@/assets/speed/case/civil/kdmap.png"),
				}
			],
			check1: false,
			check2: false,
			check3: false,
			check4: false,
			check5: false,
			check6: false,
			SQData: [
				{
					"编号": "jwh001",
					"类型": "居委会",
					"名称": "新城社区居委会",
					"地址": "英伦蓝爵30号楼附近",
					"电话": "0454-85XXXXX",
					"X坐标": 130.327576,
					"Y坐标": 46.799165,
					"高度": 130,
					"备注": "佳木斯市郊区红旗街道新城社区居民委员会（曾用名：佳木斯市郊区新城社区居民委员会），成立于1900年，位于黑龙江省佳木斯市。",
					img: require("@/assets/speed/case/village/img_dwd.png"),
				},
				{
					"编号": "wy002",
					"类型": "物业",
					"名称": "长安新城物业管理有限公司",
					"地址": "长安路西段（佳西社区）",
					"电话": "0454-604***",
					"X坐标": 130.328234,
					"Y坐标": 46.797945,
					"高度": 123,
					"备注": "公司尊崇“踏实、拼搏、责任”的企业精神，并以诚信、共赢、开创经营理念，创造良好的企业环境，以全新的管理模式，完善的技术，周到的服务，卓越的品质为生存根本，我们始终坚持用户至上 用心服务于客户，坚持用自己的服务去打动客户。",
					img: require("@/assets/speed/case/village/img_dwd_sel.png"),
				}
			]
		}
	},
	components: {
		Vue3SeamlessScroll
	},
	created() {
	},
	mounted() {
		this.$emit('communityFn',
			{
				name: "新城社区",
				modelUrl: ModelInfo.xincheng,
				alt: -15.00,
				isDTH: true,
				dthUrl: ModelInfo.CAXC
			},
			this.communityData,
		)
		this.$emit('loadSQData',this.SQData)


		let dataAxis = ['0-10', '10-20', '20-60', '60-70', '70-80', '80-90', '90+'];
		let data = [100, 1430, 3800, 2400, 1500, 150, 48];
		let man = [40, 600, 1908, 2400, 1500, 79, 20];
		let woman = [60, 830, 1892, 1453, 947, 71, 28];
		createBarChart(dataAxis, data, this.$refs['chartNLKD'], undefined, "年龄", "人数", man, woman);

		let population = [
			{ name: '常住人口', data: [8264, 8290, 7428, 7135, 7523, 8014, 7924, 7138, 6842] },
			{ name: '流动人口', data: [1104, 1078, 1940, 2233, 1845, 1354, 1444, 2230, 2526] },
		];
		let years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]
		createLineChart(years, population, this.$refs['chartRKXZ']);


		// let sexdata = [
		// 	{ name: '男性', value: 5220 },
		// 	{ name: '女性', value: 4148 }
		// ]
		// // createPieChart(sexdata, this.$refs['chartXBFB']);
		// create3DPieChart(this.$refs['chartXBFB'], sexdata)

		let wgsjData = [
			{ value: 23, name: '调解家庭纠纷' },
			{ value: 30, name: '调解邻里纠纷' },
			{ value: 14, name: '调解经济纠纷' },
			{ value: 60, name: '宣传网络诈骗' },
			{ value: 25, name: '巡查市政设备' },
			{ value: 42, name: '受理群众举报' },

		]
		createWGSJPieChart(wgsjData, this.$refs['chartWGSJ'])

	},
	methods: {
		loadYLData(type) {
			let check = false
			switch (type) {
				case "医疗":
					this.check1 = !this.check1
					check = this.check1
					break;
				case "教育":
					this.check2 = !this.check2
					check = this.check2
					break;
				case "消防":
					this.check3 = !this.check3
					check = this.check3
					break;
				case "供水":
					this.check4 = !this.check4
					check = this.check4
					break;
				case "供电":
					this.check5 = !this.check5
					check = this.check5
					break;
				case "快递":
					this.check6 = !this.check6
					check = this.check6

					break;
			}
			if (check) {
				this.$emit('loadBMFWData', type, this.BMFWData)
			} else {
				this.$emit('removeBMFWData', type, this.BMFWData)
			}

		},

		loadGridData(value) {

			if (value) {
				this.$emit('loadGridData', ModelInfo.XCSQWG, this.gridmans)
			} else {
				this.$emit('removeGridData')
			}
		},
		loadRangeData(value) {
			if (value) {
				this.$emit('loadRangeData', this.hospitalRangeData)
			} else {
				this.$emit('closeRangeData')
			}
		},
		setShow() {
			this.isshow = !this.isshow
		},
		searchData() {
			// this.isshow = !this.isshow
			if (this.search_room.trim() == "") {
				return
			}
			this.$emit('searchDTH', this.search_room.trim())
		},
		statusChange(val) {
			this.selectStreet = val
		},

		// 左滑动逻辑
		scrollLeft() {
			const allLength = this.communityLst.length * 120
			const boxLength = document.getElementById('list-box').clientWidth
			if (allLength < boxLength) return
			const listEl = document.getElementById('list')
			const leftMove = Math.abs(parseInt(window.getComputedStyle(listEl, null)?.left))
			if (leftMove + boxLength - 360 < boxLength) {
				// 到最开始的时候
				listEl.style.left = '0px'
			} else {
				listEl.style.left = '-' + (leftMove - 360) + 'px'
			}
		},
		// 右滑动逻辑
		scrollRight() {
			const allLength = this.communityLst.length * 120
			const boxLength = document.getElementById('list-box').clientWidth
			if (allLength < boxLength) return
			const listEl = document.getElementById('list')
			const leftMove = Math.abs(parseInt(window.getComputedStyle(listEl, null)?.left))
			if (leftMove + boxLength + 360 > allLength) {
				listEl.style.left = '-' + (allLength - boxLength) + 'px'
			} else {
				listEl.style.left = '-' + (leftMove + 360) + 'px'
			}
		},
	}
};
</script>

<style scoped>
.search_dm {
	position: absolute;
	left: 20%;
	top: 13%;
	z-index: 5;
}

.search_key {
	display: flex;
}

.searchBtn1,
.search_btn {
	border: rgb(53 167 255 / 65%) 1px solid;
	border-radius: 6px;
	width: 40px;
	height: 40px;
	background: url("@/assets/speed/case/civil/searchicon.png") no-repeat;
	background-size: 70% 70%;
	background-position: 50% 50%;
	background-color: rgb(29 70 126 / 70%);
}

.search_content {

	border: none;
	color: white;
}

::v-deep .el-input__wrapper {
	background-color: rgb(29 70 126 / 70%);
}

.el-input {
	--el-input-border-color: #35A7FF;
	--el-input-text-color: #ffffff;
}


.monitor-list {
	display: flex;
	justify-content: space-between;
}

.streetname {
	border: transparent;
	background-color: transparent;
	color: #ffffff;
	position: absolute;
	width: 50%;
	left: 25%;
	top: 12%;
	--el-card-padding: 0
}

.btn {
	width: 50px;
	height: 20px;
	line-height: 100px;
	text-align: center;
	cursor: pointer;
	margin-top: 1.5%;
}

.btn:hover {
	background-color: #40a0ff7a;
	color: white;
}

.list-box {
	width: calc(30vw - 30px);
	overflow: hidden;
}

.list {
	width: calc(50vw - 50px);
	display: flex;
	transform: all 2s;

	position: relative;
	left: 0;
	transition: left 1s;
}

.list-item {
	width: 80px;
	text-align: center;
	cursor: pointer;
	margin-left: 10px;
	font-weight: 700;
}






.community-left {
	width: 18%;
	height: 88%;
	position: absolute;
	z-index: 5;
	top: 9%;
	left: 0.8%;
}

.community-right {
	width: 18%;
	height: 88%;
	position: absolute;
	z-index: 5;
	top: 9%;
	right: 0.8%;
}

.community-bottom {
	width: 46%;
	height: 12%;
	position: fixed;
	z-index: 5;
	bottom: 2.7%;
	left: 27%;
}

.community-info {
	background: url("@/assets/speed/case/civil/community1.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 65%;
	bottom: 28%;
	position: absolute;
	display: flex;
}

.community-content {
	width: 50%;
	position: absolute;
	margin-left: 25%;
	margin-top: 0.8%;
	display: flex;
}

.community {
	font-size: 14px;
	font-weight: 400;
	text-align: center;
	color: #ffffff;
	line-height: 20px;
	margin-right: 10px;
}

.community-street {
	background: url("@/assets/speed/case/civil/street2.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 60%;
	position: absolute;
	bottom: 0.2%;
}

.jbxx {
	width: 100%;
	height: 26%;
	background: url("@/assets/speed/case/civil/jbxx.png") no-repeat;
	background-size: 100% 100%;
	margin-bottom: 3%;
	padding: 2%;
	padding-top: 12%;
	display: flex;
	justify-content: space-between;
}

.wgyxx {
	width: 100%;
	height: 40%;
	background: url("@/assets/speed/case/civil/wgyxx.png") no-repeat;
	background-size: 100% 100%;
	margin-bottom: 3%;
	padding: 2%;
	padding-top: 10%;
}

.wgyxx_content {
	width: 100%;
	height: 100%;
	overflow-y: scroll;
}

.grid_show {
	position: absolute;
	right: 10%;
	top: 27.3%;
	color: #ffffff;
}

.gridLst {
	margin: 2%;
	display: flex;
}

.grid_img {
	width: 30%;
	height: 100%;
}

.image {
	width: 30%;
	display: block;
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center center;
}

.grid_info {
	background: url("@/assets/speed/case/civil/wgyback.png") no-repeat;
	background-size: 100% 100%;
	width: 70%;
	margin-left: 2%;
	padding: 3%;
	height: 100%;
}

.gridman_info {
	display: flex;
	align-items: center;
	overflow: hidden;
	text-overflow: ellipsis;
}

.gridMan {
	font-size: 15px;
	font-family: PangMenZhengDao-3, PangMenZhengDao-3-Regular;
	font-weight: 700;
	text-align: left;
	color: #ffffff;
	text-shadow: -2px 0px 8px 2px rgba(9, 35, 81, 0.90);
	background-image: -webkit-linear-gradient(bottom, #81c2ff 0%, #ffffff 63%, #f0fdff 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	overflow: hidden;
	text-overflow: ellipsis;
}

.tel,
.area {
	font-size: 12px;
	font-family: Source Han Sans CN, Source Han Sans CN-Medium;
	font-weight: 500;
	text-align: left;
	color: #ffffff;
	line-height: 24px;
	padding-left: 2%;
}

.grid_icon {
	width: 16px;
	height: 16px;
}

.zbts {
	width: 100%;
	height: 30%;
	background: url("@/assets/speed/case/civil/bmfw.png") no-repeat;
	background-size: 100% 100%;
	padding-top: 10%;
	padding-bottom: 5%;
}

.nlkd {
	width: 100%;
	height: 32%;
	background: url("@/assets/speed/case/civil/nlkd.png") no-repeat;
	background-size: 100% 100%;
	margin-bottom: 3%;
	padding: 2%;
	padding-top: 10%;
}

.xbfb {
	width: 100%;
	height: 32%;
	background: url("@/assets/speed/case/civil/xbfb.png") no-repeat;
	background-size: 100% 100%;
	margin-bottom: 3%;
	padding: 2%;
	padding-top: 10%;
}

.wgsj {
	width: 100%;
	height: 32%;
	margin-bottom: 3%;
}

.wgsj_title {
	position: absolute;
	background: url("@/assets/speed/case/civil/wgsj-title.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 4%;
}

.wgsj_back {
	background: url("@/assets/speed/case/civil/xcjx_content.png") no-repeat;
	background-size: 100% 100%;
	padding: 2%;
	padding-top: 10%;
	position: absolute;
	width: 100%;
	height: 32%;
}

.rkxz {
	width: 100%;
	height: 32%;
	background: url("@/assets/speed/case/civil/rkxz.png") no-repeat;
	background-size: 100% 100%;
	margin-bottom: 3%;
	padding: 2%;
	padding-top: 10%;
}


.jbxx_img {
	width: 45%;
	height: 90%;
	padding-left: 1%;
}

.content_jbxx {
	width: 50%;
	height: 90%;
}

.content_jbxx_title {
	background: url('@/assets/speed/case/civil/hometitle.png') no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 20%;
	text-align: center;
	padding: 5%;
	font-size: 14px;
	font-family: Source Han Sans CN, Source Han Sans CN-Bold;
	font-weight: 700;
	color: #ffffff;
	line-height: 14px;
	letter-spacing: 0.84px;
	overflow: hidden;
	text-overflow: ellipsis;
}

.content_jbxx_intr {
	width: 100%;
	height: 80%;
	font-size: 12px;
	font-family: Source Han Sans CN, Source Han Sans CN-Regular;
	font-weight: 500;
	text-align: left;
	color: #ffffff;
	line-height: 20px;
	letter-spacing: 0.24px;
	overflow: hidden;
	text-overflow: ellipsis;
}

.zhts_content {
	width: 30%;
	height: 30%;
	float: left;
	text-align: center;
	padding: 3%;
	display: flex;
	justify-content: center;
}

.zbts_img {
	width: 80%;
	height: 70%;
}

.zbts_type {
	width: 100%;
	height: 30%;
	font-size: 14px;
	font-family: Source Han Sans CN, Source Han Sans CN-Regular;
	font-weight: 400;
	text-align: center;
	color: #f0f0f0;
	overflow: hidden;

}

.zbts_typex {
	color: #ffffff;
	height: 20px;
	--el-checkbox-bg-color: #ffffff00;

}

.zbts_content {
	width: 100%;
	height: 50%;
	text-align: center;
	display: flex;
	justify-content: center;
}

.zbts_info {
	width: 33%;
	height: 100%;
	cursor: pointer;

}

::v-deep .example-showcase .el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}

.el-dropdown {
	color: white;
	margin-left: 45%;
	margin-top: 1.7%;
}

.el-dropdown-link {
	text-align: center;
	padding-right: 11px;
	font-size: 15px;
	font-family: PangMenZhengDao-3, PangMenZhengDao-3-Regular;
	font-weight: bold;
	color: #ffffff;
	letter-spacing: 2.4px;
	background-image: -webkit-linear-gradient(bottom, #81c2ff 0%, #ffffff 63%, #f0fdff 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}



/* ::v-deep .el-popper.is-light {
	background: rgb(30 46 64 / 50%) !important;
	border: 1px solid #017ede !important;
	box-shadow: 0px 0px 15px 0px #017ddd inset !important;
}

::v-deep .el-dropdown-menu {
	background-color: #ffffff00 !important;
} */
</style>
