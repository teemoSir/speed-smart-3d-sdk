<template>
	<div class="factory-area">
		<div class="left">
			<div class="left__wrapper" ref="leftWrapperRef">
				<div class="capacity">
					<div class="content">
						<el-scrollbar>
							<div class="content-item" v-for="item in capacityData" :key="item.id">
								<span class="type">{{ item.name }}</span>
								<CapacityProgress :percentage="item.percentage" :start-color="item.startColor"
												  :end-color="item.endColor"/>
								<span class="value">{{ item.capacity }}</span>
							</div>
						</el-scrollbar>
					</div>
				</div>

				<div class="rules">
					<div class="content">
						<el-scrollbar>
							<span>{{ rules }}</span>
						</el-scrollbar>
					</div>
				</div>

				<div class="monitor">
					<div class="content">
						<img src="@/assets/speed/case/factory/factory-area/monitor/icon-video-monitor.png"
							 alt="video monitor"/>
						<span class="label">摄像头</span>
						<div class="divider"></div>
						<div class="amount">
							<span class="value">10</span>
							<span class="unit">个</span>
						</div>
					</div>
				</div>

				<div class="material">
					<div class="content">
						<div class="material-header">
							<span>材料</span>
							<span>日购量</span>
							<span>日销量</span>
							<span>当前库存</span>
						</div>

						<el-scrollbar>
							<div class="table-item" :class="{'item-active': currentMaterialId === item.id}"
								 v-for="item in materialData" :key="item.id" @click="handleMaterialClick(item)">
								<div class="table-item__wrapper">
									<span>{{ item.name }}</span>
									<span>{{ item.buyAmount }}</span>
									<span>{{ item.sellAmount }}</span>
									<span>{{ item.remainAmount }}</span>
								</div>
							</div>
						</el-scrollbar>
					</div>
				</div>
			</div>
		</div>

		<div class="right">
			<div class="right__wrapper" ref="rightWrapperRef">
				<div class="energy">
					<el-scrollbar>
						<EnergyChart/>
					</el-scrollbar>
				</div>

				<div class="risk-statistics">
					<el-switch
						class="risk-statistics-switch"
						v-model="riskStatisticsEnable"
						active-color="#14abda"
						inactive-color="#9fa8ac"
						@change="handleRiskStatisticsEnableChange"
					/>

					<el-scrollbar>
						<RiskStatisticsChart/>
					</el-scrollbar>
				</div>

				<div class="risk-operations">
					<el-switch
						class="risk-operations-switch"
						v-model="riskOperationsEnable"
						active-color="#14abda"
						inactive-color="#9fa8ac"
						@change="handleRiskOperationsEnableChange"
					/>

					<el-scrollbar>
						<div class="content">
							<div class="content-item" @click="handleRiskOperationItemClick('重大风险')">
								<img
									src="@/assets/speed/case/factory/factory-area/risk-operations/icon-important-risk.png"/>
								<span>重大风险</span>
							</div>
							<div class="content-item" @click="handleRiskOperationItemClick('较大风险')">
								<img src="@/assets/speed/case/factory/factory-area/risk-operations/icon-high-risk.png"/>
								<span>较大风险</span>
							</div>
							<div class="content-item" @click="handleRiskOperationItemClick('一般风险')">
								<img
									src="@/assets/speed/case/factory/factory-area/risk-operations/icon-normal-risk.png"/>
								<span>一般风险</span>
							</div>
							<div class="content-item" @click="handleRiskOperationItemClick('低风险')">
								<img src="@/assets/speed/case/factory/factory-area/risk-operations/icon-low-risk.png"/>
								<span>低风险</span>
							</div>
						</div>
					</el-scrollbar>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import eventBus from "@/utils/eventBus";
import CapacityProgress from "../components/capacity-progress/CapacityProgress.vue";
import EnergyChart from "../components/energy-chart/EnergyChart.vue";
import RiskStatisticsChart from "../components/risk-statistics-chart/RiskStatisticsChart.vue";

export default {
	name: "FactoryAreaDashboard",
	components: {
		CapacityProgress,
		EnergyChart,
		RiskStatisticsChart
	},
	data() {
		return {
			capacityData: [
				{
					id: "1",
					name: "烷烃",
					capacity: 6064,
					percentage: 0.8,
					startColor: "#00b8ff19",
					endColor: "#00b8ff"
				},
				{
					id: "2",
					name: "醛类",
					capacity: 4138,
					percentage: 0.65,
					startColor: "#d4942d19",
					endColor: "#d4942d"
				},
				{
					id: "3",
					name: "炔烃",
					capacity: 5140,
					percentage: 0.7,
					startColor: "#007eff19",
					endColor: "#007eff"
				},
				{
					id: "4",
					name: "烯烃",
					capacity: 606,
					percentage: 0.35,
					startColor: "#14bcda19",
					endColor: "#14bcda"
				},
				{
					id: "5",
					name: "芳香烃",
					capacity: 254,
					percentage: 0.25,
					startColor: "#14bcda19",
					endColor: "#14bcda"
				}
			],
			rules: "【企业精神】和谐、拼搏、务实、创新。和谐表现为一种“团队”精" +
				"神：干群合力，理解、支持、关心、体谅成为生产、经营、工作、交" +
				"往等社会生活诸方面人所共循的准则。团队精神是我们实施企业集团" +
				"化发展战略的基础各级领导班子与全体员工之间、员工与员工之间团" +
				"结协作。创造一个目标一致、思想统一、作风优良的团结向上气氛。",
			materialData: [
				{
					id: "1",
					name: "醛类",
					buyAmount: 100,
					sellAmount: 20,
					remainAmount: 50
				},
				{
					id: "2",
					name: "烷烃",
					buyAmount: 1000,
					sellAmount: 400,
					remainAmount: 100
				},
				{
					id: "3",
					name: "炔烃",
					buyAmount: 500,
					sellAmount: 80,
					remainAmount: 300
				},
				{
					id: "4",
					name: "烯烃",
					buyAmount: 15,
					sellAmount: 65,
					remainAmount: 6
				},
				{
					id: "5",
					name: "芳香烃",
					buyAmount: 8,
					sellAmount: 2,
					remainAmount: 20
				},
				// {
				// 	id: "6",
				// 	name: "芳香烃",
				// 	buyAmount: 100,
				// 	sellAmount: 20,
				// 	remainAmount: 50
				// },
				// {
				// 	id: "7",
				// 	name: "芳香烃",
				// 	buyAmount: 100,
				// 	sellAmount: 20,
				// 	remainAmount: 50
				// },
			],
			currentMaterialId: "",
			riskStatisticsEnable: true,
			riskOperationsEnable: true
		}
	},
	mounted() {
		this.initZoom();
		window.onresize = (event) => {
			const windowHeight = event.target.innerHeight;
			if (windowHeight > 920) {
				if (this.$refs.leftWrapperRef) {
					this.$refs.leftWrapperRef.style.zoom = 1;
				}
				if (this.$refs.rightWrapperRef) {
					this.$refs.rightWrapperRef.style.zoom = 1;
				}
			} else {
				if (this.$refs.leftWrapperRef) {
					this.$refs.leftWrapperRef.style.zoom = windowHeight / 918;
				}
				if (this.$refs.rightWrapperRef) {
					this.$refs.rightWrapperRef.style.zoom = windowHeight / 920;
				}
			}
		};
	},
	methods: {
		initZoom() {
			const windowHeight = window.innerHeight;
			if (windowHeight > 920) {
				if (this.$refs.leftWrapperRef) {
					this.$refs.leftWrapperRef.style.zoom = 1;
				}
				if (this.$refs.rightWrapperRef) {
					this.$refs.rightWrapperRef.style.zoom = 1;
				}
			} else {
				if (this.$refs.leftWrapperRef) {
					this.$refs.leftWrapperRef.style.zoom = windowHeight / 918;
				}
				if (this.$refs.rightWrapperRef) {
					this.$refs.rightWrapperRef.style.zoom = windowHeight / 920;
				}
			}
		},
		handleMaterialClick(item) {
			if (this.currentMaterialId !== item.id) {
				this.currentMaterialId = item.id;
				let componentName;
				switch (item.id) {
					case "1":
						componentName = "HBM007";
						break;
					case "2":
						componentName = "JXM027";
						break;
					case "3":
						componentName = "HBJZMX24";
						break;
					case "4":
						componentName = "JZMX39";
						break;
					case "5":
						componentName = "HBJZMX40";
						break;
					default:
						break;
				}
				if (componentName) {
					eventBus.$emit("material-click", componentName);
				}
			} else {
				this.currentMaterialId = "";
				eventBus.$emit("material-click", null);
			}
		},
		handleRiskStatisticsEnableChange(val) {
			console.log("风险统计分布:", val);
		},
		handleRiskOperationsEnableChange(val) {
			eventBus.$emit("toggle-risk-operations", val);
		},
		handleRiskOperationItemClick(name) {
			eventBus.$emit("risk-operation-click", name);
		},
	}
};

</script>

<style lang="scss" scoped>
.factory-area {
	z-index: 2;

	.left {
		width: 420px;
		position: fixed;
		top: 128px;
		bottom: 32px;
		left: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;

		&__wrapper {
			width: 100%;
			overflow: hidden;

			& > div:not(:first-of-type) {
				margin-top: 24px;
			}
		}

		.capacity {
			width: 100%;
			padding: 84px 18px 24px 31px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/factory-area/capacity/capacity-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.content {
				flex: 1;
				display: flex;
				flex-direction: column;
				overflow-y: hidden;

				&-item {
					height: 16px;
					display: flex;
					align-items: center;

					&:not(:first-of-type) {
						margin-top: 10px;
					}

					.type {
						width: 60px;
						background: linear-gradient(0deg, white 0%, #bcf4fe 100%);
						font-size: 14px;
						font-family: "Alimama ShuHeiTi-Bold";
						font-weight: 700;
						font-style: italic;
						text-align: left;
						color: #f0f0f0;
						line-height: 14px;
						background-clip: text;
					}

					.capacity-progress {
						flex: 1;
						margin-right: 24px;
					}

					.value {
						width: 50px;
						background: linear-gradient(0deg, white 0%, #bcf4fe 100%);
						font-size: 14px;
						font-family: "Alimama ShuHeiTi-Bold";
						font-weight: 700;
						font-style: italic;
						text-align: left;
						color: #f0f0f0;
						line-height: 14px;
						background-clip: text;
					}
				}
			}
		}

		.rules {
			width: 100%;
			padding: 72px 27px 25px 31px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/factory-area/rules/rules-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.content {
				width: 100%;
				height: 100%;
				overflow: hidden;
			}

			span {
				display: inline-block;
				width: 100%;
				height: 100%;
				font-size: 14px;
				font-weight: 700;
				color: #f0f0f0;
				line-height: 22px;
				letter-spacing: 0.56px;
				text-overflow: ellipsis;
				word-break: break-all;
				overflow-y: auto;
			}
		}

		.monitor {
			width: 100%;
			padding: 73px 26px 21px 34px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/factory-area/monitor/monitor-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.content {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;

				img {
					width: 44px;
					height: 44px;
				}

				span.label {
					margin-left: 15px;
					font-size: 14px;
					font-weight: 500;
					color: #f0f0f0;
					line-height: 14px;
				}

				.divider {
					flex: 1;
					height: 0;
					margin: 0 20px;
					border: 1px dashed #c2deffa6;
				}

				.amount {
					display: flex;
					align-items: flex-end;

					.value {
						font-size: 20px;
						font-family: "Alimama ShuHeiTi-Bold";
						font-weight: 700;
						color: #d4ae2d;
						line-height: 20px;
					}

					.unit {
						margin-left: 3px;
						margin-bottom: 2px;
						font-size: 14px;
						color: white;
						line-height: 14px;
					}
				}
			}
		}

		.material {
			width: 100%;
			padding: 74px 18px 20px 0;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/factory-area/material/material-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.content {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;

				.material-header {
					padding-left: 36px;
					padding-right: 8px;
					margin-bottom: 7px;
					display: flex;
					justify-content: flex-start;
					align-items: center;

					span {
						font-size: 14px;
						font-weight: 700;
						color: white;
						line-height: 14px;
						letter-spacing: 1.75px;

						&:nth-of-type(1) {
							width: 60px;
							margin-left: 26px;
							text-align: left;
						}

						&:nth-of-type(2) {
							width: 70px;
							text-align: right;
						}

						&:nth-of-type(3) {
							width: 80px;
							text-align: right;
						}

						&:nth-of-type(4) {
							width: 90px;
							text-align: right;
						}
					}
				}

				:deep(.el-scrollbar) {
					.el-scrollbar__view {
						padding-right: 8px;
					}
				}

				.table-item {
					height: 32px;
					margin-left: 25px;
					padding-left: 7px;

					&:not(:first-of-type) {
						margin-top: 7px;
					}

					&__wrapper {
						height: 100%;
						margin-left: 4px;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						background-color: #14bcda33;
						cursor: pointer;

						span {
							font-size: 14px;
							font-weight: 500;
							color: #f0f0f0;
							line-height: 14px;

							&:nth-of-type(1) {
								width: 60px;
								margin-left: 26px;
								text-align: left;
							}

							&:nth-of-type(2) {
								width: 70px;
								text-align: right;
							}

							&:nth-of-type(3) {
								width: 80px;
								text-align: right;
							}

							&:nth-of-type(4) {
								width: 90px;
								text-align: right;
							}
						}
					}

					&:hover, &.item-active {
						background-image: url("~@/assets/speed/case/factory/factory-area/material/item-active-background.png");
						background-size: 100% 100%;
						background-repeat: no-repeat;
					}
				}
			}
		}

		@media (height < 1080px) {
			&__wrapper {
				height: 100%;
				display: flex;
				flex-direction: column;
			}

			.capacity {
				flex: 2.3;
				overflow: hidden;
			}

			.rules {
				flex: 1.91;
				overflow: hidden;
			}

			.monitor {
				flex: 1.37;
				overflow: hidden;
			}

			.material {
				flex: 2.9;
				overflow: hidden;
			}
		}

		@media (height >= 1080px) {
			.capacity {
				height: 230px;
				min-height: 230px;
			}

			.rules {
				height: 191px;
				min-height: 191px;
			}

			.monitor {
				height: 137px;
				min-height: 137px;
			}

			.material {
				height: 290px;
				min-height: 290px;
			}
		}
	}

	.right {
		width: 420px;
		position: fixed;
		top: 128px;
		bottom: 32px;
		right: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;

		&__wrapper {
			width: 100%;
			overflow: hidden;

			& > div:not(:first-of-type) {
				margin-top: 24px;
			}
		}

		.energy {
			width: 100%;
			padding: 78px 26px 26px 31px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/factory-area/energy/energy-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			:deep(.el-scrollbar) {
				.el-scrollbar__view {
					height: 100%;
				}
			}

			.energy-chart {
				width: 100%;
				height: 100%;
			}
		}

		.risk-statistics {
			position: relative;
			width: 100%;
			padding: 78px 26px 26px 31px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/factory-area/risk-statistics/risk-statistics-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			&-switch {
				position: absolute;
				top: 20px;
				right: 25px;
			}

			:deep(.el-scrollbar) {
				.el-scrollbar__view {
					height: 100%;
				}
			}

			.risk-statistics-chart {
				width: 100%;
				height: 100%;
			}
		}

		.risk-operations {
			position: relative;
			width: 100%;
			padding: 76px 16px 24px 55px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/factory-area/risk-operations/risk-operations-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			&-switch {
				position: absolute;
				top: 20px;
				right: 25px;
			}

			.el-scrollbar {
				width: 100%;
				height: 100%;
			}

			.content {
				height: 100%;
				display: grid;
				grid-template-columns: 1fr 1fr;
				grid-column-gap: 20px;

				&-item {
					display: flex;
					align-items: center;
					cursor: pointer;

					img {
						width: 50px;
						height: 50px;
						margin-right: 14px;
					}

					span {
						margin-bottom: 10px;
						font-size: 14px;
						font-family: "Alimama ShuHeiTi-Bold";
						font-weight: 700;
						font-style: italic;
						color: #f0f0f0;
						letter-spacing: 0.56px;
						background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
						background-clip: text;
					}
				}
			}
		}

		@media (height < 1080px) {
			&__wrapper {
				height: 100%;
				display: flex;
				flex-direction: column;
			}

			.energy {
				flex: 3.4;
				overflow: hidden;
			}

			.risk-statistics {
				flex: 3.4;
				overflow: hidden;
			}

			.risk-operations {
				flex: 1.91;
				overflow: hidden;
			}
		}

		@media (height >= 1080px) {
			.energy {
				height: 340px;
				min-height: 340px;
			}

			.risk-statistics {
				height: 340px;
				min-height: 340px;
			}

			.risk-operations {
				height: 191px;
				min-height: 191px;
			}
		}
	}
}
</style>
