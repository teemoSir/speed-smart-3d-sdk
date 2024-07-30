import * as Cesium from "cesium";
import SpeedLayer from './base/speedLayer'
import * as token from '../util/token'
import * as util from "../util/util";


/**
 * 天地图
 */
class tdtLayer extends SpeedLayer {
	/**
	 *天地图
	 * @param {Object} options - 图层对象参数
	 * @param {String}[options.layer] -请求的图层类型[vec_d: 电子图层；vec_z: 电子注记；vec_e: 电子注记英文；img_d: 卫星影像；img_z: 影像注记；img_e: 影像注记英文；ter_d: 地形渲染图；ter_z: 地形渲染图注记]
	 * @param {String}[options.key] -图层服务Token
	 * @param {String}[options.crs] -瓦片数据的坐标系信息，默认为墨卡托投影
	 * @param {String}[options.proxy] -加载资源时要使用的代理服务url
	 * @param {String}[options.headers] -一个对象，将发送的其他HTTP标头。比如：headers: { 'X-My-Header': 'valueOfHeader' }
	 * @param {String}[options.queryParameters] -一个对象，其中包含在检索资源时将发送的查询参数。比如：queryParameters: {'id': '123'}
	 * @param {String | Array.<String>}[options.subdomains=["0", "1", "2", "3", "4", "5", "6", "7"]] -可选URL模板中用于 {s} 占位符的子域。 如果此参数是单个字符串，则字符串中的每个字符都是一个子域。如果是 一个数组，数组中的每个元素都是一个子域。
	 * @param {Number}[options.minimumLevel=0] -瓦片所支持的最低层级，如果数据没有第0层，该参数必须配置,当地图小于该级别时，平台不去请求服务数据。
	 * @param {Number}[options.maximumLevel] -瓦片所支持的最大层级,大于该层级时会显示上一层拉伸后的瓦片，当地图大于该级别时，平台不去请求服务数据。
	 * @param {String}[options.url] -图层服务地址
	 */
	static tdtImageryProvider(options) {
		var layer
		var _layer;
		var _url;
		var maxLevel = 18;
		switch (options.layer) {
			case "vec_d":
				_layer = "vec";
				break;
			case "vec_z":
				_layer = "cva";
				break;
			default:
			case "img_d":
				_layer = "img";
				break;
			case "img_z":
				_layer = "cia";
				break;
			case "ter_d":
				_layer = "ter";
				maxLevel = 14;
				break;
			case "ter_z":
				_layer = "cta";
				maxLevel = 14;
				break;
		}
		var _key = options.key;
		if (options.key == null || options.key.length == 0) _key = token.tianditu;
		if (options.crs == "4326" || options.crs == "EPSG:4326") {
			//wgs84
			_url =
				"https://t{s}.tianditu.gov.cn/" +
				_layer +
				"_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=" +
				_layer +
				"&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=" +
				_key;

			if (options.proxy || options.headers || options.queryParameters) {
				//存在代理等参数时
				_url = util.getProxyUrl({
					url: _url.replace("{s}", "0"),
					proxy: options.proxy,
					headers: options.headers,
					queryParameters: options.queryParameters
				}).url;
			}

			layer = new Cesium.WebMapTileServiceImageryProvider({
				subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
				maximumLevel: maxLevel,


				url: _url,
				layer: _layer,
				style: "default",
				format: "tiles",
				tileMatrixSetID: "c",
				tileMatrixLabels: [...Array(18).keys()].map(item => (item + 1).toString()),
				tilingScheme: new Cesium.GeographicTilingScheme()
			});
		} else {
			//墨卡托
			_url =
				"https://t{s}.tianditu.gov.cn/" +
				_layer +
				"_w/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=" +
				_layer +
				"&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=" +
				_key;
			if (options.proxy || options.headers || options.queryParameters) {
				//存在代理等参数时
				_url = util.getProxyUrl({
					url: _url.replace("{s}", "0"),
					proxy: options.proxy,
					headers: options.headers,
					queryParameters: options.queryParameters
				}).url;
			}

			layer = new Cesium.WebMapTileServiceImageryProvider({
				subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
				maximumLevel: maxLevel,
				url: _url,
				layer: _layer,
				style: "default",
				format: "tiles",
				tileMatrixSetID: "w",
				tileMatrixLabels: [...Array(18).keys()].map(item => item.toString()),
				tilingScheme: new Cesium.WebMercatorTilingScheme()
			});
		}
		return layer
	}


	static tdtImageryLayer(options) {

		let imageryProvider = this.tdtImageryProvider(options)

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

	static tdtImageryModels(opts) {
		var tdtMapModel
		if (opts.hasOwnProperty("layers")) {
			if (opts.layers == undefined || opts.layers.length == 0) return
			let tdtlayers = []
			let tempOpts=opts
			opts.layers.forEach(item => {
				tempOpts.layer=item.layer
				let imageryProvider = this.tdtImageryProvider(tempOpts)
				tdtlayers.push(imageryProvider)
			});
			tdtMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "天地图",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerialLabels.png"),
				tooltip: opts.tooltip || "天地图地图服务",
				creationFunction: function () {
					return tdtlayers;
				}
			});
		} else {
			let imageryProvider = this.tdtImageryProvider(opts)
			tdtMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "天地图",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "天地图地图服务",
				creationFunction: function () {
					return imageryProvider;
				}
			});
		}

		return tdtMapModel
	}

}

export default tdtLayer
