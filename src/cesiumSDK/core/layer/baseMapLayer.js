import * as Cesium from "cesium";
import SpeedLayer from './base/speedLayer'
import tdtLayer from "./tdtLayer";
import xtLayer from "./xtLayer";
import XTEarthLayer from "./XTEarthLayer";
import XYZLayer from "./XYZLayer";
import ArcGISLayer from "./ArcGISLayer";
import gaodeLayer from "./gaodeLayer";
import BaiduLayer from "./BaiduLayer";
import TencentLayer from "./TencentLayer";

// import { BaiduImageryProvider } from "./imageryProvider/BaiduImageryProvider";
// import { TencentImageryProvider } from "./imageryProvider/TencentImageryProvider";
import WMSLayer from "./WMSLayer";
import WMTSLayer from "./WMTSLayer";
import xyzLayer from "@/cesiumSDK/core/layer/XYZLayer";

/**
 * 底图
 */
class baseMapLayer extends SpeedLayer {


	static getImageryLayer(options) {
		let layer
		let zjlayer
		if (options.type == "group" && options.layers) {
			for (let idx = 0; idx < options.layers.length; idx++) {
				let childitem = options.layers[idx];
				if (childitem.type == "xt") {
					if (childitem.layer == "img_d") {
						layer = xtLayer.xtImageryLayer(childitem)
					} else if (childitem.layer == "img_z") {
						zjlayer = xtLayer.xtImageryLayer(childitem)
					}
				} else if (childitem.type == "tdt") {
					if (childitem.layer == "img_d") {
						layer = tdtLayer.tdtImageryLayer(childitem)
					} else if (childitem.layer == "img_z") {
						zjlayer = tdtLayer.tdtImageryLayer(childitem)
					}
				} else if (childitem.type == "baidu") {
					if (childitem.layer == "img_d") {
						let imageryLayer = new BaiduImageryProvider(childitem);
						layer = new Cesium.ImageryLayer(imageryLayer);
					} else if (childitem.layer == "img_z") {
						let zjimageryLayer = new BaiduImageryProvider(childitem);
						zjlayer = new Cesium.ImageryLayer(zjimageryLayer);
					}
				} else if (childitem.type == "tencent") {
					if (childitem.layer == "img_d") {
						let imageryLayer = new TencentImageryProvider(childitem);
						layer = new Cesium.ImageryLayer(imageryLayer);
					} else if (childitem.layer == "img_z") {
						let zjimageryLayer = new TencentImageryProvider(childitem);
						zjlayer = new Cesium.ImageryLayer(zjimageryLayer);
					}
				} else if (childitem.type == "gaode") {
					if (childitem.layer == "img_d") {
						layer = gaodeLayer.gaodeImageryLayer(childitem)
					} else if (childitem.layer == "img_z") {
						zjlayer = gaodeLayer.gaodeImageryLayer(childitem);
					}
				}
			}
		} else {
			let baiduLayer
			let tencentLayer
			let imageProvider
			switch (options.type) {
				case "xt":
					layer = xtLayer.xtImageryLayer(options)
					break;
				case "tdt":
					layer = tdtLayer.tdtImageryLayer(options)
					break;
				case "arcgis":
					layer = ArcGISLayer.arcgisImageryLayer(options)
					break;
				case "image":
					imageProvider = new Cesium.SingleTileImageryProvider(options)
					layer = new Cesium.ImageryLayer(imageProvider);
					break;
				case "xyz":
					layer = XYZLayer.xyzImageryLayer(options);
					break;
				case "wms":
					layer = WMSLayer.wmsImageryLayer(options)
					break;
				case "wmts":
					layer = WMTSLayer.wmtsImageryProvider(options)
					break;
				case "baidu":
					baiduLayer = new BaiduImageryProvider(options);
					layer = new Cesium.ImageryLayer(baiduLayer);
					break;
				case "tencent":
					tencentLayer = new TencentImageryProvider(options);
					layer = new Cesium.ImageryLayer(tencentLayer);
					break;
				case "gaode":
					layer = gaodeLayer.gaodeImageryLayer(options);
					break;
			}
		}

		return {
			layer: layer,
			zjlayer: zjlayer
		}
	}


	/**
	 * 配置底图图层
	 * @param {*} options
	 * @param {String}[option.name] -图层名称
	 * @param {String}[option.icon] -图层图标
	 * @param {String}[option.type] -图层类型[tdt：天地图，xt:星图地球，xyz：XYZ图层服务，gaode：高德，tencent：腾讯，baidu:百度]
	 * @param {String}[option.tooltip] -图层描述
	 * @param {Array[Object]}[option.layers] -图层组
	 * @param {String}[option.layers.layer] -图层类型[vec_d: 电子图层；vec_z: 电子注记；vec_e: 电子注记英文；img_d: 卫星影像；img_z: 影像注记；img_e: 影像注记英文；ter_d: 地形渲染图；ter_z: 地形渲染图注记]
	 * @param {String}[option.layers.name] -图层种类[底图或注记]
	 * @param {String}[option.layer] -图层类型[vec_d: 电子图层；vec_z: 电子注记；vec_e: 电子注记英文；img_d: 卫星影像；img_z: 影像注记；img_e: 影像注记英文；ter_d: 地形渲染图；ter_z: 地形渲染图注记]
	 * @param {String}[option.key] -图层服务Token
	 * @param {String}[option.url] -图层服务地址
	 * @param {Boolean}[option.show] -图层是否显示
	 * @returns
	 */
	static getImageryProviderModels(options) {
		if (options == undefined) return
		var providerViewModels = []
		var selectedIndex = 0;
		for (let index = 0; index < options.length; index++) {
			var option = options[index];
			if (option.type == "group" && option.layers == null) continue;
			let layer = undefined
			switch (option.type) {
				case "gaode":
					layer = gaodeLayer.gaodeImageryModels(option)
					if (layer)
						providerViewModels.push(layer)
					break;
				case "xt":
					layer = xtLayer.xtImageryModels(option)
					if (layer)
						providerViewModels.push(layer)
					break;
				case "xtearth":
					layer = XTEarthLayer.xtImageryModels(option)
					if (layer)
						providerViewModels.push(layer)
					break;
				case "tdt":
					layer = tdtLayer.tdtImageryModels(option)
					if (layer)
						providerViewModels.push(layer)
					break;
				case "arcgis":
					layer = ArcGISLayer.arcgisImageryModels(option)
					if (layer)
						providerViewModels.push(layer)
					break;
				case "xyz":
					layer = XYZLayer.xyzImageryModels(option);
					if (layer)
						providerViewModels.push(layer)
					break;
				case "wms":
					layer = WMSLayer.wmsImageryModels(option)
					if (layer)
						providerViewModels.push(layer)
					break;
				case "wmts":
					layer = WMTSLayer.wmtsImageryModels(option)
					if (layer)
						providerViewModels.push(layer)
					break;
				case "baidu":
					layer = BaiduLayer.baiduImageryModels(option)
					if (layer)
						providerViewModels.push(layer)
					break;
				case "tencent":
					layer = TencentLayer.tencentImageryModels(option)
					if (layer)
						providerViewModels.push(layer)
					break;
			}
			if (option.show) {
				selectedIndex = index
			}
		}
		return {
			providerViewModels: providerViewModels,
			index: selectedIndex
		};
	}

	static getImageryProviderNew(options) {
		var layer
		var zjlayer
		var googleLayer
		switch (options.type) {
			case "xt":
				if (options.hasOwnProperty("layers")) {
					options.layers.forEach(item => {
						let opts = options
						opts.layer = item.layer
						if (item.name == "注记") {
							zjlayer = xtLayer.xtImageryProvider(opts)
						} else {
							layer = xtLayer.xtImageryProvider(opts)
							googleLayer = xyzLayer.xyzImageryProvider({
								url:"http://36.152.66.51:18088/{z}/{x}/{reverseY}.jpg",
								maximumLevel:20
							})

						}
					});
				} else if (options.hasOwnProperty("layer")) {
					layer = xtLayer.xtImageryProvider(options)
					googleLayer = xyzLayer.xyzImageryProvider({
						url:"http://36.152.66.51:18088/{z}/{x}/{reverseY}.jpg",
						maximumLevel:20
					})
				}
				break;
			case "xtearth":
					if (options.hasOwnProperty("layers")) {
						options.layers.forEach(item => {
							let opts = options
							opts.layer = item.layer
							if (item.name == "注记") {
								zjlayer = XTEarthLayer.xtImageryProvider(opts)
							} else {
								layer = XTEarthLayer.xtImageryProvider(opts)
							}
						});
					} else if (options.hasOwnProperty("layer")) {
						layer = XTEarthLayer.xtImageryProvider(options)
					}
					break;
			case "tdt":
				if (options.hasOwnProperty("layers")) {
					options.layers.forEach(item => {
						let opts = options
						opts.layer = item.layer
						if (item.name == "注记") {
							zjlayer = tdtLayer.tdtImageryProvider(opts)
						} else {
							layer = tdtLayer.tdtImageryProvider(opts)
						}
					});
				} else if (options.hasOwnProperty("layer")) {
					layer = tdtLayer.tdtImageryProvider(options)
				}
				break;
			case "arcgis":
				layer = ArcGISLayer.arcgisImageryProvider(options)
				break;
			case "image":
				layer = new Cesium.SingleTileImageryProvider(options);
				break;
			case "xyz":
				layer = XYZLayer.xyzImageryProvider(options)
				break;
			case "wms":
				layer = WMSLayer.wmsImageryProvider(options)
				break;
			case "wmts":
				layer = WMTSLayer.wmtsImageryProvider(options)
				break;
			case "baidu":
				// layer = new BaiduImageryProvider(options);
				// layer = BaiduLayer.baiduImageryModels(options)

				if (options.hasOwnProperty("layers")) {
					options.layers.forEach(item => {
						let opts = options
						opts.layer = item.layer
						if (item.name == "注记") {
							zjlayer = BaiduLayer.baiduImageryModels(opts)
						} else {
							layer = BaiduLayer.baiduImageryModels(opts)
						}
					});
				} else if (options.hasOwnProperty("layer")) {
					layer = BaiduLayer.baiduImageryModels(options)
				}

				break;
			case "tencent":
				// layer = new TencentImageryProvider(options);
				// layer = TencentLayer.tencentImageryModels(options)
				if (options.hasOwnProperty("layers")) {
					options.layers.forEach(item => {
						let opts = options
						opts.layer = item.layer
						if (item.name == "注记") {
							zjlayer = TencentLayer.tencentImageryModels(opts)
						} else {
							layer = TencentLayer.tencentImageryModels(opts)
						}
					});
				} else if (options.hasOwnProperty("layer")) {
					layer = TencentLayer.tencentImageryModels(options)
				}
				break;


			case "gaode":
				if (options.hasOwnProperty("layers")) {
					options.layers.forEach(item => {
						let opts = options
						opts.layer = item.layer
						if (item.name == "注记") {
							zjlayer = gaodeLayer.gaodeImageryProvider(opts)
						} else {
							layer = gaodeLayer.gaodeImageryProvider(opts)
						}
					});
				} else if (options.hasOwnProperty("layer")) {
					layer = gaodeLayer.gaodeImageryProvider(options);
				}
				break;
		}


		return {
			layer: layer,
			zjlayer: zjlayer,
			googleLayer:googleLayer

		}
	}


	/**
	 * 调整地图颜色、亮度等
	 * @param {*} viewer
	 * @param {*} options
	 */
	static modifyMap(viewer,options) {
		const baseLayer = viewer.imageryLayers.get(0)
		//以下几个参数根据实际情况修改,目前我是参照火星科技的参数
		baseLayer.brightness = options.brightness || 0.6
		baseLayer.contrast = options.contrast || 1.8
		baseLayer.gamma = options.gamma || 0.3
		baseLayer.hue = options.hue || 1
		baseLayer.saturation = options.saturation || 0
		const baseFragShader = (viewer.scene.globe)._surfaceShaderSet
			.baseFragmentShaderSource.sources
		for (let i = 0; i < baseFragShader.length; i++) {
			const strS = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
			let strT = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
			if (options.invertColor) {
				strT += `
			color.r = 1.0 - color.r;
			color.g = 1.0 - color.g;
			color.b = 1.0 - color.b;
			`
			}
			if (options.filterRGB.length > 0) {
				strT += `
				color.r = color.r * ${options.filterRGB[0]}.0/255.0;
				color.g = color.g * ${options.filterRGB[1]}.0/255.0;
				color.b = color.b * ${options.filterRGB[2]}.0/255.0;
				`
			}
			baseFragShader[i] = baseFragShader[i].replace(strS, strT)
		}
	}
}

export default baseMapLayer

