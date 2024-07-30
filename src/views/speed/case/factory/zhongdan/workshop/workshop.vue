<template>
	<div class="workshop">
		<div class="left">
			<div class="left__wrapper" ref="leftWrapperRef">
				<div class="information">
					<el-scrollbar>
						<el-select
							class="custom-select"
							v-model="informationType"
							placeholder="请选择"
						>
							<el-option
								v-for="item in informationTypeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>

						<span>{{ informationIntroduction }}</span>
					</el-scrollbar>
				</div>

				<div class="order">
					<OrderChart/>
				</div>

				<div class="production">
					<div class="content">
						<el-scrollbar>
							<div class="content-item" v-for="item in productionLineData" :key="item.id">
								<span class="type">{{ item.name }}</span>
								<CapacityProgress :percentage="item.percentage" :start-color="item.startColor"
												  :end-color="item.endColor"/>
								<span class="value">{{ (item.percentage * 100).toFixed(0) }}%</span>
							</div>
						</el-scrollbar>
					</div>
				</div>

				<div class="monitor">
					<el-scrollbar>
						<div class="content">
							<!--							:class="{active: activeEnvironmentMonitorId === item.id}"-->
							<div
								class="content-item"
								v-for="(item, index) in environmentMonitorData"
								:key="item.id"
								@click="onEnvironmentMonitorClick(index)"
							>
								<div class="row">
									<span>{{ item.value }}</span>
									<span>{{ item.unit }}</span>
								</div>
							</div>
						</div>
					</el-scrollbar>

					<!--					<div-->
					<!--						class="environment-dialog"-->
					<!--						:class="activeEnvironmentMonitorId"-->
					<!--						v-if="activeEnvironmentMonitorId"-->
					<!--					>-->
					<!--						<span class="device-name">{{ activeEnvironmentMonitorData.name }}</span>-->

					<!--						<div class="info">-->
					<!--							<span class="label">设备数值:</span>-->
					<!--							<span class="value">{{ activeEnvironmentMonitorData.value }}</span>-->
					<!--						</div>-->
					<!--						<div class="info">-->
					<!--							<span class="label">设备状态:</span>-->
					<!--							<span class="value">{{ activeEnvironmentMonitorData.status }}</span>-->
					<!--						</div>-->
					<!--						<div class="info">-->
					<!--							<span class="label">设备指标:</span>-->
					<!--							<span class="value">{{ activeEnvironmentMonitorData.target }}</span>-->
					<!--						</div>-->
					<!--						<div class="info">-->
					<!--							<span class="label">报警次数:</span>-->
					<!--							<span class="value">{{ activeEnvironmentMonitorData.count }}</span>-->
					<!--						</div>-->
					<!--					</div>-->
				</div>
			</div>
		</div>

		<div class="right">
			<div class="right__wrapper" ref="rightWrapperRef">
				<div class="personnel">
					<div class="content">
						<el-scrollbar>
							<div class="content-item" v-for="(item, index) in personnelData" :key="item.id"
								 @click="onPersonnelClick(index)">
								<div class="avatar">
									<el-image
										:src="require('@/assets/speed/case/factory/workshop/personnel/avatar.png')"/>
								</div>

								<div class="detail">
									<div class="detail-left">
										<div class="row">
											<span class="name">{{ item.name }}</span>
											<div class="job">
												<span>{{ item.job }}</span>
											</div>
										</div>
										<div class="row">
											<el-image
												:src="require('@/assets/speed/case/factory/workshop/personnel/icon-phone.png')"/>
											<span class="phone">{{ item.phone }}</span>
										</div>
										<div class="row">
											<el-image
												:src="require('@/assets/speed/case/factory/workshop/personnel/icon-group.png')"/>
											<span class="group">{{ item.group }}</span>
										</div>
									</div>

									<div class="detail-right">
										<el-image
											class="certificate"
											:src="require('@/assets/speed/case/factory/workshop/personnel/certificate.png')"/>
										<div class="row">
											<div class="image" :class="{'item-active': item.location}">
												<el-image :src="item.location ? locationActivateIcon : locationIcon"
														  @click="onLocationIconClick(item)"/>
											</div>
											<div class="divider"></div>
											<div class="image" :class="{'item-active': item.visible}">
												<el-image :src="item.visible ? visibleActivateIcon : visibleIcon"
														  @click="onVisibleIconClick(item)"/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</el-scrollbar>
					</div>
				</div>

				<div class="hazard">
					<div class="content">
						<el-scrollbar>
							<div class="content-item" v-for="(item, index) in hazardData" :key="item.id">
								<el-image class="type" :src="hazardStatusImage(item.type)"/>

								<div class="hazard-header">
									<el-image
										:src="item.statusImage"/>
									<span class="name">{{ item.name }}</span>
									<span class="type">一般隐患</span>
								</div>

								<div class="body">
									<div class="body-left">
										<div class="row">
											<div class="block"></div>
											<span>隐患上报人:</span>
											<span>{{ item.uploadPerson }}</span>
										</div>
										<div class="row">
											<div class="block"></div>
											<span>上报时间:</span>
											<span>{{ item.uploadDate }}</span>
										</div>
										<div class="row">
											<div class="block"></div>
											<span>隐患解决人:</span>
											<span>{{ item.resolvePerson }}</span>
										</div>
										<div class="row">
											<div class="block"></div>
											<span>解决事件:</span>
											<span>{{ item.resolveDate }}</span>
										</div>
									</div>

									<div class="body-right">
										<div class="row">
											<div class="block"></div>
											<span>奖励:</span>
											<span>{{ item.award }}分</span>
										</div>

										<div class="second-row">
											<div class="row">
												<div class="block"></div>
												<span>隐患现场:</span>
											</div>

											<div class="row">
												<div class="block"></div>
												<span>处理结果:</span>
											</div>
										</div>

										<div class="image-row">
											<el-image :src="item.riskPicture"/>
											<el-image :src="item.resolvePicture"/>
										</div>
									</div>
								</div>

								<div class="process-wrapper">
									<div class="row" @click="toggleExpanded(item)">
										<el-image class="node"
												  :src="require('@/assets/speed/case/factory/workshop/hazard/icon-process-node.png')"/>
										<span class="process-title">流程节点</span>
										<el-image class="arrow" :class="{expanded: item.processExpanded}"
												  :src="require('@/assets/speed/case/factory/workshop/hazard/icon-arrow-right.png')"/>
									</div>

									<transition name="process">
										<HazardProcess v-show="item.processExpanded" :processes="item.process"
													   :current-process-index="index"/>
									</transition>
								</div>
							</div>
						</el-scrollbar>
					</div>
				</div>
			</div>
		</div>

		<div class="roam-control">
			<el-button type="primary" size="large" v-if="!isRoamStarted" @click="startRoam">
				<el-icon>
					<VideoPlay/>
				</el-icon>
				<span>开始漫游</span>
			</el-button>
			<el-button type="danger" size="large" v-if="isRoamStarted && !isRoamPaused" @click="pauseRoam">
				<el-icon>
					<VideoPause/>
				</el-icon>
				<span>暂停漫游</span>
			</el-button>
			<el-button type="success" size="large" v-if="isRoamStarted && isRoamPaused" @click="resumeRoam">
				<el-icon>
					<VideoPlay/>
				</el-icon>
				<span>继续漫游</span>
			</el-button>
		</div>
	</div>
</template>

<script>
import eventBus from "@/utils/eventBus";
import OrderChart from "../components/order-chart/OrderChart.vue";
import CapacityProgress from "../components/capacity-progress/CapacityProgress.vue";
import HazardProcess from "../components/hazard-process/HazardProcess.vue";
import { VideoPause, VideoPlay } from "@element-plus/icons-vue";

const workshop1InformationIntroduction = "车间现有员工100人,拥有生产设备95台,设立5个班组,分两班生产,国家安全生产许可能力12000吨,生产岩石膨化硝铵炸药、二级煤矿许用膨化硝铵炸药两个品种6个规格的膨化硝铵炸药。";
const workshop2InformationIntroduction = "饲料中的维生素A、D、E、K、胡萝卜和脂肪酸、鱼粉、肉粉、骨粉、血粉、羽毛粉等主要营养成分，在饲料上午生产、运输和贮存过程中极易被氧化而影响饲料的食效和适口性，甚至会引起牲畜中毒，因此必须添加抗氧化剂。 我公司生产的乙氧基喹啉系列产品是目前世界上性价比较优的抗氧化剂。它具有预防养分氧化腐败的作用，也能提供其他重要作用。";
const workshop3InformationIntroduction = "邻氨基苯乙醚，又名2-氨基苯乙醚、2-乙氧基苯胺、邻乙氧基苯胺，是一种有机化合物，化学式为C8H11NO，主要用作染料、香料、医药的中间体。";

export default {
	name: "WorkshopDashboard",
	components: {
		OrderChart,
		CapacityProgress,
		HazardProcess,
		VideoPause,
		VideoPlay,
	},
	data() {
		return {
			isRoamStarted: false,
			isRoamPaused: false,
			informationType: "workshop1",
			informationTypeOptions: [
				{
					label: "电池车间",
					value: "workshop1",
				},
				{
					label: "乙氧基喹啉车间",
					value: "workshop2",
				},
				{
					label: "邻氨基苯乙醚车间",
					value: "workshop3",
				},
			],
			productionLineData: [
				{
					id: "1",
					name: "产线1",
					capacity: 6064,
					percentage: 0.8,
					startColor: "#00b8ff19",
					endColor: "#00b8ff",
				},
				{
					id: "2",
					name: "产线2",
					capacity: 4138,
					percentage: 0.65,
					startColor: "#d4942d19",
					endColor: "#d4942d",
				},
				{
					id: "3",
					name: "产线3",
					capacity: 5140,
					percentage: 0.7,
					startColor: "#007eff19",
					endColor: "#007eff",
				},
				{
					id: "4",
					name: "产线4",
					capacity: 606,
					percentage: 0.35,
					startColor: "#14bcda19",
					endColor: "#14bcda",
				},
				{
					id: "5",
					name: "产线5",
					capacity: 254,
					percentage: 0.25,
					startColor: "#14bcda19",
					endColor: "#14bcda",
				},
			],
			environmentMonitorData: [
				{
					id: "temperature",
					name: "温度传感器",
					value: "9~16",
					unit: "°C",
					currentValue: "12",
					status: "正常",
					target: "温度",
					count: 0,
				},
				{
					id: "humidity",
					name: "湿度传感器",
					value: "45~60",
					unit: "%",
					currentValue: "50",
					status: "报警",
					target: "湿度",
					count: 5,
				},
				{
					id: "odor",
					name: "气味传感器",
					value: "5",
					unit: "ppb",
					currentValue: "5",
					status: "正常",
					target: "气味",
					count: 0,
				},
				{
					id: "noise",
					name: "噪音传感器",
					value: "73",
					unit: "dB",
					currentValue: "73",
					status: "报警",
					target: "噪音",
					count: 10,
				},
				{
					id: "radiation",
					name: "辐射传感器",
					value: "10",
					unit: "mSv/h",
					currentValue: "10",
					status: "正常",
					target: "辐射",
					count: 0,
				},
			],
			// activeEnvironmentMonitorId: "",
			// activeEnvironmentMonitorData: {},
			personnelData: [
				{
					id: "1",
					name: "张三",
					job: "钳工",
					phone: "186****4606",
					group: "1车间1号生产线",
					location: false,
					visible: false,
				},
				{
					id: "2",
					name: "李四",
					job: "电工",
					phone: "186****4606",
					group: "1车间2生产线",
					location: false,
					visible: false,
				},
				{
					id: "3",
					name: "王五",
					job: "车工",
					phone: "186****4606",
					group: "1车间3号生产线",
					location: false,
					visible: false,
				},
				{
					id: "4",
					name: "赵六",
					job: "经理",
					phone: "186****4606",
					group: "1车间(1-3号生产线)",
					location: false,
					visible: false,
				},
			],
			locationIcon: require("@/assets/speed/case/factory/workshop/personnel/icon-location.png"),
			locationActivateIcon: require("@/assets/speed/case/factory/workshop/personnel/icon-location-activate.png"),
			visibleIcon: require("@/assets/speed/case/factory/workshop/personnel/icon-visible.png"),
			visibleActivateIcon: require("@/assets/speed/case/factory/workshop/personnel/icon-visible-activate.png"),
			hazardData: [
				{
					id: "1",
					type: "not-resolved",
					name: "机械设备老化",
					award: 1,
					uploadPerson: "张三",
					uploadDate: "2023-04-05",
					riskPicture: require("@/assets/speed/case/factory/workshop/hazard/example2.png"),
					resolvePicture: require("@/assets/speed/case/factory/workshop/hazard/example1.png"),
					resolvePerson: "李四",
					resolveDate: "2023-04-26",
					statusImage: require("@/assets/speed/case/factory/workshop/hazard/icon-hazard-dcl.png"),
					process: [
						{
							id: "1-1",
							date: "2023-04-01",
							type: "待处理",
						},
						{
							id: "1-2",
							date: "2023-04-02",
							type: "审核派发",
						},
						{
							id: "1-3",
							date: "2023-04-03",
							type: "已处理",
						},
						{
							id: "1-4",
							date: "2023-04-04",
							type: "隐患解除",
						},
					],
					processExpanded: false,
				},
				{
					id: "2",
					type: "not-checked",
					name: "机械设备老化",
					award: 1,
					uploadPerson: "张三",
					uploadDate: "2023-04-05",
					riskPicture: require("@/assets/speed/case/factory/workshop/hazard/example2.png"),
					resolvePicture: require("@/assets/speed/case/factory/workshop/hazard/example1.png"),
					resolvePerson: "李四",
					resolveDate: "2023-04-26",
					statusImage: require("@/assets/speed/case/factory/workshop/hazard/icon-hazard-shpf.png"),
					process: [
						{
							id: "2-1",
							date: "2023-04-01",
							type: "待处理",
						},
						{
							id: "2-2",
							date: "2023-04-02",
							type: "审核派发",
						},
						{
							id: "2-3",
							date: "2023-04-03",
							type: "已处理",
						},
						{
							id: "2-4",
							date: "2023-04-04",
							type: "隐患解除",
						},
					],
					processExpanded: false,
				},
				{
					id: "3",
					type: "resolved",
					name: "机械设备老化",
					award: 1,
					uploadPerson: "张三",
					uploadDate: "2023-04-05",
					riskPicture: require("@/assets/speed/case/factory/workshop/hazard/example2.png"),
					resolvePicture: require("@/assets/speed/case/factory/workshop/hazard/example1.png"),
					resolvePerson: "李四",
					resolveDate: "2023-04-26",
					statusImage: require("@/assets/speed/case/factory/workshop/hazard/icon-hazard-ycl.png"),
					process: [
						{
							id: "3-1",
							date: "2023-04-01",
							type: "待处理",
						},
						{
							id: "3-2",
							date: "2023-04-02",
							type: "审核派发",
						},
						{
							id: "3-3",
							date: "2023-04-03",
							type: "已处理",
						},
						{
							id: "3-4",
							date: "2023-04-04",
							type: "隐患解除",
						},
					],
					processExpanded: false,
				},
				{
					id: "4",
					type: "done",
					name: "机械设备老化",
					award: 1,
					uploadPerson: "张三",
					uploadDate: "2023-04-05",
					riskPicture: require("@/assets/speed/case/factory/workshop/hazard/example2.png"),
					resolvePicture: require("@/assets/speed/case/factory/workshop/hazard/example1.png"),
					resolvePerson: "李四",
					resolveDate: "2023-04-26",
					statusImage: require("@/assets/speed/case/factory/workshop/hazard/icon-hazard-yhjc.png"),
					process: [
						{
							id: "4-1",
							date: "2023-04-01",
							type: "待处理",
						},
						{
							id: "4-2",
							date: "2023-04-02",
							type: "审核派发",
						},
						{
							id: "4-3",
							date: "2023-04-03",
							type: "已处理",
						},
						{
							id: "4-4",
							date: "2023-04-04",
							type: "隐患解除",
						},
					],
					processExpanded: false,
				},
			],
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
		eventBus.$on("change-roam-status", this.onRoamStatusChange);
	},
	beforeUnmount() {
		eventBus.$off("change-roam-status", this.onRoamStatusChange);
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
		startRoam() {
			eventBus.$emit("handle-roam", "start");
		},
		pauseRoam() {
			eventBus.$emit("handle-roam", "pause");
		},
		resumeRoam() {
			eventBus.$emit("handle-roam", "resume");
		},
		onRoamStatusChange(type) {
			switch (type) {
				case "start":
					this.isRoamStarted = true;
					break;
				case "pause":
					this.isRoamPaused = true;
					break;
				case "resume":
					this.isRoamPaused = false;
					break;
				default:
					break;
			}
		},
		// onEnvironmentMonitorClick(item) {
		// 	if (this.activeEnvironmentMonitorId === item.id) {
		// 		this.activeEnvironmentMonitorId = "";
		// 		this.activeEnvironmentMonitorData = {};
		// 	} else {
		// 		this.activeEnvironmentMonitorData.name = item.name;
		// 		this.activeEnvironmentMonitorData.value = `${item.currentValue}${item.unit}`;
		// 		this.activeEnvironmentMonitorData.status = item.status;
		// 		this.activeEnvironmentMonitorData.target = item.target;
		// 		this.activeEnvironmentMonitorData.count = `${item.count}次`;
		// 		this.activeEnvironmentMonitorId = item.id;
		// 	}
		// },
		onEnvironmentMonitorClick(index) {
			eventBus.$emit("environment-monitor-click", index);
		},
		onPersonnelClick(index) {
			eventBus.$emit("personnel-click", index);
		},
		onLocationIconClick(item) {
			item.location = !item.location;
		},
		onVisibleIconClick(item) {
			item.visible = !item.visible;
		},
		hazardStatusImage(type) {
			switch (type) {
				case "not-resolved":
					return require("@/assets/speed/case/factory/workshop/hazard/status-not-resolved.png");
				case "not-checked":
					return require("@/assets/speed/case/factory/workshop/hazard/status-not-checked.png");
				case "resolved":
					return require("@/assets/speed/case/factory/workshop/hazard/status-resolved.png");
				case "done":
					return require("@/assets/speed/case/factory/workshop/hazard/status-done.png");
				default:
					return require("@/assets/speed/case/factory/workshop/hazard/status-not-resolved.png");
			}
		},
		toggleExpanded(item) {
			item.processExpanded = !item.processExpanded;
		},
	},
	computed: {
		informationIntroduction() {
			switch (this.informationType) {
				case "workshop1":
					return workshop1InformationIntroduction;
				case "workshop2":
					return workshop2InformationIntroduction;
				case "workshop3":
					return workshop3InformationIntroduction;
				default:
					return workshop1InformationIntroduction;
			}
		}
	},
};

</script>

<style lang="scss" scoped>
.workshop {
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

		.information {
			width: 100%;
			padding: 74px 20px 16px 28px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/workshop/information/information-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.el-select {
				width: 100%;
			}

			span {
				width: 100%;
				flex: 1;
				margin-top: 12px;
				display: inline-block;
				font-size: 14px;
				font-weight: 400;
				color: #f0f0f0;
				font-family: Source Han Sans CN, Source Han Sans CN-Regular;
				text-overflow: ellipsis;
				word-break: break-all;
				overflow-y: auto;
			}
		}

		.order {
			width: 100%;
			padding: 80px 30px 14px 39px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/workshop/order/order-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.order-chart {
				width: 100%;
				height: 100%;
			}
		}

		.production {
			width: 100%;
			padding: 80px 18px 23px 31px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/workshop/production/production-box-background.png");
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

		.monitor {
			width: 100%;
			padding: 73px 0 18px 23px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/workshop/monitor/monitor-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			:deep(.el-scrollbar) {
				.el-scrollbar__view {
					padding-right: 16px;
				}
			}

			.content {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: space-between;

				&-item {
					width: 70px;
					height: 96px;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
					cursor: pointer;
					transition: border 0.15s linear;

					&:hover, &.item-active {
						border: 2px solid #06d0fe;
					}

					&:nth-of-type(1) {
						background-image: url("~@/assets/speed/case/factory/workshop/monitor/temperature-background.png");
					}

					&:nth-of-type(2) {
						background-image: url("~@/assets/speed/case/factory/workshop/monitor/humidity-background.png");
					}

					&:nth-of-type(3) {
						background-image: url("~@/assets/speed/case/factory/workshop/monitor/odor-background.png");
					}

					&:nth-of-type(4) {
						background-image: url("~@/assets/speed/case/factory/workshop/monitor/noise-background.png");
					}

					&:nth-of-type(5) {
						background-image: url("~@/assets/speed/case/factory/workshop/monitor/radiation-background.png");
					}

					.row {
						width: 100%;
						margin-bottom: 11px;
						display: flex;
						justify-content: center;
						align-items: center;

						span {
							font-size: 12px;
							font-family: Source Han Sans CN, Source Han Sans CN-Regular;

							&:nth-of-type(1) {
								color: white;
							}

							&:nth-of-type(2) {
								color: #8e8e8e;
							}
						}
					}
				}
			}

			//.environment-dialog {
			//	width: 295px;
			//	height: 253px;
			//	padding: 0 28px;
			//	position: absolute;
			//	bottom: 0;
			//	left: calc(420px + 34px);
			//	display: flex;
			//	flex-direction: column;
			//	background-size: 100% 100%;
			//	background-repeat: no-repeat;
			//
			//	&.temperature {
			//		background-image: url("~@/assets/speed/case/factory/workshop/monitor/temperature-dialog-background.png");
			//	}
			//
			//	&.humidity {
			//		background-image: url("~@/assets/speed/case/factory/workshop/monitor/humidity-dialog-background.png");
			//	}
			//
			//	&.odor {
			//		background-image: url("~@/assets/speed/case/factory/workshop/monitor/odor-dialog-background.png");
			//	}
			//
			//	&.noise {
			//		background-image: url("~@/assets/speed/case/factory/workshop/monitor/noise-dialog-background.png");
			//	}
			//
			//	&.radiation {
			//		background-image: url("~@/assets/speed/case/factory/workshop/monitor/radiation-dialog-background.png");
			//	}
			//
			//	.device-name {
			//		margin-top: 38px;
			//		margin-left: 33px;
			//		font-size: 18px;
			//		font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
			//		font-weight: 700;
			//		font-style: italic;
			//		line-height: 18px;
			//		text-align: left;
			//		color: #c4f0ee;
			//		text-shadow: 0 3px rgba(1, 25, 29, 0.30);
			//	}
			//
			//	.info {
			//		height: 28px;
			//		padding: 0 14px;
			//		display: flex;
			//		align-items: center;
			//		box-shadow: 0 0 10px 0 #13bbd9 inset;
			//
			//		&:first-of-type {
			//			margin-top: 23px;
			//		}
			//
			//		&:not(:first-of-type) {
			//			margin-top: 9px;
			//		}
			//
			//		.label {
			//			width: 61px;
			//			font-size: 14px;
			//			font-family: Source Han Sans CN, Source Han Sans CN-Regular;
			//			line-height: 14px;
			//			color: #f0f0f0;
			//		}
			//
			//		.value {
			//			margin-left: 9px;
			//			font-size: 14px;
			//			font-family: Source Han Sans CN, Source Han Sans CN-Regular;
			//			font-weight: 700;
			//			line-height: 14px;
			//			color: #f0f0f0;
			//		}
			//
			//		&:nth-of-type(1) {
			//			.value {
			//				color: #13ecff;
			//			}
			//		}
			//
			//		&:nth-of-type(4) {
			//			.value {
			//				color: #d4ae2d;;
			//			}
			//		}
			//	}
			//}
		}

		@media (height < 1080px) {
			&__wrapper {
				height: 100%;
				display: flex;
				flex-direction: column;
			}

			.information {
				flex: 2.13;
				overflow: hidden;
			}

			.order {
				flex: 2.13;
				overflow: hidden;
			}

			.production {
				flex: 2.31;
				overflow: hidden;
			}

			.monitor {
				flex: 1.87;
				overflow: hidden;
			}
		}

		@media (height >= 1080px) {
			.information {
				height: 213px;
				min-height: 213px;
			}

			.order {
				height: 213px;
				min-height: 213px;
			}

			.production {
				height: 231px;
				min-height: 231px;
			}

			.monitor {
				height: 187px;
				min-height: 187px;
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

		.personnel {
			width: 100%;
			padding: 80px 0 21px 31px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/workshop/personnel/personnel-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.content {
				flex: 1;
				display: flex;
				flex-direction: column;
				overflow: hidden;

				:deep(.el-scrollbar) {
					.el-scrollbar__view {
						padding-right: 24px;
					}
				}

				&-item {
					height: 88px;
					display: flex;
					cursor: pointer;

					&:not(:first-of-type) {
						margin-top: 16px;
					}

					.avatar {
						width: 84px;
						height: 100%;

						.el-image {
							width: 100%;
							height: 100%;
						}
					}

					.detail {
						flex: 1;
						height: 100%;
						margin-left: 6px;
						padding: 7px 11px 9px 13px;
						display: flex;
						justify-content: space-between;
						background: linear-gradient(0deg, rgba(20, 188, 218, 0.1) 0%, rgba(20, 188, 218, 0.30) 99%);
						border: 1px solid #138ffc4c;

						&-left {
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: flex-start;

							.row {
								display: flex;
								align-items: center;

								&:not(:first-of-type) {
									margin-top: 10px;
								}
							}

							.name {
								background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
								font-size: 16px;
								font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
								font-weight: 700;
								font-style: italic;
								color: #f0f0f0;
								line-height: 16px;
								background-clip: text;
							}

							.job {
								padding: 1px 2px;
								margin-left: 12px;
								display: flex;
								justify-content: center;
								align-items: center;
								border: 1px solid #34efa2;

								span {
									font-size: 12px;
									font-family: Source Han Sans CN, Source Han Sans CN-Regular;
									font-weight: 400;
									line-height: 12px;
									color: #34efa2;
								}
							}

							.el-image {
								width: 13px;
								height: 13px;
							}

							span {
								&.phone, &.group {
									font-size: 12px;
									font-family: Source Han Sans CN, Source Han Sans CN-Medium;
									font-weight: 500;
									text-align: left;
									color: #f0f0f0;
									line-height: 12px;
								}
							}
						}

						&-right {
							display: flex;
							flex-direction: column;

							.certificate {
								width: 44px;
								height: 48px;
							}

							.row {
								width: 44px;
								height: 20px;
								margin-top: 4px;
								display: flex;
								align-items: center;
								border: 1px solid #14bcda;

								.divider {
									width: 1px;
									height: 100%;
									background-color: #14bcda;
								}

								.image {
									flex: 1;
									height: 100%;
									display: flex;
									justify-content: center;
									align-items: center;
									cursor: pointer;

									&.item-active {
										background-color: rgba(20, 188, 218, 0.20);
									}

									.el-image {
										width: 100%;
										height: 100%;
									}
								}
							}
						}
					}
				}
			}
		}

		.hazard {
			width: 100%;
			padding: 80px 0 21px 33px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/workshop/hazard/hazard-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.content {
				flex: 1;
				display: flex;
				flex-direction: column;
				overflow: hidden;

				:deep(.el-scrollbar) {
					.el-scrollbar__view {
						padding-right: 24px;
					}
				}

				&-item {
					width: 100%;
					padding: 22px 21px 20px 14px;
					display: flex;
					flex-direction: column;
					position: relative;
					background: linear-gradient(0deg, rgba(20, 188, 218, 0.1) 0%, rgba(20, 188, 218, 0.30) 99%);
					border: 1px solid #138ffc4c;

					&:not(:first-of-type) {
						margin-top: 16px;
					}

					.el-image.type {
						width: 58px;
						height: 50px;
						position: absolute;
						top: 25px;
						right: 21px;
					}

					.hazard-header {
						display: flex;
						align-items: center;

						.el-image {
							width: 40px;
							height: 40px;
						}

						.name {
							margin-left: 7px;
							margin-right: 10px;
							background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
							background-clip: text;
							font-size: 16px;
							font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
							font-weight: 700;
							font-style: italic;
							line-height: 16px;
							text-align: left;
							color: #f0f0f0;
						}

						.type {
							width: 56px;
							height: 16px;
							background-color: #168ed2;
							font-size: 12px;
							font-family: Source Han Sans CN, Source Han Sans CN-Medium;
							font-weight: 500;
							line-height: 16px;
							text-align: center;
							color: #f0f0f0;
						}
					}

					.body {
						display: flex;
						margin-top: 10px;

						&-left {
							flex: 1;
							padding-left: 10px;
							display: flex;
							flex-direction: column;

							.row {
								display: flex;
								align-items: center;

								.block {
									width: 4px;
									height: 4px;
									margin-right: 8px;
									background-color: #14bcda;
								}

								span:nth-of-type(1) {
									font-size: 12px;
									font-family: Source Han Sans CN, Source Han Sans CN-Regular;
									font-weight: 400;
									line-height: 12px;
									color: #a2eefc;
								}

								span:nth-of-type(2) {
									margin-left: 6px;
									font-size: 12px;
									font-family: Source Han Sans CN, Source Han Sans CN-Bold;
									font-weight: 700;
									line-height: 12px;
									color: #f0f0f0;
								}
							}

							.row + .row {
								margin-top: 10px;
							}
						}

						&-right {
							flex: 1;
							padding-left: 10px;
							display: flex;
							flex-direction: column;

							.row {
								display: flex;
								align-items: center;

								.block {
									width: 4px;
									height: 4px;
									margin-right: 8px;
									background-color: #14bcda;
								}

								span:nth-of-type(1) {
									font-size: 12px;
									font-family: Source Han Sans CN, Source Han Sans CN-Regular;
									font-weight: 400;
									line-height: 12px;
									color: #a2eefc;
								}

								span:nth-of-type(2) {
									margin-left: 6px;
									font-size: 12px;
									font-family: Source Han Sans CN, Source Han Sans CN-Bold;
									font-weight: 700;
									line-height: 12px;
									color: #f0f0f0;
								}
							}

							.second-row {
								margin-top: 10px;
								display: flex;
								justify-content: space-between;
								align-items: center;
							}

							.image-row {
								margin-top: 9px;
								padding-left: 12px;
								display: flex;
								justify-content: space-between;
								align-items: center;

								.el-image {
									width: 54px;
									height: 44px;
								}
							}
						}
					}

					.process-wrapper {
						margin-top: 22px;
						display: flex;
						flex-direction: column;

						.row {
							display: flex;
							align-items: center;
							cursor: pointer;

							.node {
								width: 30px;
								height: 30px;
							}

							.process-title {
								margin-left: 3px;
								margin-right: 7px;
								background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
								background-clip: text;
								font-size: 16px;
								font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
								font-weight: 700;
								font-style: italic;
								line-height: 16px;
								color: #f0f0f0;
							}

							.arrow {
								width: 21px;
								height: 30px;
								transition: all 0.15s ease-in-out;

								&.expanded {
									transform: rotate(90deg);
								}
							}
						}

						.process-enter-active,
						.process-leave-active {
							height: auto;
							transition: all 0.15s ease-in-out;
						}

						.process-enter,
						.process-leave-to {
							height: 0;
						}

						.hazard-process {
							margin-top: 10px;
							overflow: hidden;
						}
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

			.personnel {
				flex: 4;
				overflow: hidden;
			}

			.hazard {
				flex: 4.95;
				overflow: hidden;
			}
		}

		@media (height >= 1080px) {
			.personnel {
				height: 400px;
				min-height: 400px;
			}

			.hazard {
				height: 495px;
				min-height: 495px;
			}
		}
	}

	.roam-control {
		position: absolute;
		bottom: 40px;
		left: 50%;
		transform: translateX(-50%);

		.el-button {
			.el-icon {
				width: 18px;
				height: 18px;
				font-size: 18px;
			}
		}
	}
}

:deep(.el-select.custom-select) {
	box-shadow: 0 0 10px 0 #13bbd9 inset;

	.el-input {
		.el-input__wrapper {
			background-color: transparent;
			border-radius: 0;
			box-shadow: 0 0 0 1px #14abda !important;

			.el-input__inner {
				border: none;

				font-size: 14px;
				font-family: Source Han Sans CN, Source Han Sans CN-Medium;
				font-weight: 500;
				text-align: left;
				color: #14bcda;
			}

			.el-input__suffix {
				.el-icon {
					color: #14abda;
				}
			}
		}
	}
}
</style>
