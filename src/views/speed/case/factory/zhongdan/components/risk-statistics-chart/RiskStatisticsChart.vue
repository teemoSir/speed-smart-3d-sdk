<template>
	<div class="risk-statistics-chart" ref="riskStatisticsChart"></div>
</template>

<script>
import * as echarts from "echarts";

let _chart;

export default {
	name: "RiskStatisticsChart",
	mounted() {
		_chart = echarts.init(this.$refs.riskStatisticsChart);
		_chart.setOption({
			color: ["#e64334", "#d4a12d", "#00b8ff", "#34efa2"],
			tooltip: {
				trigger: "item"
			},
			legend: {
				itemWidth: 15,
				itemHeight: 15,
				icon: "rectangle",
				textStyle: {
					color: "white"
				},
				data: [
					{
						name: "重大风险"
					},
					{
						name: "较大风险"
					},
					{
						name: "一般风险"
					},
					{
						name: "低风险"
					}
				]
			},
			radar: {
				center: ["50%", "60%"],
				radius: "65%",
				indicator: [
					{name: "1厂区", max: 100, color: "white"},
					{name: "2厂区", max: 100, color: "white"},
					{name: "3厂区", max: 100, color: "white"},
					{name: "4厂区", max: 100, color: "white"},
					{name: "5厂区", max: 100, color: "white"},
				],
				splitLine: {
					lineStyle: {
						color: "#7e828c",
						width: 2
					}
				},
				splitArea: {
					areaStyle: {
						color: "#032025a6"
					}
				},
				axisLine: {
					show: false
				}
			},
			series: [
				{
					type: "radar",
					data: [
						{
							value: [10, 50, 30, 59, 29],
							name: "重大风险",
							areaStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: "#e64334"
									},
									{
										offset: 1,
										color: "#e6433499"
									}
								])
							}
						},
						{
							value: [20, 68, 19, 65, 91],
							name: "较大风险",
							areaStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: "#d4a12d"
									},
									{
										offset: 1,
										color: "#d4a12d99"
									}
								])
							}
						},
						{
							value: [49, 20, 69, 12, 93],
							name: "一般风险",
							areaStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: "#00b8ff"
									},
									{
										offset: 1,
										color: "#00b8ff99"
									}
								])
							}
						},
						{
							value: [83, 68, 10, 69, 89],
							name: "低风险",
							areaStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: "#34efa2"
									},
									{
										offset: 1,
										color: "#34efa299"
									}
								])
							}
						}
					]
				}
			]
		});
		window.addEventListener("resize", this.resizeChart);
	},
	beforeUnmount() {
		window.removeEventListener("resize", this.resizeChart);
	},
	methods: {
		resizeChart() {
			if (_chart) {
				_chart.resize();
			}
		}
	},
}
</script>

<style lang="scss" scoped>
.risk-statistics-chart {
	width: 100%;
	height: 100%;
	//min-height: 150px;
}
</style>
