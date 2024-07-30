import * as Cesium from 'cesium'
import { default as EventType } from "../util/eventType.js"
import { default as MeasureMode } from "../util/measureMode.js"
import Analyse from "./base/analyse";
import * as turf from "@turf/turf";



/**
 * 测量工具
 */
class MeasureHandler extends Analyse {



    

    /**
     * 测量模式
     * @typedef {Enum} MeasureMode 测量模式枚举
     * @property {Number} MeasureMode.POSITION - 坐标测量
     * @property {Number} MeasureMode.AZINUTH - 方位角测量
     * @property {Number} MeasureMode.TRIANGLE_DISTANCE - 三角测量，（水平距离，垂直距离，空间距离）
     * @property {Number} MeasureMode.HEIGHT_DIFFERENCE - 高差测量
     * @property {Number} MeasureMode.SPACE_DISTANCE - 空间距离测量
     * @property {Number} MeasureMode.GROUND_DISTANCE - 贴地距离测量
     * @property {Number} MeasureMode.SPACE_AREA - 空间面积测量
     * @property {Number} MeasureMode.GROUND_AREA - 贴地面积测量
     */

    /**
     * 测量实例化
     * @param {*} viewer - viewer实例
     */
    constructor(viewer) {
        super(viewer);
        this.viewer = viewer._viewer || viewer;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }

    /**
     * 开启测量监听
     * @param {MeasureMode} [measureMode] - 测量模式 
     * @param {Function} [callback] - 完成后回调，结束捕获监听后调用
     */
    on (measureMode, callback) {
        this.helperPopup();
        this.off();
        // 重置贴地
        if (measureMode === MeasureMode.GROUND_DISTANCE || measureMode === MeasureMode.GROUND_AREA) {
            this.measureMode = true;
        } else {
            this.measureMode = false;
        }


        // 线段绘制
        // this.viewer._container.style.cursor = "crosshair";

        if (measureMode === MeasureMode.POSITION) {
            // 坐标
            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.position)
                if (!Cesium.defined(cartesian)) {
                    console.error("position 捕获异常");
                }
                this.azimuth_position_buffer = this.azimuth_position_buffer || [];
                this.azimuth_position_buffer = [cartesian];
                let entitie = this.draw_point();

                this.off();

                callback && callback(entitie)

                var head = this._viewer.scene.camera.heading
                var pitch = this._viewer.scene.camera.pitch
                var roll = this._viewer.scene.camera.roll
                var info = { 'head': head, 'pitch': pitch, 'roll': roll };
                console.info(info)

            }, EventType.LEFT_CLICK);

            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.endPosition);
                if (!Cesium.defined(cartesian)) {
                    console.error("position 捕获异常");
                }
                // 提示
               
                this.helper_box_message = "▣ 左键 - 设置测量点\n▣ 右键 - 取消测量";


            }, EventType.MOUSE_MOVE);

            this.handler.setInputAction((e) => {
                this.off();
            }, EventType.RIGHT_CLICK);



        } else if (measureMode === MeasureMode.AZINUTH) {

            // 方位角
            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.position)
                if (!Cesium.defined(cartesian)) {
                    console.error("position 捕获异常");
                }


                this.azimuth_position_buffer = this.azimuth_position_buffer || [];
                this.azimuth_position_buffer.push(cartesian);

                this.helper_point_azimuth();
                this.helper_ellipse_azimuth();

                if (this.azimuth_position_buffer.length > 2) {
                    this.azimuth_position_buffer.pop();

                    this.azimuth_position = this.azimuth_position_buffer.concat();
                    let entitie = this.draw_azimuth();

                    this.off();

                    callback && callback(entitie)

                }

            }, EventType.LEFT_CLICK);

            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.endPosition)
                if (!Cesium.defined(cartesian)) {
                    console.error("position 捕获异常");
                }
                // 提示
            
                this.helper_box_message = "▣ 左键 - 设置起终点\n▣ 右键 - 取消测量";

                if (this.azimuth_position_buffer && this.azimuth_position_buffer.length > 1) {
                    this.azimuth_position_buffer.pop();

                }
                (this.azimuth_position_buffer && this.azimuth_position_buffer.length != 0) && this.azimuth_position_buffer.push(cartesian);

                this.helper_line_azimuth();
            }, EventType.MOUSE_MOVE);

            this.handler.setInputAction((e) => {
                this.off();
            }, EventType.RIGHT_CLICK);
        }
        else if (measureMode === MeasureMode.TRIANGLE_DISTANCE) {

            // 三角距离
            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.position)
                if (!Cesium.defined(cartesian)) {
                    console.error("position 捕获异常");
                }
                this.azimuth_position_buffer = this.azimuth_position_buffer || [];
                this.azimuth_position_buffer.push(cartesian);

                this.helper_dynamic_triangle_distance();

                if (this.azimuth_position_buffer.length > 2) {
                    this.azimuth_position_buffer.pop();

                    this.azimuth_position = this.azimuth_position_buffer.concat();
                    this.off();
                    let entitie = this.draw_triangle_distance();

                    callback && callback(entitie);
                }

            }, EventType.LEFT_CLICK);

            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.endPosition)
                if (!Cesium.defined(cartesian)) {
                    console.error("position 捕获异常");
                }

                // 提示
      
                this.helper_box_message = "▣ 左键 - 设置起终点\n▣ 右键 - 取消测量"

                if (this.azimuth_position_buffer && this.azimuth_position_buffer.length > 1) {
                    this.azimuth_position_buffer.pop();

                }
                (this.azimuth_position_buffer && this.azimuth_position_buffer.length != 0) && this.azimuth_position_buffer.push(cartesian);


            }, EventType.MOUSE_MOVE);

            this.handler.setInputAction((e) => {
                this.off();
            }, EventType.RIGHT_CLICK);
        }
        else if (measureMode === MeasureMode.HEIGHT_DIFFERENCE) {

            // 高差
            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.position)
                if (!Cesium.defined(cartesian)) {
                    console.error("position 捕获异常");
                }

                this.azimuth_position_buffer = this.azimuth_position_buffer || [];
                this.azimuth_position_buffer.push(cartesian);

                this.helper_dynamic_height_difference();

                if (this.azimuth_position_buffer.length > 2) {
                    this.azimuth_position_buffer.pop();

                    this.azimuth_position = this.azimuth_position_buffer.concat();
                    this.off();
                    let entitie = this.draw_height_difference();

                    callback && callback(entitie);
                }

            }, EventType.LEFT_CLICK);

            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.endPosition)
                if (!Cesium.defined(cartesian)) {
                    console.error("position 捕获异常");
                }

                this.azimuth_position_buffer.length > 0 && this.isoheight(cartesian);

                // 提示
            
                this.helper_box_message = "▣ 左键 - 添加起终点\n▣ 右键 - 取消测量";

                if (this.azimuth_position_buffer && this.azimuth_position_buffer.length > 1) {
                    this.azimuth_position_buffer.pop();

                }
                (this.azimuth_position_buffer && this.azimuth_position_buffer.length != 0) && this.azimuth_position_buffer.push(cartesian);


            }, EventType.MOUSE_MOVE);

            this.handler.setInputAction((e) => {
                this.isoheight();
                this.off();
            }, EventType.RIGHT_CLICK);
        }

        else if (measureMode === MeasureMode.SPACE_DISTANCE || measureMode === MeasureMode.GROUND_DISTANCE) {


            // 空间距离
            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.position)
                if (!Cesium.defined(cartesian)) {
                    console.error("position 捕获异常");
                }
                this.azimuth_position_buffer = this.azimuth_position_buffer || [];
                this.azimuth_position_buffer.push(cartesian);

                this.helper_dynamic_space_distance();

            }, EventType.LEFT_CLICK);

            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.endPosition)
                if (!Cesium.defined(cartesian)) {
                    console.error("position 捕获异常");
                }

                // 提示
            
                this.helper_box_message = "▣ 左键 - 添加节点\n▣ 右键 - 完成测量\n▣ 双击 - 取消测量"

                if (this.azimuth_position_buffer && this.azimuth_position_buffer.length > 1) {
                    this.azimuth_position_buffer.pop();

                }
                (this.azimuth_position_buffer && this.azimuth_position_buffer.length != 0) && this.azimuth_position_buffer.push(cartesian);


            }, EventType.MOUSE_MOVE);

            this.handler.setInputAction((e) => {
                if (this.azimuth_position_buffer.length >= 2) {
                    this.azimuth_position_buffer.pop();

                    this.azimuth_position = this.azimuth_position_buffer.concat();
                    this.off();
                    let entitie = this.draw_space_distance();

                    callback && callback(entitie);
                }
            }, EventType.RIGHT_CLICK);

            this.handler.setInputAction((e) => {
                this.off();
            }, EventType.LEFT_DOUBLE_CLICK);
        }

        else if (measureMode === MeasureMode.SPACE_AREA || measureMode === MeasureMode.GROUND_AREA) {

            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.position)
                if (Cesium.defined(cartesian)) {
                    this.azimuth_position_buffer = this.azimuth_position_buffer || [];
                    this.azimuth_position_buffer.push(cartesian);

                    this.helper_dynamic_ground_area_polygon();
                    this.helper_dynamic_ground_area_line();
                }

            }, EventType.LEFT_CLICK);

            this.handler.setInputAction((e) => {
                let cartesian = this.definePick(e.endPosition)
                if (Cesium.defined(cartesian)) {
                    // 提示
                 
                    this.helper_box_message = "▣ 左键 - 添加多边形节点\n▣ 右键 - 自动闭合完成测量\n▣ 双击 - 取消测量"

                    if (this.azimuth_position_buffer && this.azimuth_position_buffer.length > 1) {
                        this.azimuth_position_buffer.pop();
                    }
                    (this.azimuth_position_buffer && this.azimuth_position_buffer.length != 0) && this.azimuth_position_buffer.push(cartesian);
                }
            }, EventType.MOUSE_MOVE);
            this.handler.setInputAction((e) => {
                if (this.azimuth_position_buffer.length > 0) {
                    this.azimuth_position_buffer.pop();
                    this.azimuth_position_buffer.push(this.azimuth_position_buffer[0]);

                    this.azimuth_position = this.azimuth_position_buffer.concat();
                    this.off();
                    let entitie = this.draw_dynamic_area();

                    callback && callback(entitie);
                }

            }, EventType.RIGHT_CLICK);

            this.handler.setInputAction((e) => {
                this.off();
            }, EventType.LEFT_DOUBLE_CLICK);
        }


    }



    /**
     * 关闭测量监听
     */
    off () {

        // this.viewer._container.style.cursor = "";

        this.handler && this.handler.removeInputAction(EventType.LEFT_CLICK);
        this.handler && this.handler.removeInputAction(EventType.RIGHT_CLICK);
        this.handler && this.handler.removeInputAction(EventType.MOUSE_MOVE);
        this.handler && this.handler.removeInputAction(EventType.LEFT_DOUBLE_CLICK);

        this.helper_box_message = "";
        this.azimuth_position_buffer = [];

        this.temporary_point_position && this.viewer.entities.remove(this.temporary_point_position);
        this.temporary_point_position && (this.temporary_point_position = undefined);

        this.temporary_line_azimuth && this.viewer.entities.remove(this.temporary_line_azimuth);
        this.temporary_line_azimuth && (this.temporary_line_azimuth = undefined);

        this.temporary_ellipse_azimuth && this.viewer.entities.remove(this.temporary_ellipse_azimuth);
        this.temporary_ellipse_azimuth && (this.temporary_ellipse_azimuth = undefined);

        this.temporary_point_azimuth && this.viewer.entities.remove(this.temporary_point_azimuth);
        this.temporary_point_azimuth && (this.temporary_point_azimuth = undefined);

        this.temporary_triangle_distance && this.viewer.entities.remove(this.temporary_triangle_distance);
        this.temporary_triangle_distance && (this.temporary_triangle_distance = undefined);

        this.temporary_height_difference && this.viewer.entities.remove(this.temporary_height_difference);
        this.temporary_height_difference && (this.temporary_height_difference = undefined);

        this.temporary_space_distance && this.viewer.entities.remove(this.temporary_space_distance);
        this.temporary_space_distance && (this.temporary_space_distance = undefined);

        this.temporary_ground_area_polygon && this.viewer.entities.remove(this.temporary_ground_area_polygon);
        this.temporary_ground_area_polygon && (this.temporary_ground_area_polygon = undefined);

        this.temporary_ground_area_line && this.viewer.entities.remove(this.temporary_ground_area_line);
        this.temporary_ground_area_line && (this.temporary_ground_area_line = undefined);


    }


    /**
     * 清空辅助图形要素
     */
    clear () {

        // 清空图形缓存
        this.temporary_entity && this.temporary_entity.forEach(p => {
            this.viewer.entities.remove(p);
        });

        this.temporary_entity && (this.temporary_entity = []);

        // 清除绘制的线条
        this.temporary_polyline_entity && this.viewer.entities.remove(this.temporary_polyline_entity);
        this.temporary_polyline_entity = undefined;

        this.off()

    }

    /**
    * 绘制动态多边形
  * @private
  */
    helper_dynamic_ground_area_polygon () {

        this.temporary_ground_area_polygon = this.temporary_ground_area_polygon || this.viewer.entities.add({
            polygon: {
                // 这个方法上面有重点说明
                hierarchy: new Cesium.CallbackProperty(() => {
                    // PolygonHierarchy 定义多边形及其孔的线性环的层次结构（空间坐标数组）
                    return new Cesium.PolygonHierarchy(this.azimuth_position_buffer);
                }, false),
                heightReference: Cesium.HeightReference.NONE,
                clampToGround: false,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                material: Cesium.Color.YELLOW.withAlpha(0.4),
                depthFailMaterial: Cesium.Color.YELLOW.withAlpha(0.8),
            },
        });
    }

    /**
     * 动态线条
     * @private
     */
    helper_dynamic_ground_area_line () {
        this.temporary_ground_area_line = this.temporary_ground_area_line || this.viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(() => {
                    return this.azimuth_position_buffer;
                }, false),
                width: 5.0,
                material: Cesium.Color.YELLOW.withAlpha(0.8),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW.withAlpha(0.5),
                }),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                clampToGround: true
            },
        });
    }


    /**
     * 绘制面积模式结果
     * @private
     * 
     */
    draw_dynamic_area () {


        let label = ``;
        let area = 0;
        if (this.measureMode) {
            area = this.getGoundArea(this.azimuth_position);
            label = `贴地面积：${area.toFixed(2)} ㎡`;
        } else {
            area = this.getArea(this.azimuth_position);
            label = `水平面积：${area.toFixed(2)} ㎡`;
        }

        let center = Cesium.BoundingSphere.fromPoints(this.azimuth_position).center;//中心点

        let line = this.viewer.entities.add({
            polyline: {
                positions: this.azimuth_position,
                width: 5.0,
                material: Cesium.Color.YELLOW.withAlpha(0.8),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW.withAlpha(0.5),
                }),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                clampToGround: true
            },
            polygon: {
                hierarchy: this.azimuth_position,
                heightReference: this.measureMode ? Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.NONE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                material: Cesium.Color.YELLOW.withAlpha(0.4),
                depthFailMaterial: Cesium.Color.YELLOW.withAlpha(0.8),
                clampToGround: true
            },
            position: center,
            label: {
                text: label,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 文字水平对齐方式
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -20), //偏移量
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString('rgba(0, 28, 55, 0.8)'), // 背景颜色
                backgroundPadding: new Cesium.Cartesian2(20, 10),
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL,
                font: '15px sans-serif',
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            },
        });

        this.temporary_entity = this.temporary_entity || [];
        this.temporary_entity.push(line);


        this.azimuth_position.forEach((p) => {
            let point = this.viewer.entities.add({
                position: p,
                point: {
                    color: Cesium.Color.SKYBLUE,
                    pixelSize: 10,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 3,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                }
            })
            this.temporary_entity.push(point);
            point = undefined;
        })

        return {
            entitie: line,
            position: this.azimuth_position,
            area: area
        }

    }


    /**
     * 空间距离
     * @private
     */
    helper_dynamic_space_distance () {
        this.temporary_space_distance = this.temporary_space_distance || this.viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(() => {
                    let np = []
                    this.azimuth_position_buffer.forEach((p) => {
                        np.push(new Cesium.Cartesian3(p.x, p.y, p.z + 1));
                    })
                    return np;
                }, false),
                width: 5.0,
                material: Cesium.Color.YELLOW.withAlpha(0.8),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW.withAlpha(0.5),
                }),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                clampToGround: this.measureMode ? true : false

            },
            position: new Cesium.CallbackProperty(() => {
                return this.azimuth_position_buffer[this.azimuth_position_buffer.length - 1];
            }, false),
            point: {
                color: Cesium.Color.SKYBLUE,
                pixelSize: 10,
                outlineColor: Cesium.Color.YELLOW,
                outlineWidth: 3,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            label: {
                text: new Cesium.CallbackProperty(() => {
                    let distance = 0;
                    if (this.azimuth_position_buffer.length >= 2) {
                        this.azimuth_position_buffer.forEach((p, index) => {
                            if (index + 1 < this.azimuth_position_buffer.length) {
                                distance += Cesium.Cartesian3.distance(this.azimuth_position_buffer[index + 1], p);
                            }
                        })
                    }
                    return `${distance.toFixed(4)} 米`;

                }, false),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 文字水平对齐方式
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -20), //偏移量
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString('rgba(0, 28, 55, 0.8)'), // 背景颜色
                backgroundPadding: new Cesium.Cartesian2(20, 10),
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL,
                font: '15px sans-serif',
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        });
    }

    /**
  * 空间距离结果
* @private
*/
    draw_space_distance () {

        let distance = 0;
        this.temporary_entity = this.temporary_entity || [];

        let space_distance = this.viewer.entities.add({
            polyline: {
                positions: this.azimuth_position,
                width: 5.0,
                material: Cesium.Color.YELLOW.withAlpha(0.8),
                depthFailMaterial: Cesium.Color.YELLOW.withAlpha(0.5),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                clampToGround: this.measureMode ? true : false
            }
        });
        let space_distance_point = [];

        this.azimuth_position.forEach(async (position, index) => {
            let label = "起点";
            if (index < this.azimuth_position.length && index != 0) {
                if (this.measureMode) {
                    let res = this.getTerrainDistance(this.azimuth_position[index], this.azimuth_position[index - 1]);
                    await res.then((d) => {
                        distance += d;
                    })
                } else {
                    distance += Cesium.Cartesian3.distance(this.azimuth_position[index], this.azimuth_position[index - 1]);
                }
                label = distance.toFixed(2) + '米'
            }

            let p = this.viewer.entities.add({
                position: position,
                point: {
                    color: Cesium.Color.SKYBLUE,
                    pixelSize: 10,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 3,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
                label: {
                    text: label,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 文字水平对齐方式
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -20), //偏移量
                    showBackground: true,
                    backgroundColor: (index == 0) ? Cesium.Color.YELLOW.withAlpha(0.8) : Cesium.Color.fromCssColorString('rgba(0, 28, 55, 0.8)'), // 背景颜色
                    backgroundPadding: new Cesium.Cartesian2(20, 10),
                    fillColor: (index != 0) ? Cesium.Color.WHITE : Cesium.Color.fromCssColorString('rgba(0, 28, 55, 0.8)'),
                    style: Cesium.LabelStyle.FILL,
                    font: '15px sans-serif',
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
                },
            });
            space_distance_point.push(p);
            this.temporary_entity.push(p);
        })

        this.temporary_entity.push(space_distance);

        this.space_distance_point = [];
        this.space_distance = undefined;

        return {
            entitie: space_distance,
            positions: this.azimuth_position,
            distance: distance
        };
    }


    /**
   * 高程差值动态
 * @private
 */
    helper_dynamic_height_difference () {
        this.temporary_height_difference = this.temporary_height_difference || this.viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(() => {
                    let ace = []
                    if (this.azimuth_position_buffer.length >= 2) {
                        let a = this.toDegrees(this.azimuth_position_buffer[0]);
                        let b = this.toDegrees(this.azimuth_position_buffer[1]);
                        let c = {
                            longitude: a.height > b.height ? b.longitude : a.longitude,
                            latitude: a.height > b.height ? b.latitude : a.latitude,
                            height: a.height > b.height ? a.height : b.height
                        }
                        ace = [this.fromDegrees(a), this.fromDegrees(c)];
                    }

                    return ace;
                }, false),
                width: 5.0,
                material: Cesium.Color.YELLOW.withAlpha(0.8),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW.withAlpha(0.5),
                }),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            position: new Cesium.CallbackProperty(() => {
                let pic = this.azimuth_position_buffer[0];
                if (this.azimuth_position_buffer.length >= 2) {
                    pic = this.azimuth_position_buffer[1];
                }

                return this.azimuth_position_buffer[0];
            }, false),
            point: {
                color: Cesium.Color.SKYBLUE,
                pixelSize: 10,
                outlineColor: Cesium.Color.YELLOW,
                outlineWidth: 3,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            label: {
                text: new Cesium.CallbackProperty(() => {
                    let label = "";

                    if (this.azimuth_position_buffer.length >= 2) {
                        let a = this.toDegrees(this.azimuth_position_buffer[0]);
                        let b = this.toDegrees(this.azimuth_position_buffer[1]);
                        let heightDifference = Math.abs(a.height - b.height);
                        label += `高差：${heightDifference.toFixed(2)} 米`;
                    }
                    return label;
                }, false),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 文字水平对齐方式
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -20), //偏移量
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString('rgba(0, 28, 55, 0.8)'), // 背景颜色
                backgroundPadding: new Cesium.Cartesian2(20, 10),
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL,
                font: '15px sans-serif',
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        });




    }


    /**
     *  等高线
     * @private
     * @param {'*'} bool 
     */
    isoheight (cartesian3) {

        // 使用等高线材质
        let material = Cesium.Material.fromType("ElevationContour");
        let contourUniforms = material.uniforms;
        // 线宽2.0px
        contourUniforms.width = 2.0;

        if (cartesian3) {
            let position = this.toDegrees(cartesian3);

            // 高度间隔
            contourUniforms.spacing = position.height;
            contourUniforms.color = Cesium.Color.WHITE.withAlpha(0.5);

            position = undefined;
        } else {
            contourUniforms.color = Cesium.Color.WHITE.withAlpha(0);
        }

        // 设置材质
        this._viewer.scene.globe.material = material;
        material = undefined;
        contourUniforms = undefined;
    }

    /**
  * 高差测量结果
* @private
*/
    draw_height_difference () {

        let a = this.toDegrees(this.azimuth_position[0]);
        let b = this.toDegrees(this.azimuth_position[1]);
        let c = {
            longitude: a.height > b.height ? b.longitude : a.longitude,
            latitude: a.height > b.height ? b.latitude : a.latitude,
            height: a.height > b.height ? a.height : b.height
        }
        let heightDifference = Math.abs(a.height - b.height);
        let label = `高差：${heightDifference.toFixed(2)} 米`;

        let height_difference = this.viewer.entities.add({
            polyline: {
                positions: [this.fromDegrees(a), this.fromDegrees(c)],
                width: 5.0,
                material: Cesium.Color.YELLOW.withAlpha(0.8),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW.withAlpha(0.5),
                }),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            position: this.fromDegrees(c),
            label: {
                text: label,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 文字水平对齐方式
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -20), //偏移量
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString('rgba(0, 28, 55, 0.8)'), // 背景颜色
                backgroundPadding: new Cesium.Cartesian2(20, 10),
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL,
                font: '15px sans-serif',
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        });

        this.temporary_entity = this.temporary_entity || [];
        [this.fromDegrees(a), this.fromDegrees(b)].forEach((p) => {
            let point = this.viewer.entities.add({
                position: p,
                point: {
                    color: Cesium.Color.SKYBLUE,
                    pixelSize: 10,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 3,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },

            });
            this.temporary_entity.push(point);

        })

        let height_difference_line = this.viewer.entities.add({
            polyline: {
                positions: [this.fromDegrees(b), this.fromDegrees(c)],
                width: 5.0,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.GREEN.withAlpha(0.8),
                }),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW.withAlpha(0.5),
                }),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            }
        })


        this.temporary_entity.push(height_difference);
        this.temporary_entity.push(height_difference_line);


        return {
            entitie: height_difference,
            heightDifference: heightDifference,
            positions: [this.fromDegrees(a), this.fromDegrees(b)]
        };
    }




    /**
     * 三角距离动态
   * @private
   */
    helper_dynamic_triangle_distance () {
        this.temporary_triangle_distance = this.temporary_triangle_distance || this.viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(() => {
                    let ace = []
                    if (this.azimuth_position_buffer.length >= 2) {
                        let a = this.toDegrees(this.azimuth_position_buffer[0]);
                        let b = this.toDegrees(this.azimuth_position_buffer[1]);
                        let c = {
                            longitude: a.height > b.height ? b.longitude : a.longitude,
                            latitude: a.height > b.height ? b.latitude : a.latitude,
                            height: a.height > b.height ? a.height : b.height
                        }
                        ace = [this.fromDegrees(a), this.fromDegrees(b), this.fromDegrees(c), this.fromDegrees(a)];
                    }

                    return ace;
                }, false),
                width: 5.0,
                material: Cesium.Color.YELLOW.withAlpha(0.8),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW.withAlpha(0.5),
                }),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            position: new Cesium.CallbackProperty(() => {
                return this.azimuth_position_buffer[0];
            }, false),
            point: {
                color: Cesium.Color.SKYBLUE,
                pixelSize: 10,
                outlineColor: Cesium.Color.YELLOW,
                outlineWidth: 3,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            label: {
                text: new Cesium.CallbackProperty(() => {
                    let label = "";

                    if (this.azimuth_position_buffer.length >= 2) {
                        let a = this.toDegrees(this.azimuth_position_buffer[0]);
                        let b = this.toDegrees(this.azimuth_position_buffer[1]);
                        let c = {
                            longitude: a.height > b.height ? b.longitude : a.longitude,
                            latitude: a.height > b.height ? b.latitude : a.latitude,
                            height: a.height > b.height ? a.height : b.height
                        }

                        let horizontal = Cesium.Cartesian3.distance(this.azimuth_position_buffer[1], this.fromDegrees(c));
                        let vertical = Cesium.Cartesian3.distance(this.azimuth_position_buffer[0], this.azimuth_position_buffer[1]);
                        let heightDifference = Math.abs(a.height - b.height);

                        label += `水平距离：${horizontal.toFixed(2)} 米`;
                        label += `\n直线距离：${vertical.toFixed(2)} 米`;
                        label += `\n高程差值：${heightDifference.toFixed(2)} 米`;
                    }
                    return label;
                }, false),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 文字水平对齐方式
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(0, 20), //偏移量
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString('rgba(0, 28, 55, 0.8)'), // 背景颜色
                backgroundPadding: new Cesium.Cartesian2(20, 10),
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL,
                font: '15px sans-serif',
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        });
    }


    /**
    * 三角测量结果
  * @private
  */
    draw_triangle_distance () {


        let a = this.toDegrees(this.azimuth_position[0]);
        let b = this.toDegrees(this.azimuth_position[1]);
        let c = {
            longitude: a.height > b.height ? b.longitude : a.longitude,
            latitude: a.height > b.height ? b.latitude : a.latitude,
            height: a.height > b.height ? a.height : b.height
        }

        let positions = [this.fromDegrees(a), this.fromDegrees(b), this.fromDegrees(c), this.fromDegrees(a)];

        let a_avg = { longitude: (a.longitude + b.longitude) / 2, latitude: (a.latitude + b.latitude) / 2, height: (a.height + b.height) / 2 };
        let b_avg = { longitude: (b.longitude + c.longitude) / 2, latitude: (b.latitude + c.latitude) / 2, height: (b.height + c.height) / 2 };
        let c_avg = { longitude: (a.longitude + c.longitude) / 2, latitude: (a.latitude + c.latitude) / 2, height: (a.height + c.height) / 2 };
        let avg = [a_avg, b_avg, c_avg]

        let horizontal = Cesium.Cartesian3.distance(this.azimuth_position[1], this.fromDegrees(c));
        let vertical = Cesium.Cartesian3.distance(this.azimuth_position[0], this.azimuth_position[1]);
        let heightDifference = Math.abs(a.height - b.height);

        let triangle_distance = this.viewer.entities.add({
            polyline: {
                positions: positions,
                width: 5.0,
                material: Cesium.Color.YELLOW.withAlpha(0.8),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW.withAlpha(0.5),
                }),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            }
        });

        this.temporary_entity = this.temporary_entity || [];
        this.temporary_entity.push(triangle_distance);

        positions.forEach((p, index) => {
            let point = this.viewer.entities.add({
                position: p,
                point: {
                    color: Cesium.Color.SKYBLUE,
                    pixelSize: 10,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 3,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
            });

            let label = ``;
            switch (index) {
                case 0:
                    label = `直线距离：${horizontal.toFixed(2)} 米`;
                    break;
                case 1:
                    label = `水平距离：${vertical.toFixed(2)} 米`;
                    break;
                case 2:
                    label = `高程差值：${heightDifference.toFixed(2)} 米`;
                    break;
            }

            let text = this.viewer.entities.add({
                position: this.fromDegrees(avg[index]),
                label: {
                    text: label,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 文字水平对齐方式
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, 0), //偏移量
                    showBackground: true,
                    backgroundColor: Cesium.Color.fromCssColorString('rgba(0, 28, 55, 0.8)'), // 背景颜色
                    backgroundPadding: new Cesium.Cartesian2(20, 10),
                    fillColor: Cesium.Color.WHITE,
                    style: Cesium.LabelStyle.FILL,
                    font: '15px sans-serif',
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
            });
            this.temporary_entity.push(text);
            text = undefined;


            this.temporary_entity.push(point);
            point = undefined;

        })




        return {
            entitie: triangle_distance,
            horizontal: horizontal,
            vertical: vertical,
            heightDifference: heightDifference,
            positions: [this.fromDegrees(a), this.fromDegrees(b), this.fromDegrees(c), this.fromDegrees(a)]
        };
    }


    /**
     * 坐标测量
   * @private
   */
    helper_dynamic_point () {

        this.temporary_point_position = this.temporary_point_position || this.viewer.entities.add({
            position: new Cesium.CallbackProperty(() => {
                return this.helper_box_position
            }, false),
            point: {
                color: Cesium.Color.SKYBLUE,
                pixelSize: 10,
                outlineColor: Cesium.Color.YELLOW,
                outlineWidth: 3,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            label: {
                text: new Cesium.CallbackProperty(() => {
                    let degrees = this.toDegrees(this.helper_box_position);
                    let longitude = `\n经度：${degrees.longitude.toFixed(6)}`;
                    let latitude = `\n纬度：${degrees.latitude.toFixed(6)}`;
                    let height = `\n高程：${degrees.height.toFixed(2)}`;

                    return (longitude + latitude + height)
                }, false),
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // 文字水平对齐方式
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(-50, -20), //偏移量
                showBackground: true,
                backgroundColor: Cesium.Color.YELLOW.withAlpha(0.8), // 背景颜色
                backgroundPadding: new Cesium.Cartesian2(15, 5),
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL,
                font: '15px sans-serif',
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        })

    }

    /**
     * 
     * @returns 坐标测量
     * @private
     */
    draw_point () {

        let degrees = this.toDegrees(this.azimuth_position_buffer[0]);
        let x = `横坐标：${this.azimuth_position_buffer[0].x.toFixed(2)}`;
        let y = `\n纵坐标：${this.azimuth_position_buffer[0].y.toFixed(2)}`;
        let longitude = `\n经度：${degrees.longitude.toFixed(6)}`;
        let latitude = `\n纬度：${degrees.latitude.toFixed(6)}`;
        let height = `\n高程：${degrees.height.toFixed(2)}`;

        let maxlangth = [longitude, latitude, height, x, y].reduce((a, b) => {
            return b.length > a.length ? b : a;
        })

        let point = this.viewer.entities.add({
            position: this.azimuth_position_buffer[0],
            point: {
                color: Cesium.Color.SKYBLUE,
                pixelSize: 10,
                outlineColor: Cesium.Color.YELLOW,
                outlineWidth: 3,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            label: {
                text: (x + y + longitude + latitude + height),
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // 文字水平对齐方式
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(-maxlangth.length * 5, -20), //偏移量
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString('rgba(0, 28, 55, 0.6)'), // 背景颜色
                backgroundPadding: new Cesium.Cartesian2(20, 10),
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL,
                font: '15px sans-serif',
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        })

        this.temporary_entity = this.temporary_entity || [];
        this.temporary_entity.push(point);

        return {
            entitie: point,
            position: this.azimuth_position_buffer[0],
            degrees: degrees
        }

    }


    /**
     * 
     * 提示文字框
     * @private
     */
    helperPopup () {

        this.helper = this.helper || this.viewer.entities.add({
            position: new Cesium.CallbackProperty(() => {
                return this.helper_box_position || new Cesium.Cartesian3(0, 1000, 0);
            }, false),
            label: {
                text: new Cesium.CallbackProperty(() => {
                    let label = ``;
                    if (this.helper_box_position) {
                        let degrees = this.toDegrees(this.helper_box_position);
                        let longitude = `\n▣ ${degrees.longitude.toFixed(5)} `;
                        let latitude = `${degrees.latitude.toFixed(5)} `;
                        let height = `${degrees.height.toFixed(2)}`;
                        label += this.helper_box_message + longitude + latitude + height;
                    }
                    return label;

                }, false),
                show: new Cesium.CallbackProperty(() => {
                    return this.helper_box_message ? true : false
                }, false),
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // 文字水平对齐方式
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(25, 10), //偏移量
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString('rgba(0, 0, 0, 0.8)'), // 背景颜色
                backgroundPadding: new Cesium.Cartesian2(10, 5),
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL,
                font: '11px sans-serif',
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },

        })
    }


    /**
     * 方位角测量-点
   * @private
   */
    helper_point_azimuth () {
        this.temporary_point_azimuth && this._viewer.entities.remove(this.temporary_point_azimuth);
        this.temporary_point_azimuth && (this.temporary_point_azimuth = undefined)

        this.temporary_point_azimuth = this.viewer.entities.add({
            position: new Cesium.CallbackProperty(() => {
                return this.azimuth_position_buffer[0]
            }, false),
            point: {
                color: Cesium.Color.SKYBLUE,
                pixelSize: 10,
                outlineColor: Cesium.Color.YELLOW,
                outlineWidth: 3,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            label: {
                text: new Cesium.CallbackProperty(() => {
                    let digital = 0;
                    let degrees = 0;
                    let label = "";

                    if (this.azimuth_position_buffer.length >= 2) {
                        let radius = this.getHeading(this.azimuth_position_buffer[0], this.azimuth_position_buffer[1]);
                        degrees = digital ? this.toDigital2Degrees(digital) : 0;
                        digital = radius * (180 / Math.PI);
                        let dir = this.toDirection(digital);
                        label = `方向：${dir}\n方位角：${digital.toFixed(2)}°`;
                    }
                    return label;
                }, false),
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // 文字水平对齐方式
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(-100, -20), //偏移量
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString('rgba(0, 28, 55, 0.6)'), // 背景颜色
                backgroundPadding: new Cesium.Cartesian2(20, 10),
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL,
                font: '15px sans-serif',
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        })
    }

    /**
        * 方位角测量-指南针
      * @private
      */
    helper_ellipse_azimuth () {

        this.temporary_ellipse_azimuth = this.temporary_ellipse_azimuth || this.viewer.entities.add({
            position: new Cesium.CallbackProperty(() => { return this.azimuth_position_buffer[0] }, false),
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(() => {
                    return this.azimuth_position_buffer.length > 1 ? Cesium.Cartesian3.distance(this.azimuth_position_buffer[0], this.azimuth_position_buffer[1]) * 0.5 : 10
                }, false),
                semiMajorAxis: new Cesium.CallbackProperty(() => {
                    return this.azimuth_position_buffer.length > 1 ? Cesium.Cartesian3.distance(this.azimuth_position_buffer[0], this.azimuth_position_buffer[1]) * 0.5 : 10
                }, false),
                material: "img/speed3d/zn.png",

            },

        });

    }


    /**
    * 方位角测量-线
  * @private
  */
    helper_line_azimuth () {

        this.temporary_line_azimuth = this.temporary_line_azimuth || this.viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(() => {
                    return this.azimuth_position_buffer;
                }, false),
                width: 20.0,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                clampToGround: true,
                material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.YELLOW.withAlpha(0.8)),
                // depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                //     color: Cesium.Color.YELLOW.withAlpha(0.5),
                // }),
            }
        });
    }

    /**
     * 方位结果绘制
     * @private
     */
    draw_azimuth () {

        let radius = this.getHeading(this.azimuth_position[0], this.azimuth_position[1]);
        let digital = radius * (180 / Math.PI);
        let degrees = digital ? this.toDigital2Degrees(digital) : 0;
        let dir = this.toDirection(digital);
        let label = `方向：${dir}\n方位角：${digital.toFixed(2)}°`;

        let a = this.toDegrees(this.azimuth_position[0]);
        let b = this.toDegrees(this.azimuth_position[1]);


        let entitie = this.viewer.entities.add({
            position: this.fromDegrees({ longitude: (a.longitude + b.longitude) / 2, latitude: (a.latitude + b.latitude) / 2, height: (a.height + b.height) / 2 }),
            label: {
                text: label,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // 文字水平对齐方式
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(-100, -20), //偏移量
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString('rgba(0, 28, 55, 0.6)'), // 背景颜色
                backgroundPadding: new Cesium.Cartesian2(20, 10),
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL,
                font: '15px sans-serif',
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            polyline: {
                positions: this.azimuth_position,
                width: 20.0,
                material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.YELLOW.withAlpha(0.8)),
                //  depthFailMaterial: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.YELLOW.withAlpha(0.8)),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                clampToGround: true,
            }
        })
        this.temporary_entity = this.temporary_entity || [];
        this.temporary_entity.push(entitie);

        return {
            position: this.azimuth_position,
            entitie: entitie,
            azimuth: digital,
            direction: dir,
            degrees: degrees

        }
    }





    /**
     * @private
     */
    definePick (position) {
       
        this._viewer = this.viewer;
        this._viewer._3dtileset = false;
        this._viewer._terrain = false;
        let ray = this._viewer.camera.getPickRay(position);
        let cartesian3 = this._viewer.scene.globe.pick(ray, this._viewer.scene);
        this.helper_box_position = cartesian3;
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

    /**
     * 贴地面积
     * @private
     * @param {*} positions 
     * @returns 
     */
    getGoundArea (positions) {
        // 用来记录整块区域的最小高程
        let minHeight = 15000;

        for (let i = 0; i < positions.length; i++) {
            const cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            const height = this._viewer.scene.globe.getHeight(cartographic);
            minHeight = Math.min(minHeight, Number(height));
        }
        // 默认取绘制节点的最低点作为基准。
        this.baseHeight = minHeight;

        // 设置颗粒度
        let granularity = Math.PI / Math.pow(2, 11);
        granularity = granularity / 64;//64

        const polygonGeometry = Cesium.PolygonGeometry.fromPositions({
            positions: positions,
            vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
            granularity: granularity,
        });
        const geom = Cesium.PolygonGeometry.createGeometry(polygonGeometry);
        let maxHeight = 0;
        let i0, i1, i2;
        let height1, height2, height3;
        let bottomP1, bottomP2, bottomP3;
        const scratchCartesian = new Cesium.Cartesian3();
        let cartographic;
        let bottomArea = 0.0;
        let totalBottomArea = 0.0;
        let subTrianglePositions;

        for (let i = 0; i < geom.indices.length; i += 3) {
            i0 = geom?.indices[i];
            i1 = geom?.indices[i + 1];
            i2 = geom?.indices[i + 2];

            subTrianglePositions = geom?.attributes.position.values;
            if (subTrianglePositions) {
                scratchCartesian.x = subTrianglePositions[i0 * 3];
                scratchCartesian.y = subTrianglePositions[i0 * 3 + 1];
                scratchCartesian.z = subTrianglePositions[i0 * 3 + 2];
            }

            cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian);
            height1 = this._viewer.scene.globe.getHeight(cartographic);

            bottomP1 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0);

            maxHeight = Math.max(maxHeight, Number(height1));
            minHeight = Math.min(minHeight, Number(height1));

            if (subTrianglePositions) {
                scratchCartesian.x = subTrianglePositions[i1 * 3];
                scratchCartesian.y = subTrianglePositions[i1 * 3 + 1];
                scratchCartesian.z = subTrianglePositions[i1 * 3 + 2];
            }

            cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian);
            height2 = this._viewer.scene.globe.getHeight(cartographic);

            bottomP2 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0);

            maxHeight = Math.max(maxHeight, Number(height2));
            minHeight = Math.min(minHeight, Number(height2));

            if (subTrianglePositions) {
                scratchCartesian.x = subTrianglePositions[i2 * 3];
                scratchCartesian.y = subTrianglePositions[i2 * 3 + 1];
                scratchCartesian.z = subTrianglePositions[i2 * 3 + 2];
            }

            cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian);
            height3 = this._viewer.scene.globe.getHeight(cartographic);

            bottomP3 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0);

            maxHeight = Math.max(maxHeight, Number(height3));
            minHeight = Math.min(minHeight, Number(height3));


            bottomArea = this.computeAreaOfTriangle(bottomP1, bottomP2, bottomP3);
            totalBottomArea += bottomArea;

        }

        return totalBottomArea;
    }

    /**
   * 三角面积计算
   * @private
   */
    computeAreaOfTriangle (pos1, pos2, pos3) {
        const a = Cesium.Cartesian3.distance(pos1, pos2);
        const b = Cesium.Cartesian3.distance(pos2, pos3);
        const c = Cesium.Cartesian3.distance(pos3, pos1);
        const s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }



    /**
     * 水平面积
     * @private
     * @param {*} positions 
     * @returns 
     */
    getArea (positions) {
        let lines = [];
        positions.forEach((p) => {
            let np = this.toDegrees(p);
            lines.push([np.longitude, np.latitude])
        })
        let polygon = turf.polygon([lines]);

        return turf.area(polygon);
    }

    /**
     * 获得方向
     * @private
     * @param {*} num 
     * @returns 
     */
    toDirection (num) {
        var num = parseInt(num)
        var N = '北';
        var E = '东';
        var S = '南';
        var W = '西';
        var dir = '';

        if (num == 0 || num == 360) {
            dir = '正' + N;
        } else if (num < 90 && num > 0) {
            if (num < 45) {
                dir = E + N + ' (' + N + '偏' + E + num + '度)';
            } else if (num == 45) {
                dir = E + N + ' (' + num + '度)';
            } else if (num > 45) {
                dir = E + N + ' (' + E + '偏' + N + (90 - num) + '度)';
            }
        } else if (num == 90) {
            dir = '正' + E;
        } else if (num < 180 && num > 90) {

            if (num < 135) {
                dir = E + S + ' (' + E + '偏' + S + (num - 90) + '度)';
            } else if (num == 135) {
                dir = E + S + ' (' + (num - 90) + '度)';
            } else if (num > 135) {
                dir = E + S + ' (' + S + '偏' + E + (180 - num) + '度)';
            }
        } else if (num == 180) {
            dir = '正' + S;
        } else if (num < 270 && num > 180) {

            if (num < 225) {
                dir = W + S + ' (' + S + '偏' + W + (num - 180) + '度)';
            } else if (num == 225) {
                dir = W + S + ' (' + (num - 180) + '度)';
            } else if (num > 225) {
                dir = W + S + ' (' + W + '偏' + S + (270 - num) + '度)';
            }
        } else if (num == 270) {
            dir = '正' + W;
        } else if (num < 360 && num > 270) {

            if (num < 315) {
                dir = W + N + ' (' + W + '偏' + N + (num - 270) + '度)';
            } else if (num == 315) {
                dir = W + N + ' (' + (num - 270) + '度)';
            } else if (num > 315) {
                dir = W + S + ' (' + S + '偏' + W + (360 - num) + '度)';
            }
        }

        return dir;
    }

    /**
     * 
     * @private
     * @param {Object} [position]
     * @param {Number} [position.longitude]
     * @param {Number} [position.latitude]
     * @param {Number} [position.height]
     */
    fromDegrees (position) {
        let ellipsoid = this._viewer.scene.globe.ellipsoid;
        let cartographic = Cesium.Cartographic.fromDegrees(position.longitude, position.latitude, position.height);
        let cartesian3 = ellipsoid.cartographicToCartesian(cartographic);
        return cartesian3;
    }

    /**
    * 
    * @private
    */
    toDegrees (cartesian3) {
        let ellipsoid = this._viewer.scene.globe.ellipsoid;
        let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
        let x = Cesium.Math.toDegrees(cartographic.longitude);
        let y = Cesium.Math.toDegrees(cartographic.latitude);
        let z = cartographic.height;
        return { longitude: x, latitude: y, height: z }

    }

    /**
    * 
    * @private
    */
    getHeading (pointA, pointB) {
        let heading = 0;
        if (!Cesium.Cartesian3.equals(pointA, pointB)) {
            //建立以点A为原点，X轴为east,Y轴为north,Z轴朝上的坐标系
            let transform = Cesium.Transforms.eastNorthUpToFixedFrame(pointA);
            //向量AB
            let positionvector = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3());
            //因transform是将A为原点的eastNorthUp坐标系中的点转换到世界坐标系的矩阵
            //AB为世界坐标中的向量
            //因此将AB向量转换为A原点坐标系中的向量，需乘以transform的逆矩阵。
            let vector = Cesium.Matrix4.multiplyByPointAsVector(Cesium.Matrix4.inverse(transform, new Cesium.Matrix4()), positionvector, new Cesium.Cartesian3());
            if (!Cesium.Cartesian3.equals(new Cesium.Cartesian3(0, 0, 0), vector)) {
                //归一化
                let direction = Cesium.Cartesian3.normalize(vector, new Cesium.Cartesian3());
                if (!Cesium.Cartesian3.equals(new Cesium.Cartesian3(0, 0, 0), direction)) {
                    let a = Math.atan2(direction.y, direction.x) - Cesium.Math.PI_OVER_TWO;
                    heading = Cesium.Math.TWO_PI - Cesium.Math.zeroToTwoPi(a);
                }
            }
        }
        return heading;
    }


    /**
     * 度转度°分′秒″
     * @private
     * @param {*} val 
     * @returns 
     */
    toDigital2Degrees (val) {
        val = String(val)
        if (typeof (val) == "undefined" || val == "") {
            return "";
        }
        var i = val.indexOf('.');
        var strDu = i < 0 ? val : val.substring(0, i);
        var strFen = 0;
        var strMiao = 0;
        if (i > 0) {
            var strFen = "0" + val.substring(i);
            strFen = strFen * 60 + "";
            i = strFen.indexOf('.');
            if (i > 0) {
                strMiao = "0" + strFen.substring(i);
                strFen = strFen.substring(0, i);
                strMiao = strMiao * 60 + "";
                i = strMiao.indexOf('.');
                strMiao = strMiao.substring(0, i + 4);
                strMiao = parseFloat(strMiao).toFixed(0);
            }
        }
        return strDu + "°" + strFen + "′" + strMiao + "″";
    }

    /**
     * 度°分′秒″转度
     * @private
     * @param {*} strDu 
     * @param {*} strFen 
     * @param {*} strMiao 
     * @param {*} len 
     * @returns 
     */
    toDegrees2Digital (strDu, strFen, strMiao, len) {
        len = (len > 6 || typeof (len) == "undefined") ? 6 : len;//精确到小数点后最多六位   
        strDu = (typeof (strDu) == "undefined" || strDu == "") ? 0 : parseFloat(strDu);
        strFen = (typeof (strFen) == "undefined" || strFen == "") ? 0 : parseFloat(strFen) / 60;
        strMiao = (typeof (strMiao) == "undefined" || strMiao == "") ? 0 : parseFloat(strMiao) / 3600;
        var digital = strDu + strFen + strMiao;
        if (digital == 0) {
            return "";
        } else {
            return digital.toFixed(len);
        }
    }

    /**
     * @description 计算贴地形距离
     * @private
     * @param {Cesium.Viewer} viewer
     * @param {Cesium.Cartesian3} start
     * @param {Cesium.Cartesian3} end
     * @returns {number}
     */
    getTerrainDistance (start, end) {
        return new Promise((resolve) => {
            //制图坐标插值（不贴附地形）
            let lerpArray = [];
            //插值数量，我这里根据两点间直线距离来插，每1米插一下，插的越多越精准
            let splitNum = parseInt(Cesium.Cartesian3.distance(start, end));

            let startCartographic = Cesium.Cartographic.fromCartesian(start);
            let startDegrees = [startCartographic.longitude, startCartographic.latitude];
            let endCartographic = Cesium.Cartographic.fromCartesian(end);
            let endDegrees = [endCartographic.longitude, endCartographic.latitude];

            lerpArray.push(new Cesium.Cartographic(startDegrees[0], startDegrees[1]));

            for (let i = 1; i <= splitNum - 1; i++) {
                let x = Cesium.Math.lerp(startDegrees[0], endDegrees[0], i / splitNum);
                let y = Cesium.Math.lerp(startDegrees[1], endDegrees[1], i / splitNum);
                lerpArray.push(new Cesium.Cartographic(x, y));
            }

            //地形细节采样：传入 目标地形 和 制图坐标插值组（不贴附地形） 获取 贴地形的制图坐标插值组 再计算距离
            let pos = Cesium.sampleTerrainMostDetailed(this._viewer.terrainProvider, lerpArray);
            pos.then((cartographicArr) => {
                let terrainDistance = 0;
                cartographicArr.map((currentCartographic, index) => {
                    if (index == cartographicArr.length - 1) {
                        return;
                    }
                    let nextCartographic = cartographicArr[index + 1];
                    let currentPosition = Cesium.Cartesian3.fromRadians(currentCartographic.longitude, currentCartographic.latitude, currentCartographic.height);
                    let nextPosition = Cesium.Cartesian3.fromRadians(nextCartographic.longitude, nextCartographic.latitude, nextCartographic.height);
                    terrainDistance += Cesium.Cartesian3.distance(currentPosition, nextPosition);
                });
                resolve(terrainDistance)
            });
        });
    }

}


export default MeasureHandler;