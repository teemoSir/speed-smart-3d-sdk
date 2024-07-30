import * as Cesium from "cesium";
import SpeedLayer from './base/speedLayer'
import ArcgisImageryProvider from "./imageryProvider/ArcgisImageryProvider";


/**
 * ArcGIS MapServer
 */
class ArcGISLayer extends SpeedLayer {

	/**
	 *
	 * @param {Object} options - 图层对象参数
	 * @param {String}[options.layers] -要包含的图层，用逗号分隔
	 * @param {Object}[options.parameters=Cesium.WebMapServiceImageryProvider.DefaultParameters] -要在URL中 传递给WMS服务GetMap请求的其他参数。
	 * @param {Object}[options.getFeatureInfoParameters] -在单击坐标处通过GetFeatureInfo请求接口时,传递给WMS服务器的附加参数。
	 *
	*/
	static arcgisImageryProvider(options) {
		let _url = options.url;
		switch (options.layer) {
			default:
			case "default":
				_url = options.url || "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
				break;
			case "ChinaOnlineCommunity_Mobile":
			case "ChinaOnlineCommunityENG":
			case "ChinaOnlineCommunity":
			case "ChinaOnlineStreetGray":
			case "ChinaOnlineStreetPurplishBlue":
			case "ChinaOnlineStreetWarm":
				_url = "https://map.geoq.cn/ArcGIS/rest/services/" + options.layer + "/MapServer"
				break;
		}
		options.url = _url
		let imageryProvider = new ArcgisImageryProvider(options);
		return imageryProvider

	}

	static arcgisImageryLayer(options) {
		let imageryProvider = new Cesium.ArcGisMapServerImageryProvider(options);
		var imageryOpt = {
			show: true,
			alpha: options.opacity
		}
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
		let imageryLayer = new Cesium.ImageryLayer(imageryProvider,imageryOpt);
		return imageryLayer
	}

	// static arcgisImageryLayer(options) {
	// 	if (options && options.url) {
	// 		let imageryProvider = this.arcgisImageryProvider(options)
	// 		var imageryOpt = {
	// 			show: true,
	// 			alpha: options.opacity
	// 		};
	// 		if (
	// 			Cesium.defined(options.rectangle) &&
	// 			Cesium.defined(options.rectangle.xmin) &&
	// 			Cesium.defined(options.rectangle.xmax) &&
	// 			Cesium.defined(options.rectangle.ymin) &&
	// 			Cesium.defined(options.rectangle.ymax)
	// 		) {
	// 			var xmin = options.rectangle.xmin;
	// 			var xmax = options.rectangle.xmax;
	// 			var ymin = options.rectangle.ymin;
	// 			var ymax = options.rectangle.ymax;
	// 			let rectangle = Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
	// 			imageryOpt.rectangle = rectangle;
	// 		}
	// 		if (Cesium.defined(options.brightness)) imageryOpt.brightness = options.brightness;
	// 		if (Cesium.defined(options.contrast)) imageryOpt.contrast = options.contrast;
	// 		if (Cesium.defined(options.hue)) imageryOpt.hue = options.hue;
	// 		if (Cesium.defined(options.saturation)) imageryOpt.saturation = options.saturation;
	// 		if (Cesium.defined(options.gamma)) imageryOpt.gamma = options.gamma;
	// 		if (Cesium.defined(options.maximumAnisotropy))
	// 			imageryOpt.maximumAnisotropy = options.maximumAnisotropy;
	// 		if (Cesium.defined(options.minimumTerrainLevel))
	// 			imageryOpt.minimumTerrainLevel = options.minimumTerrainLevel;
	// 		if (Cesium.defined(options.maximumTerrainLevel))
	// 			imageryOpt.maximumTerrainLevel = options.maximumTerrainLevel;

	// 		let imageryLayer = new Cesium.ImageryLayer(imageryProvider, imageryOpt);
	// 		return imageryLayer
	// 	}
	// }

	static arcgisImageryModels(opts) {
		var arcgisMapModel = undefined
		if (opts.hasOwnProperty("layers")) {
			if (opts.layers == undefined || opts.layers.length == 0) return
			let arcgislayers = []
			opts.layers.forEach(item => {
				let imageryProvider = this.arcgisImageryProvider(item)
				arcgislayers.push(imageryProvider)
			});

			arcgisMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "ArcGIS",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "ArcGIS地图服务",
				creationFunction: function () {
					return arcgislayers;
				}
			});
		} else {
			let imageryProvider = this.arcgisImageryProvider(opts)
			arcgisMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "ArcGIS",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "ArcGIS地图服务",
				creationFunction: function () {
					return imageryProvider;
				}
			});
		}

		return arcgisMapModel
	}
}

export default ArcGISLayer
