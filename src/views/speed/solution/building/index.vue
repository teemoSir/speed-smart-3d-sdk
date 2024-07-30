<template>
	<div class="building">
		<div class="banner">
			<img
				class="banner-bg"
				:src="require('@/assets/speed/solution/building/banner.png')"
				alt="banner"
				object-fit="cover"
			/>

			<div class="content">
				<span class="content-title">园区与建筑</span>

				<span class="introduction">
					随着地理信息技术、三维可视化技术、物联网、移动互联和云计算等技术的飞速发展，“智慧园区”和“智慧楼宇”的概念迅速走入人们的视野。立足园区业务需要，通过建设园区和建筑的三维模型，并结合云计算、物联网、大数据等技术，接入园区和楼宇的海量信息，结合AI智能化分析，提供基于BIM的规划、建设、管理、运营为一体的信息化平台，可面向园区和楼宇的管理者及决策者，提供园区和楼宇规划建设、招商推介、运营监管、安防指挥调度全方位的应用服务。
				</span>
			</div>
		</div>

		<div class="highlight">
			<img
				class="highlight-bg"
				:src="require('@/assets/speed/solution/highlight-background.png')"
				alt="highlight background"
				object-fit="cover"
			/>

			<div class="content">
				<span class="content-title">方案亮点</span>

				<div class="row">
					<div class="left">
						<div class="highlight-item">
							<span class="title">01.自动对BIM数据进行轻量化处理</span>
							<span class="introduction">
								采用数据分级切片技术，可根据用户当前的浏览需求自动调整加载数据的等级。在保证画面细节的同时兼顾加载速率，为用户打造最流畅的浏览体验。
							</span>
						</div>

						<div class="highlight-item">
							<span class="title">02.采用物联网技术集成</span>
							<span class="introduction">
								园区或楼宇内部所有传感信息，能够对各类传感器的信息进行接入和实时监控。并具备数据清洗、预测预警、研判分析、系统联动、三维展示等能力，实现了信息集成、多方联动、互联互通、信息共享的目标。
							</span>
						</div>
					</div>

					<img
						class="icon"
						:src="require('@/assets/speed/solution/building/icon-highlight.png')"
						alt="highlight icon"
						object-fit="cover"
					/>

					<div class="right">
						<div class="highlight-item">
							<span class="highlight-item-title">03.建立综合管理服务平台</span>
							<span class="introduction">
								打通数据资源流程、挖掘数据价值，为园区规划设计、施工建设、运行维护、招商运营等提供各种信息服务，将动态信息汇聚与统一平台，无缝连接客户、管理人员、第三方平台等，为园区和楼宇的管理决策提供依据和助力。
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="functions">
			<span class="functions-title">系统功能</span>

			<div
				class="function"
				v-for="(item, index) in functionData"
				:key="item.id"
				@mouseenter="handleMouseEnter(index)"
				@mouseleave="handleMouseLeave"
			>
				<div class="left-border" v-if="index === currentFunctionIndex"></div>

				<div class="left">
					<div class="head">
						<img class="icon" :src="item.icon" alt="function icon"/>
						<span class="function-name">{{ item.name }}</span>
					</div>

					<div class="labels">
						<div class="label__wrapper" v-for="label in item.labels" :key="label">
							<span>{{ label }}</span>
						</div>
					</div>

					<span class="introduction">{{ item.introduction }}</span>
				</div>

				<div class="right">
					<img :src="item.exampleImage" alt="function example" object-fit="cover"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: "Building",
	data() {
		return {
			functionData: [
				{
					id: "security",
					name: "安全管理",
					icon: require("@/assets/speed/solution/building/icon-security.png"),
					labels: [
						"运行参数",
						"运行状态",
						"运行时间",
					],
					introduction: "通过物联网技术集成各处传感器数据，全面记录重要设备的运行参数、运行状态、运行时间及总运行小时数等信息，出现异常情况时，在集成平台上实时显示各子系统重要报警信息，管理人员可第一时间获取信息，并通过集成平台远程排查，了解设备现场情况。",
					exampleImage: require("@/assets/speed/solution/building/example-security.png"),
				},
				{
					id: "power",
					name: "能耗监控",
					icon: require("@/assets/speed/solution/building/icon-power.png"),
					labels: [
						"精细化计量",
						"精准全面",
						"完备的数据基础",
					],
					introduction: "可以对水、电、气、空调能量等能耗实现精细化计量，数据采集精准全面，能耗数据采集单位细化至部门和个人，清楚能源消耗的趋势与占比，为能耗成本统计分析、能耗定额管理和节能指标管理提供完备的数据基础。",
					exampleImage: require("@/assets/speed/solution/building/example-power.png"),
				},
				{
					id: "equipment",
					name: "设备运维",
					icon: require("@/assets/speed/solution/building/icon-equipment.png"),
					labels: [
						"统一控制",
						"提升效率",
						"减少工作量",
					],
					introduction: "可以将建筑内繁多的系统（电梯、空调、风机、水泵、电梯、锅炉、配电房、照明等）接入平台进行统一的控制与管理，能够实现远程值班，减少日常工作量和人员配备，提升运维效率和质量。",
					exampleImage: require("@/assets/speed/solution/building/example-equipment.png"),
				},
				{
					id: "personnel",
					name: "人员管理",
					icon: require("@/assets/speed/solution/building/icon-personnel.png"),
					labels: [
						"人员考勤",
						"人员流动",
						"电子围栏",
					],
					introduction: "可结合GPS定位和UWB技术对人员进行定位，时刻监控园区和楼宇内的人员流动和人员数量，并实时显示在三维地图中。对于人员考勤、人员流动、电子围栏、定员管理等场景有重要价值。",
					exampleImage: require("@/assets/speed/solution/building/example-personnel.png"),
				},
			],
			currentFunctionIndex: -1,
		};
	},
	methods: {
		handleMouseEnter(index) {
			this.currentFunctionIndex = index;
		},
		handleMouseLeave() {
			this.currentFunctionIndex = -1;
		},
	},
})
</script>

<style lang="scss" scoped>
.building {
	display: flex;
	flex-direction: column;

	.banner {
		width: 100%;
		height: 640px;
		position: relative;

		&-bg {
			width: 100%;
			height: 100%;
		}

		.content {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			&-title {
				font-size: 48px;
				font-family: ZiZhiQuXiMaiTi, ZiZhiQuXiMaiTi-Regular;
				font-weight: 400;
				color: white;
				letter-spacing: 3.36px;
				text-shadow: -2px 0px 6px 2px rgba(0, 0, 0, 0.53);
			}

			.introduction {
				width: min(47%, 901px);
				margin-top: 39px;
				font-size: 16px;
				font-family: Source Han Sans CN, Source Han Sans CN-Medium;
				font-weight: 500;
				text-align: center;
				color: #f0f0f0;
				letter-spacing: 1.28px;
			}
		}
	}

	.highlight {
		width: 100%;
		height: 840px;
		position: relative;

		&-bg {
			width: 100%;
			height: 100%;
		}

		.content {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			&-title {
				font-size: 40px;
				font-family: Source Han Sans CN, Source Han Sans CN-Bold;
				font-weight: 700;
				color: white;
				letter-spacing: 0.96px;
				text-shadow: -5px 0px 6px 5px #000000;
			}

			.row {
				margin-top: 101px;
				display: flex;
				justify-content: center;
				align-items: center;

				.left {
					display: flex;
					flex-direction: column;

					.highlight-item {
						height: 180px;
						background: url("@/assets/speed/solution/building/highlight-left-background.png") no-repeat;
					}
				}

				.right {
					width: 400px;
					height: 240px;
					background: url("@/assets/speed/solution/building/highlight-right-background.png") no-repeat;
					background-size: 100% 100%;

					.highlight-item {
						height: 240px;
						align-items: flex-end;
						background: url("@/assets/speed/solution/building/highlight-right-background.png") no-repeat;
					}
				}

				.icon {
					margin-left: 111px;
					margin-right: 111px;
					width: 408px;
					height: 492px;
				}

				.highlight-item {
					width: 400px;
					padding: 43px 29px;
					display: flex;
					flex-direction: column;
					background-size: 100% 100%;

					&:not(:first-of-type) {
						margin-top: 97px;
					}

					&-title {
						font-size: 18px;
						font-family: Source Han Sans CN, Source Han Sans CN-Bold;
						font-weight: 700;
						color: #f0f0f0;
						letter-spacing: 0.43px;
						line-height: 18px;
						text-shadow: -5px 0px 6px 5px #000000;
					}

					.introduction {
						width: 315px;
						height: 62px;
						margin-top: 14px;
						opacity: 0.65;
						font-size: 14px;
						font-family: Source Han Sans CN, Source Han Sans CN-Regular;
						color: #f0f0f0;
						letter-spacing: 0.34px;
						line-height: 14px;
					}
				}
			}
		}
	}

	.functions {
		width: 100%;
		height: auto;
		padding-bottom: 100px;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: url("@/assets/speed/solution/functions-background.png") no-repeat;
		background-size: 100% 100%;

		&-title {
			margin-top: 100px;
			margin-bottom: 66px;
			font-size: 40px;
			font-family: Source Han Sans CN, Source Han Sans CN-Bold;
			font-weight: 700;
			color: white;
			letter-spacing: 0.96px;
			text-shadow: -5px 0px 6px 5px #000000;
		}

		.function {
			width: min(1440px, 75%);
			height: 600px;
			position: relative;
			display: flex;
			background-color: #041022;
			border: 1px solid #49566c;

			&:not(:first-of-type) {
				margin-top: 80px;
			}

			&:hover {
				border-color: #0061dd;
			}

			.left-border {
				width: 8px;
				position: absolute;
				left: 0;
				top: 0;
				bottom: 0;
				background-color: #0061dd;
			}

			.left {
				flex: 4.3;
				padding: 65px 60px 84px 50px;
				display: flex;
				flex-direction: column;

				.head {
					display: flex;
					align-items: center;

					.icon {
						width: 70px;
						height: 70px;
					}

					.function-name {
						margin-left: 20px;
						font-size: 36px;
						font-family: Source Han Sans CN, Source Han Sans CN-Bold;
						font-weight: 700;
						color: white;
						letter-spacing: 0.86px;
						line-height: 36px;
						text-shadow: -5px 0px 6px 5px #000000;
					}
				}

				.labels {
					margin-top: 25px;
					margin-bottom: 57px;
					display: flex;
					align-items: center;

					.label__wrapper {
						height: 26px;
						padding: 0 20px;
						display: inline-flex;
						justify-content: center;
						align-items: center;
						background: url("@/assets/speed/solution/label-background.png") no-repeat;
						background-size: 100% 100%;

						& > span {
							font-size: 14px;
							font-family: Source Han Sans CN, Source Han Sans CN-Regular;
							color: white;
							letter-spacing: 0.34px;
							line-height: 14px;
						}
					}
				}

				.introduction {
					font-family: Source Han Sans CN, Source Han Sans CN-Regular;
					font-weight: 400;
					color: #f0f0f0;
					letter-spacing: 1.28px;
					line-height: 16px;
				}
			}

			.right {
				flex: 5.7;

				img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}
</style>
