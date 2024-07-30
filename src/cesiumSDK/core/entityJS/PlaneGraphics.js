import * as Cesium from 'cesium';

import computerAngle from '@/cesiumSDK/core/computer/angle';
let myAngle = new computerAngle();
let planeNum = 0;
/**
* Entity平面实体
*/
class PlaneGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项                       
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Array} parameter.clickPointH -平面实体的坐标数组
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Number} [parameter.radius] -平面实体长度(单位：米)
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {Number} [parameter.rotation] -平面绕北方顺时针旋转的角度，非负数(不绘制加载时必选)
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @return {Cesium.Entity} -返回平面实体
    */
    draw(parameter) {
        let xy = parameter.clickPointH;
        let v = parameter.viewer;
        let l = parameter.radius;
        let id = '平面实体' + (planeNum == 0 ? '' : planeNum);
        let position = Cesium.Cartesian3.fromDegrees((xy[0] + xy[3]) / 2, (xy[1] + xy[4]) / 2, xy[2] + (parameter.elevation!=undefined?parameter.elevation: 0)+(parameter.height || 20)/2);
        // entity平面正东方为0度，顺时针为正方向
        let rotation = (parameter.rotation||-1) >= 0 ? Cesium.Math.toRadians((parameter.rotation||-1) - 90) : Cesium.Math.toRadians(myAngle.angle(xy)[0] - 90);
        let show = parameter.show == undefined ? true : parameter.show;
        let plane = new Cesium.Entity({
            id,
            position,
            plane: {
                show,
                // 用于指定平面的法线和距离
                plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0),
                dimensions: new Cesium.Cartesian2(l, parameter.height || 20),
                material: require('../../../assets/entitypng/fj.jpg'),
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
        planeNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(plane);
        if (parameter.zoomTo ==undefined ? false : parameter.zoomTo) { v.zoomTo(plane) };
        return plane;
    }
}
const Plane = new PlaneGraphics();
export function drawPlane(a) {
    let plane = Plane.draw(a);
    return plane;
}