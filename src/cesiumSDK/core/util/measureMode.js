import Speed from '../speed';


/**
 * 测量模式
 * 
 * @example
 * 
 * // 坐标捕获模式
 * Speed.MeasureMode.POSITION
 * 
 * // 方位捕获模式
 * Speed.MeasureMode.AZINUTH
 * 
 * // 贴地距离捕获模式
 * Speed.MeasureMode.GROUND_DISTANCE
 * 
 * // 空间距离捕获模式
 * Speed.MeasureMode.SPACE_DISTANCE
 * 
 * // 贴地面积捕获模式
 * Speed.MeasureMode.GROUND_AREA
 * 
 * // 空间面积捕获模式
 * Speed.MeasureMode.SPACE_AREA
 * 
 * // 高差捕获模式
 * Speed.MeasureMode.HEIGHT_DIFFERENCE
 * 
 * // 三角测量模式
 * Speed.MeasureMode.TRIANGLE_DISTANCE
 */
class MeasureMode extends Speed {
    /**
      * 坐标测量
      * @static
      * @memberof MeasureMode
      */
    static POSITION = 0
    /**
    * 方位角
    * @static
    * @memberof MeasureMode
    */
    static AZINUTH = 1
    /**
    * 贴地距离
    * @static
    * @memberof MeasureMode
    */
    static GROUND_DISTANCE = 2
    /**
    * 空间距离
    * @static
    * @memberof MeasureMode
    */
    static SPACE_DISTANCE = 3
    /**
    * 贴地面积
    * @static
    * @memberof MeasureMode
    */
    static GROUND_AREA = 4
    /**
    * 空间面积
    * @static
    * @memberof MeasureMode
    */
    static SPACE_AREA = 5
    /**
    * 高差测量
    * @static
    * @memberof MeasureMode
    */
    static HEIGHT_DIFFERENCE = 6

    /**
    * 三角测量
    * @static
    * @memberof MeasureMode
    */
    static TRIANGLE_DISTANCE = 7
}

export default MeasureMode;