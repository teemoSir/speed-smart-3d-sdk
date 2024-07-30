import * as Cesium from "cesium";
import CreateRemindertip from "./ReminderTip";
import { newSessionid, getCatesian3FromPX } from "./plotCommon";

function CreatePolygon(viewer, handler, resultList, options, callback) {
	const id = options.id || newSessionid();
	const onground = options.onground || true;
	if (viewer.entities.getById(id))
		throw new Error("the id parameter is an unique value");
	window.toolTip = "左键点击开始绘制";
	let anchorpoints = [];
	let polygon = undefined;
	// 左键点击事件
	handler.setInputAction((event) => {
		let pixPos = event.position;
		let cartesian = getCatesian3FromPX(viewer, pixPos);
		if (anchorpoints.length == 0) {
			window.toolTip = "左键添加第二个顶点";
			anchorpoints.push(cartesian);
			let dynamicPositions = new Cesium.CallbackProperty(function () {
				return new Cesium.PolygonHierarchy(anchorpoints);
			}, false);
			polygon = viewer.entities.add({
				name: "Polygon",
				id: id,
				polygon: {
					hierarchy: dynamicPositions,
					material: Cesium.Color.GREEN.withAlpha(0.4),
					outline: true,
					outlineColor: Cesium.Color.YELLOW,
					heightReference: onground
						? Cesium.HeightReference.CLAMP_TO_GROUND
						: Cesium.HeightReference.NONE,
				},
			});
			polygon.GeoType = "Polygon"; //记录对象的类型，用户后续编辑等操作
			polygon.Editable = true; //代表当前对象可编辑,false状态下不可编辑
		} else {
			window.toolTip = "左键添加点，右键撤销，左键双击完成绘制";
		}
		anchorpoints.push(cartesian);
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	// 鼠标移动事件
	handler.setInputAction((movement) => {
		let endPos = movement.endPosition;
		CreateRemindertip(window.toolTip, endPos, true);
		if (Cesium.defined(polygon)) {
			anchorpoints.pop();
			let cartesian = getCatesian3FromPX(viewer, endPos);
			anchorpoints.push(cartesian);
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	// 左键双击事件
	handler.setInputAction((event) => {
		anchorpoints.pop();
		anchorpoints.pop(); //因为是双击结束，所以要pop两次，一次是move的结果，一次是单击结果
		const hierarchyPos = new Cesium.PolygonHierarchy(anchorpoints);
		polygon.PottingPoint = Cesium.clone(hierarchyPos, true); //记录对象的节点数据，用户后续编辑等操作
		// polygon.PottingPoint = Cesium.clone(polygon.polygon.hierarchy); //记录对象的节点数据，用户后续编辑等操作
		resultList.push(polygon);
		handler.destroy();
		CreateRemindertip(window.toolTip, event.position, false);
		if (typeof callback == "function") callback(anchorpoints);
	}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
	// 右键摁下事件
	handler.setInputAction(() => {
		anchorpoints.pop();
	}, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
}

export default CreatePolygon;
