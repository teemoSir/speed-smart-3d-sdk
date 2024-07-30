import * as Cesium from "cesium";
import SpeedLayer from './base/speedLayer'


/**
 * 标准xyz金字塔图层
 */
class XYZLayer extends SpeedLayer {
	/**
	 *标准xyz金字塔图层
	 * @param {Object} options - 图层对象参数
	 * @param {Number}[options.minimumLevel=0] -瓦片所支持的最低层级，如果数据没有第0层，该参数必须配置,当地图小于该级别时，平台不去请求服务数据。
	 * @param {Number}[options.maximumLevel=18] -瓦片所支持的最大层级,大于该层级时会显示上一层拉伸后的瓦片，当地图大于该级别时，平台不去请求服务数据。
	*/
	static xyzImageryProvider(option) {
		var layer
		if(option && option.url){
			layer = new Cesium.UrlTemplateImageryProvider({
				url: option.url,
				maximumLevel: option.maximumLevel== undefined ? 18 : option.maximumLevel,
				minimumLevel: option.minimumLevel== undefined ? 0 : option.minimumLevel,
				customTags: {
                    myLevel: function(layer, x, y, z) {
                        return z+1
                    }
                }

			});
		}
		return layer
	}

	static xyzImageryLayer(options) {
		if (options && options.url) {
			let imageryProvider =this.xyzImageryProvider(options)

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

	static xyzImageryModels(opts){
		var xyzMapModel = undefined
		if (opts.hasOwnProperty("layers")) {
			if (opts.layers == undefined || opts.layers.length == 0) return
			let xyzlayers = []
			opts.layers.forEach(item => {
				let imageryProvider = this.xyzImageryProvider(item)
				xyzlayers.push(imageryProvider)
			});

			xyzMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "XYZ",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "XYZ地图服务",
				creationFunction: function () {
					return xyzlayers;
				}
			});
		} else {
			let imageryProvider = this.xyzImageryProvider(opts)
			xyzMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "XYZ",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "XYZ地图服务",
				creationFunction: function () {
					return imageryProvider;
				}
			});
		}

		return xyzMapModel
	}
}

export default XYZLayer
