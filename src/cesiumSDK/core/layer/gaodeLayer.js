import * as Cesium from "cesium";
import SpeedLayer from './base/speedLayer'
import * as util from "../util/util";
import GaodeImageryProvider from "./imageryProvider/GaodeImageryProvider"

/**
 * 高德地图
 */
class gaodeLayer extends SpeedLayer {
	static gaodeImageryProvider(opts) {
		var _url;
		switch (opts.layer) {
			case "vec":
			case "vec_d":
				_url =
					"https://" +
					(opts.bigfont ? "wprd" : "webrd") +
					"0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}";
				break;
			case "img_d":
				_url = "https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
				break;
			case "img_z":
				_url =
					"https://webst0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8";
				break;
			case "time":
				var time = new Date().getTime();
				_url =
					"https://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&;t=1&x={x}&y={y}&z={z}&&t=" +
					time;
				break;
		}
		if (opts.proxy || opts.headers || opts.queryParameters) {
			//存在代理等参数时
			_url = util.getProxyUrl({
				url: _url.replace("{s}", "1"),
				proxy: opts.proxy,
				headers: opts.headers,
				queryParameters: opts.queryParameters
			}).url;
		}
		var layer = new GaodeImageryProvider({
			subdomains: ["1", "2", "3", "4"],
			maximumLevel: 18,
			...opts,
			url: _url,

		});

		return layer
	}

	static gaodeImageryLayer(options) {
		let imageryProvider = this.gaodeImageryProvider(options)

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

	static gaodeImageryModels(opts) {
		var gaodeMapModel
		if(opts.hasOwnProperty("layers")){
			if(opts.layers==undefined || opts.layers.length==0) return
			let gdlayers=[]
			opts.layers.forEach(item => {
				if(opts.crs){
					item.crs=opts.crs
				}
				var layer = this.gaodeImageryProvider(item)
				gdlayers.push(layer)
			});
			gaodeMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "高德",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/mapboxSatellite.png"),
				tooltip: opts.tooltip || "高德地图服务",
				creationFunction: function () {
					return gdlayers;
				}
			});
		}else{

			var gaode = this.gaodeImageryProvider(opts)
			gaodeMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "高德",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/mapboxSatellite.png"),
				tooltip: opts.tooltip || "高德地图服务",
				creationFunction: function () {
					return gaode;
				}
			});
		}

		return gaodeMapModel
	}


}

export default gaodeLayer
