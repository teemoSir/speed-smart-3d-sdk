import * as Cesium from 'cesium'

let polylineVolumeNum = 0;
/**
* 管线实体类
*/
class PolylineVolumeGraphics {
    /**
    * 加载方法
    * @param {Object} parameter -实体默认配置项                       
    * @param {Array} parameter.clickPointH -管线实体的坐标数组
    * @param {Cesium.Viewer} parameter.viewer -地图主窗口
    * @param {Boolean}[parameter.show] -是否显示实体 ，默认为true
    * @param {Boolean} [parameter.zoomTo] -绘制完毕是否缩放至实体,默认不缩放至实体
    * @param {Number}[parameter.gxWidth] -管线实体半径，默认值1000米
    * @param {Cesium.Color}[parameter.entityColor] -16进制实体颜色，默认16进制#007acc
    * @return {Cesium.Entity} -返回管线实体
    */
    draw(parameter) {
        let xy = parameter.clickPointH;
        let v = parameter.viewer;
        let id = '管线实体' + (polylineVolumeNum == 0 ? '' : polylineVolumeNum);
        let show = parameter.show == undefined ? true : parameter.show;
        let polylineVolume = new Cesium.Entity({
            id,
            polylineVolume: {
                show,
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(xy),
                // 指定 Cartesian2 位置的数组，这些位置定义了要拉伸的形状
                shape: this.computeCircle(parameter.gxWidth || 1000),
                // 使用六边形
                // shape: [
                //     new Cesium.Cartesian2(-10000, 0),
                //     new Cesium.Cartesian2(10000, 0),
                //     new Cesium.Cartesian2(20000, 17340),
                //     new Cesium.Cartesian2(0, 37340),
                //     new Cesium.Cartesian2(-20000, 17340)
                // ],
                material: Cesium.Color.fromCssColorString(parameter.entityColor||'#007acc'),
            }
        })
        polylineVolumeNum++;
        // 添加实体时新增删除下来列表，视图缩放至实体
        v.entities.add(polylineVolume);
        if (parameter.zoomTo ==undefined ? false : parameter.zoomTo) { v.zoomTo(polylineVolume) };
        return polylineVolume;
    }
    computeCircle(radius) {
        var positions = [];
        for (var i = 0; i < 360; i++) {
            var radians = Cesium.Math.toRadians(i);
            positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
        }
        return positions;
    }
}
const PolylineVolume = new PolylineVolumeGraphics();
export function drawPolylineVolume(a) {
    let polylineVolume = PolylineVolume.draw(a);
    return polylineVolume;
}