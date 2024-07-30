import Video3D from './Video3D.js';
import * as Cesium from "cesium";


class VideoProjection {
    /**
    * 视频投影
    * @param {Viewer} [viewer] 地图viewer实例
    * @param {Object} [params] 投影参数
    */
    constructor(viewer, params) {
        this.viewer = viewer;
        this.params = params;
        this.video3D = new Video3D(this.viewer, JSON.parse(JSON.stringify(this.params)));
    }

    /**
    * 重置投影相机位置
    * @description  重置投影相机位置
    */
    resetCamera() {
        let camera = this.video3D.viewShadowMap._lightCamera;
        console.log(JSON.parse(JSON.stringify(camera.position)), camera.heading, camera.pitch, camera.roll);
        this.viewer.camera.flyTo({
            destination: camera.position,
            orientation: new Cesium.HeadingPitchRoll(camera.heading, camera.pitch, camera.roll),
            duration: 1,
        });
    }
    /**
    * @description  投影显隐
    * @param {Boolean} isShow - 投影显隐
    * @private
    */
    setShow(isShow) {
        this.video3D.show = isShow;
    }
    /**
    * @description  视椎框线显隐
    * @param {Boolean} isShow - 视椎框线显隐
    */
    setShowDebugFrustum(isShow) {
        this.video3D.debugFrustum = isShow;
    }
    /**
    * @description   投影位置
    * @param {Number} x - 垂直方向翻转
    * @param {Number} y - 水平方向旋转
    */
    changeRotation(x, y) {
        this.video3D._changeRotation({
            x,
            y
        })
    }
    /**
    * @description  投影张角
    * @param {Number} v - 张角
    */
    changeFov(v) {
        this.video3D.fov = v
    }
    /**
    * @description  视频透明度
    * @param {Number} v - 视频透明度
    */
    changeAlpha(v) {
        this.video3D.alpha = v
    }
    /**
    * @description  销毁视频投影
    */
    destroy() {
        this.setShow(false);
        this.video3D.destroy();
    }

}
export default VideoProjection;