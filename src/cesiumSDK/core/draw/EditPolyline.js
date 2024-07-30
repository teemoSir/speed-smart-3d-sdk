/*
 * 编辑线方法
 */
import { lockingMap, newSessionid } from "./plotCommon";
import * as Cesium from "cesium";
function EditPolyline(viewer,entity, handler, collection) {
	// const viewer = window.viewer;
	let editItem = collection.find((ele) => {
		return ele.id === entity.id;
	});
	let editEntity;
	let sourcePos = entity.polyline.positions.getValue();
	let updatePos = Cesium.clone(sourcePos);
	entity.polyline.positions = updatePos;
	entity.show = false;
	let dynamicPos = new Cesium.CallbackProperty(() => {
		return updatePos;
	}, false);
	if (editItem) {
		editEntity = editItem.target;
		editEntity.show = true;
		editEntity.polyline.position = dynamicPos;
		editItem.processEntities = initVertexEntities();
	} else {
		const newPolyline = Cesium.clone(entity.polyline);
		newPolyline.material = Cesium.Color.RED.withAlpha(0.4);
		newPolyline.width = 10;
		newPolyline.positions = dynamicPos;
		editEntity = viewer.entities.add({
			GeoType: "EditPolyline",
			Editable: true,
			id: "edit_" + entity.id,
			polyline: newPolyline,
		});
		const vertexs = initVertexEntities();
		collection.push({
			id: entity.id,
			source: entity,
			target: editEntity,
			geoType: "polyline",
			processEntities: vertexs,
		});
	}
	let boolDown = false; //鼠标左键是否处于摁下状态
	let currentPickVertex = undefined; //当前选择的要编辑的节点
	let currentPickPolyline = undefined; //当前选择的要移动的折线
	handler.setInputAction((event) => {
		boolDown = true;
		let pick = viewer.scene.pick(event.position);
		if (Cesium.defined(pick) && pick.id) {
			const pickEntity = pick.id;
			if (!pickEntity.GeoType || !pickEntity.Editable) {
				return;
			}
			if (pickEntity.GeoType === "PolylineEditPoints") {
				lockingMap(viewer, false);
				currentPickVertex = pickEntity;
			} else if (pickEntity.GeoType === "EditPolyline") {
				lockingMap(viewer, false);
				currentPickPolyline = pickEntity;
			}
		}
	}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
	// 鼠标移动事件
	handler.setInputAction((event) => {
		// console.log("鼠标移动事件监测：------折线编辑中------");
		if (boolDown && currentPickVertex) {
			let pos = viewer.scene.pickPosition(event.endPosition);
			updatePos[currentPickVertex.description.getValue()] = pos;
		}
		if (boolDown && currentPickPolyline) {
			let startPosition = viewer.scene.pickPosition(event.startPosition);
			let endPosition = viewer.scene.pickPosition(event.endPosition);
			let changed_x = endPosition.x - startPosition.x;
			let changed_y = endPosition.y - startPosition.y;
			let changed_z = endPosition.z - startPosition.z;
			updatePos.forEach((element) => {
				element.x = element.x + changed_x;
				element.y = element.y + changed_y;
				element.z = element.z + changed_z;
			});
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	// 左键抬起事件
	handler.setInputAction(() => {
		entity.polyline.positions = editEntity.polyline.positions.getValue();
		boolDown = false;
		currentPickVertex = undefined;
		currentPickPolyline = undefined;
		lockingMap(viewer, true);
	}, Cesium.ScreenSpaceEventType.LEFT_UP);
	// 左键点击事件
	handler.setInputAction((event) => {
		let pick = viewer.scene.pick(event.position);
		if (Cesium.defined(pick) && pick.id) {
			if (pick.id.GeoType === "PolylineEditCenterPoints") {
				let index = pick.id.description.getValue() + 1;
				const pos = pick.id.position.getValue();
				updateProcessObj(true, index, pos);
			}
		}
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	//右键点击事件
	handler.setInputAction((event) => {
		let pick = viewer.scene.pick(event.position);
		if (Cesium.defined(pick) && pick.id) {
			if (pick.id.GeoType === "PolylineEditPoints") {
				if (updatePos.length < 3) {
					alert("折线节点数不能少于2个");
					return;
				}
				let index = pick.id.description.getValue();
				updateProcessObj(false, index);
			}
		}
	}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

	function updateProcessObj(add, index, pos) {
		const item = collection.find((ele) => {
			return ele.id === entity.id;
		});
		if (item && item.processEntities) {
			item.processEntities.forEach((entity) => {
				viewer.entities.remove(entity);
			});
			add ? updatePos.splice(index, 0, pos) : updatePos.splice(index, 1);
			item.processEntities = initVertexEntities();
		}
	}
	function initVertexEntities() {
		let vertexPointsEntity = []; //中途创建的Point对象
		let centerPointsEntity = []; //中途创建的虚拟Point对象
		for (let index = 0; index < updatePos.length; index++) {
			let point = viewer.entities.add({
				id: "edit_" + newSessionid(),
				position: new Cesium.CallbackProperty(function () {
					return updatePos[index];
				}, false),
				point: {
					pixelSize: 10,
					color: Cesium.Color.YELLOW.withAlpha(0.6),
					outlineWidth: 2,
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
					outlineColor: Cesium.Color.DARKRED.withAlpha(1),
				},
				show: true,
				description: index, //记录节点索引
			});
			point.GeoType = "PolylineEditPoints";
			point.Editable = true;
			vertexPointsEntity.push(point);
			if (updatePos[index + 1]) {
				let centerPoint = viewer.entities.add({
					id: "edit_" + newSessionid(),
					position: new Cesium.CallbackProperty(function () {
						let endPos = updatePos[index + 1];
						return Cesium.Cartesian3.midpoint(
							updatePos[index],
							endPos,
							new Cesium.Cartesian3()
						);
					}, false),
					point: {
						pixelSize: 10,
						color: Cesium.Color.GREEN.withAlpha(1),
						outlineWidth: 2,
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
						outlineColor: Cesium.Color.YELLOW.withAlpha(0.6),
					},
					show: true,
					description: index, //记录节点索引
				});
				centerPoint.GeoType = "PolylineEditCenterPoints";
				centerPoint.Editable = true;
				centerPointsEntity.push(centerPoint);
			}
		}
		let processEntities = vertexPointsEntity.concat(centerPointsEntity);
		return processEntities;
	}
}
export default EditPolyline
