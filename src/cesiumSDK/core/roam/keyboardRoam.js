import * as Cesium from 'cesium';

// 定义事件组
let flags = {
    // 相机位置
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false,
    // 相机姿态
    lookUp: false,
    lookDown: false,
    lookLeft: false,
    lookRight: false,
    twistLeft: false,
    twistRight: false,
    centerDown: false,
    centerUp: false,
    centerRight: false,
    centerLeft: false,
    moveForward1: false,
    moveBackward1: false,
    // 缩放
    // zoomIn: false,
    // zoomOut: false
}
let V;
let cameraHeight;
let heading;
let pitch;
let roll;
let distancetemp;
let entity;
let centerPoint = { x: 0 };
let centerPoint1 = false;
let offset;
let funcTick;
/**
* 键盘漫游
*/
class keyboardRoam {
    /**
    * 键盘漫游加载方法
    * @param: 使用键盘控制地图漫游，相机位置：W：向前；S：向后；D：向右；A：向左；Q：升高；E：降低；相机姿态：↑：抬头；↓：低头；←：左转；→：右转；9：顺时针旋转；0：逆时针旋转
    * @param {Cesium.Viewer} viewer -cesium地图容器
    */
    start(viewer, setStep) {
        V = viewer;
        var that = this
        // 添加键盘监听事件
        document.addEventListener('keydown', this.down = function (e) {
            let flagName = that.getFlagFromKeyboard(e);
            if (typeof flagName !== 'undefined') {
                flags[flagName] = true;
            }
        }, false);
        // 相机将保持锁定在当前位置。此标志仅适用于2D和Columbus视图模式。
        V.scene.screenSpaceCameraController.enableTranslate = false;
        // 相机将锁定到当前标题。这个标志只适用于3D和哥伦布视图。
        V.scene.screenSpaceCameraController.enableTilt = false;
        document.addEventListener('keyup', this.up = function (e) {
            let flagName = that.getFlagFromKeyboard(e);
            if (typeof flagName !== 'undefined') {
                flags[flagName] = false;
            }
        }, false);
        funcTick = function as() {
            let camera = V.camera;
            let ellipsoid = V.scene.globe.ellipsoid;
            cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
            // 根据相机高度设置移动距离
            let moveRate = (cameraHeight / 150.0) * setStep;
            heading = V.camera.heading;
            pitch = V.camera.pitch;
            roll = V.camera.roll;
            // 根据事件调整相机
            // 相机的偏航角、翻滚角和俯仰角
            if (flags.lookUp) {
                camera.lookUp(0.01 * setStep);
            }
            if (flags.lookDown) {
                camera.lookDown(0.01 * setStep);
            }
            // if (flags.lookLeft) {
            //     camera.lookLeft();
            // }
            // if (flags.lookRight) {
            //     camera.lookRight();
            // }
            if (flags.twistLeft) {
                that.setC(-0.005 * setStep);
            }
            if (flags.twistRight) {
                that.setC(0.005 * setStep);
            }
            // 相机绕屏幕中心点旋转移动               
            if (flags.centerRight) {
                that.dad(-0.01 * setStep, 1);
            }
            if (flags.centerLeft) {
                that.dad(0.01 * setStep, 1);
            }
            if (flags.centerUp) {
                that.dad(-0.01 * setStep);
            }
            if (flags.centerDown) {
                that.dad(0.01 * setStep);
            }
            // 向中心点靠近
            if (flags.moveForward) {
                camera.moveForward(moveRate);
            }
            // 从中心点远离
            if (flags.moveBackward) {
                camera.moveBackward(moveRate);
            }
            // 相机本身前后左右上下平移              
            if (flags.moveUp) {
                camera.moveUp(moveRate);
            }
            if (flags.moveDown) {
                camera.moveDown(moveRate);
            }
            if (flags.moveLeft) {
                camera.moveLeft(moveRate);
            }
            if (flags.moveRight) {
                camera.moveRight(moveRate);
            }
            if (flags.moveForward1) {
                that.moveForward(moveRate)
            }
            // 从中心点远离
            if (flags.moveBackward1) {
                that.moveForward(-moveRate)
            }
            // 根据相机高度设置缩放参数
            // if (flags.zoomIn) {
            //     camera.zoomIn(cameraHeight / 2);
            // }
            // if (flags.zoomOut) {
            //     camera.zoomOut(cameraHeight / 2);
            // }
        };
        // 为每一帧添加监听事件
        let m = V.clock.onTick.addEventListener(funcTick);
        return m;
    }
    setC(h) {
        V.camera.setView({
            orientation: {
                heading: heading + h,
                pitch,
                roll
            }
        })
    }
    getCamera() {
        var position = V.scene.camera.positionCartographic;
        // 弧度转经纬度
        var longitude = Cesium.Math.toDegrees(position.longitude);
        var latitude = Cesium.Math.toDegrees(position.latitude);
        var height = position.height;
        return { lng: longitude, lat: latitude, h: height }
    }
    dad(s, i = 0) {
        // 添加实体
        let a = this.getCenterPosition();
        if (centerPoint1) {
        } else {
            let b = this.getCamera();
            entity = V.entities.add({
                position: new Cesium.Cartesian3.fromDegrees(a.lon, a.lat, 0),
                point: {
                    pixelSize: 0,
                    // show: false
                }
            });
            let clickPosition1 = Cesium.Cartesian3.fromDegrees(a.lon, a.lat, 0);
            let clickPosition2 = Cesium.Cartesian3.fromDegrees(b.lng, b.lat, b.h);
            // 计算两个点之间的距离
            distancetemp = Cesium.Cartesian3.distance(clickPosition1, clickPosition2);
        }
        if (i) {
            heading += s;
        } else {
            pitch += s;
        }
        offset = new Cesium.HeadingPitchRange(
            heading,
            pitch,
            distancetemp  // 相机距离地球球心的距离
        );
        V.zoomTo(entity, offset);
    }
    moveForward(distance) {
        //和模型的相机移动不太一样  不是沿着相机目标方向，而是默认向上方向 和 向右 方向的插值方向
        var camera = V.camera;
        var direction = camera.direction;
        //获得此位置默认的向上方向
        var up = Cesium.Cartesian3.normalize(camera.position, new Cesium.Cartesian3());
        var right = Cesium.Cartesian3.cross(direction, up, new Cesium.Cartesian3());
        direction = Cesium.Cartesian3.cross(up, right, new Cesium.Cartesian3());
        direction = Cesium.Cartesian3.normalize(direction, direction);
        direction = Cesium.Cartesian3.multiplyByScalar(direction, distance, direction);
        camera.position = Cesium.Cartesian3.add(camera.position, direction, camera.position);
    }
    getCenterPosition() {
        let centerResult = V.camera.pickEllipsoid(
            new Cesium.Cartesian2(
                V.canvas.clientWidth / 2,
                V.canvas.clientHeight / 2,
            ),
        )
        // 如果中心点没变
        if (centerPoint.x.toFixed(2) == centerResult.x.toFixed(2) && Cesium.defined(centerResult)) {
            centerPoint1 = true;
        } else {
            centerPoint = centerResult;
            centerPoint1 = false;
            let curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(centerResult);
            let curLongitude = (curPosition.longitude * 180) / Math.PI;
            let curLatitude = (curPosition.latitude * 180) / Math.PI;
            return {
                lon: curLongitude,
                lat: curLatitude,
            }
        }
    }
    getFlagFromKeyboard(k) {
        switch (k.key) {
            // 按字符的Unicode编码
            // 相机姿态 
            case 'ArrowUp':
                return 'lookUp';
            case 'ArrowDown':
                return 'lookDown';
            case 'ArrowLeft':
                return 'twistLeft';
            case 'ArrowRight':
                return 'twistRight';
            // 相机绕屏幕中心点旋转移动
            case 'i':
                return 'moveForward';
            case 'k':
                return 'moveBackward';
            case 'u':
                return 'centerUp';
            case 'o':
                return 'centerDown';
            case 'j':
                return 'centerRight';
            case 'l':
                return 'centerLeft';


            // 相机前后左右上下平移
            case 'w':
                return 'moveForward1';
            case 's':
                return 'moveBackward1';
            case 'a':
                return 'moveLeft';
            case 'd':
                return 'moveRight';
            case 'q':
                return 'moveUp';
            case 'e':
                return 'moveDown';
            default:
                return undefined;
        }
    }
    /**
    * 销毁键盘漫游事件
    */
    quit() {
        document.removeEventListener('keydown', this.down, false);
        document.removeEventListener('keyup', this.up, false);
        V.clock.onTick.removeEventListener(funcTick);
        // 解除禁用鼠标移动地图事件
        V.scene.screenSpaceCameraController.enableTranslate = true;
        // 解除视图锁定事件。
        V.scene.screenSpaceCameraController.enableTilt = true;
    }
}
export default keyboardRoam