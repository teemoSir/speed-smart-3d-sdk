import Analyse from "./base/analyse";
import * as Cesium from "cesium";
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

let addDivDom
let tipEntity = undefined
let polyline = undefined;
let toolTipBox = null
let ele

/**
 * 剖面分析
 */
class Profile extends Analyse {
    _viewer;
    /**
     * 剖面参数
     * @param {Viewer} viewer - viewer实例
     */
    constructor(viewer) {
        super();
        this.init(viewer);
    }

    /**
     * 初始化
     * @private
     * @param {*} viewer 
     * @param {*} options 
     */
    init(viewer) {
        this._viewer = viewer._viewer;
        if (!Cesium.defined(this._viewer)) throw new Cesium.DeveloperError('viewer不存在.');
    }
    /**
     * 绘制分析的贴底线
     * @param {Function} callback 绘制完成的回调
     * @param {Object} options 线条的参数
     */
    draw(callback, options) {

        if (!this._viewer) throw new Error("no viewer object!");
        this._viewer.scene.globe.depthTestAgainstTerrain = false
        options = options || {};
        let id = options.id || this.setSessionid();
        if (this._viewer.entities.getById(id))
            throw new Error("the id parameter is an unique value");
        let material = options.material || new Cesium.PolylineOutlineMaterialProperty({
            color: Cesium.Color.fromCssColorString('#FFFFFFF'),
            outlineWidth: 2,
            outlineColor: Cesium.Color.fromCssColorString('#01D0FD')
        });
        let width = options.width || 4;
        const handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas);
        let toolTip = "左键点击开始绘制";
        let anchorpoints = [];

        let that = this

        handler.setInputAction(function (event) {
            toolTip = "左键添加点，右键结束绘制";
            let pixPos = event.position;
            let cartesian = that.getCatesian3FromPX(pixPos);
            if (anchorpoints.length == 0) {
                anchorpoints.push(cartesian);
                polyline = that._viewer.entities.add({
                    name: "Polyline",
                    id: id,
                    polyline: {
                        positions: new Cesium.CallbackProperty(function () {
                            return anchorpoints;
                        }, false),
                        width: width,
                        material: material,
                        clampToGround: true
                    },
                });
                polyline.GeoType = "Polyline";
            }
            anchorpoints.push(cartesian);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(function (movement) {
            let endPos = movement.endPosition;
            if (Cesium.defined(polyline)) {
                anchorpoints.pop();
                let cartesian = that.getCatesian3FromPX(endPos);
                anchorpoints.push(cartesian);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.setInputAction(function (event) {
            anchorpoints.pop();
            polyline.pottingPoint = anchorpoints;
            handler.destroy();
            // pointList = []
            // pointList.push(polyline)
            if (typeof callback == "function") callback(polyline);
        }, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
    }
    /**
     * 坐标转换 屏幕坐标转笛卡尔坐标
     * @private
     * @param {Number} px 屏幕坐标
     * @returns {Object} Cartesian3 三维位置坐标
     */
    getCatesian3FromPX(px) {
        let picks = this._viewer.scene.drillPick(px);
        let cartesian = null;
        let isOn3dtiles = false,
            isOnTerrain = false;
        // drillPick
        for (let i in picks) {
            let pick = picks[i];
            if (
                (pick && pick.primitive instanceof Cesium.Cesium3DTileFeature) ||
                (pick && pick.primitive instanceof Cesium.Cesium3DTileset) ||
                (pick && pick.primitive instanceof Cesium.Model)
            ) {
                //模型上拾取
                isOn3dtiles = true;
            }
            // 3dtilset
            if (isOn3dtiles) {
                this._viewer.scene.pick(px);
                cartesian = this._viewer.scene.pickPosition(px);
                if (cartesian) {
                    let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    if (cartographic.height < 0) cartographic.height = 0;
                    let lon = Cesium.Math.toDegrees(cartographic.longitude),
                        lat = Cesium.Math.toDegrees(cartographic.latitude),
                        height = cartographic.height;
                    cartesian = this.transformWGS84ToCartesian({
                        lng: lon,
                        lat: lat,
                        alt: height,
                    });
                }
            }
        }
        // 地形
        let boolTerrain =
            this._viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider;
        // Terrain
        if (!isOn3dtiles && !boolTerrain) {
            let ray = this._viewer.scene.camera.getPickRay(px);
            if (!ray) return null;
            cartesian = this._viewer.scene.globe.pick(ray, this._viewer.scene);
            isOnTerrain = true;
        }
        // 地球
        if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
            cartesian = this._viewer.scene.camera.pickEllipsoid(
                px,
                this._viewer.scene.globe.ellipsoid
            );
        }
        if (cartesian) {
            let position = this.transformCartesianToWGS84(cartesian);
            if (position.alt < 0) {
                cartesian = this.transformWGS84ToCartesian(position, 0.1);
            }
            return cartesian;
        }
        return false;
    }

    /**
     * 坐标转换 84转笛卡尔
     * @private
     * @param {Object} {lng,lat,alt} 地理坐标
     * @returns {Object} Cartesian3 三维位置坐标
     */
    transformWGS84ToCartesian(position, alt) {
        return position
            ? Cesium.Cartesian3.fromDegrees(
                position.lng || position.lon,
                position.lat,
                (position.alt = alt || position.alt),
                Cesium.Ellipsoid.WGS84
            )
            : Cesium.Cartesian3.ZERO;
    }

    /**
     * 坐标转换 笛卡尔转84
     * @private
     * @param {Object} Cartesian3 三维位置坐标
     * @returns {Object} {lng,lat,alt} 地理坐标
     */
    transformCartesianToWGS84(cartesian) {
        let ellipsoid = Cesium.Ellipsoid.WGS84;
        let cartographic = ellipsoid.cartesianToCartographic(cartesian);
        return {
            lng: Cesium.Math.toDegrees(cartographic.longitude),
            lat: Cesium.Math.toDegrees(cartographic.latitude),
            alt: cartographic.height,
        };
    }
    /**
     * 随机生成id
     * @private
     * @param {Number} num id长度
     * @returns {String} 随机id
     */
    setSessionid(num) {
        let len = num || 32;
        let chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
        let maxPos = chars.length;
        let pwd = "";
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
    /**
     * 生成剖面插值
     * @param {Array} positions 绘制所得的线的点位
     * @param {Number} modelOrTerrain 区分在模型还是在地形 0 在模型  1 在地形
     * @returns {Array} 插值点位信息数组 包括经纬度 高程 距离
     */
    interPoints(positions, modelOrTerrain) {
        if (positions.length == 0) {
            ElMessage({
                message: '请先绘制剖面线',
                type: 'warning',
            })
        }
        let positionsCartographic = [];
        let terrainSamplePositions = [];
        let pottingPoint = positions.pottingPoint
        for (let index = 0; index < pottingPoint.length; index++) {
            const element = pottingPoint[index];
            let ellipsoid = this._viewer.scene.globe.ellipsoid;
            let cartographic = ellipsoid.cartesianToCartographic(element);
            positionsCartographic.push(cartographic);
        }
        for (let i = 0; i < positionsCartographic.length; i++) {
            const m_Cartographic0 = positionsCartographic[i];
            const m_Cartographic1 = positionsCartographic[i + 1];
            if (m_Cartographic1) {
                let a =
                    Math.abs(m_Cartographic0.longitude - m_Cartographic1.longitude) *
                    10000000;
                let b =
                    Math.abs(m_Cartographic0.latitude - m_Cartographic1.latitude) *
                    10000000;
                //等距采样
                if (a > b) b = a;
                let length = parseInt(b / 2);
                if (length > 1000) length = 1000;
                if (length < 2) length = 2;
                for (let j = 0; j < length; j++) {
                    terrainSamplePositions.push(
                        new Cesium.Cartographic(
                            Cesium.Math.lerp(
                                m_Cartographic0.longitude,
                                m_Cartographic1.longitude,
                                j / (length - 1)
                            ),
                            Cesium.Math.lerp(
                                m_Cartographic0.latitude,
                                m_Cartographic1.latitude,
                                j / (length - 1)
                            )
                        )
                    );
                }
                terrainSamplePositions.pop();
            } else {
                terrainSamplePositions.push(m_Cartographic0);
            }
        }
        let positions_Inter = [];
        let distance = 0;
        for (let n = 0; n < terrainSamplePositions.length; n++) {
            //地理坐标（弧度）转经纬度坐标
            let curCartographic = terrainSamplePositions[n];
            let height
            if (modelOrTerrain === 0) {
                height = this._viewer.scene.sampleHeight(curCartographic, [pottingPoint]);
            } else {
                height = this._viewer.scene.globe.getHeight(curCartographic);
            }
            const lon = (curCartographic.longitude / Math.PI) * 180;
            const lat = (curCartographic.latitude / Math.PI) * 180;
            let point = Cesium.Cartesian3.fromDegrees(lon, lat, height);
            let preCartographic = terrainSamplePositions[n - 1];
            if (preCartographic) {
                const lon1 = (preCartographic.longitude / Math.PI) * 180;
                const lat1 = (preCartographic.latitude / Math.PI) * 180;
                let point1 = Cesium.Cartesian3.fromDegrees(lon1, lat1, height);
                let curDis = Cesium.Cartesian3.distance(point1, point);
                distance += curDis;
            }
            positions_Inter.push({
                position: { lon: lon, lat: lat, height: height },
                distance: distance,
            });
        }
        return positions_Inter;
    }
    /**
     * 生成鼠标移入echart时与地图联动的提示框
     * @private
     * @param {Number} domId 提示框dom的id
     * @param {Array} position 经纬度
     * @param {Number} height 海拔
     */
    addDiv(domId, position, height) {
        let that = this

        addDivDom = document.createElement('div')

        // 2.在bodyDom节点的最后一个子节点前插入addDivDom节点
        let bodyDom = document.getElementsByClassName('cesium-viewer')[0]
        // bodyDom.insertBefore(addDivDom, bodyDom.lastChild) //跟下面两种都可以
        bodyDom.appendChild(addDivDom)

        // 3.设置弹出框容器的样式
        addDivDom.style.position = 'absolute'
        addDivDom.style.background = 'url("/img/speed3d/bg_box.png") no-repeat'
        addDivDom.style.width = '208px'
        addDivDom.style.height = '218px'

        addDivDom.id = domId
        addDivDom.innerHTML =
            `
        <div style="padding:32px 32px 50px 32px">
          <div style="
      font-size: 16px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      font-weight: 500;
      text-align: left;
      color: #ffffff;">当前点</div>
      <div style="display:flex; margin-top:20px">
        <div style="opacity: 0.65;
      font-size: 14px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      font-weight: 500;
      text-align: left;
      color: #f0f0f0;">纬度：</div>
        <div style="font-size: 14px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      font-weight: 500;
      text-align: left;
      color: #f0f0f0;">${position[0].toFixed(6)}</div>
        </div>
        <div style="display:flex; margin-top:20px">
        <div style="opacity: 0.65;
      font-size: 14px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      font-weight: 500;
      text-align: left;
      color: #f0f0f0;">经度：</div>
        <div style="font-size: 14px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      font-weight: 500;
      text-align: left;
      color: #f0f0f0;">${position[1].toFixed(6)}</div>
        </div>
        <div style="display:flex; margin-top:20px">
        <div style="opacity: 0.65;
      font-size: 14px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      font-weight: 500;
      text-align: left;
      color: #f0f0f0;">海拔：</div>
        <div style="font-size: 14px;
      font-family: Source Han Sans CN, Source Han Sans CN-Medium;
      font-weight: 500;
      text-align: left;
      color: #f0f0f0;">${height[1]}米</div>
        </div>
        </div>
        `

        this._viewer?.scene.preRender.addEventListener(function () {
            let nPosition = new Cesium.Cartographic(position[0], position[1], Number(height[1]))

            let cartesian = Cesium.Cartesian3.fromDegrees(
                nPosition.longitude,
                nPosition.latitude,
                nPosition.height
            )
            let winPosi = that.transPosition(cartesian)
            addDivDom.style.left = winPosi?.x - 104 + 'px'
            addDivDom.style.top = winPosi?.y - 270 + 'px'

        })
    }
    /**
     * 坐标转换 经纬度转屏幕坐标
     * @private
     * @param {Array} position 经纬度s
     * @returns {Object} 屏幕坐标对象
     */
    transPosition(position) {
        if (this._viewer) {
            return Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                this._viewer.scene,
                position
            )
        }
    }
    /**
     * 由插值点位生成echarts图
     * @param {Array} profileData 点位数组
     */
    initEcharts(profileData) {
        let that = this
        let datas = [],
            coords = []

        const pointsData = profileData
        const maxDistance = pointsData[pointsData.length - 1].distance
        let xAixMax = Math.ceil(maxDistance)
        for (let index = 0; index < pointsData.length; index++) {
            const element = pointsData[index]
            const curData = [
                element.distance?.toFixed(2),
                element.position.height?.toFixed(2)
            ]
            datas.push(curData)
            const curCoords = [element.position.lon, element.position.lat]
            coords.push(curCoords)
        }
        const pointOption = {
            show: true,
            image: require('@/assets/img/ic_dwd.png'),
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: 0.8

        }
        ele = document.getElementById('profile-echarts')

        let myChart = echarts.init(ele)


        let option = {
            title: {
                text: '高程',
                textStyle: {
                    color: '#01e8f3',
                    fontSize: 14,

                },
                left: "7",
                top: "10"
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    align: 'left'
                },
                formatter(params) {

                    const xy = coords[params[0].dataIndex]
                    const tipData = params[0]['data']
                    that.addDiv('tool-box', xy, tipData)
                    toolTipBox = document.getElementById('tool-box')
                    if (!tipEntity) {
                        tipEntity = that._viewer.entities.add({
                            position: Cesium.Cartesian3.fromDegrees(
                                xy[0],
                                xy[1],
                                Number(tipData[1])
                            ),
                            billboard: pointOption
                        })
                    } else {
                        if (toolTipBox) {
                            toolTipBox.remove()
                        }
                        tipEntity.position = Cesium.Cartesian3.fromDegrees(
                            xy[0],
                            xy[1],
                            Number(tipData[1])
                        )
                    }
                }
            },
            grid: {
                x: 40,
                x2: 50,
                y2: 24
            },
            calculable: true,
            xAxis: [
                {
                    type: 'value',
                    max: xAixMax,
                    scale: true,
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#f0f0f0'
                        }
                    },
                    name: '行程',
                    nameTextStyle: {
                        color: '#01e8f3',
                        fontSize: 14,
                        padding: [20, 0, 0, 0]
                    },
                    nameGap: 20,
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#f0f0f0'
                        }
                    }
                }
            ],
            series: [
                {
                    name: 'ProfileLine',
                    type: 'line',
                    data: datas,
                    smooth: true,
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: '#00FCFF'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0.1,
                                        color: 'rgba(0,252,255,0.50)'
                                    },
                                    {
                                        offset: 1,
                                        color: '#00a2ff'
                                    },

                                ],
                                false
                            ),
                        }
                    },
                }
            ]
        }
        myChart.setOption(option)
    }
    /**
     * 销毁剖面分析
     * @param {Function} callback 
     */
    destroy(callback) {
        if (tipEntity) {
            this._viewer.entities.remove(tipEntity)
            tipEntity = undefined
        }
        if (polyline) {
            this._viewer.entities.remove(polyline)
            polyline = undefined
        }
        if (toolTipBox) {
            document.getElementById("tool-box").remove()
            toolTipBox = null
        }
        if (ele) {
            if (typeof callback == "function") callback();
        }
    }
}

export default Profile;
