/*
 * 百度地图主类
 */
import BaiduMercatorTilingScheme from "./BaiduMercatorTilingScheme";
import * as Cesium from "cesium";

class BaiduImageryProvider {
	constructor(options = {}) {
		var url = options.url;
		if (Cesium.defined(options.layer)) {
			switch (options.layer) {
				case "vec":
				case "vec_d":
					url =
						"http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=" +
						(options.bigfont ? "ph" : "pl") +
						"&scaler=1&p=1";
					break;
				case "img_d":
					url = "http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46";
					break;
				case "img_z":
					url =
						"http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=" +
						(options.bigfont ? "sh" : "sl") +
						"&v=020";
					break;

				case "custom": //Custom 各种自定义样式
					//可选值：dark,midnight,grayscale,hardedge,light,redalert,googlelite,grassgreen,pink,darkgreen,bluish
					options.style = options.style || "midnight";
					url =
						"http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=" +
						options.style;
					break;

				case "time": //实时路况
					var time = new Date().getTime();
					url =
						"http://its.map.baidu.com:8002/traffic/TrafficTileService?x={x}&y={y}&level={z}&time=" +
						time +
						"&label=web2D&v=017";
					break;
			}
		}
		this._url = url;

		this._tileWidth = options.tileWidth || 256;
		this._tileHeight = options.tileHeight || 256;
		this._maximumLevel = options.maximumLevel || 18;
		this._minimumLevel = options.minimumLevel || 0;

		this._crs = options.crs || "BD09";
		if (options.crs === "WGS84") {
			let resolutions = [];
			for (let i = 0; i < 19; i++) {
				resolutions[i] = 256 * Math.pow(2, 18 - i);
			}
			this._tilingScheme = new BaiduMercatorTilingScheme({
				resolutions,
				rectangleSouthwestInMeters: new Cesium.Cartesian2(
					-20037726.37,
					-12474104.17
				),
				rectangleNortheastInMeters: new Cesium.Cartesian2(
					20037726.37,
					12474104.17
				),
			});
		} else {
			this._tilingScheme = new Cesium.WebMercatorTilingScheme({
				rectangleSouthwestInMeters: new Cesium.Cartesian2(-33554054, -33746824),
				rectangleNortheastInMeters: new Cesium.Cartesian2(33554054, 33746824),
			});
		}
		this._rectangle = this._tilingScheme.rectangle;
		this._credit = undefined;
		this._style = options.style || "normal";
	}

	get url() {
		return this._url;
	}

	get token() {
		return this._token;
	}

	get tileWidth() {
		if (!this.ready) {
			throw new Cesium.DeveloperError(
				"tileWidth must not be called before the imagery provider is ready."
			);
		}
		return this._tileWidth;
	}

	get tileHeight() {
		if (!this.ready) {
			throw new Cesium.DeveloperError(
				"tileHeight must not be called before the imagery provider is ready."
			);
		}
		return this._tileHeight;
	}

	get maximumLevel() {
		if (!this.ready) {
			throw new Cesium.DeveloperError(
				"maximumLevel must not be called before the imagery provider is ready."
			);
		}
		return this._maximumLevel;
	}

	get minimumLevel() {
		if (!this.ready) {
			throw new Cesium.DeveloperError(
				"minimumLevel must not be called before the imagery provider is ready."
			);
		}
		return 0;
	}

	get tilingScheme() {
		if (!this.ready) {
			throw new Cesium.DeveloperError(
				"tilingScheme must not be called before the imagery provider is ready."
			);
		}
		return this._tilingScheme;
	}

	get rectangle() {
		if (!this.ready) {
			throw new Cesium.DeveloperError(
				"rectangle must not be called before the imagery provider is ready."
			);
		}
		return this._rectangle;
	}

	get ready() {
		return !!this._url;
	}

	get credit() {
		return this._credit;
	}

	get hasAlphaChannel() {
		return true;
	}

	getTileCredits(x, y, level) { }

	requestImage(x, y, level) {
		if (!this.ready) {
			throw new Cesium.DeveloperError(
				"requestImage must not be called before the imagery provider is ready."
			);
		}
		let xTiles = this._tilingScheme.getNumberOfXTilesAtLevel(level);
		let yTiles = this._tilingScheme.getNumberOfYTilesAtLevel(level);
		let url = this._url
			.replace("{z}", level)
			.replace("{s}", this.randomNum(0, 3));

		if (this._crs === "WGS84") {
			url = url.replace("{x}", String(x)).replace("{y}", String(-y));
		} else {
			url = url
				.replace("{x}", String(x - xTiles / 2))
				.replace("{y}", String(yTiles / 2 - y - 1));
		}
		return Cesium.ImageryProvider.loadImage(this, url);
	}
	randomNum(min, max) {
		var aNumber = (max + 1 - min) * Math.random() + min;
		var result = Math.floor(aNumber);
		return result;
	}
}

export default BaiduImageryProvider
