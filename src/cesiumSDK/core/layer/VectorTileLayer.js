import SpeedLayer from './base/speedLayer'
import VectorTileImageryProvider from 'cesiumvectortile';
import * as Cesium from "cesium";


class VectorTileLayer extends SpeedLayer {

	static shpImageryProvider(options) {
		if (options && options.source) {
			let imageryProvider = new VectorTileImageryProvider({
				source: options.source,
				defaultStyle: {
					tileCacheSize: options.tileCacheSize || 200,
					fill: options.fill || true, // 是否填充，仅面数据有效。
					fillColor: options.fillColor || "rgba(135,206,235,0.5)",
					outline: options.outline || true, // 是否显示边，仅面数据有效。
					outlineColor: options.outlineColor || "rgba(65,105,225,1)",
					lineWidth: options.lineWidth || 1,
					showMaker: options.showMaker || false,
					showCenterLabel: options.showCenterLabel || true,//是否显示文本，仅对线和面数据有效
					fontColor: options.fontColor || "rgba(255,0,0,1)",
					labelOffsetX: options.labelOffsetX || -10,
					labelOffsetY: options.labelOffsetY || -5,
					fontSize: options.fontSize || 13,
					fontFamily: options.fontFamily || "黑体",
					centerLabelPropertyName: options.centerLabelPropertyName || "NAME"
				},
				maximumLevel: options.maximumLevel || 20,
				minimumLevel: options.minimumLevel || 1,
				simplify: options.simplify || false
			});

			return imageryProvider
		}
	}

	static vectorTileLayer(options) {
		if (options && options.source) {
			let imageryProvider = this.shpImageryProvider(options)
			let imageryLayer = new Cesium.ImageryLayer(imageryProvider);
			return imageryLayer
		}
	}
}
export default VectorTileLayer
