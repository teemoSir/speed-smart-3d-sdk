import * as Cesium from "cesium";
import SpeedLayer from './base/speedLayer'
import * as token from '../util/token'
import { terrainUrl } from '../util/config'
import * as util from "../util/util";



/**
 * 地形图层

 */
class terrainLayer extends SpeedLayer {
	/**
	 * 地形图层
	 * @param {Object}[options] -地形服务配置
	 * @param {Object}[options.type] -地形类型[none:无地形，xt：星图地形，mars：火星地形,arcgis:arcgis地形,ION:ION在线地形(cesium官方服务),XYZ:标准xyz瓦片地形]
	 * @param {String | Cesium.Resource}[options.url] -地形服务地址
	 * @param {String}[options.key] -地形服务token
	 * @param {Boolean}[options.requestWaterMask=false] -是否应该向服务器请求每个瓦的水掩膜(如果有的话)。
	 * @param {Boolean}[options.requestVertexNormals=false] -是否应该从服务器请求额外的光照信息，如果可用，以每个顶点法线的形式。
	 * @param {Boolean}[options.requestMetadata=true] -是否应该从服务器请求每个块元数据(如果可用)。
	 */
	static getTerrainProvider(options) {
		options = options || { type: "xt", url: terrainUrl, key: token.xingtu };
		options.requestWaterMask = Cesium.defaultValue(options.requestWaterMask, false);
		options.requestVertexNormals = Cesium.defaultValue(options.requestVertexNormals, false);

		var terrainProvider;
		switch (options.type) {
			case "none":
				terrainProvider = new Cesium.EllipsoidTerrainProvider({
					ellipsoid: Cesium.Ellipsoid.WGS84
				});
				break;
			case "ion":
			case "cesium": //cesium官方在线的
				terrainProvider = new Cesium.CesiumTerrainProvider({
					url: Cesium.IonResource.fromAssetId(1),
					requestWaterMask: options.requestWaterMask,
					requestVertexNormals: options.requestVertexNormals
				});
				break;
			// case "tdt":
			// case "tianditu"://天地图地形
			// var _key
			// if (options.key) {
			// 	_key = options.key
			// } else {
			// 	_key = token.tianditu
			// }
			// terrainProvider = new Cesium.CesiumTerrainProvider(options);
			// var terrainUrls = new Array();
			// for (var i = 0; i < options.subdomains.length; i++) {
			// 	var url = options.url.replace('{s}', options.subdomains[i]) + 'DataServer?T=elv_c&tk=' + _key;
			// 	terrainUrls.push(url);
			// }

			// terrainProvider = new Cesium.GeoTerrainProvider({
			// 	urls: terrainUrls
			// });

			// break;
			case "xt":
			case "xingtu"://星图地形
				var _key
				if (options.key) {
					_key = options.key
				} else {
					_key = token.xingtu
				}
				options.url = util.getProxyUrl(options).url + "?token=" + _key
				terrainProvider = new Cesium.CesiumTerrainProvider(options);
				break;
			case "gee":
			case "google": //谷歌地球地形服务
				terrainProvider = new Cesium.GoogleEarthEnterpriseTerrainProvider({
					metadata: new Cesium.GoogleEarthEnterpriseMetadata(util.getProxyUrl(options))
				});
				break;
			case "arcgis": //ArcGIS地形服务
				terrainProvider = new Cesium.ArcGISTiledElevationTerrainProvider(util.getProxyUrl(options));
				break;

			default:
				//默认使用星图地形
				terrainProvider = new Cesium.CesiumTerrainProvider(util.getProxyUrl(options));
				break;
		}
		return terrainProvider;
	}

	/**
	 * 地形图层组
	 * @param {Array<Object>}[options] -地形服务参数
     * @param {Object}[option.type] -地形类型[none:无地形，xt：星图地形，mars：火星地形,arcgis:arcgis地形,ION:ION在线地形(cesium官方服务),XYZ:标准xyz瓦片地形]
     * @param {String}[option.name] -地形服务名称
     * @param {String}[option.icon] -地形图标
     * @param {String}[option.tooltip] -地形服务描述
     * @param {String | Cesium.Resource}[option.url] -地形服务地址
     * @param {String}[option.key] -地形服务token
     * @param {Boolean}[option.show] -是否显示地形
	 */
	static getTerrainProviderViewModelsArr(options) {
		let that = this
		var terrainModels = []
		var selectedIndex = 0;
		for (let index = 0; index < options.length; index++) {
			var option = options[index];
			switch (option.type) {
				default:
				case "none":
					terrainModels.push(new Cesium.ProviderViewModel({
						name: option.name ? "无地形" : option.name,
						iconUrl: option.icon == undefined ? Cesium.buildModuleUrl("Widgets/Images/TerrainProviders/Ellipsoid.png") : option.icon,
						tooltip: option.tooltip == undefined ? "WGS84标准椭球，即 EPSG:4326" : option.tooltip,
						category: "",
						creationFunction: function () {
							var _ellipsoid = new Cesium.EllipsoidTerrainProvider({
								ellipsoid: Cesium.Ellipsoid.WGS84
							});
							return _ellipsoid
						}
					}))
					break
				case "xt":
					var model = new Cesium.ProviderViewModel({
						name: option.name ? "星图地形" : option.name,
						iconUrl: option.icon == undefined ? Cesium.buildModuleUrl("Widgets/Images/TerrainProviders/CesiumWorldTerrain.png") : option.icon,
						tooltip: option.tooltip == undefined ? "星图地球提供的地形服务" : option.tooltip,
						category: "",
						creationFunction: function () {
							return that.getTerrainProvider({
								type: option.type,
								url: option.url == undefined ? "https://tiles1.geovisearth.com/base/v1/terrain" : option.url
							});
						}
					})
					terrainModels.push(model)
					break;
				case "mars":
					var model = new Cesium.ProviderViewModel({
						name: option.name ? "火星地形" : option.name,
						iconUrl: option.icon == undefined ? Cesium.buildModuleUrl("Widgets/Images/TerrainProviders/CesiumWorldTerrain.png") : option.icon,
						tooltip: option.tooltip == undefined ? "火星科技提供的中国国内地形" : option.tooltip,
						category: "",
						creationFunction: function () {
							return that.getTerrainProvider({
								type: option.type,
								url: option.url == undefined ? "http://data.mars3d.cn/terrain" : option.url
							});
						}
					})
					terrainModels.push(model)
					break;
				case "ion":
					var model = new Cesium.ProviderViewModel({
						name: option.name ? "Cesium Ion 全球地形" : option.name,
						iconUrl: option.icon == undefined ? Cesium.buildModuleUrl("Widgets/Images/TerrainProviders/CesiumWorldTerrain.png") : option.icon,
						tooltip: option.tooltip == undefined ? "Cesium官方Ion提供的高分辨率全球地形" : option.tooltip,
						category: "",
						creationFunction: function () {
							return that.getTerrainProvider({
								type: "ion"
							});
						}
					})
					terrainModels.push(model)
					break;
				case "arcgis":
					var model = new Cesium.ProviderViewModel({
						name: option.name ? "ArcGIS 全球地形" : option.name,
						iconUrl: option.icon == undefined ? Cesium.buildModuleUrl("Widgets/Images/TerrainProviders/CesiumWorldTerrain.png") : option.icon,
						tooltip: option.tooltip == undefined ? "arcgis官方提供的高分辨率全球地形" : option.tooltip,
						category: "",
						creationFunction: function () {
							return that.getTerrainProvider({
								type: "arcgis",
								url: option.url == undefined ?
									"https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer" : option.url
							});
						}
					})
					terrainModels.push(model)
					break;
			}

			if(option.show){
				selectedIndex=index
			}
		}
		return {
			terrainModels:terrainModels,
			index:selectedIndex
		}


	}



	_ellipsoid = new Cesium.EllipsoidTerrainProvider({
		ellipsoid: Cesium.Ellipsoid.WGS84
	  });

	static hasTerrain(viewer) {
		return !(
		  viewer.terrainProvider == this._ellipsoid ||
		  viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider
		);
	  }
}



export default terrainLayer;
