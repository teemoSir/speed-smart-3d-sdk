import * as Cesium from "cesium";
import * as turf from '@turf/turf'


/**
 *
 * 将“src”对象（或多个对象）的属性合并到“dest”对象中并返回。
 * @param {*} dest
 * @param {*} sources
 *
 */
export function merge(dest, ...sources) {
	let i, j, len, src
	for (j = 0, len = sources.length; j < len; j++) {
		src = sources[j]
		for (i in src) {
			dest[i] = src[i]
		}
	}
	return dest
}

/**
 *
 * @function trim(str: String): String
 * Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
 * @param {*} str
 *
 */
export function trim(str) {
	return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '')
}

/**
 * @function splitWords(str: String): String[]
 * Trims and splits the string on whitespace and returns the array of parts.
 * @param {*} str
 *
 */
export function splitWords(str) {
	return this.trim(str).split(/\s+/)
}


/**
 * @function checkPositions(positions: Object): Boolean
 * Check positions for validity
 * @param {*} position
 */
export function checkPositions(positions) {
	return (
		positions && (typeof positions === 'string' || Array.isArray(positions))
	)
}

/**
 * @function checkViewer(viewer: Object): Boolean
 * Check viewer for validity
 * @param {*} position
 */
export function checkViewer(viewer) {
	return viewer && viewer.delegate && viewer.canvas
}


/**
 * 判断url加上配置的代理
 * @param {*} config
 * @returns
 */
export function getProxyUrl(config) {
	if (!config.url || (!config.proxy && !config.headers && !config.queryParameters)) return config;

	if (config.url instanceof Cesium.Resource) {
		config.url.headers = config.headers;
		return config;
	}

	var opts = {};
	for (var key in config) {
		opts[key] = config[key];
	}
	opts.url = new Cesium.Resource({
		url: opts.url,
		proxy: opts.proxy ? new Cesium.DefaultProxy(opts.proxy) : null,
		headers: opts.headers,
		queryParameters: opts.queryParameters
	});

	return opts;
}

var templateRe = /\{ *([a-zA-Z0-9_\u4e00-\u9fa5]+) *\}/g;


export function template(str, data) {
	if (str == null) return str;
	return str.replace(templateRe, function (str, key) {
		var value = data[key];
		if (!Cesium.defined(value)) return "";

		if (typeof value === "function") {
			value = value(data);
			if (!Cesium.defined(value)) return "";
		} else if (value.getValue && typeof value.getValue == "function") {
			value = value.getValue(currentTime());
			if (!Cesium.defined(value)) return "";
		}

		return value;
	});
}

//取当前时间，用于getValue传参
export function currentTime() {
	if (window.viewer) return window.viewer.clock.currentTime;
	else return Cesium.JulianDate.now();
}


export function handleColorType(color) {
	color = color.replace(/rgba\(/, '')
	color = color.replace(/\)/, '')
	let colorArr = color.split(',');
	let colorArr2 = new Array(colorArr.length).fill(0);
	for(let i = 0; i < colorArr.length - 1; i ++) {
	  colorArr2[i] = + colorArr[i] / 255
	}
	colorArr2[colorArr.length - 1] = + colorArr[colorArr.length - 1]

	return new Cesium.Color(...colorArr2);
  }

//格式化经度/纬度，返回度分秒字符串
export function formatDegree(value) {
	value = Math.abs(value);
	var v1 = Math.floor(value); //度
	var v2 = Math.floor((value - v1) * 60); //分
	var v3 = Math.round(((value - v1) * 3600) % 60); //秒
	return v1 + "° " + v2 + "'  " + v3 + '"';
  }

  // 简化geojson的坐标
export function simplifyGeoJSON(geojson) {
	try {
		geojson = turf.simplify(geojson, { tolerance: 0.0001, highQuality: true, mutate: true })
	} catch (e) {
		//
	}
	return geojson
}

export function isPCBroswer() {
	var sUserAgent = navigator.userAgent.toLowerCase();

	var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	var bIsIphoneOs = sUserAgent.match(/iphone/i) == "iphone";
	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	var bIsAndroid = sUserAgent.match(/android/i) == "android";
	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
	  return false;
	} else {
	  return true;
	}
  }
