import * as Cesium from "cesium";

/**
* 三维坐标 转 类极坐标
* @param cartesian3
* @returns
* { longitude: 以弧度为单位, latitude: 以弧度为单位, height: 椭球上方的高度，以米为单位 }
*/
export function cartesianToCartographic(viewer,cartesian3){
	let ellipsoid = viewer.scene.globe.ellipsoid
	let cartographic = ellipsoid.cartesianToCartographic(cartesian3)
	return cartographic
}

/**
 * 极坐标 转 经纬度坐标
 */
export function cartographicToLngLatHeight(cartographic){
	if (!(cartographic instanceof Cesium.Cartographic)) {
		throw new Error(` (cartographicToLngLatHeight:) 参数错误:"${cartographic}"`)
	}
	let longitude = Cesium.Math.toDegrees(cartographic.longitude)
	let latitude = Cesium.Math.toDegrees(cartographic.latitude)
	let height = cartographic.height

	let lngLatHeight = [longitude, latitude, height]
	return lngLatHeight
}

/**
 * 极坐标 转 三维坐标
 */
export function cartographicToCartesian(cartographic){
	let cartesian3 = Cesium.Cartesian3.fromRadians(
		cartographic.longitude,
		cartographic.latitude,
		cartographic.height
	)
	return cartesian3
}

/**
 * 三维坐标 转 地理坐标
 * @param cartesian3
 * @returns
 * { longitude: 经度, latitude: 纬度, height: 椭球上方的高度，以米为单位 }
 */
export function cartesianToLngLatHeight(cartesian3){
	if (!(cartesian3 instanceof Cesium.Cartesian3)) {
		throw new Error(` (cartesianToLngLatHeight:) 参数错误:"${cartesian3}"`)
	}
	let cartographic = this.cartesianToCartographic(cartesian3)
	if (cartographic) {
		let lngLatHeight = this.cartographicToLngLatHeight(cartographic)
		return lngLatHeight
	}
}

/**
 * 经纬度 转 极坐标
 * @param {*} longitude
 * @param {*} latitude
 * @param {*} height
 * @returns
 */
export function lngLatHeightToCartographic(longitude, latitude, height = 0,){
	let cartographic = Cesium.Cartographic.fromDegrees(longitude, latitude, height)
	return cartographic
}

/**
 * 地理坐标 转 三维坐标
 * @param longitude
 * @param latitude
 * @param height
 * @param ellipsoidType: 经过测试两种椭球参数一致
 * @returns {*}
 */
export function lngLatHeightToCartesian(viewer,longitude, latitude, height = 0, ellipsoidType = 'default'){
	if (!['default', 'scene'].includes(ellipsoidType)) {
		throw new Error(` (lngLatHeightToCartesian:) ellipsoidType:"${ellipsoidType}", 然而应该取值'default'或'scene'`)
	}
	let ellipsoid
	// 经过测试两种椭球参数一致
	if (ellipsoidType === 'default') {
		ellipsoid = Cesium.Ellipsoid.WGS84
	} else if (ellipsoidType === 'scene') {
		// 场景中渲染的地球，包括其地形（ Globe＃terrainProvider ）和图像图层（ Globe＃imageryLayers ）。使用 Scene＃globe 访问地球
		ellipsoid = viewer.scene.globe.ellipsoid;
	}
	let cartesian3 = Cesium.Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid)
	return cartesian3
}
