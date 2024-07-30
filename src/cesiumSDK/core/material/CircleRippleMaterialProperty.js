/**
 * 动态波纹圆材质对象
 */

import * as Cesium from "cesium";

Cesium.Material.CircleRippleType = "CircleRipple";
Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleRippleType, {
	fabric: {
		type: Cesium.Material.CircleRippleType,
		uniforms: {
			color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
            speed: 3.0,
            count: 1,
            gradient: 0.2
		  },
		source: `
		uniform vec4 color;
		uniform float speed;
		uniform float count;
		uniform float gradient;

		czm_material czm_getMaterial(czm_materialInput materialInput)
		{
			czm_material material = czm_getDefaultMaterial(materialInput);
			material.diffuse = 1.5 * color.rgb;
			vec2 st = materialInput.st;
			float dis = distance(st, vec2(0.5, 0.5));
			float per = fract(czm_frameNumber * speed / 1000.0);
			if(count == 1.0){
				if(dis > per * 0.5){
					discard;
				}else {
					material.alpha = color.a  * dis / per / 2.0;
				}
			} else {
				vec3 str = materialInput.str;
				if(abs(str.z)  > 0.001){
					discard;
				}
				if(dis > 0.5){
					discard;
				} else {
					float perDis = 0.5 / count;
					float disNum;
					float bl = 0.0;
					for(int i = 0; i <= 999; i++){
						if(float(i) <= count){
							disNum = perDis * float(i) - dis + per / count;
							if(disNum > 0.0){
								if(disNum < perDis){
									bl = 1.0 - disNum / perDis;
								}
								else if(disNum - perDis < perDis){
									bl = 1.0 - abs(1.0 - disNum / perDis);
								}
								material.alpha = pow(bl,(1.0 + 10.0 * (1.0 - gradient)));
							}
						}
					}
				}
			}
			return material;
		}
		`,
	},
	translucent: function (material) {
		return true;
	},
});

class CircleRippleMaterialProperty {
	constructor(options = {}) {
		this._definitionChanged = new Cesium.Event();

		this.color = Cesium.defaultValue(options.color, new Cesium.Color(1, 0, 0, 1));
		this.speed = Cesium.defaultValue(options.speed, 3);
		this.count = Cesium.defaultValue(options.count, 1);
		this.gradient = Cesium.defaultValue(options.gradient, 0.2);
	}

	getType() {
		return Cesium.Material.CircleRippleType;
	}

	get isConstant() {
		return false;
	  }

	get definitionChanged() {
	return this._definitionChanged;
	}

	getValue(time, result) {
		if (!result) {
			result = {};
		}
		result.color = Cesium.Property.getValueOrUndefined(this._color, time);
		result.speed = Cesium.Property.getValueOrUndefined(this._speed, time);
		result.count = Cesium.Property.getValueOrUndefined(this._count, time);
		result.gradient = this._gradient;
	}

	equals(other) {
		return (
			this === other ||
			(other instanceof CircleRippleMaterialProperty &&
				Cesium.Property.equals(this._color, other._color) &&
				Cesium.Property.equals(this._speed, other._speed)  &&
				Cesium.Property.equals(this._count, other._count)  &&
				Cesium.Property.equals(this._gradient, other._gradient))
		);
	}
}

Object.defineProperties(CircleRippleMaterialProperty.prototype, {
	color: Cesium.createPropertyDescriptor("color"),
	speed: Cesium.createPropertyDescriptor("speed"),
	count: Cesium.createPropertyDescriptor("count"),
	gradient: Cesium.createPropertyDescriptor("gradient"),
});

export default CircleRippleMaterialProperty;
