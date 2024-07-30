import Analyse from "./base/analyse";
import * as Cesium from "cesium";
import * as Speed from "@/cesiumSDK/index";



/**
 * 模型平面剖面
 */
class TilesetPlanClip extends Analyse {


    /**
     * @member {Cesium.Viewer} viewer对象
     */
    _viewer;

    /**
    * 实例化剖面组件
    * @param {Cesium.Viewer} [viewer] - viewer对象
    * @param {Cesium.Cesium3DTileset} [tiles3dModel] - 3Dtileset模型对象
    * @example
    * 
    *  this.tilesetPlanClip = new Speed.TilesetPlanClip(this.viewer,this.tiles3dModel);
    */
    constructor(viewer, tiles3dModel) {
        super(viewer);
        this._viewer = viewer._viewer || viewer;
        this.clipDistance = 0
        this.tileset = tiles3dModel
        this.drawList = []
        this.resultList = []
        this.clipEntity = undefined
        this.inverseTransform;
        this.drawHandler
        this.drawClicked = false

        this.init();
    }

    /**
     * 初始化
     * @private
     */
    init() {
        if (!Cesium.defined(this._viewer)) throw new Cesium.DeveloperError('viewer不存在.');
    }

    /**
    * 激活单个剖面
    * @param {String} [direction] - 裁切方向名称
    */
    singleClip(direction) {
        this.clipDistance = 0

        this.clearGeologyClipPlan()
        let normal = []
        switch (direction) {
            case 'N2S':
                normal = [0.0, -1.0, 0.0]
                break
            case 'S2N':
                normal = [0.0, 1.0, 0.0]
                break
            case 'E2W':
                normal = [-1.0, 0.0, 0.0]
                break
            case 'W2E':
                normal = [1.0, 0.0, 0.0]
                break
            case 'U2D':
                normal = [0.0, 0.0, -1.0]
                break
            case 'D2U':
                normal = [0.0, 0.0, 1.0]
                break
            default:
                break
        }
        if (normal.length === 0) return
        //为模型数据集设置裁剪平面
        this.tileset.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: [
                //设置一个垂直于Z轴的裁剪平面
                new Cesium.ClippingPlane(new Cesium.Cartesian3(...normal), 0)
            ],
            edgeWidth: 2
        });

        const boundingSphere = this.tileset.boundingSphere;
        const radius = boundingSphere.radius;

        //遍历数据集的裁剪平面，构建裁剪平面实体
        for (let i = 0; i < this.tileset.clippingPlanes.length; i++) {
            let plane = this.tileset.clippingPlanes.get(i)
            this.clipEntity = this._viewer.entities.add({
                position: boundingSphere.center,
                plane: {
                    //平面的范围(边界)
                    dimensions: new Cesium.Cartesian2(
                        radius * 2,
                        radius * 2
                    ),
                    material: Cesium.Color.WHITE.withAlpha(0.1),
                    plane: new Cesium.CallbackProperty(
                        () => {
                            plane.distance = this.clipDistance;
                            return plane;
                        },
                        false
                    ),
                    outline: true,
                    outlineColor: Cesium.Color.WHITE,
                },
            });
        }
    }
    /**
    * 调整裁切距离
    * @param {Nuclear} [val] - 裁切距离
    */
    rangeDistance(val) {
        this.clipDistance = -val * 10;
    }

    /**
    * 开启绘制裁切面
    * @param {String} [modelType] - 内切或外切  '0'表示外切  '1'表示内切
    */
    drawClipPlan(modelType) {
        if (!this.drawClicked) {
            this.drawClicked = true

            this.clearGeologyClipPlan()

            this.inverseTransform = this.getInverseTransform(this.tileset)
            this.drawHandler = new Speed.DrawHandler(this);
            this.drawHandler.draw(Speed.DrawMode.POLYGON, (result) => {
                // 返回值

                result.positions.pop()
                let ellipsoid = Cesium.Ellipsoid.WGS84;

                for (let i = 0; i < result.positions.length; i++) {
                    let cartesian = new Cesium.Cartesian3(
                        result.positions[i].x,
                        result.positions[i].y,
                        result.positions[i].z
                    );
                    let cartographic = ellipsoid.cartesianToCartographic(cartesian);
                    let lat = Cesium.Math.toDegrees(cartographic.latitude);
                    let lng = Cesium.Math.toDegrees(cartographic.longitude);
                    this.resultList.push({
                        lat: lat,
                        lng: lng
                    });
                }
                this.controlClipping(modelType)
                this.drawHandler && this.drawHandler.clear();
                this.drawClicked = false
            });
        }
    }
    /**
    * 控制内外切
    * @param {String} [modelType] - 控制内外切   '0'表示外切  '1'表示内切
    */
    controlClipping(modelType) {
        if (this.resultList.length === 0) return
        const unionClippingRegions = modelType === '0' ? true : false
        if (this.tileset) {
            this.tileset.clippingPlanes ? (this.tileset.clippingPlanes.removeAll(), this.tileset.clippingPlanes = undefined) : ''
        }
        this.drawList = this.isDirRes(this.resultList, unionClippingRegions)
        const Planes = []
        for (let i = 0; i < this.drawList.length; i++) {
            if (i === (this.drawList.length - 1)) {
                Planes.push(this.createPlane(this.drawList[i], this.drawList[0], this.inverseTransform))
            } else {
                Planes.push(this.createPlane(this.drawList[i], this.drawList[i + 1], this.inverseTransform))
            }
        }
        const PlaneCollection = new Cesium.ClippingPlaneCollection({
            planes: Planes,
            unionClippingRegions,
            edgeWidth: 1
        })
        this.tileset.clippingPlanes = PlaneCollection
    }
    /**
     * 获得取反矩阵
     * @private
     */
    getInverseTransform(tileSet) {
        let transform
        const tmp = tileSet.root.transform
        if ((tmp && tmp.equals(Cesium.Matrix4.IDENTITY)) || !tmp) {
            transform = Cesium.Transforms.eastNorthUpToFixedFrame(tileSet.boundingSphere.center)
        } else {
            transform = Cesium.Matrix4.fromArray(tileSet.root.transform)
        }
        return Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4())
    }

    /**
     * 创建裁剪面
     * @param p1 起始点
     * @param p2 结束点
     * @param inverseTransform 矩阵
     * @returns {*} ClippingPlane裁剪面（面法向量，点到面的垂直距离）
     * @private
     */
    createPlane(p1, p2, inverseTransform) {
        // 将仅包含经纬度信息的p1,p2，转换为相应坐标系的cartesian3对象
        const p1C3 = this.getOriginCoordinateSystemPoint(p1, inverseTransform)
        const p2C3 = this.getOriginCoordinateSystemPoint(p2, inverseTransform)

        // 定义一个垂直向上的向量up
        const up = new Cesium.Cartesian3(0, 0, 10)
        //  right 实际上就是由p1指向p2的向量
        const right = Cesium.Cartesian3.subtract(p2C3, p1C3, new Cesium.Cartesian3())

        // 计算normal， right叉乘up，得到平面法向量，这个法向量指向right的右侧
        let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3())
        normal = Cesium.Cartesian3.normalize(normal, normal)

        // 由于已经获得了法向量和过平面的一点，因此可以直接构造Plane,并进一步构造ClippingPlane
        const planeTmp = Cesium.Plane.fromPointNormal(p1C3, normal)
        return Cesium.ClippingPlane.fromPlane(planeTmp)
    }

    /**
     * 对点进行坐标转换
     * @param point 点坐标 数组形式
     * @param inverseTransform 转换矩阵
     * @returns {*} ClippingPlane 裁切面
     * @private
     */
    getOriginCoordinateSystemPoint(point, inverseTransform) {
        const val = Cesium.Cartesian3.fromDegrees(point.lng, point.lat)
        return Cesium.Matrix4.multiplyByPoint(
            inverseTransform, val, new Cesium.Cartesian3(0, 0, 0))
    }
    /**
     * 清空裁切面
     * @private
     */
    clearGeologyClipPlan() {
        if (this.clipEntity) {
            this._viewer.entities.remove(this.clipEntity)
        }
        if (this.tileset) {
            this.tileset.clippingPlanes ? (this.tileset.clippingPlanes.removeAll(), this.tileset.clippingPlanes = undefined) : ''

        }
        this.drawList = []
        this.resultList = []
    }
    /**
     * 根据顺逆时针及内切外切返回相应裁切点
     * @private
     */
    isDirRes(polygon, isClockwise) {

        let lineStringList = [];
        polygon.forEach((p) => {
            lineStringList.push([p.lng, p.lat]);
        });

        let isR = this.getPolygonDirection(lineStringList)
        let points = [];
        if (isClockwise) {
            if (isR) {
                points = polygon
            } else {
                let count = 0;
                for (let ii = polygon.length - 1; ii >= 0; ii--) {
                    points[count] = polygon[ii];
                    count++;
                }
            }
        } else {
            if (!isR) {
                points = polygon
            } else {
                let count = 0;
                for (let ii = polygon.length - 1; ii >= 0; ii--) {
                    points[count] = polygon[ii];
                    count++;
                }
            }
        }
        return points
    }

    /**
     * 判断多边形顺逆时针
     * @private
     */
    getPolygonDirection(coords) {
        const len = coords.length
        let s = coords[len - 1][0] * coords[0][1] - coords[len - 1][1] * coords[0][0]
        for (let i = 1; i < len; i++) {
            s += coords[i - 1][0] * coords[i][1] - coords[i - 1][1] * coords[i][0]
        }
        if (s > 0) {
            return false
        } else {
            return true
        }
    }

}

export default TilesetPlanClip;
