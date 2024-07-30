import * as Cesium from "cesium";
import SpeedLayer from './base/speedLayer'


/**
 * 标准瓦片服务 OGC WMS服务
 */
class WMSLayer extends SpeedLayer {

	/**
	 *
	 * @param {Object} options - 图层对象参数
	 * @param {String}[options.layers] -要包含的图层，用逗号分隔
	 * @param {Object}[options.parameters=Cesium.WebMapServiceImageryProvider.DefaultParameters] -要在URL中 传递给WMS服务GetMap请求的其他参数。
	 * @param {Object}[options.getFeatureInfoParameters] -在单击坐标处通过GetFeatureInfo请求接口时,传递给WMS服务器的附加参数。
	 *
	*/
	static wmsImageryProvider(options) {
		if (options && options.url) {
			let imageryProvider = new Cesium.WebMapServiceImageryProvider({
				url: options.url,
				layers: options.layers,//必填
				parameters: {
					transparent: options.parameters.transparent || true,
					format: options.parameters.format || "image/png"
				},
				getFeatureInfoParameters: {
					feature_count: 10
				},

			});

			return imageryProvider
		}
	}

	static wmsImageryLayer(options) {
		if (options && options.url) {
			let imageryProvider = this.wmsImageryProvider(options)
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
	}

	static wmsImageryModels(opts){
		var wmsMapModel = undefined
		if (opts.hasOwnProperty("layers")) {
			if (opts.layers == undefined || opts.layers.length == 0) return
			let wmslayers = []
			opts.layers.forEach(item => {
				let imageryProvider = this.wmsImageryProvider(item)
				wmslayers.push(imageryProvider)
			});

			wmsMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "WMS",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "WMS地图服务",
				creationFunction: function () {
					return wmslayers;
				}
			});
		} else {
			let imageryProvider = this.wmsImageryProvider(opts)
			wmsMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "WMS",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "WMS地图服务",
				creationFunction: function () {
					return imageryProvider;
				}
			});
		}

		return wmsMapModel
	}
}

export default WMSLayer
