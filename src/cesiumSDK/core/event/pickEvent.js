import SpeedEvent from "./base/speedEvent";
import * as Cesium from "cesium";
import { ElMessage } from "element-plus"

/**
 * 地球、地形、模型点击点坐标事件
 */
class PickEvent extends SpeedEvent {

	constructor(options) {
		super(options);
		let speedViewer = options.speedViewer;
		this._viewer = speedViewer._viewer;
		const viewer = this._viewer;
		this._handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
	}

	_viewer;
	_handler;
	points = [];

	pickPoint(options) {
		let that = this;
		that.points = [];
		this._handler.setInputAction(function (event) {
			if(that.points.length==0){
				//let point = that.definePick(event.position);
                let point = that.definePick(event);
				that.points.push(point);
                options.success(that.points);
			}else if(that.points.length==1){
				ElMessage.info("已有观察点，请选择目标点");
                //let point = that.definePick(event.position);
                let point = that.definePick(event);
                that.points.push(point);
                options.success(that.points);
			}
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

		// this._handler.setInputAction(function (event) {
		// 	if(that._handler){
		// 		that._handler.destroy();
		// 	}
		// 	let point = that.definePick(event.position);
		// 	that.points.push(point);
		// 	options.success(that.points);
		// }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
	}

	definePick(e) {
		/**
		 * 1. 判断是否在模型上，且是第一个模型穿透点
		 * 2. 判断是否在地形上
		 * 3. 默认在地球上
		 */
		// let on3DT = false;
		// let onTerrain = false;
		// let cartesian3 = undefined;

		// const pick = this._viewer.scene.drillPick(position, 1);

		// if (
		// 	(pick && pick.primitive instanceof Cesium.Cesium3DTileFeature) ||
		// 	(pick && pick.primitive instanceof Cesium.Cesium3DTileset) ||
		// 	(pick && pick.primitive instanceof Cesium.Model)
		// ) {
		// 	on3DT = true;
		// 	cartesian3 = this._viewer.scene.pickPosition(position);
		// }

		// let terrain =
		// 	this._viewer.terrainProvider instanceof Cesium.TerrainProvider ||
		// 	this._viewer.terrainProvider instanceof
		// 		Cesium.EllipsoidTerrainProvider ||
		// 	this._viewer.terrainProvider instanceof
		// 		Cesium.CesiumTerrainProvider ||
		// 	this._viewer.terrainProvider instanceof
		// 		Cesium.VRTheWorldTerrainProvider ||
		// 	this._viewer.terrainProvider instanceof
		// 		Cesium.GoogleEarthEnterpriseTerrainProvider;

		// console.log(terrain, this._viewer.terrainProvider);

		// if (!on3DT && !onTerrain && terrain) {
		// 	let ray = this._viewer.scene.camera.getPickRay(position);
		// 	if (!ray) return null;
		// 	cartesian3 = this._viewer.scene.globe.pick(ray, this._viewer.scene);
		// 	onTerrain = true;
		// }

		// if (!on3DT && !onTerrain && !terrain) {
		// 	cartesian3 = this._viewer.scene.camera.pickEllipsoid(
		// 		position,
		// 		this._viewer.scene.globe.ellipsoid
		// 	);
		// }


           // 地形高度
           let ray = this._viewer.camera.getPickRay(e.position);
           let cartesian3 = this._viewer.scene.globe.pick(ray, this._viewer.scene);
   
           // 模型高度
           let pick = this._viewer.scene.pickPosition(e.position);
           let pickModel = this._viewer.scene.pick(e.position);
   
           if (pickModel && pick && !pickModel.id) {
            let height = Cesium.Cartographic.fromCartesian(pick).height;
            let lat = Cesium.Math.toDegrees(
               Cesium.Cartographic.fromCartesian(pick).latitude
             );
             let lng = Cesium.Math.toDegrees(
               Cesium.Cartographic.fromCartesian(pick).longitude
             );
             // 加入偏移避免嵌入模型
             cartesian3 = Cesium.Cartesian3.fromDegrees(lng, lat, height+0.1);
           }

		return cartesian3;
	}
}

export default PickEvent;
