/**
 * 绘制点线面
*/
import * as Cesium from "cesium";
import CreateRemindertip from "./ReminderTip";

export default class DrawTool {
    /**
     * 构造函数
     * @param viewer
     */
    constructor(viewer) {
        this.viewer = viewer;
        this._drawHandler = null;//事件
        this._dataSource = null;//存储entities
        this._tempPositions = [];//存储点集合
        this._mousePos = null;//移动点
        this._drawType = null;//类型

        this.currentPoint = null//当前移动点
        this.isEditting = false;//是否编辑状态
        this.gatherPoint = null;//标记点
        this.pointsId = [];
        this.halfPointsId = [];
        this.handler = null;
        this.currentPolyline = null;
    }

    /**
     * 激活点线面
     * @param drawType
     */
    activate(drawType,callback) {
        this.clearAll();
        this._drawType = drawType;
        this._dataSource = new Cesium.CustomDataSource('_dataSource');
        this.viewer.dataSources.add(this._dataSource);
        this._registerEvents(callback); //注册鼠标事件
    }

    /**
     * 注册鼠标事件
     */
    _registerEvents(callback) {
        this._drawHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.viewer.scene.globe.depthTestAgainstTerrain = true;//开启深度测试
		window.toolTip = "左键点击开始绘制";
        switch (this._drawType) {
            case 'point': {
                this._leftClickEventForPoint(callback);
                break;
            }
            case 'polyline': {
                this._leftClickEventForPolyline();
                this._mouseMoveEventForPolyline();
                this._doubleClickEventForPolyline(callback);
                break;
            }
            case 'polygon': {
                this._leftClickEventForPolygon();
                this._mouseMoveEventForPolygon();
                this._doubleClickEventForPolygon(callback);
				this._rightClickEventForPolygon()
                break;
            }
        }
    }

    /**
     * 鼠标事件之绘制点的左击事件
     */
    _leftClickEventForPoint() {
        this._drawHandler.setInputAction((e) => {
            let p = this.viewer.scene.pickPosition(e.position)
            if (!p) return;
            let carto_pt = Cesium.Cartographic.fromCartesian(p);
            let p1 = [Cesium.Math.toDegrees(carto_pt.longitude), Cesium.Math.toDegrees(carto_pt.latitude), carto_pt.height]
            this._addPoint(p1);
			this.viewer._container.style.cursor = "default";
            this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }

    /**
     * 鼠标事件之绘制线的左击事件
     */
    _leftClickEventForPolyline() {
        this._drawHandler.setInputAction((e) => {
            let p = this.viewer.scene.pickPosition(e.position);
            if (!p) return;
            this._tempPositions.push(p);
            this._addPolyline();
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }

    /**
     * 鼠标事件之绘制线的移动事件
     */
    _mouseMoveEventForPolyline() {
        this._drawHandler.setInputAction((e) => {
            let p = this.viewer.scene.pickPosition(e.endPosition);
            if (!p) return;
            this._mousePos = p;
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

    /**
     * 鼠标事件之绘制线的右击事件
     */
    _doubleClickEventForPolyline() {
        this._drawHandler.setInputAction((e) => {
            let p = this.viewer.scene.pickPosition(e.position);
            if (!p) return;
            this._removeAllEvent();
            this._dataSource.entities.removeAll();
            this._dataSource.entities.add({
                polyline: {
                    name: "polyline",
                    positions: this._tempPositions,
                    clampToGround: true,//贴地
                    width: 2,
                    material: Cesium.Color.YELLOW.withAlpha(0.5)
                }
            })
			this.viewer._container.style.cursor = "default";

        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    }

    /**
     * 鼠标事件之绘制面的左击事件
     */
    _leftClickEventForPolygon() {
        this._drawHandler.setInputAction((e) => {
			window.toolTip = "左键添加点，右键撤销，左键双击完成绘制";
            let p = this.viewer.scene.pickPosition(e.position);
            if (!p) return;
            this._tempPositions.push(p);
            this._addPolygon();
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }

    /**
     * 鼠标事件之绘制面的移动事件
     */
    _mouseMoveEventForPolygon() {
        this._drawHandler.setInputAction((e) => {
			let endPos = e.endPosition;
			CreateRemindertip(window.toolTip, endPos, true);
            let p = this.viewer.scene.pickPosition(e.endPosition);
            if (!p) return;
            this._mousePos = p;
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

    /**
     * 鼠标事件之绘制面的右击事件
     */
    _doubleClickEventForPolygon(callback) {
        this._drawHandler.setInputAction((e) => {
			this._tempPositions.pop();
            let p = this.viewer.scene.pickPosition(e.position);
            if (!p) return;
            this._tempPositions.push((this._tempPositions)[0])
            this._removeAllEvent();
            this._dataSource.entities.removeAll();
            this._dataSource.entities.add({
                polyline: {
                    name: "polyline",
                    positions: this._tempPositions,
                    clampToGround: true,//贴地
                    width: 2,
                    material: Cesium.Color.YELLOW.withAlpha(0.5)
                },
                polygon: {
                    name: "polygon",
                    hierarchy: this._tempPositions,
                    extrudedHeightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    material: Cesium.Color.GREEN.withAlpha(0.4),
                    clampToGround: true,
                },
            })
			CreateRemindertip(window.toolTip, e.position, false);
			this.viewer._container.style.cursor = "default";
			if (typeof callback == "function") callback(this._tempPositions);

        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    }
	_rightClickEventForPolygon() {
        this._drawHandler.setInputAction(() => {
            this._tempPositions.pop();
        }, Cesium.ScreenSpaceEventType.RIGHT_DOWN)
    }

    /**
     * 移除所有鼠标事件
     */
    _removeAllEvent() {
        this._drawHandler && (
            this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK),
            this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE),
            this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK),
            this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_DOWN),
            this._drawHandler.destroy(),
            this._drawHandler = null
        )
    }

    /**
     * 重置所有参数
     */
    _resetParams() {
        if (this._dataSource != null) {
            this._dataSource.entities.removeAll();
            this.viewer.dataSources.remove(this._dataSource);
        }
        this._dataSource = null;
        this._tempPositions = [];
        this._mousePos = null;
        this._drawType = null;
    }

    /**
     * 清除
     */
    clearAll() {
        this._removeAllEvent();
        this._resetParams();
		CreateRemindertip(window.toolTip, undefined, false);
    }



    /**
     * 画点
     * @param p
     */
    _addPoint(p) {
        this.gatherPoint = this._dataSource.entities.add({
            name: "point",
            position: Cesium.Cartesian3.fromDegrees(p[0], p[1], p[2]),
            point: {
                color: Cesium.Color.RED,
                pixelSize: 10,
                outlineColor: Cesium.Color.YELLOW,
                outlineWidth: 2,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,//获取或设置与相机的距离，在该距离处禁用深度测试，例如，防止对地形进行裁剪。当设置为零时，始终应用深度测试。当设置为 Number.POSITIVE_INFINITY 时，永远不会应用深度测试。
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        })
    }

    /**
     * 画线
     */
    _addPolyline() {
        this._dataSource.entities.add({
            polyline: {
                name: "polyline",
                positions: new Cesium.CallbackProperty(() => {
                    let c = Array.from((this._tempPositions));
                    if (this._mousePos) {
                        c.push(this._mousePos);
                    }
                    return c;
                }, false),
                clampToGround: true,//贴地
                width: 3,
                material: Cesium.Color.YELLOW
            }
        })
    }

    /**
     * 画面
     */
    _addPolygon() {
        if (this._tempPositions.length == 1) {
            //一个顶点+移动点
            this._dataSource.entities.add({
                polyline: {
                    name: "polyline",
                    positions: new Cesium.CallbackProperty(() => {
                        let c = Array.from((this._tempPositions));
                        if (this._mousePos) {
                            c.push(this._mousePos);
                        }
                        return c;
                    }, false),
                    clampToGround: true,//贴地
                    width: 3,
                    material: Cesium.Color.YELLOW
                }
            })
        } else {
            this._dataSource.entities.removeAll();
            //两个顶点+移动点
            this._dataSource.entities.add({
                polygon: {
                    name: "polygon",
                    hierarchy: new Cesium.CallbackProperty(() => {
                        let poss = Array.from(this._tempPositions);
                        if (this._mousePos) {
                            poss.push(this._mousePos);
                        }
                        return new Cesium.PolygonHierarchy(poss);
                    }, false),
                    extrudedHeightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    material: Cesium.Color.GREEN.withAlpha(0.4),
                    clampToGround: true,
                },
                polyline: {
                    name: "polyline",
                    positions: new Cesium.CallbackProperty(() => {
                        let c = Array.from((this._tempPositions));
                        if (this._mousePos) {
                            c.push(this._mousePos);
                            c.push(c[0]);//与第一个点相连
                        }
                        return c;
                    }, false),
                    clampToGround: true,//贴地
                    width: 2,
                    material: Cesium.Color.YELLOW.withAlpha(0.5)
                }
            })
        }

    }


    startEdit() {
		this.viewer._container.style.cursor = "pointer";

        //去掉双击事件
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        //限制地图操作
        this.viewer.scene.screenSpaceCameraController.enableRotate = false;
        this.viewer.scene.screenSpaceCameraController.enableZoom = false;
        this._drawHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        //鼠标点击事件
        this._drawHandler.setInputAction((event) => {
            let windowPosition = event.position;
            let pickedObject = this.viewer.scene.pick(windowPosition);
            if (Cesium.defined(pickedObject)) {

                let entity = pickedObject.id;
                if (entity.name == "point" && !this.isEditting) {
                    this.currentPoint = entity;
                    // this.currentPoint.point.color = Cesium.Color.GREEN;
                    this.isEditting = true;
                }
                if (entity.polyline != undefined && !this.isEditting) {
                    this.currentPolyline = entity;
                    // 生成编辑点
                    var cartesianArr = this.currentPolyline.polyline.positions.getValue();
                    for (var i = 0; i < cartesianArr.length; i++) {
                        var cartesian = cartesianArr[i];
                        var point = this.viewer.entities.add({
                            name: "polyline_point",
                            position: cartesian,
                            point: {
                                color: Cesium.Color.AQUA,
                                pixelSize: 8,
                                outlineColor: Cesium.Color.BLACK,
                                outlineWidth: 1,
                                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,//贴地
                            }
                        });
                        this.pointsId.push(point.id);
                    }

                    //生成half采集点
                    for (var i = 0; i < cartesianArr.length - 1; i++) {
                        var halfX = (cartesianArr[i].x + cartesianArr[i + 1].x) / 2;
                        var halfY = (cartesianArr[i].y + cartesianArr[i + 1].y) / 2;
                        var halfZ = (cartesianArr[i].z + cartesianArr[i + 1].z) / 2;
                        var cartesian = new Cesium.Cartesian3(halfX, halfY, halfZ);
                        var pointEntity = {
                            name: "polyline_half_point",
                            position: cartesian,
                            point: {
                                color: Cesium.Color.AQUA,
                                pixelSize: 8,
                                outlineColor: Cesium.Color.BLACK,
                                outlineWidth: 1,
                                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,//贴地
                            },
                        };
                        pointEntity.positionFlag = [i, i + 1];
                        var point = this.viewer.entities.add(pointEntity);
                        this.halfPointsId.push(point.id);
                    }
                    this.isEditting = true;
                    this.viewer.scene.screenSpaceCameraController.enableRotate = false;
                    this.viewer.scene.screenSpaceCameraController.enableZoom = false;
                } else if (entity.name === "polyline_point") {
                    this.currentPoint = entity;
                } else if (entity.name === "polyline_half_point") {
                    //线半点变线上（点击变颜色）
                    //线上的中心点移动：更新points
                    let ellipsoid = this.viewer.scene.globe.ellipsoid;
                    let cartesian = this.viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
                    if (!cartesian) {
                        return;
                    }
                    var entityTemp = {
                        name: "polyline_point",
                        position: cartesian,
                        point: {
                            color: Cesium.Color.AQUAMARINE,
                            pixelSize: 8,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 1,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,//贴地
                        }
                    };
                    var point = this.viewer.entities.add(entityTemp);
                    this.currentPoint = point;
                    //线半点变成线上点
                    this.pointsId.splice(entity.positionFlag[0] + 1, 0, point.id);
                    //删除所有线半点
                    for (var i = 0; i < this.halfPointsId.length; i++) {
                        this.viewer.entities.remove(this.viewer.entities.getById(this.halfPointsId[i]));
                    }
                    this.halfPointsId = [];
                    //重新生成所有线半点
                    //console.log("pointsId",pointsId);
                    for (var i = 0; i < this.pointsId.length - 1; i++) {
                        var oneTemp = this.viewer.entities.getById(this.pointsId[i]).position._value;
                        var twoTemp = this.viewer.entities.getById(this.pointsId[i + 1]).position._value;
                        var halfX = (oneTemp.x + twoTemp.x) / 2;
                        var halfY = (oneTemp.y + twoTemp.y) / 2;
                        var halfZ = (oneTemp.z + twoTemp.z) / 2;
                        var cartesianHalf = new Cesium.Cartesian3(halfX, halfY, halfZ);
                        var pointEntity = {
                            name: "polyline_half_point",
                            position: cartesianHalf,
                            point: {
                                color: Cesium.Color.RED,
                                pixelSize: 8,
                                outlineColor: Cesium.Color.BLACK,
                                outlineWidth: 1,
                                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,//贴地
                            },
                        };
                        pointEntity.positionFlag = [i, i + 1];
                        var point = this.viewer.entities.add(pointEntity);
                        this.halfPointsId.push(point.id);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        // 对鼠标移动事件的监听
        this._drawHandler.setInputAction((event) => {
            if (this.isEditting && this.currentPoint && this.currentPoint.name == "point") {
                //获取加载地形后对应的经纬度和高程：地标坐标
                var ray = this.viewer.camera.getPickRay(event.endPosition);
                var cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
                if (!cartesian) {
                    return;
                }
                this.currentPoint.position = cartesian;
                this.gatherPoint.positions = new Cesium.CallbackProperty(function (time, result) {
                    return this.currentPoint.position;
                }, false);
            }
            if (this.isEditting && this.currentPoint && this.currentPoint.name == "polyline_point") {
                //线上的点
                //获取加载地形后对应的经纬度和高程：地标坐标
                var ray = this.viewer.camera.getPickRay(event.endPosition);
                var cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
                let points = [];
                if (!cartesian) {
                    return;
                }
                this.currentPoint.position = cartesian;
                for (var i = 0; i < this.pointsId.length; i++) {
                    if (this.currentPoint.id == this.pointsId[i]) {
                        points.push(this.currentPoint.position._value);
                    } else {
                        var id = this.pointsId[i];
                        points.push(this.viewer.entities.getById(id).position._value);
                    }
                }
                this.currentPolyline.polyline.positions = new Cesium.CallbackProperty(function (time, result) {
                    //更新线上中心点位置信息
                    for (var i = 0; i < this.halfPointsId.length; i++) {
                        var entityTemp = this.viewer.entities.getById(this.halfPointsId[i]);
                        if (typeof (entityTemp) != "undefined") {
                            var oneTemp = entityTemp.positionFlag[0];
                            var twoTemp = entityTemp.positionFlag[1];
                            if (typeof (points[oneTemp]) != "undefined" && typeof (points[twoTemp]) != "undefined") {
                                var halfX = (points[oneTemp].x + points[twoTemp].x) / 2;
                                var halfY = (points[oneTemp].y + points[twoTemp].y) / 2;
                                var halfZ = (points[oneTemp].z + points[twoTemp].z) / 2;
                                var cartesian = new Cesium.Cartesian3(halfX, halfY, halfZ);
                                entityTemp.position = cartesian;
                            }
                        }
                    }
                    return points;
                }, false);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 对鼠标抬起事件的监听(结束点采集)
        this._drawHandler.setInputAction((event) => {
            //this.isEditting = false;
            this.currentPoint = undefined;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
    }

    stopEdit() {
        //this.gatherPoint.point.color = Cesium.Color.CHARTREUSE.withAlpha(1);
        this.viewer.scene.screenSpaceCameraController.enableRotate = true;
        this.viewer.scene.screenSpaceCameraController.enableZoom = true;
        //移除地图点击事件
        this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)//移除事件
        //移除地图移动事件
        this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)//移除事件
        var dke = this.gatherPoint.position.getValue(Cesium.JulianDate.now());
        console.log("修改后的点坐标(笛卡尔)：", dke);
        var ellipsoid = this.viewer.scene.globe.ellipsoid;
        var cartesian3 = new Cesium.Cartesian3(dke.x, dke.y, dke.z);
        var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
        var obj = {};
        obj.lat = Cesium.Math.toDegrees(cartographic.latitude);
        obj.lng = Cesium.Math.toDegrees(cartographic.longitude);
        obj.alt = cartographic.height;
        console.log("修改后的点坐标(经纬度)", obj);
        //鼠标变成默认
		this.viewer._container.style.cursor = "default";
    }
}
