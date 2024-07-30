import Analyse from "./base/analyse";
import * as Cesium from "cesium";
import * as turf from "@turf/turf";
import UpdateWater from "./updateWater"




/**
 * 淹没分析
 */
class Flood extends Analyse {

    /**
     * @member {Cesium.Viewer} - cesium的viewer对象
     * @memberof Visible
     */
    _viewer;



  


    /**
     * @class
     * @param {Object|Cesium.Viewer} viewer - viewer实例
     * @param {Object} [options] - 参数对象
     * @param {Array<Position> | Array<Cesium.Cartesian3>} [options.positions] - 三维坐标数组
     * @param {Number} [options.maxHeight=100] - 最大高度，单位：米
     * @param {Number} [options.speed=100] - 淹没速度，单位 米/
     * @param {Number} [options.time=0.1] - 参数对象
     * @param {String} [options.color='rgba(43,136,252,0.4)'] -参数对象
     */
    constructor(viewer, options = {
        maxHeight: 50,
        speed: 0.5,
        time: 0.1,
        water: {
            frequency: 1000.0,
            animationSpeed: 0.01,
            amplitude: 10,
            baseWaterColor: "rgba(43,136,252,0.4)",
            specularIntensity: 1
        }
    }) {
        super();
        this._viewer = viewer._viewer;
        this.options = options;
        this.floodFeature = [];
        this.minAltitude = 0;
        this.maxAltitude;
    }

    /**
     * 开始模拟
     * @description - 执行淹没分析模拟动画
     */
    start () {
        // 极值计算
        this.altitudeCapture(() => {
            // 水体模拟
            // this.floodAnalysis();
            this.floodAnalysisMaterial();
        });
    }
    /**
     * 
     * @param {Boolean} bool  - true:默认不暂停,false:开启暂停
     */
    pause (bool) {
        this.updateWater && this.updateWater.setPause(bool);

    }

    /**
    * 获取暂停状态
    * @returns 返回暂停状态，- true:默认不暂停,false:开启暂停
    */
    getPauseState () {
        return this.updateWater.getPauseState();
    }

    /**
     * 清空
     */
    clear () {
        this.floodFeature.forEach(f => {
            this._viewer.entities.remove(f);
        });
        this.floodFeature = [];


        // 水体
        if (this.updateWater) {
            this.updateWater.clear();
            this.updateWater = undefined;
        }


        // 清空暂停状态
        this.pauseState && (this.pauseState = true);

    }

    /**
     * 获取海拔极值，既最高与最低
     * @private
     * @returns - 返回最高与最低海拔值
     */
    getAltitudeExtremum () {
        return {
            maxAltitude: this.maxAltitude,
            minAltitude: this.minAltitude,
        }
    }

    /**
     * 分析
     * @private
     */
    floodAnalysis () {
        const feature = this._viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(this.options.positions),
                extrudedHeight: new Cesium.CallbackProperty(() => {
                    this.minAltitude += Number(this.options.speed);
                    if (this.minAltitude > this.options.maxHeight) {
                        this.minAltitude = this.options.maxHeight;
                    }
                    return this.minAltitude;
                }, false),
                perPositionHeight: true,
                material: Cesium.Color.fromCssColorString(this.options.color)
            },
        });
        this.floodFeature.push(feature);
    }

    /**
     * 分析纹理版本
   * @private
   */
    floodAnalysisMaterial () {
        console.log(this.minAltitude, this.maxAltitude)
        // 重置
        this.updateWater && this.updateWater.clear();
        // 最低赋值
        this.options.minAltitude = this.minAltitude;
        // 实例化水体
        this.updateWater = new UpdateWater(this._viewer, this.options);

        // this.waterGrow = () => {
        //     // 删除异常排除
        //     if (this.updateWater) {
        //         console.log(this.updateWater.extrudedHeight +"====" +this.options.maxHeight)
        //         if (this.updateWater.extrudedHeight < this.options.maxHeight) {
        //             // 暂停继续
        //             if (this.pauseState) {
        //                 this.updateWater.extrudedHeight += this.options.speed;
        //             }
        //             requestAnimationFrame(this.waterGrow);
        //         }
        //     }

        // }
        // this.waterGrow()

    }

    /**
        * 极值获取
        * @private
        */
    altitudeCapture (next) {
        const tempPoints = [];
        for (let i = 0; i < this.options.positions.length; i++) {
            let ellipsoid = this._viewer.scene.globe.ellipsoid;
            let cartographic = ellipsoid.cartesianToCartographic(this.options.positions[i]);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            tempPoints.push([lng, lat]);
        }
        //生成外接矩形
        let bbox = turf.bbox(turf.lineString(tempPoints));
        let area = turf.area(turf.bboxPolygon(bbox));
        //生成格网
        //计算网格点之间的距离，尽量保证范围内有1万个左右格网点。
        let cellSide = Math.sqrt(area / 1000000) / 100;
        let grid = turf.pointGrid(bbox, cellSide, { units: "kilometers" });
        const gridPositions = [];
        grid.features.forEach((f) => {
            gridPositions.push(
                Cesium.Cartographic.fromDegrees(
                    f.geometry.coordinates[0],
                    f.geometry.coordinates[1]
                )
            );
        });
        const promise = Cesium.sampleTerrainMostDetailed(
            this._viewer.terrainProvider,
            gridPositions
        );
        let maxHeight = 0;
        let minHeight = 10000.0;
        Promise.resolve(promise).then((updatedPositions) => {
            for (let i = 0; i < updatedPositions.length; i++) {
                let height = updatedPositions[i].height;
                //获取格网点处地形高度
                minHeight = height < minHeight ? height : minHeight;
                maxHeight = height > maxHeight ? height : maxHeight;
            }
            this.minAltitude = minHeight;
            this.maxAltitude = maxHeight;
            // console.log(this.minAltitude, this.maxAltitude)
            next && next();
        });
    }
}

export default Flood;
