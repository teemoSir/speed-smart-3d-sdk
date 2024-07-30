<template>
	<div class="production-line">
		<div class="left">
			<div class="left__wrapper" ref="leftWrapperRef">
				<div class="indicator">
					<span class="indicator-title">本月指标</span>

					<div class="indicator-items">
						<div class="item" v-for="item in indicatorData" :key="item.id">
							<el-image class="icon" :src="item.icon"/>

							<div class="indicator-right">
								<div class="row">
									<span class="value">{{ item.value }}</span>
									<span class="unit">{{ item.unit }}</span>
								</div>

								<span class="name">{{ item.name }}</span>
							</div>
						</div>
					</div>

					<div class="legend-wrapper">
						<span class="indicator-title">全年指标</span>

						<div class="legend-items">
							<div class="legend-item">
								<div class="block finance"></div>
								<span>财务指标</span>
							</div>
							<div class="legend-item">
								<div class="block production"></div>
								<span>生产指标</span>
							</div>
							<div class="legend-item">
								<div class="block project"></div>
								<span>项目指标</span>
							</div>
						</div>
					</div>

					<IndicatorChart/>
				</div>

				<div class="attendance">
					<el-scrollbar>
						<div class="content">
							<div class="content-item" v-for="item in attendanceData" :key="item.id">
								<span class="type">{{ item.name }}</span>
								<CapacityProgress :percentage="item.percentage" :start-color="item.startColor"
												  :end-color="item.endColor"/>
								<span class="value">{{ (item.percentage * 100).toFixed(0) }}%</span>
							</div>
						</div>
					</el-scrollbar>
				</div>

				<div class="qa">
					<el-scrollbar>
						<div class="row">
							<div class="wrapper count-wrapper">
								<span class="value">2022</span>
								<span class="name">总质检数</span>
							</div>
							<div class="wrapper good-wrapper">
								<span class="value">1234</span>
								<span class="name">良品</span>
							</div>
						</div>

						<div class="row">
							<div class="avatar-wrapper">
								<el-image class="avatar"
										  :src="require('@/assets/speed/case/factory/production-line/qa/avatar.png')"/>
								<div class="avatar-right">
									<span class="type">质检之星</span>
									<span class="name">张三</span>
									<span class="group">产线2(QA)</span>
								</div>
							</div>

							<div class="rate-wrapper">
								<span class="value">90%</span>
								<span class="name">良品率</span>
							</div>
						</div>
					</el-scrollbar>
				</div>
			</div>
		</div>

		<div class="right">
			<div class="right__wrapper" ref="rightWrapperRef">
				<div class="device">
					<el-scrollbar>
						<div class="content">
							<div class="content-item" v-for="(item, index) in deviceData" :key="item.id"
								 @click="onDeviceClick(index)">
								<div class="image-wrapper">
									<el-image class="device-picture"
											  :src="require('@/assets/speed/case/factory/production-line/device/example.png')"/>

									<div class="name">
										<el-image class="device-name"
												  :src="require('@/assets/speed/case/factory/production-line/device/device-name-background.png')"/>

										<span>{{ item.name }}</span>
									</div>
								</div>

								<div class="content-wrapper">
									<div class="info-item">
										<div>
											<span class="value">{{ item.count }}</span>
											<span class="unit">台</span>
										</div>
										<span class="type">设备总数</span>
									</div>
									<div class="info-item">
										<div>
											<span class="value">{{ item.work }}</span>
											<span class="unit">台</span>
										</div>
										<span class="type">作业设备</span>
									</div>
									<div class="info-item item-offline">
										<div>
											<span class="value">{{ item.offline }}</span>
											<span class="unit">台</span>
										</div>
										<span class="type">离线设备</span>
									</div>
									<div class="info-item item-alarm">
										<div>
											<span class="value">{{ item.alarm }}</span>
											<span class="unit">次</span>
										</div>
										<span class="type">异常报警</span>
									</div>
								</div>
							</div>
						</div>
					</el-scrollbar>
				</div>

				<div class="alarm">
					<div class="content">
						<div class="alarm-header">
							<span>设备</span>
							<span>警告详情</span>
							<span>时间</span>
						</div>

						<el-scrollbar>
							<div class="table-item" v-for="(item, index) in alarmData" :key="item.id"
								 @click="onAlarmClick(index)">
								<div class="table-item__wrapper">
									<span>{{ item.device }}</span>
									<span>{{ item.detail }}</span>
									<span>{{ item.time }}</span>
								</div>
							</div>
						</el-scrollbar>
					</div>
				</div>
			</div>
		</div>

		<div class="footer">
			<div class="items">
				<div class="icon left-icon" @click="onArrowClick('previous')"></div>

				<div
					class="item"
					:class="{'item-active': selectedProductionLineId === item.id}"
					v-for="item in productionLineData"
					:key="item.id"
					@click="onProductionItemClick(item)"
				>
					<div class="item-bg"></div>
					<span>{{ item.name }}</span>
				</div>

				<div class="icon right-icon" @click="onArrowClick('next')"></div>
			</div>

			<div class="bottom">
				<span @click="onWorkshopClick">1厂区1车间</span>
			</div>
		</div>
	</div>
</template>

<script>
import IndicatorChart from "../components/indicator-chart/IndicatorChart.vue";
import CapacityProgress from "../components/capacity-progress/CapacityProgress.vue";
import eventBus from "@/utils/eventBus";

export default {
	name: "ProductionLineDashboard",
	components: {
		IndicatorChart,
		CapacityProgress,
	},
	data() {
		return {
			indicatorData: [
				{
					id: "finance",
					name: "财务指标",
					value: "1000",
					unit: "万",
					icon: require("@/assets/speed/case/factory/production-line/indicator/icon-finance.png"),
				},
				{
					id: "production",
					name: "生产指标",
					value: "2000",
					unit: "件",
					icon: require("@/assets/speed/case/factory/production-line/indicator/icon-production.png"),
				},
				{
					id: "project",
					name: "项目进度",
					value: "100",
					unit: "%",
					icon: require("@/assets/speed/case/factory/production-line/indicator/icon-project.png"),
				},
			],
			attendanceData: [
				{
					id: "1",
					name: "质检部",
					capacity: 6064,
					percentage: 0.8,
					startColor: "#00b8ff19",
					endColor: "#00b8ff",
				},
				{
					id: "2",
					name: "原料部",
					capacity: 4138,
					percentage: 0.65,
					startColor: "#d4942d19",
					endColor: "#d4942d",
				},
				{
					id: "3",
					name: "仓配部",
					capacity: 5140,
					percentage: 0.7,
					startColor: "#007eff19",
					endColor: "#007eff",
				},
				{
					id: "4",
					name: "控制室",
					capacity: 606,
					percentage: 0.35,
					startColor: "#14bcda19",
					endColor: "#14bcda",
				},
			],
			deviceData: [
				{
					id: "1",
					name: "设备A",
					count: 100,
					work: 20,
					offline: 15,
					alarm: 6,
				},
				{
					id: "2",
					name: "设备B",
					count: 100,
					work: 20,
					offline: 15,
					alarm: 6
				},
				{
					id: "3",
					name: "设备C",
					count: 100,
					work: 20,
					offline: 15,
					alarm: 6
				},
				{
					id: "4",
					name: "设备D",
					count: 100,
					work: 20,
					offline: 15,
					alarm: 6
				},
			],
			alarmData: [
				{
					id: "1",
					device: "设备A",
					detail: "温度过高",
					time: "11:22:33",
				},
				{
					id: "2",
					device: "设备A",
					detail: "温度过高",
					time: "11:22:33",
				},
				{
					id: "3",
					device: "设备A",
					detail: "温度过高",
					time: "11:22:33",
				},
				{
					id: "4",
					device: "设备A",
					detail: "温度过高",
					time: "11:22:33",
				},
				{
					id: "5",
					device: "设备A",
					detail: "温度过高",
					time: "11:22:33",
				},
				{
					id: "6",
					device: "设备A",
					detail: "温度过高",
					time: "11:22:33",
				},
				{
					id: "7",
					device: "设备A",
					detail: "温度过高",
					time: "11:22:33",
				},
				{
					id: "8",
					device: "设备A",
					detail: "温度过高",
					time: "11:22:33",
				},
			],
			productionLineData: [
				{
					id: "1",
					name: "产线1",
					componentName: "HB040",
				},
				{
					id: "2",
					name: "产线2",
					componentName: "HB041",
				},
				{
					id: "3",
					name: "产线3",
					componentName: "HB046",
				},
				{
					id: "4",
					name: "产线4",
					componentName: "HB047",
				},
			],
			selectedProductionLineId: "1",
		};
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
		onDeviceClick(index) {
			eventBus.$emit("device-click", index);
		},

		onAlarmClick(index) {
			eventBus.$emit("alarm-click", index);
		},

		onArrowClick(type) {
			if (type === "previous") {
				console.log("previous");
			} else if (type === "next") {
				console.log("next");
			}
		},

		onProductionItemClick(item) {
			// if (this.selectedProductionLineId !== item.id) {
			this.selectedProductionLineId = item.id;
			eventBus.$emit("production-line-click", item.componentName);
			// }
		},

		onWorkshopClick() {
			console.log("clicked workshop");
		},
	},
};

</script>

<style lang="scss" scoped>
.production-line {
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
		z-index: 4;

		&__wrapper {
			width: 100%;
			overflow: hidden;

			& > div:not(:first-of-type) {
				margin-top: 24px;
			}
		}

		.indicator {
			width: 100%;
			padding: 73px 22px 18px 32px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/production-line/indicator/indicator-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			&-title {
				font-size: 14px;
				font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
				font-weight: 700;
				font-style: italic;
				text-align: left;
				line-height: 14px;
				color: #ffffff;
				letter-spacing: 1.75px;
				text-shadow: 0 0 6px 0 rgba(1, 25, 29, 0.30);
			}

			&-items {
				margin-top: 13px;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.item {
					display: flex;
					align-items: center;

					.icon {
						width: 44px;
						height: 44px;
					}

					.indicator-right {
						margin-left: 9px;
						display: flex;
						flex-direction: column;
						justify-content: center;

						.row {
							display: flex;
							align-items: flex-end;

							.value {
								background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
								background-clip: text;
								font-size: 20px;
								font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
								font-weight: 700;
								font-style: italic;
								line-height: 20px;
								color: #14bcda;
							}

							.unit {
								background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
								background-clip: text;
								font-size: 14px;
								font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
								font-weight: 700;
								font-style: italic;
								line-height: 14px;
								color: #14bcda;
							}
						}

						.name {
							margin-top: 5px;
							font-size: 12px;
							font-family: Source Han Sans CN, Source Han Sans CN-Medium;
							font-weight: 500;
							text-align: left;
							line-height: 12px;
							color: #f0f0f0a5;
						}
					}
				}
			}

			.legend-wrapper {
				margin-top: 25px;
				margin-bottom: 5px;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.legend-items {
					display: flex;
					align-items: center;

					.legend-item {
						display: flex;
						align-items: center;

						.block {
							width: 6px;
							height: 3px;
							margin-right: 6px;

							&.finance {
								background-color: #00b8ff;
							}

							&.production {
								background-color: #34efb1;
							}

							&.project {
								background-color: #0069ff;
							}
						}

						span {
							font-size: 12px;
							font-family: Source Han Sans CN, Source Han Sans CN-Regular;
							line-height: 12px;
							color: white;
						}
					}

					.legend-item + .legend-item {
						margin-left: 15px;
					}
				}
			}
		}

		.attendance {
			width: 100%;
			padding: 80px 18px 23px 31px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/production-line/attendance/attendance-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.content {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				&-item {
					height: 16px;
					display: flex;
					align-items: center;

					&:not(:first-of-type) {
						margin-top: 11px;
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

		.qa {
			width: 100%;
			padding: 80px 25px 20px 32px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/production-line/qa/qa-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.row {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.wrapper {
					width: 169px;
					height: 56px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					background-size: 100% 100%;
					background-repeat: no-repeat;

					&.count-wrapper {
						background-image: url("~@/assets/speed/case/factory/production-line/qa/count-background.png");
					}

					&.good-wrapper {
						background-image: url("~@/assets/speed/case/factory/production-line/qa/good-background.png");
					}

					& > span {
						margin-left: 74px;
					}

					.value {
						background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
						background-clip: text;
						font-size: 20px;
						font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
						font-weight: 700;
						font-style: italic;
						line-height: 20px;
						color: #f0f0f0;
					}

					.name {
						margin-top: 3px;
						font-size: 12px;
						font-family: Source Han Sans CN, Source Han Sans CN-Regular;
						line-height: 12px;
						color: #f0f0f0;
					}
				}

				&:nth-of-type(2) {
					//margin-top: 22px;
					margin-top: 9px;
				}

				.avatar-wrapper {
					width: 224px;
					height: 107px;
					padding: 11px;
					display: flex;
					align-items: center;
					background-image: url("~@/assets/speed/case/factory/production-line/qa/avatar-background.png");
					background-size: 100% 100%;
					background-repeat: no-repeat;

					.avatar {
						width: 84px;
						height: 84px;
						margin-right: 8px;
					}

					.avatar-right {
						display: flex;
						flex-direction: column;

						.type {
							width: 56px;
							height: 16px;
							background-color: #d4942d;
							font-size: 12px;
							font-family: Source Han Sans CN, Source Han Sans CN-Medium;
							font-weight: 500;
							text-align: center;
							line-height: 16px;
							color: #f0f0f0;
						}

						.name {
							margin: 10px 0;
							background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
							background-clip: text;
							font-size: 16px;
							font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
							font-weight: 700;
							font-style: italic;
							line-height: 16px;
							color: #f0f0f0;
						}

						.group {
							font-size: 12px;
							font-family: Source Han Sans CN, Source Han Sans CN-Medium;
							font-weight: 500;
							line-height: 12px;
							color: #f0f0f0;
						}
					}
				}

				.rate-wrapper {
					width: 125px;
					height: 125px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					background-image: url("~@/assets/speed/case/factory/production-line/qa/good-rate-background.png");
					background-size: 100% 100%;
					background-repeat: no-repeat;

					.value {
						background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
						background-clip: text;
						font-size: 24px;
						font-family: YouSheBiaoTiHei, YouSheBiaoTiHei-Regular;
						font-weight: 400;
						line-height: 24px;
						letter-spacing: 0.24px;
						color: #15bab4;
					}

					.name {
						margin-top: 8px;
						font-size: 12px;
						font-family: Source Han Sans CN, Source Han Sans CN-Regular;
						line-height: 12px;
						color: #f0f0f0a5;
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

			.indicator {
				flex: 3.5;
				overflow: hidden;
			}

			.attendance {
				flex: 2.31;
				overflow: hidden;
			}

			.qa {
				flex: 2.9;
				overflow: hidden;
			}
		}

		@media (height >= 1080px) {
			.indicator {
				height: 350px;
				min-height: 350px;
			}

			.attendance {
				height: 231px;
				min-height: 231px;
			}

			.qa {
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
		z-index: 4;

		&__wrapper {
			width: 100%;
			overflow: hidden;

			& > div:not(:first-of-type) {
				margin-top: 24px;
			}
		}

		.device {
			width: 100%;
			padding: 80px 0 12px 32px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/production-line/device/device-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			:deep(.el-scrollbar) {
				.el-scrollbar__view {
					padding-right: 24px;
				}
			}

			.content {
				flex: 1;
				display: flex;
				flex-direction: column;
				overflow: hidden;

				&-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					cursor: pointer;

					&:not(:first-of-type) {
						margin-top: 16px;
					}

					.image-wrapper {
						width: 84px;
						height: 88px;
						position: relative;

						.device-picture {
							width: 100%;
							height: 100%;
						}

						.name {
							position: absolute;
							top: 0;
							left: 0;
							display: flex;
							align-items: center;

							.device-name {
								width: 52px;
								height: 18px;
								position: absolute;
								top: 0;
								left: 0;
							}

							span {
								margin-top: 3px;
								margin-left: 7px;
								max-width: 78px;
								background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
								background-clip: text;
								font-size: 12px;
								font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
								font-weight: 700;
								font-style: italic;
								line-height: 12px;
								color: #f0f0f0;
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;
								z-index: 9;
							}
						}
					}

					.content-wrapper {
						width: 269px;
						height: 88px;
						padding: 0 10px;
						display: flex;
						justify-content: space-between;
						align-items: center;
						background-image: url("~@/assets/speed/case/factory/production-line/device/device-content-background.png");
						background-size: 100% 100%;
						background-repeat: no-repeat;

						.info-item {
							display: flex;
							flex-direction: column;
							justify-content: center;

							& > div {
								display: flex;
								align-items: flex-end;
							}

							&.item-offline {
								.value, .unit {
									color: #00b8ff;
								}
							}

							&.item-alarm {
								.value, .unit {
									color: #e64334;
								}
							}

							.value {
								background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
								background-clip: text;
								font-size: 18px;
								font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
								font-weight: 700;
								line-height: 18px;
								color: #bcf4fe;
							}

							.unit {
								background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
								background-clip: text;
								font-size: 14px;
								font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
								font-weight: 700;
								line-height: 14px;
								color: #bcf4fe;
							}

							.type {
								width: 48px;
								height: 13px;
								margin-top: 13px;
								font-size: 12px;
								font-family: Source Han Sans CN, Source Han Sans CN-Regular;
								line-height: 12px;
								color: #a2eefc;
							}
						}
					}
				}
			}
		}

		.alarm {
			width: 100%;
			padding: 74px 0 20px 0;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/production-line/alarm/alarm-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			:deep(.el-scrollbar) {
				.el-scrollbar__view {
					padding-right: 18px;
				}
			}

			.content {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;

				.alarm-header {
					padding-left: 36px;
					//padding-right: 8px;
					padding-right: 26px;
					margin-bottom: 7px;
					display: flex;
					align-items: center;

					span {
						font-size: 14px;
						font-weight: 700;
						color: white;
						line-height: 14px;
						letter-spacing: 1.75px;

						&:nth-of-type(1) {
							width: 80px;
							margin-left: 42px;
							text-align: left;
						}

						&:nth-of-type(2) {
							flex: 1;
							margin-left: 24px;
							text-align: left;
						}

						&:nth-of-type(3) {
							width: 80px;
							margin-right: 46px;
							text-align: end;
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
					padding-right: 18px;
					cursor: pointer;

					&:not(:first-of-type) {
						margin-top: 7px;
					}

					&__wrapper {
						height: 100%;
						margin-left: 4px;
						display: flex;
						align-items: center;
						background-color: #14bcda33;

						span {
							font-size: 14px;
							font-weight: 500;
							color: #f0f0f0;
							line-height: 14px;

							&:nth-of-type(1) {
								width: 80px;
								margin-left: 42px;
								text-align: left;
							}

							&:nth-of-type(2) {
								flex: 1;
								margin-left: 24px;
								text-align: left;
							}

							&:nth-of-type(3) {
								width: 80px;
								margin-right: 46px;
								text-align: end;
							}
						}
					}

					&:hover {
						background-image: url("~@/assets/speed/case/factory/enterprise/cover/item-active-background.png");
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

			.device {
				flex: 4.95;
				overflow: hidden;
			}

			.alarm {
				flex: 4;
				overflow: hidden;
			}
		}

		@media (height >= 1080px) {
			.device {
				height: 495px;
				min-height: 495px;
			}

			.alarm {
				height: 400px;
				min-height: 400px;
			}
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		z-index: 3;

		.bottom {
			width: 100%;
			height: 156px;
			display: flex;
			justify-content: center;
			align-items: flex-end;
			background-image: url("~@/assets/speed/case/factory/production-line/bottom/bottom-background.png");
			background-size: 100% auto;
			background-repeat: no-repeat;
			cursor: pointer;
			user-select: none;

			span {
				margin-bottom: 14px;
				margin-right: 70px;
				background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
				background-clip: text;
				font-size: 18px;
				font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
				font-weight: 700;
				font-style: italic;
				text-align: left;
				line-height: 18px;
				letter-spacing: 1.08px;
				color: #a2eefc;
			}
		}

		.items {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			bottom: 60px;
			left: 50%;
			transform: translateX(-50%);

			.icon {
				width: 40px;
				height: 40px;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				cursor: pointer;

				&.left-icon {
					margin-right: 10px;
					background-image: url("~@/assets/speed/case/factory/production-line/bottom/icon-left.png");

					&:hover {
						background-image: url("~@/assets/speed/case/factory/production-line/bottom/icon-left-active.png");
					}
				}

				&.right-icon {
					margin-left: 10px;
					background-image: url("~@/assets/speed/case/factory/production-line/bottom/icon-right.png");

					&:hover {
						background-image: url("~@/assets/speed/case/factory/production-line/bottom/icon-right-active.png");
					}
				}
			}

			.item {
				position: relative;
				cursor: pointer;
				user-select: none;

				&:not(:first-of-type) {
					margin-left: 28px;
				}

				.item-bg {
					width: 104px;
					height: 18px;
					background-image: url("~@/assets/speed/case/factory/production-line/bottom/item-background.png");
					background-size: 100% 100%;
					background-repeat: no-repeat;
				}

				span {
					position: absolute;
					bottom: 11px;
					left: 50%;
					transform: translateX(-50%);

					background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
					background-clip: text;
					font-size: 16px;
					font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
					font-weight: 700;
					font-style: italic;
					text-align: left;
					line-height: 16px;
					letter-spacing: 0.96px;
					color: #a2eefc;
				}

				&.item-active {
					.item-bg {
						background-image: url("~@/assets/speed/case/factory/production-line/bottom/item-active-background.png");
					}

					span {
						color: #14c9f4;
					}
				}
			}
		}
	}
}
</style>
