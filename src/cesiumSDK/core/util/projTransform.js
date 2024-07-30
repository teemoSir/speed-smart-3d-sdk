import proj4 from 'proj4';
/*
 * EPSG标准坐标投影转换
 */

class ProjTransform {
    /**
     * 笛卡尔坐标转WGS84
     * @param {String} fromProjection 输入空间投影
     * @param {String} toProjection 输出空间投影
     * @param {object} position 坐标
     * @returns {object} toProjection 坐标
     */
    static SSConvert (fromProjection, toProjection, position) {

        return proj4(fromProjection, toProjection, position)
    }

}

export default ProjTransform;
