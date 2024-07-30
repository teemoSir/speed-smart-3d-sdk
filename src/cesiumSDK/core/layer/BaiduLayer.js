import * as Cesium from "cesium";
import SpeedLayer from './base/speedLayer'
import BaiduImageryProvider from "./imageryProvider/BaiduImageryProvider";

/**
 * 百度地图服务
 */
class BaiduLayer extends SpeedLayer {

	static baiduImageryModels(opts){
		var baiduMapModel = undefined
		if (opts.hasOwnProperty("layers")) {
			if (opts.layers == undefined || opts.layers.length == 0) return
			let BaiduLayers = []
			opts.layers.forEach(item => {
				if(opts.crs){
					item.crs=opts.crs
				}
				let imageryProvider =  new BaiduImageryProvider(item)
				BaiduLayers.push(imageryProvider)
			});

			baiduMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "百度",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "百度地图服务",
				creationFunction: function () {
					return BaiduLayers;
				}
			});
		} else {
			let imageryProvider = new BaiduImageryProvider(opts)
			baiduMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "百度",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "百度地图服务",
				creationFunction: function () {
					return imageryProvider;
				}
			});
		}

		return baiduMapModel
	}
}

export default BaiduLayer
