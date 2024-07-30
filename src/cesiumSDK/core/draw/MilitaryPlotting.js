/*
 * 标绘主类
 */
import * as Creator from "./CreateIndex";
import CreateRemindertip from "./ReminderTip";
import ObjectEdit from "./EditIndex";
import * as Cesium from "cesium";


class MilitaryPlotting {

	constructor(viewer) {
		if (!viewer) throw new Error("no viewer object!");
		this.viewer = viewer;
		this.resultObject = {
			point: [], //点Entity集合
			billboard: [], //广告牌Entity集合
			lineArrow: [], //简单箭头Entity集合
			swallowtailArrow: [], //燕尾箭头Entity集合
			rightAngleArrow: [], //直角箭头Entity集合
			roundRectangle: [], //圆角矩形Entity集合
			sector: [], //扇形Entity集合
			bow: [], //弓形Entity集合
			pincerArrow: [], //钳击箭头Entity集合
			attackArrow: [], //进攻箭头Entity集合
			stagingArea: [], //集结地Entity集合
			flag: [], //旗标Entity集合
			freeLine: [], //自由线Entity集合
			polyline: [], //折线Entity集合
			curve: [], //圆滑曲线Entity集合
			freePolygon: [], //自由面Entity集合
			polygon: [], //多边形Entity集合
			regularPolygon: [], //正多边形Entity集合
		};
		this.handler = undefined;
		this.edit = new ObjectEdit(viewer);
	}
	/**
	 * 绘制点
	 * @param options - 参数，不传参为{}
	 * @param callback - 回调函数
	 */
	DrawPoint(options, callback) {
		this.initHandler();
		Creator.CreatePoint(
			this.viewer,
			this.handler,
			this.resultObject.point,
			options,
			callback
		);
	}
	/**
	 * 绘制折线
	 * @param options - 参数，不传参为{}
	 * @param callback  回调函数
	 */
	DrawPolyline(options, callback) {
		this.initHandler();
		Creator.CreatePolyline(
			this.viewer,
			this.handler,
			this.resultObject.polyline,
			options,
			callback
		);
	}
	/**
	 * 绘制多边形
	 * @param options - 参数，不传参为{}
	 * @param callback  回调函数
	 */
	DrawPolygon(options, callback) {
		this.initHandler();
		Creator.CreatePolygon(
			this.viewer,
			this.handler,
			this.resultObject.polygon,
			options,
			callback
		);
	}
	/**
	 * 绘制广告版
	 * @param options - 参数，不传参为{}
	 * @param callback  回调函数
	 */
	DrawBillboard(options, callback) {
		this.initHandler();
		Creator.CreateBillboard(
			this.viewer,
			this.handler,
			this.resultObject.billboard,
			options,
			callback
		);
	}
	/**
	 * 绘制圆滑曲线
	 * @param options - 参数，不传参为{}
	 * @param callback  回调函数
	 */
	DrawCurve(options, callback) {
		this.initHandler();
		Creator.CreateCurve(
			this.viewer,
			this.handler,
			this.resultObject.curve,
			options,
			callback
		);
	}
	/**
	 * 绘制自由线
	 * @param options - 参数，不传参为{}
	 * @param callback  回调函数
	 */
	DrawFreeLine(options, callback) {
		this.initHandler();
		Creator.CreateFreeLine(
			this.viewer,
			this.handler,
			this.resultObject.freeLine,
			options,
			callback
		);
	}
	/**
	 * 绘制正多边形
	 * @param options - 参数，不传参为{}
	 * @param callback  回调函数
	 */
	DrawRegularPolygon(options, callback) {
		this.initHandler();
		Creator.CreateRegularPolygon(
			this.viewer,
			this.handler,
			this.resultObject.regularPolygon,
			options,
			callback
		);
	}
	/**
	 * 初始化handler句柄
	 */
	initHandler() {
		if (this.handler) {
			CreateRemindertip(window.toolTip, null, false);
			//this.handler.destroy();
		}
		this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
	}
	/**
	 * 清除所有创建的对象
	 */
	clearAll() {
		for (const key in this.resultObject) {
			if (Object.hasOwnProperty.call(this.resultObject, key)) {
				const element = this.resultObject[key];
				for (let index = 0; index < element.length; index++) {
					const el = element[index];
					this.viewer.entities.remove(el);
					element.splice(index, 1);
					index -= 1;
				}
			}
		}
	}
	/**
	 * 注销
	 */
	destroy() {
		this.initHandler();
		this.handler.destroy();
		this.clearAll();
	}
}
export default MilitaryPlotting;
