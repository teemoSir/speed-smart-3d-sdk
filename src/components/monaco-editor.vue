<template>
	<div ref="main" :style="{ width: width, height:height }"></div>
</template>

<script>
import * as monaco from "monaco-editor";
import { toRaw } from 'vue'

export default {

	props: {
		modelValue:{
			type:String
		},
		width: {
			type: String,
			default: "100%",
		},
		height: {
			type: String,
			default: "100%",
		},
		language: {
			type: String,
			default: "auto",
		},
	},
	data() {
		return {
			monacoEditor: null
		};
	},
	mounted() {
		this.init();

	},
	methods: {
		init() {
			// 使用 - 创建 monacoEditor 对象
			this.monacoEditor = monaco.editor.create(this.$refs.main, {
				theme: "vs-dark", // 主题
				value: this.modelValue, // 默认显示的值
				language: this.language,
				folding: true, // 是否折叠
				foldingHighlight: true, // 折叠等高线
				foldingStrategy: "indentation", // 折叠方式  auto | indentation
				showFoldingControls: "always", // 是否一直显示折叠 always | mouseover
				disableLayerHinting: true, // 等宽优化
				emptySelectionClipboard: false, // 空选择剪切板monacoeditor getValue卡死
				selectionClipboard: false, // 选择剪切板
				automaticLayout: true, // 自动布局
				codeLens: false, // 代码镜头
				scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
				colorDecorators: true, // 颜色装饰器
				accessibilitySupport: "off", // 辅助功能支持  "auto" | "off" | "on"
				lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
				lineNumbersMinChars: 5, // 行号最小字符   number
				enableSplitViewResizing: false,
				readOnly: false, //是否只读  取值 true | false
				wordWrap: "on", // 自动换行
			});
			// console.log(this.modelValue);
			// this.monacoEditor.onDidChangeModelContent((value)=>{
			// 	console.log(value);
			// })
		},
		commitCode(){
			this.$emit("update:modelValue",toRaw(this.monacoEditor).getValue());
		}
	},
};
</script>
