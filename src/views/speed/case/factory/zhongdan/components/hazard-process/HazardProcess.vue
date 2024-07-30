<template>
	<div class="hazard-process">
		<div class="horizontal-line"></div>

		<div class="hazard-process-item" :class="{'item-active': index <= currentProcessIndex}"
			 v-for="(item, index) in processes" :key="item.id">
			<div class="index-wrapper">
				<span>{{ index + 1 }}</span>
			</div>
			<span class="date">{{ item.date }}</span>
			<span class="type">{{ item.type }}</span>
		</div>
	</div>
</template>

<script>
export default {
	name: "HazardProcess",
	props: {
		processes: {
			type: Array,
			default: () => [],
		},
		currentProcessIndex: {
			type: Number,
			default: 0,
		}
	},
}
</script>

<style lang="scss" scoped>
.hazard-process {
	width: 100%;
	position: relative;
	display: flex;
	justify-content: space-between;

	.horizontal-line {
		height: 1px;
		position: absolute;
		top: 9px;
		left: 41px;
		right: 41px;
		background-color: #14bcda;
	}

	&-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 9;

		.index-wrapper {
			width: 18px;
			height: 18px;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #031b23;
			border: 1px solid #14bcda;
			border-radius: 9px;

			span {
				font-size: 12px;
				font-family: Source Han Sans CN, Source Han Sans CN-Medium;
				font-weight: 500;
				line-height: 12px;
				color: #14bcda;
			}
		}

		.date {
			margin: 5px 0;
			font-size: 12px;
			font-family: Source Han Sans CN, Source Han Sans CN-Medium;
			font-weight: 500;
			line-height: 12px;
			color: #ffffffa5;
		}

		.type {
			background: linear-gradient(0deg, #ffffff 0%, #bcf4fe 100%);
			background-clip: text;
			font-size: 14px;
			font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
			font-weight: 700;
			font-style: italic;
			line-height: 14px;
			color: #f0f0f0;
		}

		&.item-active {
			.index-wrapper {
				background: #14bcda;
				border: 1px solid #14bcda;
				box-shadow: -2px 0px 4px 2px rgba(0, 161, 190, 0.30);

				span {
					color: white;
				}
			}

			.type {
				color: #a2eefc;
			}
		}
	}
}
</style>
