/*
 * 编辑点方法
 */
import { getCatesian3FromPX, lockingMap } from "./plotCommon";
import * as Cesium from "cesium";

function EditPoint(viewer,entity, handler, collection) {
	// const viewer = window.viewer;
	entity.show = false;
	const editItem = collection.find((ele) => {
		return ele.id === entity.id;
	});
	let editEntity;
	let updatePos = entity._position._value;//.getValue()
	if (editItem) {
		editEntity = editItem.target;
		editEntity.show = true;
		editEntity.position = new Cesium.CallbackProperty(() => {
			return updatePos;
		}, false);
	} else {
		const newPoint = Cesium.clone(entity.point, false);
		newPoint.color = Cesium.Color.RED.withAlpha(0.4);
		newPoint.pixelSize = 10;
		editEntity = viewer.entities.add({
			GeoType: "EditPoint",
			Editable: true,
			id: "edit_" + entity.id,
			position: new Cesium.CallbackProperty(() => {
				return updatePos;
			}, false),
			point: newPoint,
		});
		collection.push({
			id: entity.id,
			source: entity,
			target: editEntity,
			geoType: "point",
		});
	}
	let boolDown = false;
	// 左键摁下事件
	handler.setInputAction((event) => {
		let pick = viewer.scene.pick(event.position);
		if (Cesium.defined(pick) && pick.id) {
			const pickEntity = pick.id;
			if (pickEntity.id === editEntity.id) {
				boolDown = true;
				lockingMap(viewer, false);
			}
		}
	}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
	// 鼠标移动事件
	handler.setInputAction((movement) => {
		if (!boolDown) {
			return;
		}
		// console.log("鼠标移动事件监测：------点编辑中------");
		const endPos = getCatesian3FromPX(viewer, movement.endPosition);
		if (endPos) {
			updatePos = endPos;
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	// 左键抬起事件
	handler.setInputAction(() => {
		entity.position = editEntity.position.getValue();
		boolDown = false;
		entity.show = true;
		editEntity.show = false;
		lockingMap(viewer, true);
		// handler.destroy();
	}, Cesium.ScreenSpaceEventType.LEFT_UP);
}
export default EditPoint;
