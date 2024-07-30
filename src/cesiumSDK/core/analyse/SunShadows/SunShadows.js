import Analyse from "../base/analyse";
import * as Cesium from "cesium";




/**
 * 日照分析
 */
class SunShadows extends Analyse {

	/**
	 * 构造函数
	 * @param {*} viewer
	 * @param {*} options
	 */
	constructor(viewer) {
		super(viewer)
		this.viewer = viewer
	}

	/**
	 * 开启日照
	 * @param {*} options
	 * @param {Number}[options.darkness] -阴影透明度
	 * @param {Date}[options.startTime] -开始时间（例：2023-02-01 08:30:00）
	 * @param {Date}[options.stopTime] -结束时间
	 * @param {Date}[options.currentTime] -当前时间
	 */
	startShadows(options) {
		this.viewer.scene.globe.enableLighting = true//设置太阳光照
		this.viewer.shadows = true
		this.viewer.terrainShadows = Cesium.ShadowMode.ENABLED
		this.viewer.shadowMap.darkness = options != undefined && options.hasOwnProperty('darkness') ? options.darkness : 0.3//阴影透明度--越大越透明
		var myDate = new Date();
		var Y = myDate.getFullYear();
		var M = myDate.getMonth() + 1;
		var D = myDate.getDate();
		var date = Y + (M < 10 ? "-0" : "-") + M + (D < 10 ? "-0" : "-") + D;
		let start = options != undefined && options.hasOwnProperty('startTime') ? options.startTime : new Date(date + " 00:00:00")
		let stop = options != undefined && options.hasOwnProperty('stopTime') ? options.stopTime : new Date(date + " 23:59:59")
		let startTime = Cesium.JulianDate.addHours(Cesium.JulianDate.fromDate(start), -8, new Cesium.JulianDate())
		let stopTime = Cesium.JulianDate.addHours(Cesium.JulianDate.fromDate(stop), -8, new Cesium.JulianDate())
		if (Cesium.JulianDate.lessThan(stopTime, startTime)) {
			console.warn("操作无效，开始时间必须小于结束时间！")
		}
		let current = options != undefined && options.hasOwnProperty('currentTime') ? options.currentTime : new Date()
		let currentTime = Cesium.JulianDate.addHours(Cesium.JulianDate.now(current), -8, new Cesium.JulianDate())


		this.viewer.clock.startTime =startTime
		this.viewer.clock.stopTime =stopTime
		this.viewer.clock.currentTime = currentTime
		this.viewer.clock.multiplier = 1800//设定时间速率
		//设定clock范围为不断循环
		this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP

	}


	/**
	 * 关闭日照
	 */
	clearOpenLight() {
		this.viewer.scene.globe.enableLighting = false
		this.viewer.shadows = false
		this.viewer.terrainShadows = Cesium.ShadowMode.DISABLED
		this.viewer.clock.multiplier = 1.0

	}



}
export default SunShadows
