<template>
	<div class="building">
		<div class="banner">
			<img
				class="banner-bg"
				:src="require('@/assets/speed/solution/city/banner.png')"
				alt="banner"
				object-fit="cover"
			/>

			<div class="content">
				<span class="content-title">城市与新区</span>

				<span class="introduction">
					智慧城市是通过综合运用现代科学技术、整合信息资源、统筹业务应用系统，加强城市规划、建设和管理的新模式。智慧城市的本质在于信息化与城市化的高度融合，可通过地理信息技术、三维可视化技术、物联网、云计算、人工智能等新型技术实现智慧城市的建设。智慧城市解决方案是面向党政机关、政府部门、企业、社会群众、个人的不同需求，打造定制化的信息系统，满足包括政务管理性应用、商业化应用、社会公益性应用等场景的需求，成为加速推动区域经济发展和产业发展的有效推动力。
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

				<div class="wrapper">
					<div class="row">
						<div class="item" v-for="item in highlightData.slice(0, 2)" :key="item.id">
							<img :src="item.icon"/>
							<div class="column">
								<span class="item-title">{{ item.title }}</span>
								<span class="introduction">{{ item.introduction }}</span>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="item" v-for="item in highlightData.slice(2, 4)" :key="item.id">
							<img :src="item.icon"/>
							<div class="column">
								<span class="item-title">{{ item.title }}</span>
								<span class="introduction">{{ item.introduction }}</span>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="item" v-for="item in highlightData.slice(4, 6)" :key="item.id">
							<img :src="item.icon"/>
							<div class="column">
								<span class="item-title">{{ item.title }}</span>
								<span class="introduction">{{ item.introduction }}</span>
							</div>
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
	name: "City",
	data() {
		return {
			highlightData: [
				{
					id: "1",
					icon: require("@/assets/speed/solution/city/icon-highlight-1.png"),
					title: "系统可融合多种空间信息模型",
					introduction: "包括倾斜摄影、BIM、激光点云等空间数据，构建地理实体。同时可并承载自然资源数据、政务数据、通信大数据等多源数据，实现多源异构数据的处理与分析，并与三维地理模型进行融合显示，实现对城市场景的孪生再造。",
				},
				{
					id: "2",
					icon: require("@/assets/speed/solution/city/icon-highlight-2.png"),
					title: "结合BIM与GIS模型，打造CIM城市信息模型",
					introduction: "赋予BIM数据真实的空间地理位置，构建城市三维仿真场景，打造城市数字孪生。宏观上，对建筑及内部房间等进行精确定位；微观上，又可以了解建筑及设备设施的精细构造，并可基于周边环境进行缓冲区分析、叠置分析、交通可达性分析等空间分析。",
				},
				{
					id: "3",
					icon: require("@/assets/speed/solution/city/icon-highlight-3.png"),
					title: "采用物联网技术，全面集成物联感知渠道",
					introduction: "构建物联网系统的网络逻辑结构，场景化、事件化地联通物联感知状态及业务指标，实现业务运行的全流程监控，以及城市运行状态的实时监控，如交通流量监测、地下管网检测、空气质量监测等，为城市管理助力。",
				},
				{
					id: "4",
					icon: require("@/assets/speed/solution/city/icon-highlight-4.png"),
					title: "基于人工智能技术，利用平台中的城市的时空大数据",
					introduction: "针对各类城市问题，建立选址分析、人口预测、资源承载力评价等业务模型，结合实体、指标等数据成果，实现基于领域模型的预测决策分析和预测决策结果的可视化表达，充分发挥平台中时空大数据的数据价值。",
				},
				{
					id: "5",
					icon: require("@/assets/speed/solution/city/icon-highlight-5.png"),
					title: "融合倾斜摄影、激光点云数据、GIS基础数据、IOT数据",
					introduction: "及其他业务数据，匹配不同尺度与不同颗粒度数据，生成多尺度数据融合标准，以此标准为依据，自定义不同层级呈现的数据主题，完成人、事、地、物全要素的多尺度建模，实现物理空间与数字空间的分层次映射。",
				},
				{
					id: "6",
					icon: require("@/assets/speed/solution/city/icon-highlight-6.png"),
					title: "基于三维建模和深度学习等关键技术，对点云进行语义分割",
					introduction: "行多场景下的事件检测、事件相关元素以及事件间的关系抽取，再进一步做单体的语义建模，形成三维语义模型，实现语义化的三维模型能够保障用户对场景的充分认知，增强用户体验。",
				},
			],
			functionData: [
				{
					id: "pipeline",
					name: "地下管网三维可视化",
					icon: require("@/assets/speed/solution/city/icon-pipeline.png"),
					labels: [
						"仿真形象",
						"方便查找",
						"提供参考",
					],
					introduction: "对城市地下管网进行可视化，直观显示地下管线的空间层次和位置，以仿真方式形象展现地下管线的埋深、材质、形状、走向以及工井结构和周边环境。与以往的管线平面图相比，极大地方便了排管、工井占用情况、位置等信息的查找，为今后地下管线资源的统筹利用和科学布局、管线占用审批等工作提供了准确、直观、高效的参考。",
					exampleImage: require("@/assets/speed/solution/city/example-pipeline.png"),
				},
				{
					id: "traffic",
					name: "城市交通可视化",
					icon: require("@/assets/speed/solution/city/icon-traffic.png"),
					labels: [
						"可视化管理",
						"联动更新",
						"辅助车辆调度调控",
					],
					introduction: "对城市交通运行及设备进行可视化管理，包括交通信号灯、公交站台、充电桩、交通路况等，展示交通统计信息，并随场景地图变化联动更新，展示交通设备地理位置分布，设备实时的运行状态及监测指标等。比如信号灯当前路段拥堵指数、公交站台客流指数及到站车辆详情、充电桩分布情况及当前使用指数等，对交通现况一目了然，辅助进行车辆调度调控。",
					exampleImage: require("@/assets/speed/solution/city/example-traffic.png"),
				},
				{
					id: "component",
					name: "城市部件可视化",
					icon: require("@/assets/speed/solution/city/icon-component.png"),
					labels: [
						"可视化管理",
						"全面管理",
						"提高维护效率",
					],
					introduction: "对城市部件进行可视化管理，包括灯杆、井盖、垃圾桶等各设施部件。分类展示城市各部件设施的空间分布和密度情况，图表方式展示城市部件的总体统计信息，并随场景联动更新。展示城市部件的运行状态和等级，包括运行正常、异常、告警和其他等等；不同等级的告警状态以不同的颜色、闪烁等方式展示，帮助城市管理者对部件设施的全面管理，提高维护效率",
					exampleImage: require("@/assets/speed/solution/city/example-component.png"),
				},
				{
					id: "water",
					name: "城市水网可视化",
					icon: require("@/assets/speed/solution/city/icon-water.png"),
					labels: [
						"可视化管理",
						"解决问题",
						"灾害预警",
					],
					introduction: "对城市中的河道、湖泊进行可视化管理。主要包括水位、河流走势、管网、以及两岸建筑物的三维可视化。对于旱涝灾害预警、供排水管网、河湖管理起到关键作用，解决了旱涝灾害应急监测过程中存在的数据类型复杂、管线分布密集、区域覆盖庞大、人工监测不及时等问题，并对灾害起到预警作用。",
					exampleImage: require("@/assets/speed/solution/city/example-water.png"),
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

			.wrapper {
				margin-top: 63px;
				display: flex;
				flex-direction: column;

				.row {
					display: flex;
					align-items: center;

					&:not(:first-of-type) {
						margin-top: 39px;
					}
				}

				.item {
					width: 690px;
					height: 160px;
					padding: 34px 42px 36px 20px;
					display: flex;
					align-items: center;
					background: url("@/assets/speed/solution/city/highlight-item-background.png") no-repeat;
					background-size: 100% 100%;

					img {
						width: 100px;
						height: 100px;
					}

					.column {
						margin-left: 20px;
						display: flex;
						flex-direction: column;

						.item-title {
							font-size: 18px;
							font-family: Source Han Sans CN, Source Han Sans CN-Bold;
							font-weight: 700;
							color: #f0f0f0;
							letter-spacing: 0.43px;
							line-height: 18px;
							text-shadow: -5px 0px 6px 5px #000000;
						}

						.introduction {
							margin-top: 16px;
							opacity: 0.65;
							font-size: 14px;
							font-family: Source Han Sans CN, Source Han Sans CN-Regular;
							font-weight: 400;
							color: #f0f0f0;
							letter-spacing: 0.34px;
							line-height: 14px;
						}
					}
				}

				.item + .item {
					margin-left: 60px;
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
