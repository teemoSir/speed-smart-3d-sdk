<template>
	<div class="order-chart">
		<div class="chart-container" ref="orderChart"></div>
		<el-scrollbar>
			<div class="chart-legend-container">
				<div class="chart-legend" v-for="item in data" :key="item.id">
					<div class="color" :style="{backgroundColor: `${item.color}`}"></div>
					<span class="type">{{ item.name }}</span>
					<span class="value" :style="{color: `${item.color}`}">{{ item.value }}{{ item.unit }}</span>
				</div>
			</div>
		</el-scrollbar>
	</div>
</template>

<script>
import * as echarts from "echarts";

let _chart;

export default {
	name: "OrderChart",
	data() {
		return {
			data: [
				{
					id: "count",
					name: "订单总量",
					value: 120,
					unit: "单",
					color: "#00a2ff",
				},
				{
					id: "done",
					name: "已完成订单",
					value: 100,
					unit: "单",
					color: "#0065f5",
				},
				{
					id: "todo",
					name: "待完成订单",
					value: 20,
					unit: "单",
					color: "#14bcda",
				},
				{
					id: "type-amount",
					name: "订单品类",
					value: 5,
					unit: "类",
					color: "#d4ae2d",
				},
				{
					id: "amount",
					name: "订单总金额",
					value: 1000,
					unit: "万",
					color: "#ee8529",
				},
			],
		};
	},
	mounted() {
		_chart = echarts.init(this.$refs.orderChart);
		_chart.setOption({
			color: ["#00a2ff", "#0065f5", "#14bcda", "#d4ae2d", "#ee8529"],
			tooltip: {
				trigger: "item",
				position: "right",
			},
			series: [
				{
					name: "订单总览",
					type: "pie",
					radius: ["60%", "80%"],
					avoidLabelOverlap: true,
					label: {
						show: false,
					},
					data: [
						{value: 1048, name: '订单总量'},
						{value: 735, name: '已完成订单'},
						{value: 580, name: '待完成订单'},
						{value: 484, name: '订单品类'},
						{value: 300, name: '订单总金额'},
					],
				},
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
.order-chart {
	width: 100%;
	height: 100%;
	//min-height: 113px;
	display: flex;
	align-items: center;

	.chart-container {
		flex: 1;
		height: 100%;
		min-height: 113px;
	}

	.el-scrollbar {
		flex: 1;
	}

	.chart-legend-container {
		height: 100%;
		padding-left: 30px;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.chart-legend {
			display: flex;
			align-items: center;

			&:not(:first-of-type) {
				margin-top: 12px;
			}

			.color {
				width: 8px;
				height: 8px;
				margin-right: 8px;
			}

			.type {
				width: 80px;
				font-size: 12px;
				font-family: Source Han Sans CN, Source Han Sans CN-Regular;
				line-height: 14px;
				font-weight: 400;
				text-align: left;
				color: #f0f0f0;
			}

			.value {
				font-size: 12px;
				font-family: Source Han Sans CN, Source Han Sans CN-Bold;
				line-height: 14px;
				font-weight: 700;
			}
		}
	}
}
</style>
