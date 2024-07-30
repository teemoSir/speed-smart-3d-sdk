<template>
	<div class="indicator-chart" ref="indicatorChart"></div>
</template>

<script>
import * as echarts from "echarts";

let _chart;

export default {
	name: "IndicatorChart",
	mounted() {
		_chart = echarts.init(this.$refs.indicatorChart);
		_chart.setOption({
			color: ["#00b8ff", "#34efb1", "#0069ff"],
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "cross",
					label: {
						backgroundColor: "#6a7985"
					}
				}
			},
			grid: {
				top: 15,
				left: 10,
				right: 20,
				bottom: 0,
				containLabel: true
			},
			xAxis: {
				type: "category",
				boundaryGap: true,
				axisLine: {
					show: true,
					lineStyle: {
						color: "#1a3f4a"
					}
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					color: "#a2eefc",
					fontSize: "14px",
				},
				data: ["1月", "2月", "3月", "4月", "5月", "6月"]
			},
			yAxis: {
				type: "value",
				axisLine: {
					show: true,
					lineStyle: {
						color: "#1a3f4a"
					}
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: "#1a3f4a4c",
					},
				},
				axisLabel: {
					color: "#a2eefc",
					fontSize: "14px",
				},
			},
			series: [
				{
					name: "财务指标",
					type: "bar",
					barWidth: 10,
					showSymbol: false,
					data: [600, 600, 600, 600, 600, 600]
				},
				{
					name: "生产指标",
					type: "bar",
					barWidth: 10,
					showSymbol: false,
					data: [1220, 182, 191, 234, 290, 330, 310]
				},
				{
					name: "项目进度",
					type: "line",
					smooth: false,
					showSymbol: false,
					lineStyle: {
						width: 3
					},
					areaStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{
								offset: 0,
								color: "#0069ff"
							},
							{
								offset: 1,
								color: "#0069ff99"
							}
						])
					},
					data: [320, 332, 301, 334, 390, 330, 320]
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
.indicator-chart {
	width: 100%;
	height: 100%;
	//min-height: 120px;
}
</style>
