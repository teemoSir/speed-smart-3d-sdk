import * as Cesium from 'cesium'
import Speed from '../speed';
import SpeedEvent from "./base/speedEvent";
import { default as DrawMode } from "../util/drawMode.js"
import { default as EventType } from "../util/eventType.js"

/**
 * DrawHandler 手绘帮助类
 *
 * 带有辅助线的手绘工具
 */
class DrawHandler extends SpeedEvent {


    /**
     * 手绘实例化
     * @param {*} viewer
     * @param {Object} [options] - 参数
     * @param {Number} [options.stopLength=0] - 需要捕获点或节点数量，默认无限
     * @param {Boolean} [options.draw=true] - true:表示保留绘制的图形，false：清除绘制的临时图形，默认true
     * @param {Boolean} [options.ground=true] - true:表示图形贴地，false：不贴地，默认true
     */
    constructor(viewer, options = {
        stopLength: 0,
        draw: true,
        ground: true
    }) {
        super(viewer);

        this.viewer = viewer._viewer;
        this.temporary_polygon_entity = undefined;
        this.options = options;
        this.point_arr = [];

        /**
         * handler
         * 鼠标事件对象
         */
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }

    /**
     * 手绘结束后
     * @param {*} [DrawMode] - 手绘图形类型
     * @param {*} [callback] - 在绘制完成后调用该回调，结束捕获监听后调用
     */
    draw (drawMode, callback, callback_move) {

        // 清空历史
        this.clear()
        // 线段绘制
        this.viewer._container.style.cursor = "crosshair";

        if (drawMode === DrawMode.POINT) {
            callback && this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.position)
                if (Cesium.defined(cartesian)) {
                    this.point_arr.push(cartesian);
                    this.draw_dynamic_point();
                }

                callback({
                    positions: this.point_arr
                })

                // 清除
                if (callback_move) {
                    if (this.options.stopLength == this.point_arr.length) {
                        this.drawDestroy();
                        !this.options.draw && this.clear();
                    }
                } else {
                    this.drawDestroy();
                    !this.options.draw && this.clear();
                }


            }, EventType.LEFT_CLICK);

            callback_move && this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.endPosition)
                if (Cesium.defined(cartesian)) {
                    callback_move({
                        positions: cartesian
                    })
                }
            }, EventType.MOUSE_MOVE);


            callback_move && this.handler.setInputAction((e) => {
                // 清除
                this.drawDestroy();
                !this.options.draw && this.clear();
            }, EventType.RIGHT_CLICK);


        } else if (drawMode ===DrawMode.POLYLINE) {


            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.position)
                if (Cesium.defined(cartesian)) {
                    this.point_arr.push(cartesian);
                    if (this.temporary_polyline_entity == null) {
                        this.draw_dynamic_polyline();
                    }
                    this.draw_dynamic_point();
                }
                if (this.options.stopLength == this.point_arr.length - 1) {
                    callback && callback({
                        positions: this.point_arr
                    })
                    // 清除
                    this.drawDestroy();
                    !this.options.draw && this.clear();
                }
            }, EventType.LEFT_CLICK);

            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.endPosition)
                if (Cesium.defined(cartesian)) {
                    if (this.temporary_polyline_entity) {

                        if (this.point_arr.length > 1) {
                            this.point_arr.pop();
                        }
                        this.point_arr.push(cartesian);
                    }
                }
            }, EventType.MOUSE_MOVE);

            this.handler.setInputAction((e) => {
                this.point_arr.pop();

                callback && callback({
                    positions: this.point_arr
                })

                // 清除
                this.drawDestroy();
                !this.options.draw && this.clear();
            }, EventType.RIGHT_CLICK);
        }
        else if (drawMode === DrawMode.POLYGON) {

            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.position)
                if (Cesium.defined(cartesian)) {
                    this.point_arr.push(cartesian);
                    if (this.temporary_polygon_entity == null) {
                        this.draw_dynamic_polygon();

                    }
                    if (this.temporary_polyline_entity == null) {
                        this.draw_dynamic_polyline();
                    }

                    this.draw_dynamic_point();
                }

            }, EventType.LEFT_CLICK);

            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.endPosition)
                if (Cesium.defined(cartesian)) {
                    if (this.temporary_polygon_entity) {
                        if (this.point_arr.length > 1) {
                            this.point_arr.pop();
                        }
                        this.point_arr.push(cartesian);

                    }
                }
            }, EventType.MOUSE_MOVE);
            this.handler.setInputAction((e) => {
                this.point_arr.pop();
                this.point_arr.push(this.point_arr[0]);

                callback && callback({
                    positions: this.point_arr
                })
                // 清除
                this.drawDestroy();
                !this.options.draw && this.clear();
            }, EventType.RIGHT_CLICK);
        } else if (drawMode === DrawMode.MARKER) {

        }
    }



    /**
     * @private
     */
    drawDestroy () {
        this.viewer._container.style.cursor = "";
        this.handler && this.handler.removeInputAction(EventType.LEFT_CLICK);
        this.handler && this.handler.removeInputAction(EventType.RIGHT_CLICK);
        this.handler && this.handler.removeInputAction(EventType.MOUSE_MOVE);
        this.handler && this.handler.destroy();
        this.handler = undefined;
    }


    /**
     * 清空辅助图形要素
     */
    clear () {
        // 清除动态绘制的多边形
        this.temporary_polygon_entity && this.viewer.entities.remove(this.temporary_polygon_entity);
        this.temporary_polygon_entity = undefined;

        // 清空动态绘制点
        this.temporary_point_entity && this.temporary_point_entity.forEach(p => {
            this.viewer.entities.remove(p);
        });

        // 清除绘制的线条
        this.temporary_polyline_entity && this.viewer.entities.remove(this.temporary_polyline_entity);
        this.temporary_polyline_entity = undefined;


        this.point_arr = [];

    }


    /**
     * 绘制动态线条
   * @private
   */
    draw_dynamic_polyline () {
        this.temporary_polyline_entity = this.viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(() => {
                    return this.point_arr;
                }, false),
                width: 2.0,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                clampToGround: this.options.ground,
                // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            }
        });
    }

    /**
     * 绘制动态点
   * @private
   */
    draw_dynamic_point () {
        let point = this.viewer.entities.add({
            position: this.point_arr[this.point_arr.length - 1],
            point: {
                color: Cesium.Color.SKYBLUE,
                pixelSize: 5,
                outlineColor: Cesium.Color.YELLOW,
                outlineWidth: 1,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                // clampToGround: true,
                // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,

            },
        })
        this.temporary_point_entity = this.temporary_point_entity || [];
        this.temporary_point_entity.push(point);
    }


    /**
     * 绘制动态多边形
   * @private
   */
    draw_dynamic_polygon () {
        this.temporary_polygon_entity = this.viewer.entities.add({
            polygon: {
                // 这个方法上面有重点说明
                hierarchy: new Cesium.CallbackProperty(() => {
                    // PolygonHierarchy 定义多边形及其孔的线性环的层次结构（空间坐标数组）
                    return new Cesium.PolygonHierarchy(this.point_arr);
                }, false),
                clampToGround: this.options.ground,
                //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                material: Cesium.Color.fromCssColorString("rgba(252,215,39,0.3)"),
            },
        });
    }


    /**
     * @private
     */
    definePick (position) {
        /**
         * 1. 判断是否在模型上，且是第一个模型穿透点
         * 2. 判断是否在地形上
         * 3. 默认在地球上
         */
        this._viewer = this.viewer;
        this._viewer._3dtileset = false;
        this._viewer._terrain = false;
        let ray = this._viewer.camera.getPickRay(position);
        let cartesian3 = this._viewer.scene.globe.pick(ray, this._viewer.scene);
        const pick = this._viewer.scene.drillPick(position, 1);

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
                cartesian3 = this._viewer.scene.pickPosition(position);
            }
        }
        if (!this._viewer._3dtileset && !this._viewer._terrain && terrain) {
            let ray = this._viewer.scene.camera.getPickRay(position);
            if (!ray) return null;
            cartesian3 = this._viewer.scene.globe.pick(ray, this._viewer.scene);
            this._viewer._terrain = true;
        }
        if (!this._viewer._3dtileset && !this._viewer._terrain && !terrain) {
            cartesian3 = this._viewer.scene.camera.pickEllipsoid(
                position,
                this._viewer.scene.globe.ellipsoid
            );
        }

        return cartesian3;
    }
}
export default DrawHandler
