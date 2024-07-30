import * as Cesium from 'cesium';

let boxNum = 0;
/**
* 立方体实体
*/
class BoxGraphics {
    /**
    *加载方法
    * @param {Object} parameter -实体默认配置项                       
    * @param {Array} parameter.clickPointH -立方体底面矩形对角线线段两点的坐标数组
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {Boolean}[parameter.outline] -控制边框线条是否显示,默认显示
    * @param {String}[parameter.outlineColor] -控制边框线条颜色,默认16进制'#e74032'
    * @param {Number}[parameter.outlineWidth] -控制边框线条宽度
    * @param {Object}[parameter.shadows] -实体投影和阴影显示方式
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @return {Cesium.Entity} -返回立方体实体
    */
    draw(parameter) {
        let xy = parameter.clickPointH;
        let v = parameter.viewer;
        let id = '立方体' + (boxNum == 0 ? '' : boxNum);
        let A = Cesium.Cartesian3.fromDegrees(xy[0], xy[1]);
        let B = Cesium.Cartesian3.fromDegrees(xy[3], xy[4]);
        let C = Cesium.Cartesian3.fromDegrees(xy[3], xy[1]);
        let AC = Cesium.Cartesian3.distance(A, C);
        let BC = Cesium.Cartesian3.distance(B, C);
        let show = parameter.show == undefined ? true : parameter.show;
        var box = new Cesium.Entity({
            id,
            show,
            position: Cesium.Cartesian3.fromDegrees((xy[0] + xy[3]) / 2, (xy[1] + xy[4]) / 2,
                (xy[2] + (parameter.elevation!=undefined?parameter.elevation: 0) + (parameter.height || 20)) / 2),  //从以度为单位的经度和纬度值返回Cartesian3位置。
            box: {
                dimensions: new Cesium.Cartesian3(AC, BC, parameter.height || 20), //x,y,z轴的分量
                outline: parameter.outline == undefined ? true : parameter.outline, //控制边框线条
                outlineColor: parameter.outlineColor || '#e74032', //边框线条颜色
                outlineWidth: parameter.outlineWidth || 1,
                // DISABLED	对象不投射或接收阴影；ENABLED	对象投射并接收阴影；CAST_ONLY	对象仅投射阴影；RECEIVE_ONLY 该对象仅接收阴影。
                shadows: parameter.shadows || Cesium.ShadowMode.DISABLED,
                material: new Cesium.CheckerboardMaterialProperty({  //映射到棋盘
                    evenColor: Cesium.Color.WHITE, //默认白色，棋盘第一个颜色
                    oddColor: Cesium.Color.BLACK,  //默认黑色，棋盘第二个颜色
                    repeat: new Cesium.Cartesian2(4, 4) //x，y方向重复次数
                }),
            }
        });
        boxNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(box);
        if (parameter.zoomTo == undefined ? false : parameter.zoomTo) { v.zoomTo(box) };
        return box;
    }
}
const Box = new BoxGraphics();
export function drawBox(a) {
    let box = Box.draw(a);
    return box;
}