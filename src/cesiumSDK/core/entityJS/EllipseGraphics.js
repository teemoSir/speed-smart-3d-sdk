import * as Cesium from 'cesium';
import computerAngle from '@/cesiumSDK/core/computer/angle';

let myAngle = new computerAngle();
let ellipseNum = 0;
let extrudedHeight;
let height;
/**
* 椭圆/圆形实体
*/
class EllipseGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项                       
    * @param {Number} i -判断是否为圆形，i等于1则短半径等于长半径，i等于0则短半径等于长半径的一半
    * @param {Array} parameter.clickPointH -椭圆长半轴线段两点的坐标数组
    * @param {Number} parameter.radius -椭圆或圆形长半轴半径(单位：米)
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Cesium.Viewer} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {Number} [parameter.rotation] -椭圆绕北方顺时针旋转的角度，非负数(不绘制加载时必选)
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @param {Number}[parameter.sortR] -椭圆短半轴半径(单位：米)，短半轴默认为长半轴的一半
    * @param {Cesium.Color}[parameter.entityColor] -实体颜色，默认16进制#007acc
    * @param {Number}[parameter.numberOfVerticalLines] -沿轮廓的周长绘制的垂直线的数量，数量越多越圆滑，默认20条
    * @param {Cesium.HeightReference} [parameter.heightClamp] -相对于地形的位置，默认固定在地形上；NONE 位置绝对；CLAMP_TO_GROUND 位置固定在地形上；RELATIVE_TO_GROUND 位置高度是指地形上方的高度。
    * @return {Cesium.Entity} -返回椭圆/圆形实体
    */
    draw(parameter, i) {
        let xy = parameter.clickPointH;
        let l = parameter.radius;
        let v = parameter.viewer;
        let id = '椭圆面' + (ellipseNum == 0 ? '' : ellipseNum);
        var semiMinorAxis = i ? l : (parameter.sortR ? parameter.sortR : (l / 2));
        let height1 = parameter.height || 20;
        let elevation = (parameter.elevation!=undefined?parameter.elevation: 0);
        if ((parameter.heightClamp || Cesium.HeightReference.CLAMP_TO_GROUND) === Cesium.HeightReference.CLAMP_TO_GROUND) {
            extrudedHeight = height1 + elevation;
            height = elevation;
        } else {
            extrudedHeight = height1 + elevation + xy[2];
            height = elevation + xy[2];
        };
        let position = Cesium.Cartesian3.fromDegrees(xy[0], xy[1]);
        // entity椭圆面正东方为0度，逆时针为正方向
        let rotation = (parameter.rotation || -1) >= 0 ? Cesium.Math.toRadians(90 - (parameter.rotation || -1)) : Cesium.Math.toRadians(90 - myAngle.angle(xy)[0]);
        let show = parameter.show == undefined ? true : parameter.show;
        var ellipse = new Cesium.Entity({
            id,
            show,
            position,
            ellipse: {
                semiMajorAxis: l, // 长半轴距离
                semiMinorAxis, // 短半轴距离
                extrudedHeight,
                height,
                rotation,//旋转角
                numberOfVerticalLines: parameter.numberOfVerticalLines || 20, // 沿轮廓的周长绘制的垂直线的数量
                material: new Cesium.ImageMaterialProperty({
                    color: Cesium.Color.fromCssColorString(parameter.entityColor || '#007acc'),
                }),
               heightReference: parameter.heightClamp!= undefined ?parameter.heightClamp :Cesium.HeightReference.CLAMP_TO_GROUND,

            },
        });
        ellipseNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(ellipse);
        if (parameter.zoomTo == undefined ? false : parameter.zoomTo) { v.zoomTo(ellipse) };
        return ellipse;
    }
}
const Ellipse = new EllipseGraphics();
export function drawEllipse(a, i) {
    let ellipse = Ellipse.draw(a, i);
    return ellipse;

}