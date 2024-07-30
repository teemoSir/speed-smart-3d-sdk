<template>
	<div class="dialog">
		<img class="headerDialog" src="img/speed3d/top.png" />

		<div class="bodyDialog" style="background-image: url('img/speed3d/center.png');">
			<el-scrollbar>
				<slot></slot>
			</el-scrollbar>

		</div>
		<img class="footerDialog" src="img/speed3d/bottom.png" />
	</div>
</template>

<script >
export default {
	name: "speeddialog",
}
</script>

<style scoped>
.headerDialog {
	display: block;
	width: 370px;
}

.bodyDialog {
	background-size: 100% 100%;
	background-repeat: repeat;
	width: 370px;
	height: 70%;
}

.scrollbar-demo-item {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 50px;
	margin: 10px;
	text-align: center;
	border-radius: 4px;
	background: var(--el-color-primary-light-9);
	color: var(--el-color-primary);
}

.footerDialog {
	width: 370px;
}
</style>
