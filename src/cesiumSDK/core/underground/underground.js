import Speed from '../speed.js'
import * as Cesium from "cesium";

/**
 * 地下模式
 */
class underground extends Speed {

	/**
	 * 构造函数
	 * @param {*} viewer
	 *
	 */
	constructor(viewer) {
		super(viewer)
		this.viewer = viewer
		this.enabledGround=false
	}



	/**
	 * 开启地下模式（地表透明）
	 * @param {*} options
	 * @param {Number}[options.alphaVal] -透明度
	 *
	 */
	openUnderground(options) {
		//设置鼠标进去地下
		this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
		//设置地球透明
		this.viewer.scene.globe.translucency.enabled = true;
		let alphaVal = options != undefined && options.alphaVal!=undefined ? options.alphaVal : 0.5
		this.viewer.scene.globe.translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(
			1.5e2,
			alphaVal,
			8.0e6,
			1.0
		)
		this.enabledGround=true

	}

	/**
	 * 关闭地下模式（地表透明）
	 */
	closeUnderground() {
		this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;
		this.viewer.scene.globe.translucency.enabled = false;
		this.enabledGround=false
	}

	/**
	 * 更改地表透明度
	 */
	alphaChange(alphaVal) {
		if (this.enabledGround) {
			//设置透明度
			this.viewer.scene.globe.translucency.frontFaceAlphaByDistance.nearValue = alphaVal;
			this.viewer.scene.globe.translucency.frontFaceAlphaByDistance.farValue = alphaVal;
		}

	}


	/**
	 * 调整相机视角
	 */
	changeCameraView(opts) {
		this.viewer.camera.setView({
			destination: Cesium.Cartesian3.fromDegrees(opts.x, opts.y,opts.z),
			orientation: {
				heading: Cesium.Math.toRadians(opts.heading || 0), // 相机方向指向当地东向
				pitch: Cesium.Math.toRadians(opts.pitch || -90),    // 再将相机方向转向地心，此时Up方向指向当地东向
				roll: opts.roll || 0.0
			}
		});
	}


}
export default underground
