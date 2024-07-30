import Analyse from "./base/analyse";
import * as Cesium from "cesium";
import * as turf from "@turf/turf";
import { soilMaterial } from "../util/base64Image"




/**
 * 填挖方分析类
 */
class FillCutVolume extends Analyse {

    /**
     * @member {Cesium.Viewer} - cesium的viewer对象
     * @memberof Visible
     */
    _viewer;



    /**
     * @typedef {Object} Position - Cartesian3 坐标
     * @property {Number} x - x，单位:米
     * @property {Number} y - y，单位:米
     * @property {Number} z - z，单位:米
     */




    /**
     * 填挖方分析
     * @class
     * @param {Object|Cesium.Viewer} viewer - viewer实例
     * @param {Object} [options] - 参数对象
     * @param {Array<Position> | Array<Cesium.Cartesian3>} [options.positions] - 三维坐标数组
     * @param {Number} [options.baseHeight] - 计算基准面，单位 米
     * @param {Number} [options.autoFocus=true] - 计算完成自动聚焦，默认true:自动聚焦，false:停止自动聚焦
     */
    constructor(viewer, options) {
        super();
        this._viewer = viewer._viewer || viewer;
        this.init(options);
    }

    /**
     * 初始化
     * @private
     * @property
     * @param {*} options 
     */
    init (options) {

        this.options = options;
        // autoFocus: true
        if (!Cesium.defined(this._viewer)) throw new Cesium.DeveloperError('viewer不存在.');
        if (!Cesium.defined(this._viewer.terrainProvider)) throw new Cesium.DeveloperError('terrainProvider不存在,此功能需要地形数据支持.');
        if (!Cesium.defined(this.options.positions) || this.options.positions.length < 3) throw new Cesium.DeveloperError('positions参数异常.');
        if (!Cesium.defined(this.options.baseHeight)) throw new Cesium.DeveloperError('baseHeight参数异常.');
    }

    /**
     * 填挖数据分析
     * @param {Position} positions - Cartesian3 坐标
     */
    analyse (positions) {

        // 初始化历史数据
        this.clear()

        // 添加基准面
        this.addBasePlane();

        // 计算 黑科技还是新玩具？SCOPESWITCH 卡宾镜导轨
        return this.computeVolume(positions);
    }


    /**
     * 清空
     * @description - 清空填挖方分析辅助图形
     */
    clear () {
        this.clearTriagle();
        this.clearBasePlane();
    }



    /**
     * 填挖方计算
     * @private
     */
    computeVolume (pos) {
        let positions = pos || this.options.positions;
        //用来记录整块区域的最小高程
        let minHeight = 15000;

        for (let i = 0; i < positions.length; i++) {
            const cartographic = Cesium.Cartographic.fromCartesian(positions[i]);

            const height = this._viewer.scene.globe.getHeight(cartographic);
            minHeight = Math.min(minHeight, Number(height));
        }
        //由于不好给出基准面高度，所以默认取绘制节点的最低点作为基准。
        this.baseHeight = Number(this.options.baseHeight) == 0 ? minHeight : Number(this.options.baseHeight);

        //设置颗粒度
        let granularity = Math.PI / Math.pow(2, 11);
        granularity = granularity / 64;//64

        const polygonGeometry = Cesium.PolygonGeometry.fromPositions({
            positions: positions,
            vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
            granularity: granularity,
        });
        const geom = Cesium.PolygonGeometry.createGeometry(polygonGeometry);
        let totalCutVolume = 0;
        let totalFillVolume = 0;
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
            //计算三角体的平均高度
            const avgCubeHeight = (Number(height1) + Number(height2) + Number(height3)) / 3;

            //判断是 填方还是挖方
            //如果三角体低于基准面，则需要填方
            if (avgCubeHeight <= this.baseHeight) {
                totalFillVolume += bottomArea * (this.baseHeight - avgCubeHeight);
            } else { //否则需要挖方
                totalCutVolume += bottomArea * (avgCubeHeight - this.baseHeight);
            }

            // 绘制三角体
            this.addTriangle([bottomP1, bottomP2, bottomP3], (avgCubeHeight <= this.baseHeight) ? "red" : "blue")
        }

        const result = {};
        result.minHeight = minHeight;
        result.maxHeight = maxHeight;
        result.cutVolume = totalCutVolume;
        result.fillVolume = totalFillVolume;
        result.area = totalBottomArea;

        // 描述
        //this.addText('挖方量:' + totalCutVolume.toFixed(2) + 'm3,\n 填方量:' + totalFillVolume.toFixed(2) + 'm3',)

        return result;
    }

    /**
     * 添加基准面
     * @private
     */
    addBasePlane (pos) {
        let positions = pos || this.options.positions;
        let plane = {
            polygon: {
                hierarchy: {
                    positions: positions
                },
                height: 0,
                extrudedHeight: this.options.baseHeight,
                material: Cesium.Color.fromCssColorString("#FD9A9A").withAlpha(0.3),
                outline: true,
                outlineColor: Cesium.Color.WHEAT,
                outlineWidth: 2.0,
            }
        };

        this.basePlane = this._viewer.entities.add(plane);
        this.options.autoFocus && this._viewer.flyTo(this.basePlane);
    }

    /**
     * 移除基准面
     * @private
     */
    clearBasePlane () {
        this.basePlane && this._viewer.entities.remove(this.basePlane) && delete this.basePlane;
    }


    /**
     * 添加三角网
     * @private
     */
    addTriangle (positions, color) {
        let triangle = {
            polyline: {
                positions: positions,
                width: 2,
                material: Cesium.Color.fromCssColorString(color).withAlpha(0.8),
                clampToGround: true,
            },
            polygon: {
                hierarchy: {
                    positions: positions
                },
                material: Cesium.Color.fromCssColorString("#fff").withAlpha(0.1),
            }
        };
        this.drawTriangle = this.drawTriangle || [];
        this.drawTriangle.push(this._viewer.entities.add(triangle));
    }


    /**
       * 移除三角网
       * @private
       */
    clearTriagle () {
        this.drawTriangle = this.drawTriangle || [];
        this.drawTriangle.forEach(t => {
            this._viewer.entities.remove(t);
        });
        // this.drawTriangle = [];
    }

    showTriagle (bool) {
        if (bool) {
            this.drawTriangle.forEach(t => {
                this._viewer.entities.add(t);
            });
        } else {
            this.clearTriagle();
        }
    }

    /**
    * 文字追加
    * @private
    */
    addText (text) {
        let centroid = Object.assign({}, this.options.positions[0]);
        centroid.z = centroid.z + 1000;
        this._viewer.entities.add({
            position: centroid,
            label: {
                text: text
            }
        });
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

}

export default FillCutVolume;
