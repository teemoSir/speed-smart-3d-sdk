<template>
	<div class="mapBox">
		<button class="codeboxBtn" @click="codeBoxShow = !codeBoxShow" :isshow="codeBoxShow">
			{{ !codeBoxShow ? "Code" : "X" }}
		</button>
		<div class="codeContainer" :isshow="codeBoxShow">
			<button class="runBtn" @click="runCode()">
				<el-icon-caret-right></el-icon-caret-right>
				运行
			</button>
			<el-tabs v-model="activePanel" class="demo-tabs" style="height: 100%;">
				<el-tab-pane label="html" name="html" style="height: 100%">
					<monaco-editor v-model="htmlCodeEdit" ref="html" language="html"></monaco-editor>
				</el-tab-pane>
				<el-tab-pane label="javascript" name="javascript" style="height: 100%">
					<monaco-editor v-model="javascriptCodeEdit" ref="javascript" language="javascript"></monaco-editor>
				</el-tab-pane>
				<el-tab-pane label="css" name="css" style="height: 100%">
					<monaco-editor v-model="cssCodeEdit" ref="css" language="css"></monaco-editor>
				</el-tab-pane>
			</el-tabs>
			<!--			<monaco-edito ref="js"></monaco-edito>-->
			<!--			<sc-code-editor style="height:100%;" v-model="jsCode" mode="javascript"></sc-code-editor>-->
		</div>
		<div class="mapContainer" :isshow="codeBoxShow">
			<component :is="compName"></component>
		</div>
		<!--		<vuep :template="jsCode"></vuep>-->
	</div>
</template>

<script>
import {defineAsyncComponent, markRaw} from 'vue';
import ktmap from '@/components/map'
import MonacoEditor from '@/components/monaco-editor'
import {appComponent} from '@/utils/dynamicComponent'
import '@/utils/ktmap-import'
import * as uuid from "uuid"
const scCodeEditor = defineAsyncComponent(() => import('@/components/scCodeEditor'));
export default {
	name: "mapBox",
	components: {
		scCodeEditor,
		MonacoEditor,
		ktmap
	},
	props: {
		cssCode: {type: String, default: ""},
		htmlCode: {type: String, default: ""},
		javascriptCode: {type: String, default: ""},
		measureShow: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			codeBoxShow: false,
			activePanel: "html",
			htmlCodeEdit: ``,
			javascriptCodeEdit: ``,
			cssCodeEdit: ``,
			compName: ''
		}
	},
	created() {
		this.htmlCodeEdit = this.htmlCode;
		this.javascriptCodeEdit = this.javascriptCode;
		this.cssCodeEdit = this.cssCode;
		this.compName = 'comp_'+uuid.v4().replaceAll("-","");
	},
	mounted() {

		this.measureClickFuncs = {};
		this.runCode();

	},
	methods: {
		runCode() {
			this.$refs.css.commitCode();
			this.$refs.javascript.commitCode();
			this.$refs.html.commitCode();
			let css = this.cssCodeEdit;
			let javascript = "<script>" + this.javascriptCodeEdit + "</" + "script>";
			let html = this.htmlCodeEdit;
			let template = `<template>${html}</template>${javascript}<style scoped>${css}</style>`;
			appComponent(window.app, {code: template, name: this.compName});
			let compNameTmp = this.compName;
			this.compName = '';

			this.compName = compNameTmp;
		}
	}
}
</script>

<style lang="scss" scoped>
.mapBox {
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;

	.codeboxBtn {
		background-color: #409eff;
		color: #fff;
		border: none;
		padding: 0 1rem;
		width: 5rem;
		height: 3rem;
		line-height: 3rem;
		cursor: pointer;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 9;
		transition: all 0.5s;
	}

	.codeboxBtn[isshow=true] {
		width: 2rem;
		height: 2rem;
		line-height: 2rem;
		transform: translateX(38rem);
		padding: 0;
	}

	.codeContainer {
		height: 100%;
		width: 40rem;
		transform: translateX(-100%);
		position: absolute;
		left: 0;
		top: 0;
		border-right: 1px solid #409eff;
		//padding-top: 3rem;

		.runBtn {
			background-color: #409eff;
			color: #fff;
			border: none;
			padding: 0 1rem;
			padding-left: 1.5rem;
			height: 2rem;
			line-height: 2rem;
			cursor: pointer;
			position: absolute;
			right: 4rem;
			top: 0.6rem;
			font-size: 1rem;
			text-align: center;
			z-index: 999;
			border-radius: 0.2rem;

			svg {
				top: 0.25rem;
				left: 0.3rem;
				width: 1.5rem;
				position: absolute;
			}
		}

		::v-deep .el-tabs__content {
			height: 100%;
		}

		::v-deep .el-tabs__header {
			margin: 0;
		}

		::v-deep .el-tabs__nav-wrap {
			padding-left: 1rem;
		}
	}

	.mapContainer {
		height: 100%;
		width: 100%;
		position: absolute;
		right: 0;
		top: 0;
		text-align: center;

		.btnGroup {
			position: absolute;
			top: 0;
			left: 6rem;
		}

		.codeRunner {
			width: 100%;
			height: 100%;
			border: 0;
		}
	}

	.mapContainer, .codeContainer {
		transition: all 0.5s;
	}

	.codeContainer[isshow=true] {
		transform: translateX(0);
	}

	.mapContainer[isshow=true] {
		width: calc(100% - 40rem);
	}
}
</style>
