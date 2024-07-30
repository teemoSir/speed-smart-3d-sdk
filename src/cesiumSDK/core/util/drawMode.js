
import Speed from '../speed';

class DrawMode extends Speed {
    /**
      * 点模式
      * @static
      * @memberof DrawMode
      */
    static POINT = 0
    /**
    * 线模式
    * @static
    * @memberof DrawMode
    */
    static POLYLINE = 1
    /**
    * 多边形模式
    * @static
    * @memberof DrawMode
    */
    static POLYGON = 2
    /**
    * 标记模式
    * @static
    * @memberof DrawMode
    */
    static MARKER = 3
}

export default DrawMode;