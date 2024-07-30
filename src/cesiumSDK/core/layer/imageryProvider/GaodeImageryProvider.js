/*
 * 高德地图主类
 */

import GaodeMercatorTilingScheme from "./GaodeMercatorTilingScheme";
import * as Cesium from 'cesium'


class GaodeImageryProvider extends Cesium.UrlTemplateImageryProvider {
	constructor(options = {}) {
		if (!options.url) throw new Error("Map service url is required!");
		if (!options.subdomains || !options.subdomains.length) {
			options["subdomains"] = ["01", "02", "03", "04"];
		}

		if (options.crs === "WGS84") {
			options["tilingScheme"] = new GaodeMercatorTilingScheme();
		}
		super(options);
	}
}
export default GaodeImageryProvider;
