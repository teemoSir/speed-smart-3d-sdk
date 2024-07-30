<template>
	<div
		class="capacity-progress"
		:style="{
			height: barHeight + 'px',
			backgroundColor: trackColor,
			borderRadius: borderRadius
		}"
	>
		<div
			class="bar"
			:style="{
				width: percent,
				background: `linear-gradient(90deg, ${startColor || '#00b8ff19'} 0%, ${endColor || '#00b8ff'} 100%)`,
				borderRadius: borderRadius
			}"
		></div>
		<div
			class="circle"
			:style="{
				left: `calc(${percent} - ${circleSize / 2 + 'px'})`,
				width: circleSize + 'px',
				height: circleSize + 'px',
				borderRadius: '50%'
			}"
		>
			<div class="circle-inner" :style="{width: barHeight + 'px', height: barHeight + 'px'}"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: "CapacityProgress",
	props: {
		percentage: {
			type: Number,
			default: 0
		},
		barHeight: {
			type: Number,
			default: 6
		},
		trackColor: {
			type: String,
			default: "#082732"
		},
		roundCorner: {
			type: Boolean,
			default: true
		},
		startColor: {
			type: String,
			default: "#00b8ff19"
		},
		endColor: {
			type: String,
			default: "#00b8ff"
		},
		circlePadding: {
			type: Number,
			default: 5
		}
	},
	computed: {
		borderRadius() {
			return this.roundCorner ? (this.barHeight / 2 + 'px') : '0px'
		},
		percent() {
			let temp = this.percentage;
			if (temp < 0) {
				temp = 0;
			} else if (temp > 1) {
				temp = 1;
			}
			return `${temp * 100}%`;
		},
		circleSize() {
			return this.barHeight + this.circlePadding * 2;
		}
	}
}
</script>

<style lang="scss" scoped>
.capacity-progress {
	width: 100%;
	position: relative;

	.bar {
		height: 100%;
	}

	.circle {
		position: absolute;
		top: -5px;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid white;

		&-inner {
			background-color: white;
			border-radius: 50%;
		}
	}
}
</style>
