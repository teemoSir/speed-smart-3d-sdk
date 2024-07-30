import * as Cesium from "cesium";
import * as Speed from "@/cesiumSDK/index";

/**
 * 点光源
 */
export default class PointLight {
	/**
	 * 点光源
	 *
	 * @constructor
	 *
	 * @param {Cesium.Viewer} viewer Viewer对象
	 * @param {Object} options 参数
	 * @param {Boolean} [options.showLightPoint=false] 是否显示光源点
	 * @param {Cesium.Cartesian3} options.position 是否显示光源点
	 * @param {String} [options.direction=Speed.PointLightDirection.UP_TO_DOWN] 光源方向
	 * @param {Number} [options.brightness=1] 亮度
	 * @param {Number} [options.saturation=1] 饱和度
	 * @param {Cesium.Color} [options.color=Cesium.Color.RED] 颜色
	 */
	constructor(viewer, options) {
		if (!Cesium.defined(options.position)) {
			throw new Cesium.DeveloperError("options.position is required!");
		}

		this._viewer = viewer;
		this._showLightPoint = Cesium.defaultValue(options.showLightPoint, false);
		this._position = options.position;
		this._direction = Cesium.defaultValue(options.direction, "UP_TO_DOWN");
		this._brightness = Cesium.defaultValue(options.brightness, 1);
		this._saturation = Cesium.defaultValue(options.saturation, 1);
		this._color = Cesium.defaultValue(options.color, Cesium.Color.RED);

		this._lightPointEntity = null;

		this._addPointLight();
	}

	get direction() {
		return this._direction;
	}

	set showLightPoint(val) {
		this._showLightPoint = val;
		if (this._lightPointEntity) {
			this._lightPointEntity.show = val;
		}
	}

	set direction(val) {
		this._direction = val;
	}

	set brightness(val) {
		if (val >= 0) {
			this._brightness = val;
			this._viewer.scene.light.intensity = val;
		}
	}

	set saturation(val) {
		if (val >= 0) {
			this._saturation = val;
		}
	}

	set color(val) {
		this._color = val;
		this._viewer.scene.light.color = val;
	}

	_addPointLight() {
		if (this._showLightPoint) {
			this._lightPointEntity = this._viewer.entities.add(new Cesium.Entity({
				point: new Cesium.PointGraphics({
					color: new Cesium.CallbackProperty(() => {
						return this._color;
					}, false),
					pixelSize: 10,
				}),
				position: this._position,
			}));
		}

		this._storePreviousLightConfig();
		this._viewer.scene.globe.dynamicAtmosphereLighting = false;
		this._viewer.scene.globe.enableLighting = true;
		this._viewer.scene.light = new Cesium.DirectionalLight({
			direction: this._viewer.scene.camera.directionWC,
			color: this._color,
			intensity: this._brightness,
		});
		this._viewer.scene.preRender.addEventListener(this._preRenderEvent);
	}

	_preRenderEvent(scene) {
		scene.light.direction = Cesium.Cartesian3.clone(
			scene.camera.directionWC,
			scene.light.direction
		);
	}

	/**
	 * 保存修改之前的光照配置
	 *
	 * @private
	 */
	_storePreviousLightConfig() {
		this._previousDynamicAtmosphereLighting = this._viewer.scene.globe.dynamicAtmosphereLighting;
		this._previousEnableLighting = this._viewer.scene.globe.enableLighting;
		this._previousLight = this._viewer.scene.light;
	}

	/**
	 * 恢复光照配置
	 *
	 * @private
	 */
	_restorePreviousLightConfig() {
		this._viewer.scene.globe.dynamicAtmosphereLighting = this._previousDynamicAtmosphereLighting;
		this._viewer.scene.globe.enableLighting = this._previousEnableLighting;
		this._viewer.scene.light = this._previousLight;
	}

	destroy() {
		if (this._lightPointEntity) {
			this._viewer.entities.remove(this._lightPointEntity);
			this._lightPointEntity = null;
		}
		this._viewer.scene.preRender.removeEventListener(this._preRenderEvent);
		this._restorePreviousLightConfig();
		this._viewer.scene.light = new Cesium.SunLight();
	}
}
