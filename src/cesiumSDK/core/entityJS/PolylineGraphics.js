import * as Cesium from 'cesium';

/**
* Entity线段实体
*/
class PolylineGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项                       
    * @param {Object} cs -自定义参数
    * @param {String} cs.id -唯一标识符，‘entity线+序列号’
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {Cesium.Color}[parameter.LineColor] -实体颜色，默认红色
    * @param {Array}[cs.polylinePointArray] -线段实体的经纬度高程位置坐标数组
    * @param {Boolean}[parameter.clampToGround] -线实体是否紧贴地面，默认true
    * @param {Number}[parameter.polylineWidth] 线实体宽度，默认10米
    * @return {Cesium.Entity} -返回线段实体
    */
    draw(parameter, cs) {
        let v = parameter.viewer;
        let show = parameter.show == undefined ? true : parameter.show;
        let polyline = new Cesium.Entity(({
            id: cs.id,
            name: "线段",
            polyline: {
                show,
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(cs.polylinePointArray),
                width: cs.i ? 1 : (parameter.polylineWidth || 10),
                // 是否紧贴地面
                clampToGround: parameter.clampToGround || true,
                material: cs.i ? '' : (parameter.LineColor || Cesium.Color.RED),
            },
        })
        );
        // polylineNum++;
        v.entities.add(polyline);
        if (parameter.zoomTo ==undefined ? false : parameter.zoomTo) {
            v.zoomTo(polyline);
        };
        return polyline;
    }
}
const Polyline = new PolylineGraphics();
export function drawPolyline(a, b) {
    let polyline = Polyline.draw(a, b);
    return polyline;
}