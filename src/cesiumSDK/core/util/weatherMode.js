
import Speed from '../speed';


/**
 * 特效类型
 */
class WeatherMode extends Speed {
    /**
    * 下雨
    * @static
    * @memberof WeatherMode
    */
    static RAIN = 1;
    /**
    * 下雪
    * @static
    * @memberof WeatherMode
    */
    static SNOW = 2;
    /**
    * 雾天
    * @static
    * @memberof WeatherMode
    */
    static FOG = 3;
    /**
    * 地面积雪
    * @static
    * @memberof WeatherMode
    */
    static SNOWCOVER = 4;
    /**
    * 云
    * @static
    * @memberof WeatherMode
    */
    static CLOUD = 5;

    /**
    * 雷电
    * @static
    * @memberof WeatherMode
    */
    static THUNDER = 6;
}

export default WeatherMode;