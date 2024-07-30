import Analyse from "./base/analyse";
import * as Cesium from "cesium";
import * as turf from "@turf/turf";
import { soilMaterial, solideSoilMaterial } from "../util/base64Image"




/**
 * 地形开挖
 */
class TerrainExcavation extends Analyse {

   
    _viewer;






    /**
     * 地形开挖入参
     * @param {Viewer} viewer - viewer实例
     * @param {Object} [options] - 参数对象
     * @param {Array<Position> | Array<Object>} [options.positions] - 三维坐标数组
     * @param {Number} [options.height] - 墙体地板与地球的高度，单位：米
     * @param {Number} [options.autoFocus=true] - 计算完成自动聚焦，默认true:自动聚焦，false:停止自动聚焦
     */
    constructor(viewer, options) {
        super();
        this.init(viewer, options);
    }

    /**
     * 初始化
     * @private
     * @param {*} viewer 
     * @param {*} options 
     */
    init (viewer, options = {
        autoFocus: true,
    }) {
        this._viewer = viewer._viewer;
        this.options = options;
        this._height = this.options.height;
        this.bottomImg = this.options.bottomMap || solideSoilMaterial;
        this.wallImg = this.options.wallMap || soilMaterial;

        if (!Cesium.defined(this._viewer)) throw new Cesium.DeveloperError('viewer不存在.');
        if (!Cesium.defined(this._viewer.terrainProvider)) throw new Cesium.DeveloperError('terrainProvider不存在,此功能需要地形数据支持.');
        if (!Cesium.defined(this.options.positions) || this.options.positions.length < 3) throw new Cesium.DeveloperError('positions参数异常.');
        if (!Cesium.defined(this.options.height)) throw new Cesium.DeveloperError('height参数异常.');
        this.draw()
    }


    /**
     * 绘制效果
     */
    draw () {

        if (!TerrainExcavation.isDefineProperties) {
            Object.defineProperties(TerrainExcavation.prototype, {
                show: {
                    get: function () {
                        return this._show
                    },
                    set: function (e) {
                        this._show = e, this._viewer.scene.globe.clippingPlanes && (this._viewer.scene.globe.clippingPlanes.enabled = e), this._switchExcavate(e)
                    }
                },

                height: {
                    get: function () {
                        return this._height
                    },
                    set: function (e) {
                        this._height = e, this._updateExcavateDepth(e)
                    }
                }
            })
            TerrainExcavation.isDefineProperties = true;
        }

        this.options.positions && this.options.positions.length > 0 && this.updateData(this.options.positions);
    }
    /**
        * @private
        */
    updateData (e) {

        var plane = [];
        var i = e.length - 1;
        var a = new Cesium.Cartesian3;
        var n = Cesium.Cartesian3.subtract(e[0], e[1], a);
        n = n.x > 0, this.excavateMinHeight = 9999;

        for (var r = 0; r < i; ++r) {

            var s = (r + 1) % i;
            var u = Cesium.Cartographic.fromCartesian(e[r]);
            var c = this._viewer.scene.globe.getHeight(u) || u.height;
            c < this.excavateMinHeight && (this.excavateMinHeight = c);

            var midpoint = Cesium.Cartesian3.add(e[r], e[s], new Cesium.Cartesian3());
            midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);

            var up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3());
            var right = Cesium.Cartesian3.subtract(e[s], midpoint, new Cesium.Cartesian3());
            right = Cesium.Cartesian3.normalize(right, right);

            var normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
            normal = Cesium.Cartesian3.normalize(normal, normal);

            var originCenteredPlane = new Cesium.Plane(normal, 0.0);
            var distance = Cesium.Plane.getPointDistance(originCenteredPlane, midpoint);

            plane.push(new Cesium.ClippingPlane(normal, distance));
        }


        this._viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: plane,
            edgeWidth: 1,
            edgeColor: Cesium.Color.fromCssColorString("#fff").withAlpha(0.3),
            enabled: true
        });
        this._prepareWell(e);
        this._createWell(this.wellData);
       
    }


    /**
     * 清空
     */
    clear () {
        if (this._viewer.scene.globe.clippingPlanes) {
            this._viewer.scene.globe.clippingPlanes.enabled = false;
            if (this._viewer.scene.globe.clippingPlanes.isDestroyed()) {
                this._viewer.scene.globe.clippingPlanes = void 0;
                this._viewer.scene.globe.clippingPlanes.removeAll();
                this._viewer.scene.globe.clippingPlanes.destroy();

            }
            this.bottomSurface && this._viewer.scene.primitives.remove(this.bottomSurface);
            this.wellWall && this._viewer.scene.primitives.remove(this.wellWall);
            this.bottomSurface = undefined;
            this.wellWall = undefined;
            this._viewer.scene.render()
        }
    }
    /**
       * @private
       */
    _prepareWell (e) {
        let t = Cesium.defaultValue(1000, 50);// 剖切面插值,
        let i = e.length;
        let a = this.excavateMinHeight - this.height;
        let n = [];
        let r = [];
        let s = [];
        if (0 != i) {
            for (let l = 0; l < i; l++) {
                let u = l == i - 1 ? 0 : l + 1,
                    c = Cesium.Cartographic.fromCartesian(e[l]),
                    d = Cesium.Cartographic.fromCartesian(e[u]),
                    h = [c.longitude, c.latitude],
                    f = [d.longitude, d.latitude];

                0 == l && (
                    s.push(new Cesium.Cartographic(h[0], h[1])),
                    r.push(Cesium.Cartesian3.fromRadians(h[0], h[1], a)),
                    n.push(Cesium.Cartesian3.fromRadians(h[0], h[1], 0)));

                for (let p = 1; p <= t; p++) {
                    let m = Cesium.Math.lerp(h[0], f[0], p / t),
                        g = Cesium.Math.lerp(h[1], f[1], p / t);
                    l == i - 1 && p == t || (
                        s.push(new Cesium.Cartographic(m, g)),
                        r.push(Cesium.Cartesian3.fromRadians(m, g, a)),
                        n.push(Cesium.Cartesian3.fromRadians(m, g, 0)))
                }
            }
            this.wellData = {
                lerp_pos: s,
                bottom_pos: r,
                no_height_top: n
            }
        }
    }
    /**
       * @private
       */
    _createWell (e) {
        if (Boolean(this._viewer.terrainProvider._layers)) {
            var t = this;
            this._createBottomSurface(e.bottom_pos);
            var promise = Cesium.sampleTerrainMostDetailed(this._viewer.terrainProvider, e.lerp_pos);
            Promise.resolve(promise).then((updatedPositions) => {
                for (var a = updatedPositions.length, n = [], r = 0; r < a; r++) {
                    var s = Cesium.Cartesian3.fromRadians(updatedPositions[r].longitude, updatedPositions[r].latitude, updatedPositions[r].height);
                    n.push(s)
                }
                t._createWellWall(e.bottom_pos, n)
            })
        } else {
            this._createBottomSurface(e.bottom_pos);
            this._createWellWall(e.bottom_pos, e.no_height_top)
        }
    }

    /**
       * @private
       */
    _getMinHeight (e) {
        let minHeight = 5000000;
        let minPoint = null;
        for (let i = 0; i < e.length; i++) {
            let height = e[i]['z'];
            if (height < minHeight) {
                minHeight = height;
                minPoint = this._ellipsoidToLonLat(e[i]);
            }
        }
        return minPoint.altitude;
    }

    /**
       * @private
       */
    _ellipsoidToLonLat (c) {
        let ellipsoid = this._viewer.scene.globe.ellipsoid;
        let cartesian3 = new Cesium.Cartesian3(c.x, c.y, c.z);
        let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        let alt = cartographic.height;
        return {
            longitude: lng,
            latitude: lat,
            altitude: alt
        }
    }
    /**
   * @private
   */
    _createBottomSurface (e) {
        if (e.length) {
            let minHeight = this._getMinHeight(e);
            let positions = [];
            for (let i = 0; i < e.length; i++) {
                let p = this._ellipsoidToLonLat(e[i]);
                positions.push(p.longitude);
                positions.push(p.latitude);
                positions.push(minHeight);
            }

            let polygon = new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(
                    Cesium.Cartesian3.fromDegreesArrayHeights(positions)
                ),
                perPositionHeight: true,
                closeBottom: false
            });
            let geometry = Cesium.PolygonGeometry.createGeometry(polygon);


            var material = new Cesium.Material({
                fabric: {
                    type: "Image",
                    uniforms: {
                        image: this.bottomImg,
                        strength: 0.1
                    }
                }
            });
            let materialAppearance = new Cesium.MaterialAppearance({
                translucent: false,
                flat: true,
                material: material
            });
            this.bottomSurface = new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: geometry
                }),
                appearance: materialAppearance,
                asynchronous: false
            });
            this._viewer.scene.primitives.add(this.bottomSurface);

            this.options.autoFocus && this._viewer.camera.flyToBoundingSphere(
                new Cesium.BoundingSphere(this.sum(this.options.positions), 2800),
            );
        }
    }
    /**
      * @private
      */
    sum (arr) {
        let s = {
            x: 0,
            y: 0,
            z: 0
        }
        arr.forEach(function (value) {
            s.x += value.x;
            s.y += value.y;
            s.z += value.z;
        });
        return {
            x: s.x / arr.length,
            y: s.y / arr.length,
            z: s.z / arr.length
        };
    }

    /**
       * @private
       */
    _createWellWall (e, t) {
        let minHeight = this._getMinHeight(e);
        let maxHeights = [];
        let minHeights = [];
        for (let i = 0; i < t.length; i++) {
            maxHeights.push(this._ellipsoidToLonLat(t[i]).altitude);
            minHeights.push(minHeight);
        }
        let wall = new Cesium.WallGeometry({
            positions: t,
            maximumHeights: maxHeights,
            minimumHeights: minHeights,
        });
        let geometry = Cesium.WallGeometry.createGeometry(wall);
        let material = new Cesium.Material({
            fabric: {
                type: "Image",
                uniforms: {
                    image: this.wallImg
                }
            }
        });
        let naterialAppearance = new Cesium.MaterialAppearance({
            translucent: false,
            flat: true,
            material: material
        });
        this.wellWall = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: geometry,
                attributes: { color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREY) },
                id: "PitWall"
            }),
            appearance: naterialAppearance,
            asynchronous: false
        });
        this._viewer.scene.primitives.add(this.wellWall)
    }
    /**
   * @private
   */
    _switchExcavate (e) {
        e ? (this._viewer.scene.globe.material = Cesium.Material.fromType("WaJue"), this.wellWall.show = true, this.bottomSurface.show = true) : (this._viewer.scene.globe.material = null, this.wellWall.show = false, this.bottomSurface.show = false)
    }

    /**
     * @private
     */
    _updateExcavateDepth (e) {
        this.bottomSurface && this._viewer.scene.primitives.remove(this.bottomSurface), this.wellWall && this._viewer.scene.primitives.remove(this.wellWall);
        for (var t = this.wellData.lerp_pos, i = [], a = t.length, n = 0; n < a; n++) {
            i.push(Cesium.Cartesian3.fromRadians(t[n].longitude, t[n].latitude, this.excavateMinHeight - e));
        }
        this.wellData.bottom_pos = i, this._createWell(this.wellData), this._viewer.scene.primitives.add(this.bottomSurface), this._viewer.scene.primitives.add(this.wellWall)
    }
}

export default TerrainExcavation;
