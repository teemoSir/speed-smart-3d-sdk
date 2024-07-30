<template>
	<div class="factory-header">
		<div class="center">
			<div class="menu-item" :class="{'menu-active': currentPath === item.path}" v-for="item in menus"
				 :key="item.id"
				 @click="handleMenuItemClick(item)">
				<span>{{ item.name }}</span>
			</div>
		</div>

		<div class="right">
			<div class="weather">
				<img src="../../../../../../../assets/speed/case/factory/header/sun.png" alt="sun"/>
				<div class="temperature">
					<span class="celsius">28℃</span>
					<span class="type">晴朗</span>
				</div>
			</div>

			<div class="divider"></div>

			<div class="datetime">
				<span class="time">{{ time }}</span>
				<span class="date">{{ date }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import tool from "@/utils/tool";

let _interval;

export default {
	name: "FactoryHeader",
	props: {
		menus: {
			type: Array,
			required: true,
		}
	},
	data() {
		return {
			date: "",
			time: ""
		}
	},
	created() {
		_interval = setInterval(() => {
			const now = new Date();
			const formattedDate = tool.dateFormat(now);
			const [date, time] = formattedDate.split(" ");
			this.date = date;
			this.time = time;
		}, 1000);
	},
	beforeUnmount() {
		_interval && clearInterval(_interval);
	},
	methods: {
		handleMenuItemClick(item) {
			this.$router.replace(item.path);
		}
	},
	computed: {
		currentPath() {
			return this.$route.path;
		}
	}
}
</script>

<style lang="scss" scoped>
.factory-header {
	width: 100%;
	height: 180px;
	display: flex;
	justify-content: flex-end;
	align-items: flex-start;
	background-image: url("~@/assets/speed/case/factory/header/background.png");
	background-size: 100% 180px;
	background-repeat: no-repeat;
	background-position: left top;

	.center {
		height: 76px;
		margin-left: 833px;
		margin-right: 134px;
		display: flex;
		justify-content: center;
		align-items: center;

		.menu-item {
			width: 243px;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;

			&.menu-active {
				background-image: url("~@/assets/speed/case/factory/header/menu-active-background.png");
				background-size: 100% 100%;
				background-repeat: no-repeat;

				span {
					color: transparent;
					background: linear-gradient(0deg, white 0%, #bcf4fe 100%);
					background-clip: text;
				}
			}

			span {
				font-size: 18px;
				font-family: "AlimamaShuHeiTi-Bold";
				font-weight: 700;
				font-style: italic;
				color: #a2eefc;
				line-height: 18px;
				letter-spacing: 1.08px;
			}
		}
	}

	.right {
		height: 76px;
		margin-right: 25px;
		display: flex;
		align-items: center;

		.weather {
			display: flex;
			align-items: center;

			img {
				width: 45px;
				height: 45px;
				margin-right: 8px;
			}

			.temperature {
				display: flex;
				flex-direction: column;
				align-items: flex-start;

				.celsius {
					margin-bottom: 4px;
					font-size: 18px;
					font-family: "AlimamaShuHeiTi-Bold";
					color: white;
					line-height: 18px;
					letter-spacing: 1.08px;
				}

				.type {
					font-size: 12px;
					color: #8b9eb7;
					line-height: 14px;
					letter-spacing: 0.72px;
				}
			}
		}

		.divider {
			width: 1px;
			height: 44px;
			margin: 0 20px;
			opacity: 0.5;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, white 50%, rgba(255, 255, 255, 0.00) 100%);
		}

		.datetime {
			width: 90px;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;

			.time {
				margin-bottom: 7px;
				font-size: 18px;
				font-family: "AlimamaShuHeiTi-Bold";
				color: white;
				line-height: 18px;
				letter-spacing: 1.08px;
			}

			.date {
				font-size: 14px;
				font-weight: 500;
				color: #fefefe;
				line-height: 14px;
				letter-spacing: 0.84px;
			}
		}
	}
}
</style>
