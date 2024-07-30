import * as Cesium from 'cesium';
import computerAngle from '@/cesiumSDK/core/computer/angle';

let myAngle = new computerAngle();
let ellipsoidNum = 0;
/**
* 椭球体实体
*/
class EllipsoidGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项                       
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Array} parameter.clickPointH -椭球体长半轴线段两点的坐标数组
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Number} [parameter.radius] -椭球体长半轴半径(单位：米)
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {Number} [parameter.rotation] -椭球体绕北方顺时针旋转的角度，非负数(不绘制加载时必选)
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.sortR] -椭球体短半轴半径(单位：米)，短半轴默认为长半轴的一半
    * @param {Number}[parameter.heightR] -椭球体高度(单位：米)，默认为长半轴
    * @param {Cesium.Color}[parameter.entityColor] -16进制实体颜色，默认16进制#007acc
    * @param {Cesium.HeightReference} [parameter.heightClamp] -相对于地形的位置，默认固定在地形上；NONE 位置绝对；CLAMP_TO_GROUND 位置固定在地形上；RELATIVE_TO_GROUND 位置高度是指地形上方的高度。
    * @return {Cesium.Entity} -返回椭球体实体
    */
    draw(parameter) {
        let xy = parameter.clickPointH;
        let v = parameter.viewer;
        let r = parameter.radius;
        let id = '椭球体' + (ellipsoidNum == 0 ? '' : ellipsoidNum);
        let sortR = parameter.sortR ? parameter.sortR : (r / 2);
        let heightR = parameter.heightR ? parameter.heightR : (r / 2);
        let position = Cesium.Cartesian3.fromDegrees(xy[0], xy[1], xy[2] + heightR / 2 + (parameter.elevation!=undefined?parameter.elevation: 0));
        // entity椭球体正东方为0度，顺时针为正方向
        let rotation = (parameter.rotation || -1) >= 0 ? ((parameter.rotation || -1) - 90) : (myAngle.angle(xy)[0] - 90);
        let show = parameter.show == undefined ? true : parameter.show;
        let ellipsoid = new Cesium.Entity({
            id,
            show,
            position,
            ellipsoid: {
                radii: new Cesium.Cartesian3(r, sortR, heightR / 2),
                // 随机颜色材质
                material: Cesium.Color.fromCssColorString(parameter.entityColor || '#007acc'),
               heightReference: parameter.heightClamp!= undefined ?parameter.heightClamp :Cesium.HeightReference.CLAMP_TO_GROUND,

            },
            orientation: Cesium.Transforms.headingPitchRollQuaternion(
                position,
                new Cesium.HeadingPitchRoll(
                    Cesium.Math.toRadians(rotation),
                    Cesium.Math.toRadians(0),
                    Cesium.Math.toRadians(0)
                )
            ),
        });
        ellipsoidNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(ellipsoid);
        if (parameter.zoomTo == undefined ? false : parameter.zoomTo) { v.zoomTo(ellipsoid) };
        return ellipsoid;
    }
}
const Ellipsoid = new EllipsoidGraphics();
export function drawEllipsoid(a) {
    let ellipsoid = Ellipsoid.draw(a);
    return ellipsoid;
}