
<template>
	<div class="my-outbox">
		<div class="my-inbox" ref='box' >
			<div class="my-list" v-for="(item, index) in sendVal" :key='index' ref='list'>
				<span class="my-uname">{{ item.street+ item.num}}</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'my-marquee-left',
	props: {
		sendVal: Array
	},
	data() {
		return {
			// 定时器标识
			nowTime: null,
			// 每一个内容的宽度
			disArr: []
		}
	},
	mounted() {
		debugger
		var item = this.$refs.list
		var len = this.sendVal.length
		var arr = []
		// 因为设置的margin值一样，所以取第一个就行。
		var margin = this.getMargin(item[0])
		for (var i = 0; i < len; i++) {
			arr.push(item[i].clientWidth + margin) // 把宽度和 margin 加起来就是每一个元素需要移动的距离
		}
		this.disArr = arr
		this.moveLeft()
	},
	beforeDestroy() {
		// 页面关闭清除定时器
		clearInterval(this.nowTime)
		// 清除定时器标识
		this.nowTime = null
	},
	methods: {
		// 获取margin属性
		getMargin(obj) {
			var marg = window.getComputedStyle(obj, null)['margin-right']
			marg = marg.replace('px', '')
			return Number(marg) // 强制转化成数字
		},
		// 移动的方法
		moveLeft() {
			var that = this
			var outbox = this.$refs.box
			// 初始位置
			var startDis = 0
			// console.log('that.disArr: ', that.disArr)
			this.nowTime = setInterval(function () {
				startDis -= 0.5
				// console.log('初始化移动：', startDis)
				if (Math.abs(startDis) > Math.abs(that.disArr[0])) {
					console.log('come if .....')
					// 每次移动完一个元素的距离，就把这个元素的宽度
					that.disArr.push(that.disArr.shift())
					// 每次移动完一个元素的距离，就把列表数据的第一项放到最后一项
					// console.log('that.sendVal: ', that.sendVal)
					// console.log('that.sendVal: ', that.sendVal.shift())
					that.sendVal.push(that.sendVal.shift())
					startDis = 0
				}
				// 每次都让盒子移动指定的距离，在我自己做的项目中，这种字符串拼接的方法并没有生效
				// outbox.style = 'transform: translateX3d(' + startDis + 'px)'
				// 后面换了es6的模板字符串就可以了
				outbox.style = `transform: translateX(${startDis}px)`
				// outbox.style = 'transform: translateX(\' + startDis + \' px)'
				// outbox.style.marginLeft = 'startDis'
				// console.log('这里:', startDis)
			}, 1000 / 60)
		}
	}
}
</script>

<style scoped>
/* .my-outbox {
	overflow: hidden;
	color: #FFFFFF;
	height: 35px;
} */
.my-outbox {
	overflow: hidden;
	background: url("@/assets/speed/case/civil/img_xx.png") no-repeat;
	background-size: 100% 100%;
	width: 36%;
	position: fixed;
	top: 12%;
	left: 32%;
	z-index: 10;
	color: #FFFFFF;
	font-size: 14PX;
	text-align: center;
	line-height: 3;
	padding-left: 3%;
	padding-right: 1%;
	display: flex;
}

.my-inbox {
	white-space: nowrap;
}

.my-list {
	margin-right: 25px;
	display: inline-block;
	font-size: 0.3rem;
	height: 40px;
	line-height: 40px;
}

.my-uname {
	color: #FFFFFF;
}
</style>


