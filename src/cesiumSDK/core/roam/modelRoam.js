import * as Cesium from 'cesium';
import { followView } from './setMatrix';
let entity;
let V = '';
let speed = 0;
let myPositions;
let view = 'none';
// 自定义控制模型视角Cesium.Cartesian3
let xyz = [];
// 上帝视角跟随模型视角Cesium.Cartesian3
let firstRoamXYZ = [-0.1, 0, 0];
/**
* 路径漫游
*/
class modelRoam {
    /**
   * 构造函数
   * @param {*} viewer -cesium的viewer对象
   */
    constructor(viewer) {
        V = viewer;
    }
    setModel(path, modelShow, trackShow, maxSize, minSize) {
        //设置地图窗口时间
        let start = Cesium.JulianDate.fromDate(new Date());
        let stop = Cesium.JulianDate.addSeconds(
            start,
            myPositions.length - 1,
            new Cesium.JulianDate()
        );
        V.clock.startTime = start;
        V.clock.stopTime = stop;
        V.clock.currentTime = start;
        // 到尽头后消失
        V.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
        V.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        // 控制加速倍率
        V.clock.multiplier = speed;
        // V.timeline.zoomTo(start, stop);
        // 设置时间条的时间范围
        let position = this.computerPostion(start);
        entity = V.entities.add({
            //设置实体的可见性
            availability: new Cesium.TimeIntervalCollection([
                new Cesium.TimeInterval({
                    start: start,
                    stop: stop,
                }),
            ]),
            position,
            //计算移动方向
            orientation: new Cesium.VelocityOrientationProperty(position),
            model: {
                uri: path,
                minimumPixelSize: minSize,
                maximumPixelSize: maxSize,
                show: modelShow,
            },
            //移动轨迹
            path: {
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.GREEN,
                }),
                width: 16,
                show: trackShow
            },
        });
    }
    computerPostion(start) {
        let property = new Cesium.SampledPositionProperty();
        //设置插值方法
        property.setInterpolationOptions({
            interpolationDegree: 0,
            interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
        });
        for (let i = 0; i < myPositions.length; i++) {
            let time = Cesium.JulianDate.addSeconds(
                start,
                i,
                new Cesium.JulianDate()
            );
            let position = Cesium.Cartesian3.fromDegrees(
                myPositions[i][0],
                myPositions[i][1],
                myPositions[i][2],
            );
            property.addSample(time, position);
        }
        return property;
    }
    /**
    * 路径漫游初始化方法
    * @param {Object} parameter -贴地表漫游默认配置项
    * @param {String} parameter.modelPath -模型存放路径
    * @param {Array} parameter.modelPoints -模型运动路径经纬度高程坐标叔祖
    * @param {Number} parameter.speed -漫游速度，默认为0.1
    * @param {Boolean} [parameter.showModel] -模型是否显示，默认为true
    * @param {Boolean} [parameter.showTrack] -运动轨迹是否显示，默认为true
    * @param {Number} [parameter.minSize] -模型的最小显示像素大小，默认64
    * @param {Number} [parameter.maxSize] -模型的最大显示像素大小，默认128
    */
    start(parameter) {
        V.clock.shouldAnimate = true;
        this.firstView();
        if (!entity) {
            speed = parameter.speed || 0.1;
            myPositions = parameter.modelPoints;
            let showM = parameter.showModel != undefined ? parameter.showModel : true;
            let showT = parameter.showTrack != undefined ? parameter.showTrack : true;
            this.setModel(parameter.modelPath, showM, showT, parameter.maxSize || 20, parameter.maxSize || 50);
            return entity;
        }
    }
    // 第一视角跟随
    firstView() {
        if (this.preUpdate) {
            V.scene.preUpdate.removeEventListener(this.preUpdate);
        }
        V.scene.preUpdate.addEventListener(this.preUpdate = () => {
            if (entity && view == 'first') {
                // 根据局部坐标设置相机位置
                V.scene.camera.lookAtTransform(
                    new followView().setMatrix(entity, V.clock.currentTime),
                    new Cesium.Cartesian3(...xyz)
                );
            }
        });
    }
    /**
    * 漫游视角切换方法
    * @param {String} value -value为'first'为第一视角，'god'为上帝视角，'definition'为自定义视角，'none'为取消视角跟随
    * @param {Array} newModelXYZ -自定义视角时可用，通过[x(相机在模型前后),y(相机在模型左右),z(相机在模型上下)]设置视角相机位置
    */
    changeView(value, newModelXYZ) {
        view = value;
        if (value == 'first') {
            // 更新相机位置（第一视角）
            xyz = firstRoamXYZ;
        } else if (value == 'god') {
            // 更新相机位置（上帝视角）
            xyz = godRoamXYZ;
        } else if (value == 'definition') {
            xyz = newModelXYZ;
        }
    }
    /**
    * 贴模型漫游暂停方法
    */
    stop() {
        view = false;
        V.clock.shouldAnimate = false;
        V.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }
    /**
    * 路径漫游销毁方法stop()
    */
    quit() {
        // 移除模型移动事件
        this.stop();
        V.entities.remove(entity);
        entity = '';
        view = false;
    }
}
export default modelRoam