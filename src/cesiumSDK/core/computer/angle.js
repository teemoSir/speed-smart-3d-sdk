/**
* 计算夹角类
*/
class computerAngle {
    /**
    * 计算两个点坐标之间的直线与正北方向之间的夹角
    * @param {Array} [p] -两个坐标经纬度高程坐标数组
    * @return {Array} -返回两个数组元素，1.两个点坐标之间的直线与正北方向之间的夹角；2.两个坐标之间的直线距离
    */
    angle(p) {
        let A = Cesium.Cartesian3.fromDegrees(p[0], p[1]);
        let B = Cesium.Cartesian3.fromDegrees(p[3], p[4]);
        let ab = Cesium.Cartesian3.distance(A, B);
        //以a点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
        const localToWorld = Cesium.Transforms.eastNorthUpToFixedFrame(
            new Cesium.Cartesian3.fromDegrees(p[0], p[1])
        );
        //求世界坐标到局部坐标的变换矩阵
        const worldToLocal = Cesium.Matrix4.inverse(
            localToWorld,
            new Cesium.Matrix4()
        );
        //A点在局部坐标的位置，其实就是局部坐标原点
        const localPosition_A = Cesium.Matrix4.multiplyByPoint(
            worldToLocal,
            new Cesium.Cartesian3.fromDegrees(p[0], p[1]),
            new Cesium.Cartesian3()
        );
        //B点在以A点为原点的局部的坐标位置
        const localPosition_B = Cesium.Matrix4.multiplyByPoint(
            worldToLocal,
            new Cesium.Cartesian3.fromDegrees(p[3], p[4]),
            new Cesium.Cartesian3()
        );
        //弧度
        const angle = Math.atan2(
            localPosition_B.x - localPosition_A.x,
            localPosition_B.y - localPosition_A.y
        );
        //角度
        let theta = angle * (180 / Math.PI);
        if (theta < 0) {
            theta = theta + 360;
        }
        return [theta, ab];
    }
}
export default computerAngle