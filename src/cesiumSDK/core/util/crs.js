import Speed from '../speed';
import proj4 from 'proj4';
/**
 * 投影类型
 * 
 * @example
 * 
 * // EPSG_3857
 * Speed.CRS.EPSG_3857
 * 
 * // EPSG_3857
 * Speed.CRS.EPSG_3857
 * 
 * // EPSG_3857
 * Speed.CRS.EPSG_3857
 * 
 * // EPSG_3857
 * Speed.CRS.EPSG_3857
 * 
 * // EPSG_3857
 * Speed.CRS.EPSG_3857
 * 
 * // EPSG_3857
 * Speed.CRS.EPSG_3857
 * 
 * // EPSG_3857
 * Speed.CRS.EPSG_3857
 * 
 * // EPSG_3857
 * Speed.CRS.EPSG_3857
 */
class CRS extends Speed {
    /**
      * EPSG:3857
      * @static
      * @memberof CRS
      */
    static EPSG_3857 =  "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs"
    /**
     * EPSG:900913
     * @static
     * @memberof CRS
     */
    static EPSG_900913 = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs"
    /**
     * EPSG:3785
     * @static
     * @memberof CRS
     */
    static EPSG_3785 =  "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs"
    /**
     * EPSG:102113
     * @static
     * @memberof CRS
     */
    static ESRI_102113 =  "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs"

    /**
    * EPSG:4326
    * @static
    * @memberof CRS
    */
    static EPSG_4326 = "+proj=longlat +datum=WGS84 +no_defs +type=crs"
    /**
    * EPSG:4490 CGC2000 经纬度
    * @static
    * @memberof CRS
    */
    static EPSG_4490 = "+proj=longlat +ellps=GRS80 +no_defs +type=crs"
    /**
    * EPSG:4479 CGC2000 平面
    * @static
    * @memberof CRS
    */
    static EPSG_4479 =  "+proj=geocent +ellps=GRS80 +units=m +no_defs +type=crs"
    /**
    * EPSG:4214 北京1954坐标系
    * @static
    * @memberof CRS
    */
    static EPSG_4214 = "+proj=longlat +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +no_defs +type=crs"
    /**
    *  EPSG:4610 西安1980坐标系
    * @static
    * @memberof CRS
    */
    static EPSG_4610 = "+proj=longlat +ellps=IAU76 +no_defs +type=crs"
    /**
    * EPSG:4546  CGCS2000 / 3-degree Gauss-Kruger CM 111E
    * @static
    * @memberof CRS
    */
    static EPSG_4546 = "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs"
     /**
    * EPSG:4549  CGCS2000 / 3-degree Gauss-Kruger CM 120E
    * @static
    * @memberof CRS
    */
     static EPSG_4549 = "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs"
}

export default CRS;