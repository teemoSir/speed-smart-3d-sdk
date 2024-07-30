import * as Cesium from 'cesium'

let rectangleNum = 0;
/**
* 矩形实体
*/
class RectangleGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项
    * @param {Array} parameter.clickPointH -矩形对角线线段两点的坐标数组
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米
    * @param {Number}[parameter.height] -实体拉伸高度，默认为20米
    * @param {Cesium.HeightReference} [parameter.heightClamp] -相对于地形的位置，默认固定在地形上；NONE 位置绝对；CLAMP_TO_GROUND 位置固定在地形上；RELATIVE_TO_GROUND 位置高度是指地形上方的高度。
    * @return {Cesium.Entity} -返回矩形实体
    */
    draw(parameter) {
        let v = parameter.viewer;
        let xy = parameter.clickPointH;
        let x = Math.min(xy[3], xy[0]);
        let y = Math.min(xy[1], xy[4]);
        let x1 = Math.abs(xy[3] - xy[0]);
        let y1 = Math.abs(xy[4] - xy[1]);
        let id = '矩形实体' + (rectangleNum == 0 ? '' : rectangleNum);
        let height = parameter.height || 20;
        let elevation = (parameter.elevation != undefined ? parameter.elevation : 0);
        let show = parameter.show == undefined ? true : parameter.show;
        let rectangle = new Cesium.Entity({
            id,
            rectangle: {
                show,
                coordinates: Cesium.Rectangle.fromDegrees(x, y, x + x1, y + y1),
                height: elevation + xy[2],
                extrudedHeight: elevation + height + xy[2],
                material: require('../../../assets/entitypng/fj.jpg'),
               heightReference: parameter.heightClamp!= undefined ?parameter.heightClamp :Cesium.HeightReference.CLAMP_TO_GROUND,

            }
        });
        rectangleNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(rectangle);
        if (parameter.zoomTo == undefined ? false : parameter.zoomTo) { v.zoomTo(rectangle) };
        return rectangle;
    }
}
const Rectangle = new RectangleGraphics();
export function drawRectangle(a) {
    let rectangle = Rectangle.draw(a);
    return rectangle;
}