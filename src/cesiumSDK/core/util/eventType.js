import * as Cesium from 'cesium'
import Speed from '../speed';
/**
 * 事件类型
 */
class EventType extends Speed {
    /**
    * 左键点击事件
     * @static
      * @memberof EventType
      */
    /**
     * 点模式
      * @static
     * @memberof EventType
     */
    static LEFT_CLICK = Cesium.ScreenSpaceEventType.LEFT_CLICK;
    /**
     * 鼠标移动事件
      * @static
      * @memberof EventType
      */
    static MOUSE_MOVE = Cesium.ScreenSpaceEventType.MOUSE_MOVE;
    /**
     * 左键双击事件
      * @static
      * @memberof EventType
      */
    static LEFT_DOUBLE_CLICK = Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK;
    /**
     * 左键按下事件
      * @static
      * @memberof EventType
      */
    static LEFT_DOWN = Cesium.ScreenSpaceEventType.LEFT_DOWN;
    /**
     * 左键弹起事件
      * @static
      * @memberof EventType
      */
    static LEFT_UP = Cesium.ScreenSpaceEventType.LEFT_UP;
    /**
     * 中键单击事件
      * @static
      * @memberof EventType
      */
    static MIDDLE_CLICK = Cesium.ScreenSpaceEventType.MIDDLE_CLICK;
    /**
     * 中健按下事件
      * @static
      * @memberof EventType
      */
    static MIDDLE_DOWN = Cesium.ScreenSpaceEventType.MIDDLE_DOWN;
    /**
     * 中键弹起事件
      * @static
      * @memberof EventType
      */
    static MIDDLE_UP = Cesium.ScreenSpaceEventType.MIDDLE_UP;
    /**
     * 右键单击事件
      * @static
      * @memberof EventType
      */
    static RIGHT_CLICK = Cesium.ScreenSpaceEventType.RIGHT_CLICK;
    /**
     * 右键按下事件
      * @static
      * @memberof EventType
      */
    static RIGHT_DOWN = Cesium.ScreenSpaceEventType.RIGHT_DOWN;
    /**
     * 右键弹起事件
      * @static
      * @memberof EventType
      */
    static RIGHT_UP = Cesium.ScreenSpaceEventType.RIGHT_UP;
    /**
     * 滚轮事件
      * @static
      * @memberof EventType
      */
    static WHEEL = Cesium.ScreenSpaceEventType.WHEEL;


}
export default EventType;