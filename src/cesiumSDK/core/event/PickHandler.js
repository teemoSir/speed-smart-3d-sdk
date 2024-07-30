import SpeedEvent from "./base/speedEvent";
import * as Cesium from "cesium";
import Speed from "../speed";

/**
 * 地球、地形、模型点击点坐标事件
 */
class PickHandler extends SpeedEvent {

    constructor(options) {
        super(options);
        this._viewer = options._viewer;
        const viewer = this._viewer;
        this._handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    }

    /**
    * @member {Cesium.Viewer} - cesium的viewer对象
    * @memberof Visible
    */
    _viewer;

    /**
     * @member {Cesium.ScreenSpaceEventHandler} - 事件实例
     * @memberof Visible
     */
    _handler;


    /**
     * 添加捕获事件监听
     * @param {Speed.EventType} type - 捕获事件类型EventType，
     * @param {Function} callback - 回调方法，内置参数event，event.position:屏幕坐标，event.cartesian3:捕获的三维空间坐标
     */
    on (type, callback) {
        this._viewer._container.style.cursor = "crosshair";
        this._handler.setInputAction((event) => {
            event.cartesian3 = this.definePick(event);
            callback(event);
        }, type);
    }
    addEventListener = this.on;

    /**
     * 卸载事件监听
     */
    off () {
        this._viewer._container.style.cursor = "";
        this._handler && this._handler.destroy();
    }

    removeEventListener = this.off;

    definePick (event) {
        /**
         * 1. 判断是否在模型上，且是第一个模型穿透点
         * 2. 判断是否在地形上
         * 3. 默认在地球上
         */
        this._viewer._3dtileset = false;
        this._viewer._terrain = false;
        let ray = this._viewer.camera.getPickRay(event.position);
        let cartesian3 = this._viewer.scene.globe.pick(ray, this._viewer.scene);
        const pick = this._viewer.scene.drillPick(event.position, 1);

        let terrain =
            this._viewer.terrainProvider instanceof Cesium.TerrainProvider ||
            this._viewer.terrainProvider instanceof
            Cesium.EllipsoidTerrainProvider ||
            this._viewer.terrainProvider instanceof
            Cesium.CesiumTerrainProvider ||
            this._viewer.terrainProvider instanceof
            Cesium.VRTheWorldTerrainProvider ||
            this._viewer.terrainProvider instanceof
            Cesium.GoogleEarthEnterpriseTerrainProvider;

        //console.log(pick)
        if (pick.length) {
            if (
                pick[0].primitive instanceof Cesium.Cesium3DTileFeature ||
                pick[0].primitive instanceof Cesium.Cesium3DTileset ||
                pick[0].primitive instanceof Cesium.Model
            ) {
                this._viewer._3dtileset = true;
                cartesian3 = this._viewer.scene.pickPosition(event.position);
            }
        }
        if (!this._viewer._3dtileset && !this._viewer._terrain && terrain) {
            let ray = this._viewer.scene.camera.getPickRay(event.position);
            if (!ray) return null;
            cartesian3 = this._viewer.scene.globe.pick(ray, this._viewer.scene);
            this._viewer._terrain = true;
        }
        if (!this._viewer._3dtileset && !this._viewer._terrain && !terrain) {
            cartesian3 = this._viewer.scene.camera.pickEllipsoid(
                event.position,
                this._viewer.scene.globe.ellipsoid
            );
        }



        // let ray = this._viewer.camera.getPickRay(event.position);
        // let pick = this._viewer.scene.pickPosition(event.position);
        // let pickModel = this._viewer.scene.pick(event.position);
        // let cartesian3 = this._viewer.scene.globe.pick(ray, this._viewer.scene);

        // if (pickModel) {
        //     if ((pick && pickModel.primitive instanceof Cesium.Cesium3DTileFeature) ||
        //         (pick && pickModel.primitive instanceof Cesium.Cesium3DTileset) ||
        //         (pick && pickModel.primitive instanceof Cesium.Model)) {
        //         let height = Cesium.Cartographic.fromCartesian(pick).height;
        //         let lat = Cesium.Math.toDegrees(
        //             Cesium.Cartographic.fromCartesian(pick).latitude
        //         );
        //         let lng = Cesium.Math.toDegrees(
        //             Cesium.Cartographic.fromCartesian(pick).longitude
        //         );
        //         cartesian3 = Cesium.Cartesian3.fromDegrees(lng, lat, height+0.5);
        //         this._viewer._3dtileset = true;
        //     }
        // }

        return cartesian3;
    }
}

export default PickHandler;
