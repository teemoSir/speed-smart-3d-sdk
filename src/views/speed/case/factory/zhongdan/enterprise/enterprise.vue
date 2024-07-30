<template>
	<div class="enterprise">
		<div class="left">
			<div class="left__wrapper" ref="leftWrapperRef">
				<div class="top">
					<div class="top-header">
						<div class="top-header-item" :class="{'item-active': leftTopActiveId === item.id}"
							 v-for="item in leftTopMenus"
							 :key="item.id" @click="handleLeftTopHeaderItemClick(item)">
							<span>{{ item.name }}</span>
						</div>
					</div>

					<transition name="slide" mode="out-in">
						<div class="content" v-if="leftTopActiveId === 'company-introduction'">
							<el-scrollbar>
								<el-image
									:src="require('@/assets/speed/case/factory/enterprise/left-top/enterprise-example.png')"
									alt="enterprise" fit="cover"
									:preview-src-list="[require('@/assets/speed/case/factory/enterprise/left-top/enterprise-example.png')]"/>

								<span>{{ companyIntroduction }}</span>
							</el-scrollbar>
						</div>

						<div class="content" v-else-if="leftTopActiveId === 'brand-idea'">
							<el-scrollbar>
								<span v-for="(item, index) in brandIdea" :key="index">{{ item }}</span>
							</el-scrollbar>
						</div>

						<div class="content" v-else-if="leftTopActiveId === 'social-responsibility'">
							<el-scrollbar>
								<span v-for="(item, index) in socialResponsibility" :key="index">{{ item }}</span>
							</el-scrollbar>
						</div>

						<div class="content" v-else-if="leftTopActiveId === 'future-vision'">
							<el-scrollbar>
								<span v-for="(item, index) in futureVision" :key="index">{{ item }}</span>
							</el-scrollbar>
						</div>
					</transition>
				</div>

				<div class="bottom">
					<div class="bottom-header">
						<div class="bottom-header-item" :class="{'item-active': leftBottomActiveId === item.id}"
							 v-for="item in leftBottomMenus"
							 :key="item.id" @click="handleLeftBottomHeaderItemClick(item)">
							<el-image :src="leftBottomActiveId === item.id ? item.activeIcon : item.icon" fit="cover"/>
							<span>{{ item.name }}</span>
						</div>
					</div>

					<transition name="slide" mode="out-in">
						<div class="content" v-if="leftBottomActiveId === 'news'">
							<el-scrollbar>
								<div class="content-item" v-for="(item, index) in news" :key="item.id">
									<div class="row">
										<el-image class="index" v-if="index === 0"
												  :src="require('@/assets/speed/case/factory/enterprise/left-bottom/rank-first.png')"/>
										<el-image class="index" v-if="index === 1"
												  :src="require('@/assets/speed/case/factory/enterprise/left-bottom/rank-second.png')"/>
										<el-image class="index" v-if="index === 2"
												  :src="require('@/assets/speed/case/factory/enterprise/left-bottom/rank-third.png')"/>
										<div class="index" v-if="index >= 3">
											<span>{{ index + 1 }}</span>
										</div>

										<span class="content-title">{{ item.title }}</span>
									</div>
									<span class="date">{{ item.date }}</span>
								</div>
							</el-scrollbar>
						</div>
						<div class="content" v-else-if="leftBottomActiveId === 'notify'">
							<div class="content-item" v-for="(item, index) in notify" :key="item.id">
								<div class="row">
									<el-image class="index" v-if="index === 0"
											  :src="require('@/assets/speed/case/factory/enterprise/left-bottom/rank-first.png')"/>
									<el-image class="index" v-if="index === 1"
											  :src="require('@/assets/speed/case/factory/enterprise/left-bottom/rank-second.png')"/>
									<el-image class="index" v-if="index === 2"
											  :src="require('@/assets/speed/case/factory/enterprise/left-bottom/rank-third.png')"/>
									<div class="index" v-if="index >= 3">
										<span>{{ index + 1 }}</span>
									</div>

									<span class="content-title">{{ item.title }}</span>
								</div>
								<span class="date">{{ item.date }}</span>
							</div>
						</div>
					</transition>
				</div>
			</div>
		</div>

		<div class="right">
			<div class="right__wrapper" ref="rightWrapperRef">
				<div class="top">
					<el-scrollbar>
						<div class="content">
							<div class="content-item" v-for="(item, index) in mainProducts" :key="item.id"
								 @click="handleMainProductItemClick(index)">
								<el-image :src="item.icon" fit="cover"/>
								<span>{{ item.name }}</span>
							</div>
						</div>
					</el-scrollbar>
				</div>

				<div class="middle">
					<el-scrollbar>
						<div class="content">
							<div class="content-item weather">
								<span class="content-title">天气</span>

								<span class="type">晴转多云</span>

								<div class="temperature">
									<span class="prefix">{{ parkSituationData.weather.type }}</span>
									<span class="value">{{ parkSituationData.weather.temperature }}</span>
								</div>
							</div>

							<div class="content-item employee">
								<span class="content-title">人员</span>

								<div class="row now">
									<span class="prefix">当前</span>
									<span class="value">{{ parkSituationData.employee.now }}</span>
								</div>

								<div class="row amount">
									<span class="prefix">日累计</span>
									<span class="value">{{ parkSituationData.employee.dayAmount }}</span>
								</div>
							</div>

							<div class="content-item vehicle">
								<span class="content-title">车辆</span>

								<div class="row now">
									<span class="prefix">当前</span>
									<span class="value">{{ parkSituationData.employee.now }}</span>
								</div>

								<div class="row amount">
									<span class="prefix">当前</span>
									<span class="value">{{ parkSituationData.employee.dayAmount }}</span>
								</div>
							</div>
						</div>
					</el-scrollbar>
				</div>

				<div class="bottom">
					<div class="content">
						<div class="bottom-header">
							<span>区域</span>
							<span>面积</span>
							<span>占比</span>
						</div>

						<el-scrollbar>
							<div class="table-item" v-for="item in coverData" :key="item.id">
								<div class="table-item__wrapper">
									<span>{{ item.region }}</span>
									<span>{{ item.area }}</span>
									<span>{{ item.proportion }}</span>
								</div>
							</div>
						</el-scrollbar>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import eventBus from "@/utils/eventBus";

export default {
	name: "EnterpriseDashboard",
	data() {
		return {
			leftTopMenus: [
				{
					id: "company-introduction",
					name: "公司简介"
				},
				{
					id: "brand-idea",
					name: "品牌理念"
				},
				{
					id: "social-responsibility",
					name: "社会责任"
				},
				{
					id: "future-vision",
					name: "远大愿景"
				}
			],
			leftTopActiveId: "company-introduction",
			companyIntroduction: "江苏中丹化工集团公司始建于1979年，1995年组建省级企业集团,系国家大型企业。公司集科、工、贸于一体，专业从事精细化工产品生产制造、科研开发和国际贸易，致力于推动民族染料化工、医药化工、饲料化工和生物化工的发展。 公司建有国家博士后科研工作站、江苏省级技术中心、江苏省博士后技术创新中心",
			brandIdea: [
				"【经营理念】以人为本、科学发展",
				"以人为本：公司的经营发展离不开每个中丹人的努力和拼搏，是“人”造就了中丹今天的成功和辉煌。发展依靠人，创新依靠人。公司也将为每个员工的利益着想，为员工办事，为员工谋利，为员工的幸福生活保驾护航。",
				"科学发展：公司的发展不可能永远踏足不前，必须以科学的眼光观察和分析解决问题，遵循科学规律，实施经营决策，善于结合实际，高瞻远瞩，引导良性发展。"
			],
			socialResponsibility: [
				"尊重：尊重首先强调的是人应懂得尊重自己而不苟且，尊重别人而不霸道，尊重自然而不能永续。即上下级之间的相互尊重；同级之间的相互尊重；员工之间的相互尊重；企业与外界（包括社区）之间的相互尊重；企业与客户之间的相互尊重等。",
				"团结：团结是一种合作精神，中丹人应以一种人心齐、泰山移的精神战斗在各自的工作岗位上，坚持大事讲原则，小事讲风格，以企业利益为重，结成一个坚强有力的战斗集体。",
				"诚信：中丹人应以诚信为本，以诚待人，以诚感人，打造诚信品牌，建立诚信文化，形成企业独特的软实力。",
				"超越：中丹人在经济工作发展的大潮中，应永不满足，永无止境，敢于超越，敢于提升，创造新的记录，以超越自我、超越同行为追求目标，实现各项工作的新突破。"
			],
			futureVision: [
				"和谐：表现为一种“团队”精神：干群合力，理解、支持、关心、体谅成为生产、经营、工作、交往等社会生活诸方面人所共循的准则。团队精神是我们实施企业集团化发展战略的基础。各级领导班子团结协作。各级领导班子与全体员工之间、员工与员工之间团结协作。创造一个目标一致、思想统一、作风优良的团结向上气氛。",
				"拼搏：即拼搏竞争，不畏艰难。它体现着中丹人勇攀高峰、顽强拼搏、慷慨激越的精神风貌。企业要在风起云涌的市场经济大潮中站稳脚跟，要与国际经济接轨，唯有积极进取、迎难而上，以昂扬的斗志、饱满的精神，求实的态度，意气风发地为企业的明天再创辉煌。“搏”不仅仅是体力的消耗，更重要的是智慧的角逐。拼搏才有创新、拼搏才出效率、拼搏才能成功。",
				"务实：务实精神是实施企业发展战略的需要。考虑问题，制定计划，办一切事情都从实际出发，坚持实事求是。表现形式上尊重客观、重实干、讲实效。",
				"创新：创新精神是企业精神的核心。作为一个外向型科技型为特征的企业集团，始终坚持中丹全体员工思维创新、知识创新、技术创新、产品创新和管理创新，不断挑战自我、追求卓越，在超越自我的过程中体会创业的艰辛和收获的欣喜。只有依靠全面创新，才能实现企业发展战略目标。"
			],
			leftBottomMenus: [
				{
					id: "news",
					icon: require("@/assets/speed/case/factory/enterprise/left-bottom/news-icon.png"),
					activeIcon: require("@/assets/speed/case/factory/enterprise/left-bottom/news-icon-active.png"),
					name: "新闻"
				},
				{
					id: "notify",
					icon: require("@/assets/speed/case/factory/enterprise/left-bottom/notify-icon.png"),
					activeIcon: require("@/assets/speed/case/factory/enterprise/left-bottom/notify-icon-active.png"),
					name: "通知"
				}
			],
			leftBottomActiveId: "news",
			news: [
				{
					id: "1",
					title: "瑞泰公司参展2022/2023中国饲料工业展",
					date: "2023-04-06"
				},
				{
					id: "2",
					title: "江苏省农业科学院-中丹集团江苏省农业科学院-中丹集团江苏省农业科学院-中丹集团",
					date: "2023-02-17"
				},
				{
					id: "3",
					title: "中丹集团年度工作大会上董事长的总结和要求",
					date: "2023-02-09"
				},
				{
					id: "4",
					title: "中丹集团年度工作大会圆满召开",
					date: "2023-02-09"
				},
				{
					id: "5",
					title: "热烈祝贺陈捷当选泰州市科协副主席",
					date: "2022-11-22"
				},
				{
					id: "6",
					title: "热烈祝贺陈捷当选泰州市科协副主席",
					date: "2022-11-02"
				},
				{
					id: "7",
					title: "热烈祝贺陈捷当选泰州市科协副主席",
					date: "2022-10-22"
				}
			],
			notify: [
				{
					id: "1",
					title: "建设项目职业病防护设施“三同时”工作公示信息表",
					date: "2023-02-09"
				},
				{
					id: "2",
					title: "22年度危废相关情况",
					date: "2022-11-18"
				},
				{
					id: "3",
					title: "关于2000T/年氧易清I型、2000T/年氧易清II型、2000T/年氧易清III型复合抗氧化剂产品项目职业病防护设施“三同时”工作公示信息表",
					date: "2022-11-15"
				},
			],
			mainProducts: [
				{
					id: "1",
					icon: require("@/assets/speed/case/factory/enterprise/main-products/异硫氰酸烯丙酯.png"),
					name: "异硫氰酸烯丙酯"
				},
				{
					id: "2",
					icon: require("@/assets/speed/case/factory/enterprise/main-products/乙氧基喹啉.png"),
					name: "乙氧基喹啉"
				},
				{
					id: "3",
					icon: require("@/assets/speed/case/factory/enterprise/main-products/邻氨基苯乙醚.png"),
					name: "邻氨基苯乙醚"
				},
				{
					id: "4",
					icon: require("@/assets/speed/case/factory/enterprise/main-products/S-2氯丙酸甲酯.png"),
					name: "S-(2)氯丙酸甲酯"
				},
				{
					id: "5",
					icon: require("@/assets/speed/case/factory/enterprise/main-products/对氨基苯甲醚.png"),
					name: "对氨基苯甲醚"
				},
				{
					id: "6",
					icon: require("@/assets/speed/case/factory/enterprise/main-products/对氨基苯乙醚.png"),
					name: "对氨基苯乙醚"
				}
			],
			parkSituationData: {
				weather: {
					type: "晴转多云",
					temperature: "9-22℃"
				},
				employee: {
					now: 300,
					dayAmount: 1000,
				},
				vehicle: {
					now: 300,
					dayAmount: 1000,
				}
			},
			coverData: [
				{
					id: "1",
					region: "生产",
					area: "1000㎡",
					proportion: "15%"
				},
				{
					id: "2",
					region: "绿化",
					area: "100㎡",
					proportion: "10%"
				},
				{
					id: "3",
					region: "垃圾",
					area: "100㎡",
					proportion: "18%"
				},
				{
					id: "4",
					region: "核废料",
					area: "200㎡",
					proportion: "6%"
				},
				{
					id: "5",
					region: "办公",
					area: "400㎡",
					proportion: "2%"
				},
				{
					id: "6",
					region: "其他1",
					area: "400㎡",
					proportion: "2%"
				},
				{
					id: "7",
					region: "其他2",
					area: "400㎡",
					proportion: "2%"
				}
			]
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
		handleLeftTopHeaderItemClick(item) {
			if (this.leftTopActiveId !== item.id) {
				this.leftTopActiveId = item.id;
			}
		},
		handleLeftBottomHeaderItemClick(item) {
			if (this.leftBottomActiveId !== item.id) {
				this.leftBottomActiveId = item.id;
			}
		},
		handleMainProductItemClick(index) {
			eventBus.$emit("main-product-click", index);
		},
	}
};

</script>

<style lang="scss" scoped>
.enterprise {
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
		}

		.top {
			width: 100%;
			margin-bottom: 24px;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/enterprise/left-top/left-top-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			&-header {
				height: 32px;
				margin: 24px;
				display: flex;
				align-items: center;

				&-item {
					flex: 1;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					cursor: pointer;

					&.item-active {
						background-image: url("~@/assets/speed/case/factory/enterprise/left-top/left-top-header-item-active-background.png");
						background-size: 100% 100%;
						background-repeat: no-repeat;

						span {
							color: white;
							background: linear-gradient(0deg, white 0%, #bcf4fe 100%);
							background-clip: text;
						}
					}

					span {
						font-size: 14px;
						font-family: "Alimama ShuHeiTi-Bold";
						font-weight: 700;
						font-style: italic;
						color: #a2eefc;
						line-height: 14px;
						letter-spacing: 0.84px;
					}
				}
			}

			.content {
				flex: 1;
				padding: 0 24px 20px 36px;
				display: flex;
				flex-direction: column;
				overflow: hidden;

				.el-image {
					width: 100%;
					height: 155px;
					min-height: 155px;
					margin-bottom: 8px;
				}

				span {
					display: block;
					font-size: 14px;
					font-weight: 700;
					color: #f0f0f0;
					line-height: 22px;
					letter-spacing: 0.56px;
					overflow: hidden;
				}
			}
		}

		.bottom {
			width: 100%;
			display: flex;
			flex-direction: column;
			background-image: url("~@/assets/speed/case/factory/enterprise/left-bottom/left-bottom-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			&-header {
				height: 32px;
				margin: 24px;
				display: flex;
				align-items: center;

				&-item {
					flex: 1;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					cursor: pointer;

					&.item-active {
						background-image: url("~@/assets/speed/case/factory/enterprise/left-bottom/left-bottom-header-item-active-background.png");
						background-size: 100% 100%;
						background-repeat: no-repeat;

						span {
							color: white;
							background: linear-gradient(0deg, white 0%, #bcf4fe 100%);
							background-clip: text;
						}
					}

					.el-image {
						width: 20px;
						height: 20px;
						margin-right: 8px;
					}

					span {
						font-size: 14px;
						font-family: "Alimama ShuHeiTi-Bold";
						font-weight: 700;
						font-style: italic;
						color: #a2eefc;
						line-height: 14px;
						letter-spacing: 0.84px;
					}
				}
			}

			.content {
				flex: 1;
				padding: 0 16px 20px 36px;
				display: flex;
				flex-direction: column;
				overflow-y: auto;

				:deep(.el-scrollbar) {
					.el-scrollbar__view {
						padding-right: 8px;
					}
				}

				&-item {
					height: 64px;
					padding: 0 15px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					border: 1px solid #138ffc33;
					background: linear-gradient(0deg, rgba(20, 188, 218, 0.03) 0%, rgba(20, 188, 218, 0.1) 99%);

					&:not(:first-of-type) {
						margin-top: 14px;
					}

					.row {
						margin-bottom: 6px;
						display: flex;
						align-items: center;

						.el-image.index {
							width: 18px;
							height: 18px;
							margin-right: 10px;
						}

						div.index {
							width: 18px;
							height: 18px;
							margin-right: 10px;
							background-color: #14BCDA33;
							border: 1px solid #13b5d2;
							display: flex;
							justify-content: center;
							align-items: center;

							span {
								font-size: 12px;
								font-weight: 700;
								font-style: italic;
								color: white;
								line-height: 12px;
								letter-spacing: 0.56px;
							}
						}

						span.content-title {
							flex: 1;
							font-size: 14px;
							font-weight: 500;
							color: #f0f0f0;
							line-height: 22px;
							letter-spacing: 0.56px;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
						}
					}

					span.date {
						margin-left: calc(18px + 10px);
						font-size: 12px;
						color: #a0d6fc;
						line-height: 12px;
						letter-spacing: 0.48px;
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

			.top {
				flex: 4;
				overflow: hidden;
			}

			.bottom {
				flex: 4.94;
				overflow: hidden;
			}
		}

		@media (height >= 1080px) {
			.top {
				height: 400px;
				min-height: 400px;
			}

			.bottom {
				height: 494px;
				min-height: 494px;
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
		}

		.top {
			width: 100%;
			padding: 76px 16px 24px 16px;
			background-image: url("~@/assets/speed/case/factory/enterprise/main-products/main-products-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.content {
				height: 100%;
				display: grid;
				grid-template-columns: 1fr 1fr 1fr;
				grid-row-gap: 8px;

				&-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					cursor: pointer;

					.el-image {
						width: 68px;
						height: 68px;
						margin-bottom: 8px;
					}

					span {
						background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
						font-size: 14px;
						font-weight: 500;
						color: #f0f0f0;
						line-height: 14px;
						background-clip: text;
					}
				}
			}
		}

		.middle {
			width: 100%;
			margin: 25px 0;
			padding: 76px 0 12px 0;
			background-image: url("~@/assets/speed/case/factory/enterprise/park-situation/park-situation-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.content {
				height: 202px;
				display: flex;
				justify-content: center;
				align-items: center;
				overflow-y: auto;

				&-item {
					width: 110px;
					height: 100%;
					display: flex;
					flex-direction: column;

					span.content-title {
						margin-top: 80px;
						margin-bottom: 22px;
						font-size: 14px;
						font-weight: 700;
						font-style: italic;
						color: #a0d6fc;
						line-height: 14px;
						letter-spacing: 0.84px;
						text-align: center;
						background: linear-gradient(0deg, white 0%, #bcf4fe 100%);
						background-clip: text;
					}

					.row {
						padding: 0 12px;
						display: flex;
						justify-content: space-between;
						align-items: center;

						&:not(:first-of-type) {
							margin-top: 9px;
						}

						.prefix {
							font-size: 12px;
							font-weight: 400;
							color: white;
							line-height: 12px;
						}
					}

					.now {
						.value {
							font-size: 12px;
							font-weight: 500;
							color: #00b8ff;
							line-height: 12px;
						}
					}

					.amount {
						.value {
							font-size: 12px;
							font-weight: 500;
							color: #d4942d;
							line-height: 12px;
						}
					}
				}

				.weather {
					align-items: center;
					background-image: url("~@/assets/speed/case/factory/enterprise/park-situation/weather-background.png");
					background-size: 100% 100%;
					background-repeat: no-repeat;

					span.type {
						font-size: 12px;
						font-weight: 500;
						color: #00b8ff;
						line-height: 12px;
					}

					div.temperature {
						margin-top: 9px;
						display: flex;
						align-items: center;

						.prefix {
							margin-right: 3px;
							font-size: 12px;
							font-weight: 400;
							color: white;
							line-height: 12px;
						}

						.value {
							font-size: 12px;
							color: #eeeeee;
							font-weight: bold;
							line-height: 12px;
							background: linear-gradient(0deg, white 0%, #bbdfff 100%);
							background-clip: text;
						}
					}
				}

				.employee {
					margin: 0 16px;
					background-image: url("~@/assets/speed/case/factory/enterprise/park-situation/employee-background.png");
					background-size: 100% 100%;
					background-repeat: no-repeat;
				}

				.vehicle {
					background-image: url("~@/assets/speed/case/factory/enterprise/park-situation/vehicle-background.png");
					background-size: 100% 100%;
					background-repeat: no-repeat;
				}
			}
		}

		.bottom {
			width: 100%;
			padding: 74px 18px 20px 0;
			background-image: url("~@/assets/speed/case/factory/enterprise/cover/cover-box-background.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.content {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;

				.bottom-header {
					padding-left: 36px;
					padding-right: 8px;
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
							margin-left: 42px;
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
								margin-left: 42px;
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

			.top, .middle, .bottom {
				flex: 1;
				overflow: hidden;
			}
		}

		@media (height >= 1080px) {
			.top, .middle, .bottom {
				height: 290px;
				min-height: 290px;
			}
		}
	}
}

.slide-enter-active,
.slide-leave-active {
	transition: all 0.25s ease-in-out;
}

.slide-enter-from {
	transform: translateX(100%);
}

.slide-leave-to {
	transform: translateX(-100%);
}
</style>
