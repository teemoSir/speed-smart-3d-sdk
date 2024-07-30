/**
 * 动态流动材质对象
 */

import * as Cesium from "cesium";

Cesium.Material.LineFlowType = "LineFlow";
Cesium.Material._materialCache.addMaterial(Cesium.Material.LineFlowType, {
	fabric: {
		type: Cesium.Material.LineFlowType,
		uniforms: {
			image: Cesium.Material.DefaultImageId,
			color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
			repeat: new Cesium.Cartesian2(1.0, 1.0),
			axisY: false,
			speed: 10.0,
			hasImage2: false,
			image2: Cesium.Material.DefaultImageId,
			color2: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
		  },
		source: `
	uniform sampler2D image;
	uniform sampler2D image2;
	uniform vec4 color;
	uniform vec4 color2;
	uniform vec2 repeat;
	uniform float speed;
	uniform bool axisY;
	uniform bool hasImage2;

    czm_material czm_getMaterial(czm_materialInput materialInput){
      czm_material material = czm_getDefaultMaterial(materialInput);
      vec2 st = repeat * materialInput.st;
      vec4 colorImage = texture2D(image, vec2(fract((axisY?st.t:st.s) - speed*czm_frameNumber/1000.0), st.t));
	  if(color.a == 0.0) {
		material.alpha = colorImage.a;
		material.diffuse = colorImage.rgb;
	  } else {
		material.alpha = colorImage.a * color.a;
		material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb); 
	  }
	  if(hasImage2) {
		vec4 colorBG = texture2D(image2,materialInput.st);
		if(colorBG.a>0.5) {
			material.diffuse = color2.rgb;
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

class LineFlowMaterialProperty {
	constructor(options = {}) {
		this._definitionChanged = new Cesium.Event();

		//支持的属性
		this.image = options.image || options.url; //背景图片
		this.color = Cesium.defaultValue(options.color, new Cesium.Color(0, 0, 0, 0)); //背景图片颜色
		this.axisY = Cesium.defaultValue(options.axisY, false);
		this.speed = Cesium.defaultValue(options.speed, 10); //速度，建议取值范围1-100
		this.repeat = Cesium.defaultValue(options.repeat, new Cesium.Cartesian2(1.0, 1.0));

		this.image2 = options.image2 || options.bgUrl; //第2张背景图片
		this.color2 = options.color2 || options.bgColor || new Cesium.Color(1, 1, 1, 1); //第2张背景图片颜色
		this.hasImage2 = Cesium.defined(this.image2);

		if (options.duration) {
		//兼容v2.2之前老版本
		this.speed = 30000 / options.duration;
		}
	}

	getType() {
		return Cesium.Material.LineFlowType;
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
		result.image = Cesium.Property.getValueOrUndefined(this._image, time);
		result.color = Cesium.Property.getValueOrUndefined(this._color, time);
		result.repeat = Cesium.Property.getValueOrUndefined(this._repeat, time);
		result.axisY = this._axisY;
		result.speed = this._speed;
  
		result.hasImage2 = this._hasImage2;
		result.image2 = Cesium.Property.getValueOrUndefined(this._image2, time);
		result.color2 = Cesium.Property.getValueOrUndefined(this._color2, time);
	}

	equals(other) {
		return (
			this === other ||
			(other instanceof LineFlowMaterialProperty &&
				Cesium.Property.equals(this._color, other._color) &&
				Cesium.Property.equals(this._image, other._image) &&
				Cesium.Property.equals(this._repeat, other._repeat) &&
				Cesium.Property.equals(this._speed, other._speed)  &&
				Cesium.Property.equals(this._image2, other._image2)  &&
				Cesium.Property.equals(this._color2, other._color2)) 
		);
	}
}

Object.defineProperties(LineFlowMaterialProperty.prototype, {
	color: Cesium.createPropertyDescriptor("color"),
	speed: Cesium.createPropertyDescriptor("speed"),
	image: Cesium.createPropertyDescriptor("image"),
	repeat: Cesium.createPropertyDescriptor("repeat"),
	axisY: Cesium.createPropertyDescriptor("axisY"),
	image2: Cesium.createPropertyDescriptor("image2"),
	color2: Cesium.createPropertyDescriptor("color2"),
	hasImage2: Cesium.createPropertyDescriptor("hasImage2"),
});

export default LineFlowMaterialProperty;
