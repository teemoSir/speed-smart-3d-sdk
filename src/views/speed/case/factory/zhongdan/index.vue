<template>
	<div class="factory">
		<FactoryMap ref="factoryMap"/>

		<FactoryHeader :menus="menus"/>

		<router-view v-slot="{ Component }">
			<transition name="router" mode="out-in">
				<component :is="Component"/>
			</transition>
		</router-view>

		<!--		<div class="features-panel" v-show="featuresPanelVisible">-->
		<!--			<span class="title">构建属性</span>-->
		<!--			<div class="close" @click="hideFeaturesPanel">-->
		<!--				<span>X</span>-->
		<!--			</div>-->
		<!--			<div class="feature" v-for="item in featuresData" :key="item.key">-->
		<!--				<span class="key">{{ item.key }}</span>-->
		<!--				<span class="value">{{ item.value }}</span>-->
		<!--			</div>-->
		<!--		</div>-->
	</div>
</template>

<script>
import eventBus from "@/utils/eventBus";
import FactoryMap from "./components/map/index.vue";
import FactoryHeader from "./components/header/index.vue";

export default {
	name: "ZhongdanFactory",
	components: {
		FactoryMap,
		FactoryHeader
	},
	data() {
		return {
			menus: [
				{
					id: "enterprise",
					name: "企业看板",
					path: "/speed/case/factory/zhongdan/enterprise"
				},
				{
					id: "factory-area",
					name: "厂区看板",
					path: "/speed/case/factory/zhongdan/factoryarea"
				},
				{
					id: "workshop",
					name: "车间看板",
					path: "/speed/case/factory/zhongdan/workshop"
				},
				{
					id: "production-line",
					name: "产线看板",
					path: "/speed/case/factory/zhongdan/productionline"
				}
			],
			// featuresPanelVisible: false,
			// featuresData: [],
		}
	},
	mounted() {
		// eventBus.$on("feature-query", this.onFeatureQuery);
		eventBus.$on("main-product-click", this.onMainProductClick);
		eventBus.$on("toggle-risk-operations", this.onToggleRiskOperations);
		eventBus.$on("risk-operation-click", this.onRiskOperationClick);
		eventBus.$on("material-click", this.onMaterialClick);
		eventBus.$on("environment-monitor-click", this.onEnvironmentMonitorClick);
		eventBus.$on("personnel-click", this.onPersonnelClick);
		eventBus.$on("handle-roam", this.onHandleRoam);
		eventBus.$on("device-click", this.onDeviceClick);
		eventBus.$on("alarm-click", this.onAlarmClick);
		eventBus.$on("production-line-click", this.onProductionLineClick);
	},
	beforeUnmount() {
		// eventBus.$off("feature-query", this.onFeatureQuery);
		eventBus.$off("main-product-click", this.onMainProductClick);
		eventBus.$off("toggle-risk-operations", this.onToggleRiskOperations);
		eventBus.$off("risk-operation-click", this.onRiskOperationClick);
		eventBus.$off("material-click", this.onMaterialClick);
		eventBus.$off("environment-monitor-click", this.onEnvironmentMonitorClick);
		eventBus.$off("personnel-click", this.onPersonnelClick);
		eventBus.$off("handle-roam", this.onHandleRoam);
		eventBus.$off("device-click", this.onDeviceClick);
		eventBus.$off("alarm-click", this.onAlarmClick);
		eventBus.$off("production-line-click", this.onProductionLineClick);
	},
	methods: {
		handleSwitchMenu(menu) {
			console.log("switch to menu:", menu.name, ", do something below here");
		},
		// 属性点击查询事件
		// onFeatureQuery(features) {
		// 	// console.log("features:", features);
		// 	if (features && features.length === 2) {
		// 		this.$refs.factoryMap.flyToComponent(features[1].value);
		// 		this.featuresData = features;
		// 		this.featuresPanelVisible = true;
		// 	} else {
		// 		this.featuresPanelVisible = false;
		// 		this.featuresData = [];
		// 	}
		// },
		// hideFeaturesPanel() {
		// 	this.featuresPanelVisible = false;
		// },

		// 主要产品点击
		onMainProductClick(index) {
			this.$refs.factoryMap.flyToMainProduct(index);
		},
		// 风险作业区域显示隐藏
		onToggleRiskOperations(show) {
			this.$refs.factoryMap.toggleRiskOperations(show);
		},
		onRiskOperationClick(name) {
			this.$refs.factoryMap.flyToRiskOperation(name);
		},
		onHandleRoam(type) {
			switch (type) {
				case "start":
					this.$refs.factoryMap.startRoam();
					eventBus.$emit("change-roam-status", "start");
					break;
				case "pause":
					this.$refs.factoryMap.pauseRoam();
					eventBus.$emit("change-roam-status", "pause");
					break;
				case "resume":
					this.$refs.factoryMap.resumeRoam();
					eventBus.$emit("change-roam-status", "resume");
					break;
				default:
					break;
			}
		},
		// 厂区看板材料统计点击
		onMaterialClick(componentName) {
			if (componentName) {
				this.$refs.factoryMap.highlightComponent(componentName);
			} else {
				this.$refs.factoryMap.clearHighlightComponent();
				this.$refs.factoryMap.flyToModel();
			}
		},
		// 环境监控点击
		onEnvironmentMonitorClick(index) {
			this.$refs.factoryMap.flyToEnvironmentMonitor(index);
		},
		// 人员情况点击
		onPersonnelClick(index) {
			this.$refs.factoryMap.flyToPersonnel(index);
		},
		// 设备信息点击
		onDeviceClick(index) {
			this.$refs.factoryMap.flyToDevice(index);
		},
		// 告警信息点击
		onAlarmClick(index) {
			this.$refs.factoryMap.flyToAlarm(index);
		},
		// 产线点击
		onProductionLineClick(componentName) {
			if (componentName) {
				this.$refs.factoryMap.flyToComponent(componentName);
			}
		},
	},
	watch: {
		$route: {
			handler(val) {
				const menu = this.menus.find((item) => item.path === val.path)
				this.handleSwitchMenu(menu);

				if (this.$refs.factoryMap) {
					// this.hideFeaturesPanel();
					this.$refs.factoryMap.flyToModel();
					// this.$refs.factoryMap.setFeatureQueryEnabled(menu.id === "enterprise");
					this.$refs.factoryMap.removeMainProductsEntities();
					this.$refs.factoryMap.removeVideoEntities();
					this.$refs.factoryMap.removeRiskOperationWalls();
					this.$refs.factoryMap.removeVideoEntities();
					this.$refs.factoryMap.removeEnvironmentMonitorEntities();
					this.$refs.factoryMap.removePersonnelEntities();
					this.$refs.factoryMap.removeHazardEntities();
					this.$refs.factoryMap.removeDeviceEntities();
					this.$refs.factoryMap.removeAlarmEntities();
					this.$refs.factoryMap.closeMainProductPopup();
					this.$refs.factoryMap.closeEnvironmentMonitorPopup();
					this.$refs.factoryMap.closePersonnelPopup();
					this.$refs.factoryMap.closeHazardPopup();
					this.$refs.factoryMap.closeDevicePopup();
					this.$refs.factoryMap.closeAlarmPopup();
					this.$refs.factoryMap.clearHighlightComponent();
					this.$refs.factoryMap.stopRoam();

					if (menu.id === "enterprise") {
						this.$refs.factoryMap.drawMainProductsEntities();
					} else if (menu.id === "factory-area") {
						this.$refs.factoryMap.drawVideoEntities();
						this.$refs.factoryMap.drawRiskOperationWalls();
					} else if (menu.id === "workshop") {
						this.$refs.factoryMap.drawEnvironmentMonitorEntities();
						this.$refs.factoryMap.drawPersonnelEntities();
						this.$refs.factoryMap.drawHazardEntities();
					} else if (menu.id === "production-line") {
						this.$refs.factoryMap.drawDeviceEntities();
						this.$refs.factoryMap.drawAlarmEntities();
					}
				}
			},
			immediate: true
		}
	}
};

</script>

<style lang="scss" scoped>
* {
	position: relative;
}

@font-face {
	font-family: "AlimamaShuHeiTi-Bold";
	font-style: normal;
	font-weight: bold;
	src: url("./fonts/AlimamaShuHeiTi-Bold.woff2") format("woff2"),
	url("./fonts/AlimamaShuHeiTi-Bold.woff") format("woff"),
	url("./fonts/AlimamaShuHeiTi-Bold.ttf") format("truetype"),
	url("./fonts/AlimamaShuHeiTi-Bold.otf") format("otf");
}

.factory {
	width: 100%;
	height: 100%;
	overflow: hidden;

	.factory-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1;
	}

	//.features-panel {
	//	width: 400px;
	//	position: absolute;
	//	left: 50%;
	//	top: 50%;
	//	transform: translate(-50%, -50%);
	//	display: flex;
	//	flex-direction: column;
	//	background-color: rgba(29, 57, 76, 0.8);
	//	border: 1px solid rgb(0, 153, 255);
	//	z-index: 999;
	//
	//	.title {
	//		color: white;
	//		font-family: "AlimamaShuHeiTi-Bold";
	//		font-size: 24px;
	//		font-weight: 600;
	//		text-align: center;
	//		line-height: 50px;
	//		border-bottom: 1px solid rgba(0, 153, 255, 0.3);
	//	}
	//
	//	.close {
	//		position: absolute;
	//		top: 16px;
	//		right: 20px;
	//		font-size: 16px;
	//		color: white;
	//		cursor: pointer;
	//	}
	//
	//	.feature {
	//		display: flex;
	//		align-items: center;
	//		margin: 0 10px;
	//		padding: 5px 0;
	//
	//		&:not(:last-of-type) {
	//			border-bottom: 1px solid white;
	//		}
	//
	//		& > span {
	//			width: 50%;
	//			color: white;
	//			font-size: 14px;
	//			text-align: left;
	//			word-wrap: break-word;
	//		}
	//	}
	//}
}

.router-enter-active,
.router-leave-active {
	opacity: 1;
	transition: all 0.15s ease-in-out;
}

.router-enter,
.router-leave-to {
	opacity: 0;
}
</style>
