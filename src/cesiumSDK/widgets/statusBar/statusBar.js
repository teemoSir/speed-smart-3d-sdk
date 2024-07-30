import * as Cesium from "cesium";
import Speed from '../../core/speed'
import { zepto } from "../../core/util/zepto";
import * as _util from "../../core/util/util";
import * as point from "../../core/util/point";
import * as pointconvert from "../../core/util/pointconvert";


/**
 * 状态栏控件
 */

class statusBar extends Speed {
	constructor(viewer, options) {
		super(viewer, options)
		if (!viewer) return

		this.viewer = viewer
		this.options = options
		this.format =
			options.template ||
			"<div>经度：{x}</div> <div>纬度：{y}</div> <div>层级：{level}</div> <div>海拔：{z}米</div> <div>方向：{heading}°</div> <div>俯仰角：{pitch}°</div>  <div>视高：{height}米</div>";

		var containerid = viewer._container.id + "-speed-statusBar";

		var inhtml = '<div id="' +
		containerid +
		'" class="speed-statusBar" ><div class="speed-statusBar-content"></div></div>';
		zepto("#" + viewer._container.id).append(inhtml);
		zepto("#" + viewer._container.id).css({
			position: "relative"
		})
		this._dom = zepto("#" + containerid);
		this._domContent = zepto(".speed-statusBar-content");
		// this._domContent = zepto("#" + containerid + " .speed-statusBar-content");

		if (options.style) this._dom.css(options.style);
		else {
			this._dom.css({
				position: "absolute",
				left: viewer.animation ? "170px" : "0",
				right: "0",
				bottom: viewer.timeline ? "25px" : "0",
				background: "rgba(28, 57, 77, 0.5)",
				color: "white",
				fontSize: "13px",
				padding: "3px 10px",
				minHeight: "25px",

			});
		}

		this.locationData = {};
		this.locationData.height = viewer.camera.positionCartographic.height.toFixed(1);
		this.locationData.heading = Cesium.Math.toDegrees(viewer.camera.heading).toFixed(0);
		this.locationData.pitch = Cesium.Math.toDegrees(viewer.camera.pitch).toFixed(0);

		this._visible = true;
		this.options.cacheTime = Cesium.defaultValue(this.options.cacheTime, 100);

		//帧率
		if (options.fps) {
			// 开启debugShowFramesPerSecond
			viewer.scene.debugShowFramesPerSecond = true;

			var timeTik = setInterval(() => {
				if (!viewer || !viewer.scene._performanceDisplay) return;
				clearInterval(timeTik);
				this.timeTik = null;

				var domFPS = zepto(".cesium-performanceDisplay");

				//修改样式
				domFPS.addClass("speed-statusBar-content").removeClass("cesium-performanceDisplay");

				//移除空节点
				domFPS.children(".cesium-performanceDisplay-throttled").remove();

				domFPS.css({
					float: "right",
					display: "flex",
					marginRight: "15px",
					marginLeft: "15px",
				})


				//添加到状态栏
				this._dom.append(domFPS);

			}, 500);
			this.timeTik = timeTik;
		}

		//鼠标移动事件
		this.initHandler()

		//相机移动结束事件
		viewer.scene.camera.moveEnd.addEventListener(this.updaeCamera, this);

		this._domContent.css({
			float: "right",
			display: "flex"
		})

	}

	/**
	 * 设置状态栏样式
	 * @param {Object} style -状态栏样式CSS代码
	 *
	 */
	css(style) {
		this._dom.css(style);
	}

	/**
	 * 添加鼠标移动事件
	 */
	initHandler() {
		const that = this
		this._handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
		const mouseOverHandler = function (movement) {
			if (that.moveTimer) {
				clearTimeout(that.moveTimer);
				delete that.moveTimer;
			}
			that.moveTimer = setTimeout(() => {
				delete that.moveTimer;
				if (!that._visible) return;
				var cartesian = point.getCurrentMousePosition(that.viewer.scene, movement.endPosition);
				if (!cartesian) return;

				var cartographic = Cesium.Cartographic.fromCartesian(cartesian);

				that.locationData.z = (cartographic.height / that.viewer.scene.globe.terrainExaggeration).toFixed(1);
				that.locationData.height = that.viewer.camera.positionCartographic.height.toFixed(1);
				that.locationData.heading = Cesium.Math.toDegrees(that.viewer.camera.heading).toFixed(0);
				that.locationData.pitch = Cesium.Math.toDegrees(that.viewer.camera.pitch).toFixed(0);

				const cameraH = that.viewer.camera.positionCartographic.height
				if (cameraH != that._prevCameraHeight) {
					var A = 40487.57;
					var B = 0.00007096758;
					var C = 91610.74;
					var D = -40467.74;
					that.locationData.level = Math.round(D + (A - D) / (1 + Math.pow(cameraH / C, B)))
					that._prevCameraHeight = cameraH;
				}

				var jd = Cesium.Math.toDegrees(cartographic.longitude);
				var wd = Cesium.Math.toDegrees(cartographic.latitude);
				var fixedLen;
				switch (that.options.crs) {
					default:
						//和地图一致的原坐标
						fixedLen = that.options.hasOwnProperty("toFixed") ? that.options.toFixed : 6;
						that.locationData.x = jd.toFixed(fixedLen);
						that.locationData.y = wd.toFixed(fixedLen);
						break;
					case "degree": //度分秒形式
						that.locationData.x = _util.formatDegree(jd);
						that.locationData.y = _util.formatDegree(wd);
						break;
					case "project": //投影坐标
						fixedLen = that.options.hasOwnProperty("toFixed") ? that.options.toFixed : 0;
						var mkt = pointconvert.cartesian2mercator([cartesian.x, cartesian.y]);
						that.locationData.x = mkt[0].toFixed(fixedLen);
						that.locationData.y = mkt[1].toFixed(fixedLen);
						break;
					case "wgs": //标准wgs84格式坐标
						fixedLen = that.options.hasOwnProperty("toFixed") ? that.options.toFixed : 6;
						var wgsPoint = that.viewer.mars.point2wgs({ x: jd, y: wd }); //坐标转换为wgs
						that.locationData.x = wgsPoint.x.toFixed(fixedLen);
						that.locationData.y = wgsPoint.y.toFixed(fixedLen);
						break;
					case "wgs-degree": //标准wgs84格式坐标
						var wgsPointD = that.viewer.mars.point2wgs({ x: jd, y: wd }); //坐标转换为wgs
						that.locationData.x = _util.formatDegree(wgsPointD.x);
						that.locationData.y = _util.formatDegree(wgsPointD.y);
						break;
				}
				var inhtml = _util.template(that.format, that.locationData);
				that._domContent.html(inhtml);

			}, that.options.cacheTime);
		}
		this._handler.setInputAction(
			mouseOverHandler,
			Cesium.ScreenSpaceEventType.MOUSE_MOVE
		)
	}

	/**
	 *	相机移动事件
	 */
	updaeCamera() {
		if (!this._visible) return;
		this.locationData.height = this.viewer.camera.positionCartographic.height.toFixed(1);
		this.locationData.heading = this.viewer.camera.heading==undefined?0: Cesium.Math.toDegrees(this.viewer.camera.heading).toFixed(0);
		this.locationData.pitch =this.viewer.camera.pitch==undefined?0: Cesium.Math.toDegrees(this.viewer.camera.pitch).toFixed(0);
		const cameraH = this.viewer.camera.positionCartographic.height
		if (cameraH != this._prevCameraHeight) {
			var A = 40487.57;
			var B = 0.00007096758;
			var C = 91610.74;
			var D = -40467.74;
			this.locationData.level = Math.round(D + (A - D) / (1 + Math.pow(cameraH / C, B)))
			this._prevCameraHeight = cameraH;
		}

		if (this.locationData.x == null) return;

		var inhtml = _util.template(this.format, this.locationData);

		this._domContent.html(inhtml);
	}

	closest(num) {
		const scaleList = [
			0.001,
			0.002,
			0.003,
			0.005,
			0.01,
			0.015,
			0.02,
			0.025,
			0.03,
			0.035,
			0.04,
			0.045,
			0.05,
			0.06,
			0.07,
			0.08,
			0.09,
			0.1,
			0.12,
			0.15,
			0.2,
			0.25,
			0.3,
			0.5,
			1,
			2,
			3,
			5,
			10,
			15,
			20,
			25,
			30,
			35,
			40,
			45,
			50,
			60,
			70,
			80,
			90,
			100,
			120,
			150,
			200,
			250,
			300,
			500,
			1000,
			2000,
			5000,
			10000,
			100000,
			500000,
			1000000
		]
		let ret = scaleList[0]
		let distance = Math.abs(ret - num)
		for (let i = 1; i < scaleList.length; i++) {
			let newDistance = Math.abs(scaleList[i] - num)
			if (newDistance < distance) {
				distance = newDistance
				ret = scaleList[i]
			}
		}
		return ret
	}
	showBar(value){
		this._visible = value;

		if (value) this._dom.show();
		else this._dom.hide();
	}


	//是否显示状态栏
	get show() {
		return this._visible;
	}
	set show(value) {
		this._visible = value;

		if (value) this._dom.show();
		else this._dom.hide();
	}

	/**
	 * 销毁
	 */
	destroy() {
		this._handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		this.viewer.scene.camera.moveEnd.removeEventListener(this.updaeCamera, this);

		if (this.options.fps) {
			this.viewer.scene.debugShowFramesPerSecond = false;
		}

		if (this.timeTik) {
			clearInterval(this.timeTik);
			this.timeTik = null;
		}

		this._dom.remove();

		//删除所有绑定的数据
		for (let i in this) {
			delete this[i];
		}
	}
}
export default statusBar
