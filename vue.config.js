const { defineConfig } = require('@vue/cli-service')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')


module.exports = defineConfig({
	lintOnSave: false,
	//设置为空打包后不分更目录还是多级目录
	publicPath: './',
	//build编译后存放静态文件的目录
	//assetsDir: "static",
	outputDir: "XCDM",
	// build编译后不生成资源MAP文件
	productionSourceMap: false,

	//开发服务,build后的生产模式还需nginx代理
	devServer: {

		open: false, //运行后自动打开浏览器
		port: process.env.VUE_APP_PORT, //挂载端口
		proxy: {
			// '/3dtiles': {
			// 	target: "http://36.152.66.51:8088/3dtiles",
			// 	ws: true,
			// 	pathRewrite: {
			// 		'^/3dtiles': '/'
			// 	}
			// },
			// '/marsserver':{
			// 	target: "http://server.mars3d.cn/geoserver",
			// 	ws: true,
			// 	pathRewrite: {
			// 		'^/marsserver': '/'
			// 	}
			// }
		}
	},
	chainWebpack: config => {
		// 移除 prefetch 插件
		config.plugins.delete('preload');
		config.plugins.delete('prefetch');
		config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js');
		//config.resolve.alias.set('vue$','vuep/dist/vuep.common');


	},
	configureWebpack: {
		plugins: [
			new MonacoWebpackPlugin({ languages: ['javascript', 'typescript', 'html', 'css', 'json'] }),
			new NodePolyfillPlugin()
		],
		//性能提示
		performance: {
			hints: false
		},

		optimization: {
			splitChunks: {
				chunks: "all",
				automaticNameDelimiter: '~',
				name: "scuiChunks",
				cacheGroups: {
					//第三方库抽离
					vendor: {
						name: "modules",
						test: /[\\/]node_modules[\\/]/,
						priority: -10
					},
					elicons: {
						name: "elicons",
						test: /[\\/]node_modules[\\/]@element-plus[\\/]icons-vue[\\/]/
					},
					tinymce: {
						name: "tinymce",
						test: /[\\/]node_modules[\\/]tinymce[\\/]/
					},
					echarts: {
						name: "echarts",
						test: /[\\/]node_modules[\\/]echarts[\\/]/
					},
					xgplayer: {
						name: "xgplayer",
						test: /[\\/]node_modules[\\/]xgplayer.*[\\/]/
					},
					codemirror: {
						name: "codemirror",
						test: /[\\/]node_modules[\\/]codemirror[\\/]/
					}
				}
			}
		}
	},


})
