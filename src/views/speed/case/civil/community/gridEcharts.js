import * as echarts from "echarts";
import "echarts-gl";
import { getPie3D, getParametricEquation } from "./createPie3DChart";
/**
 * 柱状图
 * @param {*} dataAxis
 * @param {*} data
 * @param {*} chart
 */
export function createBarChart(
	dataAxis,
	data,
	chart,
	title,
	xname,
	yname,
	man,
	woman
) {
	draw3dBarChart();
	const myChart = echarts.init(chart);
	let option = {
		title: title,
		xAxis: {
			name: xname,
			nameTextStyle: {
				fontSize: 12,
				color: "#ffffff",
				fontWeight: "bold",
				verticalAlign: "top",
				padding: [25, 0, 0, -40],
			},
			data: dataAxis,
			axisTick: {
				show: false,
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: "#9DA3AD",
				},
			},
			axisLabel: {
				color: "#ffffff",
			},
		},
		yAxis: {
			name: yname,
			nameTextStyle: {
				fontSize: 12,
				color: "#ffffff",
				fontWeight: "bold",
			},
			axisLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				color: "#ffffff",
			},
			splitLine: {
				lineStyle: {
					type: "dashed", //虚线
				},
				show: true,
			},
		},
		series: [
			{
				type: "custom",
				renderItem: (params, api) => {
					let cubeLeftStyle = "";
					let cubeRightStyle = "";
					let cubeTopStyle = "";
					cubeLeftStyle = new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[
							{
								offset: 0,
								color: "rgba(57,206,255,1)",
							},
							{
								offset: 1,
								color: "rgba(45,72,173,0.1)",
							},
						]
					);
					cubeRightStyle = new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[
							{
								offset: 0,
								color: "rgba(36,201,255,1)",
							},
							{
								offset: 1,
								color: "rgba(20,43,128,0.2)",
							},
						]
					);
					cubeTopStyle = new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[
							{
								offset: 0,
								color: "rgba(0,222,255,1)",
							},
							{
								offset: 1,
								color: "rgba(0,222,255,1)",
							},
						]
					);
					const location = api.coord([api.value(0), api.value(1)]);
					return {
						type: "group",
						children: [
							{
								type: "CubeLeft",
								shape: {
									api,
									xValue: api.value(0),
									yValue: api.value(1),
									x: location[0],
									y: location[1],
									xAxisPoint: api.coord([api.value(0), 0]),
								},
								style: {
									fill: cubeLeftStyle,
								},
							},
							{
								type: "CubeRight",
								shape: {
									api,
									xValue: api.value(0),
									yValue: api.value(1),
									x: location[0],
									y: location[1],
									xAxisPoint: api.coord([api.value(0), 0]),
								},
								style: {
									fill: cubeRightStyle,
								},
							},
							{
								type: "CubeTop",
								shape: {
									api,
									xValue: api.value(0),
									yValue: api.value(1),
									x: location[0],
									y: location[1],
									xAxisPoint: api.coord([api.value(0), 0]),
								},
								style: {
									fill: cubeTopStyle,
								},
							},
						],
					};
				},
				data: data,
			},
			{
				type: "bar",
				label: {
					normal: {
						show: true,
						position: "top",
						fontSize: 12,
						color: "#fff",
						offset: [2, -25],
					},
				},
				itemStyle: {
					color: "transparent",
				},
				data: data,
			},
			{
				name: "男性",
				type: "line",
				data: man,
			},
			{
				name: "女性",
				type: "line",
				data: woman,
			},
		],
		grid: {
			left: "12%",
			right: "2%",
		},
		tooltip: {
			backgroundColor: "rgba(36,201,255,0.50)",
			borderColor: "rgba(36,201,255,0.20)",
			borderWidth: 1,
			textStyle: {
				// 文字提示样式
				color: "#fff",
				fontSize: "12",
			},
			trigger: "item",
			// axisPointer: {
			// 	type: 'shadow'
			// },
			// formatter: function (params, ticket, callback) {
			// 	const item = params[1]
			// 	return item.name + ' (岁): ' + item.value + ' (人) ';
			// }
		},
		// legend: {
		// 	itemGap: 30, //legend中几个选项之间的间距
		// 	data: ['男性', '女性'], //此处的data数据要与下面series里面的name对应
		// 	textStyle: {
		// 		color: '#ffffff'
		// 	},
		//   },
		legend: [
			// {
			//   left: '10%',
			//   itemWidth: 8,
			//   itemHeight: 8,
			//   data: [
			// 	{
			// 	  name: '进水水量',
			// 	  icon: 'circle',
			// 	  textStyle: {
			// 		fontSize: 14,
			// 		color: 'rgba(255,255,255,0.8)',
			// 	  },
			// 	},
			//   ],
			// },
			// {
			//   left: '30%',
			//   itemWidth: 8,
			//   itemHeight: 8,
			//   data: [
			// 	{
			// 	  name: '出水水量',
			// 	  icon: 'circle',
			// 	  textStyle: {
			// 		fontSize: 14,
			// 		color: 'rgba(255,255,255,0.8)',
			// 	  },
			// 	},
			//   ],
			// },
			{
				left: "60%",
				itemWidth: 12,
				itemHeight: 2,
				data: [
					{
						name: "男性",
						icon: "rect",
						textStyle: {
							fontSize: 14,
							color: "#ffffff",
						},
					},
				],
			},
			{
				left: "80%",
				textStyle: {
					color: "#71F003",
					fontSize: 15,
					fontFamily: "微软雅黑",
				},
				itemWidth: 12,
				itemHeight: 2,
				data: [
					{
						name: "女性",
						icon: "rect",
						textStyle: {
							fontSize: 14,
							color: "#ffffff",
						},
					},
				],
			},
		],
	};
	option && myChart.setOption(option);
}

function draw3dBarChart() {
	// 绘制左侧面
	const CubeLeft = echarts.graphic.extendShape({
		shape: {
			x: 0,
			y: 0,
		},
		buildPath: function (ctx, shape) {
			//shape是从custom传入的
			const xAxisPoint = shape.xAxisPoint;
			const c0 = [shape.x + 3.5, shape.y];
			const c1 = [shape.x - 11.5, shape.y - 3];
			const c2 = [xAxisPoint[0] - 11.5, xAxisPoint[1] - 6.5];
			const c3 = [xAxisPoint[0] + 3.5, xAxisPoint[1]];
			ctx.moveTo(c0[0], c0[1])
				.lineTo(c1[0], c1[1])
				.lineTo(c2[0], c2[1])
				.lineTo(c3[0], c3[1])
				.closePath();
		},
	});
	// 绘制右侧面
	const CubeRight = echarts.graphic.extendShape({
		shape: {
			x: 0,
			y: 0,
		},
		buildPath: function (ctx, shape) {
			const xAxisPoint = shape.xAxisPoint;
			const c1 = [shape.x + 3, shape.y];
			const c2 = [xAxisPoint[0] + 3, xAxisPoint[1]];
			const c3 = [xAxisPoint[0] + 12, xAxisPoint[1] - 7];
			const c4 = [shape.x + 12, shape.y - 7];
			ctx.moveTo(c1[0], c1[1])
				.lineTo(c2[0], c2[1])
				.lineTo(c3[0], c3[1])
				.lineTo(c4[0], c4[1])
				.closePath();
		},
	});
	// 绘制顶面
	const CubeTop = echarts.graphic.extendShape({
		shape: {
			x: 0,
			y: 0,
		},
		buildPath: function (ctx, shape) {
			const c1 = [shape.x + 3.5, shape.y];
			const c2 = [shape.x + 12.5, shape.y - 7.5]; //右点
			const c3 = [shape.x - 2.5, shape.y - 10];
			const c4 = [shape.x - 11.5, shape.y - 3];
			ctx.moveTo(c1[0], c1[1])
				.lineTo(c2[0], c2[1])
				.lineTo(c3[0], c3[1])
				.lineTo(c4[0], c4[1])
				.closePath();
		},
	});
	// 注册三个面图形
	echarts.graphic.registerShape("CubeLeft", CubeLeft);
	echarts.graphic.registerShape("CubeRight", CubeRight);
	echarts.graphic.registerShape("CubeTop", CubeTop);
}

/**
 * 饼状图
 * @param {*} data
 * @param {*} chart
 * @param {*} title
 */
export function createPieChart(data, chart, title) {
	const myChart = echarts.init(chart);
	let option = {
		title: {
			text: title,
			left: "center",
		},
		tooltip: {
			trigger: "item",
			backgroundColor: "rgba(36,201,255,0.50)",
			borderColor: "rgba(36,201,255,0.20)",
			borderWidth: 1,
			textStyle: {
				color: "#fff",
				fontSize: "12",
			},
		},
		// color: ['#00A8FF', '#00D7E9'],
		legend: {
			orient: "horizontal",
			right: "left",
			textStyle: {
				color: "#ffffff",
			},
		},
		series: [
			{
				type: "pie",
				radius: "50%",
				data: data,
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: "rgba(0, 0, 0, 0.5)",
					},
				},
				label: {
					normal: {
						textStyle: {
							color: "#ffffff",
							fontSize: 14,
							fontWeight: 700,
						},
					},
				},
			},
		],
	};
	option && myChart.setOption(option);
}

/**
 * 折线图
 * @param {*} years
 * @param {*} data
 * @param {*} chart
 */
export function createLineChart(years, data, chart) {
	const myChart = echarts.init(chart);
	let option = {
		xAxis: {
			type: "category",
			data: years,
			name: "年份",
			nameTextStyle: {
				fontSize: 12,
				color: "#ffffff",
				fontWeight: "bold",
				verticalAlign: "top",
				padding: [25, 0, 0, -40],
			},
			axisLabel: {
				color: "#ffffff",
			},
			axisTick: {
				show: false,
			},
			axisLine: {
				show: true,
			},
		},
		yAxis: {
			type: "value",
			name: "人数",
			nameTextStyle: {
				fontSize: 12,
				color: "#ffffff",
				fontWeight: "bold",
			},
			axisLabel: {
				color: "#ffffff",
			},
			splitLine: {
				lineStyle: {
					type: "dashed",
				},
				show: true,
			},
		},
		series: [
			{
				name: data[0].name,
				data: data[0].data,
				type: "line",
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
			},
			{
				name: data[1].name,
				data: data[1].data,
				type: "line",
				smooth: true,
				lineStyle: {
					normal: {
						color: "rgba(27,199,255,1)",
					},
				},

				itemStyle: {
					normal: {
						color: "rgba(27,199,255,1)",
					},
				},
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
									color: "rgba(27,199,255,0.9)", // 0% 处的颜色
								},
								{
									offset: 0.9,
									color: "rgba(27,199,255,0.1)", // 100% 处的颜色
								},
							],
						},
					},
				},
			},
		],
		grid: {
			left: "14%",
			right: "2%",
		},
		tooltip: {
			trigger: "axis",
			backgroundColor: "rgba(36,201,255,0.50)",
			borderColor: "rgba(36,201,255,0.20)",
			borderWidth: 1,
			textStyle: {
				color: "#fff",
				fontSize: "12",
			},
		},
		color: ["#1FE4F8", "#1BC7FF"],
		legend: {
			data: [data[0].name, data[1].name],
			right: "left",
			textStyle: {
				color: "#ffffff",
			},
		},
	};
	option && myChart.setOption(option);
}

export function create3DPieChart(chart, optionData, option) {
	optionData = setLabel(optionData);
	let statusChart = echarts.init(chart);
	// 传入数据生成 option, 构建3d饼状图, 参数工具文件已经备注的很详细
	option = getPie3D(optionData, 0, 280, 28, 15, 1);
	statusChart.setOption(option);
	// 是否需要label指引线，如果要就添加一个透明的2d饼状图并调整角度使得labelLine和3d的饼状图对齐，并再次setOption
	option.series.push({
		name: "性别分布",
		backgroundColor: "transparent",
		type: "pie",
		label: {
			opacity: 1,
			fontSize: 13,
			lineHeight: 20,
		},
		startAngle: -40, // 起始角度，支持范围[0, 360]。
		clockwise: false, // 饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
		radius: ["20%", "50%"],
		center: ["50%", "50%"],
		data: optionData,
		itemStyle: {
			opacity: 0, //这里必须是0，不然2d的图会覆盖在表面
		},
	});
	statusChart.setOption(option);
	bindListen(statusChart);
}
const color = ["#06ABFF", "#00D7E9"];
// 初始化label样式
function setLabel(optionData) {
	optionData.forEach((item, index) => {
		item.itemStyle = {
			color: color[index],
		};
		item.label = {
			normal: {
				show: true,
				color: color[index],
				formatter: ["{b|{b}}", "{c|{c}}"].join(""), // 用来换行
				rich: {
					b: {
						fontSize: 14,
						color: "#fff",
						lineHeight: 25,
						align: "left",
					},
					c: {
						fontSize: 14,
						color: "#fff",
						textShadowColor: "#1c90a6",
						textShadowOffsetX: 0,
						textShadowOffsetY: 2,
						textShadowBlur: 5,
					},
				},
			},
		};
		item.labelLine = {
			normal: {
				lineStyle: {
					width: 1,
					color: "rgba(255,255,255,0.7)",
				},
			},
		};
	});
	return optionData;
}

// 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
// optionName是防止有多个图表进行定向option传递，单个图表可以不传，默认是opiton
export function bindListen(myChart, optionName = "option") {
	let selectedIndex = "";
	let hoveredIndex = "";
	// 监听点击事件，实现选中效果（单选）
	myChart.on("click", (params) => {
		// 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
		const isSelected =
			!this[optionName].series[params.seriesIndex].pieStatus.selected;
		const isHovered =
			this[optionName].series[params.seriesIndex].pieStatus.hovered;
		const k = this[optionName].series[params.seriesIndex].pieStatus.k;
		const startRatio =
			this[optionName].series[params.seriesIndex].pieData.startRatio;
		const endRatio =
			this[optionName].series[params.seriesIndex].pieData.endRatio;
		// 如果之前选中过其他扇形，将其取消选中（对 option 更新）
		if (selectedIndex !== "" && selectedIndex !== params.seriesIndex) {
			this[optionName].series[selectedIndex].parametricEquation =
				getParametricEquation(
					this[optionName].series[selectedIndex].pieData.startRatio,
					this[optionName].series[selectedIndex].pieData.endRatio,
					false,
					false,
					k,
					this[optionName].series[selectedIndex].pieData.value
				);
			this[optionName].series[selectedIndex].pieStatus.selected = false;
		}
		// 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
		this[optionName].series[params.seriesIndex].parametricEquation =
			getParametricEquation(
				startRatio,
				endRatio,
				isSelected,
				isHovered,
				k,
				this[optionName].series[params.seriesIndex].pieData.value
			);
		this[optionName].series[params.seriesIndex].pieStatus.selected =
			isSelected;
		// 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
		selectedIndex = isSelected ? params.seriesIndex : null;
		// 使用更新后的 option，渲染图表
		myChart.setOption(this[optionName]);
	});
	// 监听 mouseover，近似实现高亮（放大）效果
	myChart.on("mouseover", (params) => {
		// 准备重新渲染扇形所需的参数
		let isSelected;
		let isHovered;
		let startRatio;
		let endRatio;
		let k;
		// 如果触发 mouseover 的扇形当前已高亮，则不做操作
		if (hoveredIndex === params.seriesIndex) {
			// 否则进行高亮及必要的取消高亮操作
		} else {
			// 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
			if (hoveredIndex !== "") {
				// 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
				isSelected =
					this[optionName].series[hoveredIndex].pieStatus.selected;
				isHovered = false;
				startRatio =
					this[optionName].series[hoveredIndex].pieData.startRatio;
				endRatio =
					this[optionName].series[hoveredIndex].pieData.endRatio;
				k = this[optionName].series[hoveredIndex].pieStatus.k;
				// 对当前点击的扇形，执行取消高亮操作（对 option 更新）
				this[optionName].series[hoveredIndex].parametricEquation =
					getParametricEquation(
						startRatio,
						endRatio,
						isSelected,
						isHovered,
						k,
						this[optionName].series[hoveredIndex].pieData.value
					);
				this[optionName].series[hoveredIndex].pieStatus.hovered =
					isHovered;
				// 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
				hoveredIndex = "";
			}
			// 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
			if (
				params.seriesName !== "mouseoutSeries" &&
				params.seriesName !== "pie2d"
			) {
				// 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
				isSelected =
					this[optionName].series[params.seriesIndex].pieStatus
						.selected;
				isHovered = true;
				startRatio =
					this[optionName].series[params.seriesIndex].pieData
						.startRatio;
				endRatio =
					this[optionName].series[params.seriesIndex].pieData
						.endRatio;
				k = this[optionName].series[params.seriesIndex].pieStatus.k;
				// 对当前点击的扇形，执行高亮操作（对 option 更新）
				this[optionName].series[params.seriesIndex].parametricEquation =
					getParametricEquation(
						startRatio,
						endRatio,
						isSelected,
						isHovered,
						k,
						this[optionName].series[params.seriesIndex].pieData
							.value + 60
					);
				this[optionName].series[params.seriesIndex].pieStatus.hovered =
					isHovered;
				// 记录上次高亮的扇形对应的系列号 seriesIndex
				hoveredIndex = params.seriesIndex;
			}
			// 使用更新后的 option，渲染图表
			myChart.setOption(this[optionName]);
		}
	});
	// 修正取消高亮失败的 bug
	myChart.on("globalout", () => {
		// 准备重新渲染扇形所需的参数
		let isSelected;
		let isHovered;
		let startRatio;
		let endRatio;
		let k;
		if (hoveredIndex !== "") {
			// 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
			isSelected =
				this[optionName].series[hoveredIndex].pieStatus.selected;
			isHovered = false;
			k = this[optionName].series[hoveredIndex].pieStatus.k;
			startRatio =
				this[optionName].series[hoveredIndex].pieData.startRatio;
			endRatio = this[optionName].series[hoveredIndex].pieData.endRatio;
			// 对当前点击的扇形，执行取消高亮操作（对 option 更新）
			this[optionName].series[hoveredIndex].parametricEquation =
				getParametricEquation(
					startRatio,
					endRatio,
					isSelected,
					isHovered,
					k,
					this[optionName].series[hoveredIndex].pieData.value
				);
			this[optionName].series[hoveredIndex].pieStatus.hovered = isHovered;
			// 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
			hoveredIndex = "";
		}
		// 使用更新后的 option，渲染图表
		myChart.setOption(this[optionName]);
	});
}

/**
 * 智慧乡村-设施状态
 * @param {*} data
 * @param {*} chart
 */
export function createCircleChart(data, chart) {
	const myChart = echarts.init(chart);
	let colors = ["#21BAD6", "#fac858", "#ee6666"];
	var img = require("@/assets/speed/case/civil/status.png");
	let option = {
		color: colors,
		tooltip: {
			backgroundColor: "rgba(36,201,255,0.50)",
			borderColor: "rgba(36,201,255,0.20)",
			borderWidth: 1,
			textStyle: {
				color: "#fff",
				fontSize: "12",
			},
			trigger: "item",
			valueFormatter: function (value) {
				return ((value / 89) * 100).toFixed(2) + "%";
			},
		},
		legend: {
			align: "left",
			itemGap: 5,
			itemWidth: 10, // 设置宽度
			itemHeight: 10, // 设置高度
			textStyle: {
				color: "#ffffff",
				rich: {
					name: {
						verticalAlign: "right",
						align: "left",
					},
					value: {
						align: "left",
					},
					count: {
						align: "left",
					},
					upRate: {
						align: "left",
					},
					downRate: {
						align: "left",
					},
				},
			},
			formatter: function (name) {
				var total = 0;
				var tarValue;
				for (var i = 0; i < data.length; i++) {
					total += data[i].value;
					if (name === data[i].name) {
						tarValue = data[i].value;
					}
				}
				var p = ((tarValue / total) * 100).toFixed(2);
				return "{name| " + name + "}" + "{value| " + p + "%}";
			},
		},
		graphic: [
			{
				type: "image",
				style: {
					image: img,
					width: 48,
					height: 48,
					color: "#fff",
				},
				left: "center",
				top: "center",
			},
		],
		series: [
			{
				minAngle: 15, //扇区最小角度
				startAngle: 190, //扇区起始角度
				name: "设备状态",
				type: "pie",
				avoidLabelOverlap: true,
				legendHoverLink: true,
				radius: ["50%", "67%"],
				data: data,

				label: {
					alignTo: "edge",
					formatter: "{name|{b}} {value|{c}}个",
					minMargin: 5,
					edgeDistance: 10,
					lineHeight: 15,
					rich: {
						time: {
							fontSize: 10,
							color: "#999",
						},
					},
					color: "#FFF",
				},
				labelLine: {
					length: 15,
					length2: 0,
					maxSurfaceAngle: 80,
				},
			},
			{
				minAngle: 15, //扇区最小角度
				startAngle: 190, //扇区起始角度
				name: "设备状态",
				type: "pie",
				avoidLabelOverlap: true,
				legendHoverLink: true,
				radius: ["40%", "50%"],
				data: data,
				// 点击不放大
				silent: true,
				// 点击不放大，但是显示tooltip
				emphasis: {
					//使用emphasis
					disable: false,
					scale: false, //不缩放
					scaleSize: 0, //为了防止失效直接设置未0
				},
				itemStyle: {
					opacity: 0.7,
				},
				label: {
					show: false,
				},
			},
		],
	};

	option && myChart.setOption(option);
}

/**
 * 智慧社区-网格事件
 * @param {*} data
 * @param {*} chart
 */
export function createWGSJPieChart(data, chart) {
	const myChart = echarts.init(chart);
	let option = {
		title: {
			text: "{b|事件总数}\n{a|194}",
			textStyle: {
				rich: {
					a: {
						fontSize: 15,
						color: "#FFF",
					},
					b: {
						fontSize: 15,
						color: "#FFF",
					},
				},
			},
			left: "center",
			top: "center",
		},

		tooltip: {
			backgroundColor: "rgba(36,201,255,0.50)",
			borderColor: "rgba(36,201,255,0.20)",
			borderWidth: 1,
			textStyle: {
				color: "#fff",
				fontSize: "12",
			},
			valueFormatter: function (value) {
				return ((value / 89) * 100).toFixed(2) + "%";
			},
		},
		series: [
			{
				name: "网格事件",
				type: "pie",
				radius: ["40%", "50%"],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 20,
				},
				label: {
					formatter: "{name|{b}}\n{value|{c} 件}",
					minMargin: 5,
					edgeDistance: 10,
					lineHeight: 15,
					rich: {
						name: {
							fontSize: 12,
							color: "#FFF",
						},
						value: {
							fontSize: 10,
							color: "#FFF",
						},
					},
				},

				labelLayout: function (params) {
					const isLeft = params.labelRect.x < myChart.getWidth() / 2;
					const points = params.labelLinePoints;
					// Update the end point.
					points[2][0] = isLeft
						? params.labelRect.x
						: params.labelRect.x + params.labelRect.width;
					return {
						labelLinePoints: points,
					};
				},
				data: data,
			},
		],
	};
	option && myChart.setOption(option);
}

/**
 * 门牌异常统计
 */
export function createMPPieChart(mpdata, chart) {
	let color = [
		"#00ffff",
		"#00cfff",
		"#006ced",
		"#ffe000",
		"#ffa800",
		"#ff5b00",
		"#ff3000",
	];
	let img =
		"data:image/png;base64,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";
	let data = [];

	for (let i = 0; i < mpdata.length; i++) {
		data.push(
			{
				value: mpdata[i].value,
				name: mpdata[i].name,
				itemStyle: {
					normal: {
						borderWidth: 5,
						shadowBlur: 20,
						borderColor: color[i],
						shadowColor: color[i],
					},
				},
			},
			{
				value: 2,
				name: "",
				itemStyle: {
					normal: {
						label: {
							show: false,
						},
						labelLine: {
							show: false,
						},
						color: "rgba(0, 0, 0, 0)",
						borderColor: "rgba(0, 0, 0, 0)",
						borderWidth: 0,
					},
				},
			}
		);
	}
	let seriesOption = [
		{
			name: "",
			type: "pie",
			clockWise: false,
			radius: [65, 69],
			hoverAnimation: false,
			itemStyle: {
				normal: {
					label: {
						show: true,
						position: "outside",
						color: "#fff",
						formatter: function (params) {
							let percent = 0;
							let total = 0;
							for (let i = 0; i < mpdata.length; i++) {
								total += mpdata[i].value;
							}
							percent = ((params.value / total) * 100).toFixed(0);
							if (params.name !== "") {
								return params.name +" "+percent +"%"
							} else {
								return "";
							}
						},
					},
					labelLine: {
						// length: 30,
						// length2: 30,
						show: true,
						color: "#00ffff",
					},
				},
			},
			data: data,
			center:["50%", "55%"]
		},
	];
	let option = {
		//backgroundColor: "#0A2E5D",
		color: color,
		title: {
			text: "异常门牌",
			top: "51%",
			textAlign: "center",
			left: "49%",
			textStyle: {
				color: "#fff",
				fontSize: 15,
				fontWeight: "700",
			},
		},
		graphic: {
			elements: [
				{
					type: "image",
					z: 3,
					style: {
						image: img,
						width: 100,
						height: 100,
					},
					left: "center",
					top: "36%",
					position: [100, 100],
				},
			],
		},
		tooltip: {
			show: true,
			backgroundColor: "rgba(36,201,255,0.50)",
			borderColor: "rgba(36,201,255,0.20)",
			textStyle: {
				color: "#fff",
				fontSize: "12",
			},
		},
		legend: {
			icon: "circle",
			orient: "horizontal",
			itemWidth: 10, // 设置宽度
			itemHeight: 10, // 设置高度
			// x: 'left',
			data: ["I级", "II级", "III级", "IV级"],
			top: 10,
			//align: "right",
			textStyle: {
				color: "#fff",
			},
			itemGap: 20,
		},
		toolbox: {
			show: false,
		},
		series: seriesOption,
	};

	const myChart = echarts.init(chart);
	option && myChart.setOption(option);
}
