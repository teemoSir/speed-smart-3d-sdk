<template>
	<div class="energy-chart" ref="energyChart"></div>
</template>

<script>
import * as echarts from "echarts";

let _chart;

export default {
	name: "EnergyChart",
	mounted() {
		_chart = echarts.init(this.$refs.energyChart);
		_chart.setOption({
			color: ["#00b8ff", "#d4942d", "#14bcda", "#0069ff"],
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "cross",
					label: {
						backgroundColor: "#6a7985"
					}
				}
			},
			legend: {
				top: 0,
				right: "4%",
				data: [
					{
						name: "综合指标",
						itemStyle: {
							color: "transparent"
						},
						lineStyle: {
							type: "dashed"
						}
					},
					{
						name: "水",
						itemStyle: {
							color: "transparent"
						},
					},
					{
						name: "电",
					},
					{
						name: "气",
					}
				],
				textStyle: {
					color: "white"
				}
			},
			grid: {
				top: 40,
				left: 10,
				right: 20,
				bottom: 0,
				containLabel: true
			},
			xAxis: {
				type: "category",
				boundaryGap: false,
				axisLine: {
					show: true,
					lineStyle: {
						color: "white"
					}
				},
				axisTick: {
					show: true
				},
				data: ["1月", "2月", "3月", "4月", "5月", "6月"]
			},
			yAxis: {
				type: "value",
				axisLine: {
					show: true,
					lineStyle: {
						color: "white"
					}
				},
				axisTick: {
					show: true
				},
				splitLine: {
					show: false
				}
			},
			series: [
				{
					name: "综合指标",
					type: "line",
					smooth: true,
					showSymbol: false,
					lineStyle: {
						type: "dashed"
					},
					data: [600, 600, 600, 600, 600, 600]
				},
				{
					name: "水",
					type: "line",
					smooth: true,
					showSymbol: false,
					lineStyle: {
						width: 3
					},
					areaStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{
								offset: 0,
								color: "#d4942d"
							},
							{
								offset: 1,
								color: "#d4942d99"
							}
						])
					},
					data: [1220, 182, 191, 234, 290, 330, 310]
				},
				{
					name: "电",
					type: "line",
					smooth: true,
					showSymbol: false,
					lineStyle: {
						width: 3
					},
					areaStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{
								offset: 0,
								color: "#14bcda"
							},
							{
								offset: 1,
								color: "#14bcda99"
							}
						])
					},
					data: [150, 232, 201, 154, 190, 330, 410]
				},
				{
					name: "气",
					type: "line",
					smooth: true,
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
.energy-chart {
	width: 100%;
	height: 100%;
	//min-height: 150px;
}
</style>
