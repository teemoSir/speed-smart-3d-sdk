import * as Cesium from "cesium";
import SpeedLayer from './base/speedLayer'
import TencentImageryProvider from "./imageryProvider/TencentImageryProvider";

/**
 * 腾讯地图服务
 */
class TencentLayer extends SpeedLayer {

	static tencentImageryModels(opts) {
		var TencentMapModel = undefined

		if (opts.hasOwnProperty("layers")) {
			if (opts.layers == undefined || opts.layers.length == 0) return
			let TencentLayers = []
			opts.layers.forEach(item => {
				if(opts.crs){
					item.crs=opts.crs
				}
				let imageryProvider = new TencentImageryProvider(item)
				TencentLayers.push(imageryProvider)
			});

			TencentMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "腾讯",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "腾讯地图服务",
				creationFunction: function () {
					return TencentLayers;
				}
			});
		} else {
			let imageryProvider = new TencentImageryProvider(opts)
			TencentMapModel = new Cesium.ProviderViewModel({
				name: opts.name || "腾讯",
				iconUrl: opts.icon || Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
				tooltip: opts.tooltip || "腾讯地图服务",
				creationFunction: function () {
					return imageryProvider;
				}
			});
		}

		return TencentMapModel
	}
}

export default TencentLayer
