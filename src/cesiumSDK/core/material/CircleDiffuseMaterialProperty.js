/**
 * 定义Cesium材质对象
 */

import * as Cesium from "cesium";
import MaterialProperty from "./MaterialProperty";

Cesium.Material.CircleDiffuseType = "CircleDiffuse";
Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleDiffuseType, {
	fabric: {
		type: Cesium.Material.CircleDiffuseType,
		uniforms: {
			color: new Cesium.Color(1.0, 0.0, 0.0, 0.2),
			speed: 3.0,
		},
		source: `uniform vec4 color;
    uniform float speed;

    vec3 circlePing(float r, float innerTail,  float frontierBorder, float timeResetSeconds,  float radarPingSpeed,  float fadeDistance){
      float t = fract(czm_frameNumber * speed / 1000.0);
      float time = mod(t, timeResetSeconds) * radarPingSpeed;
      float circle;
      circle += smoothstep(time - innerTail, time, r) * smoothstep(time + frontierBorder,time, r);
      circle *= smoothstep(fadeDistance, 0.0, r);
      return vec3(circle);
    }

    czm_material czm_getMaterial(czm_materialInput materialInput){
      czm_material material = czm_getDefaultMaterial(materialInput);
      vec2 st = materialInput.st * 2.0  - 1.0 ;
      vec2 center = vec2(0.);
      float time = fract(czm_frameNumber * speed / 1000.0);
      vec3 flagColor;
      float r = length(st - center) / 4.;
      flagColor += circlePing(r, 0.25, 0.025, 4.0, 0.3, 1.0) * color.rgb;
      material.alpha = length(flagColor) * 0.5;
      material.diffuse = flagColor.rgb;
      return material;
    }
    `,
	},
	translucent: function (material) {
		return true;
	},
});

class CircleDiffuseMaterialProperty extends MaterialProperty {
	constructor(options = {}) {
		super(options);
	}

	getType(time) {
		return Cesium.Material.CircleDiffuseType;
	}

	getValue(time, result) {
		result = Cesium.defaultValue(result, {});
		result.color = Cesium.Property.getValueOrUndefined(this._color, time);
		result.speed = this._speed;
		return result;
	}

	equals(other) {
		return (
			this === other ||
			(other instanceof CircleDiffuseMaterialProperty &&
				Cesium.Property.equals(this._color, other._color) &&
				Cesium.Property.equals(this._speed, other._speed))
		);
	}
}

Object.defineProperties(CircleDiffuseMaterialProperty.prototype, {
	color: Cesium.createPropertyDescriptor("color"),
	speed: Cesium.createPropertyDescriptor("speed"),
});

export default CircleDiffuseMaterialProperty;
