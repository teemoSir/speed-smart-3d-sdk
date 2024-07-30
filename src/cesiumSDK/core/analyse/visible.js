import Analyse from "./base/analyse";
import * as Cesium from "cesium";
import Validate from "../util/validate";
import { beginMarker, endMarker } from "../util/base64Image"

/**
 * 通视分析
 */
class Visible extends Analyse {


    _viewer;


    /**
     * @typedef {Object} VisibleResult - 通视分析返回值
     * @property {Cesium.Cartesian3 | Position} cross - 通视阻止点，Cartesian3坐标
     * @property {Cesium.Cartesian3 | Position} origin - 通视观察点(起点)Cesium.Cartesian3 地球坐标
     * @property {Cesium.Cartesian3 | Position} target - 通视目标点(终点)Cesium.Cartesian3 地球坐标
     * @property {Number} invisibleDistance - 不通视距离，单位:米
     * @property {Number} visibleDistance - 通视距离，单位:米
     */


    constructor() {
        super();
    }

    /**
    * 计算方法
    * @description - 进行计算分析
    * @param {Object} options 
    * @param {Cesium.Viewer} options.speedViewer - 地图实例viewer对象
    * @param {Cesium.Cartesian3 | Position} options.origin - 通视观察点(起点)Cesium.Cartesian3 地球坐标
    * @param {Cesium.Cartesian3 | Position} options.target - 通视目标点(终点)Cesium.Cartesian3 地球坐标
    * @param {Boolean} [options.defaultDraw=true] - 是否将图形绘制渲染至地图
    * @param {Boolean} [options.autoFocus=true] - 是否视野自适应
    * @returns {Result} 通视检测结果
    */
    compute (options = { defaultDraw: true, autoFocus: true }) {
        if (!Validate.define(options) || !Validate.define(options.speedViewer) || !Validate.define(options.origin) || !Validate.define(options.target)) {
            throw new Cesium.DeveloperError('必填参数缺失！[options.speedViewer || options.origin || options.target]');
        }
        this._viewer = options.speedViewer._viewer;
        let vaResult = undefined;
        let buffer = 0.5; // 穿模容差
        let origin = options.origin;
        let target = options.target;

        // 为保证通过性高程偏移
        origin.z = origin.z + 0.3;

        let direction = Cesium.Cartesian3.normalize(
            Cesium.Cartesian3.subtract(
                target,
                origin,
                new Cesium.Cartesian3()
            ),
            new Cesium.Cartesian3()
        );
        let ray = new Cesium.Ray(origin, direction);
        let result = this._viewer.scene.pickFromRay(ray);

        if (Cesium.defined(result)) {
            let visibleDistance = Cesium.Cartesian3.distance((result.position || result), origin);
            let invisibleDistance = Cesium.Cartesian3.distance((result.position || result), target);
            vaResult = {
                origin: origin,
                target: target,
                cross: (result.position || result),
                visibleDistance: visibleDistance,
                invisibleDistance: invisibleDistance > buffer ? invisibleDistance : 0
            }
            if (invisibleDistance > buffer) {
                options.defaultDraw && this.drawLine((result.position || result), origin, Cesium.Color.GREEN.withAlpha(0.8));
                options.defaultDraw && this.drawLine((result.position || result), target, Cesium.Color.RED.withAlpha(0.8));
            } else if (invisibleDistance <= buffer) {
                options.defaultDraw && this.drawLine(origin, target, Cesium.Color.GREEN.withAlpha(0.8));
            }

        } else {
            vaResult = {
                origin: origin,
                target: target,
                cross: undefined,
                visibleDistance: Cesium.Cartesian3.distance(origin, target),
                invisibleDistance: 0
            }

            options.defaultDraw && this.drawLine(origin, target, Cesium.Color.GREEN.withAlpha(0.8));

        }

        // 标记
        options.defaultDraw && this.drawMarker(origin, 0, " 观察点 ");
        options.defaultDraw && this.drawMarker(target, 1, " 目标点 ");

        // 自动聚焦
        // this._viewer.camera.flyTo({
        //     //定位到范围中心点
        //     destination: new Cesium.Cartesian3(Number((origin.x + target.x) / 2), Number((origin.y + target.y) / 2),target.z+ 12200),
        //     orientation: {
        //    //     heading: Cesium.Math.toRadians(180),//1
        //        // pitch: Cesium.Math.toRadians(-90),
        //         roll: 0
        //     }
        // });

        return vaResult;
    }

    /**
    * @private
    * @param {*} points 
    * @returns 
    */
    getBounds (points) {
        let bounds = [];
        let left = Number.MAX_VALUE;
        let right = Number.MIN_VALUE;
        let top = Number.MAX_VALUE;
        let bottom = Number.MIN_VALUE;
        points.forEach(element => {
            left = Math.min(left, element.x);
            right = Math.max(right, element.x);
            top = Math.min(top, element.y);
            bottom = Math.max(bottom, element.y);
        });
        bounds.push(left);
        bounds.push(top);
        bounds.push(right);
        bounds.push(bottom);
        return bounds;
    }

    /**
     * 清空绘制
     */
    clear () {
        if (this._viewer._feature) {
            this._viewer._feature.forEach(feature => {
                this._viewer.entities.remove(feature)
            })
            this._viewer._feature = [];
        }
    }



    /**
     * 销毁并清除绘制
     */
    destory () {
        if (this._viewer._visible_analyse_line) {
            this._viewer._visible_analyse_line.forEach(line => {
                this._viewer.entities.remove(line)
            })
            this._viewer._visible_analyse_line = [];
        }
        if (this._viewer._visible_analyse_marker) {
            this._viewer._visible_analyse_marker.forEach(marker => {
                this._viewer.entities.remove(marker)
            });
            this._viewer._visible_analyse_marker = [];

        }
    }

    init (options) {
        let speedViewer = options.speedViewer;
        this._viewer = speedViewer._viewer;
        this._viewer.scene.globe.depthTestAgainstTerrain = true;
        //let that = this;
        options.success = (points) => {

            console.log(points);
            if (points.length == 1) {
                // 绘制点
                this.drawMarker(points[0], 0, "观察点");
            } else {
                // 绘制点
                this.drawMarker(points[1], 1, "目标点");

                // 分析
                this.visibleAnalyse({
                    speedViewer: speedViewer,
                    positions: points,
                    callback: (result) => {
                        console.log("---visibleAnalyseTileSet---")
                        console.log(result);
                        options.result(result);
                    }
                });


                // 根据模型或非模型进行通视野计算
                // if (this._viewer._3dtileset) {
                //     result = this.visibleAnalyseTileSet({
                //         speedViewer: speedViewer,
                //         positions: points,
                //         callback: (e) => {
                //             console.log("---visibleAnalyseTileSet---")
                //             console.log(e);
                //             options.result(result);
                //         }
                //     });
                // } else {
                //     result = this.visibleAnalyseTerrain({
                //         speedViewer: speedViewer,
                //         positions: points,
                //         callback: (e) => {
                //             console.log("---visibleAnalyseTerrain---")
                //             console.log(e);
                //             options.result(result);
                //         }
                //     });
                // }

                // 回调返回
                // if (options.result && options.result instanceof Function) {
                //     options.result(result)
                // } else {
                //     console.error("result is null");
                // }
                //   speedViewer._viewer.scene.globe.depthTestAgainstTerrain = false;
            }

        };

        this.pickEvent = new PickEvent({
            speedViewer: speedViewer,
        })
        this.pickEvent.pickPoint(options);
    }

    /**
      * 
      * @private
      */
    visibleAnalyse_v1 (options) {
        // console.log(options);
        let that = this;
        let speedViewer = options.speedViewer;
        if (!Validate.define(speedViewer)) {
            console.error("speedViewer is verification failed");
            return;
        }
        let positions = options.positions;
        this._viewer = speedViewer._viewer;
        let vaResult = undefined;
        let buffer = 1;

        if (
            Validate.define(positions) &&
            positions instanceof Array &&
            positions.length == 2
        ) {
            let origin = positions[0];
            let target = positions[1];

            // 为保证通过性高程偏移
            origin.z = origin.z + 0.3;
            target.z = target.z + 0.3;

            let direction = Cesium.Cartesian3.normalize(
                Cesium.Cartesian3.subtract(
                    target,
                    origin,
                    new Cesium.Cartesian3()
                ),
                new Cesium.Cartesian3()
            );
            let ray = new Cesium.Ray(origin, direction);
            let result = this._viewer.scene.pickFromRay(ray);
            //console.log("pickFromRay pick1", result);
            if (!result.object) {
                result = this._viewer.scene.globe.pick(ray, this._viewer.scene);
            }

            //console.log("pickFromRay pick2", result);
            if (Cesium.defined(result)) {

                let visibleDistance = Cesium.Cartesian3.distance((result.position || result), origin);
                let invisibleDistance = Cesium.Cartesian3.distance((result.position || result), target);

                vaResult = {
                    visible: invisibleDistance > buffer ? false : true,
                    origin: this.toDegrees(origin),
                    target: this.toDegrees(target),
                    cross: this.toDegrees((result.position || result)),
                    visibleDistance: visibleDistance,
                    invisibleDistance: invisibleDistance > buffer ? invisibleDistance : 0
                }


                if (invisibleDistance > buffer) {
                    this.drawLine((result.position || result), origin, Cesium.Color.GREEN.withAlpha(0.8));
                    this.drawLine((result.position || result), target, Cesium.Color.RED.withAlpha(0.8));
                } else {
                    this.drawLine(origin, target, Cesium.Color.GREEN.withAlpha(0.8));
                }

            } else {
                vaResult = {
                    visible: true,
                    origin: this.toDegrees(origin),
                    target: this.toDegrees(target),
                    cross: undefined,
                    visibleDistance: Cesium.Cartesian3.distance(origin, target),
                    invisibleDistance: 0
                }


                this.drawLine(origin, target, Cesium.Color.GREEN.withAlpha(0.8));
            }

            options.callback(vaResult);


            // that.result.position.cross = result.position;
            // 	that.result.distance.visible = visible;
            // 	that.result.distance.invisible = invisible;

            // 	this.drawLine(result.position, origin, Cesium.Color.GREEN);
            // 	this.drawLine(result.position, target, Cesium.Color.RED);
            // } else {
            // 	console.log("没有相交点....");
            // 	let invisible = Cesium.Cartesian3.distance(target, origin);
            // 	that.result.distance.invisible = invisible;
            // 	this.drawLine(origin, target, Cesium.Color.RED);

            // console.log(that.result);

        } else {
            console.error("positions is verification failed");
        }
        // return vaResult
    }
    /**
     * 
     * @private
     */
    visibleAnalyseTerrainZ (options) {

        let that = this;
        let speedViewer = options.speedViewer;
        if (!Validate.define(speedViewer)) {
            console.error("speedViewer is verification failed");
            return;
        }
        let positions = options.positions;
        this._viewer = speedViewer._viewer;
        let vaResult = undefined;

        if (
            Validate.define(positions) &&
            positions instanceof Array &&
            positions.length == 2
        ) {
            let origin = positions[0];
            let target = positions[1];

            // 为保证通过性高程偏移
            // origin.z = origin.z + 0.2;
            // target.z = target.z + 0.2;


            const startPoint = this.toDegrees(origin);
            const endPoint = this.toDegrees(target);
            const pointSum = 100.0;
            let pts = []
            let cartesians = new Array(pointSum);
            let offset, x, y, height;
            for (let i = 0; i < pointSum; ++i) {
                offset = i / (pointSum - 1)
                x = Cesium.Math.lerp(startPoint.lng, endPoint.lng, offset)
                y = Cesium.Math.lerp(startPoint.lat, endPoint.lat, offset)
                height = Cesium.Math.lerp(startPoint.alt, endPoint.alt, offset)
                pts.push([x, y, height])
                //使用提供的笛卡尔坐标计算t处的线性插值或外推(开始点，结束点，插值多少，存储在哪)
                cartesians[i] = Cesium.Cartesian3.lerp(origin, target, offset, new Cesium.Cartesian3())
            }
            const cartesians_clone = cartesians.map(d => d.clone())
            const terrainProvider = this._viewer.terrainProvider;// || Cesium.createWorldTerrain(); //加载高程地址 可以是自定义的
            const positions_d = pts.map(d => Cesium.Cartographic.fromDegrees(...d))

            //根据地形算某经纬点的高度
            //查询完成后，可解析为提供的位置列表的承诺。这个 如果地形提供商的`availability`属性未定义，则promise将拒绝
            const promise = Cesium.sampleTerrainMostDetailed(terrainProvider, positions_d);
            Promise.resolve(promise).then((updatedPositions) => {
                //可视终点
                let line_s_index = 0, position_updated = null, heightArr = [], entityHeightArr = [];
                const length = updatedPositions.length - 1
                for (let i = 1; i < length; i++) {
                    const position_updated = updatedPositions[i]
                    entityHeightArr.push(position_updated.height)
                    heightArr.push(pts[i][2])
                }
                this.heightArr = heightArr
                this.entityHeightArr = entityHeightArr
                for (let i = 1; i < length; i++) {
                    position_updated = updatedPositions[i]
                    if (!line_s_index && position_updated && position_updated.height > pts[i][2]) {
                        line_s_index = i
                        break;
                    }
                }


                let cross = cartesians_clone[line_s_index];
                let visibleDistance = 0;
                let invisibleDistance = 0;
                let visible = line_s_index > 0 ? false : true;
                if (visible) {
                    this.drawLine(origin, target, Cesium.Color.GREEN.withAlpha(0.8));

                    visibleDistance = Cesium.Cartesian3.distance(origin, target);
                    invisibleDistance = 0;

                } else {
                    this.drawLine(origin, cartesians_clone[line_s_index], Cesium.Color.GREEN.withAlpha(0.8));
                    this.drawLine(cartesians_clone[line_s_index], target, Cesium.Color.RED.withAlpha(0.8));

                    visibleDistance = Cesium.Cartesian3.distance(origin, cartesians_clone[line_s_index]);
                    invisibleDistance = Cesium.Cartesian3.distance(cartesians_clone[line_s_index], target);
                }

                vaResult = {
                    visible: visible,
                    origin: startPoint,
                    target: endPoint,
                    cross: this.toDegrees(cross),
                    visibleDistance: visibleDistance,
                    invisibleDistance: invisibleDistance
                }
                options.callback(vaResult);
            })

        } else {
            console.error("positions is verification failed");
        }
        return vaResult
    }

    /**
   * 
   * @private
   */
    visibleAnalyseTerrain (options) {

        console.log(options);
        let that = this;
        let speedViewer = options.speedViewer;
        if (!Validate.define(speedViewer)) {
            console.error("speedViewer is verification failed");
            return;
        }
        let positions = options.positions;
        this._viewer = speedViewer._viewer;
        let vaResult = undefined;

        if (
            Validate.define(positions) &&
            positions instanceof Array &&
            positions.length == 2
        ) {
            let origin = positions[0];
            let target = positions[1];

            // 为保证通过性高程偏移
            origin.z = origin.z + 0.2;
            target.z = target.z + 0.2;

            let direction = Cesium.Cartesian3.normalize(
                Cesium.Cartesian3.subtract(
                    target,
                    origin,
                    new Cesium.Cartesian3()
                ),
                new Cesium.Cartesian3()
            );
            let ray = new Cesium.Ray(origin, direction);
            //let result = this._viewer.scene.pickFromRay(ray);
            let result = this._viewer.scene.globe.pick(ray, this._viewer.scene); // 计算交点
            // console.log("result", result);
            let visibleDistance = Cesium.Cartesian3.distance(result, origin);
            let invisibleDistance = Cesium.Cartesian3.distance(result, target);
            if (result) {
                vaResult = {
                    visible: invisibleDistance > 0.5 ? false : true,
                    origin: this.toDegrees(origin),
                    target: this.toDegrees(target),
                    cross: this.toDegrees(result),
                    visibleDistance: visibleDistance,
                    invisibleDistance: invisibleDistance > 0.5 ? invisibleDistance : 0
                }



                if (invisibleDistance > 0.5) {
                    this.drawLine(result, origin, Cesium.Color.GREEN.withAlpha(0.8));
                    this.drawLine(result, target, Cesium.Color.RED.withAlpha(0.8));
                } else {
                    this.drawLine(origin, target, Cesium.Color.GREEN.withAlpha(0.8));
                }
            } else {
                this.drawLine(origin, target, Cesium.Color.GREEN.withAlpha(0.8));

                vaResult = {
                    visible: true,
                    origin: this.toDegrees(origin),
                    target: this.toDegrees(target),
                    cross: undefined,
                    visibleDistance: visibleDistance,
                    invisibleDistance: invisibleDistance
                }
            }

            options.callback(vaResult);


        } else {
            console.error("positions is verification failed");
        }
        return vaResult
    }
    /**
       * 
       * @private
       */
    fromDegrees (position) {
        let ellipsoid = this._viewer.scene.globe.ellipsoid;
        let cartographic = Cesium.Cartographic.fromDegrees(position.lng, position.lat, position.alt);
        let cartesian3 = ellipsoid.cartographicToCartesian(cartographic);
        return cartesian3;
    }

    /**
    * 
    * @private
    */
    toDegrees (position) {
        let ellipsoid = this._viewer.scene.globe.ellipsoid;
        let cartesian3 = position;
        let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
        let x = Cesium.Math.toDegrees(cartographic.longitude);
        let y = Cesium.Math.toDegrees(cartographic.latitude);
        let z = cartographic.height;
        return { x: x, y: y, z: z }

    }

    /**
     * 
     * @private
     */
    drawLine (leftPoint, secPoint, color) {
        let line = {
            polyline: {
                positions: [leftPoint, secPoint],
                width: 5,
                material: color,
                depthFailMaterial: color,
                //clampToGround:true 贴地
            },
        }
        this._viewer._feature = this._viewer._feature || [];
        this._viewer._feature.push(this._viewer.entities.add(line));
    }

    /**
     * @private
     * @param {Array} position 坐标
     * @param {Number} markerType 0：观察点，1：目标点
     * @param {String} label 标记文字
     */
    drawMarker (position, markerType, label = "") {

        markerType = markerType ? beginMarker : endMarker;

        let marker = {
            name: 'label',
            position: position,
            label: {
                // text: label,
                // font: "14px 'Microsoft Yahei'",
                // fillColor: Cesium.Color.WHEAT,
                // outlineColor: Cesium.Color.BLACK,
                // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                // outlineWidth: 0.5,
                // showBackground: true,
                // backgroundColor: Cesium.Color.BLACK.withAlpha(0.5),
                // backgroundPadding: new Cesium.Cartesian2(3, 2),
                // verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
                // pixelOffset: new Cesium.Cartesian2(0, -80), //偏移量
                // disableDepthTestDistance: Number.POSITIVE_INFINITY,

                text: label, // 文本，支持换行符\n
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -60), //偏移量
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString('rgba(0, 28, 55, 0.6)'), // 背景颜色
                backgroundPadding: new Cesium.Cartesian2(20, 10),
                fillColor: Cesium.Color.WHITE, // 字体颜色-白色
                style: Cesium.LabelStyle.FILL,
                font: '1vw sans-serif',
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                //   show: false

            },
            point: {
                color: Cesium.Color.WHITE, //点位颜色
                pixelSize: 6, //像素点大小
                // disableDepthTestDistance: 50000
            },
            billboard: {
                //图标
                image: markerType,
                // width: 60,
                // height: 80,
                scale: 0.5,
                pixelOffset: new Cesium.Cartesian2(0, -30),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        }
        this._viewer._feature = this._viewer._feature || [];
        this._viewer._feature.push(this._viewer.entities.add(marker));
    }
}

export default Visible;
