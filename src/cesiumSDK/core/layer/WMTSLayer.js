import * as Cesium from "cesium";
import SpeedLayer from './base/speedLayer'


/**
 * 标准瓦片服务 OGC WMTS服务
 */
class WMTSLayer extends SpeedLayer {
	/**
	 * 创建地图底图
	 * @param {Object} options - 图层对象参数
	 * @param {String}[options.layer] -WMTS请求的层名
	 * @param {String}[options.style] -WMTS请求的样式名称
	 * @param {String}[options.format=image/jpeg] -要从服务器检索的瓦片图像的MIME类型
	 * @param {String}[options.tileMatrixSetID=] -用于WMTS请求的TileMatrixSet的标识符。
	 * @param {Number}[options.maximumLevel=18] -瓦片所支持的最大层级,大于该层级时会显示上一层拉伸后的瓦片，当地图大于该级别时，平台不去请求服务数据。
	 * @param {Number}[options.minimumLevel=0] -瓦片所支持的最低层级，如果数据没有第0层，该参数必须配置,当地图小于该级别时，平台不去请求服务数据。
	 *
	*/
	static wmtsImageryProvider(options) {
		if (options && options.url) {
			let _tileMatrixLabels=[...Array(18).keys()].map(item => (item + 1).toString())
			let imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
				url: options.url,
				layer: options.layer,
				format: options.format == undefined ? 'image/png' : options.format,// 必填
				maximumLevel: options.maximumLevel == undefined ? 18 : options.maximumLevel,
				minimumLevel: options.minimumLevel == undefined ? 0 : options.minimumLevel,
				style: options.style || 'default',// 注意：样式参数必须有
				tileMatrixSetID: options.tileMatrixSetID,// 必填
				tileMatrixLabels: options.tileMatrixLabels== undefined ? _tileMatrixLabels : options.tileMatrixLabels,
				tilingScheme: options.tilingScheme
			});

			return imageryProvider
		}

	}

	static wmtsImageryLayer(options) {


		if (options && options.url) {
			let imageryProvider =this.wmtsImageryProvider(options)

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

	static wmtsImageryModels(opts){
		var wmtsMapModel = undefined
		if (opts.hasOwnProperty("layers")) {
			if (opts.layers == undefined || opts.layers.length == 0) return
			let wmtslayers = []
			opts.layers.forEach(item => {
				let imageryProvider = this.wmtsImageryProvider(item)
				wmtslayers.push(imageryProvider)
			});

			wmtsMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "WMTS",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "WMTS地图服务",
				creationFunction: function () {
					return wmtslayers;
				}
			});
		} else {
			let imageryProvider = this.wmtsImageryProvider(opts)
			wmtsMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "WMTS",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "WMTS地图服务",
				creationFunction: function () {
					return imageryProvider;
				}
			});
		}

		return wmtsMapModel
	}
}

export default WMTSLayer
