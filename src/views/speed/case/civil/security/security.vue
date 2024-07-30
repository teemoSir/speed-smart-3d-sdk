<template>
	<div>
		<div class="security-left">
			<el-row class="input-search">
				<el-col :span="8"><el-select v-model="value" placeholder="全部" style="margin: 3px 0 0 3px"
						@change="selectData">
						<el-option style="color: #35a7ff" v-for="item in options" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
					<div class="line"></div>
				</el-col>
				<el-col :span="14">
					<input class="search_door" placeholder="请输入搜索内容" v-model="search_content"
						@keyup.enter.native="searchData()" />
				</el-col>
				<el-col :span="2">
					<div class="search_btn" @click="searchData()"></div>
				</el-col>
			</el-row>

			<div class="door_info">
				<div class="door-plane" v-for="item in curJUNData" :key="item.ID" @click="clickAddress(item)">
					<div class="right-sub-text">{{ item.remarks }}</div>
					<div style="height: 15px"></div>
					<div class="name">
						<img :src=item.img alt="" />
						<div class="namecontent">{{ item.name }}</div>
					</div>
					<div class="list">
						<img :src="require('@/assets/speed/case/civil/ic_zz.png')" alt="" />
						{{ item.village.trim() + item.street.trim() + item.number.trim() }}
					</div>
					<div class="list" @click="item.ishow = !item.ishow">
						<img :src="require('@/assets/speed/case/civil/ic_wwzfjl.png')" alt="" />{{
							Number(item.ID) % 2 == 0 ? "慰问走访记录" : "结束"
						}}
					</div>
					<div class="fujian" v-if="item.ishow">
						<img :src="require('@/assets/speed/case/civil/ic_fj.png')" alt="" />
						2022年年底核查记录
						<a style="text-decoration: underline; color: #4692ff; float: right">
							附件下载</a>
					</div>
				</div>
			</div>
			<el-pagination class="page" background small layout="prev, pager, next" @size-change="handleSizeChange"
				@current-change="handleCurrentChange" :page-size="pagesize" :total="total" />
		</div>

		<div class="community-right">
			<!-- <div class="nltb" ref="chartXBFB"></div> -->
			<div class="nltb">
				<div class="nltb_back" ref="chartXBFB"></div>
				<div class="nltb_title"></div>
			</div>


			<div class="rstj">
				<div class="rstj_back" ref="chartRKXZ"></div>
				<div class="rstj_title"></div>
			</div>
			<div class="ndzzqs">
				<div class="ndzzqs_back" ref="chartNLKD"></div>
				<div class="ndzzqs_title"></div>
			</div>
		</div>

		<div class="community-bottom">
			<div class="community-info">
				<div class="community" @click="moveList(1)">
					<img :src="require('@/assets/speed/case/civil/ic_zjt.png')" style="height: 20px; margin-top: 37px" />
				</div>

				<div v-for="(item, index) in actionCommunityLst" @click="this.action = index"
					:class="this.action == index ? 'communityhover' : 'community'" :key="index" :style="{
						marginTop: Math.abs(item.deg * 2) + 'px',
						transform: 'rotate(' + item.deg + 'deg)',
					}">
					{{ item.label }}
				</div>
				<div class="community" @click="moveList(1)">
					<img :src="require('@/assets/speed/case/civil/ic_yjt.png')" style="height: 20px; margin-top: 37px" />
				</div>
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
	</div>
</template>

<script>
import * as echarts from "echarts";
import {
	createBarChart,
	createPieChart,
	createLineChart,
	create3DPieChart,
} from "@/views/speed/case/civil/community/gridEcharts";
import RECORDS from "./dlmp_tj";
import ModelInfo from "@/utils/modelInfo";
import { getPie3D, getParametricEquation } from "./3dPieChart";


export default {
	name: "civilMap",
	data() {
		return {
			communityData: [
				{
					id: 0,
					name: "新城社区居委会",
					coordinates: [
						[130.315155, 46.80678, 102.3],
						[130.318772, 46.806889, 100.4],
						[130.319993, 46.806941, 100.3],
						[130.322351, 46.80696, 100.3],
						[130.323836, 46.80667, 103.3],
						[130.324057, 46.806611, 103.1],
						[130.326095, 46.805424, 101.8],
						[130.324476, 46.804382, 98.8],
						[130.320301, 46.804256, 101],
						[130.320223, 46.805, 101.2],
						[130.317268, 46.804973, 100.2],
						[130.316258, 46.805021, 100.7],
						[130.315206, 46.805085, 100],
						[130.315155, 46.80678, 102.3],
					],
					center: [130.3281, 46.80044],
				},
				{
					id: 1,
					name: "佳西社区居委会",
					coordinates: [
						[130.31523, 46.805012, 101.3],
						[130.316919, 46.804895, 100.3],
						[130.318206, 46.804896, 100.4],
						[130.320201, 46.804897, 101.3],
						[130.32026, 46.804262, 100.8],
						[130.320201, 46.804109, 100.5],
						[130.32021, 46.803698, 100.3],
						[130.320377, 46.800157, 99.4],
						[130.318334, 46.800099, 100.8],
						[130.315412, 46.800027, 100.3],
						[130.31523, 46.805012, 101.3],
					],
					center: [130.3227, 46.80218],
				},
				{
					id: 2,
					name: "万象社区居委会",
					coordinates: [
						[130.320423, 46.804107, 101],
						[130.324494, 46.804236, 99],
						[130.326184, 46.805336, 102.2],
						[130.328253, 46.804093, 100.9],
						[130.329851, 46.803106, 102.6],
						[130.329609, 46.802739, 102.3],
						[130.324448, 46.802609, 99.1],
						[130.324555, 46.800226, 100.3],
						[130.32055, 46.800149, 99.7],
						[130.320423, 46.804107, 101],
					],
					center: [130.3204, 46.80571],
				},
				{
					id: 3,
					name: "冬梅社区居委会",
					coordinates: [
						[130.324688, 46.802544, 99.4],
						[130.329705, 46.80267, 102.7],
						[130.32993, 46.80301, 102.6],
						[130.332276, 46.80148, 102.2],
						[130.332465, 46.801345, 102.1],
						[130.33261, 46.801153, 102],
						[130.332632, 46.80096, 101.8],
						[130.332602, 46.80082, 101.7],
						[130.332499, 46.80057, 99.7],
						[130.327718, 46.797, 100.8],
						[130.324879, 46.798877, 97.5],
						[130.324688, 46.802544, 99.4],
					],
					center: [130.3178, 46.8025],
				},
				{
					id: 4,
					name: "勤政社区居委会",
					coordinates: [
						[130.315413, 46.799966, 100.3],
						[130.324595, 46.800124, 100.7],
						[130.324657, 46.798829, 98.9],
						[130.327637, 46.796884, 101.6],
						[130.325978, 46.79578, 99.8],
						[130.325782, 46.795716, 99.4],
						[130.315629, 46.795455, 100.7],
						[130.315413, 46.799966, 100.3],
					],
					center: [130.3206, 46.79778],
				},
			],
			options: [
				{
					label: "全部",
					value: "",
					img: ""
				},
				{
					label: "高龄老人",
					value: "高龄老人",
				},
				{
					label: "退伍军人",
					value: "退伍军人",
				},
				{
					label: "低保户",
					value: "低保户",
				},
				{
					label: "残疾人",
					value: "残疾人",
				},
				{
					label: "其他",
					value: "其他",
				},
			],

			value: "全部",
			action: 3,
			numberkey: 0,
			search_content: "",
			allJUNData: RECORDS,
			curJUNData: RECORDS.slice(0, 4),
			currentPage: 1,
			pagesize: 4,
			total: RECORDS.length,
			typeVal: "",
			cities: [
				{
					value: "Beijing",
					label: "Beijing",
				},
				{
					value: "Shanghai",
					label: "Shanghai",
				},
				{
					value: "Nanjing",
					label: "Nanjing",
				},
			],
			gridmans: [
				{
					gridNo: "011001",
					name: "陈莉丽",
					post: "党支部书记居委会主任",
					tel: "15645437633",
					buildings: "长安新城1#2#",
					house: 206,
					population: 515,
					url: require("@/assets/speed/case/civil/网格员图片1.png"),
				},
				{
					gridNo: "011002",
					name: "于林浮",
					post: "综治干事",
					tel: "13503690207",
					buildings: "长安新城3#4#5#",
					house: 211,
					population: 527,
					url: require("@/assets/speed/case/civil/网格员图片2.png"),
				},
				{
					gridNo: "011003",
					name: "田佳",
					post: "党支部书记综治干事",
					tel: "15145456211",
					buildings: "长安新城6#7#8#10#",
					house: 239,
					population: 598,
					url: require("@/assets/speed/case/civil/网格员图片3.png"),
				},
				{
					gridNo: "011004",
					name: "金胜良",
					post: "居委会副主任",
					tel: "18745498042",
					buildings: "长安新城11#12#13#14#15#",
					house: 223,
					population: 557,
					url: require("@/assets/speed/case/civil/网格员图片1.png"),
				},
				{
					gridNo: "011005",
					name: "王海英",
					post: "协理员",
					tel: "18945425257",
					buildings: "长安新城16#17#18#19#",
					house: 234,
					population: 585,
					url: require("@/assets/speed/case/civil/网格员图片2.png"),
				},
				{
					gridNo: "011006",
					name: "徐桂芳",
					post: "居委会副主任",
					tel: "13946412348",
					buildings: "长安新城20#21#22#",
					house: 222,
					population: 559,
					url: require("@/assets/speed/case/civil/网格员图片3.png"),
				},
			],
			icon1: require("@/assets/speed/case/civil/tel.png"),
			icon2: require("@/assets/speed/case/civil/gxq.png"),

			selectStreet: "渔业村",
			streetData: [
				{ value: "1", label: "渔业村", disabled: false },
				{ value: "2", label: "卫明村", disabled: true },
				{ value: "3", label: "XXX村", disabled: true },
				{ value: "4", label: "XXX村", disabled: true },
			],
			communityLst: [
				{ value: "2", label: "绿云社区" },
				{ value: "3", label: "新城社区" },
				{ value: "4", label: "勤政社区" },
				{ value: "5", label: "佳西社区" },
				{ value: "6", label: "冬梅社区" },
				{ value: "7", label: "西瓜社区" },
				{ value: "8", label: "南瓜社区" },
				{ value: "9", label: "北瓜社区" },
				{ value: "10", label: "种瓜社区" },
				{ value: "11", label: "美美社区" },
			],
			actionCommunityLst: [
				{ value: 1, label: "绿云社区", deg: -8 },
				{ value: 2, label: "新城社区", deg: -2.2 },
				{ value: 3, label: "勤政社区", deg: 0 },
				{ value: 3, label: "佳西社区", deg: 2.2 },
				{ value: 4, label: "冬梅社区", deg: 8 },
			],
		};
	},
	created() { },
	mounted() {
		this.loadAnalyse();
		this.$emit(
			"loadYYCModel",
			{
				name: "渔业村",
				modelUrl: ModelInfo.yuyecun,
				alt: -15.00,
				// isDTH: true,
				// dthUrl: ModelInfo.YYC,
			}
		);

		this.$emit("loadCunData", RECORDS);

	},
	methods: {
		loadAnalyse() {
			let dataAxis = ["0-10", "10-20", "20-60", "60-70", "70-80", "80-90", "90+"];
			let data = [100, 1430, 3800, 2400, 1500, 150, 48];
			this.addRightBottomChart(dataAxis, data, this.$refs["chartNLKD"]);

			let population = ["高龄老人", "退伍军人", "低保户", "残疾人"];
			let years = [312, 331, 432, 232];
			let man = [130, 280, 180, 190]
			let women = [312 - 130, 331 - 280, 432 - 180, 232 - 190]
			this.addLineChart(years, population, this.$refs["chartRKXZ"], man, women);

			// let optionData = [
			//   { name: "男性", value: 5220 },
			//   { name: "女性", value: 4148 },
			// ];
			// create3DPieChart(this.$refs["chartXBFB"], optionData);
			let pieData = [
				{ value: 87, name: '60岁以下' },
				{ value: 67, name: '60-69岁' },
				{ value: 49, name: '70-79岁' },
				{ value: 25, name: '80岁以上' }
			]
			// this.createDoughnutChart(this.$refs["chartXBFB"], pieData)
			this.init3DPieChart(this.$refs["chartXBFB"], pieData)
		},

		addLineChart(years, data, chart, man, women) {
			const myChart = echarts.init(chart);

			let series = [];
			let tdata = [];
			man && series.push({
				name: '男性',
				type: 'line',
				data: man,
				symbolSize: 6,
				itemStyle: {
					//折线颜色
					normal: {
						color: "#3399ff",
					},
				},
			})

			women && series.push({
				name: '女性',
				type: 'line',
				data: women,
				symbolSize: 6,
				itemStyle: {
					//折线颜色
					normal: {
						color: "#FF82AB",
					},
				},
			})

			series.push({
				name: data,
				data: years,
				type: "bar",
				smooth: true,
				lineStyle: {
					normal: {
						color: "#1FE4F8",
					},
				},
				itemStyle: {
					normal: {
						color: "#1FE4F8",
					},
				},

				barWidth: 10,
				areaStyle: {
					normal: {
						color: {
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0.1,
									color: "rgba(31,228,248, 0.9)", // 0% 处的颜色
								},
								{
									offset: 0.9,
									color: "rgba(31,228,248, 0.1)", // 100% 处的颜色
								},
							],
						},
					},
				},
			});

			let option = {
				// title: {
				//   text: "World Population",
				// },
				tooltip: {
					trigger: "axis",
					backgroundColor: 'rgba(36,201,255,0.50)',
					borderColor: 'rgba(36,201,255,0.20)',
					axisPointer: {
						type: "shadow",
					},
					textStyle: {
						color: '#fff',
						fontSize: '12'
					},
				},

				grid: {
					left: "10px",
					right: "10px",
					bottom: "10px",
					top: "20px",
					containLabel: true,
				},
				xAxis: {
					type: "value",
					boundaryGap: [0, 0.01],
					axisLabel: {
						color: "#fff",
						fontSize: 12
					},
				},

				yAxis: {
					type: "category",
					data: data,
					axisLabel: {
						color: "#fff",
						fontSize: 12,
						showMinLabel: true, //不显示最小刻度线值
					},
				},
				series: series,
				legend: {
					show: true,
					data: ['男性', '女性'],
					z: 2,
					textStyle: {
						fontSize: 11, //字体大小
						color: "#ffffff", //字体颜色
					},
					right: 5,
					padding: 1,
				},
			};
			option && myChart.setOption(option);
			myChart.on('click', (params) => {
				if (params.name === '残疾人') {
					this.value = '残疾人'
				} else {
					this.value = params.name
				}
				this.selectData()
			});
		},
		addRightBottomChart(years, data, chart) {
			const myChart = echarts.init(chart);

			let series = [];
			let tdata = [];

			let option = {
				tooltip: {
					//提示框设置
					trigger: "axis",
					backgroundColor: 'rgba(36,201,255,0.50)',
					borderColor: 'rgba(36,201,255,0.20)',
					axisPointer: {
						//设置横线的样式
						type: "cross",
						crossStyle: {
							color: "yellow",
						},
					},
					textStyle: {
						//设置提示框的对齐方式
						//align: "left",
						color: '#fff',
						fontSize: '12'
					},
				},
				grid: {
					//设置内容区域距离周边的距离
					left: "2px",
					right: "2px",
					top: "30px",
					bottom: "0px",
					containLabel: true,
				},
				toolbox: {
					show: false,
				},

				xAxis: [
					{
						//name: '年份',
						type: "category",
						data: ["2018", "2019", "2020", "2021", "2022", "2023"],
						axisLine: {
							show: true,
							lineStyle: {
								color: '#397cbc'
							}
						},
						axisTick: {
							show: false,
						},
						splitLine: {
							show: false,
							lineStyle: {
								color: '#195384'
							}
						},
						axisLabel: {
							//轴线字体样式设置
							textStyle: {
								fontFamily: "ArialMT",
								fontSize: "12",
								color: "#fff",
							},
						},
					},
				],
				yAxis: [
					{
						//name: '人数',
						min: 0, //取0为最小刻度
						max: 100, //取100为最大刻度

						// min: "dataMin", //取最小值为最小刻度
						// max: "dataMax", //取最大值为最大刻度

						// min: function (value) {
						// 	//取最小值向下取整为最小刻度
						// 	return Math.floor(value.min);
						// },
						// max: function (value) {
						// 	//取最大值向上取整为最大刻度
						// 	return Math.ceil(value.max);
						// },

						//scale: true, //自适应
						//minInterval: 1, //分割刻度
						axisLabel: {
							color: "#fff",
							fontSize: 12,
							showMinLabel: true, //不显示最小刻度线值
						},
						axisLine: {
							lineStyle: {
								color: "#58f371", //最左侧Y轴颜色
							},
						},
						axisTick: {
							show: false, //不显示刻度线
						},
						splitLine: {
							//多条横线
							show: true,
							lineStyle: {
								type: "dashed",
								color: "#ffffff",
							},
						},
					},
				],
				series: [
					{
						name: "退伍军人",
						type: "line",
						smooth: true, //是否平滑
						data: [49, 29, 59, 62, 52, 69],
						// symbol: 'circle',
						symbolSize: 6,
						itemStyle: {
							normal: {
								color: '#0092f6',
								lineStyle: {
									color: "#0092f6",
									width: 1
								},
								areaStyle: {
									color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
										offset: 0,
										color: 'rgba(7,44,90,0.3)'
									}, {
										offset: 1,
										color: 'rgba(0,146,246,0.9)'
									}]),
								}
							}
						},
						markPoint: {
							itemStyle: {
								normal: {
									color: 'red'
								}
							}
						},
					},
					{
						name: "高龄老人",
						type: "line",
						smooth: true, //是否平滑
						data: [21, 28, 35, 42, 39, 55],
						// symbol: 'circle',
						symbolSize: 6,
						itemStyle: {
							normal: {
								color: '#CD5C5C',
								lineStyle: {
									color: "#CD5C5C",
									width: 1
								},
								areaStyle: {
									//color: '#94C9EC'
									color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
										offset: 0,
										color: 'rgba(195, 75, 52,0.3)'
									}, {
										offset: 1,
										color: 'rgba(205, 92, 92,0.9)'
									}]),
								}
							}
						},
					},
					{
						name: "残疾人",
						type: "line",
						smooth: true, //是否平滑
						data: [14, 35, 23, 19, 29, 29],
						symbolSize: 6,
						// symbol: 'circle',
						itemStyle: {
							normal: {
								color: '#00d4c7',
								lineStyle: {
									color: "#00d4c7",
									width: 1
								},
								areaStyle: {
									//color: '#94C9EC'
									color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
										offset: 0,
										color: 'rgba(7,44,90,0.3)'
									}, {
										offset: 1,
										color: 'rgba(0,212,199,0.9)'
									}]),
								}
							}
						},
					},
					{
						name: "低保户",
						type: "line",
						smooth: true, //是否平滑
						data: [90, 80, 68, 57, 48, 32],
						// symbol: 'circle',
						symbolSize: 6,
						itemStyle: {
							normal: {
								color: '#aecb56',
								lineStyle: {
									color: "#aecb56",
									width: 1
								},
								areaStyle: {
									color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
										offset: 0,
										color: 'rgba(7,44,90,0.3)'
									}, {
										offset: 1,
										color: 'rgba(114,144,89,0.9)'
									}]),
								}
							}
						},
					},
				],
				legend: {
					show: true, // 是否显示图例
					width: 600,
					//  type: "category", // 'plain'：普通图例。缺省就是普通图例; 'scroll'：可滚动翻页的图例。当图例数量较多时可以使用
					// z: 2, // 组件的所有图形的z值。控制图形的前后顺序。z值小的图形会被z值大的图形覆盖。
					// top: "auto", // 距离容器侧边距离
					// bottom: "auto", // 距离容器侧边距离
					// left: "auto", // 距离容器侧边距离
					// right: "auto", // 距离容器侧边距离
					// width: "auto", // 图例组件的宽度。默认自适应
					// height: "auto", // 图例组件的高度。默认自适应
					// orient: "horizontal", // 图例列表的布局朝向; horizontal; vertical
					// align: "auto", // 图例标记和文本的对齐。默认自动
					// padding: 1, // 图例内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
					// itemGap: 10, // 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔
					// itemWidth: 25, // 图例标记的图形宽度
					// itemHeight: 14, // 图例标记的图形高度// 使用字符串模板，模板变量为图例名称 {name}
					formatter: function (name) {
						// 使用回调函数
						return name;
					},
					textStyle: {
						fontSize: 11, //字体大小
						color: "#ffffff", //字体颜色
					},
					inactiveColor: "#ccc", // 图例关闭时的颜色
				},
			};

			option && myChart.setOption(option);
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.curJUNData = this.allJUNData.slice(
				(this.currentPage - 1) * this.pagesize,
				this.currentPage * this.pagesize
			);
			// this.loadDoorData(this.curDoorData);
		},
		statusChange(val) {
			this.selectStreet = val;
		},
		moveList(index) {
			this.action = -1;
			this.numberkey += index;
			//   console.log(this.numberkey);
			if (this.numberkey + 5 < this.communityLst.length && this.numberkey > 0) {
				this.actionCommunityLst[0].label = this.communityLst[this.numberkey - 1].label;
				this.actionCommunityLst[1].label = this.communityLst[this.numberkey].label;
				this.actionCommunityLst[2].label = this.communityLst[this.numberkey + 1].label;
				this.actionCommunityLst[3].label = this.communityLst[this.numberkey + 2].label;
				this.actionCommunityLst[4].label = this.communityLst[this.numberkey + 3].label;
			} else {
				this.numberkey = 0;
			}
		},

		searchData() {
			this.allJUNData = RECORDS.filter((item) => item.name.includes(this.search_content));
			if (this.allJUNData) {
				this.total = this.allJUNData.length;
				this.currentPage = 1;
				this.curJUNData = this.allJUNData.slice(0, 4);
			}
		},
		selectData() {
			if (this.value) {
				if (this.value == "其他") {
					this.allJUNData = RECORDS.filter((item) => item.remarks == null);
					if (this.allJUNData) {
						this.total = this.allJUNData.length;
						this.currentPage = 1;
						this.curJUNData = this.allJUNData.slice(0, 4);
					}
				} else {
					this.allJUNData = RECORDS.filter((item) => item.remarks == this.value);
					if (this.allJUNData) {
						this.total = this.allJUNData.length;
						this.currentPage = 1;
						this.curJUNData = this.allJUNData.slice(0, 4);
					}
				}

			} else {
				this.allJUNData = RECORDS;
				if (this.allJUNData) {
					this.total = this.allJUNData.length;
					this.currentPage = 1;
					this.curJUNData = this.allJUNData.slice(0, 4);
				}
			}
		},

		clickAddress(data) {
			this.$emit("flyLabel", { lng: data.center[0], lat: data.center[1] });
			this.$emit("flyCunAddress", [data.center[0], data.center[1], 80, data]);
		},

		createDoughnutChart(dom, data) {
			const doughnutChart = echarts.init(dom)
			let option = {
				tooltip: {
					show: true,
					trigger: 'item',
					valueFormatter: (value) => {
						return value + '%'
					}
				},
				legend: {
					// left: 0,
					// itemGap: 50,
					// orient: 'vertical',
					textStyle: {
						fontSize: 11, //字体大小
						color: "#ffffff", //字体颜色
					},
				},
				series: [
					{
						// name: '年龄构成',
						type: 'pie',
						radius: ['30%', '80%'],
						avoidLabelOverlap: false,
						itemStyle: {
							borderRadius: 5,
							borderColor: '#fff',
							borderWidth: 3
						},
						label: {
							show: false,
							position: 'center'
						},
						emphasis: {
							label: {
								show: true,
								fontSize: 18,
								fontWeight: 'bold',
								formatter: function (params) {
									return params.percent + '%'
								}
							}
						},
						labelLine: {
							show: false
						},
						data: data
					}
				]
			}
			option && doughnutChart.setOption(option)
		},


		init3DPieChart(dom, data) {
			this.statusChart = echarts.init(dom);
			// 传入数据生成 option, 构建3d饼状图
			this.option = getPie3D(data, 0.6, 180, 26, 18, 1);
			this.statusChart.setOption(this.option);
			// 是否需要label指引线，如果要就添加一个透明的2d饼状图并调整角度使得labelLine和3d的饼状图对齐，并再次setOption
			this.option.series.push({
				backgroundColor: "transparent",
				type: "pie",
				label: {
					opacity: 1,
					fontSize: 13,
					lineHeight: 20,
				},
				startAngle: -40, // 起始角度，支持范围[0, 360]。
				clockwise: false, // 饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
				radius: ["20%", "60%"],
				center: ["50%", "50%"],
				data: data,
				itemStyle: {
					opacity: 0, //这里必须是0，不然2d的图会覆盖在表面
				},
			});
			this.statusChart.setOption(this.option);
		},

	},
};
</script>

<style scoped>
.security-left {
	width: 18%;
	height: 88%;
	position: absolute;
	z-index: 5;
	top: 9%;
	left: 0.8%;
	background: url("@/assets/speed/case/civil/broadside.png") no-repeat;
	background-size: 100% 100%;
	padding: 0.5%;
	text-align: center;
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
	background: url("@/assets/speed/case/civil/img_d.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 75%;
	/* bottom: 28%; */
	/* position: absolute; */
	display: flex;
	justify-content: space-evenly;

	margin-top: 12px;
}

.community-street {
	background: url("@/assets/speed/case/civil/bottom.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 50%;
	position: absolute;
	bottom: 0px;
}

.community {
	display: flex;
	align-items: stretch;
	justify-content: center;
	font-size: 14px;
	font-family: PangMenZhengDao-3, PangMenZhengDao-3-Regular;
	font-weight: 600;
	text-align: center;
	color: #ffffff;
	line-height: 35px;
	cursor: pointer;
	letter-spacing: 2.4px;
	background-image: -webkit-linear-gradient(bottom,
			#81c2ff 0%,
			#ffffff 63%,
			#f0fdff 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	cursor: pointer;
}

.community:hover {
	color: aquamarine;
	background-image: -webkit-linear-gradient(bottom,
			#81c2ff 0%,
			aquamarine 63%,
			aquamarine 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.communityhover {
	display: flex;
	align-items: stretch;
	justify-content: center;
	font-size: 14px;
	font-family: PangMenZhengDao-3, PangMenZhengDao-3-Regular;
	font-weight: 600;
	text-align: center;
	line-height: 35px;
	cursor: pointer;
	letter-spacing: 2.4px;
	color: aquamarine;
	background-image: -webkit-linear-gradient(bottom,
			#81c2ff 0%,
			aquamarine 63%,
			aquamarine 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

::v-deep .community-street .el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}

.el-dropdown {
	color: white;
	margin-left: calc(50% - 32px);
	margin-top: 12px;
}

.el-dropdown-link {
	text-align: center;
	padding-right: 11px;
	font-size: 15px;
	font-family: PangMenZhengDao-3, PangMenZhengDao-3-Regular;
	font-weight: bold;
	text-align: center;
	color: #ffffff;
	letter-spacing: 10px;
	background-image: -webkit-linear-gradient(bottom,
			#81c2ff 0%,
			#ffffff 63%,
			#f0fdff 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.circlar path {
	fill: none;
}

.circlar {
	width: 700px;
	height: 300px;
	margin: 100px;
	font-size: 12px;
}

.circlar svg {
	display: block;
	overflow: visible;
}

.doorplate-left {
	width: 21%;
	height: 88%;
	position: absolute;
	z-index: 5;
	top: 9%;
	left: 0.8%;
	background: url("@/assets/speed/case/civil/broadside.png") no-repeat;
	background-size: 100% 100%;
	padding: 0.5%;
	text-align: center;
}

.search_door {
	text-indent: 10%;
	color: white;
	background: transparent;
	width: 100%;
	line-height: 40px;
	border: none;
}

.search_btn {
	width: 40px;
	height: 40px;
	background-size: 100% 100%;
	background: url("@/assets/speed/case/civil/bt_ss.png") no-repeat;

	position: absolute;
	right: -4px;
	top: 5px;
}

/* .search {
  width: 35px;
  height: 35px;
  background-size: 100% 100%;
  background: url("@/assets/speed/case/civil/bt_ss.png") no-repeat;
  display: inline-block;
  position: absolute;
  right: 25px;
  top: 15px;
} */

.el-button {
	width: 10px;
	height: 18px;
}

.door_info {
	position: relative;
	margin: 14px 5px;
	height: 85%;
}

.doorTable {
	--el-table-border-color: #205c91;
	--el-table-row-hover-bg-color: rgb(47 235 253 / 45%);
	height: 100%;
	--el-table-text-color: #ffffff;
	--el-table-header-text-color: #35a7ff;
	--el-table-header-bg-color: #071a36;
}

.undoorTable {
	--el-table-border-color: #205c91;
	--el-table-row-hover-bg-color: rgb(47 235 253 / 45%);
	height: 100%;
	--el-table-text-color: #ffffff;
	--el-table-header-text-color: #35a7ff;
	--el-table-header-bg-color: #071a36;
}

.el-table tr {
	background-color: rgba(10, 29, 59, 0.651);
}

.el-table {
	--el-table-bg-color: #ffffff00;
}

.page {
	position: absolute;
	right: 15px;
}

.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
	background-color: #16489300;
	border: 1px solid #35a7ff;
	color: #ffffff;
}

.el-pagination.is-background .btn-next:disabled,
.el-pagination.is-background .btn-prev:disabled {
	color: #ffffff;
	background-color: #ffffff00;
}

.el-table .el-table__body-wrapper {
	background: #f6f8f900;
}

.doorplate-bottom {
	width: 46%;
	height: 12%;
	position: fixed;
	z-index: 5;
	bottom: 2.7%;
	left: 27%;
}

.doorplate-info {
	background: url("@/assets/speed/case/civil/community1.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 65%;
	bottom: 28%;
	position: absolute;
	display: flex;
}

.doorplate-street {
	background: url("@/assets/speed/case/civil/bu_xzqb.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 60%;
	position: absolute;
	bottom: 0.2%;
}

.select {
	position: absolute;
	left: 45%;
	top: 12%;
	font-size: 15px;
	font-weight: 700;
	width: 10%;
	letter-spacing: 2.4px;
	background-image: -webkit-linear-gradient(bottom,
			#81c2ff 0%,
			#ffffff 63%,
			#f0fdff 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	--el-checkbox-bg-color: #ffffff00;
}

.monitor-list {
	display: flex;
	justify-content: space-between;
}

.el-card {
	border: transparent;
	background-color: transparent;
	position: absolute;
	width: 50%;
	left: 25%;
	top: 3%;
	--el-card-padding: 0;
}

.btn {
	width: 20px;
	height: 20px;
	line-height: 100px;
	text-align: center;
	cursor: pointer;
	margin-top: 3%;
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

.chkLst {
	width: 65px;
	text-align: center;
	cursor: pointer;
	margin-left: 10px;
	font-weight: 700;
	color: white;
	--el-checkbox-bg-color: #ffffff00;
}

.doorplate-right {
	width: 21%;
	height: 88%;
	position: absolute;
	z-index: 5;
	top: 9%;
	right: 0.8%;
	background: url("@/assets/speed/case/civil/frame_y.png") no-repeat;
	background-size: 100% 100%;
	padding: 0.5%;
	text-align: center;
	transition: all 1s;
	transform: translateX(104%);
}

.doorplate-right[panelVisible="true"] {
	transform: translateX(0);
	opacity: 1;
}

#panelBtn {
	width: 10%;
	height: 18%;
	position: absolute;
	z-index: 5;
	left: -9.6%;
	top: 42%;
	background-size: 100% 100%;
	border: none;
	-el-button-hover-text-color: none;
	--el-button-hover-bg-color: none;
	--el-button-hover-border-color: none;
}

.open {
	background: url("@/assets/speed/case/civil/bt_sq.png") no-repeat;
}

.close {
	background: url("@/assets/speed/case/civil/bt_zk.png") no-repeat;
}

.mpshtj {
	width: 100%;
	height: 37%;
	padding: 2%;
	padding-top: 7%;
}

.unusualdoor {
	height: 55%;
	margin-top: 12%;
}

.message {
	background: url("@/assets/speed/case/civil/img_xx.png") no-repeat;
	background-size: 100% 100%;
	width: 36%;
	position: fixed;
	top: 12%;
	left: 32%;
	z-index: 10;
	color: #ffffff;
	font-size: 14px;
	text-align: center;
	line-height: 3;
	padding-left: 2%;
	padding-right: 1%;
	display: flex;
}

.message-content {
	display: flex;
	margin-left: 4%;
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
}

.door-plane {
	width: 95%;
	margin: 0 0 8px 8px;
	box-shadow: 0px 0px 14px 0px #4692ff inset;
	padding: 0 25px 20px 25px;
	font-size: 14px;
	font-family: Source Han Sans CN, Source Han Sans CN-Medium;
	font-weight: 800;
	text-align: left;
	color: #ffffff;
	background-color: rgb(7 26 54 / 65%);
}

.door-plane>.right-sub-text {
	background: #071a36;
	box-shadow: 0px 0px 14px 0px #35a7ff inset;
	font-size: 11px;
	font-weight: 600;
	float: right;
	width: 68px;
	margin-right: -24px;
	text-align: center;
	line-height: 25px;
	clear: both;
	font-size: 12px;
	font-family: Source Han Sans CN, Source Han Sans CN-Regular;
	font-weight: 400;
	color: #ffffff;
}

.door-plane>.list {
	width: 100%;
	line-height: 30px;
	cursor: pointer;
	display: flex;
	align-items: center;
	font-size: 14px;
	font-weight: 500;
	text-align: left;
	color: #ffffff;
}

.door-plane>.name {
	/* background: url("@/assets/speed/case/civil/img_xm.png") no-repeat;
  background-size: 100% 100%; */
	width: 186px;
	height: 60px;
	/* line-height: 54px; */
	text-align: center;
	font-size: 16px;
	font-weight: 800;
	position: relative;
}

.namecontent {
	bottom: 42px;
	position: relative;
	font-size: 17px;
	text-align: center;
	background-image: -webkit-linear-gradient(bottom, #81c2ff 0%, #ffffff 63%, #f0fdff 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.line {
	background: url("@/assets/speed/case/civil/line2.png") no-repeat;
	background-size: 100% 100%;
	width: 3px;
	height: 26px;
	position: absolute;
	left: 115px;
	top: 7px;
}

.list img {
	width: 20px;
	height: 20px;
	margin-right: 6px;
}

.fujian {
	line-height: 30px;
	border: 1px solid #35a7ff;
	font-size: 12px;
	padding: 0 10px;
	cursor: pointer;
}

.fujian img {
	width: 15px;
	height: 15px;
	margin-bottom: -3px;
}

.community-right {
	width: 18%;
	height: 88%;
	position: absolute;
	z-index: 5;
	top: 9%;
	right: 0.8%;

}

.input-search {
	/* text-indent: 10%; */
	color: white;
	background: url("@/assets/speed/case/civil/search.png") no-repeat;
	background-size: 100% 100%;
	margin: 12px;
	height: 40px;
	border: none;
}

.ndzzqs {
	width: 100%;
	height: 35%;
	/* margin-bottom: 3%; */
}

.ndzzqs_title {
	position: absolute;
	background: url("@/assets/speed/case/civil/ndzzqs_title.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 4.5%;
}

.ndzzqs_back {
	background: url("@/assets/speed/case/civil/ssjk_content.png") no-repeat;
	background-size: 100% 100%;
	padding: 5%;
	padding-top: 12%;
	position: absolute;
	width: 100%;
	height: 35%;
	display: flex;
}

.nltb {
	width: 100%;
	height: 32%;
	/* margin-bottom: 3%; */

}

.nltb_title {
	position: absolute;
	background: url("@/assets/speed/case/civil/nlgc.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 4.5%;
}

.nltb_back {
	background: url("@/assets/speed/case/civil/ssjk_content.png") no-repeat;
	background-size: 100% 100%;
	padding: 5%;
	padding-top: 12%;
	position: absolute;
	width: 100%;
	height: 32%;
	display: flex;
}


.rstj {
	width: 100%;
	height: 33%;
	/* margin-bottom: 3%; */
}

.rstj_title {
	position: absolute;
	background: url("@/assets/speed/case/civil/rstj.png") no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 4.5%;
}

.rstj_back {
	background: url("@/assets/speed/case/civil/ssjk_content.png") no-repeat;
	background-size: 100% 100%;
	padding: 5%;
	padding-top: 12%;
	position: absolute;
	width: 100%;
	height: 33%;
	display: flex;
}

::v-deep .el-input__wrapper {
	background-color: transparent;
	box-shadow: none;
}

::v-deep .el-select {
	box-shadow: 0 0 0 transparent;
}

::v-deep .el-input.is-focus {
	box-shadow: 0 0 0 transparent;
}

::v-deep .el-input__wrappers {
	box-shadow: 0 0 0 transparent;
}
</style>
