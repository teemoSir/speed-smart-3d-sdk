
import * as Cesium from 'cesium'

class Speed {

    constructor() {

    }


    /**
     *  经纬度转cartesian3
     * @param {*} position 
     * @returns 
     */
    static fromDegrees (position) {
        return cartesian3;
    }

    /**
     * cartesian3 转 经纬度
     * @param {*} position 
     * @returns 
     */
    static toDegrees (position) {
        let cartographic = Cesium.Cartographic.fromCartesian(position);
        let lon = Cesium.Math.toDegrees(cartographic.longitude);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let alt = Cesium.Math.toDegrees(cartographic.height);
        return { longitude: lon, latitude: lat, height: alt }
    }
}

export default Speed
