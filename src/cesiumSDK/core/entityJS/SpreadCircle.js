/**
 * 动态扩散圆
 */
import * as Cesium from 'cesium'
import * as Speed from '@/cesiumSDK/index'

class SpreadCircle {
	constructor(viewer) {
		this.viewer = viewer
	}

	/**
	 * 扩散圈和圆圈
	 * clockwise-顺时针/逆时针
	 *
	 */
	createCircle(pos, option, bool) {
		const radius = option.raius;
		const num = Math.ceil(radius / 10);
		let positions = [];
		let pos_0 = [];
		for (let i = 0; i < 360; i++) {
			const _pos = this.get_another_point(pos[0], pos[1], i, radius);
			i == 0 && pos_0.push(_pos.lng, _pos.lat);
			option.clockwise
				? positions.push(_pos.lng, _pos.lat)
				: positions.unshift(_pos.lng, _pos.lat);
		}
		positions.push(pos_0[0], pos_0[1]);
		this.viewer.entities.add({
			polyline: {
				clampToGround: true,
				positions: Cesium.Cartesian3.fromDegreesArray(positions),
				material: new Speed.PolylineImageTrailMaterialProperty({
					color: Cesium.Color.fromCssColorString(option.color),
					speed: 30,
					image: require("@/assets/arrow.png"),
					repeat: { x: num, y: 1 },
				}),
				width: 5,
			},
			type:"range"
		});
		!bool &&
			this.viewer.entities.add({
				polygon: {
					hierarchy: new Cesium.PolygonHierarchy(
						Cesium.Cartesian3.fromDegreesArray(positions)
					),
					material: new Speed.CircleDiffuseMaterialProperty({
						color: Cesium.Color.RED,
						speed: 10,
					}),
				},
				type:"range"
			});
	}

	/**
	 * 扩散圈
	 * clockwise-顺时针/逆时针
	 *
	 */
	createSpreadCircle(pos, radius) {
		let positions = [];
		let pos_0 = [];
		for (let i = 0; i < 360; i++) {
			const _pos = this.get_another_point(pos[0], pos[1], i, radius);
			i == 0 && pos_0.push(_pos.lng, _pos.lat);
			positions.push(_pos.lng, _pos.lat);
		}
		positions.push(pos_0[0], pos_0[1]);
		this.viewer.entities.add({
			position: Cesium.Cartesian3.fromDegrees(pos[0], pos[1]),
			polygon: {
				hierarchy: new Cesium.PolygonHierarchy(
					Cesium.Cartesian3.fromDegreesArray(positions)
				),
				material: new Speed.CircleDiffuseMaterialProperty({
					color: Cesium.Color.RED,
					speed: 10,
				}),
			},
			type:"range"
		});

	}


	/**
	 *
	 * @param {*} lng 经度
	 * @param {*} lat 纬度
	 * @param {*} angle 角度 (0~360度)
	 * @param {*} distance 距离 (米)
	 *
	 */
	get_another_point(lng, lat, angle, distance) {
		// WGS84坐标系
		var a = 6378137; // 赤道半径
		var b = 6356752.3142; // 短半径
		var f = 1 / 298.257223563; // 扁率

		var alpha1 = angle * (Math.PI / 180);
		var sinAlpha1 = Math.sin(alpha1);
		var cosAlpha1 = Math.cos(alpha1);
		var tanU1 = (1 - f) * Math.tan(lat * (Math.PI / 180));
		var cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1),
			sinU1 = tanU1 * cosU1;
		var sigma1 = Math.atan2(tanU1, cosAlpha1);
		var sinAlpha = cosU1 * sinAlpha1;
		var cosSqAlpha = 1 - sinAlpha * sinAlpha;
		var uSq = (cosSqAlpha * (a * a - b * b)) / (b * b);
		var A =
			1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
		var B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
		var sigma = distance / (b * A),
			sigmaP = 2 * Math.PI;
		while (Math.abs(sigma - sigmaP) > 1e-12) {
			var cos2SigmaM = Math.cos(2 * sigma1 + sigma);
			var sinSigma = Math.sin(sigma);
			var cosSigma = Math.cos(sigma);
			var deltaSigma =
				B *
				sinSigma *
				(cos2SigmaM +
					(B / 4) *
					(cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
						(B / 6) *
						cos2SigmaM *
						(-3 + 4 * sinSigma * sinSigma) *
						(-3 + 4 * cos2SigmaM * cos2SigmaM)));
			sigmaP = sigma;
			sigma = distance / (b * A) + deltaSigma;
		}

		var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
		var lat2 = Math.atan2(
			sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
			(1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)
		);
		var lambda = Math.atan2(
			sinSigma * sinAlpha1,
			cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1
		);
		var C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
		var L =
			lambda -
			(1 - C) *
			f *
			sinAlpha *
			(sigma +
				C *
				sinSigma *
				(cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
		return {
			lng: Number(lng) + L * (180 / Math.PI),
			lat: lat2 * (180 / Math.PI),
		};
	}
}
export default SpreadCircle
