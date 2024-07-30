import { followView } from './setMatrix';
import * as Cesium from 'cesium';
let entity;
let V = '';
let view = 'none';
let promise;
let myTimes;
let myPoints;
let timeOfResolution;
// 自定义控制模型视角Cesium.Cartesian3
let xyz = [];
//  第一视角跟随模型视角Cesium.Cartesian3
let firstRoamXYZ = [-100, 0, 10];
// 上帝视角跟随模型视角Cesium.Cartesian3
let godRoamXYZ = [-1, 0, 100];
/**
* 贴地表漫游
*/
class pathRoam {
    /**
    * 构造函数
    * @param {*} viewer -地图主窗口
    */
    constructor(viewer) {
        V = viewer
    }
    setModel(path, trackShow, modelShow, maxSize, minSize, scale, width, clockRange, multiplier) {
        let times = [];
        let positions = [];
        let hasHeight = false
        // 设置运动到中途点的时间和对应的位置
        for (let i = 0; i < myTimes.length; i++) {
            hasHeight = myPoints[i].length === 3
            times[i] = Cesium.JulianDate.fromIso8601(myTimes[i]);
            positions[i] = Cesium.Cartesian3.fromDegrees(...myPoints[i]);
        }
        let stTime = times[0];
        let endTime = times[times.length - 1];
        let start = stTime.clone();
        let stop = endTime.clone();
        let availability = new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({
                start: start,
                stop: stop,
            }),
        ])
        this.availability = availability;
        this.positions = positions;
        V.clock.multiplier = multiplier || 30;
        V.clock.startTime = start.clone();
        V.clock.stopTime = stop.clone();
        V.clock.currentTime = start.clone();
        // 运动循环反复
        V.clock.clockRange = clockRange === undefined ? Cesium.ClockRange.LOOP_STOP : clockRange;
        let oriSamples = new Cesium.SampledProperty(Cesium.Cartesian3);
        // 添加插值样本数组
        oriSamples.addSamples(times, positions);
        // 获取起始的时间差,单位：秒
        let samplesNum = Math.floor(
            Cesium.JulianDate.secondsDifference(endTime, stTime) / timeOfResolution
        );
        let sampledPositions = [];
        let sampledTimes = [];
        let sampleTime;
        for (let i = 0; i < samplesNum + 1; i++) {
            // 将提供的秒数添加到提供的日期实例中
            sampleTime = Cesium.JulianDate.addSeconds(
                stTime,
                i * timeOfResolution,
                new Cesium.JulianDate()
            );
            // 获取对应时间里面的位置坐标数据
            sampledPositions.push(oriSamples.getValue(sampleTime));
            sampledTimes.push(sampleTime);
        }
        let positionProperty = new Cesium.SampledPositionProperty();

        this.positionProperty = positionProperty;
        function createEntity(positions) {
            for (let i = 0; i < samplesNum + 1; i++) {
                positionProperty.addSample(
                    sampledTimes[i],
                    positions[i]
                );
            }
            entity = V.entities.add({
                //设置实体的可见性
                availability: availability,
                position: positionProperty,
                //计算移动方向
                orientation: new Cesium.VelocityOrientationProperty(positionProperty),
                model: {
                    uri: path,
                    minimumPixelSize: minSize,
                    maximumPixelSize: maxSize,
                    show: modelShow,
                    scale: scale || 1.0
                },
                //移动轨迹
                // path: {
                //     material: new Cesium.PolylineGlowMaterialProperty({
                //         glowPower: 0.1,
                //         color: Cesium.Color.GREEN,
                //     }),
                //     width: 40,
                //     leadTime: 10,
                //     trailTime: 1000,
                //     resolution: 2,
                //     show: trackShow,
                // },
                polyline: {
                    positions: positions,
                    clampToGround: true,
                    material: new Cesium.PolylineGlowMaterialProperty({
                        glowPower: 0.1,
                        color: Cesium.Color.GREEN,
                    }),
                    width: width || 20,
                    show: trackShow,
                },
                viewFrom: new Cesium.Cartesian3(-80.0, 0.0, 90.0),
            });
        }
        if (hasHeight) {
            createEntity(sampledPositions);
            return new Promise((resolve) => { resolve('1') })
        } else {
            promise = V.scene.clampToHeightMostDetailed(sampledPositions);
            promise.then((newPositions) => {
                createEntity(newPositions);
            });
            return promise;
        }
    }

    /**
    * 贴地表漫游初始化方法
    * @param {Object} parameter -贴地表漫游默认配置项
    * @param {String} parameter.modelPath -模型存放路径
    * @param {Array} parameter.modelGoTime -模型中途点时间数组
    * @param {Array} parameter.modelGoPoints -模型中途点位置坐标数组
    * @param {Boolean} [parameter.showModel] -模型是否显示，默认为true
    * @param {Boolean} [parameter.showTrack] -运动轨迹是否显示，默认为true
    * @param {Number} [parameter.smooth] -模型运动路径平滑程度，值为正整数，值越小越平滑，默认为2
    * @param {Number} [parameter.minSize] -模型的最小显示像素大小，默认64
    * @param {Number} [parameter.maxSize] -模型的最大显示像素大小，默认128
    */
    start(parameter) {
        V.clock.shouldAnimate = true;
        this.firstView();
        if (!entity) {
            timeOfResolution = parameter.smooth || 10;
            myTimes = parameter.modelGoTime;
            myPoints = parameter.modelGoPoints;
            let showM = parameter.showModel != undefined ? parameter.showModel : true;
            let showT = parameter.showTrack != undefined ? parameter.showTrack : true;
            return this.setModel(parameter.modelPath, showT, showM, parameter.maxSize || 64, parameter.maxSize || 128, parameter.scale, parameter.lineWidth, parameter.clockRange, parameter.multiplier);
        }
    }
    // 第一视角跟随
    firstView() {
        if (this.preUpdate) {
            V.scene.preUpdate.removeEventListener(this.preUpdate);
        }
        V.scene.preUpdate.addEventListener(this.preUpdate = () => { //设置相机相对于
            if (entity && view != 'none') {
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
    * 贴地表漫游暂停方法
    */
    stop() {
        V.clock.shouldAnimate = false;
        V.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }
    /**
    * 贴地表漫游销毁方法
    */
    quit() {
        V.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        V.clock.multiplier = 1;
        V.entities.remove(entity);
        entity = '';
        view = 'none'
    }

    cancelAnimation(flag) {
        if (flag) {
            entity.availability = undefined
            entity.position = this.positions[this.positions.length - 1]
        } else {
            entity.availability = this.availability
            entity.position = this.positionProperty
        }
    }

    getEntity() {
        return entity
    }
}
export default pathRoam