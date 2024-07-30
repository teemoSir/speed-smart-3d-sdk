/*
 * 编辑多边形方法
 */
import { lockingMap, newSessionid } from "./plotCommon";
import * as Cesium from "cesium";

function EditPolygon(viewer,entity, handler, collection) {
	// const viewer = window.viewer;
	let editItem = collection.find((ele) => {
		return ele.id === entity.id;
	});
	let editEntity
	let sourcePositions = entity.polygon.hierarchy.getValue().positions;
	let updatePositions = Cesium.clone(sourcePositions);
	entity.show = false;
	let dynamicHierarchy = new Cesium.CallbackProperty(() => {
		return new Cesium.PolygonHierarchy(updatePositions);
	}, false);
	if (editItem) {
		editEntity = editItem.target;
		editEntity.show = true;
		editEntity.polygon.hierarchy = dynamicHierarchy;
		editItem.processEntities = initVertexEntities();
	} else {
		const newPolygon = Cesium.clone(entity.polygon);
		newPolygon.material = Cesium.Color.RED.withAlpha(0.4);
		newPolygon.hierarchy = dynamicHierarchy;
		editEntity = viewer.entities.add({
			GeoType: "EditPolygon",
			Editable: true,
			id: "edit_" + entity.id,
			polygon: newPolygon,
		});
		const vertexs = initVertexEntities();
		collection.push({
			id: entity.id,
			source: entity,
			target: editEntity,
			geoType: "polygon",
			processEntities: vertexs,
		});
	}
	let boolDown = false; //鼠标左键是否处于摁下状态
	let currentPickVertex = undefined; //当前选择的要编辑的节点
	let currentPickPolygon= undefined; //当前选择的要移动的多边形
	// 左键摁下事件
	handler.setInputAction((event) => {
		boolDown = true;
		let pick = viewer.scene.pick(event.position);
		if (Cesium.defined(pick) && pick.id) {
			const pickEntity = pick.id;
			if (!pickEntity.GeoType || !pickEntity.Editable) {
				return;
			}
			if (pickEntity.GeoType === "PolygonEditPoints") {
				lockingMap(viewer, false);
				currentPickVertex = pickEntity;
			} else if (pickEntity.GeoType === "EditPolygon") {
				lockingMap(viewer, false);
				currentPickPolygon = pickEntity;
			}
		}
	}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
	// 鼠标移动事件
	handler.setInputAction(function (event) {
		console.log("鼠标移动事件监测：------多边形编辑中------");
		if (boolDown && currentPickVertex) {
			let pos = viewer.scene.pickPosition(event.endPosition);
			updatePositions[currentPickVertex.description.getValue()] = pos;
		}
		if (boolDown && currentPickPolygon) {
			let startPosition = viewer.scene.pickPosition(event.startPosition);
			let endPosition = viewer.scene.pickPosition(event.endPosition);
			let changed_x = endPosition.x - startPosition.x;
			let changed_y = endPosition.y - startPosition.y;
			let changed_z = endPosition.z - startPosition.z;
			updatePositions.forEach((element) => {
				element.x = element.x + changed_x;
				element.y = element.y + changed_y;
				element.z = element.z + changed_z;
			});
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	// 左键抬起事件
	handler.setInputAction(() => {
		entity.polygon.hierarchy = editEntity.polygon.hierarchy;
		boolDown = false;
		currentPickVertex = undefined;
		currentPickPolygon = undefined;
		lockingMap(viewer, true);
	}, Cesium.ScreenSpaceEventType.LEFT_UP);
	// 左键点击事件
	handler.setInputAction((event) => {
		let pick = viewer.scene.pick(event.position);
		if (Cesium.defined(pick) && pick.id) {
			if (pick.id.GeoType === "PolygonEditCenterPoints") {
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
			if (pick.id.GeoType === "PolygonEditPoints") {
				if (updatePositions.length < 4) {
					alert("多边形节点数不能少于3个");
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
			add
				? updatePositions.splice(index, 0, pos)
				: updatePositions.splice(index, 1);
			item.processEntities = initVertexEntities();
		}
	}
	function initVertexEntities() {
		let vertexPointsEntity = []; //中途创建的Point对象
		let centerPointsEntity = []; //中途创建的虚拟Point对象
		for (let index = 0; index < updatePositions.length; index++) {
			let point = viewer.entities.add({
				id: "edit_" + newSessionid(),
				position: new Cesium.CallbackProperty(function () {
					return updatePositions[index];
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
			point.GeoType = "PolygonEditPoints";
			point.Editable = true;
			vertexPointsEntity.push(point);

			let centerPoint = viewer.entities.add({
				id: "edit_" + newSessionid(),
				position: new Cesium.CallbackProperty(() => {
					let endPos = updatePositions[index + 1]
						? updatePositions[index + 1]
						: updatePositions[0];
					return Cesium.Cartesian3.midpoint(
						updatePositions[index],
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
			centerPoint.GeoType = "PolygonEditCenterPoints";
			centerPoint.Editable = true;
			centerPointsEntity.push(centerPoint);
		}
		let processEntities = vertexPointsEntity.concat(centerPointsEntity);
		return processEntities;
	}
}

export default EditPolygon;
