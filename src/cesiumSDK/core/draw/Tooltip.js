/*
 * 封装提示内容方法
 */
import CreateRemindertip from "./ReminderTip";

const ToolTip = {
	Point: "左键选择点进行编辑",
	Polyline: "左键点击折线进行编辑",
	Polygon: "左键点击多边形进行编辑",
	EditPoint: "点：左键摁下并拖动，左键抬起完成编辑",
	EditPolyline: "折线：左键摁下并拖动，左键抬起完成编辑",
	PolylineEditPoints: "折线节点：左键摁住拖动，右键删除，左键抬起完成编辑",
	PolylineEditCenterPoints: "折线虚拟中点：左键点击增加节点",
	EditPolygon: "多边形：左键摁下并拖动，左键抬起完成编辑",
	PolygonEditPoints: "多边形节点：左键摁住拖动，右键删除，左键抬起完成编辑",
	PolygonEditCenterPoints: "多边形虚拟中点：左键点击增加节点",
	Billboard: "左键点击广告牌进行编辑",
	EditBillboard: "广告牌：左键摁下并拖动，左键抬起完成编辑",
	Curve: "左键点击曲线进行编辑",
	EditCurve: "曲线：左键摁下并拖动，左键抬起完成编辑",
	CurveEditPoints: "曲线节点：左键摁住拖动，右键删除，左键抬起完成编辑",
	CurveEditCenterPoints: "曲线虚拟中点：左键点击增加节点",
	RegularPolygon: "左键点击正多边形进行编辑",
	EditRegularPolygon: "正多边形:左键摁下拖动，左键抬起完成编辑",
	RegularPolygonEditCenter: "正多边形中点：左键摁下拖动，左键抬起完成编辑",
	RegularPolygonEditEnd: "正多边形节点：左键摁下拖动，左键抬起完成编辑",
};
const showToolTip = (type,toolTip,pos,bool) => {
	if (type) {
		toolTip = ToolTip[type];
		CreateRemindertip(toolTip, pos, bool);
	} else {
		removeToolTip(toolTip);
	}
};
const removeToolTip = (toolTip) => {
	toolTip = "";
	CreateRemindertip(toolTip, null, false);
};

export { showToolTip, removeToolTip };
