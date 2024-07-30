import * as Cesium from 'cesium'

let cylinderNum = 0;
/**
* 圆柱/圆锥实体
*/
class CylinderGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项                       
    * @param {Number} i -判断是否为圆锥，i等于true则上底面半径为0，i等于false则上底面半径等于下底面半径
    * @param {Array} parameter.clickPointH -底面圆点的坐标数组
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Number} [parameter.radius] -下底面圆的半径(单位：米)
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {Cesium.Color}[parameter.entityColor] -实体颜色，默认16进制#007acc
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @param {Number}[parameter.numberOfVerticalLines] -沿轮廓的周长绘制的垂直线的数量，数量越多越圆滑，默认20条
    * @param {Cesium.HeightReference} [parameter.heightClamp] -相对于地形的位置，默认固定在地形上；NONE 位置绝对；CLAMP_TO_GROUND 位置固定在地形上；RELATIVE_TO_GROUND 位置高度是指地形上方的高度。
    * @return {Cesium.Entity} -返回圆柱/圆锥实体
    */
    draw(parameter, i) {
        let xy = parameter.clickPointH;
        let l = parameter.radius;
        let v = parameter.viewer;
        let id = '圆柱体' + (cylinderNum == 0 ? '' : cylinderNum);
        let show = parameter.show == undefined ? true : parameter.show;
        let cylinder = new Cesium.Entity({
            id,
            show,
            position: Cesium.Cartesian3.fromDegrees(xy[0], xy[1], xy[2] + (parameter.elevation != undefined ? parameter.elevation : 0) + (parameter.height || 20) / 2),
            cylinder: {
                topRadius: i ? 0 : l,
                bottomRadius: l,
                length: parameter.height || 20,
                // 沿轮廓的周长绘制的垂直线的数量
                numberOfVerticalLines: parameter.numberOfVerticalLines || 20,
                material: new Cesium.ImageMaterialProperty({
                    color: Cesium.Color.fromCssColorString(parameter.entityColor || '#007acc'),
                }),
               heightReference: parameter.heightClamp!= undefined ?parameter.heightClamp :Cesium.HeightReference.CLAMP_TO_GROUND,

            }
        });
        cylinderNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(cylinder);
        if (parameter.zoomTo == undefined ? false : parameter.zoomTo) {
            v.zoomTo(cylinder)
        };
        return cylinder;
    }
}
const Cylinder = new CylinderGraphics();
export function drawCylinder(a, i) {
    let cylinder = Cylinder.draw(a, i);
    return cylinder;
}


