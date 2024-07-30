import * as Cesium from 'cesium';

let pointNum = 0;
/**
* Entity点实体
*/
class PointGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项                       
    * @param {Number} x -点实体的经度坐标
    * @param {Number} y -点实体的纬度坐标
    * @param {Number} z -广告牌实体下地表的高程
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {String}[parameter.entityColor] -16进制实体颜色，默认16进制'#007acc'
    * @param {Number}[parameter.elevation] -实体底部距离地平面或模型的高度 ，默认为0米    
    * @param {Number}[parameter.pixelSize] -点实体的像素大小   
    * @param {String}[parameter.outlineColor] -控制边框线条颜色,默认16进制'#e74032'
    * @param {Number}[parameter.outlineWidth] -控制边框线条宽度
    * @return {Cesium.Entity} -返回点实体
    */
    draw(parameter, x, y, z) {
        let v = parameter.viewer;
        let id = '点' + (pointNum == 0 ? '' : pointNum);
        let show = parameter.show == undefined ? true : parameter.show;
        var point = new Cesium.Entity({
            id,
            position: Cesium.Cartesian3.fromDegrees(x, y, z + (parameter.elevation != undefined ? parameter.elevation : 0)),
            point: {
                show,
                // 像素大小
                pixelSize: parameter.pixelSize || 10,
                color: Cesium.Color.fromCssColorString(parameter.entityColor || '#007acc'),
                outlineColor: Cesium.Color.fromCssColorString(parameter.outlineColor || '#e74032'),
                outlineWidth: parameter.outlineWidth || 1,
            },
        });
        pointNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(point);
        if (parameter.zoomTo == undefined ? false : parameter.zoomTo) {
            v.zoomTo(point);
        };
        return point;
    }
}
const billBoard = new PointGraphics();
export function darwPoint(a, x, y, z) {
    let point = billBoard.draw(a, x, y, z);
    return point;
}