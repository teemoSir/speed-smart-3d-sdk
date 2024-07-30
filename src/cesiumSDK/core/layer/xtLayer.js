import * as Cesium from "cesium";
import SpeedLayer from './base/speedLayer'
import * as token from '../util/token'
import XYZLayer from "./XYZLayer";
import xyzLayer from "@/cesiumSDK/core/layer/XYZLayer";

/**
 *星图地球图层
 */
class xtLayer extends SpeedLayer {

	/**
	 * 星图地球图层
	 * @param {Object} option - 图层对象参数
	 * @param {String}[option.layer] -请求的图层类型[vec_d: 电子图层；vec_z: 电子注记；img_d: 卫星影像；img_z: 影像注记；]
	 * @param {String}[option.key] -图层服务Token
	 * @param {String}[options.subdomains="123"] -可选URL模板中用于 {s} 占位符的子域。 如果此参数是单个字符串，则字符串中的每个字符都是一个子域。如果是 一个数组，数组中的每个元素都是一个子域。
	 * @param {Number}[options.minimumLevel=0] -瓦片所支持的最低层级，如果数据没有第0层，该参数必须配置,当地图小于该级别时，平台不去请求服务数据。
	 * @param {Number}[options.maximumLevel=18] -瓦片所支持的最大层级,大于该层级时会显示上一层拉伸后的瓦片，当地图大于该级别时，平台不去请求服务数据。
	 * @param {String}[options.url] -图层服务地址
	 */
	static xtImageryProvider(option) {
		var layer
		var _layer
		switch (option.layer) {
			default:
			case "img_d":
				_layer = "img";
				break;
			case "img_z":
				_layer = "cia";
				break;
			case "vec":
			case "vec_d":
				_layer = "vec";
				break;
		}
		var _key = option.key;
		if (option.key == null || option.key.length == 0) _key = token.xingtu;
		var _url
		if (option.url) {
			_url = option.url + "&token=" + _key
		} else {
			_url = "https://tiles{s}.geovisearth.com/base/v1/" + _layer + "/{z}/{x}/{y}?token=" + _key
		}
		layer = new Cesium.UrlTemplateImageryProvider({
			url: _url,
			subdomains: option.subdomains == undefined ? "123" : option.subdomains,
			minimumLevel: option.minimumLevel == undefined ? 0 : option.minimumLevel,
			maximumLevel: option.maximumLevel == undefined ? 18 : option.maximumLevel,
		});

		return layer
	}


	static xtImageryLayer(options) {
		let imageryProvider = this.xtImageryProvider(options)

		var imageryOpt = {
			show: true,
			alpha: options.opacity
		};
		if (
			Cesium.defined(options.rectangle) &&
			Cesium.defined(options.rectangle.xmin) &&
			Cesium.defined(options.rectangle.xmax) &&
			Cesium.defined(options.rectangle.ymin) &&
			Cesium.defined(options.rectangle.ymax)
		) {
			var xmin = options.rectangle.xmin;
			var xmax = options.rectangle.xmax;
			var ymin = options.rectangle.ymin;
			var ymax = options.rectangle.ymax;
			let rectangle = Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
			imageryOpt.rectangle = rectangle;
		}
		if (Cesium.defined(options.brightness)) imageryOpt.brightness = options.brightness;
		if (Cesium.defined(options.contrast)) imageryOpt.contrast = options.contrast;
		if (Cesium.defined(options.hue)) imageryOpt.hue = options.hue;
		if (Cesium.defined(options.saturation)) imageryOpt.saturation = options.saturation;
		if (Cesium.defined(options.gamma)) imageryOpt.gamma = options.gamma;
		if (Cesium.defined(options.maximumAnisotropy))
			imageryOpt.maximumAnisotropy = options.maximumAnisotropy;
		if (Cesium.defined(options.minimumTerrainLevel))
			imageryOpt.minimumTerrainLevel = options.minimumTerrainLevel;
		if (Cesium.defined(options.maximumTerrainLevel))
			imageryOpt.maximumTerrainLevel = options.maximumTerrainLevel;
		let imageryLayer = new Cesium.ImageryLayer(imageryProvider, imageryOpt);
		return imageryLayer

	}


	static xtImageryModels(opts) {
		var xtMapModel = undefined
		if (opts.hasOwnProperty("layers")) {
			if (opts.layers == undefined || opts.layers.length == 0) return
			let xtlayers = []
			opts.layers.forEach(item => {
				let layer = this.xtImageryProvider({
					layer: item.layer,
					key: opts.hasOwnProperty("key") ? opts.key : undefined,
					url: opts.hasOwnProperty("url") ? opts.url : undefined,
				})
				xtlayers.push(layer)
				if(item.layer=="img_d"){
					xtlayers.push(xyzLayer.xyzImageryProvider({
						url:"http://36.152.66.51:18088/{z}/{x}/{reverseY}.jpg",
						maximumLevel:20
					}));
					console.log("loadGoogle");
				}
			});

			xtMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "星图",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "星图地图服务",
				creationFunction: function () {
					return xtlayers;
				}
			});
		} else {
			let xt = this.xtImageryProvider(opts)
			xtMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "星图",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "星图地图服务",
				creationFunction: function () {
					return xt;
				}
			});
		}

		return xtMapModel
	}

}

export default xtLayer
