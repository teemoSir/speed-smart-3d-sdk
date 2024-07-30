import * as Cesium from "cesium";
let mapPosition;
/**
* 模型点击事件
*/
class modelClick {
    /**
    * 构造函数
    * @param {Cesium.Viewer} v -cesium的viewer对象
    */
    constructor(v) {
        this.viewer = v;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }
    /**
    * @member {Cesium.Viewer} - cesium的viewer对象
    * @memberof Visible
    */
    viewer;

    /**
     * @member {Cesium.ScreenSpaceEventHandler} - 事件实例
     * @memberof Visible
     */
    handler;
    /**
    * 鼠标事件对象，成员包括:
    LEFT_DOWN:鼠标左键按下事件;
    LEFT_UP:鼠标左键弹起事件;
    LEFT_CLICK:鼠标左键点击事件;
    LEFT_DOUBLE_CLICK:鼠标左键双击事件;
    RIGHT_DOWN:鼠标右键按下事件;
    RIGHT_UP:鼠标右键弹起事件;
    RIGHT_CLICK:鼠标右键单击事件;
    MIDDLE_DOWN :鼠标中键按下事件;
    MIDDLE_UP:鼠标中键弹起事件;
    MIDDLE_CLICK:鼠标中键点击事件;
    MOUSE_MOVE:鼠标移动事件;
    WHEEL:鼠标滚轮滚动事件;
    PINCH_START	表示触控屏上双指开始事件;
    PINCH_END:触控屏上双指结束事件;
    PINCH_MOVE:触控屏上双指移动事件;
    */
static EventType  = Cesium.ScreenSpaceEventType
/**
* 鼠标获取坐标方法
* @param {terrainModelClick.EventType} type -鼠标事件类型
    * @param {Function} callback - 回调方法，内置参数：mapPosition对象，mapPosition.x:经度,mapPosition.y:纬度,mapPosition.z:高度,mapPosition.description:描述信息,
    */
    click(type, callback) {
        let viewer = this.viewer;
        this.handler.setInputAction(function (clickEvent) {
            mapPosition = {};
            let position = clickEvent.position;
            let pick = viewer.scene.pickPosition(position);
            // 获取模型对象
            let pickModel = viewer.scene.pick(position);
            if (pickModel && pick) {
                // 笛卡尔坐标系转为经纬度（弧度）坐标
                let height = Cesium.Cartographic.fromCartesian(pick).height;
                let lat = Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(pick).latitude);
                let lng = Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(pick).longitude);
                mapPosition = {
                    x: lng,
                    y: lat,
                    z: height,
                    description: '模型坐标',
                };
            }
            callback(mapPosition);
        }, type);
    }
    /**
    * 鼠标获取坐标事件的销毁方法
    * @param {Cesium.ScreenSpaceEventType} type -鼠标事件类型
    */
    remove(type) {
        this.handler.removeInputAction(type);
    }
}
export default modelClick