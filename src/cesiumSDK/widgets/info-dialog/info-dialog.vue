<template>
	<div>
		<el-dialog v-model="dialogVisible" title="" width="20%" draggable>
			<slot></slot>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: "infodialog",
}
</script>

<style scoped>

</style>
