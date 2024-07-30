import * as Cesium from 'cesium'
import * as Speed from '@/cesiumSDK/index'

/**
 * 波动圆
 */
export default class WaveCircle {
	/**
	 * 波动圆
	 *
	 * @constructor
	 *
	 * @param {Cesium.Viewer} viewer Viewer对象
	 * @param {String} [id] 波动圆id
	 * @param {Object} options 参数
	 * @param {Boolean} options.show 是否显示
	 * @param {Cesium.Cartesian3} options.position 波动圆位置
	 * @param {Number} options.height 高度
	 * @param {Number} options.count 波动个数
	 * @param {Number} options.speed 波动速度
	 * @param {Number} options.radius 辐射半径
	 * @param {String} options.color 颜色
	 */
	constructor(viewer, id, options) {
		this._viewer = viewer;
		this._id = id;
		this._show = options.show;
		this._position = options.position;
		this._height = options.height;
		this._count = options.count;
		this._speed = options.speed;
		this._radius = options.radius;
		this._color = Cesium.Color.fromCssColorString(options.color);

		this._heightCallbackProperty = null;
		this._heightReferenceCallbackProperty = null;
		this._radiusCallbackProperty = null;
		this._entity = null;
	}

	get entityId() {
		return this._id;
	}

	get entity() {
		return this._entity;
	}

	set show(val) {
		this._show = val;
		if (this._entity) {
			this._entity.show = val;
		}
	}

	set position(val) {
		if (val instanceof Cesium.Cartesian3) {
			this._position = val;
		}
	}

	set height(val) {
		if (Cesium.defined(val)) {
			this._height = val;
		}
	}

	set count(val) {
		if (Cesium.defined(val) && val > 0) {
			this._count = val;
		}
	}

	set speed(val) {
		if (Cesium.defined(val) && val > 0) {
			this._speed = val;
		}
	}

	set radius(val) {
		if (Cesium.defined(val) && val > 0) {
			this._radius = val;
		}
	}

	set color(val) {
		if (val instanceof Cesium.Color) {
			this._color = val;
		}
	}

	/**
	 * 创建波动圆
	 */
	createWaveCircle() {
		this.removeWaveCircle();

		this._entity = this._viewer.entities.add({
			id: this._id,
			show: this._show,
			position: new Cesium.CallbackProperty(() => {
				return this._position;
			}, false),
			ellipse: {
				semiMinorAxis: this._radiusCallback(),
				semiMajorAxis: this._radiusCallback(),
				height: this._heightCallback(),
				heightReference: this._heightReferenceCallback(),
				material: new Speed.CircleRippleMaterialProperty({
					color: new Cesium.CallbackProperty(() => {
						return this._color;
					}, false),
					speed: new Cesium.CallbackProperty(() => {
						return this._speed;
					}, false),
					count: new Cesium.CallbackProperty(() => {
						return this._count;
					}, false),
				}),
			},
		});
	}

	_heightCallback() {
		if (!this._heightCallbackProperty) {
			this._heightCallbackProperty = new Cesium.CallbackProperty(() => {
				return this._height;
			}, false);
		}
		return this._heightCallbackProperty;
	}

	_heightReferenceCallback() {
		if (!this._heightReferenceCallbackProperty) {
			this._heightReferenceCallbackProperty = new Cesium.CallbackProperty(() => {
				if (this._height !== 0) {
					return Cesium.HeightReference.RELATIVE_TO_GROUND;
				} else {
					return Cesium.HeightReference.CLAMP_TO_GROUND;
				}
			}, false);
		}
		return this._heightReferenceCallbackProperty;
	}

	_radiusCallback() {
		if (!this._radiusCallbackProperty) {
			this._radiusCallbackProperty = new Cesium.CallbackProperty(() => {
				return this._radius;
			}, false);
		}
		return this._radiusCallbackProperty;
	}

	/**
	 * 移除波动圆
	 */
	removeWaveCircle() {
		if (this._entity) {
			this._viewer.entities.remove(this._entity);
			this._entity = null;
		}
	}

	removeAllWaveCircle(ids) {
		for (let index = 0; index < ids.length; index++) {
			this._viewer.entities.removeById(ids[index]);
		}
		// if (this._entity) {
		// 	this._viewer.entities.remove(this._entity);
		// 	this._entity = null;
		// }
	}

	/**
	 * 销毁波动圆
	 */
	destroy() {
		this.removeWaveCircle();
	}
}
